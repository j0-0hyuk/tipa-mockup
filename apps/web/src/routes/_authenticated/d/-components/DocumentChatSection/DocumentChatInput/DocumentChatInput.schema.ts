import { z } from 'zod';

export const documentChatInputFormSchema = z.object({
  prompt: z.string().trim().nonempty()
});
