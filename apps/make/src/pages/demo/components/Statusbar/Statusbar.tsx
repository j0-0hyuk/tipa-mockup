import {
  StyledStatusBar,
  StyledStatusTitle,
  StyledStatusActiveLine,
  StyledStatusIndicator
} from '@/apps/make/src/pages/demo/components/Statusbar/Statusbar.style';

interface StepStatusbarProps {
  step: string;
  title: string;
  isActive?: boolean;
}

export default function StepStatusbar({
  step,
  isActive = false,
  title
}: StepStatusbarProps) {
  return (
    <StyledStatusBar $isActive={isActive}>
      <StyledStatusIndicator $isActive={isActive}>{step}</StyledStatusIndicator>
      <StyledStatusTitle $isActive={isActive}>{title}</StyledStatusTitle>
      {isActive && <StyledStatusActiveLine />}
    </StyledStatusBar>
  );
}
