import { test, expect } from '@playwright/test';
import { login } from './utils/auth';

const OWNER = { email: process.env.E2E_OWNER_EMAIL || 'owner@test.com', password: process.env.E2E_OWNER_PASSWORD || 'password' };

test('Propriétaire – consulter et confirmer une réservation en attente', async ({ page }) => {
  await login(page, OWNER.email, OWNER.password);
  await page.goto('/owner/dashboard');

  const pendingRow = page.getByTestId('reservation-row').filter({ hasText: /pending|en attente/i }).first();
  await expect(pendingRow).toBeVisible();

  const confirmBtn = pendingRow.getByRole('button', { name: /confirmer|confirm/i });
  await expect(confirmBtn).toBeVisible();
  await confirmBtn.click();

  await expect(pendingRow.getByText(/confirmed|confirmée/i)).toBeVisible();
});

test('Propriétaire – uploader un document contractuel (mock Firebase)', async ({ page }) => {
  await login(page, OWNER.email, OWNER.password);
  await page.goto('/owner/contractual-docs');

  // Stub API upload-url pour éviter tout appel externe pendant l'E2E
  await page.route('**/api/contractual-documents/upload-url', route =>
    route.fulfill({
      status: 201,
      body: JSON.stringify({
        documentType: 'contratLocation',
        firebaseUrl: 'https://fake/doc.pdf',
        firebasePath: 'contractual-documents/u1/doc.pdf',
        originalName: 'doc.pdf',
      }),
    })
  );

  await page.setInputFiles('input[type="file"]', 'tests/fixtures/doc.pdf');
  const sendBtn = page.getByRole('button', { name: /envoyer|upload|téléverser/i });
  await expect(sendBtn).toBeVisible();
  await sendBtn.click();

  await expect(page.getByText(/document (enregistr[ée]|upload[ée])/i)).toBeVisible();
});
