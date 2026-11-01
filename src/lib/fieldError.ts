/**
 * Shows a short error under a form field, linked with aria-describedby so screen
 * readers read it with the field. The message element is created on first use.
 */
import { setToolStatus } from './toolStatus';

function messageEl(input: HTMLElement): HTMLElement {
  const id = `${input.id}-error`;
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('p');
    el.id = id;
    el.className = 'field-error mt-1.5 text-xs font-medium text-danger';
    el.hidden = true;
    input.insertAdjacentElement('afterend', el);
  }
  return el;
}

export function showFieldError(input: HTMLElement | null, message: string, announce = true): void {
  if (!input) return;
  const el = messageEl(input);
  el.textContent = message;
  el.hidden = false;
  input.setAttribute('aria-invalid', 'true');
  const describedBy = new Set((input.getAttribute('aria-describedby') || '').split(' ').filter(Boolean));
  describedBy.add(el.id);
  input.setAttribute('aria-describedby', [...describedBy].join(' '));
  if (announce) setToolStatus('error', message);
}

export function clearFieldError(input: HTMLElement | null): void {
  if (!input) return;
  input.removeAttribute('aria-invalid');
  const el = document.getElementById(`${input.id}-error`);
  if (el) {
    el.hidden = true;
    el.textContent = '';
  }
}

/**
 * Applies a parse result to a field: shows or clears its error.
 * Returns the parsed result so callers can write `const r = check(input, parse(...))`.
 */
export function checkField<T extends { ok: boolean; error?: string }>(
  input: HTMLElement | null,
  result: T,
  announce = true,
): T {
  if (result.ok) clearFieldError(input);
  else showFieldError(input, result.error || 'Check this value.', announce);
  return result;
}
