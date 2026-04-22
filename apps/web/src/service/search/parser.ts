import { z } from 'zod';

const normalizeUnicode = (value: string) => value.normalize('NFC');

const normalizeWhitespace = (value: string) =>
  normalizeUnicode(value).replace(/\s+/g, ' ').trim();

const decodeUriSafe = (value: string): string => {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
};

const filePathSegmentSchema = z
  .preprocess((value) => (typeof value === 'string' ? value : ''), z.string())
  .transform((value) => value.split('?')[0]?.split('#')[0] ?? value)
  .transform((value) => value.split('/').pop() || value)
  .transform((value) => decodeUriSafe(value));

export const searchQuerySchema = z
  .preprocess((value) => (typeof value === 'string' ? value : ''), z.string())
  .transform((value) => normalizeWhitespace(value));

export const optionalSearchQuerySchema = searchQuerySchema.transform((value) =>
  value.length > 0 ? value : undefined
);

export const normalizeSearchSource = (value?: string): string =>
  normalizeWhitespace(value ?? '').toLowerCase();

export const normalizeSearchSourceWithoutSpace = (value?: string): string =>
  normalizeSearchSource(value).replace(/[\s_]+/g, '');

export const includesSearchQuery = (
  source: string | null | undefined,
  query: string
): boolean => {
  const normalizedQuery = normalizeSearchSourceWithoutSpace(query);
  if (!normalizedQuery) return true;

  const normalizedSource = normalizeSearchSourceWithoutSpace(source ?? '');
  return normalizedSource.includes(normalizedQuery);
};

export const templateTitleSchema = filePathSegmentSchema.transform((value) =>
  value.replace(/\.[^/.]+$/, '')
);

export const templateFileNameSchema = filePathSegmentSchema;

const templateSearchSourceSchema = z
  .object({
    filePath: z.unknown().optional(),
    templatePrompt: z.unknown().optional()
  })
  .transform(({ filePath, templatePrompt }) => {
    const title = templateTitleSchema.parse(filePath);
    const prompt = searchQuerySchema.parse(templatePrompt);
    return [title, prompt].join(' ').trim();
  });

export const parseTemplateTitle = (value: unknown): string =>
  templateTitleSchema.parse(value);

export const parseTemplateFileName = (value: unknown): string =>
  templateFileNameSchema.parse(value);

export const buildTemplateSearchSource = (params: {
  filePath?: unknown;
  templatePrompt?: unknown;
}): string => templateSearchSourceSchema.parse(params);
