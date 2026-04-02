import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Dev: `/api/*` is proxied so the browser stays same-origin (no CORS).
 * Default: real payment API. If the proxy target is down, Vite returns ~500 and the browser shows "getproductDetails failed (500)".
 *
 * Optional: run `node server/index.mjs` and start Vite with
 *   DEV_API_PROXY=http://127.0.0.1:8787
 * to forward through the local Express wrapper (see package.json `dev:api-stack`).
 */
const devApiProxy = process.env.DEV_API_PROXY || 'https://playtonight.fun'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  server: {
    proxy: {
      '/api': {
        target: devApiProxy,
        changeOrigin: true,
        secure: true,
      },
    },
  },
})

