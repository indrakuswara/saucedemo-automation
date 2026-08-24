import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { TestData } from '../utils/test-data';
import { Helpers } from '../utils/helpers';
import { ReportHelpers } from '../utils/report-helpers';

test.describe('Login - Positive Test Cases', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.verifyLoginPageDisplayed();
  });

  test('TC-POS-01: Successfully login with standard_user @smoke @login', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    const credentials = TestData.standardUser();

    await loginPage.login(credentials.username, credentials.password);
    await loginPage.verifyLoginSuccessful();

    await Helpers.attachScreenshot(page, testInfo, 'login-success-standard');
    await expect(page).toHaveURL(/inventory/);
  });

  test('TC-POS-02: Login using Enter key @regression @login', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    const credentials = TestData.standardUser();

    await loginPage.login(credentials.username, credentials.password, true);
    await loginPage.verifyLoginSuccessful();

    await Helpers.attachScreenshot(page, testInfo, 'login-enter-key');
  });

  test('TC-POS-03: Login after page refresh @regression @login', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    const credentials = TestData.standardUser();

    await page.reload();
    await loginPage.waitForPageLoaded();

    await loginPage.login(credentials.username, credentials.password);
    await loginPage.verifyLoginSuccessful();
  });

  test('TC-POS-04: Login with copy-pasted credentials @regression @login', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    const credentials = TestData.standardUser();

    await loginPage.usernameInput.focus();
    await page.keyboard.type(credentials.username);
    await loginPage.passwordInput.focus();
    await page.keyboard.type(credentials.password);
    await loginPage.clickLoginButton();

    await loginPage.verifyLoginSuccessful();
    await Helpers.attachScreenshot(page, testInfo, 'login-copy-paste');
  });

  test('TC-POS-05: Verify password field is masked @smoke @security', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await loginPage.verifyPasswordMasked();
  });

  test('TC-POS-06: Verify login page elements are visible @smoke @ui', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
    await expect(loginPage.loginButton).toBeEnabled();
  });

  test('TC-POS-07: Verify tab navigation between fields @regression @accessibility', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await loginPage.usernameInput.focus();
    await expect(loginPage.usernameInput).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(loginPage.passwordInput).toBeFocused();

    await page.keyboard.press('Tab');
    const hasFocus = await page.evaluate(() => document.activeElement !== document.body);
    expect(hasFocus).toBeTruthy();
  });

  test('TC-POS-08: Verify username field accepts input correctly @regression @ui', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    const credentials = TestData.standardUser();
    await loginPage.enterUsername(credentials.username);
    await loginPage.verifyUsernameValue(credentials.username);
  });

  test('TC-POS-09: Verify clear and re-enter credentials @regression @login', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    const credentials = TestData.standardUser();

    await loginPage.enterUsername('wrong_user');
    await loginPage.enterUsername(credentials.username);
    await loginPage.enterPassword(credentials.password);
    await loginPage.clickLoginButton();

    await loginPage.verifyLoginSuccessful();
  });

  test('TC-POS-10: Login with problem_user @smoke @users', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    const credentials = TestData.problemUser();

    await loginPage.login(credentials.username, credentials.password);
    await loginPage.verifyLoginSuccessful();

    await Helpers.attachScreenshot(page, testInfo, 'login-problem-user');
  });
});
