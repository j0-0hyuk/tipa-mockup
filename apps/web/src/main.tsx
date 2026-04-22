import '@/polyfills/requestIdleCallback';
import { StrictMode } from 'react';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { createRoot } from 'react-dom/client';
import '@/i18n';

// 프로토타입 빌드(VITE_IS_PROTOTYPE=true): 구글 로그인 없이 데모 페이지에 바로 진입하도록
// 더미 accessToken을 localStorage에 주입한다. 일반 빌드에서는 아무 일도 하지 않는다.
if (import.meta.env.VITE_IS_PROTOTYPE === 'true') {
  if (!localStorage.getItem('accessToken')) {
    localStorage.setItem('accessToken', 'prototype-stub');
    localStorage.setItem('refreshToken', 'prototype-stub');
  }
}

import App from '@/App';
import { ToastProvider, DocsThemeProvider } from '@docs-front/ui';
import AuthProvider from '@/service/auth/provider';
import AtomosProvider from '@/service/atomos/provider';

const rootElement = document.getElementById('root')!;
if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <DocsThemeProvider>
        <ToastProvider>
          <GoogleOAuthProvider
            clientId={import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID}
          >
            <AuthProvider>
              <AtomosProvider>
                <App />
              </AtomosProvider>
            </AuthProvider>
          </GoogleOAuthProvider>
        </ToastProvider>
      </DocsThemeProvider>
    </StrictMode>
  );
}
