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

    // Forward to Google Sheets webhook if configured with 4s timeout
    let sheetStored = false;
    const webhookUrl = env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      try {
        const resp = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // The secret proves the request came from this site; it is never stored
          body: JSON.stringify({ ...payload, secret: env.WEBHOOK_SECRET || '' }),
          signal: controller.signal,
        });
        // Apps Script answers 200 even on errors, so read its reply
        const out = await resp.json().catch(() => ({}));
        sheetStored = resp.ok && out.success !== false;
      } catch (_) {
        // webhook unavailable or timed out — fall back to KV
      } finally {
        clearTimeout(timeoutId);
      }
    }

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

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Your message has been sent. We will get back to you soon!',
        stored: sheetStored || kvStored,
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
