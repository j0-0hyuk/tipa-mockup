import { detailInputFormBaseSchema } from '@/schema/main/detailInput';
import { z } from 'zod';
import { CHART_COLOR_KEYS } from '@/constants/chartColors.constant';
import { parseMarkdownFallback } from '@/schema/main/fallback';
import type { Theme } from '@docshunt/docs-editor-wasm';

const fileSchema =
  typeof File === 'undefined' ? z.custom<File>(() => true) : z.instanceof(File);

// Remove files and templateFile as they are sent in FormData separately
// Omit file-related fields from the JSON schema; they are handled via FormData
// API payload uses object schema (cross-field condition is validated before this stage)
export const postProductsRequestSchema = detailInputFormBaseSchema
  .omit({ files: true })
  .extend({
    // Backend requires non-empty itemDescription
    itemDescription: z.string().min(1)
  })
  .transform((data) => ({
    itemName: data.itemName,
    itemDescription: data.itemDescription,
    businessStory: data.businessStory,
    marketAndStrategy: data.marketAndStrategy,
    revenueAndFinancials: data.revenueAndFinancials,
    progressAndRoadmap: data.progressAndRoadmap,
    teamName: data.teamName,
    teamInfo: data.teamInfo?.length
      ? JSON.stringify(
          data.teamInfo.filter(
            (row) =>
              row.name || row.position || row.responsibilities || row.skills
          )
        )
      : undefined,
    themeColor: 'BLUE'
  }));

export const postProductsContentsRequestSchema = z.object({
  contents: z.record(z.string(), z.string()),
  files: z.array(fileSchema).optional()
});

export type PostProductsLegacyRequestParams = z.input<
  typeof postProductsRequestSchema
>;

export type PostProductsRequestParams = z.infer<
  typeof postProductsContentsRequestSchema
>;

export type PostProductsRequestParamsInput = PostProductsRequestParams;

export const postProductsResponseSchema = z
  .object({
    data: z.object({
      productId: z.number()
    })
  })
  .transform((data) => data.data.productId);

export const getProductsResponseSchema = z
  .object({
    data: z.object({
      products: z.array(
        z.object({
          id: z.number(),
          itemName: z.string().nullable()
        })
      )
    })
  })
  .transform((data) => data.data.products);

export const getProductResponseSchema = z
  .object({
    data: z.object({
      id: z.number(),
      itemName: z.string().nullable(),
      themeColor: z.enum(CHART_COLOR_KEYS),
      lastUpdatedAt: z.string().optional(),
      generationStatus: z.enum(['PENDING', 'PROGRESS', 'COMPLETED', 'FAILED']),
      content: z.string().nullable()
    })
  })
  .transform((data) => ({
    ...data.data,
    content: parseMarkdownFallback(data.data.content)
  }))
  .transform((data) => {
    const removeQuotes = (value: string | null): string | null => {
      if (!value) return value;
      const trimmed = value.trim();
      if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
        try {
          return JSON.parse(trimmed);
        } catch {
          return value;
        }
      }
      return value;
    };

    return {
      ...data,
      itemName: removeQuotes(data.itemName),
      content: removeQuotes(data.content)
    };
  });

export type GetProductResponse = z.infer<typeof getProductResponseSchema>;

// --- v3.3 내문서 조회 api ---
export const fileTypeSchema = z.enum([
  'FORMAT',
  'EXPORT',
  'IMAGE',
  'TEMPLATE',
  'ALL'
]);
export type FileType = z.infer<typeof fileTypeSchema>;

export const statusSchema = z.enum([
  'PENDING',
  'PROGRESS',
  'COMPLETED',
  'FAILED'
]);
export type Status = z.infer<typeof statusSchema>;

const formatDateToYYYYMMDD = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

export const templateMetaSchema = z.object({
  templateViewerUrl: z.string().nullable().optional(),
  postingUrl: z.string().nullable().optional(),
  templatePrompt: z.string().nullable().optional(),
  templateMarkdown: z.string().nullable().optional(),
  organizingAgency: z.string().nullable().optional(),
  deadline: z.string().nullable().optional()
});

const productFilePathMapContentsBaseSchema = z.object({
  productFileId: z.coerce.number(),
  filePath: z.string().nullable(),
  status: statusSchema,
  createdAt: z.string(),
  isInterested: z.boolean().optional(),
  fileType: fileTypeSchema.optional(),
  productFilePathMapId: z.number().optional(),
  templateMeta: templateMetaSchema.optional()
});

export const productFilePathMapContentsSchema =
  productFilePathMapContentsBaseSchema.transform((item) => ({
    ...item,
    isInterested: item.isInterested ?? false,
    createdAtRaw: item.createdAt,
    createdAt: formatDateToYYYYMMDD(item.createdAt)
  }));
export type ProductFilePathMapContents = z.infer<
  typeof productFilePathMapContentsSchema
>;

