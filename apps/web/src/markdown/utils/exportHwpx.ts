import { exportMarkdownCanvasToDocument } from '@/markdown/utils/exportDocx';

export async function exportHwpx({ itemName }: { itemName: string }) {
  // 1. 먼저 DOCX로 생성
  const docxBlob = await exportMarkdownCanvasToDocument('맑은 고딕');
  if (!docxBlob) return;

  const url = URL.createObjectURL(docxBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${itemName}.hwpx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
