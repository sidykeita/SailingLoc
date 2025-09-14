import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    include: ['src/__tests__/**/*.test.{js,jsx,ts,tsx}'],
    exclude: ['src/App.test.jsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      reportsDirectory: 'coverage',
      all: true,
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'backend/**',
        'src/main.jsx',
        'src/firebase.js',
        'src/config/**',
        'src/backup/**',
        'src/assets/**',
        'src/**/__tests__/**',
        'src/test/**',
        '**/*.config.*',
        'vite.config.*',
        'vitest.config.*',
        'postcss.config.*',
        'tailwind.config.*',
      ],
    },
  },
});