export const pageSchema = <T extends z.ZodTypeAny>(contentSchema: T) =>
  z.object({
    content: z.array(contentSchema),
    empty: z.boolean(),
    first: z.boolean(),
    last: z.boolean(),
    number: z.number().int(),
    numberOfElements: z.number().int(),
    pageable: z.object({
      pageNumber: z.number().int(),
      pageSize: z.number().int(),
      sort: z.object({
        empty: z.boolean(),
        sorted: z.boolean(),
        unsorted: z.boolean()
      }),
      offset: z.number().int(),
      paged: z.boolean(),
      unpaged: z.boolean()
    }),
    size: z.number().int(),
    sort: z.object({
      empty: z.boolean(),
      sorted: z.boolean(),
      unsorted: z.boolean()
    }),
    totalElements: z.number().int(),
    totalPages: z.number().int()
  });

export const getProductsFilesRequestSchema = z.object({
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(10),
  fileType: fileTypeSchema.optional()
});

export const getProductsFilesResponseSchema = z.object({
  data: z.object({
    exports: pageSchema(productFilePathMapContentsSchema).optional(),
    templates: pageSchema(productFilePathMapContentsSchema).optional()
  }),
  error: z.any().nullable().default(null)
});

export type GetProductsFilesRequestParams = z.input<
  typeof getProductsFilesRequestSchema
>;

export type GetProductsFilesResponse = z.infer<
  typeof getProductsFilesResponseSchema
>;

// --- v3.3 템플릿 업로드 api ---
export const postProductTemplateRequestSchema = z.object({
  documentFormat: z.instanceof(File)
});

export const postProductTemplateResponseSchema = z.object({
  data: z.object({
    productFileId: z.number()
  }),
  error: z.any().nullable().default(null)
});

export type PostProductTemplateRequestParams = z.input<
  typeof postProductTemplateRequestSchema
>;

export type PostProductTemplateResponse = z.infer<
  typeof postProductTemplateResponseSchema
>;

export const templateInterestResponseSchema = z.object({
  isInterested: z.boolean()
});
export type TemplateInterestResponse = z.infer<
  typeof templateInterestResponseSchema
>;

export const templateInterestApiResponseSchema = z.object({
  data: templateInterestResponseSchema,
  error: z.any().nullable().default(null)
});

export const productImageMetaDataSchema = z.object({
  name: z.string(),
  info: z.string()
});
export type ProductImageMetaData = z.infer<typeof productImageMetaDataSchema>;

export const svgSuggestionMetaDataSchema = z.object({
  name: z.string(),
  info: z.string(),
  position: z.string(),
  gen_by: z.enum(['ai', 'human'])
});
export type SvgSuggestionMetaData = z.infer<typeof svgSuggestionMetaDataSchema>;

export const languageSchema = z.enum(['en', 'ko']);
export type Language = z.infer<typeof languageSchema>;

/**
 * export API 요청 body.contents 스키마.
 * 프론트에서는 프롬프트/참고자료/초안 중 하나만 있어도 제출 가능하므로
 * userPrompt, productContents가 빈 문자열로 올 수 있음.
 * 백엔드에서 둘 다 required로 검증하면 400이 날 수 있음 → optional 또는 빈 문자열 허용 필요.
 */
const themeSchema: z.ZodType<Theme> = z.object({
  character: z.record(z.string(), z.any()),
  paragraph: z.record(z.string(), z.any()),
  border: z.record(z.string(), z.any()),
  style: z.record(z.string(), z.any())
}) as z.ZodType<Theme>;

export const createExportedProductRequestSchema = z.object({
  userPrompt: z.string(),
  productContents: z.string(),
  productImagesMetaData: z.array(productImageMetaDataSchema),
  svgSuggestions: z.array(svgSuggestionMetaDataSchema),
  exportProductFileId: z.number().optional(),
  templateFileId: z.number(),
  language: languageSchema,
  theme: themeSchema.optional()
});
export type CreateExportedProductRequest = z.infer<
  typeof createExportedProductRequestSchema
>;

export const postProductsExportRequestSchema = z.object({
  contents: createExportedProductRequestSchema,
  referenceFiles: z.array(z.instanceof(File)).optional(),
  productImages: z.array(z.instanceof(File)).optional()
});

export const postProductsExportResponseSchema = z.object({
  data: z.object({
    exportedProductId: z.number()
  }),
  error: z.any().nullable().default(null)
});

export type PostProductsExportRequestParams = z.input<
  typeof postProductsExportRequestSchema
>;

export type PostProductsExportResponse = z.infer<
  typeof postProductsExportResponseSchema
>;

/** 서버에서 JSON 문자열 또는 객체로 올 수 있음 */
const themeFieldSchema = z
  .union([z.string(), themeSchema])
  .transform((val) => (typeof val === 'string' ? JSON.parse(val) : val))
  .pipe(themeSchema);

export const getProductFileStatusResponseSchema = z.object({
  data: z.object({
    productFileId: z.number(),
    fileType: fileTypeSchema.optional(),
    filePath: z.string().nullable(),
    status: statusSchema,
    theme: themeFieldSchema.nullable().optional(),
    createdAt: z.string()
  }),
  error: z.any().nullable().default(null)
});

export type GetProductFileStatusResponse = z.infer<
  typeof getProductFileStatusResponseSchema
>;
