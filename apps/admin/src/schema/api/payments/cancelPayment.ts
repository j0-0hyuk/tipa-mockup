import { z } from 'zod';

// Request
export const cancelPaymentRequestSchema = z.object({
  paymentHistoryId: z.number(),
  paymentKey: z.string().min(1),
  cancelReason: z.string().min(1).max(200),
  cancelAmount: z.number().positive().optional()
});

export type CancelPaymentRequest = z.infer<typeof cancelPaymentRequestSchema>;

// Response
export const cancelPaymentResponseDataSchema = z.object({
  paymentKey: z.string(),
  cancelStatus: z.enum(['PARTIAL', 'FULL']),
  cancelledAmount: z.number(),
  cancelApprovedAt: z.string()
});

export const cancelPaymentResponseSchema = z
  .object({
    data: cancelPaymentResponseDataSchema
  })
  .transform(({ data }) => data);

export type CancelPaymentResponseData = z.infer<
  typeof cancelPaymentResponseDataSchema
>;
