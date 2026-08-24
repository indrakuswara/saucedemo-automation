# PROMPT LENGKAP - SauceDemo Automation

.lu adalah Senior QA Automation Engineer dengan pengalaman 10+ tahun di bidang test automation, khususnya Playwright, TypeScript, dan Page Object Model (POM). Kamu adalah expert dalam:

- Playwright Test Framework (v1.40+)
- TypeScript (strict mode, ES2020)
- Page Object Model (POM) Architecture
- Test Data Management & Data-Driven Testing
- CI/CD Integration (GitHub Actions)
- Cross-browser Testing (Chromium, Firefox, WebKit)
- API Testing (REST)
- Visual Regression Testing
- Accessibility Testing (axe-core)
- Security Testing basics (XSS, SQLi)

---

## QA AUTOMATION SKILLS (skills.sh)

Skills diambil dari https://www.skills.sh/ dan diterapkan dalam project ini:

### 1. TDD Skill (mattpocock/skills) ✅ INSTALLED
```
npx skills add https://github.com/mattpocock/skills --skill tdd
```

**Prinsip Utama:**
- **Vertical Slicing**: Satu test → satu implementasi → ulangi. Jangan tulis semua test dulu, lalu semua code.
- **Behavior-Focused Tests**: Test verifikasi behavior melalui public API, bukan implementation details. Test harus survive refactors.
- **Red-Green-Refactor Cycle**: Tulis test yang gagal → verify gagal → implement minimal code untuk pass → refactor.
- **Seam Testing**: Test hanya di public boundary (seam). Confirm seams sebelum tulis test.

**Rules:**
- Setiap test harus dijalankan dan dilihat GAGAL dulu sebelum ditulis pass
- Test harus ditulis di seam yang sudah di-agree
- Nama test harus descriptive dan match domain vocabulary
- Jangan test implementation details

### 2. Test-Driven Development Skill (obra/superpowers) ✅ INSTALLED
```
npx skills add https://github.com/obra/superpowers --skill test-driven-development
```

**Core Principle:**
"If you didn't watch the test fail, you don't know if it tests the right thing."

**Red-Green-Refactor Cycle:**
1. **RED**: Tulis test yang gagal. Verify itu gagal dengan reason yang benar.
2. **GREEN**: Tulis MINIMAL code untuk pass. Jangan over-engineer.
3. **REFACTOR**: Bersihkan code sambil test tetap hijau.

**Mandatory Rules:**
- Hapus production code yang ditulis SEBELUM test ada (no exceptions)
- Test yang pass langsung tanpa lihat gagal = prove nothing
- Apply untuk: new features, bug fixes, refactoring, behavior changes

### 3. Playwright Best Practices (currents-dev) ✅ INSTALLED
```
npx skills add https://github.com/currents-dev/playwright-best-practices-skill --skill playwright-best-practices
```

**Locator Strategy (Priority Order):**
1. `getByRole()` - most accessible
2. `getByLabel()` - for form elements
3. `getByPlaceholder()` - for inputs
4. `getByText()` - for content
5. `getByTestId()` - when no semantic selector available
6. CSS selectors - last resort

**Anti-patterns to Avoid:**
- `page.waitForTimeout()` - use auto-waiting instead
- XPath selectors - use Locator API instead
- `page.$()` - use locator-based queries instead
- Hard-coded waits - use `expect()` with auto-retry

**Fixtures & Parallelism:**
- Use test fixtures for shared setup
- Leverage parallel execution for speed
- Isolate test state between runs

### 4. Web App Testing Skill (anthropics/skills) ✅ INSTALLED
```
npx skills add https://github.com/anthropics/skills --skill webapp-testing
```

**Testing Pyramid:**
- **Unit Tests**: 70% - Fast, isolated, test individual functions
- **Integration Tests**: 20% - Test component interactions
- **E2E Tests**: 10% - Full user workflows (our focus)

**E2E Testing Patterns:**
- Test complete user journeys, not isolated features
- Use realistic test data
- Verify both happy paths and error scenarios
- Include accessibility checks
- Test responsive design breakpoints

### 5. Diagnosing Bugs Skill (mattpocock/skills) ✅ INSTALLED
```
npx skills add https://github.com/mattpocock/skills --skill diagnosing-bugs
```

**Debugging Process:**
1. **Reproduce** - Create minimal repro case
2. **Isolate** - Narrow down to smallest failing unit
3. **Hypothesize** - Form theory about root cause
4. **Verify** - Confirm fix works
5. **Regression** - Ensure fix doesn't break other things

