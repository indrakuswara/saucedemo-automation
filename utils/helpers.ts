import { Page, TestInfo } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export class Helpers {
  static ensureScreenshotsDir(): void {
    const dirs = ['screenshots', 'screenshots/success', 'screenshots/failure'];
    for (const dir of dirs) {
      const fullPath = path.join(__dirname, '..', dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    }
  }

  static getTimestamp(): string {
    return new Date().toISOString().replace(/[:.]/g, '-');
  }

  static async takeScreenshot(page: Page, name: string, type: 'success' | 'failure' | 'manual' = 'manual'): Promise<string> {
    const timestamp = Helpers.getTimestamp();
    const dir = type === 'success' ? 'screenshots/success' :
                type === 'failure' ? 'screenshots/failure' : 'screenshots';

    Helpers.ensureScreenshotsDir();

    const filePath = `${dir}/${name}-${timestamp}.png`;
    await page.screenshot({ path: filePath, fullPage: true });
    return filePath;
  }

  static async attachScreenshot(page: Page, testInfo: TestInfo, name: string): Promise<string> {
    const timestamp = Helpers.getTimestamp();
    const filePath = `screenshots/${name}-${timestamp}.png`;

    Helpers.ensureScreenshotsDir();

    await page.screenshot({ path: filePath, fullPage: true });

    await testInfo.attach(name, {
      path: filePath,
      contentType: 'image/png',
    });

    return filePath;
  }

  static async attachVideo(testInfo: TestInfo, page: Page): Promise<void> {
    const video = page.video();
    if (video) {
      const path = await video.path();
      if (path && fs.existsSync(path)) {
        await testInfo.attach('video', {
          path,
          contentType: 'video/webm',
        });
      }
    }
  }

  static async attachTrace(testInfo: TestInfo): Promise<void> {
    const tracePath = testInfo.outputPath('trace.zip');
    if (fs.existsSync(tracePath)) {
      await testInfo.attach('trace', {
        path: tracePath,
        contentType: 'application/zip',
      });
    }
  }

  static async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  static randomString(length: number = 10): string {
    return Math.random().toString(36).substring(2, 2 + length);
  }

  static randomEmail(): string {
    return `test.${this.randomString(8)}@example.com`;
  }

  static specialCharactersString(): string {
    return '!@#$%^&*()_+-=[]{}|;:,.<>?';
  }

  static sqlInjectionPayloads(): string[] {
    return [
      "' OR '1'='1",
      "' OR 1=1--",
      "admin'--",
      "' UNION SELECT NULL--",
      "1; DROP TABLE users--",
    ];
  }

  static xssPayloads(): string[] {
    return [
      '<script>alert("XSS")</script>',
      '<img src=x onerror=alert("XSS")>',
      '"><script>alert("XSS")</script>',
      "javascript:alert('XSS')",
      '<svg onload=alert("XSS")>',
    ];
  }

  static longString(length: number = 1000): string {
    return 'a'.repeat(length);
  }

  static unicodeString(): string {
    return '测试тестمرحبا🎉🚀';
  }

  static async clearBrowserState(page: Page): Promise<void> {
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.context().clearCookies();
  }

  static maskSensitiveData(data: string): string {
    return data.replace(/(.{2}).*(.{2})/, '$1****$2');
  }
}
