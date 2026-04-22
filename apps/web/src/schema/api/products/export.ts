import { z } from 'zod';
import { exportDrawerFormSchema } from '@/schema/main/exportDrawer';

export const postProductFormatRequestSchema = z.object({
  documentFormat: z.instanceof(File)
});

export const getProductFilesRequestSchema = z.object({
  filter: z.enum(['FORMAT', 'EXPORT'])
});

export const getProductFilesResponseSchema = z
  .object({
    data: z.object({
      exportedProducts: z.object({
        content: z.array(
          z.object({
            productId: z.number(),
            productFilePathMapId: z.number(),
            fileType: z.string(),
            filePath: z.string().nullable(),
            status: z.enum(['PENDING', 'PROGRESS', 'COMPLETED', 'FAILED'])
          })
        )
      })
    })
  })
  .transform((data) => data.data.exportedProducts.content);

export const postExportProductRequestSchema = exportDrawerFormSchema.transform(
  (data) => ({
    contents: {
      productContents: data.productExportedContent,
      productImagesMetaData: data.productExportedImages.map((image) => ({
        name: image.name,
        info: image.info
      })),
      productFilePathMapId: Number(data.productFilePathMapId),
      language: data.language
    },
    images: data.productExportedImages.map((image) => image.binaryData)
  })
);

export const getProdctFileDownloadResponseSchema = z
  .object({
    data: z.object({
      url: z.string()
    })
  })
  .transform((data) => data.data);

export type PostProductFormatRequestParams = z.input<
  typeof postProductFormatRequestSchema
>;

export type PostExportProductRequestParams = z.input<
  typeof postExportProductRequestSchema
>;

export type GetProductFilesRequestParams = z.input<
  typeof getProductFilesRequestSchema
>;

export type GetProductFilesResponse = z.output<
  typeof getProductFilesResponseSchema
>;