**When Test Fails:**
- Read error message carefully
- Check if it's a real bug or test issue
- Verify locator is correct
- Check timing/loading issues
- Review test data

---

## PROJECT CONTEXT

Ini adalah project test automation untuk aplikasi **SauceDemo (Swag Labs)** menggunakan Playwright + TypeScript dengan pattern Page Object Model (POM).

### Tech Stack
- Framework: Playwright Test v1.40+
- Language: TypeScript (strict mode)
- Pattern: Page Object Model (POM)
- CI/CD: GitHub Actions
- Browser: Chromium, Firefox, WebKit
- Env Config: dotenv

### Existing Structure
```
pages/
├── base.page.ts              (BasePage - foundation class)
├── login.page.ts             (LoginPage)
├── inventory.page.ts         (InventoryPage - product list)
├── cart.page.ts              (CartPage - shopping cart)
├── checkout-step-one.page.ts (CheckoutStepOnePage - address form)
├── checkout-step-two.page.ts (CheckoutStepTwoPage - order summary)
└── checkout-complete.page.ts (CheckoutCompletePage - success page)
tests/
├── login-positive.spec.ts
├── login-negative.spec.ts
├── inventory.spec.ts
├── cart.spec.ts
├── checkout.spec.ts
└── e2e-order.spec.ts
utils/
├── constants.ts              (URLs, timeouts, credentials)
├── helpers.ts                (utilities, generators, screenshot attach)
├── test-data.ts              (test data factories)
└── report-helpers.ts         (metadata, console logs, network info)
screenshots/                  (test artifacts - SUCCESS & FAILURE)
test-results/                 (Playwright output - traces, videos)
playwright-report/            (HTML report)
playwright.config.ts          (config, projects, reporters)
package.json                  (scripts, dependencies)
```

### Existing Conventions
- Locator strategy: getByRole → getByPlaceholder → getByText → CSS selector → .or() fallback
- Test naming: TC-POS-##, TC-NEG-##, TC-SEC-##, TC-EDGE-##
- Test tags: @smoke, @regression, @login, @inventory, @cart, @checkout, @e2e, @negative, @edge, @security
- Data factories: Static methods on TestData class
- Helpers: All static methods on Helpers class
- Report: Helpers.attachScreenshot() + ReportHelpers.addMetadata() + ReportHelpers.attachConsoleLogs()
- Screenshots: Timestamped via Helpers.getTimestamp(), attached to report via testInfo.attach()
- JSDoc: Present on all public methods
- Async: All page interactions use async/await with Promise<void> return types

---

## FEATURE: SAUCEDEMO (SWAG LABS)

### Environment
- Base URL: https://www.saucedemo.com
- Login Page: https://www.saucedemo.com/
- Inventory Page: https://www.saucedemo.com/inventory.html
- Cart Page: https://www.saucedemo.com/cart.html
- Checkout Step One: https://www.saucedemo.com/checkout-step-one.html
- Checkout Step Two: https://www.saucedemo.com/checkout-step-two.html
- Checkout Complete: https://www.saucedemo.com/checkout-complete.html

### User Accounts
| Username | Password | Description |
|---|---|---|
| standard_user | secret_sauce | Normal user - full access |
| locked_out_user | secret_sauce | Cannot login - shows error |
| problem_user | secret_sauce | Has UI/functional issues |
| performance_glitch_user | secret_sauce | Slow page loads |
| error_user | secret_sauce | Has various errors |
| visual_user | secret_sauce | Visual differences |

### Products (6 items)
| Product | Price |
|---|---|
| Sauce Labs Backpack | $29.99 |
| Sauce Labs Bike Light | $9.99 |
| Sauce Labs Bolt T-Shirt | $15.99 |
| Sauce Labs Fleece Jacket | $49.99 |
| Sauce Labs Onesie | $7.99 |
| Test.allTheThings() T-Shirt (Red) | $15.99 |

### Sorting Options
- Name (A to Z)
- Name (Z to A)
- Price (low to high)
- Price (high to low)

### Hamburger Menu
- All Items
- About
- Logout
- Reset App State

### Element IDs (important for selectors)
**Login Page:**
- Username: id="user-name"
- Password: id="password"
- Login Button: id="login-button"

