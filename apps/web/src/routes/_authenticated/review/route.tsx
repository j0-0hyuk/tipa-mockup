import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from '@docs-front/ui';
import { Step4ReviewQuality } from '@/routes/_authenticated/start/-components/steps/Step4ReviewQuality';
import { Step6ApplyFixes } from '@/routes/_authenticated/start/-components/steps/Step6ApplyFixes';
import {
  StyledStartContainer,
  StyledContentArea,
  StyledStepContent,
  StyledFooter,
  StyledFooterInner,
} from '@/routes/_authenticated/start/-route.style';
import { InstantStepper } from '@/routes/_authenticated/start/-components/InstantStepper/InstantStepper';

export const Route = createFileRoute('/_authenticated/review')({
  component: ReviewFlow,
});

function ReviewFlow() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [appliedCount, setAppliedCount] = useState(0);

  // InstantStepper에 전달할 stepNum 매핑 (품질검토=1, 수정및반영=2)
  const currentStepNum = step;

  return (
    <StyledStartContainer>
      <InstantStepper
        currentStep={currentStepNum}
        customSteps={[
          { label: '품질 검토', stepNum: 1 },
          { label: '수정 및 반영', stepNum: 2 },
        ]}
      />

      <StyledContentArea>
        <StyledStepContent key={step}>
          {step === 1 && <Step4ReviewQuality />}
          {step === 2 && <Step6ApplyFixes onAppliedChange={setAppliedCount} />}
        </StyledStepContent>
      </StyledContentArea>

      <StyledFooter>
        <StyledFooterInner>
          {step === 1 ? (
            <>
              <Button variant="outlined" size="medium" onClick={() => navigate({ to: '/d' })}>
                돌아가기
              </Button>
              <Button variant="filled" size="medium" onClick={() => setStep(2)}>
                다음 단계
              </Button>
            </>
          ) : (
            <>
              <Button variant="outlined" size="medium" onClick={() => setStep(1)}>
                이전
              </Button>
              <Button variant="filled" size="medium" disabled={appliedCount === 0} onClick={() => {
                localStorage.setItem('rnd_doc_status', '개선 완료');
                navigate({ to: '/d/preview' as any, search: { status: '개선 완료' } as any });
              }}>
                내 문서함
              </Button>
            </>
          )}
        </StyledFooterInner>
      </StyledFooter>
    </StyledStartContainer>
  );
}
