import type { UseChatHelpers } from '@ai-sdk/react';
import { useDidUpdate } from '@toss/react';
import type { DocshuntDocumentChatUIMessage } from '@/ai/document-chat/ui-message';

export const useInitializeDocumentChatMessages = (
  chat: UseChatHelpers<DocshuntDocumentChatUIMessage>,
  initialMessages: DocshuntDocumentChatUIMessage[]
) => {
  const { setMessages } = chat;

  useDidUpdate(() => {
    setMessages(initialMessages);
  }, [initialMessages, setMessages]);
};
