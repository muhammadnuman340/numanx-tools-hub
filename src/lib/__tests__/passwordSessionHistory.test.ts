import { describe, it, expect, beforeEach } from 'vitest';
import {
  LEGACY_PWD_HISTORY_KEY,
  MAX_SESSION_PASSWORDS,
  purgeLegacyPasswordHistory,
  createSessionPasswordHistory,
} from '../passwordSessionHistory';

const createStorageMock = (initialStore: Record<string, string> = {}) => {
  let store: Record<string, string> = { ...initialStore };
  return {
    getItem: (key: string) => store[key] ?? null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    getStore: () => ({ ...store }),
  };
};

describe('passwordSessionHistory', () => {
  describe('purgeLegacyPasswordHistory', () => {
    it('purges legacy pwd_history key when present', () => {
      const storage = createStorageMock({
        [LEGACY_PWD_HISTORY_KEY]: JSON.stringify(['old-password-1', 'old-password-2']),
        theme: 'dark',
        nt_tool_usage: '{"password-generator":3}',
      });

      const purged = purgeLegacyPasswordHistory(storage as any);
      expect(purged).toBe(true);
      expect(storage.getItem(LEGACY_PWD_HISTORY_KEY)).toBeNull();

      // Ensure unrelated keys remain intact
      expect(storage.getItem('theme')).toBe('dark');
      expect(storage.getItem('nt_tool_usage')).toBe('{"password-generator":3}');
    });

    it('is idempotent and returns false when pwd_history does not exist', () => {
      const storage = createStorageMock({
        theme: 'dark',
      });

      const purged = purgeLegacyPasswordHistory(storage as any);
      expect(purged).toBe(false);
      expect(storage.getItem(LEGACY_PWD_HISTORY_KEY)).toBeNull();
      expect(storage.getItem('theme')).toBe('dark');
    });

    it('safely handles throwing or broken storage', () => {
      const brokenStorage = {
        getItem: () => {
          throw new Error('SecurityError: Access Denied');
        },
        removeItem: () => {
          throw new Error('SecurityError: Access Denied');
        },
      };

      expect(() => purgeLegacyPasswordHistory(brokenStorage as any)).not.toThrow();
      expect(purgeLegacyPasswordHistory(brokenStorage as any)).toBe(false);
    });
  });

  describe('createSessionPasswordHistory', () => {
    let storage: ReturnType<typeof createStorageMock>;

    beforeEach(() => {
      storage = createStorageMock();
    });

    it('starts with an empty session history', () => {
      const manager = createSessionPasswordHistory();
      expect(manager.getAll()).toEqual([]);
      expect(manager.count()).toBe(0);
    });

    it('adds generated passwords to in-memory history without using storage', () => {
      const manager = createSessionPasswordHistory();
      manager.add('SecretPass123!');
      manager.add('AnotherStrongP@ss456');

      expect(manager.getAll()).toEqual(['AnotherStrongP@ss456', 'SecretPass123!']);
      expect(manager.count()).toBe(2);

      // Verify ZERO writes occurred to storage
      expect(storage.getStore()).toEqual({});
    });

    it('deduplicates passwords and brings existing password to the front', () => {
      const manager = createSessionPasswordHistory();
      manager.add('Alpha1!');
      manager.add('Beta2@');
      manager.add('Gamma3#');
      manager.add('Alpha1!');

      expect(manager.getAll()).toEqual(['Alpha1!', 'Gamma3#', 'Beta2@']);
      expect(manager.count()).toBe(3);
    });

    it('respects maximum session history size cap (20)', () => {
      const manager = createSessionPasswordHistory(MAX_SESSION_PASSWORDS);
      for (let i = 1; i <= 25; i++) {
        manager.add(`Pass_${i}`);
      }

      const all = manager.getAll();
      expect(all.length).toBe(MAX_SESSION_PASSWORDS);
      expect(all[0]).toBe('Pass_25');
      expect(all[19]).toBe('Pass_6');
      expect(manager.count()).toBe(20);
    });

    it('clears in-memory session history cleanly', () => {
      const manager = createSessionPasswordHistory();
      manager.add('Pass1');
      manager.add('Pass2');
      expect(manager.count()).toBe(2);

      manager.clear();
      expect(manager.getAll()).toEqual([]);
      expect(manager.count()).toBe(0);
    });

    it('returns a shallow copy to prevent external mutation of internal array', () => {
      const manager = createSessionPasswordHistory();
      manager.add('Original');

      const copy = manager.getAll();
      copy.push('Mutated');

      expect(manager.getAll()).toEqual(['Original']);
      expect(manager.count()).toBe(1);
    });
  });
});
