import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      // Proxy untuk API backend
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      // Proxy untuk gambar dari backend
      '/images': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  preview: {
    port: 4173,
    host: '0.0.0.0',
    allowedHosts: [
      'ginbers-elektonik-production.up.railway.app',
      '.railway.app',
      'localhost',
    ],
  },
});
