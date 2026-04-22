import { useSuspenseQuery } from '@tanstack/react-query';
import {
  getDocumentOptions,
  getProductChatMessagesOptions
} from '@/query/options/products';
import DocshuntMarkdownView from '@/markdown/DocshuntMarkdownView';
import { useParams } from '@tanstack/react-router';
import {
  StyledCanvasSection,
  StyledCanvasWrapper
} from '@/routes/_authenticated/c/-components/CanvasSection/CanvasSection.style';
import { CanvasFallback } from '@/routes/_authenticated/c/-components/CanvasSection/CanvasFallback';
import { useBreakPoints } from '@/hooks/useBreakPoints';

export function CanvasSection() {
  const { productId } = useParams({ from: '/_authenticated/c/$productId' });
  const id = Number(productId);
  const { data } = useSuspenseQuery(getDocumentOptions(id));
  const { data: chatMessages } = useSuspenseQuery(
    getProductChatMessagesOptions(id)
  );
  const { isMobile } = useBreakPoints();

  const lastMessage =
    chatMessages.messages.length > 0
      ? chatMessages.messages[chatMessages.messages.length - 1]
      : null;
  const documentPart = lastMessage?.parts.find(
    (part) => part.type === 'data-document'
  );

  if (data.generationStatus === 'FAILED') {
    throw new Error('FAILED');
  }

  if (
    data.generationStatus === 'PENDING' ||
    data.generationStatus === 'PROGRESS'
  ) {
    return <CanvasFallback data={data} />;
  }

  if (
    data.generationStatus === 'COMPLETED' &&
    documentPart?.data.status === 'generating'
  ) {
    return <CanvasFallback data={data} />;
  }

  return (
    <StyledCanvasSection $isMobile={isMobile}>
      <StyledCanvasWrapper
        $isMobile={isMobile}
        data-canvas-scroll-container="true"
      >
        <DocshuntMarkdownView document={data.content!} />
      </StyledCanvasWrapper>
    </StyledCanvasSection>
  );
}
