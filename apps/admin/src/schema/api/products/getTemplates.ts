import { z } from 'zod';

export const templateFileMetaContentsSchema = z.object({
  templateViewerUrl: z.string().nullable(),
  postingUrl: z.string().nullable(),
  templatePrompt: z.string().nullable(),
  templateMarkdown: z.string().nullable(),
  organizingAgency: z.string().nullable().optional(),
  deadline: z.string().nullable()
});

export const templateFileContentsSchema = z.object({
  productFileId: z.number(),
  filePath: z.string().nullable(),
  status: z.string(),
  createdAt: z.string().nullable(),
  displayOrder: z.number().nullable(),
  templateMeta: templateFileMetaContentsSchema.nullable()
});

export const productFileContentsSchema = z.object({
  productFileId: z.number(),
  filePath: z.string().nullable(),
  status: z.string(),
  createdAt: z.string().nullable()
});

const pageSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    content: z.array(itemSchema),
    totalElements: z.number(),
    totalPages: z.number(),
    size: z.number(),
    number: z.number()
  });

export const getProductFilesRequestSchema = z.object({
  page: z.number().optional().default(0),
  size: z.number().optional().default(10),
  fileType: z.string().optional()
});

export const productFilesDataSchema = z.object({
  exports: pageSchema(productFileContentsSchema),
  formats: pageSchema(productFileContentsSchema),
  templates: pageSchema(templateFileContentsSchema)
});

export const getProductFilesResponseSchema = z.object({
  data: productFilesDataSchema,
  error: z.unknown().nullable()
});

export type TemplateFileMetaContents = z.infer<typeof templateFileMetaContentsSchema>;
export type TemplateFileContents = z.infer<typeof templateFileContentsSchema>;
export type ProductFileContents = z.infer<typeof productFileContentsSchema>;
export type GetProductFilesRequest = z.infer<typeof getProductFilesRequestSchema>;
export type GetProductFilesResponse = z.infer<typeof getProductFilesResponseSchema>;
