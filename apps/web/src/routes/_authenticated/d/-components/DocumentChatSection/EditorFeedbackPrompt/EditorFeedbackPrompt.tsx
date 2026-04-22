import { Sparkles, ThumbsDown, ThumbsUp } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';
import { useEditorFeedbackPrompt } from '@/routes/_authenticated/d/-components/DocumentChatSection/EditorFeedbackPrompt/useEditorFeedbackPrompt';
import {
  StyledFeedbackButton,
  StyledFeedbackButtonGroup,
  StyledFeedbackContainer,
  StyledFeedbackText
} from '@/routes/_authenticated/d/-components/DocumentChatSection/EditorFeedbackPrompt/EditorFeedbackPrompt.style';

const COPY = {
  ko: {
    question: '에디터 기능이 어떠신가요?',
    thanks: '감사합니다!',
    channelTalk: '채널톡으로 의견을 남겨주세요!'
  },
  en: {
    question: 'How do you like the editor?',
    thanks: 'Thank you!',
    channelTalk: 'Please share your thoughts on Channel Talk!'
  }
};

interface EditorFeedbackPromptProps {
  assistantMessageCount: number;
}

export function EditorFeedbackPrompt({
  assistantMessageCount
}: EditorFeedbackPromptProps) {
  const { currentLanguage } = useI18n(['common']);
  const copy = currentLanguage === 'en' ? COPY.en : COPY.ko;

  const { visible, status, isLiked, onLike, onDislike } =
    useEditorFeedbackPrompt(assistantMessageCount);

  if (!visible) return null;

  return (
    <StyledFeedbackContainer>
      {status === 'idle' ? (
        <>
          <StyledFeedbackText>
            <Sparkles size={14} style={{ marginRight: 6, verticalAlign: -2 }} />
            {copy.question}
          </StyledFeedbackText>
          <StyledFeedbackButtonGroup>
            <StyledFeedbackButton onClick={onLike} aria-label="Like">
              <ThumbsUp size={16} />
            </StyledFeedbackButton>
            <StyledFeedbackButton onClick={onDislike} aria-label="Dislike">
              <ThumbsDown size={16} />
            </StyledFeedbackButton>
          </StyledFeedbackButtonGroup>
        </>
      ) : (
        <StyledFeedbackText>
          {isLiked ? copy.thanks : copy.channelTalk}
        </StyledFeedbackText>
      )}
    </StyledFeedbackContainer>
  );
}
