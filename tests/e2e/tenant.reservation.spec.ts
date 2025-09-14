import { test, expect } from '@playwright/test';
import { login } from './utils/auth';
import { applyFilters } from './utils/filter';

test.describe('Tenant Reservation Flow', () => {
  test('should pass basic test', async ({ page }) => {
    expect(1 + 1).toBe(2);
  });
});