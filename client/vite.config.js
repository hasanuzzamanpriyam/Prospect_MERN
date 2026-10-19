import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['lucide-react', 'framer-motion', 'react-icons'],
          charts: ['recharts'],
          csv: ['papaparse', '@json2csv/plainjs', 'xlsx'],
          utils: ['axios', 'zustand', 'lz-string', 'crypto-js'],
          payment: ['@stripe/react-stripe-js', '@stripe/stripe-js', 'jsencrypt'],
        },
      },
    },
    chunkSizeWarningLimit: 500,
    target: 'es2020',
    minify: 'esbuild',
    cssCodeSplit: true,
    sourcemap: false,
  },
  optimizeDeps: {
    include: ['lucide-react'],
  },
});