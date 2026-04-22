import type { GetAllPaymentHistoryRequest } from '@/schema/api/payments/payments';
import { getAllPaymentHistory } from '@/api/payments';

export const getPaymentHistoryQueryOptions = (
  params?: GetAllPaymentHistoryRequest
) => ({
  queryKey: ['payment', 'history', params],
  queryFn: () =>
    getAllPaymentHistory({
      page: params?.page ?? 0,
      size: params?.size ?? 10,
      filter: params?.filter ?? 'PAID'
    })
});
