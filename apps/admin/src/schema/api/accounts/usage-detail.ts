import { z } from 'zod';

// ─── 파일 목록 ─────────────────────────────────────────

export const fileStatusSchema = z.enum([
  'PENDING',
  'PROGRESS',
  'COMPLETED',
  'FAILED'
]);

export const fileTypeSchema = z.enum([
  'FORMAT',
  'EXPORT',
  'TEMPLATE',
  'IMAGE'
]);

export const accountFileSchema = z.object({
  productFileId: z.number(),
  filePath: z.string().nullable(),
  status: fileStatusSchema,
  fileType: fileTypeSchema.optional(),
  createdAt: z.string()
});

export type AccountFile = z.infer<typeof accountFileSchema>;

export const getAccountFilesResponseSchema = z
  .object({
    data: z.object({
      content: z.array(accountFileSchema),
      totalElements: z.number(),
      totalPages: z.number(),
      size: z.number(),
      number: z.number()
    })
  })
  .transform(({ data }) => data);

export type GetAccountFilesResponse = z.infer<
  typeof getAccountFilesResponseSchema
>;

// ─── 사업계획서 초안 목록 ──────────────────────────────

export const productStatusSchema = z.enum([
  'PENDING',
  'PROGRESS',
  'COMPLETED',
  'FAILED'
]);

export const accountProductSchema = z.object({
  id: z.number(),
  itemName: z.string().nullable(),
  generationStatus: productStatusSchema.nullable(),
  createdAt: z.string()
});

export type AccountProduct = z.infer<typeof accountProductSchema>;

export const getAccountProductsResponseSchema = z
  .object({
    data: z.object({
      content: z.array(accountProductSchema),
      totalElements: z.number(),
      totalPages: z.number(),
      size: z.number(),
      number: z.number()
    })
  })
  .transform(({ data }) => data);

export type GetAccountProductsResponse = z.infer<
  typeof getAccountProductsResponseSchema
>;
