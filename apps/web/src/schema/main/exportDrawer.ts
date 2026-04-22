import { z } from 'zod';

export const exportDrawerFormSchema = z.object({
  productFilePathMapId: z.string().nullable(),
  language: z.enum(['ko', 'en']).nullable(),
  productExportedContent: z.string(),
  productExportedImages: z.array(
    z.object({
      name: z.string(),
      info: z.string(),
      binaryData: z.instanceof(File)
    })
  )
});

export type ExportDrawerForm = z.infer<typeof exportDrawerFormSchema>;
