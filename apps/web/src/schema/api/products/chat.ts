import { validateUIMessages } from 'ai';
import {
  type DocshuntUIMessage,
  docshuntUIMessageDataSchemas
} from '@/ai/ui-message';
import { z } from 'zod';

export const getProductChatMessagesResponseSchema = z
  .object({
    data: z.object({
      messages: z
        .array(
          z.union([
            z.object({ content: z.string(), createdAt: z.string() }),
            z.string()
          ])
        )
        .transform(async (data) => {
          const messages = data.map((item) =>
            JSON.parse(typeof item === 'string' ? item : item.content)
          );

          return await validateUIMessages<DocshuntUIMessage>({
            messages,
            dataSchemas: docshuntUIMessageDataSchemas
          });
        })
    })
  })
  .transform(({ data }) => {
    return data;
  });

export const postProductChatMessagesRequestSchema = z.object({
  chatMessage: z.array(z.string())
});

export type GetProductChatMessagesResponse = z.infer<
  typeof getProductChatMessagesResponseSchema
>;

export type PostProductChatMessagesRequestParams = z.input<
  typeof postProductChatMessagesRequestSchema
>;
