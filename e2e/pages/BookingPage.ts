import { type Page, type Locator } from '@playwright/test';

export class BookingPage {
  readonly page: Page;
  readonly pickTimeHeading: Locator;
  readonly detailsHeading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly backButton: Locator;
  readonly confirmButton: Locator;
  readonly nameError: Locator;
  readonly emailError: Locator;
  readonly noAvailabilityAlert: Locator;

  constructor(page: Page) {
    this.page = page;
    this.pickTimeHeading = page.getByRole('heading', { name: 'Pick a time' });
    this.detailsHeading = page.getByRole('heading', { name: 'Your details' });
    this.nameInput = page.getByLabel('Full name');
    this.emailInput = page.getByLabel('Email address');
    this.backButton = page.getByRole('button', { name: '← Back' });
    this.confirmButton = page.getByRole('button', { name: 'Confirm booking' });
    this.nameError = page.getByText('Name must be at least 2 characters');
    this.emailError = page.getByText('Enter a valid email address');
    this.noAvailabilityAlert = page.getByText('No available slots for the next 14 days.');
  }

  async goto(eventTypeId: string) {
    await this.page.goto(`/book/${eventTypeId}`);
  }

  async waitForSlotsLoaded() {
    await this.page.locator('[class*="Loader"]').waitFor({ state: 'hidden' });
    // Also wait for any network requests to finish
    await this.page.waitForLoadState('networkidle');
  }

  slotButtons(): Locator {
    return this.page.getByRole('button').filter({ hasText: /\d{1,2}:\d{2}/ });
  }

  async selectFirstSlot(): Promise<string> {
    await this.waitForSlotsLoaded();
    const first = this.slotButtons().first();
    const text = await first.textContent() ?? '';
    await first.click();
    return text.trim();
  }

  async fillForm(name: string, email: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
  }
}
