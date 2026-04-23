import { Sparkles, ArrowRight, Target } from 'lucide-react';
import {
  StyledCtaCard,
  StyledCtaTitle,
  StyledCtaButton,
  StyledCtaSub,
  StyledMessageRow,
} from '@/routes/_authenticated/chatbot-flow/-components/styles';

type CtaVariant = 'rnd' | 'company';

interface CtaCardProps {
  onClick: () => void;
  variant?: CtaVariant;
}

const VARIANT_COPY: Record<CtaVariant, { title: string; button: string; sub: string }> = {
  rnd: {
    title: '추천 액션',
    button: '기초 초안 작성 시작하기',
    sub: '공통 항목부터 가이드와 함께 차근차근 채워볼게요',
  },
  company: {
    title: '맞춤 공고 추천',
    button: '기업정보 입력하러 가기',
    sub: '입력하신 정보로 일치율 높은 공고를 바로 찾아드릴게요',
  },
};

export function CtaCard({ onClick, variant = 'rnd' }: CtaCardProps) {
  const copy = VARIANT_COPY[variant];
  return (
    <StyledMessageRow $side="ai">
      <StyledCtaCard>
        <StyledCtaTitle>
          {variant === 'company' ? <Target size={14} /> : <Sparkles size={14} />}
          {copy.title}
        </StyledCtaTitle>
        <StyledCtaButton onClick={onClick}>
          {copy.button}
          <ArrowRight size={18} strokeWidth={2.4} />
        </StyledCtaButton>
        <StyledCtaSub>{copy.sub}</StyledCtaSub>
      </StyledCtaCard>
    </StyledMessageRow>
  );
}
