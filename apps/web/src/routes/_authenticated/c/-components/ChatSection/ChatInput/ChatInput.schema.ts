import { z } from 'zod';

export const chatInputFormSchema = z.object({
  prompt: z.string().trim().nonempty(),
  files: z.array(z.instanceof(File))
});
