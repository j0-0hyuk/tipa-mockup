import { Flex, Callout, Modal, Skeleton } from '@docs-front/ui';
import { Button } from '@bichon/ds';
import {
  createFileRoute,
  Navigate,
  useNavigate
} from '@tanstack/react-router';
import { z } from 'zod';
import { useState, useCallback, useRef } from 'react';
import { useModal } from '@/hooks/useModal';
import { postVisualSuggestions } from '@/api/products/mutation';
import { StyledFunnelContentWrapper } from '@/routes/_authenticated/f/-route.style';
import {
  StyledPageSubtitle,
  StyledTemplateName,
  StyledFooter,
  StyledButtonWrapper,
  StyledCounter,
  StyledEmptyState,
  StyledErrorState,
  StyledSkeletonRow
} from '@/routes/_authenticated/f/visual-suggestions/-index.style';
import { Plus, ImageIcon, RefreshCw } from 'lucide-react';
import {
  SuggestionsTable,
  type VisualSuggestion
} from '@/routes/_authenticated/f/visual-suggestions/-components/SuggestionsTable';

export const Route = createFileRoute(
  '/_authenticated/f/visual-suggestions/$productFileId'
)({
  component: RouteComponent,
  validateSearch: z.object({
    fileName: z.string().optional()
  })
});

const MAX_SUGGESTIONS = 10;
const SUGGESTIONS_STORAGE_KEY = 'f-visual-suggestions';

type SuggestionsStatus = 'loading' | 'error' | 'empty' | 'success';

function getSavedContext(productFileId: string) {
  const saved = sessionStorage.getItem('f-funnel-data');
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved);
    // settings 단계에서 뒤로 돌아온 경우도 허용
    if (parsed.step !== 'visual-suggestions' && parsed.step !== 'settings')
      return null;
    if (parsed.context?.productFileId !== productFileId) return null;
    return parsed.context ?? null;
  } catch {
    return null;
  }
}

function getSavedSuggestions(productFileId: string): VisualSuggestion[] | null {
  const saved = sessionStorage.getItem(SUGGESTIONS_STORAGE_KEY);
  if (!saved) return null;
  try {
    const parsed = JSON.parse(saved);
    if (parsed.productFileId !== productFileId) return null;
    const items = parsed.items;
    if (!Array.isArray(items) || items.length === 0) return null;
    return items;
  } catch {
    return null;
  }
}

function saveSuggestions(productFileId: string, suggestions: VisualSuggestion[]) {
  sessionStorage.setItem(
    SUGGESTIONS_STORAGE_KEY,
    JSON.stringify({ productFileId, items: suggestions })
  );
}

