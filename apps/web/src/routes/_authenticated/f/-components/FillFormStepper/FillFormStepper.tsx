import { Check } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import {
  StyledStepperContainer,
  StyledStepWrapper,
  StyledStepItem,
  StyledStepCircle,
  StyledStepNumber,
  StyledStepLabel,
  StyledStepConnector
} from '@/routes/_authenticated/f/-components/FillFormStepper/FillFormStepper.style';

const STEP_KEYS = [
  'main:fillForm.stepper.selectTemplate',
  'main:fillForm.stepper.prompt',
  'main:fillForm.stepper.uploadData',
  'main:fillForm.stepper.selectImage',
  'main:fillForm.stepper.documentSettings',
  'main:fillForm.stepper.generate'
] as const;

interface FillFormStepperProps {
  currentStep: number;
}

export function FillFormStepper({ currentStep }: FillFormStepperProps) {
  const { t } = useTranslation();

  return (
    <StyledStepperContainer aria-label="진행 단계">
      {STEP_KEYS.map((key, index) => {
        const stepNumber = index + 1;
        const status =
          stepNumber < currentStep
            ? 'completed'
            : stepNumber === currentStep
              ? 'current'
              : 'upcoming';

        return (
          <StyledStepWrapper key={key}>
            <StyledStepItem>
              <StyledStepCircle $status={status} aria-current={status === 'current' ? 'step' : undefined}>
                {status === 'completed' ? (
                  <Check size={18} strokeWidth={3} />
                ) : (
                  <StyledStepNumber>{stepNumber}</StyledStepNumber>
                )}
              </StyledStepCircle>
              <StyledStepLabel $status={status}>{t(key)}</StyledStepLabel>
            </StyledStepItem>
            {index < STEP_KEYS.length - 1 && (
              <StyledStepConnector $completed={stepNumber < currentStep} />
            )}
          </StyledStepWrapper>
        );
      })}
    </StyledStepperContainer>
  );
}
