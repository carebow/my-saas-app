import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': { 
        target: 'http://localhost:8000', 
        changeOrigin: true 
      },
      '/health': { 
        target: 'http://localhost:8000', 
        changeOrigin: true 
      },
      '/healthz': { 
        target: 'http://localhost:8000', 
        changeOrigin: true 
      },
      '/docs': { 
        target: 'http://localhost:8000', 
        changeOrigin: true 
      },
      '/ws': { 
        target: 'ws://localhost:8000', 
        ws: true 
      }
    }
  },
  // Ensure environment variables are available at build time
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
  },
  plugins: [
    react(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom'],
          'router-vendor': ['react-router-dom'],
          'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-tabs'],
          'query-vendor': ['@tanstack/react-query'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'animation-vendor': ['framer-motion'],
          'chart-vendor': ['recharts'],
        },
      },
    },
    // Optimize build size
    target: 'es2020',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: mode === 'production',
      },
    },
    // Enable source maps for production debugging
    sourcemap: mode === 'development',
    // Optimize CSS
    cssCodeSplit: true,
    // Set chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Ensure proper base path for SPA
    outDir: 'dist',
    assetsDir: 'assets',
    // Copy public files including _redirects
    copyPublicDir: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'framer-motion',
    ],
  },
}));
