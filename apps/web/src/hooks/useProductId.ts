import { useMatchRoute } from '@tanstack/react-router';

export const useProductId = () => {
  const matchRoute = useMatchRoute();
  const params = matchRoute({ from: '/c/$productId' });

  if (!params) {
    throw new Error('Product ID is available in /c/$productId');
  }

  return params.productId;
};
