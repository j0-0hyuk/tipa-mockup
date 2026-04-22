import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BichonThemeProvider, ToastProvider } from '@bichon/ds';
import App from '@/App.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';
const rootElement = document.getElementById('root')!;
const googleClientId = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;

if (!rootElement.innerHTML) {
  const root = createRoot(rootElement);
  const app = (
    <BichonThemeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </BichonThemeProvider>
  );

  root.render(
    <StrictMode>
      {googleClientId ? (
        <GoogleOAuthProvider clientId={googleClientId}>
          {app}
        </GoogleOAuthProvider>
      ) : (
        app
      )}
    </StrictMode>
  );
}
