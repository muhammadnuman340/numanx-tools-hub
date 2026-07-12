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
