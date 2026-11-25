// ==============================================================================
// Personal Library Service (IndexedDB + Safe LocalStorage Fallback)
// Handles Bookmarks, Multi-Religion Reading Positions, History & Progress
// Jafri Religious Books & Audio Platform — Phase 6.1
// ==============================================================================

import { ReligionId } from '../types/religion';
import {
  BookmarkRecord,
  ReadingPosition,
  ReadingHistoryEntry,
  ReadingProgressRecord,
  PersonalLibraryExport,
  PersonalLibraryState,
  ReadingPlan,
  ReadingPlanSession,
  ReadingPlanProgress,
} from '../types/personalLibrary';

const STORAGE_KEYS = {
  BOOKMARKS: 'jafri_lib_bookmarks_v1',
  POSITIONS: 'jafri_lib_positions_v1',
  GLOBAL_LAST_READ: 'jafri_lib_global_last_read_v1',
  HISTORY: 'jafri_lib_history_v1',
  PROGRESS: 'jafri_lib_progress_v1',
  PLANS: 'jafri_lib_plans_v1',
  SESSIONS: 'jafri_lib_sessions_v1',
  MIGRATED: 'jafri_lib_migrated_v1',
  LEGACY_ISLAM_BOOKMARKS: 'jafri_bookmarks',
  LEGACY_ISLAM_LAST_READ: 'jafri_last_read',
  LEGACY_PLATFORM_BOOKMARKS: 'jafri_platform_bookmarks_v1',
  LEGACY_PLATFORM_PROGRESS: 'jafri_platform_progress_v1',
} as const;

const DB_NAME = 'jafri_personal_library_v1';
const DB_VERSION = 2;

/**
 * Standard Scripture Scopes with Canonical Denominators
 */
export const CANONICAL_SCOPES: Record<
  string,
  {
    religion: ReligionId;
    scriptureId: string;
    scopeTitle: string;
    totalChaptersKnown: boolean;
    totalChapters: number | null;
  }
> = {
  'islam:quran': {
    religion: 'islam',
    scriptureId: 'quran',
    scopeTitle: 'The Holy Quran (114 Surahs)',
    totalChaptersKnown: true,
    totalChapters: 114,
  },
  'hinduism:gita': {
    religion: 'hinduism',
    scriptureId: 'gita',
    scopeTitle: 'Shrimad Bhagavad Gita (18 Chapters)',
    totalChaptersKnown: true,
    totalChapters: 18,
  },
  'hinduism:bhajans': {
    religion: 'hinduism',
    scriptureId: 'bhajans',
    scopeTitle: 'Sacred Bhajans, Aartis & Stotras (Curated)',
    totalChaptersKnown: false,
    totalChapters: null,
  },
  'christianity:bible': {
    religion: 'christianity',
    scriptureId: 'bible',
    scopeTitle: 'The Holy Bible (66 Canonical Books)',
    totalChaptersKnown: true,
    totalChapters: 66,
  },
  'judaism:tanakh': {
    religion: 'judaism',
    scriptureId: 'tanakh',
    scopeTitle: 'The Tanakh (24 Canonical Books)',
    totalChaptersKnown: true,
    totalChapters: 24,
  },
  'sikhism:sggs': {
    religion: 'sikhism',
    scriptureId: 'sggs',
    scopeTitle: 'Sri Guru Granth Sahib Ji (1,430 Angs)',
    totalChaptersKnown: true,
    totalChapters: 1430,
  },
  'buddhism:tipitaka': {
    religion: 'buddhism',
    scriptureId: 'tipitaka',
    scopeTitle: 'Pali Canon Suttas (Curated Discourse Collection)',
    totalChaptersKnown: false,
    totalChapters: null,
  },
  'jainism:tattvartha': {
    religion: 'jainism',
    scriptureId: 'tattvartha',
    scopeTitle: 'Tattvartha Sutra (10 Adhyayas)',
    totalChaptersKnown: true,
    totalChapters: 10,
  },
  'jainism:agamas': {
    religion: 'jainism',
    scriptureId: 'agamas',
    scopeTitle: 'Classical Jain Agamas & Canonical Hymns',
    totalChaptersKnown: false,
    totalChapters: null,
  },
};

class PersonalLibraryService {
  private dbPromise: Promise<IDBDatabase | null> | null = null;
  private listeners: Set<() => void> = new Set();
  private stateCache: PersonalLibraryState;

  constructor() {
    this.stateCache = {
      bookmarks: [],
      positions: {
        islam: null,
        hinduism: null,
        christianity: null,
        judaism: null,
        sikhism: null,
        buddhism: null,
        jainism: null,
      },
      globalLastRead: null,
      history: [],
      progress: {},
      plans: [],
      sessions: [],
      isLoading: true,
    };

    if (typeof window !== 'undefined') {
      // 1. Initial synchronous hydration from LocalStorage for instantaneous rendering
      this.hydrateFromLocalStorage();
      // 2. Asynchronous IndexedDB initialization & migration
      this.initIndexedDB();
    }
  }

