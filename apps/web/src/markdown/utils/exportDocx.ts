// utils/exportDocx.ts
import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  ImageRun
} from 'docx';
import i18n from '@/i18n';
import { captureByIds, type CaptureResult } from '@/markdown/utils/capture';
import { blobDownload } from '@/utils/blobDownload';

function getContentMaxWidthPx() {
  const INCH_TO_PX = 96;
  const pageWidthIn = 8.27;
  const marginLeftIn = 1;
  const marginRightIn = 1;
  return Math.round((pageWidthIn - marginLeftIn - marginRightIn) * INCH_TO_PX);
}

function pxToTwip(px: number) {
  return Math.round(px * 15);
}

function getContentMaxWidthTwip() {
  return pxToTwip(getContentMaxWidthPx());
}

function replaceInCloneWithCapturedImages(
  clonedRoot: HTMLElement,
  captured: Map<string, CaptureResult>,
  maxWidthPx: number
) {
  const nodes = Array.from(
    clonedRoot.querySelectorAll<HTMLElement>(
      '[data-docx-capture][data-docx-id]'
    )
  );

  for (const node of nodes) {
    const id = node.dataset.docxId!;
    const cap = captured.get(id);
    if (!cap) continue;

    const iw = cap.width || 1200;
    const ih = cap.height || 675;
    const w = Math.min(iw, maxWidthPx);
    const h = Math.round((ih * w) / Math.max(1, iw));

    const img = document.createElement('img');
    img.src = cap.dataUrl;
    img.alt = node.getAttribute('data-docx-capture') || 'block';
    img.style.width = '100%';
    img.style.height = 'auto';

    img.setAttribute('data-final-width', String(w));
    img.setAttribute('data-final-height', String(h));

    node.replaceWith(img);
  }
}

function parseListItemsToParagraphs(
  listElement: Element,
  fontFamily: string,
  listLevel: number = 0
): Paragraph[] {
  const paragraphs: Paragraph[] = [];
  const isOrdered = listElement.tagName.toLowerCase() === 'ol';
  const reference = isOrdered ? 'ol' : 'ul';

  Array.from(listElement.children).forEach((li) => {
    if (li.tagName.toLowerCase() !== 'li') {
      // li가 아닌 요소는 무시하거나 재귀적으로 처리
      return;
    }

    // li 내부의 직접적인 자식들을 순서대로 처리
    const runs: TextRun[] = [];
    const nestedLists: Array<{ element: Element; index: number }> = [];

    // li의 직접적인 자식들을 처리하면서 리스트 위치 기록
    Array.from(li.childNodes).forEach((child, index) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const text = child.textContent || '';
        if (text.trim()) {
          runs.push(
            new TextRun({
              text: text.trim(),
              color: '000000',
              size: 20,
              font: fontFamily
            })
          );
        }
      } else if (child instanceof Element) {
        const childTag = child.tagName.toLowerCase();

        // 중첩된 리스트는 나중에 처리하기 위해 저장
        if (childTag === 'ul' || childTag === 'ol') {
          nestedLists.push({ element: child, index });
          return; // 리스트는 별도로 처리
        }

        // 텍스트 포맷팅 처리
        if (childTag === 'strong' || childTag === 'b') {
          const text = child.textContent || '';
          if (text) {
            runs.push(
              new TextRun({
                text,
                bold: true,
                color: '000000',
                size: 20,
                font: fontFamily
              })
            );
          }
        } else if (childTag === 'em' || childTag === 'i') {
          const text = child.textContent || '';
          if (text) {
            runs.push(
              new TextRun({
                text,
                italics: true,
                color: '000000',
                size: 20,
                font: fontFamily
              })
            );
          }
        } else if (childTag === 'code') {
          const text = child.textContent || '';
          if (text) {
            runs.push(
              new TextRun({
                text,
                font: 'Consolas',
                color: '333333',
                size: 20
              })
            );
          }
        } else if (childTag === 'a') {
          const text = child.textContent || '';
          if (text) {
            runs.push(
              new TextRun({
                text,
                underline: {},
                color: '0563C1',
                size: 20,
                font: fontFamily
              })
            );
          }
        } else if (childTag === 'p') {
          // p 태그 내부의 텍스트 처리
          const text = child.textContent || '';
          if (text.trim()) {
            runs.push(
              new TextRun({
                text: text.trim(),
                color: '000000',
                size: 20,
                font: fontFamily
              })
            );
          }
        } else {
          // 기타 요소는 텍스트 내용만 추출
          const text = child.textContent || '';
          if (text.trim()) {
            runs.push(
              new TextRun({
                text: text.trim(),
                color: '000000',
                size: 20,
                font: fontFamily
              })
            );
          }
        }
      }
    });

    // 리스트 왼쪽 마진: 기본 200 + 레벨당 360씩 증가
    // 이 값을 더 크게 하면 리스트가 더 오른쪽으로 이동합니다
    const indentLeft = 400 + listLevel * 360; // 기본 마진을 200에서 400으로 증가
    const hanging = 300;

    // 리스트 항목의 텍스트가 있으면 Paragraph 생성
    // 텍스트가 없어도 빈 Paragraph를 생성하여 리스트 구조 유지
    if (runs.length > 0 || nestedLists.length === 0) {
      paragraphs.push(
        new Paragraph({
          children:
            runs.length > 0
              ? runs
              : [
                  new TextRun({
                    text: '',
                    color: '000000',
                    size: 20,
                    font: fontFamily
                  })
                ],
          numbering: { reference, level: listLevel },
          indent: { left: indentLeft, hanging }
        })
      );
    }

    // 중첩된 리스트들을 순서대로 처리
    nestedLists.forEach(({ element: nestedList }) => {
      const nestedParagraphs = parseListItemsToParagraphs(
        nestedList,
        fontFamily,
        listLevel + 1
      );
      paragraphs.push(...nestedParagraphs);
    });
  });

  return paragraphs;
}

