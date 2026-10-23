/**
 * Sensitive storage mitigation for Password Generator (Phase 5C.2A).
 * All password history is kept strictly in volatile memory.
 * No password values are ever written to localStorage, sessionStorage, cookies, or IndexedDB.
 */

export const LEGACY_PWD_HISTORY_KEY = 'pwd_history';
export const MAX_SESSION_PASSWORDS = 20;

/**
 * Idempotently and safely purges legacy plaintext password history from persistent browser storage.
 * Does not throw if storage is unavailable or restricted.
 */
export function purgeLegacyPasswordHistory(
  storage: Pick<Storage, 'removeItem' | 'getItem'> = typeof localStorage !== 'undefined' ? localStorage : ({} as any),
): boolean {
  try {
    if (storage && typeof storage.removeItem === 'function') {
      const hadKey = typeof storage.getItem === 'function' ? storage.getItem(LEGACY_PWD_HISTORY_KEY) !== null : false;
      storage.removeItem(LEGACY_PWD_HISTORY_KEY);
      return hadKey;
    }
  } catch {
    // Gracefully handle SecurityError (e.g., sandboxed iframes or private mode)
  }
  return false;
}

export interface SessionHistoryManager {
  add(password: string): string[];
  getAll(): string[];
  clear(): void;
  count(): number;
}

/**
 * Creates an in-memory-only password history manager for the current page session.
 * State is destroyed upon page navigation or reload.
 */
export function createSessionPasswordHistory(maxSize: number = MAX_SESSION_PASSWORDS): SessionHistoryManager {
  let sessionHistory: string[] = [];

  return {
    add(password: string): string[] {
      if (!password || typeof password !== 'string') return [...sessionHistory];
      // Deduplicate and push to front
      sessionHistory = [password, ...sessionHistory.filter((p) => p !== password)].slice(0, maxSize);
      return [...sessionHistory];
    },

    getAll(): string[] {
      return [...sessionHistory];
    },

    clear(): void {
      sessionHistory = [];
    },

    count(): number {
      return sessionHistory.length;
    },
  };
}
