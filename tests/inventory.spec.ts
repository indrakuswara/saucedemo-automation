import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { TestData } from '../utils/test-data';
import { CONSTANTS } from '../utils/constants';
import { Helpers } from '../utils/helpers';
import { ReportHelpers } from '../utils/report-helpers';

test.describe('Inventory - Product Display & Sorting', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);

    await loginPage.goto();
    await loginPage.login(TestData.standardUser().username, TestData.standardUser().password);
    await inventoryPage.waitForPageLoaded();
  });

  test('TC-INV-01: Verify all 6 products are displayed @smoke @inventory', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    const count = await inventoryPage.getProductCount();
    expect(count).toBe(6);

    await Helpers.attachScreenshot(page, testInfo, 'inventory-all-products');
  });

  test('TC-INV-02: Verify product names are correct @regression @inventory', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    for (let i = 0; i < 6; i++) {
      const name = await inventoryPage.getProductName(i);
      expect(CONSTANTS.Products.some(p => p.name === name)).toBeTruthy();
    }
  });

  test('TC-INV-03: Verify product prices are correct @regression @inventory', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    for (let i = 0; i < 6; i++) {
      const price = await inventoryPage.getProductPrice(i);
      expect(CONSTANTS.Products.some(p => p.price === price)).toBeTruthy();
    }
  });

  test('TC-INV-04: Sort by Name (A to Z) @smoke @sorting', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await inventoryPage.sortBy(CONSTANTS.SortOptions.NAME_AZ.value);
    const names = await inventoryPage.getSortedNames();
    const sorted = [...names].sort((a, b) => a.localeCompare(b));
    expect(names).toEqual(sorted);

    await Helpers.attachScreenshot(page, testInfo, 'inventory-sort-name-az');
  });

  test('TC-INV-05: Sort by Name (Z to A) @regression @sorting', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await inventoryPage.sortBy(CONSTANTS.SortOptions.NAME_ZA.value);
    const names = await inventoryPage.getSortedNames();
    const sorted = [...names].sort((a, b) => b.localeCompare(a));
    expect(names).toEqual(sorted);
  });

  test('TC-INV-06: Sort by Price (low to high) @regression @sorting', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await inventoryPage.sortBy(CONSTANTS.SortOptions.PRICE_LOW_HIGH.value);
    const prices = await inventoryPage.getSortedPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  test('TC-INV-07: Sort by Price (high to low) @regression @sorting', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await inventoryPage.sortBy(CONSTANTS.SortOptions.PRICE_HIGH_LOW.value);
    const prices = await inventoryPage.getSortedPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  test('TC-INV-08: Add single product to cart @smoke @cart', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await inventoryPage.addToCart(CONSTANTS.Products[0].id);
    const badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toBe('1');

    await Helpers.attachScreenshot(page, testInfo, 'inventory-add-one');
  });

  test('TC-INV-09: Add multiple products to cart @regression @cart', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await inventoryPage.addToCart(CONSTANTS.Products[0].id);
    await inventoryPage.addToCart(CONSTANTS.Products[1].id);
    await inventoryPage.addToCart(CONSTANTS.Products[2].id);

    const badgeCount = await inventoryPage.getCartBadgeCount();
    expect(badgeCount).toBe('3');

    await Helpers.attachScreenshot(page, testInfo, 'inventory-add-three');
  });

  test('TC-INV-10: Remove product from cart @regression @cart', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await inventoryPage.addToCart(CONSTANTS.Products[0].id);
    expect(await inventoryPage.getCartBadgeCount()).toBe('1');

    await inventoryPage.removeFromCart(CONSTANTS.Products[0].id);
    expect(await inventoryPage.isCartBadgeVisible()).toBeFalsy();
  });

  test('TC-INV-11: Cart badge persists after page refresh @regression @cart', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await inventoryPage.addToCart(CONSTANTS.Products[0].id);
    await page.reload();
    await inventoryPage.waitForPageLoaded();

    expect(await inventoryPage.getCartBadgeCount()).toBe('1');
  });

  test('TC-INV-12: Navigate to cart from inventory @smoke @navigation', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await inventoryPage.addToCart(CONSTANTS.Products[0].id);
    await inventoryPage.navigateToCart();

    await expect(page).toHaveURL(/cart/);
    await Helpers.attachScreenshot(page, testInfo, 'inventory-navigate-to-cart');
  });

  test('TC-INV-13: Verify inventory page title @regression @ui', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await inventoryPage.verifyInventoryPageDisplayed();
  });
});
