import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Add this line to allow external connections
    port: 5173,      // Explicitly set the port
    proxy: {
      '/api': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        secure: false
      }
    },
  },
  preview: {
    host: '0.0.0.0', 
    port: 5173
  }
});