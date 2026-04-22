import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DocsThemeProvider } from '@/packages/ui/src';
import { MainRoute } from '@/make/router/MainRouter';
import { BrowserRouter } from 'react-router-dom';

const MIN = 60 * 1000;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: MIN * 5,
      gcTime: MIN * 2,
      throwOnError: true,
      refetchOnWindowFocus: false
    }
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DocsThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter
          future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
        >
          <MainRoute />
        </BrowserRouter>
      </QueryClientProvider>
    </DocsThemeProvider>
  </StrictMode>
);
