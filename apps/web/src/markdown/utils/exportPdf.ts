import { toSvg } from 'html-to-image';
import { blobDownload } from '@/utils/blobDownload';

interface ExportPdfOptions {
  fileName?: string;
  selector?: string;
}

export async function exportPdf({
  fileName = 'document.pdf',
  selector
}: ExportPdfOptions = {}) {
  const styleOverride = document.createElement('style');
  styleOverride.innerHTML = `
    .pagedjs_margin-content::after,
    .pagedjs_margin-content::before {
      content: none !important;
    }
  `;
  document.head.appendChild(styleOverride);

  try {
    const container = selector
      ? document.querySelector(selector)
      : document.querySelector('.pagedjs-preview-area, .pagedjs_pages');
    if (!container) {
      console.error(
        `Container '${selector ?? '.pagedjs-preview-area/.pagedjs_pages'}' not found`
      );
      return;
    }

    const pages = Array.from(
      container.querySelectorAll<HTMLElement>('.pagedjs_page, [id^="page-"]')
    ).sort((a, b) => {
      const getNum = (el: HTMLElement) => {
        const fromDataset = Number.parseInt(el.dataset.pageNumber ?? '', 10);
        if (Number.isFinite(fromDataset) && fromDataset > 0) {
          return fromDataset;
        }
        return Number.parseInt(el.id.split('-')[1] || '0', 10);
      };
      return getNum(a) - getNum(b);
    });

    if (!pages.length) {
      console.error('No pages found');
      return;
    }

    const { offsetWidth: width, offsetHeight: height } = pages[0];

    const svgPromises = pages.map(async (originalPage) => {
      const pageNum =
        originalPage.dataset.pageNumber || originalPage.id.split('-')[1];

      const pageNumberText = `- ${pageNum} -`;

      const marginContents = originalPage.querySelectorAll(
        '.pagedjs_margin-content'
      );
      const originalTexts: string[] = [];

      marginContents.forEach((el, idx) => {
        const element = el as HTMLElement;
        originalTexts[idx] = element.innerText;
        if (
          !element.innerText.trim() ||
          element.classList.contains('pagedjs_page-number')
        ) {
          element.innerText = pageNumberText;
        }
      });

      try {
        const dataUrl = await toSvg(originalPage, {
          width,
          height,
          skipFonts: true,
          style: { transform: 'none' }
        });
        return dataUrl;
      } finally {
        marginContents.forEach((el, idx) => {
          const element = el as HTMLElement;
          if (originalTexts[idx] !== undefined) {
            element.innerText = originalTexts[idx];
          }
        });
      }
    });

    const dataUrls = await Promise.all(svgPromises);

    await downloadPdfFromImages(dataUrls, width, height, fileName);
  } catch (error) {
    console.error('PDF Export Failed:', error);
  } finally {
    if (document.head.contains(styleOverride)) {
      document.head.removeChild(styleOverride);
    }
  }
}

async function downloadPdfFromImages(
  images: string[],
  width: number,
  height: number,
  fileName: string
) {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF({
    orientation: width > height ? 'landscape' : 'portrait',
    unit: 'px',
    format: [width, height]
  });

  const pixelRatio = 2;
  const imageQuality = 0.85;

  for (let i = 0; i < images.length; i++) {
    if (i > 0) {
      pdf.addPage([width, height], width > height ? 'landscape' : 'portrait');
    }

    const svgDataUrl = images[i];
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const imageDataUrl = await new Promise<string>((resolve, reject) => {
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const canvasWidth = width * pixelRatio;
          const canvasHeight = height * pixelRatio;
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, canvasWidth, canvasHeight);
          resolve(canvas.toDataURL('image/jpeg', imageQuality));
        } catch (err) {
          reject(err);
        }
      };
      img.onerror = reject;
      img.src = svgDataUrl;
    });

    pdf.addImage(
      imageDataUrl,
      'JPEG',
      0,
      0,
      width,
      height,
      undefined,
      'FAST',
      0
    );
  }

  const pdfBlob = pdf.output('blob');
  blobDownload(pdfBlob, fileName);
}
