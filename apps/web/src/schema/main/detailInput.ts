import i18n from '@/i18n';
import { z } from 'zod';

const t = i18n.t;

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB
const MAX_CONTENT_LENGTH = 10000;
export const MAX_DETAIL_INPUT_PAGE_LENGTH = 1500;
const DEFAULT_THEME_COLOR = 'BLUE';

const optionalString = z
  .string()
  .max(MAX_CONTENT_LENGTH, { message: t('common:form.validation.maximumLength') })
  .transform((val) => (val?.trim() ? val.trim() : undefined))
  .optional();

const optionalPageString = z
  .string()
  .max(MAX_DETAIL_INPUT_PAGE_LENGTH, {
    message: `최대 ${MAX_DETAIL_INPUT_PAGE_LENGTH}자까지 입력할 수 있습니다.`
  })
  .optional();

const appendIfPresent = (
  contents: Record<string, string>,
  key: string,
  value?: string
) => {
  if (!value) return;
  const trimmed = value.trim();
  if (!trimmed) return;
  contents[key] = trimmed;
};

export const teamRowSchema = z.object({
  name: z.string().max(200),
  position: z.string().max(200).optional(),
  responsibilities: z.string().max(500).optional(),
  skills: z.string().max(1000).optional()
});

export type TeamRow = z.infer<typeof teamRowSchema>;

// 공통 객체 스키마
export const detailInputFormBaseSchema = z.object({
  itemName: z
    .string()
    .max(MAX_CONTENT_LENGTH, {
      message: t('common:form.validation.maximumLength')
    })
    .optional(),
  itemDescription: optionalString,
  businessStory: optionalString,
  marketAndStrategy: optionalString,
  revenueAndFinancials: optionalString,
  progressAndRoadmap: optionalString,
  teamName: optionalString,
  teamInfo: z.array(teamRowSchema).optional(),
  files: z
    .array(z.instanceof(File))
    .max(3)
    .optional()
    .refine(
      (files) => {
        if (!files) return true;
        return files.every((file) => file.size <= MAX_FILE_SIZE);
      },
      { message: t('common:form.validation.fileSizeExceeded') }
    )
});

// MainPrompt용 (itemName optional, itemDescription 또는 files 중 하나는 필수)
export const detailInputFormSchema = detailInputFormBaseSchema.refine(
  ({ itemDescription, files }) =>
    Boolean(itemDescription) || Boolean(files && files.length > 0),
  {
    message: t('common:form.validation.required'),
    path: ['itemDescription']
  }
);

// detail-input용 (itemName required)
export const detailInputFormSchemaWithRequiredItemName =
  detailInputFormBaseSchema.extend({
    itemName: z
      .string()
      .nonempty({ message: t('common:form.validation.required') })
      .max(MAX_CONTENT_LENGTH, {
        message: t('common:form.validation.maximumLength')
      }),
    itemDescription: z
      .string()
      .nonempty({ message: t('common:form.validation.required') })
      .max(MAX_CONTENT_LENGTH, {
        message: t('common:form.validation.maximumLength')
      })
  });

export type DetailInputForm = z.infer<typeof detailInputFormSchema>;
export type DetailInputFormWithRequiredItemName = z.infer<
  typeof detailInputFormSchemaWithRequiredItemName
>;

// detail-input 페이지 전용 폼 스키마 (11개 string 필드)
export const detailInputPageFormSchema = z.object({
  problem: optionalPageString,
  solution: optionalPageString,
  target: optionalPageString,
  competitor: optionalPageString,
  market: optionalPageString,
  traction: optionalPageString,
  strategy: optionalPageString,
  businessModel: optionalPageString,
  milestone: optionalPageString,
  financialPlan: optionalPageString,
  teamAndVision: optionalPageString
});

export type DetailInputPageForm = z.infer<typeof detailInputPageFormSchema>;

/**
 * MainPrompt용 DetailInputForm → 서버 API용 contents 맵 변환
 */
export function detailInputFormToApiForm(data: DetailInputForm): {
  contents: Record<string, string>;
  files?: File[];
} {
  const contents: Record<string, string> = {};

  appendIfPresent(contents, 'itemName', data.itemName);
  appendIfPresent(contents, 'itemDescription', data.itemDescription);
  appendIfPresent(contents, 'businessStory', data.businessStory);
  appendIfPresent(contents, 'marketAndStrategy', data.marketAndStrategy);
  appendIfPresent(contents, 'revenueAndFinancials', data.revenueAndFinancials);
  appendIfPresent(contents, 'progressAndRoadmap', data.progressAndRoadmap);
  appendIfPresent(contents, 'teamName', data.teamName);

  if (data.teamInfo?.length) {
    const filteredTeamInfo = data.teamInfo.filter(
      (row) => row.name || row.position || row.responsibilities || row.skills
    );
    if (filteredTeamInfo.length > 0) {
      contents.teamInfo = JSON.stringify(filteredTeamInfo);
    }
  }

  contents.themeColor = DEFAULT_THEME_COLOR;

  return {
    contents,
    files: data.files
  };
}

/**
 * detail-input 페이지 폼 → 서버 API용 contents 맵 변환
 */
export function detailInputPageFormToApiForm(data: DetailInputPageForm): {
  contents: Record<string, string>;
} {
  const contents: Record<string, string> = {};

  appendIfPresent(contents, 'problem', data.problem);
  appendIfPresent(contents, 'solution', data.solution);
  appendIfPresent(contents, 'target', data.target);
  appendIfPresent(contents, 'competitor', data.competitor);
  appendIfPresent(contents, 'market', data.market);
  appendIfPresent(contents, 'traction', data.traction);
  appendIfPresent(contents, 'strategy', data.strategy);
  appendIfPresent(contents, 'businessModel', data.businessModel);
  appendIfPresent(contents, 'milestone', data.milestone);
  appendIfPresent(contents, 'financialPlan', data.financialPlan);
  appendIfPresent(contents, 'teamAndVision', data.teamAndVision);

  contents.themeColor = DEFAULT_THEME_COLOR;

  return {
    contents
  };
}
