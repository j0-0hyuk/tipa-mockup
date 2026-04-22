/** Download a Uint8Array as a file (browser-only). */
export function downloadBytes(
  bytes: Uint8Array,
  filename: string,
  mimeType = "application/hwpx",
): void {
  const blob = new Blob([bytes.buffer as ArrayBuffer], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
