import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { ThumbsUp, ThumbsDown, X } from 'lucide-react';

const SURVEY_DELAY_MS = 120_000;
const DISMISSED_KEY = 'docshunt_survey_dismissed';

interface FloatingSurveyProps {
  productFileId: number;
}

export function FloatingSurvey({ productFileId }: FloatingSurveyProps) {
  const [visible, setVisible] = useState(false);
  const [reaction, setReaction] = useState<'up' | 'down' | null>(null);
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dismissed = sessionStorage.getItem(`${DISMISSED_KEY}_${productFileId}`);
    if (dismissed) return;

    const timer = setTimeout(() => setVisible(true), SURVEY_DELAY_MS);
    return () => clearTimeout(timer);
  }, [productFileId]);

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem(`${DISMISSED_KEY}_${productFileId}`, '1');
  };

  const handleSubmit = () => {
    if (!reaction) return;
    console.info('[Survey]', { productFileId, reaction, feedback: feedback.trim() || null });
    setSubmitted(true);
    setTimeout(handleDismiss, 1500);
  };

  if (!visible) return null;

  return (
    <Wrapper>
      <CloseBtn onClick={handleDismiss} aria-label="닫기">
        <X size={14} />
      </CloseBtn>

      {submitted ? (
        <DoneText>소중한 피드백 감사합니다!</DoneText>
      ) : (
        <>
          <Title>생성된 문서가 만족스러우신가요?</Title>
          <ThumbRow>
            <ThumbBtn
              $active={reaction === 'up'}
              $variant="up"
              onClick={() => setReaction(reaction === 'up' ? null : 'up')}
              aria-label="좋아요"
            >
              <ThumbsUp size={18} fill={reaction === 'up' ? 'currentColor' : 'none'} strokeWidth={1.8} />
            </ThumbBtn>
            <ThumbBtn
              $active={reaction === 'down'}
              $variant="down"
              onClick={() => setReaction(reaction === 'down' ? null : 'down')}
              aria-label="싫어요"
            >
              <ThumbsDown size={18} fill={reaction === 'down' ? 'currentColor' : 'none'} strokeWidth={1.8} />
            </ThumbBtn>
          </ThumbRow>

          {reaction && (
            <>
              <FeedbackInput
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="개선이 필요한 점을 남겨주세요 (선택)"
                rows={2}
              />
              <SubmitBtn onClick={handleSubmit}>제출</SubmitBtn>
            </>
          )}
        </>
      )}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: fixed;
  bottom: 24px;
  left: 24px;
  z-index: 1000;
  width: 300px;
  padding: 20px;
  background: ${({ theme }) => theme.color.white};
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  animation: slideUp 0.3s ease-out;

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(16px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const CloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  color: ${({ theme }) => theme.color.textGray};
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
`;

const Title = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: ${({ theme }) => theme.color.black};
  letter-spacing: -0.02em;
  margin-bottom: 12px;
`;

const ThumbRow = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 4px;
`;

const ThumbBtn = styled.button<{ $active: boolean; $variant: 'up' | 'down' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: 1.5px solid ${({ $active, $variant }) =>
    $active ? ($variant === 'up' ? '#2C81FC' : '#F04452') : '#E3E4E8'};
  background: ${({ $active, $variant }) =>
    $active ? ($variant === 'up' ? '#EBF3FF' : '#FFECEE') : '#FFFFFF'};
  color: ${({ $active, $variant }) =>
    $active ? ($variant === 'up' ? '#2C81FC' : '#F04452') : '#B5B9C4'};
  cursor: pointer;
  transition: all 0.15s;
`;

const FeedbackInput = styled.textarea`
  width: 100%;
  margin-top: 12px;
  padding: 8px 10px;
  border: 1px solid #e3e4e8;
  border-radius: 8px;
  font-size: 13px;
  font-family: inherit;
  color: ${({ theme }) => theme.color.black};
  resize: none;
  outline: none;
  box-sizing: border-box;

  &:focus { border-color: #2c81fc; }
  &::placeholder { color: #b5b9c4; }
`;

const SubmitBtn = styled.button`
  width: 100%;
  margin-top: 8px;
  padding: 8px 0;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  border: none;
  background: #2c81fc;
  color: #ffffff;
  font-family: inherit;

  &:hover { background: #0c52b8; }
`;

const DoneText = styled.div`
  text-align: center;
  font-size: 14px;
  color: ${({ theme }) => theme.color.black};
  font-weight: 500;
  padding: 8px 0;
  letter-spacing: -0.02em;
`;
