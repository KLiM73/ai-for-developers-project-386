import { type Page, type Locator } from '@playwright/test';

export class AdminEventTypesPage {
  readonly page: Page;
  readonly heading: Locator;
  readonly newButton: Locator;
  readonly modal: Locator;
  readonly slugInput: Locator;
  readonly nameInput: Locator;
  readonly descriptionInput: Locator;
  readonly durationInput: Locator;
  readonly submitButton: Locator;
  readonly slugError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Event Types' });
    this.newButton = page.getByRole('button', { name: '+ New event type' });
    this.modal = page.getByRole('dialog');
    this.slugInput = page.getByLabel('Slug ID');
    // Scope nameInput to modal to avoid matching other inputs on the page
    this.nameInput = page.getByRole('dialog').getByLabel('Name');
    this.descriptionInput = page.getByLabel('Description');
    this.durationInput = page.getByLabel('Duration (minutes)');
    this.submitButton = page.getByRole('button', { name: 'Create event type' });
    this.slugError = page.getByText(/Lowercase slug required/);
  }

  async goto() {
    await this.page.goto('/admin/event-types');
  }

  async openModal() {
    await this.newButton.click();
    await this.modal.waitFor({ state: 'visible' });
  }

  async fillForm(slug: string, name: string, description: string, duration: number) {
    await this.slugInput.fill(slug);
    await this.nameInput.fill(name);
    await this.descriptionInput.fill(description);
    await this.durationInput.fill(String(duration));
  }

  cardWithText(text: string): Locator {
    return this.page.getByText(text);
  }

  cards(): Locator {
    // Admin event type cards always show "ID: <slug>" text
    return this.page.locator('[class*="Card"]').filter({ hasText: 'ID:' });
  }
}
