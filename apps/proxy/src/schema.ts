import { z } from 'zod';

// User input length only. Prompt templates are appended before model request.
const MAX_PROMPT_LENGTH = 25000;
const DEFAULT_MODEL =
  process.env.AI_DEFAULT_MODEL?.trim() || 'gemini-2.5-flash';

export const generateRequestSchema = z.object({
  prompt: z
    .string()
    .min(1, '내용을 입력해주세요.')
    .max(
      MAX_PROMPT_LENGTH,
      `최대 ${MAX_PROMPT_LENGTH}자까지 입력할 수 있습니다.`
    ),
  type: z.string().optional(),
  model: z.string().optional().default(DEFAULT_MODEL)
});

export type GenerateRequest = z.infer<typeof generateRequestSchema>;

export const envSchema = z.object({
  AI_API_KEY: z.string().min(1, 'AI_API_KEY를 설정해주세요')
});

export type Env = z.infer<typeof envSchema>;
