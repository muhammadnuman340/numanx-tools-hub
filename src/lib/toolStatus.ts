/**
 * Tool status announcements (DESIGN.md §5.4).
 *
 * Every tool page has one visually hidden live region (rendered by ToolHeader):
 *   <div id="tool-status" role="status" aria-live="polite" data-agent-status="ready">
 * Tools call setToolStatus() so screen readers and browser agents learn when work
 * starts, finishes or fails, without relying on colour or animation.
 */
export type ToolState = 'ready' | 'processing' | 'complete' | 'error';

let pending: ReturnType<typeof setTimeout> | undefined;

export function setToolStatus(state: ToolState, message = ''): void {
  clearTimeout(pending);
  const el = document.getElementById('tool-status');
  if (!el) return;
  el.dataset.agentStatus = state;
  // Clear first so repeating the same message is still announced
  el.textContent = '';
  if (message) {
    requestAnimationFrame(() => {
      el.textContent = message;
    });
  }
}

/**
 * For tools that recalculate on every keystroke: announce only once the visitor
 * pauses typing, so screen readers aren't interrupted on each character.
 */
export function setToolStatusSoon(state: ToolState, message = '', delay = 900): void {
  clearTimeout(pending);
  pending = setTimeout(() => setToolStatus(state, message), delay);
}
