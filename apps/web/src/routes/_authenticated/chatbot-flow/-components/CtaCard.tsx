import { Sparkles, ArrowRight } from 'lucide-react';
import { StyledCtaCard, StyledCtaTitle, StyledCtaButton, StyledCtaSub, StyledMessageRow } from './styles';

interface CtaCardProps {
  onClick: () => void;
}

export function CtaCard({ onClick }: CtaCardProps) {
  return (
    <StyledMessageRow $side="ai">
      <StyledCtaCard>
        <StyledCtaTitle>
          <Sparkles size={14} />
          추천 액션
        </StyledCtaTitle>
        <StyledCtaButton onClick={onClick}>
          기초 초안 작성 시작하기
          <ArrowRight size={18} strokeWidth={2.4} />
        </StyledCtaButton>
        <StyledCtaSub>공통 항목부터 가이드와 함께 차근차근 채워볼게요</StyledCtaSub>
      </StyledCtaCard>
    </StyledMessageRow>
  );
}
