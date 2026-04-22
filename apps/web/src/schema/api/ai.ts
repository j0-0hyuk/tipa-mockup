import { z } from 'zod';

export const MAX_AI_PROMPT_LENGTH = 25000;

export const generateAIRequestSchema = z.object({
  prompt: z
    .string()
    .min(1, '내용을 입력해주세요.')
    .max(
      MAX_AI_PROMPT_LENGTH,
      `최대 ${MAX_AI_PROMPT_LENGTH}자까지 입력할 수 있습니다.`
    ),
  type: z.string().optional()
});

export const generateAIResponseSchema = z.object({
  text: z.string()
});

export type GenerateAIRequest = z.infer<typeof generateAIRequestSchema>;
export type GenerateAIResponse = z.infer<typeof generateAIResponseSchema>;
