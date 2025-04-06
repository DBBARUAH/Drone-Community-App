import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./vitest.setup.ts'],
    alias: {
      '@': resolve(__dirname, './app'),
      '@components': resolve(__dirname, './app/components'),
      '@lib': resolve(__dirname, './app/lib'),
      '@utils': resolve(__dirname, './app/utils')
    },
  },
}); 