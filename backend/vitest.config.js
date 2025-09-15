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
    exclude: ['../tests/e2e/**', '../../tests/e2e/**', '../src/**', '../../src/**', 'node_modules/**'],
    watchExclude: ['**/e2e/**', '../tests/e2e/**'],
    env: {
      NODE_ENV: 'test'
    }
  },
  coverage: {
    provider: 'v8',
    cleanOnRerun: true,
    include: [
      './src/controllers/**/*.js',
      './src/middlewares/**/*.js'
    ],
    exclude: [
      './tests/**',
      '**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'node_modules/**',
      // Fichiers spécifiques à exclure
      'server.js',
      'scripts/**',
      'src/app.js',
      'src/appTest.js',
      'src/config/**',
      'src/models/',
      'src/routes/ownerDocs.routes.js ',
      'src/routes/admin.js',
    ],
    reporter: ['text', 'html', 'lcov'],
    reportsDirectory: resolve(rootDir, 'coverage-backend')
  }
});