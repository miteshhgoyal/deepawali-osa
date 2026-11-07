import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 900,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/three/')) {
            return 'three';
          }
          if (id.includes('node_modules/@react-three/')) {
            return 'r3f';
          }
          if (id.includes('node_modules/gsap') || id.includes('node_modules/lenis')) {
            return 'animation';
          }
        },
      },
    },
  },
});
