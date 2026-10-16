const NOTIFICATION_EMAIL = 'numanxstudio@gmail.com';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.openById('1R1mJ3Hm2KOCRF3zlA3Qx1W3S-clDIsnkVStFctmeMNg');

    if (data.type === 'feedback') {
      // ─── Feedback tab ───
      let sheet = ss.getSheetByName('Feedback');
      if (!sheet) {
        sheet = ss.insertSheet('Feedback');
        sheet.appendRow(['Timestamp', 'Rating', 'Message', 'Email', 'Page']);
      }
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.rating || '',
        data.message || '',
        data.email || '',
        data.page || '',
      ]);

      // Email notification for feedback
      try {
        MailApp.sendEmail({
          to: NOTIFICATION_EMAIL,
          subject: `[NumanX Feedback] Rating: ${data.rating ? data.rating + '/5' : 'N/A'} - ${data.page || 'Tools Hub'}`,
          replyTo: data.email || undefined,
          htmlBody: `
            <div style="font-family: sans-serif; max-width: 600px; color: #111;">
              <h2 style="color: #6d28d9;">New User Feedback Received</h2>
              <p><strong>Rating:</strong> ${data.rating ? data.rating + '/5' : 'None provided'}</p>
              <p><strong>Email:</strong> ${data.email || 'Anonymous'}</p>
              <p><strong>Page:</strong> ${data.page || '/'}</p>
              <p><strong>Message:</strong></p>
              <div style="background: #f4f4f5; padding: 12px; border-radius: 8px; white-space: pre-wrap;">${data.message || 'No comment'}</div>
            </div>
          `,
        });
      } catch (mailErr) {
        Logger.log('Feedback mail error: ' + mailErr);
      }
    } else {
      // ─── Contact tab (default) ───
      const sheet = ss.getActiveSheet();
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Timestamp', 'Name', 'Email', 'Subject', 'Message']);
      }
      sheet.appendRow([
        data.timestamp || new Date().toISOString(),
        data.name || '',
        data.email || '',
        data.subject || 'General',
        data.message || '',
      ]);

      // Direct Gmail notification for contact form submission
      try {
        MailApp.sendEmail({
          to: NOTIFICATION_EMAIL,
          subject: `[NumanX Tools] ${data.subject || 'Contact Inquiry'} from ${data.name || 'Visitor'}`,
          replyTo: data.email || undefined,
          htmlBody: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; color: #111; line-height: 1.6;">
              <h2 style="color: #6d28d9; border-bottom: 2px solid #e4e4e7; padding-bottom: 8px;">
                📬 New Contact Form Submission
              </h2>
              <p><strong>Name:</strong> ${data.name || 'Anonymous'}</p>
              <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email || 'None'}</a></p>
              <p><strong>Subject:</strong> ${data.subject || 'General Inquiry'}</p>
              <p><strong>Received:</strong> ${new Date().toLocaleString()}</p>
              <hr style="border: none; border-top: 1px solid #e4e4e7; margin: 16px 0;" />
              <p><strong>Message:</strong></p>
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; white-space: pre-wrap; font-size: 14px;">
${data.message || ''}
              </div>
              <p style="font-size: 12px; color: #71717a; margin-top: 20px;">
                Tip: You can hit <strong>Reply</strong> in your email client to directly reply to ${data.name} (${data.email}).
              </p>
            </div>
          `,
        });
      } catch (mailErr) {
        Logger.log('Contact mail error: ' + mailErr);
      }
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(
      ContentService.MimeType.JSON,
    );
  }
}
