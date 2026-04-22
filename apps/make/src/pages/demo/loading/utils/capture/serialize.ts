export async function serializeSelfContainedHTML(
  root: HTMLElement
): Promise<string> {
  const clone = root.cloneNode(true) as HTMLElement;

  const imgs = Array.from(clone.querySelectorAll('img'));
  const imgPromises = imgs.map(async (img) => {
    const src = img.getAttribute('src');
    if (!src || src.startsWith('data:')) return;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const response = await fetch(src, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) return;

      const blob = await response.blob();
      if (blob.size > 10 * 1024 * 1024) {
        return;
      }

      const base64 = await new Promise<string>((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.onerror = reject;
        r.readAsDataURL(blob);
      });

      img.setAttribute('src', base64);
    } catch (error) {}
  });

  await Promise.all(imgPromises);

  return `<!doctype html><html><head><meta charset="utf-8"></head><body>${clone.outerHTML}</body></html>`;
}
