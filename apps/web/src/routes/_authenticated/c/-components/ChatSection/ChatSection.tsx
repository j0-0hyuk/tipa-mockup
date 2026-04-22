import {
  StyledChatSectionContainer,
  StyledChatSectionContent,
  StyledChatSectionContentScroll,
  StyledChatInputContainer
} from '@/routes/_authenticated/c/-components/ChatSection/ChatSection.style';
import { ChatInput } from '@/routes/_authenticated/c/-components/ChatSection/ChatInput/ChatInput';
import { useChat } from '@ai-sdk/react';
import { DocshuntChatTransport } from '@/ai/transport';
import type z from 'zod';
import { Flex } from '@docs-front/ui';
import { Suspense, useCallback, useMemo, useRef } from 'react';
import { UserMessage } from '@/ai/message';
import type { DocshuntUIMessage } from '@/ai/ui-message';
import { MarkdownPart } from '@/ai/components/parts/MarkdownPart/MarkdownPart';
import { TextPart } from '@/ai/components/parts/TextPart/TextPart';
import {
  useMutation,
  useQueryClient,
  useSuspenseQueries
} from '@tanstack/react-query';
import {
  getDocumentOptions,
  getProductChatMessagesOptions
} from '@/query/options/products';
import { ChatErrorState } from '@/routes/_authenticated/c/-components/ChatSection/ChatErrorState/ChatErrorState';
import { useRefScrollDownEffect } from '@/hooks/useRefScrollDownEffect';
import { DocumentPart } from '@/ai/components/parts/DocumentPart/DocumentPart';
import { prepareSendMessagesRequest } from '@/ai/transport';
import DocshuntMarkdown from '@/markdown/DocshuntMarkdown';
import { useDidUpdate } from '@toss/react';
import { DocshuntChat } from '@/ai/chat';
import { useBreakPoints } from '@/hooks/useBreakPoints';
import { useDiffNavStore } from '@/store/useDiffNavStore';
import { getAccountMeQueryOptions } from '@/query/options/account';
import ChatNoCreditState from '@/routes/_authenticated/c/-components/ChatSection/ChatNoCreditState/ChatNoCreditState';
import { patchProduct, postProductChatMessages } from '@/api/products/mutation';
import { useProductId } from '@/hooks/useProductId';
import type { chatInputFormSchema } from '@/routes/_authenticated/c/-components/ChatSection/ChatInput/ChatInput.schema';

