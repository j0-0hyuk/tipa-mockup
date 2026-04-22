import { z } from 'zod';

export const postProductImagePresignedUrlRequestSchema = z.object({
  fileName: z.string().min(1, 'File name is required')
});

export const postProductImagePresignedUrlResponseSchema = z
  .object({
    data: z.object({
      productFilePathMapId: z.number(),
      uploadUrl: z.string()
    })
  })
  .transform((data) => data.data);

export const patchProductImageCompleteRequestSchema = z.object({
  productFilePathMapId: z.number()
});

export const patchProductImageCompleteResponseSchema = z
  .object({
    data: z.object({
      imageUrl: z.string()
    })
  })
  .transform((data) => data.data);

export type PostProductImagePresignedUrlRequestParams = z.input<
  typeof postProductImagePresignedUrlRequestSchema
>;

export type PostProductImagePresignedUrlResponse = z.output<
  typeof postProductImagePresignedUrlResponseSchema
>;

export type PatchProductImageCompleteRequestParams = z.input<
  typeof patchProductImageCompleteRequestSchema
>;

export type PatchProductImageCompleteResponse = z.output<
  typeof patchProductImageCompleteResponseSchema
>;

export const postProductImageDescriptionRequestSchema = z.object({
  imageUrl: z.string(),
  language: z.enum(['ko', 'en'])
});

export const postProductImageDescriptionResponseSchema = z
  .object({
    data: z.object({
      description: z.string()
    })
  })
  .transform((data) => data.data);

export type PostProductImageDescriptionRequestParams = z.input<
  typeof postProductImageDescriptionRequestSchema
>;

export type PostProductImageDescriptionResponse = z.output<
  typeof postProductImageDescriptionResponseSchema
>;
