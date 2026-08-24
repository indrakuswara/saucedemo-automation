import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutStepOnePage extends BasePage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly cancelButton: Locator;
  readonly pageTitle: Locator;
  readonly errorMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.firstNameInput = page.locator('#first-name');
    this.lastNameInput = page.locator('#last-name');
    this.postalCodeInput = page.locator('#postal-code');
    this.continueButton = page.locator('#continue');
    this.cancelButton = page.locator('#cancel');
    this.pageTitle = page.locator('.title');
    this.errorMessage = page.locator('[data-test="error"]');
  }

  async waitForPageLoaded(): Promise<void> {
    await expect(this.firstNameInput).toBeVisible({ timeout: 15000 });
  }

  async fillFirstName(firstName: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
  }

  async fillLastName(lastName: string): Promise<void> {
    await this.lastNameInput.fill(lastName);
  }

  async fillPostalCode(postalCode: string): Promise<void> {
    await this.postalCodeInput.fill(postalCode);
  }

  async fillForm(firstName: string, lastName: string, postalCode: string): Promise<void> {
    await this.fillFirstName(firstName);
    await this.fillLastName(lastName);
    await this.fillPostalCode(postalCode);
  }

  async continueToStepTwo(): Promise<void> {
    await this.continueButton.click();
  }

  async cancelCheckout(): Promise<void> {
    await this.cancelButton.click();
  }

  async verifyCheckoutStepOneDisplayed(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Checkout: Your Information');
  }

  async verifyErrorMessageContains(expectedText: string): Promise<void> {
    await expect(this.errorMessage).toContainText(expectedText, { timeout: 10000 });
  }
}