export default function ChatSection() {
  const { isMobile } = useBreakPoints();
  const productId = useProductId();

  const [
    { data: document },
    {
      data: { messages: initialMessages }
    }
  ] = useSuspenseQueries({
    queries: [
      getDocumentOptions(Number(productId)),
      getProductChatMessagesOptions(Number(productId))
    ]
  });

  const { content: markdown } = document;

  const markdownRef = useRef(markdown);

  const queryClient = useQueryClient();

  const { mutate: postChatMesssagesMutate } = useMutation({
    mutationFn: ({
      productId,
      chatMessage
    }: {
      productId: number;
      chatMessage: string[];
    }) => postProductChatMessages(productId, { chatMessage }),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({
        queryKey: getProductChatMessagesOptions(Number(productId)).queryKey
      });
    }
  });

  const setDocumentContent = useCallback(
    (productId: number, markdown: string) => {
      queryClient.setQueryData(getDocumentOptions(productId).queryKey, {
        ...document,
        content: markdown
      });
    },
    [document, queryClient]
  );

  const setIds = useDiffNavStore((s) => s.setIds);

  const { mutate: patchDocumentContentMutate } = useMutation({
    mutationFn: ({
      productId,
      markdown
    }: {
      productId: number;
      markdown: string;
    }) => patchProduct(productId, markdown),
    onMutate: ({ productId, markdown }) => {
      setDocumentContent(productId, markdown);
    },
    onSuccess: () => {
      setIds([]);
    }
  });

  const chat = useChat<DocshuntUIMessage>({
    id: `chat-${productId}`,
    transport: new DocshuntChatTransport({
      api:
        import.meta.env.VITE_API_URL +
        `/products/${productId}/chat/messages:stream`,
      prepareSendMessagesRequest
    }),
    messages: initialMessages,
    onError: (error) => {
      console.error(error);
    },
    onData: ({ type, data }) => {
      switch (type) {
        case 'data-markdown':
          if (data.status === 'review') {
            if (!markdownRef.current) {
              throw new Error('Markdown is not found');
            }

            const prevMarkdown = DocshuntMarkdown.from(
              markdownRef.current
            ).applyAll().markdown;
            const nextMarkdown = DocshuntMarkdown.from(data.value).applyAll()
              .markdown;

            const markdown =
              DocshuntMarkdown.from(prevMarkdown).diff(nextMarkdown).markdown;

            patchDocumentContentMutate({
              productId: Number(productId),
              markdown
            });
            setDocumentContent(Number(productId), markdown);
          }
          break;
      }
    },
    onFinish: ({ isAbort, messages }) => {
      queryClient.invalidateQueries(getAccountMeQueryOptions());

      const chat = DocshuntChat.from(messages);

      if (isAbort) {
        chat.abort();
      }

      if (chat.isEdited) {
        chat.finishReviewExceptLastMessage();
      }

      postChatMesssagesMutate({
        productId: Number(productId),
        chatMessage: chat.messages.map((message) => JSON.stringify(message))
      });
    }
  });

  const {
    messages,
    sendMessage,
    status,
    stop,
    error,
    setMessages,
    regenerate
  } = chat;

  useDidUpdate(() => {
    setMessages(initialMessages);
  }, [initialMessages, setMessages]);

  const setReviewDone = useCallback(
    (messageId?: string) => {
      const newMessages =
        DocshuntChat.from(messages).finishReview(messageId).messages;
      setMessages(newMessages);
      postChatMesssagesMutate({
        productId: Number(productId),
        chatMessage: newMessages.map((message) => JSON.stringify(message))
      });
    },
    [setMessages, messages, postChatMesssagesMutate, productId]
  );

  const onSubmit = useCallback(
    (data: z.infer<typeof chatInputFormSchema>) => {
      // 에러가 발생한 user 프롬프트 제거
      if (error != null) {
        setMessages(messages.slice(0, -1));
      }

      if (!markdown) {
        throw new Error('Markdown is not found');
      }

      markdownRef.current = markdown;

      const markdownApplied =
        DocshuntMarkdown.from(markdown).applyAll().markdown;

      sendMessage(new UserMessage(data.prompt), {
        body: {
          productContext: markdownApplied
        }
      });
    },
    [sendMessage, error, setMessages, messages, markdown]
  );

  const onRegenerate = useCallback(() => {
    regenerate({
      body: { productContext: markdown }
    });
  }, [regenerate, markdown]);

  const contentRef = useRefScrollDownEffect<HTMLDivElement>(
    status === 'streaming' || status === 'submitted',
    true,
    productId
  );

  const reviewCount = useMemo(() => {
    return DocshuntMarkdown.from(markdown ?? '').getAllDiffNodeIds().length;
  }, [markdown]);

  const noCredit = error?.message?.includes('크레딧이 부족합니다.');

  return (
    <StyledChatSectionContainer $isMobile={isMobile}>
      <StyledChatSectionContent>
        <StyledChatSectionContentScroll ref={contentRef}>
          {messages.map((message) => (
            <Flex direction="column" key={message.id} gap={8}>
              {message.parts.map((part, index) => {
                switch (part.type) {
                  case 'data-document':
                    return <DocumentPart key={index} data={part.data} />;
                  case 'data-markdown':
                    return (
                      <MarkdownPart
                        key={index}
                        data={part.data}
                        markdown={markdown ?? ''}
                        reviewCount={reviewCount}
                        messageId={message.id}
                        onReviewDone={setReviewDone}
                        onApplyAll={patchDocumentContentMutate}
                        onCancelAll={patchDocumentContentMutate}
                      />
                    );
                  case 'text':
                    return (
                      <TextPart key={index} part={part} message={message} />
                    );
                }
              })}
            </Flex>
          ))}
          {error && !noCredit && <ChatErrorState onRegenerate={onRegenerate} />}
          {noCredit && (
            <Suspense>
              <ChatNoCreditState />
            </Suspense>
          )}
        </StyledChatSectionContentScroll>
      </StyledChatSectionContent>
      {markdown !== null && (
        <StyledChatInputContainer>
          <ChatInput onSubmit={onSubmit} chatStatus={status} stop={stop} />
        </StyledChatInputContainer>
      )}
    </StyledChatSectionContainer>
  );
}
