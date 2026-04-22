import type {
  CaptureElementResult,
  CaptureOptions
} from '@/apps/make/src/pages/demo/loading/utils/capture/types';
import { captureElementImageLocal } from '@/apps/make/src/pages/demo/loading/utils/capture/local';
import { serializeSelfContainedHTML } from '@/apps/make/src/pages/demo/loading/utils/capture/serialize';
import { captureWithServer } from '@/apps/make/src/pages/demo/loading/utils/capture/server';

export async function captureAllElements(
  root: HTMLElement,
  options: CaptureOptions = {}
): Promise<CaptureElementResult[]> {
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-docx-id]'));

  if (els.length === 0) {
    return [];
  }

  const local: CaptureElementResult[] = [];
  let localOk = true;

  for (const el of els) {
    try {
      const res = await captureElementImageLocal(el, options);
      const id = el.getAttribute('data-docx-id') || 'unknown';
      const info = el.getAttribute('data-docx-info') || '';
      const name = `${el.getAttribute('data-docx-capture') || 'capture'}-${id}.${res.format === 'png' ? 'png' : 'jpg'}`;
      const file = await (await fetch(res.dataUrl)).blob().then(
        (b) =>
          new File([b], name, {
            type: b.type || (res.format === 'png' ? 'image/png' : 'image/jpeg')
          })
      );
      local.push({ file, name, info });
    } catch (e) {
      localOk = false;
      break;
    }
  }

  const needServer =
    options.allowServerFallback !== false &&
    (!localOk ||
      document.visibilityState !== 'visible' ||
      local.length !== els.length);

  if (!needServer) return local;

  const ids = els.map((el) => el.getAttribute('data-docx-id') || 'unknown');
  const html = await serializeSelfContainedHTML(root);
  const serverMap = await captureWithServer(
    html,
    ids,
    options.serverWidth ?? 1200
  );

  const out: CaptureElementResult[] = [];
  for (const el of els) {
    const id = el.getAttribute('data-docx-id') || 'unknown';
    const item = serverMap.get(id);
    if (!item) continue;
    const info = el.getAttribute('data-docx-info') || '';
    const name = `${el.getAttribute('data-docx-capture') || 'capture'}-${id}.png`;
    const file = await (await fetch(item.dataUrl))
      .blob()
      .then((b) => new File([b], name, { type: 'image/png' }));
    out.push({ file, name, info: item.info ?? info });
  }

  const got = new Set(out.map((r) => r.name));
  for (const r of local) {
    if (!got.has(r.name)) {
      out.push(r);
    }
  }

  return out;
}

export type {
  CaptureOptions,
  CaptureResult,
  CaptureElementResult
} from '@/apps/make/src/pages/demo/loading/utils/capture/types';
export { findCaptureElements } from '@/apps/make/src/pages/demo/loading/utils/capture/dom-utils';
