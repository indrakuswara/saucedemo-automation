import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { CONSTANTS } from '../utils/constants';

export class InventoryPage extends BasePage {
  readonly inventoryList: Locator;
  readonly inventoryItems: Locator;
  readonly itemNames: Locator;
  readonly itemPrices: Locator;
  readonly sortDropdown: Locator;
  readonly cartBadge: Locator;
  readonly cartLink: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);

    this.inventoryList = page.locator(CONSTANTS.Selectors.INVENTORY_LIST);
    this.inventoryItems = page.locator(CONSTANTS.Selectors.INVENTORY_ITEM);
    this.itemNames = page.locator(CONSTANTS.Selectors.INVENTORY_ITEM_NAME);
    this.itemPrices = page.locator(CONSTANTS.Selectors.INVENTORY_ITEM_PRICE);
    this.sortDropdown = page.locator(CONSTANTS.Selectors.SORT_DROPDOWN);
    this.cartBadge = page.locator(CONSTANTS.Selectors.CART_BADGE);
    this.cartLink = page.locator(CONSTANTS.Selectors.CART_LINK);
    this.pageTitle = page.locator('.title');
  }

  async waitForPageLoaded(): Promise<void> {
    await expect(this.inventoryList).toBeVisible({ timeout: 15000 });
  }

  async getProductCount(): Promise<number> {
    return await this.inventoryItems.count();
  }

  async getProductName(index: number): Promise<string> {
    return await this.itemNames.nth(index).textContent() ?? '';
  }

  async getProductPrice(index: number): Promise<string> {
    return await this.itemPrices.nth(index).textContent() ?? '';
  }

  async addToCart(productId: string): Promise<void> {
    await this.page.locator(`#add-to-cart-${productId}`).click();
  }

  async removeFromCart(productId: string): Promise<void> {
    await this.page.locator(`#remove-${productId}`).click();
  }

  async getCartBadgeCount(): Promise<string> {
    return await this.cartBadge.textContent() ?? '';
  }

  async isCartBadgeVisible(): Promise<boolean> {
    return await this.cartBadge.isVisible();
  }

  async sortBy(option: string): Promise<void> {
    await this.sortDropdown.selectOption(option);
  }

  async getSortedNames(): Promise<string[]> {
    const count = await this.itemNames.count();
    const names: string[] = [];
    for (let i = 0; i < count; i++) {
      names.push(await this.itemNames.nth(i).textContent() ?? '');
    }
    return names;
  }

  async getSortedPrices(): Promise<number[]> {
    const count = await this.itemPrices.count();
    const prices: number[] = [];
    for (let i = 0; i < count; i++) {
      const text = await this.itemPrices.nth(i).textContent() ?? '';
      prices.push(parseFloat(text.replace('$', '')));
    }
    return prices;
  }

  async navigateToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async verifyInventoryPageDisplayed(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Products');
    await expect(this.inventoryList).toBeVisible();
  }

  async getAllProductIds(): Promise<string[]> {
    const products = CONSTANTS.Products;
    return products.map(p => p.id);
  }
}
