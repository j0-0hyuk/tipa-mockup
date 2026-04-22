import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import type { QueryClient } from '@tanstack/react-query';
import type { AuthContext } from '@/hooks/useAuth';
import type { useToast } from '@bichon/ds';

type ToastContext = ReturnType<typeof useToast>;

type RouterContext = {
  authentication: AuthContext;
  queryClient: QueryClient;
  toast: ToastContext;
};

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <>
      <Outlet />
    </>
  )
});
