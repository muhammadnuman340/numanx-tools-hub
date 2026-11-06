/**
 * NumanX Tools Hub — /chat/ assistant replies and safe message rendering.
 */

export const FALLBACK_REPLY =
  'I can help with image format conversion, code utilities, cricket metrics and other NumanX tools. Try asking about one of those.';

/**
 * Returns a canned reply for the /chat/ prototype.
 * The reply never repeats the user's text back.
 */
export function getPrototypeResponse(input: string): string {
  const cleanInput = (typeof input === 'string' ? input : '').replace(/[\r\n]+/g, ' ').trim();
  const q = cleanInput.toLowerCase();

  if (/\b(hello|hi|hey)\b/.test(q)) {
    return 'Hello! I am your local NumanX Assistant. You can ask me about image format conversion, code utilities, cricket metrics, or platform features.';
  }
  if (q.includes('image') || q.includes('format') || q.includes('converter')) {
    return 'Our image engine supports JPG to PNG, PNG to JPG (with white background fill for transparency), PNG to WebP, and SVG to PNG, all running 100% locally on HTML5 Canvas.';
  }
  if (q.includes('tool') || q.includes('65')) {
    return 'NumanX Tools Hub features 65 client-side tools across 6 categories: Image Tools, Text & AI Tools, Creator Tools, Utility Tools, Cricket Tools, and Developer Tools.';
  }
  return FALLBACK_REPLY;
}

/**
 * Builds a chat message bubble with textContent, so message text is never parsed as HTML.
 */
export function createMessageBubble(
  doc: Document,
  messageText: string,
  timeStr: string,
  isUser: boolean
): HTMLElement {
  const bubble = doc.createElement('div');
  bubble.className = `flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`;

  const card = doc.createElement('div');
  card.className = `rounded-xl border p-4 text-xs leading-relaxed max-w-[85%] ${
    isUser ? 'border-amber-500/30 bg-amber-600/20 text-white' : 'border-card-crisp bg-[#1e1e1b] text-zinc-300'
  }`;

  const p = doc.createElement('p');
  p.textContent = messageText;
  card.appendChild(p);

  const timeSpan = doc.createElement('span');
  timeSpan.className = 'text-[9px] text-zinc-500 font-mono px-1';
  timeSpan.textContent = timeStr;

  bubble.appendChild(card);
  bubble.appendChild(timeSpan);
  return bubble;
}
