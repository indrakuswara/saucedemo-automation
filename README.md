# SauceDemo Automation - Playwright TypeScript

E2E test automation untuk aplikasi **SauceDemo (Swag Labs)** menggunakan Playwright + TypeScript dengan pattern Page Object Model (POM).

---

## 📋 Overview

| Item | Detail |
|------|--------|
| **Target** | https://www.saucedemo.com |
| **Framework** | Playwright Test v1.40+ |
| **Language** | TypeScript (strict mode) |
| **Pattern** | Page Object Model (POM) |
| **Browsers** | Chromium, Firefox, WebKit |
| **Total Tests** | 78 test cases (233 assertions) |

### Fitur yang Di-automation:
- ✅ Login (positive & negative)
- ✅ Inventory (product list, sorting, add/remove cart)
- ✅ Cart (view, remove items, proceed to checkout)
- ✅ Checkout (form validation, order summary, complete order)
- ✅ End-to-end purchase flow

---

## ⚡ Quick Start

### Prerequisites
- Node.js >= 18.0.0
- npm >= 9.0.0

### Setup

```bash
# Clone repo
git clone <repository-url>
cd playwright-demo

# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

### Environment Variables

```bash
# Copy template
cp .env.example .env

# Edit .env (optional - defaults provided)
```

---

## 🚀 Running Tests

### All Tests
```bash
npm test
```

### By Feature
```bash
npm run test:login:positive    # Login positive cases (10 tests)
npm run test:login:negative    # Login negative cases (33 tests)
npm run test:inventory         # Inventory tests (13 tests)
npm run test:cart              # Cart tests (7 tests)
npm run test:checkout          # Checkout tests (10 tests)
npm run test:e2e               # E2E order flow (5 tests)
```

### By Tag
```bash
npm run test:smoke             # Smoke tests (critical path)
npm run test:regression        # Full regression

# Atau manual
npx playwright test --grep @smoke
npx playwright test --grep @regression
npx playwright test --grep "@login @smoke"
```

### By Browser
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Debug Mode
```bash
npm run test:headed    # See browser
npm run test:debug     # Step by step
```

### Specific Test
```bash
npx playwright test -g "TC-POS-01"
npx playwright test tests/login-positive.spec.ts
```

---

## 📧 Email Report

Kirim test report via email (Gmail SMTP):

```bash
# Set environment variables
$env:SMTP_USER='your-email@gmail.com'
$env:SMTP_PASS='your-app-password'
$env:EMAIL_TO='recipient@gmail.com'