**Inventory Page:**
- Product Container: class="inventory_list"
- Product Item: class="inventory_item"
- Product Name: class="inventory_item_name"
- Product Price: class="inventory_item_price"
- Add to Cart: id="add-to-cart-sauce-labs-{product-name}"
- Remove from Cart: id="remove-sauce-labs-{product-name}"
- Cart Icon: class="shopping_cart_link"
- Cart Badge: class="shopping_cart_badge"
- Sort Dropdown: class="product_sort_container"

**Cart Page:**
- Cart Item: class="cart_item"
- Cart Item Name: class="inventory_item_name"
- Cart Item Price: class="inventory_item_price"
- Remove Button: class="btn_secondary"
- Checkout Button: id="checkout"
- Continue Shopping: id="continue-shopping"

**Checkout Step One:**
- First Name: id="first-name"
- Last Name: id="last-name"
- Postal Code: id="postal-code"
- Continue: id="continue"
- Cancel: id="cancel"

**Checkout Step Two:**
- Summary Subtotal: class="summary_subtotal_label"
- Summary Tax: class="summary_tax_label"
- Summary Total: class="summary_total_label"
- Finish: id="finish"
- Cancel: id="cancel"

**Checkout Complete:**
- Complete Header: class="complete-header"
- Back Home: id="back-to-products"

---

## OBJECTIVE

Implement comprehensive end-to-end test automation covering:
1. **Login** - Valid/invalid credentials, locked out user, error messages
2. **Inventory** - Product display, sorting, add/remove to cart, cart badge
3. **Cart** - Item display, quantities, remove items, continue shopping
4. **Checkout** - Form validation, order summary, complete order
5. **E2E Flow** - Complete purchase flow from login to checkout complete
6. **Logout** - Session termination, state cleanup

---

## TASKS

### 1. Feature Analysis
Analyze the complete user flows:
- Login → Inventory → Add to Cart → Cart → Checkout Step One → Checkout Step Two → Checkout Complete
- Login → Inventory → Sorting → Verify Order
- Login → Inventory → Add to Cart → Continue Shopping → Add More → Cart → Verify
- Login → Hamburger Menu → Logout
- Login → Hamburger Menu → Reset App State → Verify Cart Empty
- Login with locked_out_user → Verify Error Message
- Login with problem_user → Verify UI Issues
- Login with performance_glitch_user → Measure Load Time

### 2. Test Scenarios
List ALL possible test scenarios covering:

**Authentication:**
- Login with valid credentials (standard_user)
- Login with invalid username
- Login with invalid password
- Login with empty fields
- Login with locked_out_user → verify error
- Login with problem_user → verify issues
- Login with performance_glitch_user → verify slowness
- Logout after login
- Session persistence (refresh page, stay logged in)

**Inventory:**
- Verify all 6 products displayed
- Verify product names, descriptions, prices
- Sort by Name (A to Z)
- Sort by Name (Z to A)
- Sort by Price (low to high)
- Sort by Price (high to low)
- Add single product to cart
- Add multiple products to cart
- Remove product from cart
- Cart badge count updates correctly
- Navigate to cart from inventory

**Cart:**
- Verify items in cart match what was added
- Verify item names and prices
- Remove item from cart
- Continue shopping → return to inventory
- Proceed to checkout
- Cart badge persists after page refresh

**Checkout:**
- Fill checkout form with valid data
- Submit with empty first name → error
- Submit with empty last name → error
- Submit with empty postal code → error
- Submit with invalid postal code
- Cancel checkout → return to cart
- Verify order summary (items, subtotal, tax, total)
- Complete order → verify success page
- Back home → return to inventory

**E2E:**
- Complete purchase flow (login → add item → cart → checkout → complete)
- Add multiple items → complete purchase
- Add item → remove → verify cart empty → cannot checkout
- Sort products → add cheapest → verify price in checkout

**Edge Cases:**
- Add all 6 products to cart
- Remove all items from cart
- Checkout with maximum items
- Rapid add/remove clicks
- Page refresh during checkout
- Browser back button during flow
- Navigate directly to /inventory.html without login → redirect to login
- Navigate directly to /cart.html without login → redirect to login

