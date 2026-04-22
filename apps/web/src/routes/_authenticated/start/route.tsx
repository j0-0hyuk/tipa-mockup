import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Flex, Button, useToast } from '@docs-front/ui';
import { InstantStepper } from './-components/InstantStepper/InstantStepper';
import { Step1SelectTemplate, type SavedDraft } from './-components/steps/Step1SelectTemplate';
import { Step2InputUpload } from './-components/steps/Step2InputUpload';
import { Step2Prompt } from './-components/steps/Step2Prompt';
import { Step4ReviewQuality } from './-components/steps/Step4ReviewQuality';
import { Step6ApplyFixes } from './-components/steps/Step6ApplyFixes';
import type { ImageItem } from './-components/steps/Step4ImageSelect';
import { Step6Generate } from './-components/steps/Step6Generate';
import {
  StyledStartContainer,
  StyledContentArea,
  StyledStepContent,
  StyledFooter,
  StyledFooterInner,
  StyledModalOverlay,
  StyledModalBox,
  StyledModalHeader,
  StyledModalTitle,
  StyledModalClose,
  StyledModalDesc,
  StyledModalFooter,
  StyledBtnOutlined,
  StyledBtnFilled,
} from './-route.style';
import { X } from 'lucide-react';
import type { Language } from '@/schema/api/products/products';
import type { Theme } from '@docshunt/docs-editor-wasm';
import { postVisualSuggestions } from '@/api/products/mutation';

import { Start2Page } from '../start2/route';

export const Route = createFileRoute('/_authenticated/start')({
  component: Start2Page,
});

