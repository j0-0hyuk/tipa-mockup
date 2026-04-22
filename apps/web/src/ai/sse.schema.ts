import { z } from 'zod';

const eventNameSchema = z.enum([
  'chat-respond',
  'canvas-edit',
  'final-chat-respond'
]);

const eventNameRegexSchema = z
  .string()
  .regex(
    /^on_(chat_model|llm|chain|tool|retriever|prompt)_(start|stream|end)$/,
    { message: 'Invalid event name format' }
  );

export const chatRequestSchema = z.object({
  userMessage: z.string(),
  chatHistory: z.array(z.string()),
  productContext: z.string()
});

export const chatChunkSchema = z.object({
  name: eventNameSchema,
  event: eventNameRegexSchema,
  value: z.string()
});

export type ChatChunk = z.infer<typeof chatChunkSchema>;
