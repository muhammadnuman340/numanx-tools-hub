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
    const data = await request.json();
    console.log('Feedback received:', data);

    const webhookUrl = process.env.FEEDBACK_WEBHOOK_URL || process.env.WEBHOOK_URL;

    // Method 1: Google Apps Script Webhook
    if (webhookUrl) {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'feedback', ...data }),
      });
    }
    // Method 2: Google Service Account
    else if (
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.PUBLIC_GOOGLE_SHEET_ID
    ) {
      const timestamp = new Date().toISOString();
      const rating = data.rating ? `${data.rating}/5` : '';
      const row = [timestamp, 'Feedback', '', data.email || '', rating, data.message || '', data.page || '', 'New'];

      await sheetsService.appendRow(process.env.PUBLIC_GOOGLE_SHEET_ID, 'Sheet1!A:H', row);
    } else {
      console.warn(
        'No Google Sheets integration configured. Set FEEDBACK_WEBHOOK_URL or GOOGLE_SERVICE_ACCOUNT_EMAIL to persist data.',
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you! Your feedback has been received.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error: any) {
    console.error('Error saving feedback:', error.message || error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to save feedback. Please try again.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
