/**
 * NumanX Tools Hub — Central Analytics Consent Loader (Phase 5C.2C)
 *
 * Implements strict prior-consent gating for Google Analytics 4 (GA4)
 * and Google Tag Manager (GTM).
 *
 * INVARIANT:
 * No analytics script tag, no dataLayer initialization, and no analytics network
 * request may occur until explicit 'accepted' consent is confirmed via allowsOptionalTracking().
 */

import { allowsOptionalTracking, CONSENT_CHANGE_EVENT, type ConsentChoice } from './consent';

export interface AnalyticsConfig {
  gaId?: string;
  gtmId?: string;
}

export interface AnalyticsState {
  loaded: boolean;
  gaInitialized: boolean;
  gtmInitialized: boolean;
  listenerBound: boolean;
}

// Module-level internal state
let state: AnalyticsState = {
  loaded: false,
  gaInitialized: false,
  gtmInitialized: false,
  listenerBound: false,
};

/**
 * Returns a snapshot of current analytics loading state.
 */
export function getAnalyticsState(): Readonly<AnalyticsState> {
  return { ...state };
}

/**
 * Resets internal state (primarily for test isolation and clean-room validation).
 */
export function resetAnalyticsState(): void {
  state = {
    loaded: false,
    gaInitialized: false,
    gtmInitialized: false,
    listenerBound: false,
  };
  if (typeof window !== 'undefined') {
    delete (window as any).__nx_analytics_loaded;
    delete (window as any).__nx_analytics_listener_bound;
  }
}

/**
 * Safely removes known first-party Google Analytics cookies.
 * Targets _ga, _gid, _gat, and container-specific _ga_* / _gat_* cookies.
 * Does NOT delete unrelated first-party or application cookies.
 */
