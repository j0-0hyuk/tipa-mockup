import styled from '@emotion/styled';
import { Button } from '@docs-front/ui';
import { Sparkles, Target, X } from 'lucide-react';

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 38, 0.5);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
`;

const Box = styled.div`
  background: #FFFFFF;
  border-radius: 16px;
  max-width: 460px;
  width: 100%;
  padding: 32px 32px 24px;
  box-shadow: 0 24px 64px rgba(17, 24, 38, 0.18);
  position: relative;
  text-align: center;
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 14px;
  right: 14px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
  color: #6E7687;
  border-radius: 6px;
  &:hover {
    background: #F1F2F5;
  }
`;

const IconCircle = styled.div`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #EEF4FF;
  color: #2C81FC;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px auto 18px;
`;

const Badge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #EEF4FF;
  color: #1E5BB8;
  padding: 5px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  margin-bottom: 14px;
`;

const Title = styled.h2`
  font-size: 20px;
  font-weight: 600;
  color: #25262C;
  margin: 0 0 10px 0;
  line-height: 1.4;
  letter-spacing: -0.02em;
`;

const Desc = styled.p`
  font-size: 14px;
  color: #596070;
  margin: 0 0 24px 0;
  line-height: 1.65;
  letter-spacing: -0.02em;
`;

const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`;

interface Props {
  open: boolean;
  onRecommend: () => void;
  onIgnore: () => void;
}

export function RecommendIntroModal({ open, onRecommend, onIgnore }: Props) {
  if (!open) return null;

  return (
    <Overlay onClick={onIgnore}>
      <Box onClick={(e) => e.stopPropagation()}>
        <CloseBtn onClick={onIgnore} aria-label="닫기">
          <X size={18} />
        </CloseBtn>

        <IconCircle>
          <Target size={28} strokeWidth={1.8} />
        </IconCircle>

        <Badge>
          <Sparkles size={12} />
          맞춤 공고 추천
        </Badge>

        <Title>
          초안 작성 전에
          <br />
          우리 회사에 맞는 공고부터 찾아볼까요?
        </Title>

        <Desc>
          기업정보를 입력하시면 TRL·업종·규모 등을 분석하여
          <br />
          일치율 높은 R&D 지원사업을 먼저 추천해드려요.
          <br />
          입력 내용은 초안 작성에도 자동으로 반영됩니다.
        </Desc>

        <Actions>
          <Button variant="outlined" size="medium" onClick={onIgnore}>
            무시하기
          </Button>
          <Button variant="filled" size="medium" onClick={onRecommend}>
            공고 추천받기
          </Button>
        </Actions>
      </Box>
    </Overlay>
  );
}
