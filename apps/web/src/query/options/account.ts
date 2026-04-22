import { getMyAccount } from '@/api/accounts';
import { queryOptions } from '@tanstack/react-query';

export const getAccountMeQueryOptions = () => {
  return queryOptions({
    queryKey: ['account', 'me'],
    queryFn: getMyAccount
  });
};
