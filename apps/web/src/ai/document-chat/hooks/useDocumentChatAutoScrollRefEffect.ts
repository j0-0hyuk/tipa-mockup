import type { DocshuntDocumentChatUIMessage } from '@/ai/document-chat/ui-message';
import type { UseChatHelpers } from '@ai-sdk/react';
import { useEffect, useRef } from 'react';

export const useDocumentChatAutoScrollEffectRef = (
  chat: UseChatHelpers<DocshuntDocumentChatUIMessage>
) => {
  const { status, messages } = chat;
  const ref = useRef<HTMLDivElement>(null);

  const isLoading = status === 'streaming' || status === 'submitted';

  useEffect(() => {
    if (ref.current && isLoading) {
      ref.current.scrollTop = ref.current.scrollHeight;
    }
  }, [isLoading, messages]);

  return ref;
};