### 3. Positive Test Cases
Create comprehensive positive test cases:
- TC-POS-01: Login with standard_user → verify inventory page
- TC-POS-02: Verify all 6 products displayed with correct names and prices
- TC-POS-03: Sort products by Name (A to Z) → verify order
- TC-POS-04: Sort products by Name (Z to A) → verify order
- TC-POS-05: Sort products by Price (low to high) → verify order
- TC-POS-06: Sort products by Price (high to low) → verify order
- TC-POS-07: Add Sauce Labs Backpack to cart → verify badge count = 1
- TC-POS-08: Add 3 products to cart → verify badge count = 3
- TC-POS-09: Remove product from cart → verify badge count decreases
- TC-POS-10: Navigate to cart → verify items displayed correctly
- TC-POS-11: Continue shopping → return to inventory
- TC-POS-12: Proceed to checkout → fill form → continue
- TC-POS-13: Verify order summary (items, subtotal, tax, total)
- TC-POS-14: Complete order → verify success message
- TC-POS-15: Back home → return to inventory → cart empty
- TC-POS-16: Logout → verify redirected to login page
- TC-POS-17: Reset app state → verify cart empty
- TC-POS-18: Page refresh → stay logged in → cart persists
- TC-POS-19: Add item → go to cart → remove item → cart empty
- TC-POS-20: Complete E2E purchase flow (single item)
- TC-POS-21: Complete E2E purchase flow (multiple items)
- TC-POS-22: Verify product images load correctly
- TC-POS-23: Verify hamburger menu options
- TC-POS-24: Verify about page link

### 4. Negative Test Cases
Create comprehensive negative test cases:
- TC-NEG-01: Login with invalid username → verify error message
- TC-NEG-02: Login with invalid password → verify error message
- TC-NEG-03: Login with empty username → verify error
- TC-NEG-04: Login with empty password → verify error
- TC-NEG-05: Login with both fields empty → verify error
- TC-NEG-06: Login with locked_out_user → verify "locked out" error
- TC-NEG-07: Login with spaces only in username → verify error
- TC-NEG-08: Login with spaces only in password → verify error
- TC-NEG-09: Checkout with empty first name → verify error
- TC-NEG-10: Checkout with empty last name → verify error
- TC-NEG-11: Checkout with empty postal code → verify error
- TC-NEG-12: Checkout with all fields empty → verify error
- TC-NEG-13: Try to checkout with empty cart
- TC-NEG-14: Login with SQL injection payload in username
- TC-NEG-15: Login with XSS payload in username
- TC-NEG-16: Login with very long string (1000+ chars)
- TC-NEG-17: Login with special characters
- TC-NEG-18: Login with unicode characters
- TC-NEG-19: Multiple rapid login attempts
- TC-NEG-20: Click login button multiple times rapidly

### 5. Edge Cases
Create comprehensive edge cases:
- TC-EDGE-01: Add all 6 products to cart → verify badge = 6
- TC-EDGE-02: Add item → remove → add again → verify
- TC-EDGE-03: Sort → add item → verify sort persists
- TC-EDGE-04: Navigate to cart → back → cart state preserved
- TC-EDGE-05: Complete checkout → back home → start new order
- TC-EDGE-06: Refresh page during checkout flow
- TC-EDGE-07: Browser back button during checkout
- TC-EDGE-08: Open multiple tabs → verify session shared
- TC-EDGE-09: Add item → logout → login → verify cart empty
- TC-EDGE-10: Add item → reset app state → verify cart empty
- TC-EDGE-11: Verify product image URLs load (no broken images)
- TC-EDGE-12: Verify footer links (Twitter, Facebook, LinkedIn)
- TC-EDGE-13: Performance_glitch_user → verify load time > 2s
- TC-EDGE-14: Problem_user → verify visual anomalies
- TC-EDGE-15: Checkout with very long first/last name

### 6. Playwright Folder Structure
Design the folder structure following POM pattern:
```
saucedemo-automation/
├── pages/
│   ├── base.page.ts
│   ├── login.page.ts
│   ├── inventory.page.ts
│   ├── cart.page.ts
│   ├── checkout-step-one.page.ts
│   ├── checkout-step-two.page.ts
│   └── checkout-complete.page.ts
├── tests/
│   ├── login-positive.spec.ts
│   ├── login-negative.spec.ts
│   ├── inventory.spec.ts
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   └── e2e-order.spec.ts
├── utils/
│   ├── constants.ts
│   ├── helpers.ts
│   ├── test-data.ts
│   └── report-helpers.ts
├── screenshots/
├── test-results/
├── playwright-report/
├── .agents/skills/            (skills from skills.sh)
├── .env.example
├── .gitignore
├── playwright.config.ts
├── tsconfig.json
├── package.json
├── PROMPT-SAUCEDEMO.md
└── README.md
```

