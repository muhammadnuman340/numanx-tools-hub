export function playPing() {
  try {
    const a = new (window.AudioContext || (window as any).webkitAudioContext)();
    const o = a.createOscillator();
    const g = a.createGain();
    o.connect(g);
    g.connect(a.destination);
    o.frequency.value = 800;
    g.gain.setValueAtTime(0.08, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + 0.12);
    o.start();
    o.stop(a.currentTime + 0.12);
  } catch {}
}

export function showToast(message: string, variant: 'success' | 'error' | 'info' | 'warning' = 'success') {
  if ((window as any).__showToast) {
    (window as any).__showToast({ message, variant });
  }
}

const USAGE_KEY = 'nt_tool_usage';

export function trackToolUsage(slug: string): number {
  try {
    const u = JSON.parse(localStorage.getItem(USAGE_KEY) || '{}');
    u[slug] = (u[slug] || 0) + 1;
    localStorage.setItem(USAGE_KEY, JSON.stringify(u));
    return u[slug];
  } catch {
    return 0;
  }
}

export function getToolUsage(slug: string): number {
  try {
    const u = JSON.parse(localStorage.getItem(USAGE_KEY) || '{}');
    return u[slug] || 0;
  } catch {
    return 0;
  }
}

export function updateUsageBadge(slug: string, badgeEl: HTMLElement | null) {
  const count = trackToolUsage(slug);
  if (badgeEl && count > 1) {
    badgeEl.textContent = `Used ${count}×`;
  }
}

export function setupCopyButton(
  btn: HTMLElement,
  getText: () => string,
  options?: { labelEl?: HTMLElement; feedbackText?: string; showToast?: boolean; playSound?: boolean },
) {
  btn.addEventListener('click', async () => {
    const text = getText();
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      if (options?.labelEl) {
        const orig = options.labelEl.textContent;
        options.labelEl.textContent = options?.feedbackText || 'Copied!';
        setTimeout(() => {
          if (options?.labelEl) options.labelEl.textContent = orig;
        }, 2000);
      }
      if (options?.showToast !== false) showToast('Copied to clipboard', 'success');
      if (options?.playSound !== false) playPing();
    } catch {}
  });
}

export function setupDraftAutoSave(
  slug: string,
  fieldIds: string[],
  onRestore?: (data: Record<string, string>) => void,
) {
  const KEY = `nt_draft_${slug}`;

  function collect(): Record<string, string> {
    const data: Record<string, string> = {};
    fieldIds.forEach((id) => {
      const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
      if (el) data[id] = el.value;
    });
    return data;
  }

  function restore() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      fieldIds.forEach((id) => {
        const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
        if (el && data[id] !== undefined) el.value = data[id];
      });
      if (onRestore) onRestore(data);
    } catch {}
  }

  let timer: ReturnType<typeof setTimeout>;
  fieldIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
          try {
            localStorage.setItem(KEY, JSON.stringify(collect()));
          } catch {}
        }, 500);
      });
    }
  });

  return { restore, collect };
}

export function setupFullscreenToggle(btn: HTMLElement, container: HTMLElement) {
  btn.addEventListener('click', () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
      btn.textContent = '⛶';
    } else {
      container.requestFullscreen?.() || (container as any).webkitRequestFullscreen?.();
      btn.textContent = '✕';
    }
  });
  document.addEventListener('fullscreenchange', () => {
    btn.textContent = document.fullscreenElement ? '✕' : '⛶';
  });
}

export function clearAllInputs(ids: string[]) {
  ids.forEach((id) => {
    const el = document.getElementById(id) as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement | null;
    if (el) el.value = '';
  });
}

export function getValue(id: string): string {
  const el = document.getElementById(id) as HTMLInputElement | null;
  return el?.value || '';
}

export function setValue(id: string, val: string) {
  const el = document.getElementById(id) as HTMLInputElement | null;
  if (el) el.value = val;
}
