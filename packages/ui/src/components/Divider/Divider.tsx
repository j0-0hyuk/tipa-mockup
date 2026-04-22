import {
  StyledDividerContainer,
  StyledDividerLine,
  StyledDividerText
} from '#components/Divider/Divider.style.ts';

export interface DividerProps {
  text?: string;
}

export const Divider = ({ text }: DividerProps) => {
  if (!text) {
    return <StyledDividerLine />;
  }

  return (
    <StyledDividerContainer>
      <StyledDividerLine />
      <StyledDividerText>{text}</StyledDividerText>
      <StyledDividerLine />
    </StyledDividerContainer>
  );
};
