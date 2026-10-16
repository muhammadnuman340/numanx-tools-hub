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
    console.log('Contact form submission received:', data);

    const webhookUrl = process.env.CONTACT_WEBHOOK_URL || process.env.WEBHOOK_URL;

    // Method 1: Google Apps Script Webhook
    if (webhookUrl) {
      const resp = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'contact', ...data }),
      });
      if (!resp.ok) {
        throw new Error(`Webhook failed with status ${resp.status}`);
      }
    }
    // Method 2: Google Service Account
    else if (
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL &&
      process.env.GOOGLE_PRIVATE_KEY &&
      process.env.PUBLIC_GOOGLE_SHEET_ID &&
      !process.env.GOOGLE_PRIVATE_KEY.includes('fdffb4f5647498bfb593ce4e82a7011e268108c3')
    ) {
      const timestamp = new Date().toISOString();
      const row = [
        timestamp,
        'Contact',
        data.name || '',
        data.email || '',
        data.subject || 'General',
        data.message || '',
        '',
        'New',
      ];

      await sheetsService.appendRow(process.env.PUBLIC_GOOGLE_SHEET_ID, 'Sheet1!A:H', row);
    } else {
      console.warn(
        'No active webhook or valid Google Service Account credentials configured. Set CONTACT_WEBHOOK_URL in .env to receive messages.',
      );
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Contact system is undergoing setup. Please email directly at numanxstudio@gmail.com',
        }),
        {
          status: 503,
          headers: { 'Content-Type': 'application/json' },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you! Your message has been sent successfully.',
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error: any) {
    console.error('Error saving contact form:', error.message || error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Failed to save submission. Please try again.',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
};
