import { validateUIMessages } from 'ai';
import type { DocshuntDocumentChatUIMessage } from '@/ai/document-chat/ui-message';
import { z } from 'zod';
import { docshuntDocumentChatUIMessageDataSchemas } from '@/ai/document-chat/ui-message';

export const getDocumentChatMessagesResponseSchema = z
  .object({
    data: z.object({
      messages: z.array(z.string()).transform(async (data) => {
        if (data.length === 0) return [];

        const messages = data.map((item) => JSON.parse(item));

        return await validateUIMessages<DocshuntDocumentChatUIMessage>({
          messages,
          dataSchemas: docshuntDocumentChatUIMessageDataSchemas
        });
      })
    })
  })
  .transform(({ data }) => {
    return data;
  });

export const postDocumentChatMessagesRequestSchema = z.object({
  chatMessage: z.array(z.string())
});

export const chatFileSchema = z
  .object({
    id: z.number(),
    filename: z.string(),
    mediaType: z.string(),
    size: z.number(),
    url: z.string()
  })
  .transform((data) => ({
    fileId: String(data.id),
    filename: data.filename,
    mediaType: data.mediaType,
    size: data.size,
    url: data.url
  }));

export const postDocumentChatFilesResponseSchema = z
  .object({
    data: z.array(chatFileSchema)
  })
  .transform(({ data }) => data);

export type ChatFile = z.infer<typeof chatFileSchema>;

export type GetDocumentChatMessagesResponse = z.infer<
  typeof getDocumentChatMessagesResponseSchema
>;

export type PostDocumentChatMessagesRequestParams = z.input<
  typeof postDocumentChatMessagesRequestSchema
>;
