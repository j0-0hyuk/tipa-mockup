import { useEffect, useRef, useState } from 'react';
import { captureByIds } from '@/markdown/utils/capture';
import { Streamdown } from 'streamdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { customComponents } from '@/markdown/components/CustomComponents/CustomComponents';

import React from 'react';

const hasCustomComponent = (children: React.ReactNode): boolean => {
  const childArray = React.Children.toArray(children);
  return childArray.some((child) => {
    if (React.isValidElement(child)) {
      const childType = child.type;
      let typeName = '';

      if (typeof childType === 'function') {
        typeName = childType.name || '';
      } else if (typeof childType === 'string') {
        typeName = childType;
      }

      const customTags = [
        'tamsamsom',
        'mermaid',
        'composedchartcomponent',
        'donutchartcomponent',
        'positioningmap'
      ];
      return customTags.some((tag) => typeName.toLowerCase().includes(tag));
    }
    return false;
  });
};

export const basicComponents = {
  p: (props: React.HTMLAttributes<HTMLParagraphElement>) => {
    if (hasCustomComponent(props.children)) {
      return <div style={{ display: 'contents' }}>{props.children}</div>;
    }
    return <p {...props} />;
  }
};

interface CaptureProps {
  markdown: string;
  shouldCapture: boolean;
  onCaptureComplete: (result: {
    productImages: File[];
    productImagesMetaData: Array<{ name: string; info: string }>;
  }) => void;
  onCaptureError?: (error: Error) => void;
}

