import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import {
  loadAnalytics,
  setupAnalyticsConsent,
  revokeAnalytics,
  clearGaCookies,
  disableGaTracking,
  enableGaTracking,
  getAnalyticsState,
  resetAnalyticsState,
  type AnalyticsConfig,
} from '../analyticsConsent';
import {
  setConsent,
  resetConsent,
  CONSENT_STORAGE_KEY,
  CONSENT_CHANGE_EVENT,
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

interface MockScriptElement {
  tagName: 'SCRIPT';
  src: string;
  id: string;
  async: boolean;
}

describe('Central Analytics Consent Loader (Phase 5C.2C)', () => {
  let mockStorage: MockStorage;
  let injectedScripts: MockScriptElement[];
  let eventListeners: Record<string, ((event: any) => void)[]>;
  let mockDocument: any;
  let mockWindow: any;

  beforeEach(() => {
    resetAnalyticsState();
    mockStorage = new MockStorage();
    injectedScripts = [];
    eventListeners = {};

    mockDocument = {
      head: {
        appendChild: (el: MockScriptElement) => {
          injectedScripts.push(el);
          return el;
        },
      },
      createElement: (tag: string) => {
        if (tag.toLowerCase() === 'script') {
          return { tagName: 'SCRIPT', src: '', id: '', async: false };
        }
        return {};
      },
      getElementById: (id: string) => {
        return injectedScripts.find((s) => s.id === id) || null;
      },
      querySelector: (selector: string) => {
        const match = selector.match(/src="([^"]+)"/);
        if (match) {
          const src = match[1];
          return injectedScripts.find((s) => s.src === src) || null;
        }
        return null;
      },
      cookie: '',
      addEventListener: (type: string, handler: (e: any) => void) => {
        eventListeners[type] = eventListeners[type] || [];
        eventListeners[type].push(handler);
      },
    };

    mockWindow = {
      dataLayer: undefined,
      addEventListener: (type: string, handler: (e: any) => void) => {
        eventListeners[type] = eventListeners[type] || [];
        eventListeners[type].push(handler);
      },
      dispatchEvent: (event: CustomEvent) => {
        const handlers = eventListeners[event.type] || [];
        for (const handler of handlers) {
          handler(event);
        }
        return true;
      },
      location: { hostname: 'numanx-tools.pages.dev', pathname: '/' },
    };

    (globalThis as any).window = mockWindow;
    (globalThis as any).document = mockDocument;
  });

  afterEach(() => {
    resetAnalyticsState();
    delete (globalThis as any).window;
    delete (globalThis as any).document;
    vi.restoreAllMocks();
  });

  const testConfig: AnalyticsConfig = {
    gaId: 'G-TEST12345',
    gtmId: 'GTM-TEST999',
  };

  describe('Strict Prior Consent Gating', () => {
    it('denies analytics loader when consent is unrecorded (null)', () => {
      expect(mockStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
      const loaded = loadAnalytics(testConfig, mockStorage);

      expect(loaded).toBe(false);
      expect(injectedScripts.length).toBe(0);
      expect(mockWindow.dataLayer).toBeUndefined();
      expect(getAnalyticsState().loaded).toBe(false);
    });

    it('denies analytics loader when consent is explicitly "essential"', () => {
      setConsent('essential', mockStorage);
      const loaded = loadAnalytics(testConfig, mockStorage);

      expect(loaded).toBe(false);
      expect(injectedScripts.length).toBe(0);
      expect(mockWindow.dataLayer).toBeUndefined();
      expect(getAnalyticsState().loaded).toBe(false);
    });

    it('permits analytics loader when consent is explicitly "accepted"', () => {
      setConsent('accepted', mockStorage);
      const loaded = loadAnalytics(testConfig, mockStorage);

      expect(loaded).toBe(true);
      expect(injectedScripts.length).toBe(2);
      expect(injectedScripts.some((s) => s.src.includes('gtag/js?id=G-TEST12345'))).toBe(true);
      expect(injectedScripts.some((s) => s.src.includes('gtm.js?id=GTM-TEST999'))).toBe(true);
      expect(mockWindow.dataLayer).toBeDefined();
      expect(mockWindow.dataLayer.length).toBeGreaterThan(0);
      expect(getAnalyticsState().loaded).toBe(true);
      expect(getAnalyticsState().gaInitialized).toBe(true);
      expect(getAnalyticsState().gtmInitialized).toBe(true);
    });

    it('denies analytics loader when storage contains invalid/corrupted values', () => {
      mockStorage.setItem(CONSENT_STORAGE_KEY, 'corrupted_state');
      const loaded = loadAnalytics(testConfig, mockStorage);

      expect(loaded).toBe(false);
      expect(injectedScripts.length).toBe(0);
      expect(mockWindow.dataLayer).toBeUndefined();
    });

    it('denies analytics loader when storage throws an exception (e.g. private browsing)', () => {
      const throwingStorage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'> = {
        getItem: () => {
          throw new Error('SecurityError');
        },
        setItem: () => {},
        removeItem: () => {},
      };

      const loaded = loadAnalytics(testConfig, throwingStorage);
      expect(loaded).toBe(false);
      expect(injectedScripts.length).toBe(0);
    });
  });

  describe('Idempotency and Duplicate Protection', () => {
    it('does not duplicate script elements or dataLayer pushes when called repeatedly', () => {
      setConsent('accepted', mockStorage);

      // Call 1
      loadAnalytics(testConfig, mockStorage);
      const initialScriptCount = injectedScripts.length;
      const initialDataLayerCount = mockWindow.dataLayer.length;
      expect(initialScriptCount).toBe(2);

      // Call 2
      loadAnalytics(testConfig, mockStorage);
      expect(injectedScripts.length).toBe(initialScriptCount);
      expect(mockWindow.dataLayer.length).toBe(initialDataLayerCount);

      // Call 3
      loadAnalytics(testConfig, mockStorage);
      expect(injectedScripts.length).toBe(initialScriptCount);
    });

    it('handles independent gaId or gtmId configurations safely', () => {
      setConsent('accepted', mockStorage);

      // Only GA
      resetAnalyticsState();
      injectedScripts = [];
      mockWindow.dataLayer = undefined;
      loadAnalytics({ gaId: 'G-ONLYGA' }, mockStorage);
      expect(injectedScripts.length).toBe(1);
      expect(injectedScripts[0].src).toContain('gtag/js?id=G-ONLYGA');

      // Only GTM
      resetAnalyticsState();
      injectedScripts = [];
      mockWindow.dataLayer = undefined;
      loadAnalytics({ gtmId: 'GTM-ONLYGTM' }, mockStorage);
      expect(injectedScripts.length).toBe(1);
      expect(injectedScripts[0].src).toContain('gtm.js?id=GTM-ONLYGTM');
    });
  });

  describe('Dynamic Event Reactions (Same-Page Behavior)', () => {
    it('dynamically loads analytics when "numanx:consent-change" dispatches "accepted"', () => {
      // Start with unrecorded consent
      setupAnalyticsConsent(testConfig, mockStorage);
      expect(injectedScripts.length).toBe(0);
      expect(mockWindow.dataLayer).toBeUndefined();

      // User clicks "Accept All" -> dispatches accepted
      mockWindow.dispatchEvent(
        new CustomEvent(CONSENT_CHANGE_EVENT, { detail: { choice: 'accepted' } }),
      );

      // Update mock storage to match setConsent behavior
      setConsent('accepted', mockStorage);

      // Analytics should now be dynamically initialized without page reload
      expect(injectedScripts.length).toBe(2);
      expect(mockWindow.dataLayer).toBeDefined();
    });

    it('remains unloaded when "numanx:consent-change" dispatches "essential"', () => {
      setupAnalyticsConsent(testConfig, mockStorage);

      mockWindow.dispatchEvent(
        new CustomEvent(CONSENT_CHANGE_EVENT, { detail: { choice: 'essential' } }),
      );

      expect(injectedScripts.length).toBe(0);
      expect(mockWindow.dataLayer).toBeUndefined();
    });

    it('executes revocation and sets ga-disable when user revokes from accepted to essential', () => {
      setConsent('accepted', mockStorage);
      setupAnalyticsConsent(testConfig, mockStorage);
      expect(injectedScripts.length).toBe(2);

      // Set a mock GA cookie
      mockDocument.cookie = '_ga=GA1.1.123456789.1234567890; path=/';

      // Revoke via essential event
      setConsent('essential', mockStorage);
      mockWindow.dispatchEvent(
        new CustomEvent(CONSENT_CHANGE_EVENT, { detail: { choice: 'essential' } }),
      );

      expect(mockWindow['ga-disable-G-TEST12345']).toBe(true);
      // Verify cookie cleared
      expect(mockDocument.cookie).toContain('expires=Thu, 01 Jan 1970');
    });
  });

  describe('Cookie and Tracking Utilities', () => {
    it('sets and removes ga-disable flag via disableGaTracking / enableGaTracking', () => {
      disableGaTracking('G-99999');
      expect(mockWindow['ga-disable-G-99999']).toBe(true);

      enableGaTracking('G-99999');
      expect(mockWindow['ga-disable-G-99999']).toBeFalsy();
    });

    it('clears all standard GA cookies without touching unrelated cookies', () => {
      mockDocument.cookie = '_ga=123; _gid=456; session_id=abc; app_theme=dark';

      clearGaCookies();

      // Unrelated cookies should NOT be expired
      expect(mockDocument.cookie).not.toContain('session_id=;');
      expect(mockDocument.cookie).not.toContain('app_theme=;');
    });
  });
});
