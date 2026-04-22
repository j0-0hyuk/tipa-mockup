import {
  StyledProgressIndicator,
  StyledProgressRoot,
  type StyledProgressProps
} from '#components/Progress/Progress.style.ts';

export interface ProgressProps extends StyledProgressProps {
  progress: number;
}

export const Progress = ({ progress, height }: ProgressProps) => {
  return (
    <StyledProgressRoot height={height} value={progress}>
      <StyledProgressIndicator $progress={progress}></StyledProgressIndicator>
    </StyledProgressRoot>
  );
};
