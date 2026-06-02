import { test, expect } from '@playwright/test';
import { BookingPage } from '../pages/BookingPage';
import { BookingSuccessPage } from '../pages/BookingSuccessPage';
import { resetDb } from '../helpers/resetDb';

test.describe('BookingPage', () => {
  test.beforeAll(() => {
    resetDb();
  });

  test.describe('slot selection step', () => {
    test('shows event name and duration badge', async ({ page }) => {
      const p = new BookingPage(page);
      await p.goto('one-on-one-30min');
      await expect(page.getByRole('heading', { name: 'One-on-One' })).toBeVisible();
      await expect(page.getByText('30 min')).toBeVisible();
    });

    test('loads at least one time slot button', async ({ page }) => {
      const p = new BookingPage(page);
      await p.goto('one-on-one-30min');
      await p.waitForSlotsLoaded();
      await expect(p.slotButtons().first()).toBeVisible();
    });

    test('clicking a slot shows "Your details" heading', async ({ page }) => {
      const p = new BookingPage(page);
      await p.goto('intro-call-15min');
      await p.selectFirstSlot();
      await expect(p.detailsHeading).toBeVisible();
      await expect(p.pickTimeHeading).not.toBeVisible();
    });

    test('Back button returns to slot grid', async ({ page }) => {
      const p = new BookingPage(page);
      await p.goto('intro-call-15min');
      await p.selectFirstSlot();
      await p.backButton.click();
      await expect(p.pickTimeHeading).toBeVisible();
    });
  });

  test.describe('form validation', () => {
    test('submitting empty form shows both errors', async ({ page }) => {
      const p = new BookingPage(page);
      await p.goto('intro-call-15min');
      await p.selectFirstSlot();
      await p.confirmButton.click();
      await expect(p.nameError).toBeVisible();
      await expect(p.emailError).toBeVisible();
    });

    test('name shorter than 2 chars shows only name error', async ({ page }) => {
      const p = new BookingPage(page);
      await p.goto('intro-call-15min');
      await p.selectFirstSlot();
      await p.fillForm('A', 'valid@example.com');
      await p.confirmButton.click();
      await expect(p.nameError).toBeVisible();
      await expect(p.emailError).not.toBeVisible();
    });

    test('invalid email format shows only email error', async ({ page }) => {
      const p = new BookingPage(page);
      await p.goto('intro-call-15min');
      await p.selectFirstSlot();
      // Use a value that passes HTML5 validation but fails the mantine regex (no TLD-like dot)
      // Actually bypass browser native validation by removing type=email via JS
      await p.fillForm('Jane Doe', 'notanemail');
      // Remove type="email" so browser native validation doesn't block form submission
      await page.evaluate(() => {
        const input = document.querySelector('input[type="email"]');
        if (input) input.removeAttribute('type');
      });
      await p.confirmButton.click();
      await expect(p.emailError).toBeVisible();
      await expect(p.nameError).not.toBeVisible();
    });
  });

  test.describe('happy path', () => {
    test('guest completes a full booking end-to-end', async ({ page }) => {
      const booking = new BookingPage(page);
      const success = new BookingSuccessPage(page);

      await booking.goto('intro-call-15min');
      await booking.selectFirstSlot();
      await booking.fillForm('Jane Doe', 'jane@example.com');
      await booking.confirmButton.click();

      await expect(page).toHaveURL(/\/book\/intro-call-15min\/success/);
      await expect(success.heading).toBeVisible();
      // Success page shows email in two places; use first() to avoid strict mode violation
      await expect(page.getByText('jane@example.com').first()).toBeVisible();
      await expect(success.detailText('Event')).toBeVisible();
      await expect(success.detailText('Name')).toBeVisible();
    });

    test('"Book another meeting" returns to home page', async ({ page }) => {
      const booking = new BookingPage(page);
      const success = new BookingSuccessPage(page);

      await booking.goto('deep-dive-60min');
      await booking.selectFirstSlot();
      await booking.fillForm('Bob Test', 'bob@example.com');
      await booking.confirmButton.click();

      await expect(success.heading).toBeVisible();
      await success.bookAnotherButton.click();
      await expect(page).toHaveURL('/');
    });
  });
});
