/**
 * Tool status announcements (DESIGN.md §5.4).
 *
 * Every tool page has one visually hidden live region (rendered by ToolHeader):
 *   <div id="tool-status" role="status" aria-live="polite" data-agent-status="ready">
 * Tools call setToolStatus() so screen readers and browser agents learn when work
 * starts, finishes or fails, without relying on colour or animation.
 */
export type ToolState = 'ready' | 'processing' | 'complete' | 'error';

export function setToolStatus(state: ToolState, message = ''): void {
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
