import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';
import { CONSTANTS } from '../utils/constants';

export class CartPage extends BasePage {
  readonly cartList: Locator;
  readonly cartItems: Locator;
  readonly cartItemNames: Locator;
  readonly cartItemPrices: Locator;
  readonly removeButtons: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly pageTitle: Locator;

  constructor(page: Page) {
    super(page);

    this.cartList = page.locator('.cart_list');
    this.cartItems = page.locator('.cart_item');
    this.cartItemNames = page.locator('.inventory_item_name');
    this.cartItemPrices = page.locator('.inventory_item_price');
    this.removeButtons = page.locator('.btn_secondary');
    this.checkoutButton = page.locator('#checkout');
    this.continueShoppingButton = page.locator('#continue-shopping');
    this.pageTitle = page.locator('.title');
  }

  async waitForPageLoaded(): Promise<void> {
    await expect(this.cartList).toBeVisible({ timeout: 15000 });
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async getCartItemName(index: number): Promise<string> {
    return await this.cartItemNames.nth(index).textContent() ?? '';
  }

  async getCartItemPrice(index: number): Promise<string> {
    return await this.cartItemPrices.nth(index).textContent() ?? '';
  }

  async removeItem(index: number): Promise<void> {
    await this.removeButtons.nth(index).click();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingButton.click();
  }

  async verifyCartPageDisplayed(): Promise<void> {
    await expect(this.pageTitle).toHaveText('Your Cart');
  }

  async verifyCartEmpty(): Promise<void> {
    await expect(this.cartItems).toHaveCount(0);
  }

  async verifyItemInCart(expectedName: string): Promise<void> {
    await expect(this.cartItemNames.filter({ hasText: expectedName })).toBeVisible();
  }
}
