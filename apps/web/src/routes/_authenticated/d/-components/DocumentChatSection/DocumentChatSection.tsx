import {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  forwardRef
} from 'react';
import type { Ref } from 'react';
import { useChat } from '@ai-sdk/react';
import { Flex, Spinner } from '@docs-front/ui';
import { MessagesSquare } from 'lucide-react';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery
} from '@tanstack/react-query';
import {
  DocumentChatTransport,
  prepareSendMessagesRequest
} from '@/ai/document-chat/document-chat-transport';
import { DocumentChatTextPart } from '@/routes/_authenticated/d/-components/DocumentChatSection/DocumentChatTextPart/DocumentChatTextPart';
import { DocumentChatToolPart } from '@/routes/_authenticated/d/-components/DocumentChatSection/DocumentChatToolPart/DocumentChatToolPart';
import { TOOL_LABELS } from '@/routes/_authenticated/d/-components/DocumentChatSection/DocumentChatToolPart/DocumentChatToolPart.constants';
import { getDocumentChatMessagesOptions } from '@/query/options/products';
import { postDocumentChatMessages } from '@/api/files';
import type { DocumentChatInputSubmitData } from '@/routes/_authenticated/d/-components/DocumentChatSection/DocumentChatInput/DocumentChatInput';
import { FileCardList } from '@/routes/_authenticated/d/-components/DocumentChatSection/DocumentChatInput/FileCard/FileCard';
import { isPresignedUrlExpired } from '@/routes/_authenticated/d/-components/DocumentChatSection/DocumentChatInput/file-type-utils';
import {
  StyledChatSectionContainer,
  StyledChatSectionContent,
  StyledChatSectionContentScroll,
  StyledChatInputContainer,
  StyledChatEmptyState,
  StyledUserMessageBubble,
  StyledUserMessageContent
} from '@/routes/_authenticated/d/-components/DocumentChatSection/DocumentChatSection.style';
import { DocumentChatInput } from '@/routes/_authenticated/d/-components/DocumentChatSection/DocumentChatInput/DocumentChatInput';
import { useInitializeDocumentChatMessages } from '@/ai/document-chat/hooks/useInitializeDocumentChatMessages';
import { useDocumentChatAutoScrollEffectRef } from '@/ai/document-chat/hooks/useDocumentChatAutoScrollRefEffect';
import { DocumentChatErrorState } from '@/routes/_authenticated/d/-components/DocumentChatSection/DocumentChatErrorState/DocumentChatErrorState';
import { EditorFeedbackPrompt } from '@/routes/_authenticated/d/-components/DocumentChatSection/EditorFeedbackPrompt/EditorFeedbackPrompt';
import type {
  DocshuntDocumentChatUIMessage,
  HwpxAction
} from '@/ai/document-chat/ui-message';

export interface DocumentChatSectionHandle {
  finishReview: () => void;
}

interface DocumentChatSectionProps {
  productFileId: string;
  productFileIdNumber: number;
  isStatusCompleted: boolean;
  onActionStart?: () => void;
  onAction?: (action: HwpxAction) => void;
  onActionDone?: () => void;
  onRollback?: () => void;
}

