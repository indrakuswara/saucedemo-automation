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

test.describe('Checkout - Form Validation & Order Summary', () => {
  let loginPage: LoginPage;
  let inventoryPage: InventoryPage;
  let cartPage: CartPage;
  let checkoutStepOne: CheckoutStepOnePage;
  let checkoutStepTwo: CheckoutStepTwoPage;
  let checkoutComplete: CheckoutCompletePage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    inventoryPage = new InventoryPage(page);
    cartPage = new CartPage(page);
    checkoutStepOne = new CheckoutStepOnePage(page);
    checkoutStepTwo = new CheckoutStepTwoPage(page);
    checkoutComplete = new CheckoutCompletePage(page);

    await loginPage.goto();
    await loginPage.login(TestData.standardUser().username, TestData.standardUser().password);
    await inventoryPage.waitForPageLoaded();
    await inventoryPage.addToCart(CONSTANTS.Products[0].id);
    await inventoryPage.navigateToCart();
    await cartPage.waitForPageLoaded();
    await cartPage.proceedToCheckout();
    await checkoutStepOne.waitForPageLoaded();
  });

  test('TC-CHECK-01: Verify checkout step one page @smoke @checkout', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await checkoutStepOne.verifyCheckoutStepOneDisplayed();
    await Helpers.attachScreenshot(page, testInfo, 'checkout-step-one');
  });

  test('TC-CHECK-02: Fill checkout form with valid data @smoke @checkout', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    const formData = TestData.checkoutFormData();
    await checkoutStepOne.fillForm(formData.firstName, formData.lastName, formData.postalCode);
    await checkoutStepOne.continueToStepTwo();

    await expect(page).toHaveURL(/checkout-step-two/);
    await Helpers.attachScreenshot(page, testInfo, 'checkout-form-filled');
  });

  for (const testCase of TestData.invalidCheckoutFormData()) {
    test(`TC-CHECK-NEG: ${testCase.description} @regression @negative @checkout`, async ({ page }, testInfo) => {
      await ReportHelpers.addMetadata(testInfo, page);
      await ReportHelpers.attachConsoleLogs(testInfo, page);

      await checkoutStepOne.fillForm(testCase.firstName, testCase.lastName, testCase.postalCode);
      await checkoutStepOne.continueToStepTwo();

      await checkoutStepOne.verifyCheckoutStepOneDisplayed();
      await Helpers.attachScreenshot(page, testInfo, `checkout-error-${testCase.description}`);
    });
  }

  test('TC-CHECK-03: Cancel checkout returns to cart @regression @checkout', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await checkoutStepOne.cancelCheckout();
    await expect(page).toHaveURL(/cart/);
  });

  test('TC-CHECK-04: Verify order summary displays correct items @regression @checkout', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    const formData = TestData.checkoutFormData();
    await checkoutStepOne.fillForm(formData.firstName, formData.lastName, formData.postalCode);
    await checkoutStepOne.continueToStepTwo();

    await checkoutStepTwo.waitForPageLoaded();
    await checkoutStepTwo.verifyItemInSummary(CONSTANTS.Products[0].name);

    const subtotal = await checkoutStepTwo.getSubtotal();
    expect(subtotal).toContain(CONSTANTS.Products[0].price);

    await Helpers.attachScreenshot(page, testInfo, 'checkout-order-summary');
  });

  test('TC-CHECK-05: Complete order shows success page @smoke @checkout', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    const formData = TestData.checkoutFormData();
    await checkoutStepOne.fillForm(formData.firstName, formData.lastName, formData.postalCode);
    await checkoutStepOne.continueToStepTwo();

    await checkoutStepTwo.waitForPageLoaded();
    await checkoutStepTwo.finishCheckout();

    await checkoutComplete.verifyCheckoutCompleteDisplayed();
    await Helpers.attachScreenshot(page, testInfo, 'checkout-complete');
  });

  test('TC-CHECK-06: Back home returns to inventory @regression @navigation', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    const formData = TestData.checkoutFormData();
    await checkoutStepOne.fillForm(formData.firstName, formData.lastName, formData.postalCode);
    await checkoutStepOne.continueToStepTwo();

    await checkoutStepTwo.waitForPageLoaded();
    await checkoutStepTwo.finishCheckout();

    await checkoutComplete.waitForPageLoaded();
    await checkoutComplete.backHome();

    await expect(page).toHaveURL(/inventory/);
  });
});
