import { z } from 'zod';

export const productInputFormSchema = z.object({
  userPrompt: z
    .string()
    .nonempty({ message: '필수 입력 항목입니다.' })
    .max(10000, { message: '최대 10000자 이하로 입력해주세요.' }),
  referenceFiles: z
    .array(
      z
        .instanceof(File)
        .refine((file) => file.size > 0, 'File cannot be empty.')
    )
    .max(3)
});

export type ProductInputForm = z.infer<typeof productInputFormSchema>;
