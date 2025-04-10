import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(), // Add React plugin
    tsconfigPaths(), // Add tsconfig paths plugin
  ],
  test: {
    environment: 'jsdom', // Use jsdom for simulating browser environment
    globals: true, // Use Vitest globals (describe, it, expect)
    // Include test files (e.g., *.test.ts, *.spec.ts)
    include: ['**/*.{test,spec}.{ts,tsx}'],
    // Exclude node_modules, dist, .next, etc.
    exclude: ['node_modules', 'dist', '.next', '.vercel', 'generated'],
    setupFiles: ['./vitest/setup/prisma-mock.ts', './vitest/setup/next-mocks.ts'],
  },
}); 