  // ----------------------------------------------------------------------------
  // React State Subscriptions
  // ----------------------------------------------------------------------------
  subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => {
      try {
        listener();
      } catch (err) {
        console.error('[PersonalLibraryService] Listener error:', err);
      }
    });
  }

  getState(): PersonalLibraryState {
    return this.stateCache;
  }

  // ----------------------------------------------------------------------------
  // Storage Initialization & IndexedDB Setup
  // ----------------------------------------------------------------------------
  private async initIndexedDB(): Promise<IDBDatabase | null> {
    if (this.dbPromise) return this.dbPromise;

    if (typeof window === 'undefined' || !window.indexedDB) {
      this.dbPromise = Promise.resolve(null);
      this.runMigrations();
      this.stateCache.isLoading = false;
      this.notify();
      return null;
    }

    this.dbPromise = new Promise((resolve) => {
      try {
        const req = window.indexedDB.open(DB_NAME, DB_VERSION);

        req.onupgradeneeded = (e) => {
          const db = (e.target as IDBOpenDBRequest).result;
          if (!db.objectStoreNames.contains('bookmarks')) {
            const bmStore = db.createObjectStore('bookmarks', { keyPath: 'id' });
            bmStore.createIndex('religion', 'religion', { unique: false });
            bmStore.createIndex('timestamp', 'timestamp', { unique: false });
          }
          if (!db.objectStoreNames.contains('positions')) {
            db.createObjectStore('positions', { keyPath: 'religion' });
          }
          if (!db.objectStoreNames.contains('history')) {
            const hStore = db.createObjectStore('history', { keyPath: 'id' });
            hStore.createIndex('religion', 'religion', { unique: false });
            hStore.createIndex('timestamp', 'timestamp', { unique: false });
          }
          if (!db.objectStoreNames.contains('progress')) {
            db.createObjectStore('progress', { keyPath: 'key' });
          }
          if (!db.objectStoreNames.contains('plans')) {
            db.createObjectStore('plans', { keyPath: 'id' });
          }
          if (!db.objectStoreNames.contains('sessions')) {
            const sStore = db.createObjectStore('sessions', { keyPath: 'id' });
            sStore.createIndex('planId', 'planId', { unique: false });
            sStore.createIndex('date', 'date', { unique: false });
          }
        };

        req.onsuccess = () => {
          const db = req.result;
          this.runMigrations();
          this.loadFromIndexedDB(db);
          resolve(db);
        };

        req.onerror = () => {
          console.warn('[PersonalLibraryService] IndexedDB open error, using LocalStorage fallback');
          this.runMigrations();
          this.stateCache.isLoading = false;
          this.notify();
          resolve(null);
        };
      } catch (err) {
        console.warn('[PersonalLibraryService] IndexedDB unavailable, using LocalStorage fallback', err);
        this.runMigrations();
        this.stateCache.isLoading = false;
        this.notify();
        resolve(null);
      }
    });

    return this.dbPromise;
  }

  // ----------------------------------------------------------------------------
  // LocalStorage Synchronous Hydration & Sync
  // ----------------------------------------------------------------------------
  private hydrateFromLocalStorage() {
    try {
      // Bookmarks
      const bmRaw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      if (bmRaw) {
        this.stateCache.bookmarks = JSON.parse(bmRaw);
      }

      // Positions
      const posRaw = localStorage.getItem(STORAGE_KEYS.POSITIONS);
      if (posRaw) {
        this.stateCache.positions = {
          ...this.stateCache.positions,
          ...JSON.parse(posRaw),
        };
      }

      // Global last read
      const glrRaw = localStorage.getItem(STORAGE_KEYS.GLOBAL_LAST_READ);
      if (glrRaw) {
        this.stateCache.globalLastRead = JSON.parse(glrRaw);
      }

      // History
      const histRaw = localStorage.getItem(STORAGE_KEYS.HISTORY);
      if (histRaw) {
        this.stateCache.history = JSON.parse(histRaw);
      }

      // Progress
      const progRaw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      if (progRaw) {
        this.stateCache.progress = JSON.parse(progRaw);
      }

      // Plans (Phase 6.2)
      const plansRaw = localStorage.getItem(STORAGE_KEYS.PLANS);
      if (plansRaw) {
        this.stateCache.plans = JSON.parse(plansRaw);
      }

      // Sessions (Phase 6.2)
      const sessRaw = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (sessRaw) {
        this.stateCache.sessions = JSON.parse(sessRaw);
      }
    } catch (e) {
      console.warn('[PersonalLibraryService] LocalStorage hydration warning', e);
    }
  }

  private syncToLocalStorage() {
    try {
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(this.stateCache.bookmarks));
      localStorage.setItem(STORAGE_KEYS.POSITIONS, JSON.stringify(this.stateCache.positions));
      if (this.stateCache.globalLastRead) {
        localStorage.setItem(
          STORAGE_KEYS.GLOBAL_LAST_READ,
          JSON.stringify(this.stateCache.globalLastRead)
        );
      }
      localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(this.stateCache.history.slice(0, 100)));
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(this.stateCache.progress));
      localStorage.setItem(STORAGE_KEYS.PLANS, JSON.stringify(this.stateCache.plans));
      localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(this.stateCache.sessions));
    } catch {
      // Quota exceeded or storage restricted
    }
  }

  private async loadFromIndexedDB(db: IDBDatabase) {
    try {
      const stores = ['bookmarks', 'positions', 'history', 'progress'];
      if (db.objectStoreNames.contains('plans')) stores.push('plans');
      if (db.objectStoreNames.contains('sessions')) stores.push('sessions');

      const tx = db.transaction(stores, 'readonly');

      const bmReq = tx.objectStore('bookmarks').getAll();
      const posReq = tx.objectStore('positions').getAll();
      const histReq = tx.objectStore('history').getAll();
      const progReq = tx.objectStore('progress').getAll();
      const plansReq = db.objectStoreNames.contains('plans') ? tx.objectStore('plans').getAll() : null;
      const sessReq = db.objectStoreNames.contains('sessions') ? tx.objectStore('sessions').getAll() : null;

      tx.oncomplete = () => {
        if (bmReq.result && bmReq.result.length > 0) {
          this.stateCache.bookmarks = bmReq.result.sort((a, b) => b.timestamp - a.timestamp);
        }
        if (posReq.result && posReq.result.length > 0) {
          posReq.result.forEach((pos: any) => {
            if (pos.religion) {
              this.stateCache.positions[pos.religion as ReligionId] = pos;
            }
          });
        }
        if (histReq.result && histReq.result.length > 0) {
          this.stateCache.history = histReq.result.sort((a, b) => b.timestamp - a.timestamp).slice(0, 100);
        }
        if (progReq.result && progReq.result.length > 0) {
          progReq.result.forEach((item: any) => {
            if (item.key) {
              this.stateCache.progress[item.key] = item.record;
            }
          });
        }
        if (plansReq?.result && plansReq.result.length > 0) {
          this.stateCache.plans = plansReq.result;
        }
        if (sessReq?.result && sessReq.result.length > 0) {
          this.stateCache.sessions = sessReq.result;
        }
        this.syncToLocalStorage();
        this.stateCache.isLoading = false;
        this.notify();
      };
    } catch {
      this.stateCache.isLoading = false;
      this.notify();
    }
  }

  // ----------------------------------------------------------------------------
  // Migration of Existing Bookmarks & Historical Data
  // ----------------------------------------------------------------------------
  private runMigrations() {
    if (typeof window === 'undefined') return;

    try {
      const alreadyMigrated = localStorage.getItem(STORAGE_KEYS.MIGRATED);
      if (alreadyMigrated) return;

      let migratedBookmarksCount = 0;
      const newBookmarks: BookmarkRecord[] = [...this.stateCache.bookmarks];

      // 1. Migrate Islamic bookmarks from 'jafri_bookmarks'
      const legacyQuran = localStorage.getItem(STORAGE_KEYS.LEGACY_ISLAM_BOOKMARKS);
      if (legacyQuran) {
        try {
          const parsed = JSON.parse(legacyQuran);
          if (Array.isArray(parsed)) {
            parsed.forEach((item: any) => {
              const id = `isl:quran:${item.surahNumber}:${item.ayahNumber}`;
              if (!newBookmarks.some((b) => b.id === id)) {
                newBookmarks.push({
                  id,
                  religion: 'islam',
                  scriptureId: 'quran',
                  collectionId: 'holy-quran',
                  readingId: `surah-${item.surahNumber}`,
                  chapterNumber: item.surahNumber,
                  verseNumber: item.ayahNumber,
                  originalTextReference: item.arabicSnippet || '',
                  translationText: item.translationSnippet || '',
                  displayTitle: `Surah ${item.surahEnglishName || item.surahName || item.surahNumber} ${item.surahNumber}:${item.ayahNumber}`,
                  displaySubtitle: item.surahEnglishName ? `${item.surahName}` : undefined,
                  createdAt: new Date(item.timestamp || Date.now()).toISOString(),
                  timestamp: item.timestamp || Date.now(),
                });
                migratedBookmarksCount++;
              }
            });
          }
        } catch (e) {
          console.warn('[Migration] Error migrating legacy Quran bookmarks', e);
        }
      }

      // 2. Migrate legacy UniversalPlatform bookmarks from 'jafri_platform_bookmarks_v1'
      const legacyPlatform = localStorage.getItem(STORAGE_KEYS.LEGACY_PLATFORM_BOOKMARKS);
      if (legacyPlatform) {
        try {
          const parsed = JSON.parse(legacyPlatform);
          if (Array.isArray(parsed)) {
            parsed.forEach((item: any) => {
              const id = item.id || `migrated:${item.religionId}:${item.savedAtTimestamp}`;
              if (!newBookmarks.some((b) => b.id === id)) {
                const chPath = item.address?.path?.find((p: any) =>
                  ['Chapter', 'Book', 'Ang', 'Sutta', 'Section'].includes(p.levelName)
                );
                newBookmarks.push({
                  id,
                  religion: item.religionId,
                  scriptureId: item.collectionId || 'scripture',
                  collectionId: item.collectionId || 'collection',
                  readingId: item.collectionId || 'reading',
                  chapterNumber: chPath?.identifier || item.address?.unitIdentifier,
                  verseNumber: item.address?.unitIdentifier,
                  originalTextReference: item.snippetRootText || '',
                  translationText: item.snippetTranslatedText || '',
                  displayTitle: item.displayTitle || 'Saved Passage',
                  displaySubtitle: item.displaySubtitle,
                  createdAt: new Date(item.savedAtTimestamp || Date.now()).toISOString(),
                  timestamp: item.savedAtTimestamp || Date.now(),
                  userNotes: item.userNotes,
                });
                migratedBookmarksCount++;
              }
            });
          }
        } catch (e) {
          console.warn('[Migration] Error migrating legacy platform bookmarks', e);
        }
      }

      // 3. Migrate any religion-specific keys: 'jafri_bookmarks_${religion}'
      const religions: ReligionId[] = [
        'islam',
        'hinduism',
        'christianity',
        'judaism',
        'sikhism',
        'buddhism',
        'jainism',
      ];
      religions.forEach((rel) => {
        const raw = localStorage.getItem(`jafri_bookmarks_${rel}`);
        if (raw) {
          try {
            const list = JSON.parse(raw);
            if (Array.isArray(list)) {
              list.forEach((item: any) => {
                const id = item.id || `${rel}:migrated:${Date.now()}`;
                if (!newBookmarks.some((b) => b.id === id)) {
                  newBookmarks.push({
                    id,
                    religion: rel,
                    scriptureId: item.scriptureId || item.collectionId || 'scripture',
                    collectionId: item.collectionId || 'collection',
                    readingId: item.readingId || 'reading',
                    chapterNumber: item.chapterNumber || item.chapter,
                    verseNumber: item.verseNumber || item.verse,
                    originalTextReference: item.originalTextReference || item.originalText || '',
                    translationText: item.translationText || item.snippet || '',
                    displayTitle: item.displayTitle || `${rel} Bookmark`,
                    createdAt: new Date(item.timestamp || Date.now()).toISOString(),
                    timestamp: item.timestamp || Date.now(),
                  });
                  migratedBookmarksCount++;
                }
              });
            }
          } catch {
            // ignore
          }
        }
      });

      // 4. Migrate Islamic last read from 'jafri_last_read'
      const legacyLastRead = localStorage.getItem(STORAGE_KEYS.LEGACY_ISLAM_LAST_READ);
      if (legacyLastRead) {
        try {
          const lr = JSON.parse(legacyLastRead);
          if (lr && lr.surahNumber) {
            const pos: ReadingPosition = {
              religion: 'islam',
              scriptureId: 'quran',
              collectionId: 'holy-quran',
              readingId: `surah-${lr.surahNumber}`,
              chapterNumber: lr.surahNumber,
              verseNumber: lr.ayahNumber || 1,
              displayTitle: `Surah ${lr.surahEnglishName || lr.surahName || lr.surahNumber}`,
              displayLocation: `Surah ${lr.surahNumber}, Ayah ${lr.ayahNumber || 1}`,
              updatedAt: new Date(lr.timestamp || Date.now()).toISOString(),
              timestamp: lr.timestamp || Date.now(),
            };
            this.stateCache.positions.islam = pos;
            if (!this.stateCache.globalLastRead) {
              this.stateCache.globalLastRead = pos;
            }
          }
        } catch (e) {
          console.warn('[Migration] Error migrating legacy last read', e);
        }
      }

      this.stateCache.bookmarks = newBookmarks.sort((a, b) => b.timestamp - a.timestamp);
      this.syncToLocalStorage();
      localStorage.setItem(STORAGE_KEYS.MIGRATED, 'true');

      if (migratedBookmarksCount > 0) {
        console.log(`[PersonalLibraryService] Successfully migrated ${migratedBookmarksCount} legacy bookmarks.`);
      }
    } catch (e) {
      console.warn('[PersonalLibraryService] Migration execution error', e);
    }
  }

  // ----------------------------------------------------------------------------
  // Bookmarks API
  // ----------------------------------------------------------------------------
  getBookmarks(religion?: ReligionId): BookmarkRecord[] {
    if (!religion) return this.stateCache.bookmarks;
    return this.stateCache.bookmarks.filter((b) => b.religion === religion);
  }

  isBookmarked(id: string): boolean {
    return this.stateCache.bookmarks.some((b) => b.id === id);
  }

  addBookmark(bookmark: BookmarkRecord): boolean {
    try {
      const existing = this.stateCache.bookmarks.filter((b) => b.id !== bookmark.id);
      this.stateCache.bookmarks = [bookmark, ...existing];

      this.syncToLocalStorage();

      // Async write to IndexedDB
      this.initIndexedDB().then((db) => {
        if (!db) return;
        try {
          const tx = db.transaction('bookmarks', 'readwrite');
          tx.objectStore('bookmarks').put(bookmark);
        } catch {
          // Fallback handled
        }
      });

      this.notify();
      return true;
    } catch {
      return false;
    }
  }

  removeBookmark(id: string): boolean {
    try {
      this.stateCache.bookmarks = this.stateCache.bookmarks.filter((b) => b.id !== id);
      this.syncToLocalStorage();

      // Async delete from IndexedDB
      this.initIndexedDB().then((db) => {
        if (!db) return;
        try {
          const tx = db.transaction('bookmarks', 'readwrite');
          tx.objectStore('bookmarks').delete(id);
        } catch {
          // Fallback handled
        }
      });

      this.notify();
      return true;
    } catch {
      return false;
    }
  }

  clearBookmarks(religion?: ReligionId): boolean {
    try {
      if (!religion) {
        this.stateCache.bookmarks = [];
      } else {
        this.stateCache.bookmarks = this.stateCache.bookmarks.filter((b) => b.religion !== religion);
      }
      this.syncToLocalStorage();

      this.initIndexedDB().then((db) => {
        if (!db) return;
        try {
          const tx = db.transaction('bookmarks', 'readwrite');
          if (!religion) {
            tx.objectStore('bookmarks').clear();
          } else {
            // Delete matching
            const store = tx.objectStore('bookmarks');
            const req = store.getAll();
            req.onsuccess = () => {
              req.result.forEach((item: any) => {
                if (item.religion === religion) store.delete(item.id);
              });
            };
          }
        } catch {
          // Fallback handled
        }
      });

      this.notify();
      return true;
    } catch {
      return false;
    }
  }

  // ----------------------------------------------------------------------------
  // Continue Reading API (Multi-Religion Positions)
  // ----------------------------------------------------------------------------
  getReadingPosition(religion: ReligionId): ReadingPosition | null {
    return this.stateCache.positions[religion] || null;
  }

  getGlobalLastRead(): ReadingPosition | null {
    return this.stateCache.globalLastRead;
  }

  saveReadingPosition(pos: ReadingPosition): void {
    try {
      this.stateCache.positions[pos.religion] = pos;
      this.stateCache.globalLastRead = pos;
      this.syncToLocalStorage();

      this.initIndexedDB().then((db) => {
        if (!db) return;
        try {
          const tx = db.transaction('positions', 'readwrite');
          tx.objectStore('positions').put(pos);
        } catch {
          // Fallback handled
        }
      });

      // Also add to history log
      this.addReadingHistory({
        religion: pos.religion,
        scriptureId: pos.scriptureId,
        collectionId: pos.collectionId,
        readingId: pos.readingId,
        chapterNumber: pos.chapterNumber,
        verseNumber: pos.verseNumber,
        displayTitle: pos.displayTitle,
        displayLocation: pos.displayLocation,
      });

      this.notify();
    } catch (e) {
      console.warn('[PersonalLibraryService] saveReadingPosition error', e);
    }
  }

  // ----------------------------------------------------------------------------
  // Reading History API
  // ----------------------------------------------------------------------------
  getReadingHistory(religion?: ReligionId): ReadingHistoryEntry[] {
    if (!religion) return this.stateCache.history;
    return this.stateCache.history.filter((h) => h.religion === religion);
  }

  addReadingHistory(entry: Omit<ReadingHistoryEntry, 'id' | 'timestamp' | 'dateString'>): void {
    try {
      const now = Date.now();
      const id = `${entry.religion}:${entry.readingId}:${entry.chapterNumber}:${now}`;
      const fullEntry: ReadingHistoryEntry = {
        ...entry,
        id,
        timestamp: now,
        dateString: new Date(now).toLocaleString(),
      };

      // Filter out immediate identical duplicate within 1 minute
      const filtered = this.stateCache.history.filter((h) => {
        const isDuplicate =
          h.religion === entry.religion &&
          h.readingId === entry.readingId &&
          h.chapterNumber === entry.chapterNumber &&
          now - h.timestamp < 60000;
        return !isDuplicate;
      });

      this.stateCache.history = [fullEntry, ...filtered].slice(0, 100);
      this.syncToLocalStorage();

      this.initIndexedDB().then((db) => {
        if (!db) return;
        try {
          const tx = db.transaction('history', 'readwrite');
          tx.objectStore('history').put(fullEntry);
        } catch {
          // Fallback handled
        }
      });
    } catch {
      // ignore
    }
  }

  clearHistory(): void {
    this.stateCache.history = [];
    this.syncToLocalStorage();
    this.initIndexedDB().then((db) => {
      if (!db) return;
      try {
        const tx = db.transaction('history', 'readwrite');
        tx.objectStore('history').clear();
      } catch {
        // Fallback handled
      }
    });
    this.notify();
  }

  // ----------------------------------------------------------------------------
  // Reading Progress & Chapter Completion API
  // ----------------------------------------------------------------------------
  private getCompoundKey(religion: ReligionId, scriptureId: string): string {
    return `${religion}:${scriptureId}`;
  }

  getProgress(religion: ReligionId, scriptureId: string = 'main'): ReadingProgressRecord | null {
    const key = this.getCompoundKey(religion, scriptureId);
    if (this.stateCache.progress[key]) {
      return this.stateCache.progress[key];
    }

    // Default initialization based on canonical scope
    const canonical = CANONICAL_SCOPES[key] || {
      religion,
      scriptureId,
      scopeTitle: `${religion.toUpperCase()} Scripture Reading`,
      totalChaptersKnown: false,
      totalChapters: null,
    };

    const initialRecord: ReadingProgressRecord = {
      religion,
      scriptureId,
      collectionId: scriptureId,
      scopeTitle: canonical.scopeTitle,
      totalChaptersKnown: canonical.totalChaptersKnown,
      totalChapters: canonical.totalChapters,
      chaptersVisited: [],
      chaptersCompleted: [],
      chaptersDetail: {},
      lastReadingDate: new Date().toISOString(),
      progressPercentage: null,
    };

    return initialRecord;
  }

  getAllProgress(): Record<string, ReadingProgressRecord> {
    // Return all records augmented with canonical defaults if not yet started
    const result: Record<string, ReadingProgressRecord> = { ...this.stateCache.progress };
    Object.keys(CANONICAL_SCOPES).forEach((key) => {
      if (!result[key]) {
        const c = CANONICAL_SCOPES[key];
        result[key] = {
          religion: c.religion,
          scriptureId: c.scriptureId,
          collectionId: c.scriptureId,
          scopeTitle: c.scopeTitle,
          totalChaptersKnown: c.totalChaptersKnown,
          totalChapters: c.totalChapters,
          chaptersVisited: [],
          chaptersCompleted: [],
          chaptersDetail: {},
          lastReadingDate: new Date().toISOString(),
          progressPercentage: c.totalChaptersKnown ? 0 : null,
        };
      }
    });
    return result;
  }

  recordChapterVisited(
    religion: ReligionId,
    scriptureId: string,
    chapterId: string | number,
    chapterTitle?: string
  ): void {
    try {
      const key = this.getCompoundKey(religion, scriptureId);
      const current = this.getProgress(religion, scriptureId);
      if (!current) return;

      const visitedSet = new Set(current.chaptersVisited);
      visitedSet.add(chapterId);

      const chDetail = current.chaptersDetail[chapterId] || {
        chapterId,
        chapterTitle,
        visited: true,
        completed: false,
      };
      chDetail.visited = true;
      chDetail.lastVisitedAt = new Date().toISOString();
      if (chapterTitle) chDetail.chapterTitle = chapterTitle;

      current.chaptersVisited = Array.from(visitedSet);
      current.chaptersDetail[chapterId] = chDetail;
      current.lastReadingDate = new Date().toISOString();

      this.stateCache.progress[key] = current;
      this.syncToLocalStorage();

      this.initIndexedDB().then((db) => {
        if (!db) return;
        try {
          const tx = db.transaction('progress', 'readwrite');
          tx.objectStore('progress').put({ key, record: current });
        } catch {
          // Fallback handled
        }
      });

      this.notify();
    } catch (e) {
      console.warn('[PersonalLibraryService] recordChapterVisited error', e);
    }
  }

  toggleChapterCompleted(
    religion: ReligionId,
    scriptureId: string,
    chapterId: string | number,
    completed?: boolean
  ): void {
    try {
      const key = this.getCompoundKey(religion, scriptureId);
      const current = this.getProgress(religion, scriptureId);
      if (!current) return;

      const completedSet = new Set(current.chaptersCompleted);
      const chDetail = current.chaptersDetail[chapterId] || {
        chapterId,
        visited: true,
        completed: false,
      };

      const targetCompleted = completed !== undefined ? completed : !chDetail.completed;

      if (targetCompleted) {
        completedSet.add(chapterId);
        chDetail.completed = true;
        chDetail.completedAt = new Date().toISOString();
      } else {
        completedSet.delete(chapterId);
        chDetail.completed = false;
        delete chDetail.completedAt;
      }

      current.chaptersCompleted = Array.from(completedSet);
      current.chaptersDetail[chapterId] = chDetail;

      // Recalculate percentage where denominator is known
      if (current.totalChaptersKnown && current.totalChapters && current.totalChapters > 0) {
        current.progressPercentage = Math.round(
          (current.chaptersCompleted.length / current.totalChapters) * 100
        );
      } else {
        current.progressPercentage = null;
      }

      this.stateCache.progress[key] = current;
      this.syncToLocalStorage();

      this.initIndexedDB().then((db) => {
        if (!db) return;
        try {
          const tx = db.transaction('progress', 'readwrite');
          tx.objectStore('progress').put({ key, record: current });
        } catch {
          // Fallback handled
        }
      });

      this.notify();
    } catch (e) {
      console.warn('[PersonalLibraryService] toggleChapterCompleted error', e);
    }
  }

  // ----------------------------------------------------------------------------
  // Reading Plans & Daily Schedules API (Phase 6.2)
  // ----------------------------------------------------------------------------
  getPlans(): ReadingPlan[] {
    return this.stateCache.plans;
  }

  getPlan(id: string): ReadingPlan | null {
    return this.stateCache.plans.find((p) => p.id === id) || null;
  }

  savePlan(plan: ReadingPlan): boolean {
    try {
      const existing = this.stateCache.plans.filter((p) => p.id !== plan.id);
      this.stateCache.plans = [plan, ...existing];

      // Auto-generate scheduled sessions for this plan
      this.generateSessionsForPlan(plan);

      this.syncToLocalStorage();

      this.initIndexedDB().then((db) => {
        if (!db || !db.objectStoreNames.contains('plans')) return;
        try {
          const tx = db.transaction(['plans', 'sessions'], 'readwrite');
          tx.objectStore('plans').put(plan);
          const sStore = tx.objectStore('sessions');
          this.stateCache.sessions
            .filter((s) => s.planId === plan.id)
            .forEach((s) => sStore.put(s));
        } catch {
          // Handled
        }
      });

      this.notify();
      return true;
    } catch (e) {
      console.warn('[PersonalLibraryService] savePlan error', e);
      return false;
    }
  }

  deletePlan(id: string): boolean {
    try {
      this.stateCache.plans = this.stateCache.plans.filter((p) => p.id !== id);
      this.stateCache.sessions = this.stateCache.sessions.filter((s) => s.planId !== id);

      this.syncToLocalStorage();

      this.initIndexedDB().then((db) => {
        if (!db || !db.objectStoreNames.contains('plans')) return;
        try {
          const tx = db.transaction(['plans', 'sessions'], 'readwrite');
          tx.objectStore('plans').delete(id);
          const sStore = tx.objectStore('sessions');
          const req = sStore.getAll();
          req.onsuccess = () => {
            req.result.forEach((s: any) => {
              if (s.planId === id) sStore.delete(s.id);
            });
          };
        } catch {
          // Handled
        }
      });

      this.notify();
      return true;
    } catch {
      return false;
    }
  }

  updatePlanStatus(id: string, status: 'active' | 'paused' | 'completed'): boolean {
    const plan = this.getPlan(id);
    if (!plan) return false;
    plan.status = status;
    plan.updatedAt = new Date().toISOString();
    return this.savePlan(plan);
  }

  restartPlan(id: string): boolean {
    const plan = this.getPlan(id);
    if (!plan) return false;
    plan.status = 'active';
    plan.currentIndex = 0;
    plan.startDate = getLocalDateString();
    plan.updatedAt = new Date().toISOString();

    // Reset sessions for this plan
    this.stateCache.sessions = this.stateCache.sessions.filter((s) => s.planId !== id);
    this.generateSessionsForPlan(plan);

    this.syncToLocalStorage();
    this.notify();
    return true;
  }

  getSessions(date?: string): ReadingPlanSession[] {
    if (!date) return this.stateCache.sessions;
    return this.stateCache.sessions.filter((s) => s.date === date);
  }

  getTodaySessions(): ReadingPlanSession[] {
    const today = getLocalDateString();
    return this.getSessions(today);
  }

  markSessionCompleted(sessionId: string): boolean {
    const session = this.stateCache.sessions.find((s) => s.id === sessionId);
    if (!session) return false;

    session.status = 'completed';
    session.completedAt = new Date().toISOString();

    // Advance plan current index
    const plan = this.getPlan(session.planId);
    if (plan) {
      const planSessions = this.stateCache.sessions.filter((s) => s.planId === plan.id);
      const allCompleted =
        planSessions.length > 0 &&
        planSessions.every((s) => s.status === 'completed' || s.status === 'skipped');
      if (allCompleted) {
        plan.status = 'completed';
      }
      plan.currentIndex = Math.min(plan.currentIndex + 1, plan.items.length);
      plan.updatedAt = new Date().toISOString();
    }

    this.syncToLocalStorage();

    this.initIndexedDB().then((db) => {
      if (!db || !db.objectStoreNames.contains('sessions')) return;
      try {
        const tx = db.transaction(['sessions', 'plans'], 'readwrite');
        tx.objectStore('sessions').put(session);
        if (plan) tx.objectStore('plans').put(plan);
      } catch {
        // Handled
      }
    });

    this.notify();
    return true;
  }

  skipSession(sessionId: string): boolean {
    const session = this.stateCache.sessions.find((s) => s.id === sessionId);
    if (!session) return false;

    session.status = 'skipped';
    session.notes = 'Skipped by user';

    this.syncToLocalStorage();
    this.notify();
    return true;
  }

  postponeSession(sessionId: string, newDate?: string): boolean {
    const session = this.stateCache.sessions.find((s) => s.id === sessionId);
    if (!session) return false;

    session.status = 'postponed';
    if (newDate) {
      session.postponedToDate = newDate;
      session.date = newDate;
      session.status = 'scheduled'; // Rescheduled
    } else {
      // Default postpone to tomorrow
      const d = new Date(session.date);
      d.setDate(d.getDate() + 1);
      const tomorrow = getLocalDateString(d);
      session.postponedToDate = tomorrow;
      session.date = tomorrow;
      session.status = 'scheduled';
    }

    this.syncToLocalStorage();
    this.notify();
    return true;
  }

  generateSessionsForPlan(plan: ReadingPlan, daysAhead: number = 30): void {
    if (!plan.items || plan.items.length === 0) return;

    const parts = (plan.startDate || getLocalDateString()).split('-').map(Number);
    const startYear = parts[0] || new Date().getFullYear();
    const startMonth = (parts[1] || 1) - 1;
    const startDay = parts[2] || 1;

    const existingSessions = this.stateCache.sessions.filter((s) => s.planId === plan.id);
    const existingKeys = new Set(existingSessions.map((s) => `${s.date}:${s.item.id}`));

    const newSessions: ReadingPlanSession[] = [];
    let itemIdx = 0;
    const maxOffset = Math.max(daysAhead, plan.items.length * 3);

    for (let offset = 0; offset < maxOffset && itemIdx < plan.items.length; offset++) {
      const curDate = new Date(startYear, startMonth, startDay + offset);
      const weekday = curDate.getDay();

      if (plan.selectedWeekdays.includes(weekday)) {
        const dateStr = getLocalDateString(curDate);
        const item = plan.items[itemIdx];
        const key = `${dateStr}:${item.id}`;

        if (!existingKeys.has(key)) {
          newSessions.push({
            id: `sess_${plan.id}_${itemIdx}_${dateStr}`,
            planId: plan.id,
            planName: plan.name,
            date: dateStr,
            item,
            status: 'scheduled',
            scheduledWeekday: weekday,
          });
          existingKeys.add(key);
        }
        itemIdx++;
      }
    }

    if (newSessions.length > 0) {
      this.stateCache.sessions = [...this.stateCache.sessions, ...newSessions].sort((a, b) =>
        a.date.localeCompare(b.date)
      );
    }
  }

  getPlanProgress(planId: string): ReadingPlanProgress {
    const plan = this.getPlan(planId);
    const planSessions = this.stateCache.sessions.filter((s) => s.planId === planId);
    const totalItems = plan?.items?.length || 0;

    const completedSessions = planSessions.filter((s) => s.status === 'completed').length;
    const skippedSessions = planSessions.filter((s) => s.status === 'skipped').length;
    const postponedSessions = planSessions.filter((s) => s.status === 'postponed').length;

    const todayStr = getLocalDateString();
    const scheduledSessionsToDate = planSessions.filter((s) => s.date <= todayStr).length;

    // Weekly metrics
    const now = new Date();
    const curDay = now.getDay();
    const diffToMonday = curDay === 0 ? -6 : 1 - curDay;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);

    const monStr = getLocalDateString(monday);
    const sunStr = getLocalDateString(sunday);

    const weekSessions = planSessions.filter((s) => s.date >= monStr && s.date <= sunStr);
    const weeklyCompleted = weekSessions.filter((s) => s.status === 'completed').length;
    const weeklyScheduled = weekSessions.length;

    // Monthly metrics
    const monthPrefix = todayStr.slice(0, 7);
    const monthSessions = planSessions.filter((s) => s.date.startsWith(monthPrefix));
    const monthlyCompleted = monthSessions.filter((s) => s.status === 'completed').length;
    const monthlyScheduled = monthSessions.length;

    const completedList = planSessions
      .filter((s) => s.status === 'completed' && s.completedAt)
      .sort((a, b) => (b.completedAt || '').localeCompare(a.completedAt || ''));
    const lastCompleted = completedList[0];

    const progressPercentage =
      totalItems > 0 ? Math.min(100, Math.round((completedSessions / totalItems) * 100)) : null;

    return {
      planId,
      totalItems,
      completedSessions,
      skippedSessions,
      postponedSessions,
      scheduledSessionsToDate,
      weeklyCompleted,
      weeklyScheduled,
      monthlyCompleted,
      monthlyScheduled,
      lastCompletedDate: lastCompleted?.completedAt,
      lastCompletedTitle: lastCompleted?.item?.displayTitle,
      progressPercentage,
    };
  }

  async requestNotificationPermission(): Promise<NotificationPermission> {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        return await Notification.requestPermission();
      } catch {
        return 'denied';
      }
    }
    return 'denied';
  }

  checkDueReminders(): { duePlans: ReadingPlan[]; shouldNotify: boolean } {
    if (typeof window === 'undefined') return { duePlans: [], shouldNotify: false };
    const todayStr = getLocalDateString();
    const now = new Date();
    const currentHourMin = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const currentWeekday = now.getDay();

    const activePlans = this.stateCache.plans.filter(
      (p) => p.status === 'active' && p.reminderEnabled && p.selectedWeekdays.includes(currentWeekday)
    );

    const duePlans = activePlans.filter((p) => {
      const todaySessions = this.stateCache.sessions.filter(
        (s) => s.planId === p.id && s.date === todayStr && s.status === 'scheduled'
      );
      if (todaySessions.length === 0) return false;
      const targetTime = p.reminderTime || p.preferredTime || '08:00';
      return currentHourMin >= targetTime;
    });

    return {
      duePlans,
      shouldNotify: duePlans.length > 0,
    };
  }

  // ----------------------------------------------------------------------------
  // Export & Import Capability (Schema Version 2 with Version 1 Backward Compatibility)
  // ----------------------------------------------------------------------------
  exportLibrary(): PersonalLibraryExport {
    return {
      schemaVersion: 2,
      exportedAt: new Date().toISOString(),
      platform: 'Jafri Sacred Library',
      bookmarks: this.stateCache.bookmarks,
      readingPositions: this.stateCache.positions,
      readingHistory: this.stateCache.history,
      readingProgress: this.stateCache.progress,
      readingPlans: this.stateCache.plans,
      readingSessions: this.stateCache.sessions,
    };
  }

  importLibrary(data: PersonalLibraryExport): {
    success: boolean;
    count: number;
    duplicates: number;
    plansCount: number;
    error?: string;
  } {
    try {
      if (!data || typeof data !== 'object') {
        return {
          success: false,
          count: 0,
          duplicates: 0,
          plansCount: 0,
          error: 'Invalid backup file format',
        };
      }

      if (!data.schemaVersion || (data.schemaVersion !== 1 && data.schemaVersion !== 2)) {
        return {
          success: false,
          count: 0,
          duplicates: 0,
          plansCount: 0,
          error: `Unsupported backup schema version: ${data.schemaVersion ?? 'unknown'}. Supported versions: 1, 2.`,
        };
      }

      let importedBookmarks = 0;
      let duplicateBookmarks = 0;
      if (Array.isArray(data.bookmarks)) {
        const map = new Map(this.stateCache.bookmarks.map((b) => [b.id, b]));
        data.bookmarks.forEach((b) => {
          if (b && b.id && b.religion) {
            if (map.has(b.id)) {
              duplicateBookmarks++;
              const existing = map.get(b.id)!;
              map.set(b.id, {
                ...b,
                ...existing,
                timestamp: Math.max(existing.timestamp || 0, b.timestamp || 0),
              });
            } else {
              map.set(b.id, b);
              importedBookmarks++;
            }
          }
        });
        this.stateCache.bookmarks = Array.from(map.values()).sort(
          (a, b) => b.timestamp - a.timestamp
        );
      }

      if (data.readingPositions && typeof data.readingPositions === 'object') {
        Object.keys(data.readingPositions).forEach((relKey) => {
          const rel = relKey as ReligionId;
          const incomingPos = data.readingPositions[rel];
          const existingPos = this.stateCache.positions[rel];
          if (incomingPos) {
            if (!existingPos || (incomingPos.timestamp || 0) > (existingPos.timestamp || 0)) {
              this.stateCache.positions[rel] = incomingPos;
            }
          }
        });
      }

      if (Array.isArray(data.readingHistory)) {
        this.stateCache.history = [...data.readingHistory, ...this.stateCache.history].slice(0, 100);
      }

      if (data.readingProgress && typeof data.readingProgress === 'object') {
        Object.keys(data.readingProgress).forEach((progKey) => {
          const incoming = data.readingProgress[progKey];
          const existing = this.stateCache.progress[progKey];
          if (incoming) {
            if (!existing) {
              this.stateCache.progress[progKey] = incoming;
            } else {
              const mergedVisited = Array.from(
                new Set([...(existing.chaptersVisited || []), ...(incoming.chaptersVisited || [])])
              );
              const mergedCompleted = Array.from(
                new Set([...(existing.chaptersCompleted || []), ...(incoming.chaptersCompleted || [])])
              );
              const mergedDetail = { ...(incoming.chaptersDetail || {}), ...(existing.chaptersDetail || {}) };
              let pct = null;
              if (existing.totalChaptersKnown && existing.totalChapters && existing.totalChapters > 0) {
                pct = Math.round((mergedCompleted.length / existing.totalChapters) * 100);
              }
              this.stateCache.progress[progKey] = {
                ...existing,
                chaptersVisited: mergedVisited,
                chaptersCompleted: mergedCompleted,
                chaptersDetail: mergedDetail,
                progressPercentage: pct,
                lastReadingDate:
                  new Date(existing.lastReadingDate) > new Date(incoming.lastReadingDate)
                    ? existing.lastReadingDate
                    : incoming.lastReadingDate,
              };
            }
          }
        });
      }

      let importedPlansCount = 0;
      // Phase 6.2: Reading Plans & Sessions import (Schema Version 2)
      if (data.schemaVersion === 2) {
        if (Array.isArray(data.readingPlans)) {
          const pMap = new Map(this.stateCache.plans.map((p) => [p.id, p]));
          data.readingPlans.forEach((plan) => {
            if (plan && plan.id) {
              pMap.set(plan.id, plan);
              importedPlansCount++;
            }
          });
          this.stateCache.plans = Array.from(pMap.values());
        }

        if (Array.isArray(data.readingSessions)) {
          const sMap = new Map(this.stateCache.sessions.map((s) => [s.id, s]));
          data.readingSessions.forEach((sess) => {
            if (sess && sess.id) {
              sMap.set(sess.id, sess);
            }
          });
          this.stateCache.sessions = Array.from(sMap.values()).sort((a, b) =>
            a.date.localeCompare(b.date)
          );
        }
      }

      this.syncToLocalStorage();

      this.initIndexedDB().then((db) => {
        if (!db) return;
        try {
          const stores = ['bookmarks', 'positions', 'history', 'progress'];
          if (db.objectStoreNames.contains('plans')) stores.push('plans');
          if (db.objectStoreNames.contains('sessions')) stores.push('sessions');
          const tx = db.transaction(stores, 'readwrite');
          const bmStore = tx.objectStore('bookmarks');
          this.stateCache.bookmarks.forEach((b) => bmStore.put(b));
          const posStore = tx.objectStore('positions');
          Object.values(this.stateCache.positions).forEach((p) => {
            if (p) posStore.put(p);
          });
          const progStore = tx.objectStore('progress');
          Object.entries(this.stateCache.progress).forEach(([k, rec]) => {
            progStore.put({ key: k, record: rec });
          });
          if (db.objectStoreNames.contains('plans')) {
            const pStore = tx.objectStore('plans');
            this.stateCache.plans.forEach((p) => pStore.put(p));
          }
          if (db.objectStoreNames.contains('sessions')) {
            const sStore = tx.objectStore('sessions');
            this.stateCache.sessions.forEach((s) => sStore.put(s));
          }
        } catch {
          // Handled
        }
      });

      this.notify();
      return {
        success: true,
        count: importedBookmarks,
        duplicates: duplicateBookmarks,
        plansCount: importedPlansCount,
      };
    } catch (err: any) {
      return {
        success: false,
        count: 0,
        duplicates: 0,
        plansCount: 0,
        error: err?.message || 'Failed to import backup',
      };
    }
  }
}

