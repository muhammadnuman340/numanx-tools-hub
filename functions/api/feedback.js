export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
    });
  }

  try {
    const { rating, message, name, email, page } = await request.json();
    const stars = parseInt(rating, 10);
    const text = typeof message === 'string' ? message.trim() : '';
    const cleanEmail = typeof email === 'string' ? email.toLowerCase().trim() : '';

    if (!(stars >= 1 && stars <= 5) || !text) {
      return new Response(JSON.stringify({ error: 'Rating and message are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return new Response(JSON.stringify({ error: 'That email address looks incomplete.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const payload = {
      type: 'feedback',
      site: new URL(request.url).hostname,
      rating: stars,
      // Lengths match the form's maxlength, so a scripted request can't flood the sheet
      message: text.slice(0, 5000),
      name: typeof name === 'string' ? name.trim().slice(0, 80) : '',
      email: cleanEmail.slice(0, 254),
      page: typeof page === 'string' ? page.slice(0, 300) : '',
      timestamp: new Date().toISOString(),
    };

    let sheetStored = false;
    const webhookUrl = env.FEEDBACK_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const resp = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          // The secret proves the request came from this site; it is never stored
          body: JSON.stringify({ ...payload, secret: env.WEBHOOK_SECRET || '' }),
        });
        // Apps Script answers 200 even on errors, so read its reply
        const out = await resp.json().catch(() => ({}));
        sheetStored = resp.ok && out.success !== false;
      } catch (_) {}
    }

    let kvStored = false;
    try {
      if (env.FEEDBACK_KV) {
        const key = `feedback_${Date.now()}`;
        await env.FEEDBACK_KV.put(key, JSON.stringify(payload));
        kvStored = true;
      }
    } catch (_) {}

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Thank you for your feedback!',
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
