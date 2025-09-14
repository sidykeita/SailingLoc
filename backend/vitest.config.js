import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';

const rootDir = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  root: rootDir,
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./tests/setup.js'],
    include: ['./tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    watchExclude: ['**/e2e/**', '../tests/e2e/**'],
    env: {
      NODE_ENV: 'test'
    }
  },
  coverage: {
    provider: 'v8',
    all: false,
    include: [
      './src/controllers/**/*.js',
      './src/middlewares/**/*.js',
      './src/routes/**/*.js'
    ],
    exclude: [
      './tests/**',
      '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'node_modules/**',
      // Bootstrapping / infra not under test
      '**/server.js',
      'scripts/**',
      // Config and deprecated modules
      'src/config/**',
      'src/routes/admin.js',
      'src/controllers/ownerDocs.controller.js',
      'src/routes/ownerDocs.routes.js',
      'src/appTest.js',
      'src/models/db.js'
    ],
    reporter: ['text', 'html', 'lcov'],
    reportsDirectory: resolve(rootDir, 'coverage-backend')
  }
});