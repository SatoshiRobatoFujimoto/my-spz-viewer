import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      'three': path.resolve(__dirname, 'node_modules/three'),
    },
  },
  server: {
    port: 5173,
    open: true,
    fs: {
      allow: ['..']
    }
  },
  optimizeDeps: {
    exclude: ['@sparkjsdev/spark'],
    include: ['three']
  },
  assetsInclude: ['**/*.wasm'],
  build: {
    target: 'esnext',
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith('.wasm')) {
            return 'assets/[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  }
})