/**
 * Local Date String Helper (YYYY-MM-DD in local user time)
 */
export const getLocalDateString = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Predefined Curated Plan Templates Across All 7 Traditions + Multi-Tradition
 */
export const CURATED_PLAN_TEMPLATES: Omit<
  ReadingPlan,
  'id' | 'createdAt' | 'updatedAt' | 'currentIndex' | 'status'
>[] = [
  // 1. Islam: Holy Quran 30-Day Spiritual Journey
  {
    name: 'Holy Quran 30-Day Spiritual Journey',
    description: 'Read key Surahs and chapters daily through a 30-day spiritual journey of the Holy Quran.',
    religions: ['islam'],
    planType: 'single-religion',
    targetType: 'chapter',
    dailyTarget: 1,
    targetUnit: 'chapters',
    startDate: getLocalDateString(),
    selectedWeekdays: [0, 1, 2, 3, 4, 5, 6],
    preferredTime: '06:30',
    timeZone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
    reminderEnabled: true,
    reminderTime: '06:30',
    items: [
      { id: 't-isl-1', religion: 'islam', scriptureId: 'quran', collectionId: 'holy-quran', readingId: 'surah-1', chapterNumber: 1, verseNumber: 1, displayTitle: 'Surah Al-Faatiha (The Opening)', displayLocation: 'Surah 1:1-7', estimatedMinutes: 5 },
      { id: 't-isl-2', religion: 'islam', scriptureId: 'quran', collectionId: 'holy-quran', readingId: 'surah-2', chapterNumber: 2, verseNumber: 255, displayTitle: 'Surah Al-Baqarah (Ayat al-Kursi)', displayLocation: 'Surah 2:255', estimatedMinutes: 10 },
      { id: 't-isl-3', religion: 'islam', scriptureId: 'quran', collectionId: 'holy-quran', readingId: 'surah-3', chapterNumber: 3, verseNumber: 1, displayTitle: 'Surah Ali \'Imran', displayLocation: 'Surah 3:1-30', estimatedMinutes: 15 },
      { id: 't-isl-4', religion: 'islam', scriptureId: 'quran', collectionId: 'holy-quran', readingId: 'surah-18', chapterNumber: 18, verseNumber: 1, displayTitle: 'Surah Al-Kahf', displayLocation: 'Surah 18:1-31', estimatedMinutes: 15 },
      { id: 't-isl-5', religion: 'islam', scriptureId: 'quran', collectionId: 'holy-quran', readingId: 'surah-36', chapterNumber: 36, verseNumber: 1, displayTitle: 'Surah Yaaseen', displayLocation: 'Surah 36:1-40', estimatedMinutes: 15 },
      { id: 't-isl-6', religion: 'islam', scriptureId: 'quran', collectionId: 'holy-quran', readingId: 'surah-55', chapterNumber: 55, verseNumber: 1, displayTitle: 'Surah Ar-Rahmaan', displayLocation: 'Surah 55:1-78', estimatedMinutes: 12 },
      { id: 't-isl-7', religion: 'islam', scriptureId: 'quran', collectionId: 'holy-quran', readingId: 'surah-67', chapterNumber: 67, verseNumber: 1, displayTitle: 'Surah Al-Mulk', displayLocation: 'Surah 67:1-30', estimatedMinutes: 10 },
      { id: 't-isl-8', religion: 'islam', scriptureId: 'quran', collectionId: 'holy-quran', readingId: 'surah-112', chapterNumber: 112, verseNumber: 1, displayTitle: 'Surah Al-Ikhlaas & Al-Mu\'awwidhatayn', displayLocation: 'Surahs 112-114', estimatedMinutes: 5 },
    ],
  },

  // 2. Hinduism: Shrimad Bhagavad Gita 18-Day Journey
  {
    name: 'Shrimad Bhagavad Gita 18-Day Journey',
    description: 'Read one chapter of the Bhagavad Gita daily to complete the full sacred dialogue in 18 days.',
    religions: ['hinduism'],
    planType: 'single-religion',
    targetType: 'chapter',
    dailyTarget: 1,
    targetUnit: 'chapters',
    startDate: getLocalDateString(),
    selectedWeekdays: [0, 1, 2, 3, 4, 5, 6],
    preferredTime: '07:00',
    timeZone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
    reminderEnabled: true,
    reminderTime: '07:00',
    items: Array.from({ length: 18 }, (_, i) => {
      const ch = i + 1;
      const titles = [
        'Arjuna Visada Yoga', 'Sankhya Yoga', 'Karma Yoga', 'Jnana-Karma-Sanyasa Yoga',
        'Karma-Sanyasa Yoga', 'Dhyana Yoga', 'Jnana-Vijnana Yoga', 'Aksara-Brahma Yoga',
        'Raja-Vidya-Raja-Guhya Yoga', 'Vibhuti Yoga', 'Viswarupa-Darsana Yoga', 'Bhakti Yoga',
        'Ksetra-Ksetrajna Vibhaga Yoga', 'Gunatraya-Vibhaga Yoga', 'Purusottama Yoga',
        'Daivasura-Sampad-Vibhaga Yoga', 'Sraddhatraya-Vibhaga Yoga', 'Moksa-Sanyasa Yoga'
      ];
      return {
        id: `t-hin-gita-ch-${ch}`,
        religion: 'hinduism' as ReligionId,
        scriptureId: 'gita',
        collectionId: 'gita',
        readingId: `gita-${ch}`,
        chapterNumber: ch,
        verseNumber: 1,
        displayTitle: `Bhagavad Gita — Chapter ${ch}`,
        displayLocation: `Chapter ${ch}: ${titles[i]}`,
        estimatedMinutes: 12,
      };
    }),
  },

  // 3. Christianity: Daily Psalms & Gospels Walk
  {
    name: 'Daily Psalms & Gospels Walk',
    description: 'Daily contemplative reading through the Book of Psalms and the Gospel of Matthew.',
    religions: ['christianity'],
    planType: 'single-religion',
    targetType: 'passage',
    dailyTarget: 1,
    targetUnit: 'passages',
    startDate: getLocalDateString(),
    selectedWeekdays: [0, 1, 2, 3, 4, 5, 6],
    preferredTime: '07:30',
    timeZone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
    reminderEnabled: true,
    reminderTime: '07:30',
    items: [
      { id: 't-chr-1', religion: 'christianity', scriptureId: 'bible-kjv', collectionId: 'bible-kjv', readingId: 'genesis-1', chapterNumber: 1, verseNumber: 1, displayTitle: 'Genesis 1 — The Creation', displayLocation: 'Genesis 1:1-31', estimatedMinutes: 8 },
      { id: 't-chr-2', religion: 'christianity', scriptureId: 'bible-kjv', collectionId: 'bible-kjv', readingId: 'psalm-1', chapterNumber: 19, verseNumber: 1, displayTitle: 'Psalm 1 — The Blessed Man', displayLocation: 'Psalm 1:1-6', estimatedMinutes: 5 },
      { id: 't-chr-3', religion: 'christianity', scriptureId: 'bible-kjv', collectionId: 'bible-kjv', readingId: 'psalm-23', chapterNumber: 19, verseNumber: 23, displayTitle: 'Psalm 23 — The Lord is My Shepherd', displayLocation: 'Psalm 23:1-6', estimatedMinutes: 5 },
      { id: 't-chr-4', religion: 'christianity', scriptureId: 'bible-kjv', collectionId: 'bible-kjv', readingId: 'psalm-91', chapterNumber: 19, verseNumber: 91, displayTitle: 'Psalm 91 — Secret Place of the Most High', displayLocation: 'Psalm 91:1-16', estimatedMinutes: 7 },
      { id: 't-chr-5', religion: 'christianity', scriptureId: 'bible-kjv', collectionId: 'bible-kjv', readingId: 'psalm-121', chapterNumber: 19, verseNumber: 121, displayTitle: 'Psalm 121 — My Help Cometh from the Lord', displayLocation: 'Psalm 121:1-8', estimatedMinutes: 5 },
      { id: 't-chr-6', religion: 'christianity', scriptureId: 'bible-kjv', collectionId: 'bible-kjv', readingId: 'matthew-5', chapterNumber: 40, verseNumber: 1, displayTitle: 'Matthew 5 — The Beatitudes', displayLocation: 'Matthew 5:1-16', estimatedMinutes: 10 },
      { id: 't-chr-7', religion: 'christianity', scriptureId: 'bible-kjv', collectionId: 'bible-kjv', readingId: 'john-1', chapterNumber: 43, verseNumber: 1, displayTitle: 'Gospel of John — The Word Made Flesh', displayLocation: 'John 1:1-18', estimatedMinutes: 8 },
    ],
  },

  // 4. Judaism: Daily Torah & Tehillim Routine
  {
    name: 'Daily Torah & Tehillim Routine',
    description: 'Weekly Parashah portions and daily Tehillim (Psalms) from the canonical Tanakh.',
    religions: ['judaism'],
    planType: 'single-religion',
    targetType: 'passage',
    dailyTarget: 1,
    targetUnit: 'passages',
    startDate: getLocalDateString(),
    selectedWeekdays: [0, 1, 2, 3, 4, 5, 6],
    preferredTime: '08:00',
    timeZone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
    reminderEnabled: true,
    reminderTime: '08:00',
    items: [
      { id: 't-jud-1', religion: 'judaism', scriptureId: 'tanakh', collectionId: 'torah', readingId: 'genesis-1', chapterNumber: 'Genesis', verseNumber: 1, displayTitle: 'Bereshit (Genesis 1) — Creation', displayLocation: 'Genesis 1:1-31', estimatedMinutes: 10 },
      { id: 't-jud-2', religion: 'judaism', scriptureId: 'tanakh', collectionId: 'torah', readingId: 'genesis-12', chapterNumber: 'Genesis', verseNumber: 12, displayTitle: 'Lech Lecha (Genesis 12) — The Call', displayLocation: 'Genesis 12:1-20', estimatedMinutes: 10 },
      { id: 't-jud-3', religion: 'judaism', scriptureId: 'tanakh', collectionId: 'torah', readingId: 'exodus-20', chapterNumber: 'Exodus', verseNumber: 20, displayTitle: 'Yitro (Exodus 20) — The Ten Words', displayLocation: 'Exodus 20:1-17', estimatedMinutes: 12 },
      { id: 't-jud-4', religion: 'judaism', scriptureId: 'tanakh', collectionId: 'torah', readingId: 'deuteronomy-6', chapterNumber: 'Deuteronomy', verseNumber: 6, displayTitle: 'Va\'etchanan — The Shema', displayLocation: 'Deuteronomy 6:4-9', estimatedMinutes: 5 },
      { id: 't-jud-5', religion: 'judaism', scriptureId: 'tanakh', collectionId: 'ketuvim', readingId: 'psalm-150', chapterNumber: 'Psalms', verseNumber: 150, displayTitle: 'Tehillim 150 — Praise with Every Breath', displayLocation: 'Psalm 150:1-6', estimatedMinutes: 5 },
    ],
  },

  // 5. Sikhism: Daily Nitnem & SGGS Contemplation
  {
    name: 'Daily Nitnem & SGGS Contemplation',
    description: 'Daily recitation and contemplation of Japji Sahib and foundational Angs of Sri Guru Granth Sahib Ji.',
    religions: ['sikhism'],
    planType: 'single-religion',
    targetType: 'chapter',
    dailyTarget: 1,
    targetUnit: 'chapters',
    startDate: getLocalDateString(),
    selectedWeekdays: [0, 1, 2, 3, 4, 5, 6],
    preferredTime: '06:00',
    timeZone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
    reminderEnabled: true,
    reminderTime: '06:00',
    items: [
      { id: 't-sikh-1', religion: 'sikhism', scriptureId: 'sggs', collectionId: 'sggs', readingId: 'ang-1', chapterNumber: 1, verseNumber: 1, displayTitle: 'Japji Sahib — Mool Mantar & Pauris 1-4', displayLocation: 'SGGS Ang 1', estimatedMinutes: 10 },
      { id: 't-sikh-2', religion: 'sikhism', scriptureId: 'sggs', collectionId: 'sggs', readingId: 'ang-2', chapterNumber: 2, verseNumber: 1, displayTitle: 'Japji Sahib — Pauris 5-9', displayLocation: 'SGGS Ang 2', estimatedMinutes: 10 },
      { id: 't-sikh-3', religion: 'sikhism', scriptureId: 'sggs', collectionId: 'sggs', readingId: 'ang-3', chapterNumber: 3, verseNumber: 1, displayTitle: 'Japji Sahib — Pauris 10-15', displayLocation: 'SGGS Ang 3', estimatedMinutes: 10 },
      { id: 't-sikh-4', religion: 'sikhism', scriptureId: 'sggs', collectionId: 'sggs', readingId: 'ang-4', chapterNumber: 4, verseNumber: 1, displayTitle: 'Japji Sahib — Pauris 16-20', displayLocation: 'SGGS Ang 4', estimatedMinutes: 10 },
      { id: 't-sikh-5', religion: 'sikhism', scriptureId: 'sggs', collectionId: 'sggs', readingId: 'ang-5', chapterNumber: 5, verseNumber: 1, displayTitle: 'Japji Sahib — Pauris 21-27', displayLocation: 'SGGS Ang 5', estimatedMinutes: 10 },
      { id: 't-sikh-6', religion: 'sikhism', scriptureId: 'sggs', collectionId: 'sggs', readingId: 'ang-6', chapterNumber: 6, verseNumber: 1, displayTitle: 'Japji Sahib — Pauris 28-34', displayLocation: 'SGGS Ang 6', estimatedMinutes: 10 },
      { id: 't-sikh-7', religion: 'sikhism', scriptureId: 'sggs', collectionId: 'sggs', readingId: 'ang-7', chapterNumber: 7, verseNumber: 1, displayTitle: 'Japji Sahib — Pauris 35-38 & Salok', displayLocation: 'SGGS Ang 7-8', estimatedMinutes: 10 },
    ],
  },

  // 6. Buddhism: Discourses of the Buddha (Pali Suttas)
  {
    name: 'Discourses of the Buddha (Pali Suttas)',
    description: 'Foundational suttas of wisdom, mindfulness, and loving-kindness from the Pali Canon Tipitaka.',
    religions: ['buddhism'],
    planType: 'single-religion',
    targetType: 'passage',
    dailyTarget: 1,
    targetUnit: 'passages',
    startDate: getLocalDateString(),
    selectedWeekdays: [0, 1, 2, 3, 4, 5, 6],
    preferredTime: '07:00',
    timeZone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
    reminderEnabled: true,
    reminderTime: '07:00',
    items: [
      { id: 't-bud-1', religion: 'buddhism', scriptureId: 'tipitaka', collectionId: 'khuddaka', readingId: 'mangala', chapterNumber: 'mangala', verseNumber: 1, displayTitle: 'Maha-Mangala Sutta — Highest Blessings', displayLocation: 'Sutta Nipata 2.4', estimatedMinutes: 8 },
      { id: 't-bud-2', religion: 'buddhism', scriptureId: 'tipitaka', collectionId: 'khuddaka', readingId: 'metta', chapterNumber: 'metta', verseNumber: 1, displayTitle: 'Karaniya Metta Sutta — Universal Loving-Kindness', displayLocation: 'Sutta Nipata 1.8', estimatedMinutes: 8 },
      { id: 't-bud-3', religion: 'buddhism', scriptureId: 'tipitaka', collectionId: 'khuddaka', readingId: 'ratana', chapterNumber: 'ratana', verseNumber: 1, displayTitle: 'Ratana Sutta — The Jewel Discourse', displayLocation: 'Sutta Nipata 2.1', estimatedMinutes: 10 },
      { id: 't-bud-4', religion: 'buddhism', scriptureId: 'tipitaka', collectionId: 'khuddaka', readingId: 'dhammapada-1', chapterNumber: 'dhp-1', verseNumber: 1, displayTitle: 'Dhammapada — Chapter 1: The Twin Verses', displayLocation: 'Dhammapada 1-20', estimatedMinutes: 10 },
      { id: 't-bud-5', religion: 'buddhism', scriptureId: 'tipitaka', collectionId: 'khuddaka', readingId: 'dhammapada-2', chapterNumber: 'dhp-2', verseNumber: 1, displayTitle: 'Dhammapada — Chapter 2: Heedfulness', displayLocation: 'Dhammapada 21-32', estimatedMinutes: 8 },
    ],
  },

  // 7. Jainism: Tattvartha Sutra & Canonical Hymns
  {
    name: 'Tattvartha Sutra & Canonical Hymns',
    description: 'Foundational sacred texts of Jain philosophy, ethics, non-violence, and liberation.',
    religions: ['jainism'],
    planType: 'single-religion',
    targetType: 'chapter',
    dailyTarget: 1,
    targetUnit: 'chapters',
    startDate: getLocalDateString(),
    selectedWeekdays: [0, 1, 2, 3, 4, 5, 6],
    preferredTime: '07:30',
    timeZone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
    reminderEnabled: true,
    reminderTime: '07:30',
    items: [
      { id: 't-jain-1', religion: 'jainism', scriptureId: 'agamas', collectionId: 'navkar', readingId: 'navkar', chapterNumber: 'navkar', verseNumber: 1, displayTitle: 'Namokar Maha Mantra (Pancha Parameshti Veneration)', displayLocation: 'Canonical Jain Liturgy', estimatedMinutes: 5 },
      { id: 't-jain-2', religion: 'jainism', scriptureId: 'tattvartha', collectionId: 'tattvartha', readingId: 'tattvartha-1', chapterNumber: 1, verseNumber: 1, displayTitle: 'Tattvartha Sutra — Chapter 1: Faith, Knowledge & Conduct', displayLocation: 'Adhyaya 1', estimatedMinutes: 12 },
      { id: 't-jain-3', religion: 'jainism', scriptureId: 'tattvartha', collectionId: 'tattvartha', readingId: 'tattvartha-2', chapterNumber: 2, verseNumber: 1, displayTitle: 'Tattvartha Sutra — Chapter 2: The Category of the Living (Jiva)', displayLocation: 'Adhyaya 2', estimatedMinutes: 12 },
      { id: 't-jain-4', religion: 'jainism', scriptureId: 'tattvartha', collectionId: 'tattvartha', readingId: 'tattvartha-7', chapterNumber: 7, verseNumber: 1, displayTitle: 'Tattvartha Sutra — Chapter 7: The Five Great Vows (Vratas)', displayLocation: 'Adhyaya 7', estimatedMinutes: 12 },
    ],
  },

  // 8. Multi-Religion: Seven Paths Daily Wisdom Routine
  {
    name: 'Seven Paths Daily Wisdom Routine',
    description: 'A 7-day interfaith contemplation routine alternating readings across all seven world traditions.',
    religions: ['islam', 'hinduism', 'christianity', 'judaism', 'sikhism', 'buddhism', 'jainism'],
    planType: 'multi-religion',
    targetType: 'passage',
    dailyTarget: 1,
    targetUnit: 'passages',
    startDate: getLocalDateString(),
    selectedWeekdays: [0, 1, 2, 3, 4, 5, 6],
    preferredTime: '07:00',
    timeZone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
    reminderEnabled: true,
    reminderTime: '07:00',
    items: [
      { id: 't-multi-1', religion: 'islam', scriptureId: 'quran', collectionId: 'holy-quran', readingId: 'surah-1', chapterNumber: 1, verseNumber: 1, displayTitle: 'Day 1 (Islam): Surah Al-Faatiha 1:1', displayLocation: 'The Holy Quran', estimatedMinutes: 6 },
      { id: 't-multi-2', religion: 'hinduism', scriptureId: 'gita', collectionId: 'gita', readingId: 'gita-2', chapterNumber: 2, verseNumber: 47, displayTitle: 'Day 2 (Hinduism): Bhagavad Gita 2:47', displayLocation: 'Shrimad Bhagavad Gita', estimatedMinutes: 8 },
      { id: 't-multi-3', religion: 'christianity', scriptureId: 'bible-kjv', collectionId: 'bible-kjv', readingId: 'psalm-23', chapterNumber: 19, verseNumber: 23, displayTitle: 'Day 3 (Christianity): Psalm 23', displayLocation: 'The Holy Bible', estimatedMinutes: 6 },
      { id: 't-multi-4', religion: 'judaism', scriptureId: 'tanakh', collectionId: 'torah', readingId: 'genesis-1', chapterNumber: 'Genesis', verseNumber: 1, displayTitle: 'Day 4 (Judaism): Bereshit (Genesis 1:1)', displayLocation: 'The Tanakh', estimatedMinutes: 8 },
      { id: 't-multi-5', religion: 'sikhism', scriptureId: 'sggs', collectionId: 'sggs', readingId: 'ang-1', chapterNumber: 1, verseNumber: 1, displayTitle: 'Day 5 (Sikhism): Japji Sahib (Mool Mantar)', displayLocation: 'Sri Guru Granth Sahib Ji', estimatedMinutes: 8 },
      { id: 't-multi-6', religion: 'buddhism', scriptureId: 'tipitaka', collectionId: 'khuddaka', readingId: 'mangala', chapterNumber: 'mangala', verseNumber: 1, displayTitle: 'Day 6 (Buddhism): Maha-Mangala Sutta', displayLocation: 'Pali Canon Tipitaka', estimatedMinutes: 8 },
      { id: 't-multi-7', religion: 'jainism', scriptureId: 'agamas', collectionId: 'navkar', readingId: 'navkar', chapterNumber: 'navkar', verseNumber: 1, displayTitle: 'Day 7 (Jainism): Namokar Maha Mantra', displayLocation: 'Canonical Jain Liturgy', estimatedMinutes: 6 },
    ],
  },
];

export const personalLibraryService = new PersonalLibraryService();