export function clearGaCookies(): void {
  if (typeof document === 'undefined') return;
  try {
    const rawCookies = document.cookie ? document.cookie.split(';') : [];
    const hostname = typeof location !== 'undefined' ? location.hostname : '';
    const domains = ['', hostname, '.' + hostname];
    const parts = hostname.split('.');
    if (parts.length > 2) {
      domains.push('.' + parts.slice(-2).join('.'));
    }
    const paths = ['/', typeof location !== 'undefined' ? location.pathname : '/'];

    for (const raw of rawCookies) {
      const name = raw.split('=')[0]?.trim();
      if (!name) continue;
      if (
        name === '_ga' ||
        name === '_gid' ||
        name === '_gat' ||
        name.startsWith('_ga_') ||
        name.startsWith('_gat_')
      ) {
        for (const domain of domains) {
          for (const path of paths) {
            const domainAttr = domain ? `; domain=${domain}` : '';
            document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${path}${domainAttr}; SameSite=Lax`;
          }
        }
      }
    }
  } catch {
    // Restricted environment (sandboxed iframe or disabled cookies)
  }
}

/**
 * Disables GA measurement in the active window via window['ga-disable-GA_ID'].
 */
export function disableGaTracking(gaId?: string): void {
  if (typeof window === 'undefined') return;
  if (gaId) {
    (window as any)[`ga-disable-${gaId}`] = true;
  }
}

/**
 * Enables GA measurement in the active window (removes ga-disable flag).
 */
export function enableGaTracking(gaId?: string): void {
  if (typeof window === 'undefined') return;
  if (gaId) {
    try {
      delete (window as any)[`ga-disable-${gaId}`];
    } catch {
      (window as any)[`ga-disable-${gaId}`] = false;
    }
  }
}

/**
 * Inserts a script element into document.head if document exists.
 */
function injectScript(src: string, id?: string): HTMLScriptElement | null {
  if (typeof document === 'undefined') return null;
  // Prevent duplicate script elements
  if (id && document.getElementById(id)) {
    return document.getElementById(id) as HTMLScriptElement;
  }
  const existing = document.querySelector(`script[src="${src}"]`);
  if (existing) return existing as HTMLScriptElement;

  const script = document.createElement('script');
  script.async = true;
  script.src = src;
  if (id) script.id = id;
  document.head.appendChild(script);
  return script;
}

/**
 * Loads GA4 and GTM scripts and initializes tracking.
 * STRICT ENFORCEMENT:
 * Evaluates allowsOptionalTracking(customStorage). If false, returns false immediately.
 * Idempotent: safe to call multiple times without duplicate script tags or initializations.
 */
export function loadAnalytics(
  config: AnalyticsConfig,
  customStorage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>,
): boolean {
  // 1. Strict prior consent verification
  if (!allowsOptionalTracking(customStorage)) {
    return false;
  }

  // 2. Idempotency check
  if (state.loaded || (typeof window !== 'undefined' && (window as any).__nx_analytics_loaded)) {
    return true;
  }

  const gaId = config.gaId?.trim();
  const gtmId = config.gtmId?.trim();

  // If no identifiers provided, mark loaded and return
  if (!gaId && !gtmId) {
    state.loaded = true;
    if (typeof window !== 'undefined') {
      (window as any).__nx_analytics_loaded = true;
    }
    return true;
  }

  if (typeof window !== 'undefined') {
    // 3. Initialize dataLayer only after consent is confirmed
    const win = window as any;
    win.dataLayer = win.dataLayer || [];

    // 4. Initialize GA4 if gaId is present
    if (gaId && !state.gaInitialized) {
      enableGaTracking(gaId);
      injectScript(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`, 'nx-ga-script');

      if (!win.gtag) {
        win.gtag = function () {
          win.dataLayer.push(arguments);
        };
      }
      win.gtag('js', new Date());
      win.gtag('config', gaId);
      state.gaInitialized = true;
    }

    // 5. Initialize GTM if gtmId is present
    if (gtmId && !state.gtmInitialized) {
      win.dataLayer.push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      injectScript(`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(gtmId)}`, 'nx-gtm-script');
      state.gtmInitialized = true;
    }

    win.__nx_analytics_loaded = true;
  }

  state.loaded = true;
  return true;
}

/**
 * Handles consent revocation (user switched from accepted to essential).
 * Prevents further tracking, sets ga-disable flags, and purges first-party GA cookies.
 */
export function revokeAnalytics(config?: AnalyticsConfig): void {
  disableGaTracking(config?.gaId);
  clearGaCookies();
  // We do not claim to magically unload already executed script code from browser memory,
  // but we prevent further execution, set ga-disable, and ensure no future scripts load.
}

/**
 * Sets up the central analytics consent listener and initial evaluation.
 * - If user already accepted consent, loads analytics immediately.
 * - Listens for 'numanx:consent-change' events to dynamically load or revoke analytics.
 * - Binds to 'astro:page-load' for SPA client navigation.
 */
export function setupAnalyticsConsent(
  config: AnalyticsConfig,
  customStorage?: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>,
): void {
  // Initial check on load
  if (allowsOptionalTracking(customStorage)) {
    loadAnalytics(config, customStorage);
  }

  // Ensure listener is only bound once per window lifecycle
  if (typeof window === 'undefined') return;
  const win = window as any;
  if (state.listenerBound || win.__nx_analytics_listener_bound) {
    return;
  }

  const onConsentChange = (event: Event) => {
    const customEvt = event as CustomEvent<{ choice?: ConsentChoice }>;
    const choice = customEvt?.detail?.choice;
    if (choice === 'accepted') {
      loadAnalytics(config, customStorage);
    } else if (choice === 'essential') {
      revokeAnalytics(config);
    }
  };

  window.addEventListener(CONSENT_CHANGE_EVENT, onConsentChange);

  // Re-verify on Astro ClientRouter page transitions
  if (typeof document !== 'undefined') {
    document.addEventListener('astro:page-load', () => {
      if (allowsOptionalTracking(customStorage)) {
        loadAnalytics(config, customStorage);
      }
    });
  }

  state.listenerBound = true;
  win.__nx_analytics_listener_bound = true;
}
