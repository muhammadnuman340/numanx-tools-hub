import { postToSheet } from '../../src/lib/sheetWebhook.js';

// Human-readable labels for the contact form's subject <select> values
const TOPIC_LABELS = {
  feedback: 'Feedback',
  bug: 'Bug Report',
  suggestion: 'Tool Suggestion',
  partnership: 'Business / Partnership',
  other: 'Other',
};

export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
    });
  }

  try {
    const { name, email, subject, message } = await request.json();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Name, email, and message are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const payload = {
      type: 'contact',
      site: new URL(request.url).hostname,
      topic: TOPIC_LABELS[subject] || 'General',
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject || 'General',
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    // Google Apps Script saves the message and sends the emails
    const sheet = await postToSheet(env.CONTACT_WEBHOOK_URL, payload, env.WEBHOOK_SECRET);
    const sheetStored = sheet.ok;

    // Fallback: store in KV if bound
    let kvStored = false;
    try {
      if (env.CONTACT_KV) {
        const key = `contact_${Date.now()}`;
        await env.CONTACT_KV.put(key, JSON.stringify(payload));
        kvStored = true;
      }
    } catch (_) {
      // KV not available
    }

    // A slow script usually still delivers, so only a clear failure is reported to the visitor
    if (!sheetStored && !kvStored && sheet.reason !== 'timeout') {
      return new Response(
        JSON.stringify({
          error: 'Your message could not be sent right now. Please email contact@numanxstudio.com instead.',
          delivery: sheet.reason,
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Your message has been sent. We will get back to you soon!',
        stored: sheetStored || kvStored,
        delivery: sheet.reason,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request body' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
