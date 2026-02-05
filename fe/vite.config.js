import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    allowedHosts: [
      '7a42-103-199-40-35.ngrok-free.app',
      // Allow any ngrok subdomain for convenience
      /^.*\.ngrok-free\.app$/,
    ],
  },
})
