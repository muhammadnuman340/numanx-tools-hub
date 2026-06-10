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
      name: name.trim(),
      email: email.toLowerCase().trim(),
      subject: subject || 'General',
      message: message.trim(),
      timestamp: new Date().toISOString(),
    };

    // Forward to Google Sheets webhook if configured
    let sheetStored = false;
    const webhookUrl = env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const resp = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        sheetStored = resp.ok;
      } catch (_) {
        // webhook unavailable — fall back to KV
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
