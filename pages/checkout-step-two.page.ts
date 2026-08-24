import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutStepTwoPage extends BasePage {
  readonly cartItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly summarySubtotal: Locator;
  readonly summaryTax: Locator;
  readonly summaryTotal: Locator;
  readonly finishButton: Locator;
  readonly cancelButton: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);

    this.cartItems = page.locator('.cart_item');
    this.itemNames = page.locator('.inventory_item_name');
    this.itemPrices = page.locator('.inventory_item_price');
    this.summarySubtotal = page.locator('.summary_subtotal_label');
    this.summaryTax = page.locator('.summary_tax_label');
    this.summaryTotal = page.locator('.summary_total_label');
    this.finishButton = page.locator('#finish');
    this.cancelButton = page.locator('#cancel');
    this.pageTitle = page.locator('.title');
  }

  async waitForPageLoaded(): Promise<void> {
    await expect(this.summarySubtotal).toBeVisible({ timeout: 15000 });
  }

  async getSubtotal(): Promise<string> {
    return await this.summarySubtotal.textContent() ?? '';
  }

  async getTax(): Promise<string> {
    return await this.summaryTax.textContent() ?? '';
  }

  async getTotal(): Promise<string> {
    return await this.summaryTotal.textContent() ?? '';
  }

  async finishCheckout(): Promise<void> {
    await this.finishButton.click();
  }

  async cancelCheckout(): Promise<void> {
    await this.cancelButton.click();
  }

  async verifyCheckoutStepTwoDisplayed(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Checkout: Overview');
  }

  async verifyItemInSummary(expectedName: string): Promise<void> {
    await expect(this.itemNames.filter({ hasText: expectedName })).toBeVisible();
  }
}
