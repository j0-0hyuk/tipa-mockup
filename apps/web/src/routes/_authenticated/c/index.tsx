import { createFileRoute } from '@tanstack/react-router';
import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Flex, Button, useToast } from '@docs-front/ui';
import { useQuery } from '@tanstack/react-query';
import { getAllTemplateFilesQueryOptions } from '@/query/options/products';
import { InstantStepper } from '@/routes/_authenticated/start/-components/InstantStepper/InstantStepper';
import { Step1SelectTemplate } from '@/routes/_authenticated/start/-components/steps/Step1SelectTemplate';
import { Step2Prompt } from '@/routes/_authenticated/start/-components/steps/Step2Prompt';
import { Step3Upload } from '@/routes/_authenticated/start/-components/steps/Step3Upload';
import { Step4ImageSelect, type ImageItem } from '@/routes/_authenticated/start/-components/steps/Step4ImageSelect';
import { Step5Settings } from '@/routes/_authenticated/start/-components/steps/Step5Settings';
import { Step6Generate } from '@/routes/_authenticated/start/-components/steps/Step6Generate';
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
  StyledBtnWarning,
  StyledLoadingOverlay,
  StyledLoadingPopup,
  StyledLoadingSpinnerRing,
  StyledLoadingSteps,
  StyledLoadingStep,
  StyledLoadingDot,
} from '@/routes/_authenticated/start/-route.style';
import { X } from 'lucide-react';
import type { Language } from '@/schema/api/products/products';
import type { Theme } from '@docshunt/docs-editor-wasm';

const LOADING_STEPS = [
  '양식 분석 중...',
  '자료 분석 중...',
  '이미지 리스트 생성 중...',
  '완료',
];
const LOADING_DURATION = 5000;

export const Route = createFileRoute('/_authenticated/c/')({
  component: DraftPage,
});

