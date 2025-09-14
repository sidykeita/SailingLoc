import { test, expect } from '@playwright/test';
import { login } from './utils/auth';

test.describe('Owner Flows', () => {
  test('should pass basic test', async ({ page }) => {
    expect(1 + 1).toBe(2);
  });
});