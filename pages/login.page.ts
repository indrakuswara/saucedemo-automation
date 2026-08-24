import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { CONSTANTS } from '../utils/constants';

export class LoginPage extends BasePage {
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly errorMessage: Locator;
  readonly loginCredentials: Locator;

  constructor(page: Page) {
    super(page);

    this.usernameInput = page.locator(CONSTANTS.Selectors.USERNAME);
    this.passwordInput = page.locator(CONSTANTS.Selectors.PASSWORD);
    this.loginButton = page.locator(CONSTANTS.Selectors.LOGIN_BUTTON);
    this.errorMessage = page.locator(CONSTANTS.Selectors.ERROR_MESSAGE);
    this.loginCredentials = page.locator('[data-test="login-credentials"]');
  }

  async goto(): Promise<void> {
    await this.navigateTo('/');
    await this.waitForElement(this.usernameInput);
  }

  async waitForPageLoaded(): Promise<void> {
    await this.usernameInput.waitFor({ state: 'visible', timeout: 20000 });
  }

  async enterUsername(username: string): Promise<void> {
    await this.usernameInput.fill(username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.passwordInput.fill(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async pressEnterToSubmit(): Promise<void> {
    await this.passwordInput.press('Enter');
  }

  async login(username: string, password: string, useEnterKey: boolean = false): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    if (useEnterKey) {
      await this.pressEnterToSubmit();
    } else {
      await this.clickLoginButton();
    }
  }

  async verifyLoginPageDisplayed(): Promise<void> {
    await expect(this.usernameInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.loginButton).toBeVisible();
  }

  async verifyLoginSuccessful(): Promise<void> {
    await this.page.waitForURL((url) => url.href.includes('inventory'), { timeout: 20000 });
  }

  async verifyLoginFailed(): Promise<void> {
    await expect(this.usernameInput).toBeVisible({ timeout: 10000 });
  }

  async verifyErrorMessageContains(expectedText: string): Promise<void> {
    await expect(this.errorMessage).toContainText(expectedText, { timeout: 10000 });
  }

  async verifyPasswordMasked(): Promise<void> {
    const type = await this.passwordInput.getAttribute('type');
    expect(type).toBe('password');
  }

  async verifyUsernameValue(expectedUsername: string): Promise<void> {
    await expect(this.usernameInput).toHaveValue(expectedUsername);
  }

  async getUsernameValue(): Promise<string> {
    return await this.usernameInput.inputValue();
  }
}