export default function Capture({
  markdown,
  shouldCapture,
  onCaptureComplete,
  onCaptureError
}: CaptureProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const hasCapturedRef = useRef(false);

  useEffect(() => {
    if (
      !containerRef.current ||
      !markdown ||
      !shouldCapture ||
      isCapturing ||
      hasCapturedRef.current
    )
      return;

    hasCapturedRef.current = true;
    setIsCapturing(true);

    const processCapture = async () => {
      const container = containerRef.current;
      if (!container) {
        setIsCapturing(false);
        return;
      }

      try {
        container.style.position = 'fixed';
        container.style.left = '0';
        container.style.top = '100vh';
        container.style.maxHeight = '100vh';
        container.style.overflow = 'hidden';
        container.style.pointerEvents = 'none';
        container.style.zIndex = '-1';
        container.style.visibility = 'visible';
        container.style.opacity = '1';

        let retries = 0;
        let elements: HTMLElement[] = [];
        while (retries < 30 && elements.length === 0) {
          await new Promise((r) => setTimeout(r, 200));
          elements = Array.from(
            container.querySelectorAll<HTMLElement>('[data-docx-id]')
          );
          retries++;
        }

        if (elements.length === 0) {
          onCaptureComplete({
            productImages: [],
            productImagesMetaData: []
          });
          setIsCapturing(false);
          return;
        }

        await new Promise((r) => setTimeout(r, 1000));

        for (const el of elements) {
          let w = el.offsetWidth || el.scrollWidth || el.clientWidth;
          let h = el.offsetHeight || el.scrollHeight || el.clientHeight;

          const rect = el.getBoundingClientRect();
          if (rect.width > 0) w = rect.width;
          if (rect.height > 0) h = rect.height;

          if (w === 0 || h === 0) {
            const style = el.style as CSSStyleDeclaration & {
              width?: string;
              height?: string;
              minWidth?: string;
              minHeight?: string;
              maxWidth?: string;
              display?: string;
            };

            const img = el.querySelector('img');
            if (img) {
              if (!img.complete) {
                await new Promise((resolve) => {
                  img.onload = resolve;
                  img.onerror = resolve;
                });
              }

              const naturalWidth = img.naturalWidth || img.width || 0;
              const naturalHeight = img.naturalHeight || img.height || 0;

              if (naturalWidth > 0 && naturalHeight > 0) {
                style.width = `${naturalWidth}px`;
                style.height = `${naturalHeight}px`;
                style.minWidth = `${naturalWidth}px`;
                style.minHeight = `${naturalHeight}px`;
              } else {
                const imgRect = img.getBoundingClientRect();
                const imgWidth = imgRect.width || img.offsetWidth || 0;
                const imgHeight = imgRect.height || img.offsetHeight || 0;

                if (imgWidth > 0 && imgHeight > 0) {
                  style.width = `${imgWidth}px`;
                  style.height = `${imgHeight}px`;
                  style.minWidth = `${imgWidth}px`;
                  style.minHeight = `${imgHeight}px`;
                }
              }
            } else {
              const originalDisplay = window.getComputedStyle(el).display;

              style.visibility = 'visible';
              style.display = originalDisplay || 'block';
              style.opacity = '1';

              const children = Array.from(el.children) as HTMLElement[];
              let maxChildWidth = 0;
              let totalChildHeight = 0;
              let maxChildHeight = 0;

              await new Promise<void>((r) => requestAnimationFrame(() => r()));
              await new Promise((r) => setTimeout(r, 100));

              for (const child of children) {
                const childStyle = window.getComputedStyle(child);
                if (
                  childStyle.visibility === 'hidden' ||
                  childStyle.display === 'none'
                ) {
                  continue;
                }

                const childRect = child.getBoundingClientRect();
                const childWidth =
                  childRect.width ||
                  child.offsetWidth ||
                  child.scrollWidth ||
                  child.clientWidth ||
                  0;
                const childHeight =
                  childRect.height ||
                  child.offsetHeight ||
                  child.scrollHeight ||
                  child.clientHeight ||
                  0;

                if (childWidth > maxChildWidth) maxChildWidth = childWidth;
                if (childHeight > maxChildHeight) maxChildHeight = childHeight;
                totalChildHeight += childHeight;
              }

              const elRect = el.getBoundingClientRect();
              const elWidth =
                elRect.width || el.offsetWidth || el.scrollWidth || 0;
              const elHeight =
                elRect.height || el.offsetHeight || el.scrollHeight || 0;

              const finalWidth = Math.max(elWidth, maxChildWidth, 1);
              const finalHeight = Math.max(
                elHeight,
                maxChildHeight,
                totalChildHeight,
                1
              );

              style.width = `${finalWidth}px`;
              style.minWidth = `${finalWidth}px`;
              style.height = `${finalHeight}px`;
              style.minHeight = `${finalHeight}px`;
              style.maxWidth = 'none';
              style.maxHeight = 'none';

              if (originalDisplay && originalDisplay !== 'block') {
                style.display = originalDisplay;
              }
            }

            await new Promise<void>((r) => requestAnimationFrame(() => r()));
            await new Promise((r) => setTimeout(r, 50));

            w = el.offsetWidth || el.scrollWidth || el.clientWidth;
            h = el.offsetHeight || el.scrollHeight || el.clientHeight;
            const newRect = el.getBoundingClientRect();
            if (newRect.width > 0) w = newRect.width;
            if (newRect.height > 0) h = newRect.height;

            if (w === 0 || h === 0) {
              console.warn(
                `Element ${el.getAttribute('data-docx-id')} still has zero size after force-size. Rect: ${newRect.width}x${newRect.height}, Offset: ${el.offsetWidth}x${el.offsetHeight}, Scroll: ${el.scrollWidth}x${el.scrollHeight}`
              );
            }
          }
        }

        for (let i = 0; i < 6; i++) {
          await new Promise<void>((r) => requestAnimationFrame(() => r()));
          await new Promise((r) => setTimeout(r, 10));

          let allStable = true;
          for (const el of elements) {
            const rect = el.getBoundingClientRect();
            const w = el.offsetWidth || el.scrollWidth || rect.width;
            const h = el.offsetHeight || el.scrollHeight || rect.height;

            if (w === 0 || h === 0) {
              allStable = false;
              break;
            }
          }

          if (allStable && i >= 2) {
            break;
          }
        }

        const ids = elements.map((el) => el.getAttribute('data-docx-id')!);

        const captured = await captureByIds(container, ids, {
          firstPixelRatio: 2,
          allowJpegFallback: true,
          nonDestructiveFirst: false
        });

        const productImages: File[] = [];
        const productImagesMetaData: Array<{ name: string; info: string }> = [];

        for (const [id, { capture, info }] of captured.entries()) {
          const element = container.querySelector<HTMLElement>(
            `[data-docx-id="${CSS.escape(id)}"]`
          );
          const captureName =
            element?.getAttribute('data-docx-capture') || 'capture';
          const fileName = `${captureName}-${id}.${capture.format === 'png' ? 'png' : 'jpg'}`;

          const response = await fetch(capture.dataUrl);
          const blob = await response.blob();
          const file = new File([blob], fileName, {
            type:
              blob.type ||
              (capture.format === 'png' ? 'image/png' : 'image/jpeg')
          });

          productImages.push(file);
          productImagesMetaData.push({
            name: fileName,
            info: info || ''
          });
        }

        onCaptureComplete({
          productImages,
          productImagesMetaData
        });
      } catch (error) {
        console.error('Capture error:', error);
        if (onCaptureError) {
          onCaptureError(error as Error);
        } else {
          onCaptureComplete({
            productImages: [],
            productImagesMetaData: []
          });
        }
      } finally {
        setIsCapturing(false);
      }
    };

    processCapture();
  }, [shouldCapture, markdown, onCaptureComplete, onCaptureError, isCapturing]);

  useEffect(() => {
    if (!shouldCapture) {
      hasCapturedRef.current = false;
    }
  }, [shouldCapture]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '600px',
        position: 'fixed',
        left: '0',
        top: '100vh',
        pointerEvents: 'none',
        zIndex: -1
      }}
    >
      <Streamdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{ ...basicComponents, ...customComponents }}
        parseIncompleteMarkdown={false}
      >
        {markdown}
      </Streamdown>
    </div>
  );
}
