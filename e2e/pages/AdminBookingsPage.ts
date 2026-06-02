import { type Page, type Locator } from '@playwright/test';

export class AdminBookingsPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly tableRows: Locator;
  readonly noBookingsText: Locator;
  readonly fromDateInput: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Upcoming Bookings' });
    this.tableRows = page.locator('tbody tr');
    this.noBookingsText = page.getByText('No upcoming bookings.');
    this.fromDateInput = page.getByLabel('From date');
  }

  async goto() {
    await this.page.goto('/admin/bookings');
  }

  rowByGuest(name: string): Locator {
    return this.tableRows.filter({ hasText: name });
  }
}
