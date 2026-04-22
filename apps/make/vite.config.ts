import react from '@vitejs/plugin-react-swc'
import { defineConfig } from 'vite'
import tsConfigPaths from 'vite-tsconfig-paths'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      plugins: [['@swc/plugin-emotion', {}]]
    }),
    tsConfigPaths(), 
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