import { z } from 'zod';

export const apiErrorResponseSchema = z
  .object({
    error: z.object({
      message: z.string(),
      code: z.string().nullable(),
      exception: z.string().nullable(),
      stacktrace: z.array(z.string()).nullable()
    })
  })
  .transform((data) => data.error);
