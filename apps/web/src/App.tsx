import { createRouter, RouterProvider } from '@tanstack/react-router';

import { useAuth } from '@/service/auth/hook';
import { routeTree } from '@/routeTree.gen';
import { QueryClientProvider } from '@tanstack/react-query';
import { useToast } from '@docs-front/ui';
import * as Sentry from '@sentry/react';
import TagManager from 'react-gtm-module';
import ReactPixel from 'react-facebook-pixel';
import { docsQueryClient } from '@/query/client';
import { auth } from '@/service/auth/instance';
import {
  BichonThemeProvider,
  ToastProvider as BichonToastProvider
} from '@bichon/ds';

// Vite base('/instant-prompt-prototype/' 등) 하위에서 배포될 때 라우트가 매칭되도록
// basepath 를 BASE_URL 기반으로 세팅한다. 기본('/')에서는 basepath 미지정과 동일.
const rawBaseUrl = import.meta.env.BASE_URL || '/';
const routerBasepath =
  rawBaseUrl === '/' ? undefined : rawBaseUrl.replace(/\/$/, '');

const router = createRouter({
  routeTree,
  basepath: routerBasepath,
  context: {
    auth,
    queryClient: docsQueryClient,
    toast: undefined!
  },
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

ReactPixel.init(import.meta.env.VITE_FACEBOOK_PIXEL_ID);

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [Sentry.tanstackRouterBrowserTracingIntegration(router)],
  tracesSampleRate: 1.0,
  environment: import.meta.env.MODE
});

if (import.meta.env.VITE_ENVIRONMENT === 'prod') {
  TagManager.initialize({ gtmId: import.meta.env.VITE_GTM_ID });
}

function App() {
  const auth = useAuth();
  const toast = useToast();
  return (
    <BichonThemeProvider>
      <BichonToastProvider>
        <QueryClientProvider client={docsQueryClient}>
          <RouterProvider router={router} context={{ auth, toast }} />
        </QueryClientProvider>
      </BichonToastProvider>
    </BichonThemeProvider>
  );
}

export default App;
