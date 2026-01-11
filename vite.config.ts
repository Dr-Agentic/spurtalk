import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  server: {
    port: 8001,
    strictPort: true, // Fail if port is taken
  },
  preview: {
    port: 8002,
    strictPort: true, // Fail if port is taken
  },
})