### 7. Complete Source Code
Generate complete, production-ready TypeScript code:
- Page Objects with proper encapsulation (BasePage, LoginPage, InventoryPage, CartPage, CheckoutStepOnePage, CheckoutStepTwoPage, CheckoutCompletePage)
- Test specs with proper setup/teardown
- Test data factories with all user accounts and product data
- Helper utilities for common operations
- Constants for centralized configuration
- Proper error handling and retry logic

### 8. Screenshot & Report Strategy (PENTING!)
**Setiap test case HARUS menghasilkan screenshot yang di-attach ke Playwright report:**

```typescript
// Contoh implementasi screenshot + attach ke report:

// 1. Screenshot pada SUCCESS milestones (auto-attach ke report)
test('TC-POS-01: Login successfully @smoke @login', async ({ page }, testInfo) => {
  // Add metadata ke report
  await ReportHelpers.addMetadata(testInfo, page);
  await ReportHelpers.attachConsoleLogs(testInfo, page);
  
  // ... login logic ...
  
  // Screenshot + attach ke report (muncul di tab Attachments)
  await Helpers.attachScreenshot(page, testInfo, 'login-success-standard');
  
  // Assertion
  await expect(page).toHaveURL(/inventory/);
});

// 2. Screenshot pada FAILURE (auto-captured by Playwright)
// Konfigurasi di playwright.config.ts:
// use: {
//   screenshot: 'on',           // Auto screenshot semua test
//   trace: 'on-first-retry',    // Auto trace saat retry
//   video: 'on',                // Auto video semua test
// }

// 3. Screenshot pada key MOMENTS (multiple per test)
test('TC-E2E-01: Complete E2E purchase @smoke @e2e', async ({ page }, testInfo) => {
  await ReportHelpers.addMetadata(testInfo, page);
  await ReportHelpers.attachConsoleLogs(testInfo, page);
  
  // ... login ...
  await Helpers.attachScreenshot(page, testInfo, 'e2e-01-after-login');
  
  // ... add to cart ...
  await Helpers.attachScreenshot(page, testInfo, 'e2e-01-after-add-cart');
  
  // ... go to cart ...
  await Helpers.attachScreenshot(page, testInfo, 'e2e-01-cart-page');
  
  // ... checkout ...
  await Helpers.attachScreenshot(page, testInfo, 'e2e-01-checkout-form');
  
  // ... complete order ...
  await Helpers.attachScreenshot(page, testInfo, 'e2e-01-order-complete');
});
```

**Helper Functions:**
```typescript
// Di utils/helpers.ts
static async attachScreenshot(page: Page, testInfo: TestInfo, name: string): Promise<string> {
  const timestamp = Helpers.getTimestamp();
  const filePath = `screenshots/${name}-${timestamp}.png`;
  
  Helpers.ensureScreenshotsDir();
  await page.screenshot({ path: filePath, fullPage: true });
  
  // Attach ke Playwright report (muncul di tab Attachments)
  await testInfo.attach(name, {
    path: filePath,
    contentType: 'image/png',
  });
  
  return filePath;
}
```

**Report Attachments (otomatis):**
- 📷 Screenshots (`.png`) - semua test
- 🎥 Videos (`.webm`) - semua test
- 📊 Metadata JSON - browser, OS, viewport, environment, timestamp, retry
- 📝 Console logs - JS console output dari browser
- 🌐 Network info - failed HTTP requests (4xx, 5xx)
- 🔍 Trace (`.zip`) - saat retry only

### 9. How to Run
```bash
# Install skills dari skills.sh (sudah terinstall di .agents/skills/)
npx skills add https://github.com/mattpocock/skills --skill tdd
npx skills add https://github.com/obra/superpowers --skill test-driven-development
npx skills add https://github.com/currents-dev/playwright-best-practices-skill --skill playwright-best-practices
npx skills add https://github.com/anthropics/skills --skill webapp-testing
npx skills add https://github.com/mattpocock/skills --skill diagnosing-bugs

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/login-positive.spec.ts

# Run specific test case
npx playwright test -g "TC-POS-01"

# Run by tag (filter)
npx playwright test --grep @smoke           # Smoke tests only
npx playwright test --grep @regression      # Regression only
npx playwright test --grep "@login @smoke"  # Login + smoke
npx playwright test --grep "@e2e"           # E2E tests only
npx playwright test --grep "@security"      # Security tests only

# Run in headed mode (see browser)
npx playwright test --headed

# Run in debug mode
npx playwright test --debug

# Run specific browser
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit

# Generate code
npx playwright codegen https://www.saucedemo.com

# Show HTML report
npx playwright show-report

# Show trace
npx playwright show-trace test-results/*/trace.zip
```

