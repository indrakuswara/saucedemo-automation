import { Page, Locator } from '@playwright/test';

/**
 * BasePage - Foundation class for all page objects
 * Contains common functionality shared across pages
 */
export class BasePage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a specific URL
   * @param path - URL path to navigate to
   */
  async navigateTo(path: string = '/'): Promise<void> {
    await this.page.goto(path, {
      waitUntil: 'domcontentloaded',
    });
  }

  /**
   * Wait for element to be visible
   * @param locator - Element locator
   * @param timeout - Optional timeout in ms
   */
  async waitForElement(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for element to be hidden
   * @param locator - Element locator
   * @param timeout - Optional timeout in ms
   */
  async waitForElementHidden(locator: Locator, timeout?: number): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Take a screenshot with descriptive name
   * @param name - Screenshot name
   */
  async takeScreenshot(name: string): Promise<void> {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    await this.page.screenshot({
      path: `screenshots/${name}-${timestamp}.png`,
      fullPage: true,
    });
  }

  /**
   * Get current page URL
   */
  getCurrentUrl(): string {
    return this.page.url();
  }

  /**
   * Check if element is visible
   * @param locator - Element locator
   */
  async isVisible(locator: Locator): Promise<boolean> {
    return await locator.isVisible();
  }

  /**
   * Get text content from element
   * @param locator - Element locator
   */
  async getText(locator: Locator): Promise<string | null> {
    return await locator.textContent();
  }
}