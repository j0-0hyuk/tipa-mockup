import { z } from 'zod';

export const apiErrorResponseSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  details: z.any().optional()
});

export type ApiErrorResponse = z.infer<typeof apiErrorResponseSchema>;