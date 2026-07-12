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
    }

    return ContentService.createTextOutput(JSON.stringify({ success: true })).setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ success: false, error: err.toString() })).setMimeType(
      ContentService.MimeType.JSON,
    );
  }
}
