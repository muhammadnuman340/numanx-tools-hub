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
    let status = '';
    const webhookUrl = env.NEWSLETTER_WEBHOOK_URL || env.CONTACT_WEBHOOK_URL;
    if (webhookUrl) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);
      try {
        const resp = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: 'subscribe',
            email: normalizedEmail,
            site: new URL(request.url).hostname,
            timestamp: new Date().toISOString(),
            // Proves the request came from this site; never stored
            secret: env.WEBHOOK_SECRET || '',
          }),
          signal: controller.signal,
        });
        const out = await resp.json().catch(() => ({}));
        if (resp.ok && out.success !== false) status = out.status || 'saved';
      } catch (_) {
        // Webhook down or slow: fall back to KV below
      } finally {
        clearTimeout(timeoutId);
      }
    }

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
      return new Response(JSON.stringify({ error: 'Signup is not available right now. Please try again later.' }), {
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

    return new Response(JSON.stringify({ success: true, message, email: normalizedEmail }), {
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
