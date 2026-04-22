import { FlaskConical, ArrowRight } from 'lucide-react';
import {
  StyledCtaSection,
  StyledCtaBanner,
  StyledCtaText,
  StyledCtaEyebrow,
  StyledCtaTitle,
  StyledCtaButton,
} from './styles';

interface CtaBannerProps {
  onAiStart: () => void;
}

export function CtaBanner({ onAiStart }: CtaBannerProps) {
  return (
    <StyledCtaSection>
      <StyledCtaBanner>
        <StyledCtaText>
          <StyledCtaEyebrow>처음 지원하시나요?</StyledCtaEyebrow>
          <StyledCtaTitle>
            TIPANI가 R&D 계획서 기초 초안 작성을 도와드려요
          </StyledCtaTitle>
        </StyledCtaText>
        <StyledCtaButton type="button" onClick={onAiStart}>
          <FlaskConical size={16} strokeWidth={2.4} />
          AI 초안 시작하기
          <ArrowRight size={16} strokeWidth={2.4} />
        </StyledCtaButton>
      </StyledCtaBanner>
    </StyledCtaSection>
  );
}
