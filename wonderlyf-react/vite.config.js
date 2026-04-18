import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const wooTarget = env.VITE_WOO_URL || 'https://api.wonderlyf.co.uk'

  return {
    plugins: [react()],
    server: {
      // Proxy WooCommerce calls through the dev server to bypass CORS locally.
      // In production you MUST still set up CORS on WordPress.
      proxy: {
        '/wp-json': {
          target: wooTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'react-vendor': ['react', 'react-dom', 'react-router-dom'],
            'framer': ['framer-motion'],
            'icons': ['lucide-react'],
            'helmet': ['react-helmet-async'],
          },
        },
      },
      chunkSizeWarningLimit: 600,
    },
  }
})
