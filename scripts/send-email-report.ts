import { EmailReport } from '../utils/email-report';
import { resolve } from 'path';
import { existsSync } from 'fs';
import AdmZip from 'adm-zip';

function createReportZip(reportDir: string, outputPath: string): string | null {
  if (!existsSync(reportDir)) {
    console.warn('⚠️ Report directory not found:', reportDir);
    return null;
  }

  console.log('📦 Creating report zip...');
  const zip = new AdmZip();
  zip.addLocalFolder(reportDir, 'playwright-report');
  zip.writeZip(outputPath);
  
  const stats = require('fs').statSync(outputPath);
  const sizeInMB = (stats.size / 1024 / 1024).toFixed(2);
  console.log(`✅ Report zipped: ${outputPath} (${sizeInMB} MB)`);
  return outputPath;
}

async function main() {
  const emailTo = process.env.EMAIL_TO || 'indrakus01@gmail.com';
  const resultsPath = resolve(__dirname, '../test-results/results.json');
  const reportDir = resolve(__dirname, '../playwright-report');
  const reportZipPath = resolve(__dirname, '../playwright-report.zip');

  console.log('📧 Sending test report email...');
  console.log(`   To: ${emailTo}`);
  
  if (existsSync(resultsPath)) {
    console.log(`   Results: ${resultsPath}`);
  } else {
    console.log(`   ⚠️ Results file not found, will send basic report`);
  }

  // Create zip of playwright-report
  let zipPath: string | null = null;
  if (existsSync(reportDir)) {
    zipPath = createReportZip(reportDir, reportZipPath);
  }

  const success = await EmailReport.sendTestReport(
    emailTo,
    resultsPath,
    zipPath || undefined
  );

  if (success) {
    console.log('✅ Email report sent successfully!');
  } else {
    console.error('❌ Failed to send email report');
    process.exit(1);
  }
}

main().catch(console.error);
