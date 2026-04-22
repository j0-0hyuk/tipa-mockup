import { useCallback, useEffect, useRef, useState } from 'react';
import { showChannelTalkMessenger } from '@/service/channel-talk';

const STORAGE_KEY = 'editorFeedback.lastShownDate';
const ASSISTANT_TURN_THRESHOLD = 3;
const AUTO_DISMISS_MS = 2000;

type Status = 'idle' | 'responded' | 'dismissed';

function getTodayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function isShownToday(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === getTodayDateString();
  } catch {
    return false;
  }
}

function markShownToday(): void {
  try {
    localStorage.setItem(STORAGE_KEY, getTodayDateString());
  } catch {
    // noop: localStorage may be blocked in some environments.
  }
}

export interface UseEditorFeedbackPromptReturn {
  visible: boolean;
  status: 'idle' | 'responded';
  isLiked: boolean;
  onLike: () => void;
  onDislike: () => void;
}

export function useEditorFeedbackPrompt(
  assistantMessageCount: number
): UseEditorFeedbackPromptReturn {
  const [status, setStatus] = useState<Status>('idle');
  const [isLiked, setIsLiked] = useState(false);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout>>();

  // 마운트 시점에 오늘 이미 표시했는지 한 번만 판단하고 고정
  const alreadyShownTodayRef = useRef(isShownToday());
  // 마운트 시점의 기존 메시지 수를 기준선으로 저장
  const initialCountRef = useRef(assistantMessageCount);

  const newMessageCount = assistantMessageCount - initialCountRef.current;
  const meetsThreshold = newMessageCount >= ASSISTANT_TURN_THRESHOLD;
  const visible =
    meetsThreshold && status !== 'dismissed' && !alreadyShownTodayRef.current;

  useEffect(() => {
    if (visible) {
      markShownToday();
    }
  }, [visible]);

  useEffect(() => {
    return () => {
      if (dismissTimerRef.current) {
        clearTimeout(dismissTimerRef.current);
      }
    };
  }, []);

  const scheduleDismiss = useCallback(() => {
    dismissTimerRef.current = setTimeout(() => {
      setStatus('dismissed');
    }, AUTO_DISMISS_MS);
  }, []);

  const onLike = useCallback(() => {
    setStatus('responded');
    setIsLiked(true);
    scheduleDismiss();
  }, [scheduleDismiss]);

  const onDislike = useCallback(() => {
    setStatus('responded');
    setIsLiked(false);
    showChannelTalkMessenger({ retryCount: 10, retryDelayMs: 100 });
    scheduleDismiss();
  }, [scheduleDismiss]);

  return {
    visible,
    status: status === 'dismissed' ? 'idle' : status,
    isLiked,
    onLike,
    onDislike
  };
}