export const DocumentChatSection = forwardRef(function DocumentChatSection(
  {
    productFileId,
    productFileIdNumber,
    isStatusCompleted,
    onActionStart,
    onAction,
    onActionDone,
    onRollback
  }: DocumentChatSectionProps,
  ref: Ref<DocumentChatSectionHandle>
) {
  const queryClient = useQueryClient();
  const [pendingReview, setPendingReview] = useState(false);
  const sessionIdRef = useRef<string | null>(null);

  const {
    data: { messages: initialMessages }
  } = useSuspenseQuery(getDocumentChatMessagesOptions(productFileIdNumber));

  const { mutate: postChatMessagesMutate } = useMutation({
    mutationFn: ({
      fileId,
      chatMessage
    }: {
      fileId: number;
      chatMessage: string[];
    }) => postDocumentChatMessages(fileId, { chatMessage }),
    onSuccess: (_, { fileId }) => {
      queryClient.invalidateQueries({
        queryKey: getDocumentChatMessagesOptions(fileId).queryKey
      });
    }
  });

  const transport = useMemo(
    () =>
      new DocumentChatTransport({
        api: `${import.meta.env.VITE_API_URL}/document-chat/messages:stream`,
        prepareSendMessagesRequest
      }),
    []
  );

  const chat = useChat<DocshuntDocumentChatUIMessage>({
    id: `document-chat-${productFileId}`,
    transport,
    messages: initialMessages,
    onError: (error) => {
      console.error('Chat error:', error);
      setPendingReview(false);
      onRollback?.();
    },
    onFinish: ({ messages, isError }) => {
      if (isError) {
        return;
      }

      postChatMessagesMutate({
        fileId: productFileIdNumber,
        chatMessage: messages.map((message) => JSON.stringify(message))
      });
    },
    onData: ({ type, data }) => {
      switch (type) {
        case 'data-action': {
          switch (data.phase) {
            case 'start':
              sessionIdRef.current = data.sessionId;
              setPendingReview(true);
              onActionStart?.();
              break;
            case 'delta':
              onAction?.(data.action);
              break;
            case 'done':
              onActionDone?.();
              break;
          }
          break;
        }
      }
    }
  });

  const {
    messages,
    setMessages,
    sendMessage,
    status,
    stop,
    error,
    regenerate
  } = chat;

  useInitializeDocumentChatMessages(chat, initialMessages);

  useImperativeHandle(
    ref,
    () => ({
      finishReview: () => {
        const sessionId = sessionIdRef.current;
        if (!sessionId) return;

        sessionIdRef.current = null;
        setPendingReview(false);

        sendMessage(undefined, {
          body: {
            fileId: productFileIdNumber,
            sessionId
          }
        });
      }
    }),
    [sendMessage, productFileIdNumber]
  );

  const onSubmit = useCallback(
    (data: DocumentChatInputSubmitData) => {
      if (pendingReview) return;

      const parts: Array<
        | { type: 'file'; mediaType: string; filename: string; url: string }
        | { type: 'text'; text: string }
      > = [];

      for (const file of data.uploadedFiles) {
        parts.push({
          type: 'file',
          mediaType: file.mediaType,
          filename: file.filename,
          url: file.url
        });
      }

      setMessages(initialMessages);

      parts.push({ type: 'text', text: data.prompt });

      sendMessage(
        { role: 'user', parts },
        {
          body: {
            fileId: productFileIdNumber
          }
        }
      );
    },
    [
      sendMessage,
      setMessages,
      initialMessages,
      productFileIdNumber,
      pendingReview
    ]
  );

  const onRetry = useCallback(() => {
    regenerate({
      body: {
        fileId: productFileIdNumber
      }
    });
  }, [regenerate, productFileIdNumber]);

  const autoScrollRef = useDocumentChatAutoScrollEffectRef(chat);

  return (
    <StyledChatSectionContainer>
      <StyledChatSectionContent>
        <StyledChatSectionContentScroll ref={autoScrollRef}>
          {messages.length === 0 ? (
            <StyledChatEmptyState>
              <MessagesSquare size={40} />
              <span>문서에 대해 질문해보세요</span>
            </StyledChatEmptyState>
          ) : (
            messages.map((message, messageIndex) => (
              <Flex direction="column" key={message.id} gap={8}>
                {message.role === 'user' ? (
                  <StyledUserMessageBubble>
                    <StyledUserMessageContent>
                      <FileCardList
                        files={message.parts
                          .filter((p) => p.type === 'file')
                          .map((p) => ({
                            name:
                              'filename' in p
                                ? (p.filename as string) ?? ''
                                : '',
                            expired:
                              'url' in p && typeof p.url === 'string'
                                ? isPresignedUrlExpired(p.url)
                                : false
                          }))}
                      />
                      {message.parts.map((part, index) =>
                        part.type === 'text' ? (
                          <span key={index}>{part.text}</span>
                        ) : null
                      )}
                    </StyledUserMessageContent>
                  </StyledUserMessageBubble>
                ) : (
                  (() => {
                    const isLastMessage = messageIndex === messages.length - 1;
                    const isChatActive =
                      isLastMessage &&
                      (status === 'streaming' || status === 'submitted');

                    const renderItems: Array<
                      | { type: 'text'; partIndex: number }
                      | {
                          type: 'tool';
                          partIndex: number;
                          toolName: string;
                          allDone: boolean;
                        }
                    > = [];

                    for (let i = 0; i < message.parts.length; i++) {
                      const part = message.parts[i];
                      if (part.type === 'text') {
                        renderItems.push({ type: 'text', partIndex: i });
                      } else if (
                        part.type === 'dynamic-tool' &&
                        part.toolName in TOOL_LABELS
                      ) {
                        const isDone =
                          part.state === 'output-available' ||
                          part.state === 'output-error';
                        const last = renderItems[renderItems.length - 1];
                        if (
                          last &&
                          last.type === 'tool' &&
                          last.toolName === part.toolName
                        ) {
                          last.allDone = last.allDone && isDone;
                        } else {
                          renderItems.push({
                            type: 'tool',
                            partIndex: i,
                            toolName: part.toolName,
                            allDone: isDone,
                          });
                        }
                      }
                    }

                    return renderItems.map((item) => {
                      if (item.type === 'text') {
                        const part = message.parts[item.partIndex];
                        return (
                          <DocumentChatTextPart
                            key={item.partIndex}
                            part={part as { type: 'text'; text: string }}
                          />
                        );
                      }
                      return (
                        <DocumentChatToolPart
                          key={item.partIndex}
                          toolName={item.toolName}
                          isDone={item.allDone}
                          isChatActive={isChatActive}
                        />
                      );
                    });
                  })()
                )}
              </Flex>
            ))
          )}
          {error && <DocumentChatErrorState onRetry={onRetry} />}
          {status === 'submitted' && (
            <Flex alignItems="center">
              <Spinner size={20} />
            </Flex>
          )}
        </StyledChatSectionContentScroll>
      </StyledChatSectionContent>

      <StyledChatInputContainer>
        <EditorFeedbackPrompt
          assistantMessageCount={
            messages.filter((m) => m.role === 'assistant').length
          }
        />
        <DocumentChatInput
          productFileIdNumber={productFileIdNumber}
          onSubmit={onSubmit}
          chatStatus={status}
          stop={stop}
          disabled={!isStatusCompleted || pendingReview}
          pendingReview={pendingReview}
        />
      </StyledChatInputContainer>
    </StyledChatSectionContainer>
  );
});
