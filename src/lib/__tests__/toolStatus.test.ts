import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { setToolStatus, setToolStatusSoon } from '../toolStatus';

// Minimal stand-in for the #tool-status live region
function fakeRegion() {
  return { dataset: {} as Record<string, string>, textContent: '' };
}

describe('toolStatus', () => {
  let region: ReturnType<typeof fakeRegion>;

  beforeEach(() => {
    vi.useFakeTimers();
    region = fakeRegion();
    vi.stubGlobal('document', { getElementById: (id: string) => (id === 'tool-status' ? region : null) });
    vi.stubGlobal('requestAnimationFrame', (cb: () => void) => setTimeout(cb, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it('sets the state and announces the message on the next frame', () => {
    setToolStatus('complete', 'Done.');
    expect(region.dataset.agentStatus).toBe('complete');
    expect(region.textContent).toBe('');
    vi.runAllTimers();
    expect(region.textContent).toBe('Done.');
  });

  it('records the state without speaking when no message is given', () => {
    region.textContent = 'Old message';
    setToolStatus('error');
    vi.runAllTimers();
    expect(region.dataset.agentStatus).toBe('error');
    expect(region.textContent).toBe('');
  });

  it('does nothing when the page has no status region', () => {
    vi.stubGlobal('document', { getElementById: () => null });
    expect(() => setToolStatus('complete', 'Done.')).not.toThrow();
  });

  it('setToolStatusSoon announces only the last message after typing pauses', () => {
    setToolStatusSoon('complete', '1 word.');
    vi.advanceTimersByTime(500);
    setToolStatusSoon('complete', '2 words.');
    vi.advanceTimersByTime(500);
    expect(region.textContent).toBe('');
    vi.advanceTimersByTime(500);
    vi.runAllTimers();
    expect(region.textContent).toBe('2 words.');
  });

  it('an immediate status cancels a pending debounced one', () => {
    setToolStatusSoon('complete', 'Preview updated.');
    setToolStatus('error', 'Invalid input.');
    vi.runAllTimers();
    expect(region.dataset.agentStatus).toBe('error');
    expect(region.textContent).toBe('Invalid input.');
  });
});
