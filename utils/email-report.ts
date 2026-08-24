import nodemailer from 'nodemailer';
import { readFileSync, existsSync } from 'fs';
import { resolve, basename } from 'path';

interface EmailOptions {
  to: string;
  subject?: string;
  htmlBody?: string;
  attachments?: Array<{
    filename: string;
    path: string;
    contentType?: string;
  }>;
}

interface ReportSummary {
  totalTests: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  duration: string;
  reportPath: string;
}

export class EmailReport {
  private static transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER || '',
      pass: process.env.SMTP_PASS || '',
    },
  });

  /**
   * Re-initialize transporter with current env vars (call after dotenv.config())
   */
  static initTransporter() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Send test report email with HTML summary + attachments
   */
  static async sendReport(options: EmailOptions): Promise<boolean> {
    try {
      const info = await this.transporter.sendMail({
        from: `"SauceDemo Automation" <${process.env.SMTP_USER || 'indrakus15@gmail.com'}>`,
        to: options.to,
        subject: options.subject || '🧪 SauceDemo Test Report',
        html: options.htmlBody || this.getDefaultHtmlBody(),
        attachments: options.attachments || [],
      });

      console.log(`✅ Email sent: ${info.messageId}`);
      console.log(`📧 Preview: ${nodemailer.getTestMessageUrl(info)}`);
      return true;
    } catch (error) {
      console.error('❌ Email send failed:', error);
      return false;
    }
  }

  /**
   * Generate HTML report summary
   */
  static generateHtmlSummary(summary: ReportSummary): string {
    const passedPercent = summary.totalTests > 0 
      ? Math.round((summary.passed / summary.totalTests) * 100) 
      : 0;
    
    const statusColor = summary.failed === 0 ? '#10b981' : '#ef4444';
    const statusText = summary.failed === 0 ? 'ALL PASSED' : `${summary.failed} FAILED`;

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background: #f9fafb;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">🧪 SauceDemo Test Report</h1>
        <p style="margin: 10px 0 0; opacity: 0.9;">Playwright Automation Results</p>
      </div>
      
      <!-- Status Banner -->
      <div style="background: ${statusColor}; color: white; padding: 15px; text-align: center; font-size: 18px; font-weight: bold;">
        ${statusText}
      </div>
      
      <!-- Stats Cards -->
      <div style="background: white; padding: 25px; border-radius: 0 0 12px 12px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-bottom: 20px;">
          
          <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #10b981;">
            <div style="font-size: 28px; font-weight: bold; color: #10b981;">${summary.passed}</div>
            <div style="color: #6b7280; font-size: 12px;">PASSED</div>
          </div>
          
          <div style="background: #fef2f2; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #ef4444;">
            <div style="font-size: 28px; font-weight: bold; color: #ef4444;">${summary.failed}</div>
            <div style="color: #6b7280; font-size: 12px;">FAILED</div>
          </div>
          
          <div style="background: #fffbeb; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #f59e0b;">
            <div style="font-size: 28px; font-weight: bold; color: #f59e0b;">${summary.skipped}</div>
            <div style="color: #6b7280; font-size: 12px;">SKIPPED</div>
          </div>
          
          <div style="background: #f5f3ff; padding: 15px; border-radius: 8px; text-align: center; border-left: 4px solid #8b5cf6;">
            <div style="font-size: 28px; font-weight: bold; color: #8b5cf6;">${summary.flaky}</div>
            <div style="color: #6b7280; font-size: 12px;">FLAKY</div>
          </div>
          
        </div>
        
        <!-- Progress Bar -->
        <div style="margin-bottom: 20px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px; color: #6b7280;">
            <span>Progress</span>
            <span>${passedPercent}% Pass Rate</span>
          </div>
          <div style="background: #e5e7eb; border-radius: 10px; height: 10px; overflow: hidden;">
            <div style="background: linear-gradient(90deg, #10b981, #34d399); width: ${passedPercent}%; height: 100%;"></div>
          </div>
        </div>
        
        <!-- Info Table -->
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Total Tests</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">${summary.totalTests}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Duration</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">${summary.duration}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">Report</td>
            <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 600;">${basename(summary.reportPath)}</td>
          </tr>
        </table>
        
        <!-- Footer -->
        <div style="margin-top: 25px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
          <p>Sent by SauceDemo Automation • Playwright + TypeScript</p>
          <p>Generated: ${new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</p>
        </div>
      </div>
      
    </body>
    </html>
    `;
  }

  /**
   * Parse playwright report-results.json to get summary
   */
  static parseReportResults(resultsPath: string): ReportSummary | null {
    try {
      if (!existsSync(resultsPath)) {
        console.warn('⚠️ Report results file not found:', resultsPath);
        return null;
      }

      const content = readFileSync(resultsPath, 'utf-8');
      const data = JSON.parse(content);

      return {
        totalTests: data.stats?.expected + data.stats?.unexpected + data.stats?.flaky + data.stats?.skipped || 0,
        passed: data.stats?.expected || 0,
        failed: data.stats?.unexpected || 0,
        skipped: data.stats?.skipped || 0,
        flaky: data.stats?.flaky || 0,
        duration: data.stats?.duration ? `${Math.round(data.stats.duration / 1000)}s` : 'N/A',
        reportPath: resultsPath,
      };
    } catch (error) {
      console.error('Failed to parse report:', error);
      return null;
    }
  }

  /**
   * Send email with report results
   */
  static async sendTestReport(
    to: string,
    resultsPath: string,
    reportZipPath?: string
  ): Promise<boolean> {
    const summary = this.parseReportResults(resultsPath);
    
    if (!summary) {
      console.warn('No report summary found, sending default email...');
      return this.sendReport({
        to,
        subject: '🧪 SauceDemo Test Report (No Results)',
      });
    }

    const htmlBody = this.generateHtmlSummary(summary);
    
    const attachments: EmailOptions['attachments'] = [];
    
    if (reportZipPath && existsSync(reportZipPath)) {
      attachments.push({
        filename: basename(reportZipPath),
        path: reportZipPath,
        contentType: 'application/zip',
      });
    }

    return this.sendReport({
      to,
      subject: summary.failed === 0 
        ? `✅ SauceDemo Report - ${summary.passed}/${summary.totalTests} Passed`
        : `❌ SauceDemo Report - ${summary.failed} Failed`,
      htmlBody,
      attachments,
    });
  }

  private static getDefaultHtmlBody(): string {
    return `
    <html>
    <body style="font-family: sans-serif; padding: 20px;">
      <h2>🧪 SauceDemo Test Report</h2>
      <p>Test execution completed. Please see attached report.</p>
      <p>Sent by SauceDemo Automation</p>
    </body>
    </html>
    `;
  }
}
