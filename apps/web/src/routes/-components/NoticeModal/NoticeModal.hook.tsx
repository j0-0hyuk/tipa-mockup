import { useEffect } from 'react';
import { useModal } from '@/hooks/useModal';
import {
  hasRecentNotices,
  LATEST_NOTICE_VERSION,
  NoticeModal
} from '@/routes/-components/NoticeModal/NoticeModal';

const NOTICE_MODAL_STORAGE_KEY = 'noticeModal.lastSeen';

let noticeModalOpened = false;

function hasSeenLatestNotice(): boolean {
  try {
    const lastSeen = localStorage.getItem(NOTICE_MODAL_STORAGE_KEY);
    return lastSeen !== null && lastSeen >= LATEST_NOTICE_VERSION;
  } catch {
    return false;
  }
}

function markNoticeModalSeen(): void {
  try {
    localStorage.setItem(NOTICE_MODAL_STORAGE_KEY, LATEST_NOTICE_VERSION);
  } catch {
    // noop: localStorage may be blocked in some environments.
  }
}

export function useNoticeModal(): void {
  const { openModal } = useModal();

  useEffect(() => {
    if (import.meta.env.VITE_IS_PROTOTYPE === 'true') return;
    if (noticeModalOpened) return;
    if (!hasRecentNotices()) return;
    if (hasSeenLatestNotice()) return;

    const timer = setTimeout(() => {
      if (noticeModalOpened) return;

      noticeModalOpened = true;
      markNoticeModalSeen();

      openModal(({ isOpen, onClose }) => (
        <NoticeModal isOpen={isOpen} onClose={onClose} />
      ));
    }, 0);

    return () => clearTimeout(timer);
  }, [openModal]);
}
