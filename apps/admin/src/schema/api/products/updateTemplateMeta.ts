import { z } from 'zod';

export const updateTemplateMetaSchema = z.object({
  templateViewerUrl: z
    .string()
    .max(2000, '뷰어 링크는 2,000자를 초과할 수 없습니다.')
    .or(z.literal('')),
  postingUrl: z
    .string()
    .max(2000, '공고 링크는 2,000자를 초과할 수 없습니다.')
    .or(z.literal('')),
  templatePrompt: z
    .string()
    .max(10000, '맞춤 프롬프트는 10,000자를 초과할 수 없습니다.')
    .or(z.literal('')),
  templateMarkdown: z
    .string()
    .max(100000, '템플릿 마크다운은 100,000자를 초과할 수 없습니다.')
    .or(z.literal('')),
  organizingAgency: z
    .string()
    .max(200, '주관 기관은 200자를 초과할 수 없습니다.')
    .or(z.literal(''))
    .optional(),
  deadline: z.string().or(z.literal(''))
});

export type UpdateTemplateMetaFormData = z.infer<typeof updateTemplateMetaSchema>;
