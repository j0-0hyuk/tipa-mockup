import { useEffect, useRef } from 'react';
import { useDebounceCallback } from 'usehooks-ts';
import { useBreakPoints } from '@/hooks/useBreakPoints';

export const usePagedPreview = (
  document: string,
  style?: string,
  options?: { blur?: boolean }
) => {
  // custom pagination으로 전환됐지만 외부 시그니처 호환성을 유지한다.
  void style;

  const escapeSelector = (value: string) => {
    if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
      return CSS.escape(value);
    }
    return value.replace(/([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g, '\\$1');
  };

  const contentRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const skipScrollRestoreRef = useRef(false);
  const { sm } = useBreakPoints();

  const runPagedJs = useDebounceCallback(async () => {
    // Streamdown 모바일 축소 스케일(0.45)과 동일해야 한다.
    const mobileScale = sm ? 0.45 : 1;
    const pageWidth = sm ? '345.6px' : '768px';
    const pageHeight = sm ? '517.5px' : '1150px';
    const pageMarginMm = sm ? 10 : 20;
    const pageMarginPx = Math.round(pageMarginMm * 3.7795275591);
    const fontSize = sm ? '10px' : '16px';
    const pageWidthPx = Number.parseFloat(pageWidth);
    const pageHeightPx = Number.parseFloat(pageHeight);
    const source = previewRef.current;
    const target = contentRef.current;
    if (!source || !target || !source.innerHTML.trim()) return;

    const scrollContainer = target.closest<HTMLElement>(
      '[data-canvas-scroll-container="true"]'
    );
    const skipScrollRestore = skipScrollRestoreRef.current;
    skipScrollRestoreRef.current = false;
    const prevScrollTop = scrollContainer?.scrollTop ?? 0;
    const prevHeight = target.getBoundingClientRect().height;

    if (prevHeight > 0) {
      target.style.minHeight = `${Math.ceil(prevHeight)}px`;
    }

    const createPage = (pageNumber: number) => {
      const page = window.document.createElement('div');
      page.className = 'pagedjs_page';
      page.id = `page-${pageNumber}`;
      page.dataset.pageNumber = String(pageNumber);
      page.style.width = `${pageWidthPx}px`;
      page.style.height = `${pageHeightPx}px`;
      page.style.position = 'relative';
      page.style.boxSizing = 'border-box';
      page.style.fontSize = fontSize;
      page.style.overflow = 'hidden';

      const content = window.document.createElement('div');
      content.className = 'pagedjs_page_content';
      content.style.position = 'absolute';
      content.style.left = `${pageMarginPx}px`;
      content.style.right = `${pageMarginPx}px`;
      content.style.top = `${pageMarginPx}px`;
      content.style.bottom = `${pageMarginPx + 24}px`;
      content.style.overflow = 'hidden';

      const footer = window.document.createElement('div');
      footer.className = 'pagedjs_page_footer';
      footer.style.position = 'absolute';
      footer.style.left = '0';
      footer.style.right = '0';
      footer.style.bottom = `${Math.max(6, Math.floor(pageMarginPx * 0.35))}px`;
      footer.style.textAlign = 'center';
      footer.style.fontSize = sm ? '10px' : '12px';
      footer.style.color = '#6F7580';
      footer.textContent = `- ${pageNumber} -`;

      page.appendChild(content);
      page.appendChild(footer);
      return { page, content };
    };

    const isMeaningfulNode = (node: Node) => {
      if (node.nodeType !== Node.TEXT_NODE) return true;
      return (node.textContent ?? '').trim().length > 0;
    };

    const extractPageSource = () => {
      const template = window.document.createElement('div');
      for (const node of Array.from(source.childNodes)) {
        template.appendChild(node.cloneNode(true));
      }

      const wrapperTemplates: HTMLElement[] = [];
      let blockParent: ParentNode = template;

      while (true) {
        const meaningfulNodes = Array.from(blockParent.childNodes).filter(
          isMeaningfulNode
        );
        if (meaningfulNodes.length !== 1) break;

        const single = meaningfulNodes[0];
        if (!(single instanceof HTMLElement)) break;

        const wrapper = single.cloneNode(false) as HTMLElement;
        if (sm && wrapperTemplates.length === 0) {
          // 모바일 축소 래퍼(height: 225%)가 페이지 분할 높이 계산을 왜곡하지 않도록 보정한다.
          wrapper.style.height = 'auto';
        }
        wrapperTemplates.push(wrapper);
        blockParent = single;
      }

      let blocks = Array.from(blockParent.childNodes).filter(isMeaningfulNode);

      // 블록 추출이 불가능한 경우 전체 HTML을 단일 블록으로 처리한다.
      if (blocks.length === 0 && source.innerHTML.trim().length > 0) {
        const fallback = window.document.createElement('div');
        for (const node of Array.from(source.childNodes)) {
          fallback.appendChild(node.cloneNode(true));
        }
        blocks = [fallback];
        return { wrapperTemplates: [], blocks };
      }

      return { wrapperTemplates, blocks };
    };

    try {
      target.innerHTML = '';

      const { wrapperTemplates, blocks } = extractPageSource();
      if (blocks.length === 0) {
        target.dispatchEvent(new CustomEvent('pagedjs-rendered'));
        return;
      }

      let pageNumber = 1;
      let current = createPage(pageNumber++);
      let currentRoot: HTMLElement = current.content;
      if (wrapperTemplates.length > 0) {
        for (const wrapperTemplate of wrapperTemplates) {
          const wrapper = wrapperTemplate.cloneNode(false) as HTMLElement;
          currentRoot.appendChild(wrapper);
          currentRoot = wrapper;
        }
      }
      target.appendChild(current.page);

      const getMaxHeight = () => {
        const baseHeight =
          current.content.clientHeight || pageHeightPx - pageMarginPx * 2 - 24;
        return mobileScale < 1 ? baseHeight / mobileScale : baseHeight;
      };

      const expandCurrentPageToFit = () => {
        const tries = 6;

        for (let i = 0; i < tries; i += 1) {
          const maxHeight = getMaxHeight();
          const overflow = current.content.scrollHeight - (maxHeight + 1);
          if (overflow <= 0) return true;

          const currentPageHeight =
            current.page.getBoundingClientRect().height ||
            Number.parseFloat(current.page.style.height) ||
            pageHeightPx;
          const visualDelta =
            mobileScale < 1 ? overflow * mobileScale : overflow;

          current.page.style.height = `${Math.ceil(currentPageHeight + visualDelta + 2)}px`;
        }

        return current.content.scrollHeight <= getMaxHeight() + 1;
      };

      for (const block of blocks) {
        const node = block.cloneNode(true);
        currentRoot.appendChild(node);

        const maxHeight = getMaxHeight();
        const overflowed = current.content.scrollHeight > maxHeight + 1;

        if (!overflowed) continue;

        currentRoot.removeChild(node);
        const hasExistingContent = currentRoot.childNodes.length > 0;

        if (hasExistingContent) {
          current = createPage(pageNumber++);
          target.appendChild(current.page);
          currentRoot = current.content;
          if (wrapperTemplates.length > 0) {
            for (const wrapperTemplate of wrapperTemplates) {
              const wrapper = wrapperTemplate.cloneNode(false) as HTMLElement;
              currentRoot.appendChild(wrapper);
              currentRoot = wrapper;
            }
          }
        }

        currentRoot.appendChild(node);

        // 페이지보다 큰 단일 블록은 페이지 높이를 늘려 잘림을 방지한다.
        const stillOverflowed = current.content.scrollHeight > getMaxHeight() + 1;
        if (stillOverflowed) {
          const fitted = expandCurrentPageToFit();
          if (!fitted) {
            current.content.style.overflow = 'visible';
          }
        }
      }

      target.dispatchEvent(new CustomEvent('pagedjs-rendered'));

      // 렌더 직후 스크롤이 상단으로 클램프되는 현상을 복원한다.
      if (scrollContainer && !skipScrollRestore) {
        requestAnimationFrame(() => {
          scrollContainer.scrollTop = prevScrollTop;
          window.setTimeout(() => {
            if (scrollContainer.scrollTop < prevScrollTop - 2) {
              scrollContainer.scrollTop = prevScrollTop;
            }
          }, 120);
        });
      }
    } finally {
      target.style.minHeight = '';
    }
  }, 500);

  useEffect(() => {
    const source = previewRef.current;
    const content = contentRef.current;
    if (!source) return;

    if (options?.blur && content) {
      content.style.filter = 'blur(8px)';
      content.style.webkitFilter = 'blur(8px)';
    } else if (content) {
      content.style.filter = '';
      content.style.webkitFilter = '';
    }

    const observer = new MutationObserver(() => runPagedJs());
    observer.observe(source, {
      childList: true,
      subtree: true,
      characterData: true
    });

    runPagedJs();

    return () => {
      observer.disconnect();
      runPagedJs.cancel();
    };
  }, [document, runPagedJs, options?.blur]);

  useEffect(() => {
    const content = contentRef.current;
    const preview = previewRef.current;
    if (!content || !preview) return;

    const handleProxyClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      const diffButton = target.closest<HTMLButtonElement>(
        'button[id$="-apply"], button[id$="-cancel"]'
      );
      if (diffButton?.id) {
        e.preventDefault();
        // diff 적용/취소 직후에는 다음 타깃으로 이동해야 하므로 기존 위치 복원을 1회 건너뛴다.
        skipScrollRestoreRef.current = true;

        const proxyButton = preview.querySelector<HTMLButtonElement>(
          `button#${escapeSelector(diffButton.id)}`
        );
        proxyButton?.click();
        return;
      }

      const popoverWrapper = target.closest('.popover-trigger-wrapper');
      if (popoverWrapper) {
        const trigger = popoverWrapper.querySelector('button[id]');
        if (trigger && (target === trigger || trigger.contains(target))) {
          e.preventDefault();
          e.stopPropagation();

          const isActive = popoverWrapper.classList.contains('active');
          popoverWrapper.classList.toggle('active');

          if (!isActive) {
            requestAnimationFrame(() => {
              const popoverContent = popoverWrapper.querySelector(
                '.popover-content'
              ) as HTMLElement;
              if (!popoverContent) return;

              if (!popoverWrapper.classList.contains('active')) return;
              const originalDisplay = popoverContent.style.display;
              popoverContent.style.display = 'flex';
              popoverContent.style.visibility = 'hidden';

              const rect = popoverContent.getBoundingClientRect();
              const wrapperRect = popoverWrapper.getBoundingClientRect();
              const viewportHeight = window.innerHeight;

              const spaceBelow = viewportHeight - wrapperRect.bottom;
              const spaceAbove = wrapperRect.top;
              const neededSpace = rect.height + 8;

              if (neededSpace > spaceBelow && spaceAbove > spaceBelow) {
                popoverContent.classList.add('bottom');
              } else {
                popoverContent.classList.remove('bottom');
              }
              popoverContent.style.display = originalDisplay;
              popoverContent.style.visibility = '';
            });
          } else {
            const popoverContent = popoverWrapper.querySelector(
              '.popover-content'
            ) as HTMLElement;
            if (popoverContent) {
              popoverContent.classList.remove('bottom');
            }
          }
          return;
        }
      }
    };

    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const popoverWrapper = target.closest('.popover-trigger-wrapper');
      const popoverContent = target.closest('.popover-content');
      if (!popoverWrapper && !popoverContent) {
        content
          .querySelectorAll('.popover-trigger-wrapper.active')
          .forEach((wrapper) => {
            wrapper.classList.remove('active');
          });
      }
    };

    content.addEventListener('click', handleProxyClick);
    window.document.addEventListener('click', handleOutsideClick);
    return () => {
      content.removeEventListener('click', handleProxyClick);
      window.document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return {
    contentRef,
    previewRef
  };
};
