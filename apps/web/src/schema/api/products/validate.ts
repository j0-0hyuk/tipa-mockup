import { z } from 'zod';

export const filePurposeSchema = z.enum(['REFERENCE', 'EXPORT_FORMAT']);

export type FilePurpose = z.infer<typeof filePurposeSchema>;

export const postFileValidateResponseSchema = z.object({
  data: z.object({
    fileName: z.string(),
    purpose: filePurposeSchema
  }),
  error: z.any().nullable().default(null)
});

export type PostFileValidateResponse = z.infer<
  typeof postFileValidateResponseSchema
>;
