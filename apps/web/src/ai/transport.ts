
import { parseJsonEventStream, type ParseResult } from '@ai-sdk/provider-utils';
import type {
  DocshuntUIMessage,
  DocshuntUIMessageChunk
} from '@/ai/ui-message';
import {
  HttpChatTransport,
  type HttpChatTransportInitOptions,
  type PrepareSendMessagesRequest
} from 'ai';
import {
  chatChunkSchema,
  chatRequestSchema,
  type ChatChunk
} from '@/ai/sse.schema';
import { partsToPlainText } from '@/ai/utils';

export const prepareSendMessagesRequest: PrepareSendMessagesRequest<
  DocshuntUIMessage
> = ({ id, messages, body }) => {
  const accessToken = localStorage.getItem('accessToken');

  if (typeof accessToken !== 'string' || !accessToken) {
    throw new Error('Access token is not found');
  }

  const parsedBody = chatRequestSchema.parse({
    userMessage: partsToPlainText(messages[messages.length - 1].parts),
    chatHistory:
      messages.slice(0, -1).map((message) => partsToPlainText(message.parts)) ??
      [],
    productContext: body?.productContext
  });

  return {
    headers: {
      'X-Session-ID': id,
      Authorization: `Bearer ${accessToken}`
    },
    body: parsedBody
  };
};

export class DocshuntChatTransport extends HttpChatTransport<DocshuntUIMessage> {
  constructor(options: HttpChatTransportInitOptions<DocshuntUIMessage> = {}) {
    super(options);
  }

  protected processResponseStream(
    stream: ReadableStream<Uint8Array<ArrayBufferLike>>
  ): ReadableStream<DocshuntUIMessageChunk> {
    // First, parse the stream as LangChain message chunks
    return parseJsonEventStream({
      stream,
      schema: chatChunkSchema
    }).pipeThrough(
      new TransformStream<ParseResult<ChatChunk>, DocshuntUIMessageChunk>({
        async transform(chunk, controller) {
          if (!chunk.success) {
            controller.enqueue({
              type: 'error',
              errorText: 'Stream parsing error'
            });
            return;
          }

          toUIMessageChunk(chunk.value, controller);
        }
      })
    );
  }
}

const toUIMessageChunk = (
  chunk: ChatChunk,
  controller: TransformStreamDefaultController<DocshuntUIMessageChunk>
): void => {
  switch (chunk.event) {
    case 'on_chat_model_start': {
      switch (chunk.name) {
        case 'chat-respond': {
          controller.enqueue({
            type: 'text-start',
            id: '1'
          });
          break;
        }
        case 'canvas-edit': {
          controller.enqueue({
            type: 'data-markdown',
            data: {
              value: chunk.value,
              status: 'thinking'
            },
            id: '1'
          });
          break;
        }
      }
      break;
    }
    case 'on_chat_model_stream': {
      switch (chunk.name) {
        case 'chat-respond': {
          controller.enqueue({
            type: 'text-delta',
            delta: chunk.value,
            id: '1'
          });
          break;
        }
        case 'canvas-edit': {
          controller.enqueue({
            type: 'data-markdown',
            data: {
              value: chunk.value,
              status: 'streaming'
            },
            id: '1'
          });
          break;
        }
      }
      break;
    }
    case 'on_chat_model_end':
      switch (chunk.name) {
        case 'chat-respond': {
          controller.enqueue({
            type: 'text-end',
            id: '1'
          });
          break;
        }
      }
      break;
    case 'on_tool_end': {
      switch (chunk.name) {
        case 'canvas-edit': {
          controller.enqueue({
            type: 'data-markdown',
            data: {
              value: chunk.value,
              status: 'review'
            },
            id: '1'
          });
          break;
        }
      }
      break;
    }
  }
};
