import {
  Button,
  Flex,
  SegmentedControlRoot,
  SegmentedControlItem,
  TextField
} from '@bichon/ds';
import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect, useCallback } from 'react';
import { Info } from 'lucide-react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { getAccountMeQueryOptions } from '@/query/options/account';
import {
  detailInputPageFormSchema,
  type DetailInputPageForm
} from '@/schema/main/detailInput';
import { DETAIL_INPUT_FIELDS } from '@/constants/detailInput.constant';
import { StyledFunnelContentWrapper } from '@/routes/_authenticated/f/-route.style';
import AIReviewerMode from '@/routes/_authenticated/f/prompt/-components/AIReviewerMode/AIReviewerMode';
import {
  StyledStepHeader,
  StyledTemplateName,
  StyledStepSubtitle,
  StyledInfoBanner,
  StyledToggleWrapper,
  StyledPromptFooter
} from '@/routes/_authenticated/f/prompt/-prompt.style';

type PromptMode = 'idea' | 'aiReviewer';

const FUNNEL_STORAGE_KEY = 'f-funnel-data';

const DEFAULT_DETAIL_INPUT: DetailInputPageForm = {
  problem: '',
  solution: '',
  target: '',
  competitor: '',
  market: '',
  traction: '',
  strategy: '',
  businessModel: '',
  milestone: '',
  financialPlan: '',
  teamAndVision: ''
};

/** 세션 스토리지에서 저장된 프롬프트 데이터 복원 */
function getSavedPromptData(productFileId: string) {
  try {
    const saved = sessionStorage.getItem(FUNNEL_STORAGE_KEY);
    if (!saved) return null;
    const parsed = JSON.parse(saved);
    if (parsed.context?.productFileId !== productFileId) return null;
    return parsed.context?.formData ?? null;
  } catch {
    return null;
  }
}

/** detail-input 필드들을 하나의 프롬프트 문자열로 결합 */
function detailInputToPrompt(values: DetailInputPageForm): string {
  return DETAIL_INPUT_FIELDS.map(({ name, label }) => {
    const value = values[name]?.trim();
    if (!value) return null;
    return `${label}\n${value}`;
  })
    .filter(Boolean)
    .join('\n\n');
}

export const Route = createFileRoute('/_authenticated/f/prompt/$productFileId')(
  {
    component: RouteComponent,
    validateSearch: z.object({
      fileName: z.string().optional()
    })
  }
);

