import { type Page, type Locator } from '@playwright/test';

export class EventTypesPage {
  readonly page: Page;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Book a Meeting' });
  }

  async goto() {
    await this.page.goto('/');
  }

  cards(): Locator {
    // EventTypeCard renders a Card with a "Book" button — this scopes to guest event cards only
    return this.page.locator('[class*="Card"]').filter({ has: this.page.getByRole('button', { name: 'Book' }) });
  }

  bookButtonFor(eventTypeName: string): Locator {
    return this.page
      .locator('[class*="Card"]')
      .filter({ hasText: eventTypeName })
      .getByRole('button', { name: 'Book' });
  }
}