# Send report
npm run report:email
```

### Fitur Email:
- 📊 HTML summary (passed, failed, skipped, flaky)
- 📈 Progress bar
- 📎 Lampiran `playwright-report.zip` (8MB)
- ⏱️ Duration & timestamp

---

## 📁 Project Structure

```
playwright-demo/
├── pages/
│   ├── base.page.ts              # BasePage - foundation class
│   ├── login.page.ts             # LoginPage
│   ├── inventory.page.ts         # InventoryPage
│   ├── cart.page.ts              # CartPage
│   ├── checkout-step-one.page.ts # CheckoutStepOnePage
│   ├── checkout-step-two.page.ts # CheckoutStepTwoPage
│   └── checkout-complete.page.ts # CheckoutCompletePage
├── tests/
│   ├── login-positive.spec.ts    # 10 tests
│   ├── login-negative.spec.ts    # 33 tests
│   ├── inventory.spec.ts         # 13 tests
│   ├── cart.spec.ts              # 7 tests
│   ├── checkout.spec.ts          # 10 tests
│   └── e2e-order.spec.ts         # 5 tests
├── utils/
│   ├── constants.ts              # URLs, credentials, selectors
│   ├── helpers.ts                # Utilities, screenshot attach
│   ├── test-data.ts              # Test data factories
│   └── report-helpers.ts         # Metadata, console logs, network
├── scripts/
│   └── send-email-report.ts      # Email report sender
├── .agents/skills/               # Skills from skills.sh
├── screenshots/                  # Test screenshots
├── test-results/                 # Playwright output + traces + videos
├── playwright-report/            # HTML report
├── playwright.config.ts          # Playwright config
├── tsconfig.json                 # TypeScript config
├── package.json                  # Dependencies
├── .env.example                  # Environment template
├── PROMPT-SAUCEDEMO.md           # Master prompt documentation
└── README.md                     # This file
```

---

## 🧩 Test Cases

### Login - Positive (10 tests)
| ID | Test Case | Tags |
|----|-----------|------|
| TC-POS-01 | Login successfully | @smoke @login |
| TC-POS-02 | Login using Enter key | @regression @login |
| TC-POS-03 | Login after page refresh | @regression @login |
| TC-POS-04 | Login with copy-pasted credentials | @regression @login |
| TC-POS-05 | Password field is masked | @smoke @security |
| TC-POS-06 | Login page elements visible | @smoke @ui |
| TC-POS-07 | Tab navigation between fields | @regression @accessibility |
| TC-POS-08 | Username field accepts input | @regression @ui |
| TC-POS-09 | Clear and re-enter credentials | @regression @login |
| TC-POS-10 | Login with problem_user | @smoke @users |

### Login - Negative (33 tests)
| Kategori | Tests |
|----------|-------|
| Invalid credentials | 6 tests |
| Empty fields | 6 tests |
| Whitespace handling | 3 tests |
| SQL injection | 4 tests |
| XSS attack | 4 tests |
| Edge cases | 6 tests |
| Locked out user | 2 tests |
| Rapid clicks | 2 tests |

### Inventory (13 tests)
- Product list display
- Sorting (Name A-Z, Z-A, Price low-high, high-low)
- Add/remove items to cart
- Badge count

### Cart (7 tests)
- View cart items
- Remove items
- Continue shopping
- Proceed to checkout

### Checkout (10 tests)
- Form validation
- Order summary
- Complete order
- Cancel order

### E2E Order (5 tests)
- Single item purchase
- Multiple items purchase
- Remove from cart
- Cheapest item
- Protected pages

---

## 🏷️ Test Tags

| Tag | Description | Count |
|-----|-------------|-------|
| `@smoke` | Critical path | 15 tests |
| `@regression` | Full regression | 63 tests |
| `@login` | Login feature | - |
| `@inventory` | Inventory feature | - |
| `@cart` | Cart feature | - |
| `@checkout` | Checkout feature | - |
| `@e2e` | End-to-end | - |
| `@negative` | Negative cases | - |
| `@security` | Security tests | - |
| `@edge` | Edge cases | - |
| `@ui` | UI tests | - |
| `@accessibility` | Accessibility | - |

---

## 📊 Report & Artifacts

### HTML Report
```bash
npm run report
npx playwright show-report
```

### Artifacts (otomatis tersimpan)
| Artifact | Location | Condition |
|----------|----------|-----------|
| 📷 Screenshots | `screenshots/` | Semua test |
| 🎥 Videos | `test-results/*/video.webm` | Semua test |
| 🔍 Traces | `test-results/*/trace.zip` | Saat retry |
| 📊 Metadata | Test attachments | Semua test |
| 📝 Console logs | Test attachments | Semua test |

### Konfigurasi di `playwright.config.ts`
```typescript
use: {
  screenshot: 'on',           // Screenshot semua test
  video: 'on',                // Video semua test
  trace: 'on-first-retry',    // Trace saat retry only
}
```

---

## 🛠️ Skills (via skills.sh)

| Skill | Source | Purpose |
|-------|--------|---------|
| `tdd` | mattpocock/skills | TDD workflow |
| `test-driven-development` | obra/superpowers | Red-Green-Refactor |
| `playwright-best-practices` | currents-dev | Playwright patterns |
| `webapp-testing` | anthropics/skills | Web app testing |
| `diagnosing-bugs` | mattpocock/skills | Bug diagnosis |

Lokasi: `.agents/skills/`

---

## 🔧 Commands Reference

```bash
# Testing
npm test                          # Run all tests
npm run test:smoke                # Smoke only
npm run test:regression           # Regression only
npm run test:headed               # See browser
npm run test:debug                # Debug mode

# Report
npm run report                    # Show HTML report
npm run report:email              # Send email report

# Code Generation
npm run codegen                   # Open Playwright Inspector

# Utilities
npx playwright install            # Install browsers
npx playwright show-trace <file>  # View trace
```

---

## 📝 Environment Variables

```env
# Application
BASE_URL=https://www.saucedemo.com
HEADLESS=true
BROWSER=chromium

# Email Report
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_TO=recipient@gmail.com
```

---

## 🤝 Contributing

1. Create feature branch
2. Follow existing patterns (POM, naming conventions)
3. Add test tags (@smoke, @regression, etc.)
4. Attach screenshots in tests
5. Ensure all tests pass
6. Submit PR

---

## 📄 License

Indra Kuswara