function RouteComponent() {
  const { productFileId } = Route.useParams();
  const { fileName } = Route.useSearch();
  const navigate = useNavigate();
  const templateFileId = Number(productFileId);
  const { data: me } = useSuspenseQuery(getAccountMeQueryOptions());

  // 저장된 데이터 복원
  const savedData = getSavedPromptData(productFileId);

  // 모드 상태
  const [mode, setMode] = useState<PromptMode>(
    () => savedData?.mode ?? 'idea'
  );

  // 아이디어 모드: 단일 프롬프트 텍스트
  const [ideaPrompt, setIdeaPrompt] = useState<string>(
    () => savedData?.prompt ?? ''
  );

  // AI 심사역 모드: 구조화된 11개 필드
  const detailForm = useForm<DetailInputPageForm>({
    resolver: zodResolver(detailInputPageFormSchema),
    defaultValues: savedData?.detailInput ?? DEFAULT_DETAIL_INPUT
  });

  // 세션 스토리지에 자동 저장
  const detailValues = detailForm.watch();

  const saveToSession = useCallback(() => {
    const existing = (() => {
      try {
        const raw = sessionStorage.getItem(FUNNEL_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch {
        return {};
      }
    })();

    sessionStorage.setItem(
      FUNNEL_STORAGE_KEY,
      JSON.stringify({
        ...existing,
        step: 'prompt',
        context: {
          ...existing.context,
          productFileId,
          fileName,
          formData: {
            ...existing.context?.formData,
            mode,
            prompt: ideaPrompt,
            detailInput: detailValues
          }
        }
      })
    );
  }, [productFileId, fileName, mode, ideaPrompt, detailValues]);

  useEffect(() => {
    saveToSession();
  }, [saveToSession]);

  // 다음 단계 이동 시 프롬프트 확정
  const getResolvedPrompt = (): string => {
    if (mode === 'idea') return ideaPrompt.trim();
    return detailInputToPrompt(detailValues);
  };

  const handleNext = () => {
    const prompt = getResolvedPrompt();

    // 세션에 확정된 프롬프트 저장 (기존 컨텍스트 유지)
    const existing = (() => {
      try {
        const raw = sessionStorage.getItem(FUNNEL_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch {
        return {};
      }
    })();

    sessionStorage.setItem(
      FUNNEL_STORAGE_KEY,
      JSON.stringify({
        ...existing,
        step: 'prompt',
        context: {
          ...existing.context,
          productFileId,
          fileName,
          formData: {
            ...existing.context?.formData,
            mode,
            prompt: mode === 'idea' ? ideaPrompt : prompt,
            detailInput: detailValues,
            resolvedPrompt: prompt
          }
        }
      })
    );

    navigate({
      to: '/f/upload/$productFileId',
      params: { productFileId },
      search: fileName ? { fileName } : undefined
    });
  };

  const handleSkip = () => {
    const existing = (() => {
      try {
        const raw = sessionStorage.getItem(FUNNEL_STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
      } catch {
        return {};
      }
    })();

    sessionStorage.setItem(
      FUNNEL_STORAGE_KEY,
      JSON.stringify({
        ...existing,
        step: 'prompt',
        context: {
          ...existing.context,
          productFileId,
          fileName,
          formData: {
            ...existing.context?.formData,
            mode,
            prompt: '',
            detailInput: DEFAULT_DETAIL_INPUT,
            resolvedPrompt: ''
          }
        }
      })
    );

    navigate({
      to: '/f/upload/$productFileId',
      params: { productFileId },
      search: fileName ? { fileName } : undefined
    });
  };

  if (!templateFileId) {
    return <Navigate to="/f/template" />;
  }

  const hasContent =
    mode === 'idea'
      ? ideaPrompt.trim().length > 0
      : Object.values(detailValues).some(
          (v) => v != null && v.trim().length > 0
        );

  return (
    <Flex
      direction="column"
      width="100%"
      style={{ minHeight: '0px', flex: 1 }}
    >
      <StyledFunnelContentWrapper>
        {/* 헤더: 양식명 + 서브타이틀 */}
        <StyledStepHeader>
          {fileName && (
            <StyledTemplateName>&apos;{fileName}&apos;</StyledTemplateName>
          )}
          <StyledStepSubtitle>
            사업계획서 작성을 위한 프롬프트를 입력해주세요
          </StyledStepSubtitle>
        </StyledStepHeader>

        {/* 안내 배너 */}
        <StyledInfoBanner>
          <Info size={16} />
          <span>
            사업아이템 설명을 자유롭게 입력하거나, AI 심사역과 함께
            고도화하는 단계입니다. 단계를 건너뛸 수 있습니다.
          </span>
        </StyledInfoBanner>

        {/* 모드 토글 */}
        <StyledToggleWrapper>
          <SegmentedControlRoot
            value={mode}
            onValueChange={(val) => {
              if (val) setMode(val as PromptMode);
            }}
          >
            <SegmentedControlItem value="idea">
              아이디어 모드
            </SegmentedControlItem>
            <SegmentedControlItem
              value="aiReviewer"
              disabled={!me.hasProAccess}
            >
              AI 심사역과 함께
            </SegmentedControlItem>
          </SegmentedControlRoot>
        </StyledToggleWrapper>

        {/* 탭 콘텐츠 */}
        {mode === 'idea' ? (
          <TextField
            multiline
            minRows={12}
            placeholder="자유롭게 아이템 내용을 입력할 수 있습니다. 프롬프트 작성이 막막하다면 'AI 심사역과 함께' 진행해보세요."
            maxLength={10000}
            width="100%"
            value={ideaPrompt}
            onChange={(eventOrValue) => {
              const value =
                typeof eventOrValue === 'string'
                  ? eventOrValue
                  : ((
                      eventOrValue?.target as
                        | HTMLTextAreaElement
                        | HTMLInputElement
                        | undefined
                    )?.value ?? '');
              setIdeaPrompt(value);
            }}
          />
        ) : (
          <AIReviewerMode form={detailForm} />
        )}
      </StyledFunnelContentWrapper>

      {/* 푸터 */}
      <StyledPromptFooter>
        <Button
          type="button"
          variant="outlined"
          size="large"
          onClick={() => navigate({ to: '/f/template' })}
        >
          이전
        </Button>
        <Flex gap={12} style={{ marginLeft: 'auto' }}>
          <Button
            type="button"
            variant="outlined"
            size="large"
            onClick={handleSkip}
          >
            건너뛰기
          </Button>
          <Button
            type="button"
            variant="filled"
            size="large"
            onClick={handleNext}
            disabled={!hasContent}
          >
            다음 단계
          </Button>
        </Flex>
      </StyledPromptFooter>
    </Flex>
  );
}
