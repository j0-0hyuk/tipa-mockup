import scrollIntoView from 'scroll-into-view-if-needed';

const escapeSelector = (value: string) => {
  if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
    return CSS.escape(value);
  }
  return value.replace(/([!"#$%&'()*+,./:;<=>?@[\]^`{|}~])/g, '\\$1');
};

const getElementByIdInRoot = (id: string, root?: ParentNode | null) => {
  if (!root || root === document) {
    return document.getElementById(id);
  }

  if ('querySelector' in root) {
    return root.querySelector<HTMLElement>(`#${escapeSelector(id)}`);
  }

  return document.getElementById(id);
};

const getDiffTargetElement = (id: string, root?: ParentNode | null) => {
  return (
    getElementByIdInRoot(id, root) ??
    getElementByIdInRoot(`${id}-apply`, root) ??
    getElementByIdInRoot(`${id}-cancel`, root)
  );
};

const getCanvasScrollContainer = (el: HTMLElement) => {
  return el.closest<HTMLElement>('[data-canvas-scroll-container="true"]');
};

type ScrollMode = 'linear-fast' | 'instant';

const activeScrollAnimations = new WeakMap<HTMLElement, number>();

const cancelScrollAnimation = (container: HTMLElement) => {
  const rafId = activeScrollAnimations.get(container);
  if (rafId !== undefined) {
    window.cancelAnimationFrame(rafId);
    activeScrollAnimations.delete(container);
  }
};

const animateScrollTopLinear = (
  container: HTMLElement,
  targetTop: number,
  durationMs: number
) => {
  cancelScrollAnimation(container);

  const startTop = container.scrollTop;
  const distance = targetTop - startTop;
  if (Math.abs(distance) < 1) {
    container.scrollTop = targetTop;
    return;
  }

  const startTime = window.performance.now();

  const tick = (now: number) => {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / durationMs, 1);
    container.scrollTop = startTop + distance * progress;

    if (progress >= 1) {
      activeScrollAnimations.delete(container);
      return;
    }

    const rafId = window.requestAnimationFrame(tick);
    activeScrollAnimations.set(container, rafId);
  };

  const rafId = window.requestAnimationFrame(tick);
  activeScrollAnimations.set(container, rafId);
};

const scrollElementToContainerCenter = (el: HTMLElement, container: HTMLElement) => {
  const containerRect = container.getBoundingClientRect();
  const elementRect = el.getBoundingClientRect();
  const relativeTop = elementRect.top - containerRect.top + container.scrollTop;
  const centeredTop = relativeTop - (container.clientHeight - elementRect.height) / 2;
  const top = Math.max(0, centeredTop);

  return top;
};

export function scrollToId(
  id?: string | null,
  options?: { root?: ParentNode | null; mode?: ScrollMode }
) {
  if (!id) return;
  const el = getDiffTargetElement(id, options?.root);
  if (!el) return;

  const mode = options?.mode ?? 'linear-fast';
  const scrollContainer = getCanvasScrollContainer(el);
  if (scrollContainer) {
    const targetTop = scrollElementToContainerCenter(el, scrollContainer);
    if (mode === 'instant') {
      cancelScrollAnimation(scrollContainer);
      scrollContainer.scrollTop = targetTop;
      return;
    }

    animateScrollTopLinear(scrollContainer, targetTop, 180);
    return;
  }

  scrollIntoView(el, {
    behavior: mode === 'instant' ? 'auto' : 'smooth',
    block: 'center',
    inline: 'nearest',
    scrollMode: 'if-needed'
  });
}