function StartPage() {
  const toast = useToast();
  const navigate = useNavigate();
  const jumpTo = new URLSearchParams(window.location.search).get('jumpTo');
  const [currentStep, setCurrentStep] = useState(() => {
    const j = jumpTo ? parseInt(jumpTo, 10) : 0;
    return j >= 2 && j <= 6 ? j : 1;
  });
  const [selectedTemplateFileId, setSelectedTemplateFileId] = useState<number | null>(null);
  const [draftLabel, setDraftLabel] = useState<string | null>(null);
  const [prompt, setPromptRaw] = useState('');
  const [hasUpload, setHasUploadRaw] = useState(false);
  const [selectedDocFileId, setSelectedDocFileId] = useState<number | null>(null);
  const [referenceFiles, setReferenceFilesRaw] = useState<File[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  // 마지막 저장/리셋 시점 이후 실제 사용자 변경이 있었는지
  const [isDirty, setIsDirty] = useState(false);

  const setPrompt = useCallback((v: string | ((prev: string) => string)) => {
    setPromptRaw(v as string);
    setIsDirty(true);
  }, []);
  const setHasUpload = useCallback((v: boolean) => {
    setHasUploadRaw(v);
    setIsDirty(true);
  }, []);
  const setReferenceFiles = useCallback((v: File[] | ((prev: File[]) => File[])) => {
    setReferenceFilesRaw(v as File[]);
    setIsDirty(true);
  }, []);
  const [language] = useState<Language>('ko');
  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [exportedProductId, setExportedProductId] = useState<number | null>(null);
  const [appliedFixCount, setAppliedFixCount] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const templateName = useMemo(() => {
    if (selectedTemplateFileId === -1) return draftLabel ?? '초안';
    return '양식';
  }, [selectedTemplateFileId, draftLabel]);

  const handleGoHome = useCallback(() => {
    setCurrentStep(1);
    setSelectedTemplateFileId(null);
    setPromptRaw('');
    setHasUploadRaw(false);
    setSelectedDocFileId(null);
    setReferenceFilesRaw([]);
    setImages([]);
    setTheme(undefined);
    setExportedProductId(null);
    setActiveDraftId(null);
    setIsDirty(false);
    scrollToTop();
  }, []);

  // 임시 저장 — 불러온 초안이면 업데이트, 아니면 신규 생성
  const [activeDraftId, setActiveDraftId] = useState<string | null>(null);

  const saveDraft = useCallback(() => {
    try {
      const raw = localStorage.getItem('rnd_saved_drafts');
      const existing: SavedDraft[] = raw ? JSON.parse(raw) : [];

      if (activeDraftId) {
        // 기존 초안 업데이트
        const updated = existing.map(d => d.id === activeDraftId
          ? { ...d, title: prompt.trim().slice(0, 30) || d.title, currentStep, savedAt: new Date().toISOString(), prompt }
          : d
        );
        localStorage.setItem('rnd_saved_drafts', JSON.stringify(updated));
      } else {
        // 신규 생성
        const newId = `draft_${Date.now()}`;
        const draft: SavedDraft = {
          id: newId,
          title: prompt.trim().slice(0, 30) || 'R&D 계획서 초안',
          currentStep,
          savedAt: new Date().toISOString(),
          prompt,
        };
        const updated = [draft, ...existing].slice(0, 10);
        localStorage.setItem('rnd_saved_drafts', JSON.stringify(updated));
        setActiveDraftId(newId);
      }
      setIsDirty(false);
      toast.open({ content: '임시 저장되었습니다.', duration: 2000 });
    } catch { /* ignore */ }
  }, [currentStep, prompt, toast, activeDraftId]);

  // 불러오기
  const loadDraft = useCallback((draft: SavedDraft) => {
    setActiveDraftId(draft.id);
    setPromptRaw(draft.prompt);
    setCurrentStep(draft.currentStep);
    setSelectedTemplateFileId(-1);
    setDraftLabel('R&D 계획서');
    setIsDirty(false);
    toast.open({ content: `"${draft.title}" 불러왔습니다.`, duration: 2000 });
  }, [toast]);

  // Step3 → Step4 전환: API 호출만 수행 (로딩 팝업 제거)
  const callSuggestionsApi = useCallback(async () => {
    if (!selectedTemplateFileId) return;
    try {
      const result = await postVisualSuggestions({
        contents: {
          templateFileId: selectedTemplateFileId,
          userPrompt: prompt,
          exportProductFileId: selectedDocFileId ?? undefined,
        },
        referenceFiles: referenceFiles.length > 0 ? referenceFiles : undefined,
      });

      const mapped: ImageItem[] = result.map((item) => ({
        title: item.name,
        prompt: item.info,
        position: item.position,
        genBy: 'ai' as const,
        checked: true,
      }));

      setImages(mapped);
      setCurrentStep((s) => s + 1);
      scrollToTop();
    } catch {
      /* noop */
    }
  }, [selectedTemplateFileId, prompt, selectedDocFileId, referenceFiles]);

  // 페이지 이탈 경고 (Step1~2에서 내용 작성 시)
  const [showLeaveWarning, setShowLeaveWarning] = useState(false);
  const [pendingLeaveUrl, setPendingLeaveUrl] = useState<string | null>(null);
  const hasUnsavedWork = isDirty && (currentStep === 2 || currentStep === 3);

  useEffect(() => {
    if (!hasUnsavedWork) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [hasUnsavedWork]);

  // 전역 unsaved 플래그 동기화
  useEffect(() => {
    (window as any).__unsavedWork = hasUnsavedWork;
    return () => { (window as any).__unsavedWork = false; };
  }, [hasUnsavedWork]);

  // 사이드네비 이동 요청 가로채기
  useEffect(() => {
    const handler = (e: Event) => {
      const to = (e as CustomEvent).detail;
      if (!hasUnsavedWork) {
        // 변경사항이 없으면 곧바로 이동
        if (to) navigate({ to: to as any });
        return;
      }
      setPendingLeaveUrl(to);
      setShowLeaveWarning(true);
    };
    window.addEventListener('nav-request', handler);
    return () => window.removeEventListener('nav-request', handler);
  }, [hasUnsavedWork, navigate]);

  const handleLeaveSave = () => {
    saveDraft();
    setShowLeaveWarning(false);
    if (pendingLeaveUrl) navigate({ to: pendingLeaveUrl as any });
    setPendingLeaveUrl(null);
  };

  const handleLeaveDiscard = () => {
    setShowLeaveWarning(false);
    if (pendingLeaveUrl) navigate({ to: pendingLeaveUrl as any });
    setPendingLeaveUrl(null);
  };

  // /start 진입 시 채널톡 숨김
  useEffect(() => {
    window.ChannelIO?.('hideChannelButton');
    return () => {
      window.ChannelIO?.('showChannelButton');
    };
  }, []);

  const scrollToTop = () => contentRef.current?.scrollTo(0, 0);

  const goNext = () => {
    if (currentStep < 6) {
      // Step3 → Step4 (품질 검토) → Step5 (부가 기능) → Step6 (생성)

      setCurrentStep((s) => s + 1);
      scrollToTop();
    }
  };

  const goPrev = () => {
    if (currentStep > 1) {
      // #24: Step4에서 이전 단계 이동 시 이미지 프롬프트 초기화 경고
      setCurrentStep((s) => s - 1);
      scrollToTop();
    }
  };

  // #14: 각 단계별 유효성 검사
  const canGoNext = (): boolean => {
    switch (currentStep) {
      case 1: return selectedTemplateFileId !== null;
      case 2: return prompt.trim() !== '' || hasUpload; // 자유입력 또는 파일 업로드
      case 3: return true; // 자세한 입력은 선택
      default: return true;
    }
  };

  // #16: Step2 프롬프트/자료 둘 다 미입력 경고
  const handleNextWithValidation = () => {
    if (currentStep === 2 && prompt.trim() === '') {
      toast.open({ content: '프롬프트를 입력하거나 건너뛰기를 선택해주세요.', duration: 3000 });
      return;
    }
    goNext();
  };

  return (
    <StyledStartContainer>
      {/* 전체 과정 미리보기: Step 1에서도 스텝퍼 표시 */}
      <InstantStepper currentStep={currentStep} />

      <StyledContentArea ref={contentRef}>
        <StyledStepContent key={currentStep}>
          {currentStep === 1 && (
            <Step1SelectTemplate
              selectedTemplateFileId={selectedTemplateFileId}
              onSelectTemplate={setSelectedTemplateFileId}
              onDraftSelect={setDraftLabel}
              onUploadComplete={goNext}
              onLoadDraft={loadDraft}
            />
          )}
          {currentStep === 2 && (
            <Step2InputUpload
              prompt={prompt}
              onPromptChange={setPrompt}
              hasUpload={hasUpload}
              onUploadChange={setHasUpload}
              referenceFiles={referenceFiles}
              onReferenceFilesChange={setReferenceFiles}
            />
          )}
          {currentStep === 3 && (
            <Step2Prompt prompt={prompt} onPromptChange={setPrompt} templateName={templateName} draftType='rnd' />
          )}
          {currentStep === 4 && (
            <Step6Generate
              selectedTemplateFileId={selectedTemplateFileId}
              selectedDocFileId={selectedDocFileId}
              prompt={prompt}
              images={images}
              referenceFiles={referenceFiles}
              language={language}
              documentTheme={theme}
              exportedProductId={exportedProductId}
              onExportedProductIdChange={setExportedProductId}
              onGoHome={handleGoHome}
            />
          )}
          {/* 품질 검토 / 수정 및 반영은 내 문서함에서 진입 */}
        </StyledStepContent>
      </StyledContentArea>

      <StyledFooter>
        <StyledFooterInner>
        {currentStep === 1 ? (
          <>
            <div />
            <div />
          </>
        ) : currentStep >= 4 ? (
          <>
            <div />
            <div />
          </>
        ) : (
          <>
            <Flex gap={8}>
              <Button variant="outlined" size="medium" onClick={goPrev}>
                이전
              </Button>
              <Button variant="outlined" size="medium" onClick={saveDraft}>
                임시 저장
              </Button>
            </Flex>
            <Flex gap={12}>
              {currentStep !== 3 && (
                <Button variant="outlined" size="medium" onClick={goNext}>
                  건너뛰기
                </Button>
              )}
              <Button
                variant="filled"
                size="medium"
                disabled={!canGoNext()}
                onClick={handleNextWithValidation}
              >
                {currentStep === 3 ? '초안 생성' : '다음 단계'}
              </Button>
            </Flex>
          </>
        )}
        </StyledFooterInner>
      </StyledFooter>

      {/* ─── 모달: 페이지 이탈 경고 ───────────────────────── */}
      {showLeaveWarning && (
        <StyledModalOverlay onClick={() => setShowLeaveWarning(false)}>
          <StyledModalBox onClick={(e) => e.stopPropagation()}>
            <StyledModalHeader>
              <StyledModalTitle>변경 사항이 있습니다</StyledModalTitle>
              <StyledModalClose onClick={() => setShowLeaveWarning(false)}>
                <X size={20} />
              </StyledModalClose>
            </StyledModalHeader>
            <StyledModalDesc>
              작성 중인 내용이 저장되지 않았습니다. 임시 저장하시겠습니까?
            </StyledModalDesc>
            <StyledModalFooter>
              <StyledBtnOutlined onClick={handleLeaveDiscard}>나가기</StyledBtnOutlined>
              <StyledBtnFilled onClick={handleLeaveSave}>저장하기</StyledBtnFilled>
            </StyledModalFooter>
          </StyledModalBox>
        </StyledModalOverlay>
      )}

    </StyledStartContainer>
  );
}
