import { Fragment, useEffect, useState } from 'react';
import {
  StyledBubble,
  StyledMessageRow,
  StyledRichBubble,
  StyledSenderRow,
  StyledSenderAvatar,
  StyledSenderName,
} from './styles';
import { TipaLogo } from './TipaLogo';

interface MessageBubbleProps {
  side: 'ai' | 'user';
  text: string;
  typingMs: number;
  instant?: boolean;
  showSender?: boolean;
  onComplete?: () => void;
}

// **bold**, raw URL 자동 링크 (URL 텍스트 그대로 노출)
function renderMarkup(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s)]+)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    if (/^https?:\/\//.test(part)) {
      return (
        <a key={i} href={part} target="_blank" rel="noopener noreferrer">
          {part}
        </a>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}

export function MessageBubble({ side, text, typingMs, instant, showSender, onComplete }: MessageBubbleProps) {
  const [visibleLength, setVisibleLength] = useState(instant ? text.length : 0);
  const isRich = instant || text.length > 120;

  useEffect(() => {
    if (instant) {
      setVisibleLength(text.length);
      onComplete?.();
      return;
    }

    setVisibleLength(0);
    const total = text.length;
    if (total === 0) {
      onComplete?.();
      return;
    }

    const stepMs = Math.max(10, Math.floor(typingMs / total));
    let current = 0;
    const interval = setInterval(() => {
      current += 1;
      setVisibleLength(current);
      if (current >= total) {
        clearInterval(interval);
        onComplete?.();
      }
    }, stepMs);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, typingMs, instant]);

  const content = instant
    ? renderMarkup(text)
    : renderMarkup(text.slice(0, visibleLength));

  const Bubble = isRich ? StyledRichBubble : StyledBubble;

  return (
    <>
      {showSender && (
        <StyledSenderRow $side={side}>
          {side === 'ai' && (
            <StyledSenderAvatar>
              <TipaLogo />
            </StyledSenderAvatar>
          )}
          <StyledSenderName $side={side}>
            {side === 'ai' ? (
              <>
                <span>TIPA</span>
                <span>NI</span>
              </>
            ) : (
              '김민수'
            )}
          </StyledSenderName>
          {side === 'user' && (
            <StyledSenderAvatar $user>김</StyledSenderAvatar>
          )}
        </StyledSenderRow>
      )}
      <StyledMessageRow $side={side}>
        <Bubble $side={side}>{content}</Bubble>
      </StyledMessageRow>
    </>
  );
}
