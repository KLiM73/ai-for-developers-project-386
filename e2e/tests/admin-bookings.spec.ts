import { test, expect } from '@playwright/test';
import { AdminBookingsPage } from '../pages/AdminBookingsPage';

test.describe('AdminBookingsPage', () => {
  test.describe('listing', () => {
    test('shows Alice Smith and Bob Jones from seeds', async ({ page }) => {
      const p = new AdminBookingsPage(page);
      await p.goto();
      await expect(p.rowByGuest('Alice Smith')).toBeVisible();
      await expect(p.rowByGuest('Bob Jones')).toBeVisible();
    });

    test('table has expected column headers', async ({ page }) => {
      const p = new AdminBookingsPage(page);
      await p.goto();
      await expect(page.getByRole('columnheader', { name: 'Event type' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Guest' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Email' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'Start' })).toBeVisible();
      await expect(page.getByRole('columnheader', { name: 'End' })).toBeVisible();
    });
  });

  test.describe('date filter', () => {
    test('API is called with the from-date filter when bookings page loads', async ({ page }) => {
      // Intercept the bookings API request and verify it includes a "from" query param
      const p = new AdminBookingsPage(page);
      const requests: string[] = [];
      page.on('request', (req) => {
        if (req.url().includes('/admin/bookings')) requests.push(req.url());
      });
      await p.goto();
      await page.waitForLoadState('networkidle');
      expect(requests.some((url) => url.includes('from='))).toBe(true);
    });

    test('mocked empty response shows "No upcoming bookings."', async ({ page }) => {
      // Intercept only the API server (port 3001), not the Vite dev server (port 3000)
      await page.route(/localhost:3001\/admin\/bookings/, (route) =>
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ items: [] }) })
      );
      const p = new AdminBookingsPage(page);
      await p.goto();
      await expect(p.noBookingsText).toBeVisible();
    });
  });

  test.describe('navigation', () => {
    test('nav "Event Types" link goes to /admin/event-types', async ({ page }) => {
      const p = new AdminBookingsPage(page);
      await p.goto();
      await page.getByRole('link', { name: 'Event Types' }).click();
      await expect(page).toHaveURL('/admin/event-types');
    });

    test('nav "← Guest View" link goes to /', async ({ page }) => {
      const p = new AdminBookingsPage(page);
      await p.goto();
      await page.getByRole('link', { name: '← Guest View' }).click();
      await expect(page).toHaveURL('/');
    });
  });
});
