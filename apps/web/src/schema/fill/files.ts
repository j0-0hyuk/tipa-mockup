import { z } from 'zod';
import { productFilePathMapContentsSchema } from '@/schema/api/products/products';
import { getFileNameFromPath } from '@/utils/file/getFileNameFromPath';

export const docSchema = z.object({
  id: z.string(),
  filename: z.string(),
  format: z.string(),
  fileUrl: z.string(),
  createdAt: z.string(),
  status: z.enum(['PROGRESS', 'COMPLETED', 'FAILED']).optional()
});

export type Doc = z.infer<typeof docSchema>;

export const productFilePathMapToDocSchema =
  productFilePathMapContentsSchema.transform((item) => {
    const id = item.productFileId || item.productFilePathMapId || 0;
    const fullFilename = getFileNameFromPath(item.filePath) || `file_${id}`;

    const lastDotIndex = fullFilename.lastIndexOf('.');
    const filename =
      lastDotIndex > 0 ? fullFilename.substring(0, lastDotIndex) : fullFilename;
    const format =
      lastDotIndex > 0
        ? fullFilename.substring(lastDotIndex + 1).toUpperCase()
        : '';

    return {
      id: String(id),
      filename,
      format,
      fileUrl: item.filePath || '',
      createdAt: item.createdAt
    };
  });

export const productFilePathMapToDocArraySchema = z
  .array(productFilePathMapContentsSchema)
  .transform((items) =>
    items.map((item) => {
      const id = item.productFileId || item.productFilePathMapId || 0;
      const fullFilename = getFileNameFromPath(item.filePath) || `file_${id}`;

      const lastDotIndex = fullFilename.lastIndexOf('.');
      const filename =
        lastDotIndex > 0
          ? fullFilename.substring(0, lastDotIndex)
          : fullFilename;
      const format =
        lastDotIndex > 0
          ? fullFilename.substring(lastDotIndex + 1).toUpperCase()
          : '';

      return {
        id: String(id),
        filename,
        format,
        fileUrl: item.filePath || '',
        createdAt: item.createdAt,
        status: item.status
      };
    })
  );
