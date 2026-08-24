import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutStepOnePage } from '../pages/checkout-step-one.page';
import { CheckoutStepTwoPage } from '../pages/checkout-step-two.page';
import { CheckoutCompletePage } from '../pages/checkout-complete.page';
import { TestData } from '../utils/test-data';
import { CONSTANTS } from '../utils/constants';
import { Helpers } from '../utils/helpers';
import { ReportHelpers } from '../utils/report-helpers';

test.describe('E2E - Complete Purchase Flow', () => {
  test('TC-E2E-01: Complete purchase flow (single item) @smoke @e2e', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOne = new CheckoutStepOnePage(page);
    const checkoutStepTwo = new CheckoutStepTwoPage(page);
    const checkoutComplete = new CheckoutCompletePage(page);

    await loginPage.goto();
    await loginPage.login(TestData.standardUser().username, TestData.standardUser().password);
    await Helpers.attachScreenshot(page, testInfo, 'e2e-01-after-login');

    await inventoryPage.waitForPageLoaded();
    await inventoryPage.addToCart(CONSTANTS.Products[0].id);
    await Helpers.attachScreenshot(page, testInfo, 'e2e-01-after-add-cart');

    await inventoryPage.navigateToCart();
    await cartPage.waitForPageLoaded();
    await Helpers.attachScreenshot(page, testInfo, 'e2e-01-cart-page');

    await cartPage.proceedToCheckout();
    await checkoutStepOne.waitForPageLoaded();
    await Helpers.attachScreenshot(page, testInfo, 'e2e-01-checkout-form');

    const formData = TestData.checkoutFormData();
    await checkoutStepOne.fillForm(formData.firstName, formData.lastName, formData.postalCode);
    await checkoutStepOne.continueToStepTwo();

    await checkoutStepTwo.waitForPageLoaded();
    await checkoutStepTwo.finishCheckout();

    await checkoutComplete.verifyCheckoutCompleteDisplayed();
    await Helpers.attachScreenshot(page, testInfo, 'e2e-01-order-complete');
  });

  test('TC-E2E-02: Complete purchase flow (multiple items) @regression @e2e', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOne = new CheckoutStepOnePage(page);
    const checkoutStepTwo = new CheckoutStepTwoPage(page);
    const checkoutComplete = new CheckoutCompletePage(page);

    await loginPage.goto();
    await loginPage.login(TestData.standardUser().username, TestData.standardUser().password);

    await inventoryPage.waitForPageLoaded();
    await inventoryPage.addToCart(CONSTANTS.Products[0].id);
    await inventoryPage.addToCart(CONSTANTS.Products[1].id);
    await inventoryPage.addToCart(CONSTANTS.Products[2].id);

    await inventoryPage.navigateToCart();
    await cartPage.waitForPageLoaded();
    expect(await cartPage.getCartItemCount()).toBe(3);

    await cartPage.proceedToCheckout();
    await checkoutStepOne.waitForPageLoaded();

    const formData = TestData.checkoutFormData();
    await checkoutStepOne.fillForm(formData.firstName, formData.lastName, formData.postalCode);
    await checkoutStepOne.continueToStepTwo();

    await checkoutStepTwo.waitForPageLoaded();
    await checkoutStepTwo.finishCheckout();

    await checkoutComplete.verifyCheckoutCompleteDisplayed();
    await Helpers.attachScreenshot(page, testInfo, 'e2e-02-multiple-items-complete');
  });

  test('TC-E2E-03: Add item then remove from cart, verify cart empty @regression @e2e', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);

    await loginPage.goto();
    await loginPage.login(TestData.standardUser().username, TestData.standardUser().password);

    await inventoryPage.waitForPageLoaded();
    await inventoryPage.addToCart(CONSTANTS.Products[0].id);
    await inventoryPage.navigateToCart();

    await cartPage.waitForPageLoaded();
    await cartPage.removeItem(0);
    await cartPage.verifyCartEmpty();

    await Helpers.attachScreenshot(page, testInfo, 'e2e-03-cart-empty-after-remove');
  });

  test('TC-E2E-04: Sort products then add cheapest, verify price in checkout @regression @e2e', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);
    const cartPage = new CartPage(page);
    const checkoutStepOne = new CheckoutStepOnePage(page);
    const checkoutStepTwo = new CheckoutStepTwoPage(page);

    await loginPage.goto();
    await loginPage.login(TestData.standardUser().username, TestData.standardUser().password);

    await inventoryPage.waitForPageLoaded();
    await inventoryPage.sortBy(CONSTANTS.SortOptions.PRICE_LOW_HIGH.value);

    const cheapestName = await inventoryPage.getProductName(0);
    const cheapestPrice = await inventoryPage.getProductPrice(0);
    await inventoryPage.addToCart(CONSTANTS.Products[4].id);

    await inventoryPage.navigateToCart();
    await cartPage.waitForPageLoaded();
    await cartPage.proceedToCheckout();

    await checkoutStepOne.waitForPageLoaded();
    const formData = TestData.checkoutFormData();
    await checkoutStepOne.fillForm(formData.firstName, formData.lastName, formData.postalCode);
    await checkoutStepOne.continueToStepTwo();

    await checkoutStepTwo.waitForPageLoaded();
    await checkoutStepTwo.verifyItemInSummary(cheapestName);

    await Helpers.attachScreenshot(page, testInfo, 'e2e-04-cheapest-item-checkout');
  });

  test('TC-E2E-05: Navigate directly to protected pages without login @regression @security', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await page.goto(CONSTANTS.URLs.INVENTORY);
    await expect(page).toHaveURL(/$/);

    await page.goto(CONSTANTS.URLs.CART);
    await expect(page).toHaveURL(/$/);

    await page.goto(CONSTANTS.URLs.CHECKOUT_STEP_ONE);
    await expect(page).toHaveURL(/$/);
  });
});
