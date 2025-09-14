import { Page } from '@playwright/test';

export async function applyFilters(
  page: Page,
  { port, start, end }: { port?: string; start?: string; end?: string }
) {
  if (port) {
    // Try select, fallback to input
    const portSelect = page.getByLabel(/port/i);
    if (await portSelect.count()) {
      await portSelect.selectOption(port);
    } else {
      await page.getByPlaceholder(/port/i).fill(port);
    }
  }
  if (start) await page.getByLabel(/date.*d[ée]but|start date/i).fill(start);
  if (end) await page.getByLabel(/date.*fin|end date/i).fill(end);
  const btn = page.getByRole('button', { name: /rechercher|filtrer|search/i });
  if (await btn.count()) {
    await btn.click();
  }
}