function RouteComponent() {
  const { productFileId } = Route.useParams();
  const { fileName } = Route.useSearch();
  const templateFileId = Number(productFileId);
  const navigate = useNavigate();
  const modal = useModal();

  const savedContextRef = useRef(getSavedContext(productFileId));
  const restoredSuggestions = useRef(getSavedSuggestions(productFileId));

  const [suggestions, setSuggestions] = useState<VisualSuggestion[]>(
    restoredSuggestions.current ?? []
  );
  const [status, setStatus] = useState<SuggestionsStatus>(
    restoredSuggestions.current
      ? restoredSuggestions.current.length > 0
        ? 'success'
        : 'empty'
      : 'empty'
  );

  const updateSuggestions = useCallback(
    (updater: VisualSuggestion[] | ((prev: VisualSuggestion[]) => VisualSuggestion[])) => {
      setSuggestions((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        saveSuggestions(productFileId, next);
        return next;
      });
    },
    [productFileId]
  );

  const loadSuggestions = useCallback(async () => {
    const ctx = savedContextRef.current;
    setStatus('loading');
    try {
      const result = await postVisualSuggestions({
        contents: {
          templateFileId,
          userPrompt: ctx?.formData?.resolvedPrompt ?? ctx?.formData?.prompt ?? '',
          productContents: ctx?.formData?.productContents,
          exportProductFileId: ctx?.formData?.exportProductFileId
        }
      });
      const mapped = result.map((item) => ({
        id: crypto.randomUUID(),
        title: item.name,
        prompt: item.info,
        position: item.position,
        genBy: 'ai' as const,
        selected: true
      }));
      updateSuggestions(mapped);
      setStatus(mapped.length === 0 ? 'empty' : 'success');
    } catch {
      setStatus('error');
    }
  }, [templateFileId, updateSuggestions]);

  // loadSuggestions는 수동 재시도용으로만 유지 (자동 호출 없음, upload에서 API 호출 완료 후 진입)

  if (!templateFileId) {
    return <Navigate to="/f/template" />;
  }

  if (!savedContextRef.current) {
    return <Navigate to="/f/template" />;
  }

  const savedContext = savedContextRef.current;
  const selectedCount = suggestions.filter((s) => s.selected).length;

  const handleToggle = (id: string) => {
    updateSuggestions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        if (!s.selected && selectedCount >= MAX_SUGGESTIONS) return s;
        return { ...s, selected: !s.selected };
      })
    );
  };

  const handlePromptChange = (id: string, newPrompt: string) => {
    updateSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, prompt: newPrompt } : s))
    );
  };

  const handleDelete = (id: string) => {
    updateSuggestions((prev) => {
      const next = prev.filter((s) => s.id !== id);
      if (next.length === 0) setStatus('empty');
      return next;
    });
  };

  const handleAdd = () => {
    if (suggestions.length >= MAX_SUGGESTIONS) {
      modal.openModal(({ isOpen, onClose }) => (
        <Modal isOpen={isOpen} onClose={onClose}>
          <Modal.Header title="이미지 항목 추가 불가" />
          <Modal.Body>
            이미지 생성 제안은 최대 {MAX_SUGGESTIONS}개까지 가능합니다.
            기존 항목을 삭제한 후 새로운 항목을 추가해주세요.
          </Modal.Body>
          <Modal.Footer>
            <Modal.ConfirmButton onClick={onClose}>확인</Modal.ConfirmButton>
          </Modal.Footer>
        </Modal>
      ));
      return;
    }

    const newSuggestion: VisualSuggestion = {
      id: crypto.randomUUID(),
      title: '',
      prompt: '',
      position: '',
      genBy: 'human',
      selected: selectedCount < MAX_SUGGESTIONS
    };
    updateSuggestions((prev) => [...prev, newSuggestion]);
    setStatus('success');
  };

  const handleTitleChange = (id: string, newTitle: string) => {
    updateSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, title: newTitle } : s))
    );
  };

  const handleNext = () => {
    const selectedSuggestions = suggestions.filter((s) => s.selected);
    const hasEmptyField = selectedSuggestions.some(
      (s) => !s.title.trim() || !s.prompt.trim()
    );
    if (hasEmptyField) {
      modal.openModal(({ isOpen, onClose }) => (
        <Modal isOpen={isOpen} onClose={onClose}>
          <Modal.Header title="입력되지 않은 항목이 있습니다" />
          <Modal.Body>
            선택된 이미지의 제목과 생성 프롬프트를 모두 입력해주세요.
          </Modal.Body>
          <Modal.Footer>
            <Modal.ConfirmButton onClick={onClose}>확인</Modal.ConfirmButton>
          </Modal.Footer>
        </Modal>
      ));
      return;
    }

    navigate({
      to: '/f/settings/$productFileId',
      params: { productFileId },
      search: fileName ? { fileName } : undefined
    });
  };

  const displayFileName = fileName ?? savedContext?.fileName ?? '';

  return (
    <Flex
      direction="column"
      width="100%"
      style={{ minHeight: '0px', flex: 1 }}
    >
      <StyledFunnelContentWrapper>
        <Flex direction="column" gap={24} width="100%" alignItems="flex-start">
          {/* Header */}
          <Flex direction="column" gap={8} width="100%" alignItems="flex-start">
            {displayFileName && (
              <StyledTemplateName>
                &apos;{displayFileName}&apos;
              </StyledTemplateName>
            )}
            <StyledPageSubtitle>
              사업계획서 시각 자료(이미지) 구성
            </StyledPageSubtitle>
          </Flex>

          {/* Info Banner + Counter */}
          <Callout $variant="info">
            <span style={{ flex: 1 }}>
              선택하신 양식과 입력하신 프롬프트를 기반으로 필요한 이미지
              리스트를 AI가 추천합니다.
            </span>
            <StyledCounter>
              {selectedCount}/{MAX_SUGGESTIONS}
            </StyledCounter>
          </Callout>

          {/* Main Content */}
          {status === 'loading' && <LoadingState />}
          {status === 'error' && <ErrorState onRetry={loadSuggestions} />}
          {status === 'empty' && <EmptyState onAdd={handleAdd} />}
          {status === 'success' && (
            <SuggestionsTable
              suggestions={suggestions}
              selectedCount={selectedCount}
              maxSuggestions={MAX_SUGGESTIONS}
              onToggle={handleToggle}
              onTitleChange={handleTitleChange}
              onPromptChange={handlePromptChange}
              onDelete={handleDelete}
              onAdd={handleAdd}
            />
          )}
        </Flex>
      </StyledFunnelContentWrapper>

      <StyledFooter>
        <StyledButtonWrapper>
          <Button
            type="button"
            variant="outlined"
            size="large"
            onClick={() => {
              navigate({
                to: '/f/upload/$productFileId',
                params: { productFileId },
                search: fileName ? { fileName } : undefined
              });
            }}
          >
            이전
          </Button>
          <Button
            type="button"
            variant="filled"
            size="large"
            disabled={status === 'loading'}
            onClick={handleNext}
          >
            다음 단계
          </Button>
        </StyledButtonWrapper>
      </StyledFooter>
    </Flex>
  );
}

function LoadingState() {
  return (
    <Flex direction="column" gap={0} width="100%">
      {Array.from({ length: 4 }).map((_, i) => (
        <StyledSkeletonRow key={i}>
          <Skeleton loading width={20} height={20} />
          <Skeleton loading width="20%" height={20} />
          <Skeleton loading width="70%" height={20} />
        </StyledSkeletonRow>
      ))}
    </Flex>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <StyledEmptyState>
      <ImageIcon size={48} />
      추천된 시각 자료가 없습니다.
      <Button type="button" variant="outlined" size="medium" onClick={onAdd}>
        <Plus size={16} />
        직접 항목 추가
      </Button>
    </StyledEmptyState>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <StyledErrorState>
      시각 자료 추천을 불러오는 데 실패했습니다.
      <Button
        type="button"
        variant="outlined"
        size="medium"
        onClick={onRetry}
      >
        <RefreshCw size={16} />
        다시 시도
      </Button>
    </StyledErrorState>
  );
}
