import { useEffect } from 'react';

interface UsePreventLeaveOptions {
  shouldPrevent: boolean;
  message?: string;
  backMessage?: string;
}

export function usePreventLeave({
  shouldPrevent,
  message = '작업 중인 내용이 있습니다. 새로고침하거나 나가면 모든 내용이 사라집니다. 정말 나가시겠습니까?',
  backMessage = '작업 중인 내용이 있습니다. 뒤로가기를 하면 모든 내용이 사라집니다. 정말 나가시겠습니까?'
}: UsePreventLeaveOptions) {
  useEffect(() => {
    if (!shouldPrevent) return;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };

    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      const confirmLeave = window.confirm(backMessage);
      if (!confirmLeave) {
        window.history.pushState(null, '', window.location.href);
      }
    };
    window.history.pushState(null, '', window.location.href);

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [shouldPrevent, message, backMessage]);
}
