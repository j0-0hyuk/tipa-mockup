import { z } from 'zod';

export const exportPromptSchema = z.object({
  /** 빈 문자열 허용. 제출 버튼은 프롬프트/참고자료/초안 중 하나 이상 있을 때만 활성화 */
  prompt: z.string(),
  references: z.array(z.instanceof(File)).max(3).optional(),
  draft: z.string().optional(),
  productImages: z.array(z.instanceof(File)).optional(),
  productImagesMetaData: z
    .array(
      z.object({
        name: z.string(),
        info: z.string()
      })
    )
    .optional()
});

export type ExportPromptForm = z.infer<typeof exportPromptSchema>;
