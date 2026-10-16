/**
 * Google Apps Script — Web App endpoint for NumanX Tools
 *
 * Deploys as a Google Sheets-connected web app that receives
 * contact form and feedback submissions via POST.
 *
 * ── Deployment Instructions ──
 * 1. Create a new Google Sheet
 * 2. Extensions → Apps Script
 * 3. Paste this entire file
 * 4. Replace SHEET_ID below with your sheet's ID (from the URL)
 * 5. Deploy → New deployment → Type: Web app
 * 6. Execute as: Me, Who has access: Anyone
 * 7. Copy the Web app URL → set as CONTACT_WEBHOOK_URL or FEEDBACK_WEBHOOK_URL in Cloudflare env
 */

const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();

    // Auto-create headers if empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Type', 'Name', 'Email', 'Subject / Rating', 'Message', 'Page', 'Status']);
    }

    const type = data.type || 'contact';
    const timestamp = new Date().toISOString();

    if (type === 'contact') {
      sheet.appendRow([
        timestamp,
        'Contact',
        data.name || '',
        data.email || '',
        data.subject || 'General',
        data.message || '',
        '',
        'New',
      ]);

      // Deliver instant email notification to Gmail
      try {
        MailApp.sendEmail({
          to: 'numanxstudio@gmail.com',
          subject: `[NumanX Contact] ${data.subject || 'Inquiry'} from ${data.name || 'Visitor'}`,
          replyTo: data.email || undefined,
          htmlBody: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; color: #111; line-height: 1.6;">
              <h2 style="color: #6d28d9;">📬 New Contact Form Message</h2>
              <p><strong>Name:</strong> ${data.name || 'Anonymous'}</p>
              <p><strong>Email:</strong> ${data.email || 'None'}</p>
              <p><strong>Subject:</strong> ${data.subject || 'General Inquiry'}</p>
              <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 16px 0;" />
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; white-space: pre-wrap;">
${data.message || ''}
              </div>
            </div>
          `,
        });
      } catch (e) {
        Logger.log('Mail send error: ' + e);
      }
    } else if (type === 'feedback') {
      const rating = data.rating ? `${data.rating}/5` : '';
      sheet.appendRow([
        timestamp,
        'Feedback',
        '',
        data.email || '',
        rating,
        data.message || '',
        data.page || '',
        'New',
      ]);

      try {
        MailApp.sendEmail({
          to: 'numanxstudio@gmail.com',
          subject: `[NumanX Feedback] Rating: ${rating || 'N/A'}`,
          replyTo: data.email || undefined,
          htmlBody: `<p><strong>Rating:</strong> ${rating}</p><p><strong>Page:</strong> ${data.page || ''}</p><p><strong>Message:</strong> ${data.message || ''}</p>`,
        });
      } catch (e) {}
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.message })).setMimeType(
      ContentService.MimeType.JSON,
    );
  }
}

function doGet() {
  return ContentService.createTextOutput(
    JSON.stringify({ status: 'ok', message: 'NumanX Tools Sheets Webhook is running.' }),
  ).setMimeType(ContentService.MimeType.JSON);
}
