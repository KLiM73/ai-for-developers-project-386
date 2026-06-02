import { type Page, type Locator } from '@playwright/test';

export class BookingSuccessPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly bookAnotherButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Booking Confirmed!' });
    this.bookAnotherButton = page.getByRole('link', { name: 'Book another meeting' });
  }

  detailText(label: string): Locator {
    return this.page.getByText(new RegExp(`${label}:`));
  }
}
