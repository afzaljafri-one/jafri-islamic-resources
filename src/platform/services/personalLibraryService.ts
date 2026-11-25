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
} from '../types/personalLibrary';

const STORAGE_KEYS = {
  BOOKMARKS: 'jafri_lib_bookmarks_v1',
  POSITIONS: 'jafri_lib_positions_v1',
  GLOBAL_LAST_READ: 'jafri_lib_global_last_read_v1',
  HISTORY: 'jafri_lib_history_v1',
  PROGRESS: 'jafri_lib_progress_v1',
  MIGRATED: 'jafri_lib_migrated_v1',
  LEGACY_ISLAM_BOOKMARKS: 'jafri_bookmarks',
  LEGACY_ISLAM_LAST_READ: 'jafri_last_read',
  LEGACY_PLATFORM_BOOKMARKS: 'jafri_platform_bookmarks_v1',
  LEGACY_PLATFORM_PROGRESS: 'jafri_platform_progress_v1',
} as const;

const DB_NAME = 'jafri_personal_library_v1';
const DB_VERSION = 1;

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
    } catch {
      // Quota exceeded or storage restricted
    }
  }

  private async loadFromIndexedDB(db: IDBDatabase) {
    try {
      const tx = db.transaction(['bookmarks', 'positions', 'history', 'progress'], 'readonly');

      const bmReq = tx.objectStore('bookmarks').getAll();
      const posReq = tx.objectStore('positions').getAll();
      const histReq = tx.objectStore('history').getAll();
      const progReq = tx.objectStore('progress').getAll();

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
  // Export & Import Capability
  // ----------------------------------------------------------------------------
  exportLibrary(): PersonalLibraryExport {
    return {
      schemaVersion: 1,
      exportedAt: new Date().toISOString(),
      platform: 'Jafri Sacred Library',
      bookmarks: this.stateCache.bookmarks,
      readingPositions: this.stateCache.positions,
      readingHistory: this.stateCache.history,
      readingProgress: this.stateCache.progress,
    };
  }

  importLibrary(data: PersonalLibraryExport): { success: boolean; count: number; error?: string } {
    try {
      if (!data || typeof data !== 'object') {
        return { success: false, count: 0, error: 'Invalid backup file format' };
      }

      let importedBookmarks = 0;
      if (Array.isArray(data.bookmarks)) {
        const map = new Map(this.stateCache.bookmarks.map((b) => [b.id, b]));
        data.bookmarks.forEach((b) => {
          if (b && b.id && b.religion) {
            map.set(b.id, b);
            importedBookmarks++;
          }
        });
        this.stateCache.bookmarks = Array.from(map.values()).sort(
          (a, b) => b.timestamp - a.timestamp
        );
      }

      if (data.readingPositions && typeof data.readingPositions === 'object') {
        this.stateCache.positions = {
          ...this.stateCache.positions,
          ...data.readingPositions,
        };
      }

      if (Array.isArray(data.readingHistory)) {
        this.stateCache.history = [...data.readingHistory, ...this.stateCache.history].slice(0, 100);
      }

      if (data.readingProgress && typeof data.readingProgress === 'object') {
        this.stateCache.progress = {
          ...this.stateCache.progress,
          ...data.readingProgress,
        };
      }

      this.syncToLocalStorage();
      this.notify();
      return { success: true, count: importedBookmarks };
    } catch (err: any) {
      return { success: false, count: 0, error: err?.message || 'Failed to import backup' };
    }
  }
}

export const personalLibraryService = new PersonalLibraryService();
