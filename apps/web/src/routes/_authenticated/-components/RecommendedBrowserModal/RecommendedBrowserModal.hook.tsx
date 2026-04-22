import { useEffect, useMemo } from 'react';
import { useLocalStorage } from 'usehooks-ts';
import { useModal } from '@/hooks/useModal';
import { RecommendedBrowserModal } from '@/routes/_authenticated/-components/RecommendedBrowserModal/RecommendedBrowserModal';

const BROWSER_RECOMMEND_DISMISSED_KEY = 'browserRecommendDismissedAt';

function isSameCalendarDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function isRecommendedBrowser(): boolean {
  if (typeof navigator === 'undefined') return true;
  const ua = navigator.userAgent;
  return /edg|chrome|crios/i.test(ua) && !/opr|opera/i.test(ua);
}

function getForceShowFromSearch(): boolean {
  if (typeof window === 'undefined') return false;
  return (
    new URLSearchParams(window.location.search).get('showBrowserRecommend') ===
    '1'
  );
}

let browserRecommendOpened = false;

/**
 * 인증 레이아웃 마운트 시, 비권장 브라우저(Chrome/Edge 아님)이면
 * 브라우저 권장 모달을 한 번만 띄운다.
 * 개발 시 URL에 ?showBrowserRecommend=1 로 강제 노출 가능.
 */
export function useRecommendedBrowserModal(): void {
  const modal = useModal();
  const [dismissedAt, setDismissedAt] = useLocalStorage<string | null>(
    BROWSER_RECOMMEND_DISMISSED_KEY,
    null
  );

  const isDismissedToday = useMemo(() => {
    if (!dismissedAt) return false;
    try {
      return isSameCalendarDay(new Date(dismissedAt), new Date());
    } catch {
      return false;
    }
  }, [dismissedAt]);

  useEffect(() => {
    const forceShow = getForceShowFromSearch();
    const shouldShow =
      !browserRecommendOpened &&
      (forceShow || (!isRecommendedBrowser() && !isDismissedToday));

    if (!shouldShow) return;

    const timer = setTimeout(() => {
      if (browserRecommendOpened) return;
      browserRecommendOpened = true;
      modal.openModal(({ isOpen, onClose }) => (
        <RecommendedBrowserModal
          isOpen={isOpen}
          onClose={onClose}
          onDismissForToday={() => {
            setDismissedAt(new Date().toISOString());
            onClose();
          }}
        />
      ));
    }, 0);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
