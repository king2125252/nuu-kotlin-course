import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        //rewrite: (path) => path.replace(/^\/api/, '')  // 將請求路徑中的 '/api' 移除
      },
    },
    hmr: true,
    watch: {
      usePolling: true
    }
  }
})
