import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutCompletePage extends BasePage {
  readonly completeHeader: Locator;
  readonly completeText: Locator;
  readonly backHomeButton: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);

    this.completeHeader = page.locator('.complete-header');
    this.completeText = page.locator('.complete-text');
    this.backHomeButton = page.locator('#back-to-products');
    this.pageTitle = page.locator('.title');
  }

  async waitForPageLoaded(): Promise<void> {
    await expect(this.completeHeader).toBeVisible({ timeout: 15000 });
  }

  async getCompleteHeaderText(): Promise<string> {
    return await this.completeHeader.textContent() ?? '';
  }

  async backHome(): Promise<void> {
    await this.backHomeButton.click();
  }

  async verifyCheckoutCompleteDisplayed(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Checkout: Complete!');
    await expect(this.completeHeader).toContainText('THANK YOU FOR YOUR ORDER', { ignoreCase: true });
  }
}
