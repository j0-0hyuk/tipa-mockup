// utils/captureElementImage.ts
import { toPng, toJpeg } from 'html-to-image';

/** 외부(origin 다른) CSS 임시 비활성화 (필요할 때만) */
function temporarilyDisableExternalStyles() {
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

async function ensureFontsReady() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyDoc = document as any;
  if ('fonts' in document && anyDoc?.fonts?.ready) {
    try {
      await anyDoc.fonts.ready;
    } catch {
      /* ignore */
    }
  }
}

async function raf() {
  return new Promise<void>((r) => requestAnimationFrame(() => r()));
}
async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

/** 컨테이너 내 <img> 로딩/디코드 대기 */
async function waitImagesLoaded(root: HTMLElement) {
  const imgs = Array.from(root.querySelectorAll('img'));
  await Promise.all(
    imgs.map(
      (img) =>
        img.decode?.() ??
        new Promise((res) => {
          if (img.complete) return res(null);
          img.addEventListener('load', () => res(null), { once: true });
          img.addEventListener('error', () => res(null), { once: true });
        })
    )
  );
}

/** 레이아웃이 안정화될 때까지 2~3프레임 확인 */
async function waitStableLayout(node: HTMLElement, tries = 6) {
  let last = node.getBoundingClientRect();
  let stable = 0;
  for (let i = 0; i < tries; i++) {
    await raf();
    await sleep(10);
    const cur = node.getBoundingClientRect();
    const same =
      Math.abs(cur.width - last.width) < 0.5 &&
      Math.abs(cur.height - last.height) < 0.5;
    stable = same ? stable + 1 : 0;
    if (stable >= 2) return;
    last = cur;
  }
}

/** 한 번 캡처 시도 (포맷/해상도 지정) */
async function tryCaptureOnce(
  node: HTMLElement,
  fmt: 'png' | 'jpeg',
  pixelRatio: number,
  quality = 1
) {
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
    width: Math.round(w * pixelRatio), // 실제 PNG/JPEG 픽셀 크기
    height: Math.round(h * pixelRatio),
    pixelRatio,
    format: fmt as 'png' | 'jpeg'
  };
}

/** 옵션 */
export type CaptureOptions = {
  /** true면 외부 CSS를 먼저 비활성화하지 않고 시도(기본 true) */
  nonDestructiveFirst?: boolean;
  /** 첫 시도 픽셀 비율(기본 2) */
  firstPixelRatio?: number;
  /** 배경색 (투명 방지용) */
  backgroundColor?: string;
  /** 실패 시 JPEG 폴백 허용(기본 true) */
  allowJpegFallback?: boolean;
};

/** 반환 타입 */
export type CaptureResult = {
  dataUrl: string;
  width: number; // 이미지 intrinsic 픽셀
  height: number; // 이미지 intrinsic 픽셀
  pixelRatio: number;
  format: 'png' | 'jpeg';
};

/**
 * ✅ 재사용용 캡처 함수: 엘리먼트를 이미지(dataURL)로 반환
 * - 폰트/이미지 로드 대기 → 레이아웃 안정화 → PNG 시도 → 해상도 낮춰 재시도 →
 *   필요 시 외부 CSS 최소 비활성화 → 마지막에 JPEG 폴백
 */
export async function captureElementImage(
  node: HTMLElement,
  opts: CaptureOptions = {}
): Promise<CaptureResult> {
  const {
    nonDestructiveFirst = true,
    firstPixelRatio = 2,
    allowJpegFallback = true
  } = opts;

  if (!node || !(node instanceof HTMLElement)) {
    throw new Error('captureElementImage: node must be an HTMLElement');
  }
  if (node.offsetWidth === 0 || node.offsetHeight === 0) {
    // offscreen일 경우 visibility/position 등으로 실제 렌더되게 해야 함
    throw new Error('captureElementImage: target element has zero size');
  }

  await ensureFontsReady();
  await waitImagesLoaded(node);
  await waitStableLayout(node);

  // 1) 외부 CSS 건드리지 않고 시도
  if (nonDestructiveFirst) {
    try {
      return await tryCaptureOnce(node, 'png', firstPixelRatio, 1);
    } catch {
      // 2) 해상도 낮춰 재시도
      try {
        return await tryCaptureOnce(node, 'png', 1, 1);
      } catch {
        /* next */
      }
    }
  }

  // 3) 외부 CSS 최소 비활성화 후 재시도
  const restore = temporarilyDisableExternalStyles();
  try {
    try {
      return await tryCaptureOnce(node, 'png', 1, 1);
    } catch {
      // 4) 마지막 폴백: JPEG
      if (allowJpegFallback) {
        return await tryCaptureOnce(node, 'jpeg', 1, 0.92);
      }
      throw new Error('PNG capture failed and JPEG fallback is disabled');
    }
  } finally {
    restore();
  }
}

/** 여러 id를 한 번에 캡처 (data-docx-id 기준) */
export async function captureByIds(
  root: HTMLElement,
  ids: string[],
  options?: CaptureOptions
): Promise<Map<string, { capture: CaptureResult; info: string | null }>> {
  const map = new Map<
    string,
    { capture: CaptureResult; info: string | null }
  >();

  for (const id of ids) {
    const el = root.querySelector<HTMLElement>(
      `[data-docx-id="${CSS.escape(id)}"]`
    );
    if (!el) continue;

    try {
      const res = await captureElementImage(el, options);
      const info = el.getAttribute('data-docx-info');
      map.set(id, { capture: res, info });
    } catch (e) {
      console.warn('[captureByIds] fail:', id, e);
    }
  }

  return map;
}
