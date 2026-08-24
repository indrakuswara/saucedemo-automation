import { TestInfo, Page } from '@playwright/test';
import * as os from 'os';

export interface TestMetadata {
  environment: string;
  baseUrl: string;
  browser: string;
  os: string;
  tags: string[];
}

export class ReportHelpers {
  static getMetadata(testInfo: TestInfo): TestMetadata {
    return {
      environment: process.env.TEST_ENV || 'development',
      baseUrl: process.env.BASE_URL || 'https://www.saucedemo.com',
      browser: testInfo.project.name,
      os: `${os.platform()} ${os.release()}`,
      tags: [],
    };
  }

  static async addMetadata(testInfo: TestInfo, page: Page): Promise<void> {
    const metadata = ReportHelpers.getMetadata(testInfo);

    testInfo.annotations.push(
      { type: 'environment', description: metadata.environment },
      { type: 'baseURL', description: metadata.baseUrl },
      { type: 'browser', description: metadata.browser },
      { type: 'os', description: metadata.os },
      { type: 'timestamp', description: new Date().toISOString() },
      { type: 'retry', description: `${testInfo.retry} / ${testInfo.project.retries}` },
      { type: 'timeout', description: `${testInfo.timeout}ms` },
      { type: 'viewport', description: `${testInfo.project.use.viewport?.width}x${testInfo.project.use.viewport?.height}` },
    );

    await testInfo.attach('test-metadata', {
      body: JSON.stringify({
        environment: metadata.environment,
        baseUrl: metadata.baseUrl,
        browser: metadata.browser,
        os: metadata.os,
        timestamp: new Date().toISOString(),
        retry: `${testInfo.retry} / ${testInfo.project.retries}`,
        timeout: testInfo.timeout,
        viewport: testInfo.project.use.viewport,
        platform: os.platform(),
        nodeVersion: process.version,
      }, null, 2),
      contentType: 'application/json',
    });
  }

  static async attachConsoleLogs(testInfo: TestInfo, page: Page): Promise<void> {
    const logs: string[] = [];

    page.on('console', (msg) => {
      const logEntry = `[${msg.type()}] ${msg.text()}`;
      logs.push(logEntry);
    });

    page.on('pageerror', (error) => {
      logs.push(`[ERROR] ${error.message}`);
    });

    testInfo.annotations.push({ type: 'console-logs', description: 'Console logs captured' });

    await testInfo.attach('console-logs-info', {
      body: 'Console logs will be captured during test execution',
      contentType: 'text/plain',
    });
  }

  static async attachNetworkInfo(testInfo: TestInfo, page: Page): Promise<void> {
    const requests: string[] = [];

    page.on('response', (response) => {
      const status = response.status();
      const url = response.url();
      if (status >= 400) {
        requests.push(`[${status}] ${url}`);
      }
    });

    testInfo.annotations.push({ type: 'network-info', description: 'Network info captured' });

    await testInfo.attach('network-info', {
      body: 'Network info will be captured during test execution',
      contentType: 'text/plain',
    });
  }
}
