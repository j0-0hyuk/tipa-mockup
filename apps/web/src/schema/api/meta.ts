import z from 'zod';

export const metaResponseSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  url: z.string().optional(),
  publisher: z.string().optional(),
  logo: z.string().optional()
});

export type MetaResponse = z.infer<typeof metaResponseSchema>;
