import { postToSheet } from '../../src/lib/sheetWebhook.js';

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
    });
  }

  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return new Response(JSON.stringify({ error: 'Please enter a valid email address.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Google Apps Script saves the signup and emails a confirm link (double opt-in)
    const sheet = await postToSheet(
      env.NEWSLETTER_WEBHOOK_URL || env.CONTACT_WEBHOOK_URL,
      { type: 'subscribe', email: normalizedEmail, site: new URL(request.url).hostname, timestamp: new Date().toISOString() },
      env.WEBHOOK_SECRET,
    );
    const status = sheet.ok ? (sheet.data && sheet.data.status) || 'saved' : '';

    // Backup copy in Cloudflare KV if it is bound
    let kvStored = false;
    try {
      if (env.NEWSLETTER_KV) {
        const existing = await env.NEWSLETTER_KV.get('subscribers', 'json');
        const subscribers = existing || [];
        if (!subscribers.includes(normalizedEmail)) {
          subscribers.push(normalizedEmail);
          await env.NEWSLETTER_KV.put('subscribers', JSON.stringify(subscribers));
        }
        kvStored = true;
      }
    } catch (_) {
      // KV not available
    }

    if (!status && !kvStored) {
      return new Response(JSON.stringify({ error: 'Signup is not available right now. Please try again later.', delivery: sheet.reason }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const message =
      status === 'already-subscribed'
        ? 'You are already subscribed. Thanks!'
        : status
          ? 'Almost done: check your inbox and click the link to confirm.'
          : 'Thanks! You are on the list.';

    return new Response(JSON.stringify({ success: true, message, email: normalizedEmail, delivery: sheet.reason }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
