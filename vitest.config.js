import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./backend/tests/setup.js'],
    include: ['backend/tests/**/*.{test,spec}.js'],
    exclude: ['tests/e2e/**', 'src/**', 'node_modules/**'],
    env: { NODE_ENV: 'test' },
    coverage: {
      provider: 'v8',
      exclude: [
        'tests/**',
        '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        'node_modules/**',
        'server.js',
        'scripts/**',
        'src/app.js',
        'src/appTest.js',
        'src/config/**',
        'backend/src/config/**',
      ],
    },
  },
});
