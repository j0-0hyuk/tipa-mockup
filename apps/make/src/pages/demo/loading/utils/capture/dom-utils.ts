export async function waitUntilVisible(timeoutMs = 20000): Promise<void> {
  if (document.visibilityState === 'visible') return;
  await new Promise<void>((res, rej) => {
    const t = setTimeout(() => rej(new Error('visible timeout')), timeoutMs);
    const onVis = () => {
      if (document.visibilityState === 'visible') {
        clearTimeout(t);
        document.removeEventListener('visibilitychange', onVis);
        res();
      }
    };
    document.addEventListener('visibilitychange', onVis);
  });
}

export async function ensureFontsReady(): Promise<void> {
  const anyDoc = document as any;
  if ('fonts' in document && anyDoc?.fonts?.ready) {
    try {
      await anyDoc.fonts.ready;
    } catch {
      /* ignore */
    }
  }
}

export async function waitImagesLoaded(root: HTMLElement): Promise<void> {
  const imgs = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    imgs.map(
      (img) =>
        img.decode?.() ??
        new Promise<void>((res) => {
          if (img.complete) return res();
          const timeout = setTimeout(() => res(), 5000);
          img.addEventListener(
            'load',
            () => {
              clearTimeout(timeout);
              res();
            },
            { once: true }
          );
          img.addEventListener(
            'error',
            () => {
              clearTimeout(timeout);
              res();
            },
            { once: true }
          );
        })
    )
  );
}

export async function waitStableLayout(
  node: HTMLElement,
  tries = 6
): Promise<void> {
  let last = node.getBoundingClientRect();
  let stable = 0;
  for (let i = 0; i < tries; i++) {
    await new Promise<void>((r) => requestAnimationFrame(() => r()));
    await new Promise((r) => setTimeout(r, 10));
    const cur = node.getBoundingClientRect();
    const same =
      Math.abs(cur.width - last.width) < 0.5 &&
      Math.abs(cur.height - last.height) < 0.5;
    stable = same ? stable + 1 : 0;
    if (stable >= 2) return;
    last = cur;
  }
}

export function temporarilyDisableExternalStyles(): () => void {
  const changed: HTMLLinkElement[] = [];
  const links = Array.from(
    document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
  );
  for (const link of links) {
    try {
      const href = link.href;
      if (!href) continue;
      const origin = new URL(href, location.href).origin;
      if (
        origin !== location.origin &&
        !link.disabled &&
        !link.dataset.docxIgnoreCors
      ) {
        link.disabled = true;
        changed.push(link);
      }
    } catch {
      /* ignore */
    }
  }
  return () => {
    for (const link of changed) link.disabled = false;
  };
}

export function findCaptureElements(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>('[data-docx-id]'));
}
