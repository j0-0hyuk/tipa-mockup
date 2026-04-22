import { syncDiffIdsFromDOM, useDiffNavStore } from '@/store/useDiffNavStore';
import { scrollToId } from '@/utils/scroll';
import { useLayoutEffect, useRef, useEffect } from 'react';

export function DiffNavController() {
  const ids = useDiffNavStore((s) => s.ids);
  const prevLenRef = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useLayoutEffect(() => {
    const pagedArea = document.querySelector<HTMLElement>('.pagedjs-preview-area');
    syncDiffIdsFromDOM(pagedArea ?? document);
  }, []);

  useEffect(() => {
    const pagedArea = document.querySelector('.pagedjs-preview-area');
    if (!pagedArea) return;

    const debouncedSync = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        syncDiffIdsFromDOM(pagedArea);
      }, 50);
    };

    const handlePagedRendered = () => {
      debouncedSync();
    };

    pagedArea.addEventListener('pagedjs-rendered', handlePagedRendered);

    const observer = new MutationObserver(() => {
      debouncedSync();
    });

    observer.observe(pagedArea, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['id', 'data-diffwrap']
    });

    debouncedSync();

    return () => {
      pagedArea.removeEventListener('pagedjs-rendered', handlePagedRendered);
      observer.disconnect();
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useLayoutEffect(() => {
    if (prevLenRef.current === 0 && ids.length > 0) {
      const pagedArea =
        document.querySelector<HTMLElement>('.pagedjs-preview-area');
      scrollToId(ids[0], { root: pagedArea, mode: 'instant' });
    }
    prevLenRef.current = ids.length;
  }, [ids.length]);

  return null;
}
