import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  resolve: {
    alias: {
      'firebase-admin': fileURLToPath(new URL('./tests/mocks/firebase-admin.js', import.meta.url)),
    },
  },
  test: {
    environment: 'node',
    globals: true,
    env: {
      NODE_ENV: 'test',
      VITEST: '1',
    },
    setupFiles: ['backend/tests/setup.js'],
    include: ['backend/tests/**/*.test.{js,jsx,ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'coverage-backend',
      all: false,
      include: [
        'backend/src/controllers/**/*.js',
        'backend/src/routes/**/*.js',
        'backend/src/middlewares/**/*.js',
      ],
      exclude: [
        'backend/src/config/**',
        'backend/src/models/**',
        'backend/src/**/scripts/**',
        'backend/src/app.js',
        'backend/server.js',
      ],
    },
  },
});
