import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
  },
  server: {
    // Security headers for development
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    }
  },
  build: {
    // Security optimizations
    minify: 'terser',
    sourcemap: false, // Don't expose source maps in production
    rollupOptions: {
      output: {
        format: 'es'
      }
    },
    terserOptions: {
      compress: {
        // Remove console logs and debugger statements in production
        drop_console: true,
        drop_debugger: true
      }
    }
  }
});
