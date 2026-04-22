import { z } from 'zod';

export const getAccountResponseSchema = z.object({
  accountId: z.number(),
  email: z.string(),
  provider: z.string(),
  name: z.string().nullable(),
  language: z.string(),
  role: z.string(),
  freeCredit: z.number(),
  paidCredit: z.number(),
  paddleCustomerId: z.string().nullable(),
  freeUserCreditRefillAt: z.string().nullable()
});

export const updateAccountCreditRequestSchema = z.object({
  accountId: z.number(),
  freeCredit: z.number().nullable(),
  paidCredit: z.number().nullable()
});

export type GetAccountResponse = z.infer<typeof getAccountResponseSchema>;
export type UpdateAccountCreditRequest = z.infer<
  typeof updateAccountCreditRequestSchema
>;

export const getMyAccountResponseSchema = z
  .object({
    data: z.object({
      id: z.number(),
      provider: z.string(),
      email: z.string(),
      name: z.string().nullish(),
      language: z.enum(['ko', 'en']),
      role: z.enum(['FREE', 'SUB', 'MONTHLY_PASS', 'SEASON_PASS', 'ADMIN']),
      freeCredit: z.number(),
      paidCredit: z.number(),
      paddleCustomerId: z.string().nullish(),
      createdAt: z.string(),
      termsConsents: z.array(
        z.object({
          termsCode: z.string(),
          title: z.string(),
          isRequired: z.boolean(),
          agreed: z.boolean(),
          agreedAt: z.string().nullish()
        })
      ),
      hasProAccess: z.boolean(),
      productCreationCredit: z.number(),
      productExportCredit: z.number(),
      hasLowCreditProductProcess: z.boolean()
    })
  })
  .transform((data) => data.data);

export type GetMyAccountResponse = z.infer<typeof getMyAccountResponseSchema>;

// 정렬 필드
export const sortFieldEnum = z.enum([
  'ID',
  'NAME',
  'EMAIL',
  'ROLE',
  'FREE_CREDIT',
  'PAID_CREDIT'
]);
export type SortField = z.infer<typeof sortFieldEnum>;

// 정렬 방향
export const sortDirectionEnum = z.enum(['ASC', 'DESC']);
export type SortDirection = z.infer<typeof sortDirectionEnum>;

// 전체 사용자 목록 조회
export const getAllAccountsRequestSchema = z.object({
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(30),
  email: z.string().optional(),
  sort: sortFieldEnum.optional(),
  direction: sortDirectionEnum.optional()
});

export type GetAllAccountsRequest = z.infer<typeof getAllAccountsRequestSchema>;

// 서버 응답의 개별 계정 스키마 (hasProAccess 포함)
export const getAccountByAdminResponseSchema = z.object({
  accountId: z.number(),
  email: z.string(),
  provider: z.string(),
  name: z.string().nullable(),
  language: z.string(),
  role: z.string(),
  freeCredit: z.number(),
  paidCredit: z.number(),
  paddleCustomerId: z.string().nullable(),
  freeUserCreditRefillAt: z.string().nullable(),
  hasProAccess: z.boolean()
});

export type GetAccountByAdminResponse = z.infer<
  typeof getAccountByAdminResponseSchema
>;

export const getAllAccountsResponseSchema = z.object({
  data: z.object({
    accountPage: z.object({
      content: z.array(getAccountByAdminResponseSchema),
      totalElements: z.number(),
      totalPages: z.number(),
      size: z.number(),
      number: z.number(),
      first: z.boolean(),
      last: z.boolean()
    })
  })
});

export type GetAllAccountsResponse = z.infer<
  typeof getAllAccountsResponseSchema
>;