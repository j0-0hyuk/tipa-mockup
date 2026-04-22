import { z } from 'zod';

// 허용되는 파일 확장자
const ALLOWED_EXTENSIONS = ['hwp', 'hwpx', 'docx'] as const;

// 파일 확장자 검증 함수
const isAllowedFileType = (file: File): boolean => {
  const fileName = file.name.toLowerCase();
  return ALLOWED_EXTENSIONS.some((ext) => fileName.endsWith(`.${ext}`));
};

export const uploadTemplateSchema = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size > 0, {
      message: '파일을 선택해주세요.'
    })
    .refine((file) => isAllowedFileType(file), {
      message: 'hwp, hwpx, docx 파일만 업로드 가능합니다.'
    })
    .refine((file) => file.size <= 30 * 1024 * 1024, {
      message: '파일 크기는 30MB를 초과할 수 없습니다.'
    }),
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

export type UploadTemplateFormData = z.infer<typeof uploadTemplateSchema>;

export interface UploadProductTemplateRequest {
  templateViewerUrl?: string;
  postingUrl?: string;
  templatePrompt?: string;
  templateMarkdown?: string;
  organizingAgency?: string | null;
  deadline?: string | null;
}
