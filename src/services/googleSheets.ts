import { google } from 'googleapis';

export class GoogleSheetsService {
  private _auth: any | null = null;
  private _sheets: any | null = null;

  private init() {
    if (this._sheets) return;

    if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      throw new Error('Google Service Account credentials are not configured globally.');
    }

    this._auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: [
        'https://www.googleapis.com/auth/spreadsheets', // Full access
      ],
    });

    this._sheets = google.sheets({ version: 'v4', auth: this._auth });
  }

  /**
   * Retrieves data from a specified range in a Google Sheet.
   */
  async getRows(spreadsheetId: string, range: string): Promise<any[]> {
    this.init();
    try {
      const response = await this._sheets.spreadsheets.values.get({
        spreadsheetId,
        range,
      });
      return response.data.values || [];
    } catch (error) {
      console.error('Error fetching data from Google Sheets:', error);
      throw error;
    }
  }

  /**
   * Appends a new row to a specified Google Sheet.
   */
  async appendRow(spreadsheetId: string, range: string, values: any[]): Promise<boolean> {
    this.init();
    try {
      await this._sheets.spreadsheets.values.append({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [values],
        },
      });
      return true;
    } catch (error) {
      console.error('Error appending row to Google Sheets:', error);
      throw error;
    }
  }

  /**
   * Updates an existing range in a Google Sheet.
   */
  async updateRow(spreadsheetId: string, range: string, values: any[]): Promise<boolean> {
    this.init();
    try {
      await this._sheets.spreadsheets.values.update({
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [values],
        },
      });
      return true;
    } catch (error) {
      console.error('Error updating row in Google Sheets:', error);
      throw error;
    }
  }
}

export const sheetsService = new GoogleSheetsService();
