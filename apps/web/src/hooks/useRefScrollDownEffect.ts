import { useCombinedRefs, useRefEffect } from '@toss/react';

const scrollDown = (element: HTMLElement) => {
  if (element) {
    element.scrollTop = element.scrollHeight;
  }
};

export const useRefScrollDownEffect = <T extends HTMLElement>(
  condition: boolean,
  initialScroll: boolean = false,
  key?: string | number
) => {
  const observeRef = useRefEffect<T>(
    (element) => {
      const resizeObserver = new ResizeObserver(() => {
        if (condition) {
          scrollDown(element);
        }
      });

      const mutationObserver = new MutationObserver((mutationList) => {
        for (const mutation of mutationList) {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach((node) => {
              if (node instanceof Element) {
                resizeObserver.observe(node);
              }
            });
            mutation.removedNodes.forEach((node) => {
              if (node instanceof Element) {
                resizeObserver.unobserve(node);
              }
            });
          }
        }
      });

      mutationObserver.observe(element, { childList: true });

      return () => {
        resizeObserver.disconnect();
        mutationObserver.disconnect();
      };
    },
    [condition]
  );

  const mountEffectRef = useRefEffect<T>(
    (element) => {
      if (initialScroll) scrollDown(element);
    },
    [initialScroll, key]
  );

  return useCombinedRefs(observeRef, mountEffectRef);
};
