/**
 * Sends a form submission to the Google Apps Script web app and says what happened.
 * Used by functions/api/contact.js, feedback.js and subscribe.js.
 *
 * reason values (safe to show in an API response; they never include the URL or secret):
 *   'not_configured'  the webhook URL variable is missing from this Cloudflare deployment
 *   'timeout'         the script took longer than timeoutMs (it may still finish and send email)
 *   'unreachable'     the request failed before any answer came back
 *   'http_<status>'   Google answered with an error status
 *   'not_json'        the answer wasn't the script's JSON (usually a Google sign-in or error page:
 *                     the web app isn't deployed with "Who has access: Anyone")
 *   'unauthorized'    the secret in Cloudflare doesn't match the one in Apps Script
 *   'script_error'    the script ran but reported an error
 */
export async function postToSheet(url, payload, secret, timeoutMs = 15000) {
  if (!url) return { ok: false, reason: 'not_configured' };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // The secret proves the request came from this site; the script never stores it
      body: JSON.stringify({ ...payload, secret: secret || '' }),
      signal: controller.signal,
      redirect: 'follow',
    });
    if (!resp.ok) return { ok: false, reason: `http_${resp.status}` };

    let out;
    try {
      out = await resp.json();
    } catch {
      return { ok: false, reason: 'not_json' };
    }
    // Apps Script answers 200 even on errors, so read its reply
    if (out && out.success === false) {
      return { ok: false, reason: out.error === 'Unauthorized' ? 'unauthorized' : 'script_error', data: out };
    }
    return { ok: true, reason: 'ok', data: out || {} };
  } catch (err) {
    return { ok: false, reason: err && err.name === 'AbortError' ? 'timeout' : 'unreachable' };
  } finally {
    clearTimeout(timer);
  }
}
