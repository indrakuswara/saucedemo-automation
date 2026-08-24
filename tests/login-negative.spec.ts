import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { TestData } from '../utils/test-data';
import { CONSTANTS } from '../utils/constants';
import { Helpers } from '../utils/helpers';
import { ReportHelpers } from '../utils/report-helpers';

test.describe('Login - Negative Test Cases', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.verifyLoginPageDisplayed();
  });

  for (const testCase of TestData.invalidCredentials()) {
    test(`TC-NEG: ${testCase.description} @regression @negative @login`, async ({ page }, testInfo) => {
      await ReportHelpers.addMetadata(testInfo, page);
      await ReportHelpers.attachConsoleLogs(testInfo, page);

      await loginPage.login(testCase.username, testCase.password);
      await loginPage.verifyLoginFailed();
      await Helpers.attachScreenshot(page, testInfo, 'login-invalid-creds');
    });
  }

  for (const testCase of TestData.emptyFieldCombinations()) {
    test(`TC-NEG: ${testCase.description} @regression @negative @login`, async ({ page }, testInfo) => {
      await ReportHelpers.addMetadata(testInfo, page);
      await ReportHelpers.attachConsoleLogs(testInfo, page);

      await loginPage.login(testCase.username, testCase.password);
      await loginPage.verifyLoginFailed();
    });
  }

  for (const testCase of TestData.whitespaceTestData()) {
    test(`TC-NEG: ${testCase.description} @regression @negative @login`, async ({ page }, testInfo) => {
      await ReportHelpers.addMetadata(testInfo, page);
      await ReportHelpers.attachConsoleLogs(testInfo, page);

      await loginPage.login(testCase.username, testCase.password);
      await loginPage.verifyLoginFailed();
    });
  }

  for (const testCase of TestData.securityTestData()) {
    test(`TC-SEC: ${testCase.description} @security @login`, async ({ page }, testInfo) => {
      await ReportHelpers.addMetadata(testInfo, page);
      await ReportHelpers.attachConsoleLogs(testInfo, page);

      page.on('dialog', async (dialog) => {
        await dialog.dismiss();
      });

      await loginPage.login(testCase.username, testCase.password);
      await loginPage.verifyLoginFailed();
    });
  }

  for (const testCase of TestData.edgeCaseTestData()) {
    test(`TC-EDGE: ${testCase.description} @regression @edge @login`, async ({ page }, testInfo) => {
      await ReportHelpers.addMetadata(testInfo, page);
      await ReportHelpers.attachConsoleLogs(testInfo, page);

      await loginPage.login(testCase.username, testCase.password);
      await loginPage.verifyLoginFailed();
    });
  }

  test('TC-NEG-01: Locked out user shows error @smoke @negative @users', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    const credentials = TestData.lockedOutUser();

    await loginPage.login(credentials.username, credentials.password);
    await loginPage.verifyErrorMessageContains(CONSTANTS.ErrorMessages.LOCKED_OUT);

    await Helpers.attachScreenshot(page, testInfo, 'login-locked-out');
  });

  test('TC-NEG-02: Verify error message appears after failed login @regression @negative', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await loginPage.login('invalid_user', 'invalid_password');
    await expect(loginPage.errorMessage).toBeVisible();
  });

  test('TC-NEG-03: Verify multiple failed login attempts @regression @negative', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    for (let i = 0; i < 3; i++) {
      await loginPage.login('invalid_user', 'invalid_password');
      await loginPage.verifyLoginFailed();
      if (i < 2) {
        await loginPage.enterUsername('invalid_user');
        await loginPage.enterPassword('invalid_password');
      }
    }
    await expect(loginPage.usernameInput).toBeVisible();
  });

  test('TC-NEG-04: Verify login after failed attempt with valid credentials @regression @negative', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await loginPage.login('invalid_user', 'invalid_password');
    await loginPage.verifyLoginFailed();

    const credentials = TestData.standardUser();
    await loginPage.login(credentials.username, credentials.password);
    await loginPage.verifyLoginSuccessful();
  });

  test('TC-NEG-05: Verify rapid multiple clicks on login button @regression @negative', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    await loginPage.enterUsername('invalid_user');
    await loginPage.enterPassword('invalid_password');

    await Promise.all([
      loginPage.clickLoginButton(),
      loginPage.clickLoginButton(),
      loginPage.clickLoginButton(),
    ]).catch(() => {});

    await expect(loginPage.usernameInput).toBeVisible();
  });

  test('TC-NEG-06: Verify form does not submit with only username @regression @negative', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    const credentials = TestData.standardUser();
    await loginPage.enterUsername(credentials.username);
    await loginPage.clickLoginButton();
    await loginPage.verifyLoginFailed();
  });

  test('TC-NEG-07: Verify form does not submit with only password @regression @negative', async ({ page }, testInfo) => {
    await ReportHelpers.addMetadata(testInfo, page);
    await ReportHelpers.attachConsoleLogs(testInfo, page);

    const credentials = TestData.standardUser();
    await loginPage.enterPassword(credentials.password);
    await loginPage.clickLoginButton();
    await loginPage.verifyLoginFailed();
  });
});
