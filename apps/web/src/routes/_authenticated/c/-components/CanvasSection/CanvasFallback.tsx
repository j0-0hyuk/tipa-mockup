import { useEffect } from 'react';
import { DocshuntMarkdownViewSkeleton } from '@/markdown/DocshuntMarkdownView';
import type { DocshuntUIMessage } from '@/ai/ui-message';
import {
  patchProduct,
  postProductChatMessages
} from '@/api/products/mutation';
import {
  getProductChatMessagesOptions,
  getProductsQueryOptions
} from '@/query/options/products';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import i18next from 'i18next';
import { parseMarkdownFallback } from '@/schema/main/fallback';
import { StyledCanvasWrapper } from '@/routes/_authenticated/c/-components/CanvasSection/CanvasSection.style';
import { useParams } from '@tanstack/react-router';
import type { GetProductResponse } from '@/schema/api/products/products';
import { useToggleStore } from '@/store/useToggleStore';
import { useToast } from '@docs-front/ui';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import ChatSection from '@/routes/_authenticated/c/-components/ChatSection/ChatSection';

interface CanvasFallbackProps {
  data: GetProductResponse;
}

export function CanvasFallback({ data }: CanvasFallbackProps) {
  const { productId } = useParams({ from: '/_authenticated/c/$productId' });
  const id = Number(productId);
  const content = data.content;
  const generationStatus = data.generationStatus;
  const queryClient = useQueryClient();
  const { value: toggleValue, setValue } = useToggleStore();
  const { data: chatMessages } = useSuspenseQuery(
    getProductChatMessagesOptions(id)
  );
  const toast = useToast();
  const { isMobile } = useBreakPoints();

  const { mutate: mutateChat, isPending: isChatPending } = useMutation({
    mutationFn: (chatMessage: string[]) =>
      postProductChatMessages(id, { chatMessage }),
    onSuccess: () => {
      queryClient.invalidateQueries(getProductChatMessagesOptions(id));
      queryClient.invalidateQueries(getProductsQueryOptions());
      setValue('right');
      toast.open({
        content: `사업계획서가 완성되었습니다!\n수정하려면 상단의 '채팅'탭을 눌러 진행하세요.`,
        duration: 2000
      });
    }
  });

  const { mutate: patchTableInList, isPending: isPatchPending } = useMutation({
    mutationFn: (tableInList: string) => patchProduct(id, tableInList),
    onSuccess: () => {
      const lastMessage =
        chatMessages.messages[chatMessages.messages.length - 1];
      const newChatMessages: DocshuntUIMessage[] = [
        ...chatMessages.messages.slice(0, -1),
        {
          ...lastMessage,
          parts: [
            ...lastMessage.parts.map((part) =>
              part.type === 'data-document'
                ? { ...part, data: { ...part.data, status: 'done' as const } }
                : part
            ),
            {
              type: 'text',
              text: i18next.t('main:chat.completion.message1')
            },
            {
              type: 'text',
              text: i18next.t('main:chat.completion.message2')
            }
          ]
        }
      ];

      mutateChat(newChatMessages.map((message) => JSON.stringify(message)));
    },
    onError: (error) => {
      console.error('문서 테이블 패치 실패:', error);
    }
  });

  const isPending = isChatPending || isPatchPending;

  useEffect(() => {
    if (
      isPending ||
      generationStatus !== 'COMPLETED' ||
      chatMessages.messages.length === 0 ||
      content === null
    ) {
      return;
    }

    const lastMessage = chatMessages.messages[chatMessages.messages.length - 1];
    const documentPart = lastMessage.parts.find(
      (part) => part.type === 'data-document'
    );

    if (documentPart && documentPart.data.status === 'generating') {
      try {
        const fixedContent = parseMarkdownFallback(content);
        if (!fixedContent) {
          return;
        }
        patchTableInList(fixedContent);
      } catch (error) {
        console.error('마크다운 테이블 파싱 실패:', error);
      }
    }
  }, [
    generationStatus,
    chatMessages.messages,
    isPending,
    id,
    mutateChat,
    content,
    patchTableInList
  ]);

  if (isMobile) {
    return toggleValue === 'left' ? (
      <ChatSection />
    ) : (
      <StyledCanvasWrapper>
        <DocshuntMarkdownViewSkeleton />
      </StyledCanvasWrapper>
    );
  }

  return (
    <StyledCanvasWrapper>
      <DocshuntMarkdownViewSkeleton />
    </StyledCanvasWrapper>
  );
}