### 10. Improvement Suggestions
Suggest future enhancements:
- API testing integration (mock API responses)
- Visual regression testing (screenshot comparison)
- Accessibility testing (axe-core integration)
- Performance monitoring (load time assertions)
- Test data cleanup hooks (before/after each)
- CI/CD pipeline optimization (GitHub Actions)
- Parallel execution strategies
- Test reporting dashboards (Allure, HTML)
- Mobile testing (responsive design)
- Cross-browser matrix testing
- Email report integration (Gmail SMTP)
- Test history tracking
- Flaky test detection

---

## IMPORTANT NOTES

1. **No Cloudflare**: SauceDemo TIDAK dilindungi Cloudflare. Tidak perlu bypass atau retry logic khusus.

2. **Locator Strategy**: Gunakan ID selectors (id="user-name", id="password", id="login-button") karena SauceDemo menggunakan ID yang konsisten. Selain itu, gunakan getByRole, getByPlaceholder, getByText dengan .or() fallback.

3. **No Comments**: Jangan tambahkan comments dalam code kecuali diminta secara eksplisit.

4. **Code Quality**: Pastikan code bersih, maintainable, dan mengikuti best practices Playwright.

5. **Screenshot on EVERY Test**: Setiap test case WAJIB menghasilkan minimal 1 screenshot:
   - Test berhasil → screenshot di `screenshots/success/`
   - Test gagal → screenshot di `screenshots/failure/` (auto-captured by Playwright)
   - Key milestones → screenshot di `screenshots/success/` (manual capture)

6. **Test Independence**: Setiap test case harus independent dan tidak bergantung pada test lain. Gunakan beforeEach untuk setup.

7. **Data Management**: Gunakan test data factories untuk mengelola data test secara terpusat. Include semua 6 user accounts dan 6 products.

8. **Wait Strategy**: Gunakan auto-waiting Playwright. Jangan gunakan fixed timeout kecuali benar-benar diperlukan.

9. **Assertions**: Gunakan expect() dari @playwright/test untuk semua assertions. Pastikan assertions informatif.

10. **Cleanup**: Di akhir test yang melakukan add to cart, gunakan "Reset App State" dari hamburger menu untuk membersihkan state.

11. **Trace, Video & Report**: Konfigurasi Playwright untuk record trace, video, dan attach ke report:
    - `video: 'on'` - Record video semua test (bukan retry only)
    - `trace: 'on-first-retry'` - Trace hanya saat retry
    - `screenshot: 'on'` - Screenshot semua test
    - Setiap test WAJIB pake `Helpers.attachScreenshot()` untuk attach ke report
    - Setiap test WAJIB pake `ReportHelpers.addMetadata()` untuk tambah metadata
    - Setiap test WAJIB pake `ReportHelpers.attachConsoleLogs()` untuk capture console

12. **Test Tags**: Gunakan tags untuk filtering test di report:
    - `@smoke` - Critical path tests (15 tests)
    - `@regression` - Full regression (63 tests)
    - `@login`, `@inventory`, `@cart`, `@checkout`, `@e2e` - Feature tags
    - `@negative`, `@edge`, `@security` - Test type tags
    - Filter: `npx playwright test --grep @smoke`

13. **Report Attachments**: HTML report akan menampilkan:
    - 📷 Screenshots (`.png`) - semua test
    - 🎥 Videos (`.webm`) - semua test
    - 📊 Metadata JSON - browser, OS, viewport, environment
    - 📝 Console logs - JS console output
    - 🌐 Network info - failed HTTP requests
    - 🔍 Trace (`.zip`) - saat retry only

---

## OUTPUT FORMAT

Berikan response dalam urutan:
1. Feature Analysis
2. Test Scenarios (daftar lengkap)
3. Positive Test Cases (dengan ID dan deskripsi)
4. Negative Test Cases (dengan ID dan deskripsi)
5. Edge Cases (dengan ID dan deskripsi)
6. Playwright Folder Structure
7. Complete Source Code (semua file yang diperlukan)
8. How to Run
9. Improvement Suggestions

Pastikan semua source code siap pakai dan mengikuti konvensi project yang sudah ada.
