import { test, expect } from '@playwright/test';
import { AdminEventTypesPage } from '../pages/AdminEventTypesPage';
import { resetDb } from '../helpers/resetDb';

test.describe('AdminEventTypesPage', () => {
  test.beforeAll(() => {
    resetDb();
  });

  test.describe('listing', () => {
    test('shows 3 event type cards from seeds', async ({ page }) => {
      const p = new AdminEventTypesPage(page);
      await p.goto();
      await expect(p.cards()).toHaveCount(3);
    });

    test('each card shows its slug ID', async ({ page }) => {
      const p = new AdminEventTypesPage(page);
      await p.goto();
      await expect(p.cardWithText('ID: intro-call-15min')).toBeVisible();
      await expect(p.cardWithText('ID: one-on-one-30min')).toBeVisible();
      await expect(p.cardWithText('ID: deep-dive-60min')).toBeVisible();
    });
  });

  test.describe('create modal', () => {
    test('"+ New event type" opens modal with correct title', async ({ page }) => {
      const p = new AdminEventTypesPage(page);
      await p.goto();
      await p.openModal();
      // Mantine Modal renders the title in a heading role
      await expect(p.modal.getByRole('heading', { name: 'Create event type' })).toBeVisible();
    });

    test('submitting empty form shows slug validation error', async ({ page }) => {
      const p = new AdminEventTypesPage(page);
      await p.goto();
      await p.openModal();
      await p.submitButton.click();
      await expect(p.slugError).toBeVisible();
    });

    test('invalid slug with uppercase shows slug error', async ({ page }) => {
      const p = new AdminEventTypesPage(page);
      await p.goto();
      await p.openModal();
      await p.slugInput.fill('My Meeting');
      await p.submitButton.click();
      await expect(p.slugError).toBeVisible();
    });

    test('valid form creates event type, closes modal, shows in list', async ({ page }) => {
      const p = new AdminEventTypesPage(page);
      await p.goto();
      await p.openModal();
      await p.fillForm('quick-chat-10min', 'Quick Chat', 'A brief check-in call.', 10);
      await p.submitButton.click();

      await expect(p.modal).not.toBeVisible();
      // Use the slug ID text to avoid matching the success notification that also contains "Quick Chat"
      await expect(p.cardWithText('ID: quick-chat-10min')).toBeVisible();
      await expect(p.cards()).toHaveCount(4);
    });

    test('duplicate slug shows error notification, modal stays open', async ({ page }) => {
      const p = new AdminEventTypesPage(page);
      await p.goto();
      await p.openModal();
      await p.fillForm('intro-call-15min', 'Duplicate Call', 'Trying to duplicate.', 15);
      await p.submitButton.click();

      await expect(page.getByText('Failed to create event type.')).toBeVisible();
      await expect(p.modal).toBeVisible();
    });
  });
});
