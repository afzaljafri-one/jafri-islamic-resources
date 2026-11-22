// ==============================================================================
// Multi-Tier Cache Layer (LocalStorage + IndexedDB)
// ==============================================================================

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl?: number; // Milliseconds. If undefined, permanent.
}

const DB_NAME = 'jafri_islamic_cache_v1';
const STORE_NAME = 'quran_store';

class CacheService {
  private isIndexedDBAvailable: boolean;
  private dbPromise: Promise<IDBDatabase | null> | null = null;

  constructor() {
    this.isIndexedDBAvailable = typeof window !== 'undefined' && 'indexedDB' in window;
    if (this.isIndexedDBAvailable) {
      this.initIndexedDB();
    }
  }

  // ----------------------------------------------------------------------------
  // LocalStorage Caching (TTL-based)
  // ----------------------------------------------------------------------------

  set<T>(key: string, data: T, ttlMs?: number): void {
    try {
      const item: CacheItem<T> = {
        data,
        timestamp: Date.now(),
        ttl: ttlMs,
      };
      localStorage.setItem(`jafri_${key}`, JSON.stringify(item));
    } catch {
      // Quota exceeded or private browsing
    }
  }

  get<T>(key: string): T | null {
    try {
      const raw = localStorage.getItem(`jafri_${key}`);
      if (!raw) return null;

      const item: CacheItem<T> = JSON.parse(raw);
      if (item.ttl && Date.now() - item.timestamp > item.ttl) {
        localStorage.removeItem(`jafri_${key}`);
        return null;
      }
      return item.data;
    } catch {
      return null;
    }
  }

  remove(key: string): void {
    try {
      localStorage.removeItem(`jafri_${key}`);
    } catch {
      // Ignore
    }
  }

  // ----------------------------------------------------------------------------
  // IndexedDB Caching (Large immutable Quranic text)
  // ----------------------------------------------------------------------------

  private initIndexedDB(): Promise<IDBDatabase | null> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve) => {
      try {
        const request = indexedDB.open(DB_NAME, 1);
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains(STORE_NAME)) {
            db.createObjectStore(STORE_NAME);
          }
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });

    return this.dbPromise;
  }

  async setIndexedDB<T>(key: string, data: T): Promise<void> {
    try {
      const db = await this.initIndexedDB();
      if (!db) {
        // Fallback to localStorage
        this.set(key, data);
        return;
      }

      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      store.put({ data, timestamp: Date.now() }, key);
    } catch {
      this.set(key, data);
    }
  }

  async getIndexedDB<T>(key: string): Promise<T | null> {
    try {
      const db = await this.initIndexedDB();
      if (!db) {
        return this.get<T>(key);
      }

      return new Promise((resolve) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(key);
        req.onsuccess = () => {
          if (req.result && req.result.data) {
            resolve(req.result.data);
          } else {
            resolve(null);
          }
        };
        req.onerror = () => resolve(null);
      });
    } catch {
      return this.get<T>(key);
    }
  }

  // ----------------------------------------------------------------------------
  // Inspection & Diagnostics
  // ----------------------------------------------------------------------------

  getLocalStorageStats(): { count: number; keys: string[] } {
    const keys: string[] = [];
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('jafri_')) {
          keys.push(k.replace('jafri_', ''));
        }
      }
    } catch {
      // Ignore
    }
    return { count: keys.length, keys };
  }

  async clearAll(): Promise<void> {
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (k && k.startsWith('jafri_')) {
          keysToRemove.push(k);
        }
      }
      keysToRemove.forEach((k) => localStorage.removeItem(k));

      const db = await this.initIndexedDB();
      if (db) {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).clear();
      }
    } catch {
      // Ignore
    }
  }
}

export const cacheService = new CacheService();
