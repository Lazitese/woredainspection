import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import { sendSMS } from '../src/notifications/sms-service';
import { sendEmail, wrapEmailTemplate } from '../src/notifications/email-service';

async function main() {
  console.log('=== TESTING NOTIFICATIONS ===');
  console.log('Target Phone:', '0938560597');
  console.log('Target Email:', 'alazartesema1@gmail.com');
  console.log('TEXTBEE_BASE_URL:', process.env.TEXTBEE_BASE_URL);
  console.log('TEXTBEE_DEVICE_ID:', process.env.TEXTBEE_DEVICE_ID);
  console.log('BREVO_FROM_EMAIL:', process.env.BREVO_FROM_EMAIL);

  // 1. Test SMS
  console.log('\n--- 1. Testing SMS Sending ---');
  try {
    const smsText = 'የሙከራ መልዕክት (Test SMS): የአቃቂ ቃሊቲ ወረዳዎች ኢንስፔክሽን ሲስተም መልዕክት መድረሱን ያረጋግጣል።';
    const smsRes = await sendSMS('0938560597', smsText);
    console.log('SMS Result:', smsRes);
  } catch (err) {
    console.error('SMS Exception:', err);
  }

  // 2. Test Email
  console.log('\n--- 2. Testing Email Sending ---');
  try {
    const subject = 'የሙከራ ኢሜይል (Test Email) - ICODiS System';
    const htmlBody = wrapEmailTemplate(
      'የሲስተም የሙከራ መልዕክት',
      'የአቃቂ ቃሊቲ ወረዳዎች ኢንስፔክሽን ዲጂታል ሲስተም',
      `
        <p>ሰላም,</p>
        <p>ይህ ከአቃቂ ቃሊቲ ወረዳዎች የኢንስፔክሽን ዲጂታል ሲስተም (ICODiS) የተላከ የሙከራ ኢሜይል ነው።</p>
        <div class="box">
          <div class="label">የሙከራ ሁኔታ</div>
          <div class="value">ኢሜይል በተሳካ ሁኔታ እየሰራ ይገኛል ✅</div>
          <div class="code-badge">SUCCESS-2026</div>
        </div>
        <p>ኢሜይሉ በስኬት ደርሶዎታል!</p>
      `
    );
    const emailRes = await sendEmail('alazartesema1@gmail.com', subject, htmlBody, 'የሙከራ ኢሜይል መልዕክት በተሳካ ሁኔታ ደርሷል።');
    console.log('Email Result:', emailRes);
  } catch (err) {
    console.error('Email Exception:', err);
  }
}

main().catch(console.error);