function DraftPage() {
  const toast = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplateFileId, setSelectedTemplateFileId] = useState<number | null>(null);
  const [draftLabel, setDraftLabel] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [hasUpload, setHasUpload] = useState(false);
  const [selectedDocFileId, setSelectedDocFileId] = useState<number | null>(null);
  const [referenceFiles, setReferenceFiles] = useState<File[]>([]);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [language] = useState<Language>('ko');
  const [theme, setTheme] = useState<Theme | undefined>(undefined);
  const [exportedProductId, setExportedProductId] = useState<number | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const { data: templates } = useQuery(getAllTemplateFilesQueryOptions());
  const templateName = useMemo(() => {
    if (selectedTemplateFileId === -1) return draftLabel ?? '초안';
    if (!selectedTemplateFileId || !templates) return '양식';
    const found = templates.find(t => t.productFileId === selectedTemplateFileId);
    if (!found?.filePath) return '양식';
    return found.filePath.split('/').pop()?.replace(/\.(hwp|hwpx)$/i, '') ?? '양식';
  }, [selectedTemplateFileId, templates]);

  const handleGoHome = useCallback(() => {
    setCurrentStep(1);
    setSelectedTemplateFileId(null);
    setPrompt('');
    setHasUpload(false);
    setSelectedDocFileId(null);
    setReferenceFiles([]);
    setImages([]);
    setTheme(undefined);
    setExportedProductId(null);
    scrollToTop();
  }, []);

  const [showImageResetWarning, setShowImageResetWarning] = useState(false);
  const pendingPrevFromStep4 = useRef(false);

  const [showLoadingPopup, setShowLoadingPopup] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const loadingTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startLoadingPopup = useCallback(() => {
    setShowLoadingPopup(true);
    setLoadingStep(0);
    let step = 0;
    const interval = Math.floor(LOADING_DURATION / LOADING_STEPS.length);
    loadingTimerRef.current = setInterval(() => {
      step += 1;
      setLoadingStep(step);
      if (step >= LOADING_STEPS.length) {
        if (loadingTimerRef.current) clearInterval(loadingTimerRef.current);
        setTimeout(() => {
          setShowLoadingPopup(false);
          setCurrentStep((s) => s + 1);
          scrollToTop();
        }, 400);
      }
    }, interval);
  }, []);

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current) clearInterval(loadingTimerRef.current);
    };
  }, []);

  const scrollToTop = () => contentRef.current?.scrollTo(0, 0);

  const goNext = () => {
    if (currentStep < 6) {
      if (currentStep === 3) {
        const step2Valid = prompt.trim() !== '';
        const step3Valid = hasUpload || selectedDocFileId !== null;
        if (!step2Valid && !step3Valid) {
          toast.open({ content: '프롬프트 입력 또는 자료 업로드 중 하나는 진행해야 합니다.', duration: 3000 });
          return;
        }
        startLoadingPopup();
        return;
      }
      setCurrentStep((s) => s + 1);
      scrollToTop();
    }
  };

  const goPrev = () => {
    if (currentStep > 1) {
      if (currentStep === 4) {
        const hasPrompts = images.some(img => img.prompt.trim() !== '');
        if (hasPrompts) {
          setShowImageResetWarning(true);
          pendingPrevFromStep4.current = true;
          return;
        }
      }
      setCurrentStep((s) => s - 1);
      scrollToTop();
    }
  };

  const confirmImageReset = () => {
    setImages([]);
    setShowImageResetWarning(false);
    setCurrentStep((s) => s - 1);
    scrollToTop();
  };

  const canGoNext = (): boolean => {
    switch (currentStep) {
      case 1: return selectedTemplateFileId !== null;
      case 2: return prompt.trim() !== '';
      case 3: return hasUpload || selectedDocFileId !== null;
      case 4: return images.filter(img => img.checked).length >= 1;
      case 5: return true;
      default: return true;
    }
  };

  const handleNextWithValidation = () => {
    if (currentStep === 2 && prompt.trim() === '') {
      toast.open({ content: '프롬프트를 입력하거나 건너뛰기를 선택해주세요.', duration: 3000 });
      return;
    }
    if (currentStep === 3 && !hasUpload && selectedDocFileId === null) {
      toast.open({ content: '파일을 업로드하거나 기존 문서를 선택해주세요.', duration: 3000 });
      return;
    }
    goNext();
  };

  return (
    <StyledStartContainer>
      {currentStep > 1 && <InstantStepper currentStep={currentStep} hideFirstStep />}

      <StyledContentArea ref={contentRef} style={currentStep === 1 ? { display: 'flex', alignItems: 'center', justifyContent: 'center' } : undefined}>
        <StyledStepContent key={currentStep}>
          {currentStep === 1 && (
            <Step1SelectTemplate
              selectedTemplateFileId={selectedTemplateFileId}
              onSelectTemplate={setSelectedTemplateFileId}
              onDraftSelect={setDraftLabel}
              onUploadComplete={goNext}
            />
          )}
          {currentStep === 2 && (
            <Step2Prompt prompt={prompt} onPromptChange={setPrompt} templateName={templateName} draftType={draftLabel === 'R&D 계획서' ? 'rnd' : 'basic'} />
          )}
          {currentStep === 3 && (
            <Step3Upload
              hasUpload={hasUpload}
              onUploadChange={setHasUpload}
              selectedDocFileId={selectedDocFileId}
              onSelectDoc={setSelectedDocFileId}
              referenceFiles={referenceFiles}
              onReferenceFilesChange={setReferenceFiles}
              templateName={templateName}
            />
          )}
          {currentStep === 4 && (
            <Step4ImageSelect images={images} onImagesChange={setImages} templateName={templateName} />
          )}
          {currentStep === 5 && (
            <Step5Settings onThemeChange={setTheme} />
          )}
          {currentStep === 6 && (
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
        </StyledStepContent>
      </StyledContentArea>

      <StyledFooter>
        <StyledFooterInner>
        {currentStep === 1 ? (
          <>
            <div />
            <Button
              variant="filled"
              size="medium"
              disabled={!canGoNext()}
              onClick={goNext}
            >
              선택 완료
            </Button>
          </>
        ) : currentStep === 6 ? (
          <>
            <div />
            <div />
          </>
        ) : currentStep === 5 ? (
          <>
            <Button variant="outlined" size="medium" onClick={goPrev}>
              이전 단계
            </Button>
            <Button variant="filled" size="medium" onClick={goNext}>
              사업계획서 생성 시작
            </Button>
          </>
        ) : currentStep === 4 ? (
          <>
            <Button variant="outlined" size="medium" onClick={goPrev}>
              이전
            </Button>
            <Button
              variant="filled"
              size="medium"
              onClick={goNext}
            >
              다음 단계
            </Button>
          </>
        ) : (
          <>
            <Button variant="outlined" size="medium" onClick={goPrev}>
              이전
            </Button>
            <Flex gap={12}>
              <Button variant="outlined" size="medium" onClick={goNext}>
                건너뛰기
              </Button>
              <Button
                variant="filled"
                size="medium"
                disabled={!canGoNext()}
                onClick={handleNextWithValidation}
              >
                다음 단계
              </Button>
            </Flex>
          </>
        )}
        </StyledFooterInner>
      </StyledFooter>

      {showImageResetWarning && (
        <StyledModalOverlay onClick={() => setShowImageResetWarning(false)}>
          <StyledModalBox onClick={(e) => e.stopPropagation()}>
            <StyledModalHeader>
              <StyledModalTitle>이전 단계로 이동하시겠습니까?</StyledModalTitle>
              <StyledModalClose onClick={() => setShowImageResetWarning(false)}>
                <X size={20} />
              </StyledModalClose>
            </StyledModalHeader>
            <StyledModalDesc>
              이전 단계로 이동하면 입력하신 이미지 프롬프트가 초기화됩니다.
            </StyledModalDesc>
            <StyledModalFooter>
              <StyledBtnOutlined onClick={() => setShowImageResetWarning(false)}>
                취소
              </StyledBtnOutlined>
              <StyledBtnWarning onClick={confirmImageReset}>
                초기화 후 이동
              </StyledBtnWarning>
            </StyledModalFooter>
          </StyledModalBox>
        </StyledModalOverlay>
      )}

      {showLoadingPopup && (
        <StyledLoadingOverlay>
          <StyledLoadingPopup>
            <StyledLoadingSpinnerRing />
            <div style={{ fontSize: 20, fontWeight: 600, marginBottom: 8, letterSpacing: '-0.02em', color: '#25262C' }}>
              시각 자료를 구성하고 있습니다
            </div>
            <div style={{ fontSize: 14, color: '#6E7687', lineHeight: 1.6, letterSpacing: '-0.02em' }}>
              프롬프트를 분석하여<br />사업계획서에 필요한 이미지 리스트를 생성 중입니다.
            </div>
            <StyledLoadingSteps>
              {LOADING_STEPS.map((label, i) => {
                const state = i < loadingStep ? 'done' : i === loadingStep ? 'active' : 'pending';
                return (
                  <StyledLoadingStep key={i}>
                    <StyledLoadingDot $state={state}>
                      {state === 'done' && (
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                          <path d="M20 6 9 17l-5-5"/>
                        </svg>
                      )}
                    </StyledLoadingDot>
                    <span style={{
                      fontSize: 14,
                      letterSpacing: '-0.02em',
                      color: state === 'pending' ? '#B5B9C4' : '#25262C',
                      fontWeight: state === 'active' ? 500 : 400,
                    }}>
                      {state === 'done' ? label.replace(' 중...', '') : label}
                    </span>
                  </StyledLoadingStep>
                );
              })}
            </StyledLoadingSteps>
          </StyledLoadingPopup>
        </StyledLoadingOverlay>
      )}
    </StyledStartContainer>
  );
}
