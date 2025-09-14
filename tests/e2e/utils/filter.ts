import { Page } from '@playwright/test';

export async function applyFilters(page: Page, port?: string, startDate?: string, endDate?: string) {
  if (port) {
    await page.selectOption('[data-testid="port-filter"]', port);
  }
  
  if (startDate) {
    await page.fill('[data-testid="start-date"]', startDate);
  }
  
  if (endDate) {
    await page.fill('[data-testid="end-date"]', endDate);
  }
  
  await page.click('[data-testid="apply-filters"]');
}