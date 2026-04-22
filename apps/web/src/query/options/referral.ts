import { getReferralMe } from '@/api/referral';
import { queryOptions } from '@tanstack/react-query';

export const getReferralMeQueryOptions = () => {
  return queryOptions({
    queryKey: ['referral', 'me'],
    queryFn: getReferralMe
  });
};
