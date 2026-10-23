/**
 * NumanX Tools Hub — Canonical Consent Engine (Phase 5C.2B)
 *
 * Centralized, framework-independent, and browser-safe consent management.
 * Enforces privacy-safe defaults: unknown or unrecorded consent is always treated as denied.
 *
 * NOTE: This engine manages the consent state and lifecycle. Third-party integrations
 * (GA4, GTM, AdSense) will be gated against this engine in Phase 5C.2C and 5C.2D.
 */

export type ConsentChoice = 'accepted' | 'essential' | null;

export const CONSENT_STORAGE_KEY = 'nx_cookie_consent';
export const CONSENT_CHANGE_EVENT = 'numanx:consent-change';
export const OPEN_SETTINGS_EVENT = 'numanx:open-cookie-settings';

export interface ConsentChangeEventDetail {
  choice: 'accepted' | 'essential';
}

/**
 * Safely resolves the storage provider without throwing in restricted environments
 * (e.g., SSR, sandboxed iframes, private browsing mode).
 */
function getStorage(customStorage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>): Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> | null {
  if (customStorage) return customStorage;
  try {
    if (typeof localStorage !== 'undefined' && localStorage) {
      return localStorage;
    }
  } catch {
    // Access denied (e.g., SecurityError in private browsing)
  }
  return null;
}

/**
 * Retrieves the canonical consent state.
 * Performs safe, idempotent legacy migration:
 *   'accepted' -> 'accepted'
 *   'declined' -> 'essential'
 *
 * Returns null if no valid decision exists or if storage fails.
 */
export function getConsent(
  customStorage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>,
): ConsentChoice {
  const storage = getStorage(customStorage);
  if (!storage) return null;

  try {
    const raw = storage.getItem(CONSENT_STORAGE_KEY);
    if (!raw) return null;

    if (raw === 'accepted') {
      return 'accepted';
    }

    if (raw === 'essential') {
      return 'essential';
    }

    // Legacy migration: 'declined' was used in earlier builds as an informational marker.
    // Migrate to canonical 'essential' without silently granting consent.
    if (raw === 'declined') {
      try {
        storage.setItem(CONSENT_STORAGE_KEY, 'essential');
      } catch {
        // Storage write failed, but return privacy-safe 'essential'
      }
      return 'essential';
    }

    // Invalid or corrupted stored value: treat as null (privacy-safe denied)
    return null;
  } catch {
    return null;
  }
}

/**
 * Persists the user's explicit consent decision and dispatches the consent change event.
 * Only 'accepted' or 'essential' may be recorded.
 */
export function setConsent(
  choice: 'accepted' | 'essential',
  customStorage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>,
): void {
  if (choice !== 'accepted' && choice !== 'essential') {
    return;
  }

  const storage = getStorage(customStorage);
  if (storage) {
    try {
      storage.setItem(CONSENT_STORAGE_KEY, choice);
    } catch {
      // Storage unavailable or quota exceeded; proceed to dispatch event in-memory
    }
  }

  dispatchConsentChange(choice);
}

/**
 * Determines whether a conscious consent decision has been recorded.
 */
export function hasConsentDecision(
  customStorage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>,
): boolean {
  return getConsent(customStorage) !== null;
}

/**
 * Checks if optional tracking (analytics, ads) is permitted.
 * MANDATORY PRIVACY-SAFE DEFAULT:
 * Unknown consent (null), essential-only consent, invalid states, or storage errors
 * all return FALSE.
 */
export function allowsOptionalTracking(
  customStorage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>,
): boolean {
  return getConsent(customStorage) === 'accepted';
}

/**
 * Resets the consent state to unrecorded (null).
 * Primarily used for testing, reset flows, and compliance validation.
 */
export function resetConsent(
  customStorage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>,
): void {
  const storage = getStorage(customStorage);
  if (storage) {
    try {
      storage.removeItem(CONSENT_STORAGE_KEY);
    } catch {
      // Ignore storage errors on removal
    }
  }
}

/**
 * Dispatches a lightweight, privacy-safe browser event notifying subscribers of a consent update.
 * Detail contains strictly the choice ('accepted' | 'essential') and zero user or device data.
 */
function dispatchConsentChange(choice: 'accepted' | 'essential'): void {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    try {
      const event = new CustomEvent<ConsentChangeEventDetail>(CONSENT_CHANGE_EVENT, {
        detail: { choice },
      });
      window.dispatchEvent(event);
    } catch {
      // Handle legacy or restricted environments where CustomEvent might fail
    }
  }
}

/**
 * Dispatches an event requesting the UI to reopen the Cookie Settings modal/banner.
 */
export function openCookieSettings(): void {
  if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
    try {
      window.dispatchEvent(new CustomEvent(OPEN_SETTINGS_EVENT));
    } catch {}
  }
}
