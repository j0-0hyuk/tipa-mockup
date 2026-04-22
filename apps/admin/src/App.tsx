import { createRouter, RouterProvider } from '@tanstack/react-router';

import { useAuth, AuthProvider } from '@/hooks/useAuth';
import { routeTree } from '@/routeTree.gen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useToast } from '@bichon/ds';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      throwOnError: true
    }
  }
});

const router = createRouter({
  routeTree,
  context: { authentication: undefined!, queryClient, toast: undefined! },
  notFoundMode: 'root'
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }

  interface HistoryState {
    funnelContext?: Record<string, unknown>;
    itemName?: string;
  }
}

function App() {
  const authentication = useAuth();
  const toast = useToast();
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider value={authentication}>
        <RouterProvider router={router} context={{ authentication, toast }} />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
