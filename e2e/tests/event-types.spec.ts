import { test, expect } from '@playwright/test';
import { EventTypesPage } from '../pages/EventTypesPage';
import { resetDb } from '../helpers/resetDb';

test.describe('EventTypesPage', () => {
  test.beforeAll(() => {
    resetDb();
  });
  test('renders "Book a Meeting" heading', async ({ page }) => {
    const p = new EventTypesPage(page);
    await p.goto();
    await expect(p.heading).toBeVisible();
  });

  test('shows 3 event type cards from seeds', async ({ page }) => {
    const p = new EventTypesPage(page);
    await p.goto();
    await expect(p.cards()).toHaveCount(3);
  });

  test('Intro Call card shows name, duration badge, and Book button', async ({ page }) => {
    const p = new EventTypesPage(page);
    await p.goto();
    await expect(page.getByText('Intro Call')).toBeVisible();
    await expect(page.getByText('15 min').first()).toBeVisible();
    await expect(p.bookButtonFor('Intro Call')).toBeVisible();
  });

  test('One-on-One card shows 30 min badge', async ({ page }) => {
    const p = new EventTypesPage(page);
    await p.goto();
    await expect(page.getByText('One-on-One')).toBeVisible();
    await expect(page.getByText('30 min')).toBeVisible();
  });

  test('Deep Dive card shows 60 min badge', async ({ page }) => {
    const p = new EventTypesPage(page);
    await p.goto();
    await expect(page.getByText('Deep Dive')).toBeVisible();
    await expect(page.getByText('60 min')).toBeVisible();
  });

  test('"Book" on Intro Call navigates to /book/intro-call-15min', async ({ page }) => {
    const p = new EventTypesPage(page);
    await p.goto();
    await p.bookButtonFor('Intro Call').click();
    await expect(page).toHaveURL(/\/book\/intro-call-15min/);
  });
});
