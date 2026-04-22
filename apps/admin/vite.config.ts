import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      plugins: [['@swc/plugin-emotion', {}]]
    }),
    tsConfigPaths(),
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    })
  ],

  define: {
    'process.env': {}
  },

  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})