function parseElementToDocxChildren(
  el: Element,
  fontFamily: string
): (Paragraph | Table)[] {
  const out: (Paragraph | Table)[] = [];

  const walk = (node: Element | ChildNode) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = (node.textContent || '')
        .replace(/\s+\n/g, '\n')
        .replace(/\s{2,}/g, ' ');
      if (text.trim()) {
        out.push(
          new Paragraph({
            children: [
              new TextRun({
                text,
                color: '000000',
                size: 20,
                font: fontFamily
              })
            ]
          })
        );
      }
      return;
    }

    if (!(node instanceof Element)) return;

    const tag = node.tagName.toLowerCase();

    // 페이지 번호 footer/margin 텍스트는 본문 DOCX에 포함하지 않는다.
    if (
      node.classList.contains('pagedjs_page_footer') ||
      node.classList.contains('pagedjs_margin-content')
    ) {
      return;
    }

    if (tag === 'h1' || tag === 'h2' || tag === 'h3') {
      const level =
        tag === 'h1'
          ? HeadingLevel.HEADING_1
          : tag === 'h2'
            ? HeadingLevel.HEADING_2
            : HeadingLevel.HEADING_3;

      const fontSize = tag === 'h1' ? 30 : tag === 'h2' ? 24 : 22;

      out.push(
        new Paragraph({
          heading: level,
          children: [
            new TextRun({
              text: node.textContent || '',
              color: '000000',
              bold: true,
              size: fontSize,
              font: fontFamily
            })
          ],
          spacing: {
            before: tag === 'h1' ? 200 : tag === 'h2' ? 150 : 100,
            after: tag === 'h1' ? 100 : tag === 'h2' ? 50 : 30
          }
        })
      );
      return;
    }

    if (tag === 'blockquote') {
      const allText = node.textContent || '';

      const runs: TextRun[] = [];
      if (allText.trim()) {
        runs.push(
          new TextRun({
            text: allText,
            color: '000000',
            size: 20,
            font: fontFamily
          })
        );
      }

      const blockquoteWidthTwip = getContentMaxWidthTwip();
      out.push(
        new Table({
          width: { size: blockquoteWidthTwip, type: WidthType.DXA },
          columnWidths: [blockquoteWidthTwip],
          layout: 'fixed',
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: runs.length
                        ? runs
                        : [
                            new TextRun({
                              text: '',
                              color: '000000',
                              size: 20,
                              font: fontFamily
                            })
                          ],
                      spacing: { before: 0, after: 0 }
                    })
                  ],
                  margins: {
                    top: 200,
                    bottom: 200,
                    left: 100,
                    right: 100
                  },
                  shading: {
                    type: 'clear',
                    fill: 'F1F1F4'
                  },
                  width: { size: blockquoteWidthTwip, type: WidthType.DXA }
                })
              ]
            })
          ],
          alignment: AlignmentType.LEFT,
          borders: {
            top: { style: 'single', size: 1, color: 'F1F1F4' },
            bottom: { style: 'single', size: 1, color: 'F1F1F4' },
            left: { style: 'single', size: 1, color: 'F1F1F4' },
            right: { style: 'single', size: 1, color: 'F1F1F4' }
          }
        })
      );
      return;
    }

    if (tag === 'p' || tag === 'li' || tag === 'span' || tag === 'p') {
      const hasImg = Array.from(node.childNodes).some(
        (child) =>
          child instanceof Element && child.tagName.toLowerCase() === 'img'
      );
      if (hasImg) {
        node.childNodes.forEach(walk);
        return;
      }

      const runs: TextRun[] = [];
      node.childNodes.forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          const t = child.textContent || '';
          if (t)
            runs.push(
              new TextRun({
                text: t,
                color: '000000',
                size: 20,
                font: fontFamily
              })
            );
        } else if (child instanceof Element) {
          const ctag = child.tagName.toLowerCase();
          const txt = child.textContent || '';
          if (!txt) return;
          if (ctag === 'strong' || ctag === 'b') {
            runs.push(
              new TextRun({
                text: txt,
                bold: true,
                color: '000000',
                size: 20,
                font: fontFamily
              })
            );
          } else if (ctag === 'em' || ctag === 'i') {
            runs.push(
              new TextRun({
                text: txt,
                italics: true,
                color: '000000',
                size: 20,
                font: fontFamily
              })
            );
          } else if (ctag === 'code') {
            runs.push(
              new TextRun({
                text: txt,
                font: 'Consolas',
                color: '333333',
                size: 20
              })
            );
          } else if (ctag === 'a') {
            runs.push(
              new TextRun({
                text: txt,
                underline: {},
                color: '0563C1',
                size: 20,
                font: fontFamily
              })
            );
          } else {
            child.childNodes.forEach(walk);
          }
        }
      });

      out.push(
        new Paragraph({
          children: runs.length
            ? runs
            : [
                new TextRun({
                  text: '',
                  color: '000000',
                  size: 20,
                  font: fontFamily
                })
              ]
        })
      );
      return;
    }

    if (tag === 'ul' || tag === 'ol') {
      const listParagraphs = parseListItemsToParagraphs(node, fontFamily, 0);
      out.push(...listParagraphs);
      return;
    }

    if (tag === 'table') {
      const rows: TableRow[] = [];
      const trEls = Array.from(node.querySelectorAll('tr'));

      const firstCells = trEls[0]?.querySelectorAll('th,td') ?? [];
      const colCount = Math.max(1, firstCells.length);

      const tableWidthTwip = getContentMaxWidthTwip();
      const colWidthTwip = Math.floor(tableWidthTwip / colCount);
      const columnWidths = Array.from({ length: colCount }, () => colWidthTwip);

      trEls.forEach((tr) => {
        const cells: TableCell[] = [];
        const tdEls = Array.from(tr.querySelectorAll('th,td'));
        tdEls.forEach((td, idx) => {
          const isHeader = td.tagName.toLowerCase() === 'th';
          cells.push(
            new TableCell({
              children: [
                new Paragraph({
                  children: [
                    new TextRun({
                      text: td.textContent || '',
                      color: '000000',
                      size: 20,
                      bold: isHeader,
                      font: fontFamily
                    })
                  ],
                  spacing: { before: 0, after: 0 }
                })
              ],
              margins: { top: 150, bottom: 150, left: 100, right: 100 },
              shading: isHeader ? { type: 'clear', fill: 'F1F1F4' } : undefined,
              width: {
                size: columnWidths[idx] ?? colWidthTwip,
                type: WidthType.DXA
              }
            })
          );
        });
        rows.push(new TableRow({ children: cells }));
      });

      out.push(
        new Table({
          width: { size: tableWidthTwip, type: WidthType.DXA },
          columnWidths,
          layout: 'fixed',
          rows,
          alignment: AlignmentType.LEFT,
          borders: {
            top: { style: 'single', size: 1, color: 'E3E4E8' },
            bottom: { style: 'single', size: 1, color: 'E3E4E8' },
            left: { style: 'single', size: 1, color: 'E3E4E8' },
            right: { style: 'single', size: 1, color: 'E3E4E8' },
            insideHorizontal: { style: 'single', size: 1, color: 'E3E4E8' },
            insideVertical: { style: 'single', size: 1, color: 'E3E4E8' }
          }
        })
      );
      return;
    }

    if (tag === 'img') {
      const img = node as HTMLImageElement;
      const src = img.src;
      if (src?.startsWith('data:image')) {
        const base64 = src.split(',')[1] || '';
        const byteString = atob(base64);
        const arr = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++)
          arr[i] = byteString.charCodeAt(i);

        // 교체 시 기록해 둔 최종 스케일
        const finalWidth =
          parseInt(img.dataset.finalWidth || '0', 10) || getContentMaxWidthPx();
        const finalHeight =
          parseInt(img.dataset.finalHeight || '0', 10) ||
          Math.round(finalWidth * 0.66);

        out.push(
          new Paragraph({
            children: [
              new ImageRun({
                data: arr,
                transformation: {
                  width: Math.round(finalWidth),
                  height: Math.round(finalHeight)
                },
                type: 'png'
              })
            ],
            spacing: { after: 120 }
          })
        );
        return;
      }
    }
    node.childNodes.forEach(walk);
  };

  el.childNodes.forEach(walk);
  return out;
}

