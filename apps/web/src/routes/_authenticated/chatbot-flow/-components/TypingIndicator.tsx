import {
  StyledTypingWrap,
  StyledTypingDot,
  StyledMessageRow,
} from '@/routes/_authenticated/chatbot-flow/-components/styles';

export function TypingIndicator() {
  return (
    <StyledMessageRow $side="ai">
      <StyledTypingWrap>
        <StyledTypingDot $i={0} />
        <StyledTypingDot $i={1} />
        <StyledTypingDot $i={2} />
      </StyledTypingWrap>
    </StyledMessageRow>
  );
}
