import { getSubscription } from '@/api/subscription';
import { queryOptions } from '@tanstack/react-query';

export const getSubscriptionQueryOptions = () => {
  return queryOptions({
    queryKey: ['subscription'],
    queryFn: getSubscription
  });
};