export async function exportMarkdownCanvasToDocument(
  fontFamily: string
): Promise<Blob | null> {
  const containers = document.querySelectorAll('#markdown-canvas');
  const container =
    containers.length > 1
      ? (containers[1] as HTMLElement)
      : (containers[0] as HTMLElement);
  if (!container) return null;

  // pagedjs-preview-blur는 제외하고 첫 번째 pagedjs-preview-area만 사용
  const previewArea = container.querySelector(
    '.pagedjs-preview-area'
  ) as HTMLElement;
  const actualContainer = previewArea || container;

  const ids = Array.from(
    actualContainer.querySelectorAll<HTMLElement>('[data-docx-id]')
  )
    .map((n) => n.dataset.docxId!)
    .filter(Boolean);

  const captured = await captureByIds(actualContainer, ids, {
    nonDestructiveFirst: true,
    firstPixelRatio: 2,
    allowJpegFallback: true
  });

  const capturedForReplace = new Map<string, CaptureResult>();
  captured.forEach((val, key) => capturedForReplace.set(key, val.capture));

  const cloned = actualContainer.cloneNode(true) as HTMLElement;
  replaceInCloneWithCapturedImages(
    cloned,
    capturedForReplace,
    getContentMaxWidthPx()
  );

  const children = parseElementToDocxChildren(cloned, fontFamily);

  // 중첩 리스트를 위한 numbering 레벨 정의 (최대 9레벨까지 지원)
  const numberingConfig = [
    {
      reference: 'ul',
      levels: Array.from({ length: 9 }, (_, level) => ({
        level,
        format: 'bullet' as const,
        text: level === 0 ? '•' : level === 1 ? '○' : level === 2 ? '▪' : '•',
        alignment: AlignmentType.LEFT
      }))
    },
    {
      reference: 'ol',
      levels: Array.from({ length: 9 }, (_, level) => {
        let format: 'decimal' | 'lowerLetter' | 'lowerRoman' = 'decimal';
        let text = '%1.';
        if (level === 0) {
          format = 'decimal';
          text = '%1.';
        } else if (level === 1) {
          format = 'lowerLetter';
          text = '%2.';
        } else if (level === 2) {
          format = 'lowerRoman';
          text = '%3.';
        } else {
          format = 'decimal';
          text = '%1.';
        }
        return {
          level,
          format,
          text,
          alignment: AlignmentType.LEFT
        };
      })
    }
  ];

  const doc = new Document({
    numbering: {
      config: numberingConfig
    },
    sections: [{ children }]
  });

  const blob = await Packer.toBlob(doc);
  return blob;
}

export async function exportDocx({ itemName }: { itemName: string }) {
  const isEn = i18n.language === 'en';
  const fontFamily = isEn ? 'Calibri' : '맑은 고딕';
  const blob = await exportMarkdownCanvasToDocument(fontFamily);
  if (!blob) return;
  blobDownload(blob, `${itemName}.docx`);
}
