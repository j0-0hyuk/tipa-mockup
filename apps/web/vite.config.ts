import { sentryVitePlugin } from "@sentry/vite-plugin";
import react from '@vitejs/plugin-react-swc'
import { createHtmlPlugin } from 'vite-plugin-html'
import { defineConfig } from 'vite'
import path from 'path'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import wasm from 'vite-plugin-wasm'


// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages 배포용 base path 지원 (VITE_BASE_PATH 환경변수로 설정)
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    createHtmlPlugin({
      minify: true,
      entry: 'src/main.tsx',
      inject: {
        data: {
          isPrototype: process.env.VITE_IS_PROTOTYPE === 'true',
        },
      },
    }),
    react({
      plugins: [['@swc/plugin-emotion', {}]]
    }),
    sentryVitePlugin({
      org: "sapere-aude",
      project: "docs-front",
      telemetry: false,
    }) as any,
    wasm(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },

  define: {
    'process.env': {}
  },

  build: {
    target: 'es2022',
    sourcemap: 'hidden',
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.code === 'EVAL' &&
          warning.id?.includes('lottie-web')
        ) {
          return;
        }
        warn(warning);
      },
    },
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },

  optimizeDeps: {
    include: ['lottie-web'],
  },

})