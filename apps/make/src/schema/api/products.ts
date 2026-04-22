import { z } from 'zod';

export const postMakeProductsRequestSchema = z.object({
  userPrompt: z
    .string()
    .min(1, { message: 'Prompt cannot be empty.' })
    .max(10000, { message: 'Prompt cannot exceed 10,000 characters.' }),
  referenceFiles: z.array(
    z
      .instanceof(File, { message: 'A file is required.' })
      .refine((file) => file.size > 0, 'File cannot be empty.')
  ),
  documentFormat: z
    .instanceof(File, { message: 'A file is required.' })
    .refine((file) => file.size > 0, 'File cannot be empty.')
});

export const postMakeProductsResponseSchema = z
  .object({
    content: z.string()
  })
  .transform((data) => {
    try {
      const parsed = JSON.parse(data.content);
      if (
        typeof parsed === 'object' &&
        parsed !== null &&
        'content' in parsed
      ) {
        return { content: parsed.content };
      }
    } catch {}
    return data;
  });

export type PostMakeProductsRequest = z.infer<
  typeof postMakeProductsRequestSchema
>;
export type PostMakeProductsResponse = z.infer<
  typeof postMakeProductsResponseSchema
>;

export const postMakeExportRequestSchema = z.object({
  documentFormat: z
    .instanceof(File, { message: 'A file is required.' })
    .refine((file) => file.size > 0, 'File cannot be empty.'),
  productImages: z
    .array(
      z
        .instanceof(File, { message: 'A file is required.' })
        .refine((file) => file.size > 0, 'File cannot be empty.')
        .refine((file) => ['image/jpeg', 'image/png'].includes(file.type))
    )
    .default([]),
  productImagesMetaData: z
    .array(
      z.object({
        name: z.string(),
        info: z.string()
      })
    )
    .default([]),
  userPrompt: z
    .string()
    .min(1, { message: 'Prompt cannot be empty.' })
    .max(100000, { message: 'Prompt cannot exceed 100,000 characters.' })
});

export const postMakeExportResponseSchema = z.object({
  filled_file: z.instanceof(Blob, { message: 'Response must be a file blob.' })
});

export type PostMakeExportRequest = z.infer<typeof postMakeExportRequestSchema>;
export type PostMakeExportResponse = z.infer<
  typeof postMakeExportResponseSchema
>;
