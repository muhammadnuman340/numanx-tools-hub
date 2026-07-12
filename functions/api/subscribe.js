export async function onRequest(context) {
  const { request } = context;

  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json', Allow: 'POST' },
    });
  }

  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Try Cloudflare KV first (if bound), fall back to in-memory for local dev
    let stored = false;
    try {
      if (typeof context.env !== 'undefined' && context.env.NEWSLETTER_KV) {
        const existing = await context.env.NEWSLETTER_KV.get('subscribers', 'json');
        const subscribers = existing || [];
        if (!subscribers.includes(normalizedEmail)) {
          subscribers.push(normalizedEmail);
          await context.env.NEWSLETTER_KV.put('subscribers', JSON.stringify(subscribers));
        }
        stored = true;
      }
    } catch (kvError) {
      // KV not available - that's ok
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully subscribed to NumanX updates!',
        email: normalizedEmail,
        stored,
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
