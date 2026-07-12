import type { APIRoute } from 'astro';
import { sheetsService } from '../../services/googleSheets';

export const GET: APIRoute = async () => {
  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const { sheetId, range = 'A1:Z1000' } = await request.json();

    if (!sheetId) {
      return new Response(JSON.stringify({ success: false, error: 'Sheet ID is required.' }), { status: 400 });
    }

    let rows: any[] = [];
    try {
      rows = await sheetsService.getRows(sheetId, range);
    } catch (e: any) {
      return new Response(
        JSON.stringify({
          success: false,
          error: e.message?.includes('credentials')
            ? 'Google Service Account credentials are not configured on the server.'
            : 'Failed to fetch sheet data. Ensure the sheet is shared with the Service Account email.',
        }),
        { status: 403 },
      );
    }

    if (!rows || rows.length === 0) {
      return new Response(JSON.stringify({ success: true, secretsFound: [], message: 'No data found.' }), {
        status: 200,
      });
    }

    // Basic regexes to search for secrets
    const secretPatterns = [
      { type: 'AWS Key', regex: /(?:A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}/ },
      { type: 'Google API Key', regex: /AIza[0-9A-Za-z\-_]{35}/ },
      { type: 'RSA Private Key', regex: /-----BEGIN RSA PRIVATE KEY-----/ },
      { type: 'Stripe Secret', regex: /(?:sk_live|rk_live)_[0-9a-zA-Z]{24}/ },
      { type: 'Password Pattern', regex: /password\s*[:=]\s*["']?([A-Za-z0-9@#$%^&+=_]{8,})["']?/i },
      { type: 'Generic Token', regex: /(?:token|secret|auth)\s*[:=]\s*["']?([A-Za-z0-9\-_]{16,})["']?/i },
    ];

    const secretsFound: Array<{ row: number; col: number; type: string; preview: string }> = [];

    rows.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (!cell || typeof cell === 'object') return;
        const cellString = String(cell);
        for (const pattern of secretPatterns) {
          if (pattern.regex.test(cellString)) {
            // Mask the secret for safety in preview
            const masked =
              cellString.length > 20
                ? cellString.substring(0, 4) + '...' + cellString.substring(cellString.length - 4)
                : '***MASKED***';
            secretsFound.push({
              row: rowIndex + 1,
              col: colIndex + 1,
              type: pattern.type,
              preview: masked,
            });
          }
        }
      });
    });

    return new Response(
      JSON.stringify({
        success: true,
        secretsFound,
        totalCellsScanned: rows.length * (rows[0]?.length || 0),
      }),
      { status: 200 },
    );
  } catch (error: any) {
    console.error('Error scanning sheet:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'Failed to scan sheet.',
      }),
      { status: 500 },
    );
  }
};
