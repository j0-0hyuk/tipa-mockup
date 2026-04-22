import { z } from 'zod';

export enum ItemType {
  SUBSCRIPTION_M = 'SUBSCRIPTION_M',
  SUBSCRIPTION_Y = 'SUBSCRIPTION_Y',
  SEASON_PASS = 'SEASON_PASS',
  MONTHLY_PASS = 'MONTHLY_PASS'
}

export enum CurrencyCode {
  USD = 'USD',
  KRW = 'KRW'
}

export const paymentTotalsSchema = z.object({
  total: z.string().nullish(),
  currency_code: z.enum(CurrencyCode).nullish()
});

export const paymentDetailsSchema = z.object({
  totals: paymentTotalsSchema
});

export const PostPaymentEventRequestSchema = z.object({
  event_type: z.string(),
  data: z.object({
    customer_id: z.string(),
    id: z.string(),
    items: z.array(
      z.object({
        price: z.object({
          custom_data: z.object({
            type: z.string()
          })
        }),
        quantity: z.number().int()
      })
    ),
    custom_data: z.object({ account_id: z.number().int() }).nullish(),
    next_billed_at: z.string().nullish(),
    subscription_id: z.string().nullish(),
    details: paymentDetailsSchema.nullish()
  }),
  occurred_at: z.string()
});

export type PostPaymentEventRequest = z.infer<
  typeof PostPaymentEventRequestSchema
>;
export const getSubscriptionResponseSchema = z.object({
  data: z
    .object({
      id: z.number(),
      item: z.enum(['SUBSCRIPTION_M', 'SUBSCRIPTION_Y', 'SEASON_PASS', 'MONTHLY_PASS']),
      firstBilledAt: z.string().nullish(),
      endsAt: z.string().nullish(),
      changeToAtEnds: z.enum(['CANCELED', 'SUBSCRIPTION_M', 'SUBSCRIPTION_Y', 'SEASON_PASS_EXPIRED', 'MONTHLY_PASS_EXPIRED']),
      scheduledCancelsAt: z.string().nullish()
    })
    .nullish()
});

export const getReceiptResponseSchema = z.object({
  data: z.object({
    receiptUrl: z.string().url()
  })
});

export const getAllPaymentHistoryRequestSchema = z.object({
  page: z.number().int().min(0).default(0),
  size: z.number().int().min(1).max(100).default(10),
  filter: z.enum(['PAID']).nullish()
});
export type GetAllPaymentHistoryRequest = z.infer<
  typeof getAllPaymentHistoryRequestSchema
>;

const formatDateToYYYYMMDD = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date string');
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}.${month}.${day}`;
};

export const getAllPaymentHistoryResponseSchema = z.object({
  data: z.object({
    paymentHistoryPage: z.object({
      content: z.array(
        z.object({
          id: z.number().int(),
          eventType: z.string(),
          itemType: z.string(),
          totalPrice: z.number().int(),
          currency: z.string(),
          payedAt: z.string().nullish(),
          nextPaidAt: z.string().nullish(),
          createdAt: z
            .string()
            .transform((dateString) => formatDateToYYYYMMDD(dateString))
        })
      ),
      last: z.boolean(),
      totalPages: z.number().int()
    })
  })
});
