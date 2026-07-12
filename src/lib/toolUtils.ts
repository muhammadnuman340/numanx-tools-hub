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

const THEME_COLORS = ['purple', 'blue', 'green', 'pink', 'orange'];

const THEME_SWATCH_HTML = (colors: string[]) =>
  colors
    .map(
      (c) =>
        `<button class="theme-swatch w-3.5 h-3.5 rounded-full border border-surface" data-color="${c}" style="background:var(--swatch-${c})"></button>`,
    )
    .join('');

export function getThemeSwatchesHTML(): string {
  return THEME_SWATCH_HTML(THEME_COLORS);
}

export function setupThemeSwatches(
  container: HTMLElement | string | NodeList | NodeListOf<Element>,
  storageKey = 'nt_theme',
) {
  let parent: HTMLElement | null = null;
  if (typeof container === 'string') {
    parent = document.querySelector(container);
  } else if (container instanceof NodeList) {
    // Legacy: old code passed querySelectorAll result directly — use the first swatch's parent
    const first = container[0] as HTMLElement;
    parent = first?.parentElement || null;
  } else {
    parent = container;
  }
  if (!parent) return;

  parent.querySelectorAll('.theme-swatch').forEach((s) => {
    s.addEventListener('click', () => {
      const c = (s as HTMLElement).dataset.color;
      if (!c) return;
      document.querySelectorAll('[class*="purple"]').forEach((el) => {
        el.className = el.className.replace(
          /(?<=^|[\s:])(bg|text|border|from|to|ring|shadow|hover:bg|hover:border|placeholder|decoration|outline|divide|accent)-purple-(\d+)(?:\/\d+)?(?=\s|$)/g,
          (_, p1, p2) => `${p1}${c}-${p2}`,
        );
      });
      try {
        localStorage.setItem(storageKey, c!);
      } catch {}
    });
  });

  try {
    const c = localStorage.getItem(storageKey);
    if (c) {
      const swatch = parent.querySelector(`.theme-swatch[data-color="${c}"]`) as HTMLElement;
      if (swatch) swatch.click();
    }
  } catch {}
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
