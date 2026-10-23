import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  getConsent,
  setConsent,
  hasConsentDecision,
  allowsOptionalTracking,
  resetConsent,
  openCookieSettings,
  CONSENT_STORAGE_KEY,
  CONSENT_CHANGE_EVENT,
  OPEN_SETTINGS_EVENT,
} from '../consent';

class MockStorage implements Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] ?? null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }
}

describe('Consent Engine (Phase 5C.2B)', () => {
  let mockStorage: MockStorage;

  beforeEach(() => {
    mockStorage = new MockStorage();
    vi.restoreAllMocks();
  });

  describe('Default Unrecorded State', () => {
    it('returns null when no consent has been recorded', () => {
      expect(getConsent(mockStorage)).toBeNull();
      expect(hasConsentDecision(mockStorage)).toBe(false);
    });

    it('defaults optional tracking permission to false (privacy-safe default)', () => {
      expect(allowsOptionalTracking(mockStorage)).toBe(false);
    });
  });

  describe('Explicit Decisions', () => {
    it('records and returns "accepted" consent', () => {
      setConsent('accepted', mockStorage);
      expect(mockStorage.getItem(CONSENT_STORAGE_KEY)).toBe('accepted');
      expect(getConsent(mockStorage)).toBe('accepted');
      expect(hasConsentDecision(mockStorage)).toBe(true);
      expect(allowsOptionalTracking(mockStorage)).toBe(true);
    });

    it('records and returns "essential" consent', () => {
      setConsent('essential', mockStorage);
      expect(mockStorage.getItem(CONSENT_STORAGE_KEY)).toBe('essential');
      expect(getConsent(mockStorage)).toBe('essential');
      expect(hasConsentDecision(mockStorage)).toBe(true);
      expect(allowsOptionalTracking(mockStorage)).toBe(false);
    });

    it('ignores invalid choice values in setConsent', () => {
      // @ts-expect-error testing invalid input
      setConsent('something-else', mockStorage);
      expect(getConsent(mockStorage)).toBeNull();
      expect(allowsOptionalTracking(mockStorage)).toBe(false);
    });
  });

  describe('Legacy Migration', () => {
    it('migrates legacy "declined" to canonical "essential" without granting consent', () => {
      mockStorage.setItem(CONSENT_STORAGE_KEY, 'declined');

      const consent = getConsent(mockStorage);
      expect(consent).toBe('essential');
      expect(allowsOptionalTracking(mockStorage)).toBe(false);
      // Verify storage key was idempotently updated
      expect(mockStorage.getItem(CONSENT_STORAGE_KEY)).toBe('essential');
    });

    it('preserves legacy "accepted" as canonical "accepted"', () => {
      mockStorage.setItem(CONSENT_STORAGE_KEY, 'accepted');

      const consent = getConsent(mockStorage);
      expect(consent).toBe('accepted');
      expect(allowsOptionalTracking(mockStorage)).toBe(true);
    });

    it('handles legacy migration idempotently across multiple calls', () => {
      mockStorage.setItem(CONSENT_STORAGE_KEY, 'declined');

      expect(getConsent(mockStorage)).toBe('essential');
      expect(getConsent(mockStorage)).toBe('essential');
      expect(mockStorage.getItem(CONSENT_STORAGE_KEY)).toBe('essential');
    });
  });

  describe('Reset Behavior', () => {
    it('clears stored decision and resets to unrecorded state', () => {
      setConsent('accepted', mockStorage);
      expect(hasConsentDecision(mockStorage)).toBe(true);

      resetConsent(mockStorage);
      expect(getConsent(mockStorage)).toBeNull();
      expect(hasConsentDecision(mockStorage)).toBe(false);
      expect(allowsOptionalTracking(mockStorage)).toBe(false);
      expect(mockStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
    });
  });

  describe('Corrupted & Error Resilience', () => {
    it('treats invalid stored values as null (privacy-safe denied)', () => {
      mockStorage.setItem(CONSENT_STORAGE_KEY, 'corrupted_json_or_random_string');
      expect(getConsent(mockStorage)).toBeNull();
      expect(allowsOptionalTracking(mockStorage)).toBe(false);
    });

    it('treats empty string stored value as null', () => {
      mockStorage.setItem(CONSENT_STORAGE_KEY, '');
      expect(getConsent(mockStorage)).toBeNull();
      expect(allowsOptionalTracking(mockStorage)).toBe(false);
    });

    it('handles storage throwing errors gracefully (e.g., SecurityError in private browsing)', () => {
      const throwingStorage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> = {
        getItem: () => {
          throw new Error('SecurityError: Access is denied for this document');
        },
        setItem: () => {
          throw new Error('QuotaExceededError');
        },
        removeItem: () => {
          throw new Error('SecurityError');
        },
      };

      expect(getConsent(throwingStorage)).toBeNull();
      expect(hasConsentDecision(throwingStorage)).toBe(false);
      expect(allowsOptionalTracking(throwingStorage)).toBe(false);
      expect(() => setConsent('accepted', throwingStorage)).not.toThrow();
      expect(() => resetConsent(throwingStorage)).not.toThrow();
    });
  });

  describe('Browser Events', () => {
    let mockWindow: EventTarget & { dispatchEvent: (event: Event) => boolean };

    beforeEach(() => {
      mockWindow = new EventTarget() as any;
      (globalThis as any).window = mockWindow;
    });

    afterEach(() => {
      delete (globalThis as any).window;
    });

    it('dispatches numanx:consent-change with minimal payload on setConsent', () => {
      let dispatchedEvent: CustomEvent | null = null;
      const handler = (e: Event) => {
        dispatchedEvent = e as CustomEvent;
      };

      mockWindow.addEventListener(CONSENT_CHANGE_EVENT, handler);

      setConsent('accepted', mockStorage);

      expect(dispatchedEvent).not.toBeNull();
      expect(dispatchedEvent!.type).toBe(CONSENT_CHANGE_EVENT);
      expect(dispatchedEvent!.detail).toEqual({ choice: 'accepted' });
      // Verify no sensitive/extraneous data attached
      expect(Object.keys(dispatchedEvent!.detail)).toEqual(['choice']);

      setConsent('essential', mockStorage);
      expect(dispatchedEvent!.detail).toEqual({ choice: 'essential' });

      mockWindow.removeEventListener(CONSENT_CHANGE_EVENT, handler);
    });

    it('dispatches numanx:open-cookie-settings via openCookieSettings()', () => {
      let opened = false;
      const handler = () => {
        opened = true;
      };

      mockWindow.addEventListener(OPEN_SETTINGS_EVENT, handler);
      openCookieSettings();
      expect(opened).toBe(true);

      mockWindow.removeEventListener(OPEN_SETTINGS_EVENT, handler);
    });
  });
});
