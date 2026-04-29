import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react({
    jsxRuntime: 'automatic',
    babel: {
      plugins: [['@babel/plugin-proposal-decorators', { legacy: true }]]
    }
  })],
  server: {
    middlewareMode: false,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 5173
    }
  }
})