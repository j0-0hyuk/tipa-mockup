import { toPng, toJpeg } from 'html-to-image';
import type {
  CaptureOptions,
  CaptureResult
} from '@/apps/make/src/pages/demo/loading/utils/capture/types';
import {
  ensureFontsReady,
  waitImagesLoaded,
  waitStableLayout,
  temporarilyDisableExternalStyles
} from '@/apps/make/src/pages/demo/loading/utils/capture/dom-utils';

async function tryOnce(
  node: HTMLElement,
  fmt: 'png' | 'jpeg',
  pixelRatio: number,
  quality = 1
): Promise<CaptureResult> {
  const w = node.offsetWidth;
  const h = node.offsetHeight;

  const common = {
    cacheBust: true,
    pixelRatio,
    quality,
    skipFonts: true,
    style: {
      width: `${w}px`,
      height: `${h + 1}px`,
      transform: 'none',
      animation: 'none',
      transition: 'none'
    } as Partial<CSSStyleDeclaration>
  };

  const dataUrl =
    fmt === 'png' ? await toPng(node, common) : await toJpeg(node, common);

  return {
    dataUrl,
    width: Math.round(w * pixelRatio),
    height: Math.round(h * pixelRatio),
    pixelRatio,
    format: fmt
  };
}

export async function captureElementImageLocal(
  node: HTMLElement,
  opts: CaptureOptions = {}
): Promise<CaptureResult> {
  const {
    firstPixelRatio = 2,
    allowJpegFallback = true,
    nonDestructiveFirst = true
  } = opts;

  if (!node || !(node instanceof HTMLElement)) {
    throw new Error('captureElementImageLocal: node must be an HTMLElement');
  }

  let w = node.offsetWidth;
  let h = node.offsetHeight;

  if (w === 0 || h === 0) {
    if (!(node.style as any).width) {
      (node.style as any).width = '1200px';
    }
    if (!(node.style as any).minHeight) {
      (node.style as any).minHeight = '1px';
    }
    await new Promise((r) => setTimeout(r, 50));
    w = node.offsetWidth;
    h = node.offsetHeight;
    if (w === 0 || h === 0) {
      throw new Error(
        'captureElementImageLocal: target element has zero size after force-size'
      );
    }
  }

  await ensureFontsReady();
  await waitImagesLoaded(node);
  await waitStableLayout(node);

  if (nonDestructiveFirst) {
    try {
      return await tryOnce(node, 'png', firstPixelRatio, 1);
    } catch {
      try {
        return await tryOnce(node, 'png', 1, 1);
      } catch {
        /* next */
      }
    }
  }

  const restore = temporarilyDisableExternalStyles();
  try {
    try {
      return await tryOnce(node, 'png', firstPixelRatio, 1);
    } catch {
      try {
        return await tryOnce(node, 'png', 1, 1);
      } catch {
        if (allowJpegFallback) {
          return await tryOnce(node, 'jpeg', 1, 0.92);
        }
        throw new Error('PNG capture failed and JPEG fallback is disabled');
      }
    }
  } finally {
    restore();
  }
}
