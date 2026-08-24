import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { TestData } from '../utils/test-data';
import { CONSTANTS } from '../utils/constants';
import { Helpers } from '../utils/helpers';
import { ReportHelpers } from '../utils/report-helpers';

test.describe('Cart - Shopping Cart Functionality', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(TestData.standardUser().username, TestData.standardUser().password);
    await inventoryPage.waitForPageLoaded();
  });

  test('TC-CART-01: Verify items in cart match what was added @smoke @cart', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await inventoryPage.addToCart(CONSTANTS.Products[0].id);
    await inventoryPage.navigateToCart();

    await cartPage.waitForPageLoaded();
    expect(await cartPage.getCartItemCount()).toBe(1);

    const itemName = await cartPage.getCartItemName(0);
    expect(itemName).toBe(CONSTANTS.Products[0].name);

    await Helpers.attachScreenshot(page, testInfo, 'cart-item-matched');
  });

  test('TC-CART-02: Verify item names and prices @regression @cart', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await inventoryPage.addToCart(CONSTANTS.Products[0].id);
    await inventoryPage.addToCart(CONSTANTS.Products[1].id);
    await inventoryPage.navigateToCart();

    await cartPage.waitForPageLoaded();
    expect(await cartPage.getCartItemCount()).toBe(2);

    await Helpers.attachScreenshot(page, testInfo, 'cart-multiple-items');
  });

  test('TC-CART-03: Remove item from cart @regression @cart', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await inventoryPage.addToCart(CONSTANTS.Products[0].id);
    await inventoryPage.addToCart(CONSTANTS.Products[1].id);
    await inventoryPage.navigateToCart();

    await cartPage.waitForPageLoaded();
    await cartPage.removeItem(0);

    expect(await cartPage.getCartItemCount()).toBe(1);
    await Helpers.attachScreenshot(page, testInfo, 'cart-item-removed');
  });

  test('TC-CART-04: Continue shopping returns to inventory @regression @navigation', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await inventoryPage.addToCart(CONSTANTS.Products[0].id);
    await inventoryPage.navigateToCart();

    await cartPage.waitForPageLoaded();
    await cartPage.continueShopping();

    await expect(page).toHaveURL(/inventory/);
  });

  test('TC-CART-05: Proceed to checkout @smoke @checkout', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await inventoryPage.addToCart(CONSTANTS.Products[0].id);
    await inventoryPage.navigateToCart();

    await cartPage.waitForPageLoaded();
    await cartPage.proceedToCheckout();

    await expect(page).toHaveURL(/checkout-step-one/);
    await Helpers.attachScreenshot(page, testInfo, 'cart-proceed-checkout');
  });

  test('TC-CART-06: Cart badge persists after page refresh @regression @cart', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await inventoryPage.addToCart(CONSTANTS.Products[0].id);
    await inventoryPage.navigateToCart();

    await cartPage.waitForPageLoaded();
    await page.reload();

    expect(await cartPage.getCartItemCount()).toBe(1);
  });

  test('TC-CART-07: Verify cart page title @regression @ui', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await inventoryPage.navigateToCart();
    await cartPage.verifyCartPageDisplayed();
  });
});
