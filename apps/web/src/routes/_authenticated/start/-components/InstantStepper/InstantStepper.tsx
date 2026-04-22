import { Check } from 'lucide-react';
import {
  StyledStepperBar,
  StyledStepperRow,
  StyledStep,
  StyledStepCircle,
  StyledStepName,
  StyledStepLine,
} from './InstantStepper.style';

// stepNum: route.tsx의 실제 currentStep 값과 매핑
const DEFAULT_STEPS = [
  { label: '데이터 입력', stepNum: 2 },
  { label: '항목별AI검토', stepNum: 3 },
  { label: '초안 생성', stepNum: 4 },
] as const;

interface InstantStepperProps {
  currentStep: number;
  hideFirstStep?: boolean;
  customSteps?: readonly { label: string; stepNum: number }[];
}

export function InstantStepper({ currentStep, hideFirstStep, customSteps }: InstantStepperProps) {
  const baseSteps = customSteps || DEFAULT_STEPS;
  const steps = hideFirstStep ? baseSteps.slice(1) : baseSteps;

  return (
    <StyledStepperBar>
      <StyledStepperRow>
        {steps.map((step, i) => {
          const displayNum = i + 1;
          const state: 'done' | 'active' | 'pending' =
            step.stepNum < currentStep ? 'done' : step.stepNum === currentStep ? 'active' : 'pending';

          return (
            <div key={step.stepNum} style={{ display: 'flex', alignItems: 'flex-start' }}>
              {/* #23: clickable 제거, cursor default */}
              <StyledStep $clickable={false}>
                <StyledStepCircle $state={state}>
                  {state === 'done' ? <Check size={14} strokeWidth={3} /> : displayNum}
                </StyledStepCircle>
                <StyledStepName $state={state}>{step.label}</StyledStepName>
              </StyledStep>
              {i < steps.length - 1 && <StyledStepLine $done={step.stepNum < currentStep} />}
            </div>
          );
        })}
      </StyledStepperRow>
    </StyledStepperBar>
  );
}
