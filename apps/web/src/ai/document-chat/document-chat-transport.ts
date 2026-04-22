import {
  HttpChatTransport,
  type PrepareSendMessagesRequest,
  type UIMessageChunk
} from 'ai';
import { toBaseMessages, toUIMessageStream } from '@ai-sdk/langchain';
import type { DocshuntDocumentChatUIMessage } from '@/ai/document-chat/ui-message';

export const prepareSendMessagesRequest: PrepareSendMessagesRequest<
  DocshuntDocumentChatUIMessage
> = async ({ id, messages, body }) => {
  const accessToken = localStorage.getItem('accessToken');

  if (typeof accessToken !== 'string' || !accessToken) {
    throw new Error('Access token is not found');
  }

  const cleanedMessages = messages.map((message) => {
    if (message.role !== 'assistant') return message;
    const cleanedParts = message.parts.filter(
      (part) =>
        part.type !== 'dynamic-tool' ||
        part.state === 'output-available' ||
        part.state === 'output-error'
    );
    return { ...message, parts: cleanedParts };
  });

  const baseMessages = (await toBaseMessages(cleanedMessages)).map((message) =>
    message.toDict()
  );

  const parsedBody = {
    messages: baseMessages,
    fileId: body?.fileId,
    sessionId: body?.sessionId,
    plan: body?.plan
  };

  return {
    headers: {
      'X-Session-ID': id,
      Authorization: `Bearer ${accessToken}`
    },
    body: parsedBody
  };
};

export class DocumentChatTransport extends HttpChatTransport<DocshuntDocumentChatUIMessage> {
  protected processResponseStream(
    stream: ReadableStream<Uint8Array<ArrayBufferLike>>
  ): ReadableStream<UIMessageChunk> {
    const parsedStream = this.parseNDJSONStream(stream);
    return toUIMessageStream(parsedStream);
  }

  private parseNDJSONStream(
    stream: ReadableStream<Uint8Array>
  ): ReadableStream<unknown> {
    const decoder = new TextDecoder();
    let buffer = '';

    return new ReadableStream<unknown>({
      async start(controller) {
        const reader = stream.getReader();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const events = buffer.split('\n\n');
          buffer = events.pop() || '';

          for (const event of events) {
            if (!event.trim()) continue;

            // SSE 이벤트 내 모든 data: 줄을 추출하여 합침
            const dataLines = event
              .split('\n')
              .filter((line) => line.startsWith('data:'))
              .map((line) => line.slice(line.startsWith('data: ') ? 6 : 5));

            const jsonStr = dataLines.join('');

            if (jsonStr) {
              try {
                const parsed = JSON.parse(jsonStr);

                if (
                  Array.isArray(parsed) &&
                  parsed[0] === 'error' &&
                  parsed[1]?.message
                ) {
                  controller.error(new Error(parsed[1].message));
                  return;
                }

                controller.enqueue(parsed);
              } catch (e) {
                console.error(
                  '[DocumentChatTransport] Failed to parse server response',
                  '\n  raw event:',
                  event,
                  '\n  jsonStr:',
                  jsonStr,
                  '\n  error:',
                  e
                );
                controller.error(new Error('Failed to parse server response'));
                return;
              }
            }
          }
        }

        controller.close();
      }
    });
  }
}
