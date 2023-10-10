import { defineConfig } from 'vite';
import { resolve } from 'path';

import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    fs: {
      // Allow serving files from one level up to the project root
      allow: ['../..'],
    },
  },
  resolve: {
    alias: {
      web: resolve(__dirname, '../../web'),
    },
  },
  plugins: [vue()],
});
