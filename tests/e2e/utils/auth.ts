import { Page } from '@playwright/test';

export async function login(page: Page, email: string, password: string) {
  await page.goto('/login');
  await page.getByLabel(/email/i).fill(email);
  await page.getByLabel(/mot de passe|password/i).fill(password);
  await page.getByRole('button', { name: /connexion|se connecter|login/i }).click();
  await page.waitForURL('**/dashboard**', { timeout: 15000 });
}
