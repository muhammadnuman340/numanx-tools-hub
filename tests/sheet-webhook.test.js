// FILE: tests/sheet-webhook.test.js
import { describe, it, expect, afterEach, vi } from 'vitest';
import { postToSheet } from '../src/lib/sheetWebhook.js';

const reply = (body, { ok = true, status = 200, badJson = false } = {}) =>
  vi.fn(async () => ({ ok, status, json: async () => (badJson ? Promise.reject(new SyntaxError('html')) : body) }));

describe('postToSheet (form delivery to Google Apps Script)', () => {
  afterEach(() => vi.unstubAllGlobals());

  it('reports not_configured when the URL variable is missing', async () => {
    expect(await postToSheet('', {}, 's')).toEqual({ ok: false, reason: 'not_configured' });
  });

  it('sends the secret with the payload and reports ok', async () => {
    const fetch = reply({ success: true, status: 'confirmation-sent' });
    vi.stubGlobal('fetch', fetch);
    const r = await postToSheet('https://x.test', { type: 'contact' }, 'sec');
    expect(r.ok).toBe(true);
    expect(r.data.status).toBe('confirmation-sent');
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toEqual({ type: 'contact', secret: 'sec' });
  });

  it('tells a wrong secret apart from other script errors', async () => {
    vi.stubGlobal('fetch', reply({ success: false, error: 'Unauthorized' }));
    expect((await postToSheet('https://x.test', {}, 's')).reason).toBe('unauthorized');
    vi.stubGlobal('fetch', reply({ success: false, error: 'TypeError' }));
    expect((await postToSheet('https://x.test', {}, 's')).reason).toBe('script_error');
  });

  it('flags a non-JSON answer (web app not open to "Anyone") and HTTP errors', async () => {
    vi.stubGlobal('fetch', reply(null, { badJson: true }));
    expect((await postToSheet('https://x.test', {}, 's')).reason).toBe('not_json');
    vi.stubGlobal('fetch', reply({}, { ok: false, status: 403 }));
    expect((await postToSheet('https://x.test', {}, 's')).reason).toBe('http_403');
  });

  it('reports timeout and unreachable', async () => {
    vi.stubGlobal('fetch', (_u, opts) => new Promise((_, rej) => opts.signal.addEventListener('abort', () => rej(Object.assign(new Error('a'), { name: 'AbortError' })))));
    expect((await postToSheet('https://x.test', {}, 's', 20)).reason).toBe('timeout');
    vi.stubGlobal('fetch', async () => { throw new TypeError('network'); });
    expect((await postToSheet('https://x.test', {}, 's')).reason).toBe('unreachable');
  });
});
