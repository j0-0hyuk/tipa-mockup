import { Global, ThemeProvider } from '@emotion/react';
import type { PropsWithChildren } from 'react';
import { theme } from '#styles/theme.ts';
import { globalStyles } from '#styles/globalStyles.ts';

export const DocsThemeProvider = ({ children }: PropsWithChildren) => {
  return (
    <ThemeProvider theme={theme}>
      <Global styles={globalStyles} />
      {children}
    </ThemeProvider>
  );
};
