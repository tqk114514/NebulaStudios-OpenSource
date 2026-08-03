import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Vite 8 原生 tsconfig paths 解析（替代 vite-tsconfig-paths 插件）
  resolve: {
    tsconfigPaths: true,
  },
  build: {
    sourcemap: 'hidden',
  },
  plugins: [
    react(),
  ],
})
