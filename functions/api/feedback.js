export async function onRequest(context) {
  const { request, env } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
    });
  }

  try {
    const { rating, message, email, page } = await request.json();

    if (!rating || !message) {
      return new Response(JSON.stringify({ error: 'Rating and message are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const payload = {
      type: 'feedback',
      rating: parseInt(rating, 10),
      message: message.trim(),
      email: email ? email.toLowerCase().trim() : '',
      page: page || '',
      timestamp: new Date().toISOString(),
    };

    let sheetStored = false;
    const webhookUrl = env.FEEDBACK_WEBHOOK_URL;
    if (webhookUrl) {
      try {
        const resp = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
        sheetStored = resp.ok;
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
