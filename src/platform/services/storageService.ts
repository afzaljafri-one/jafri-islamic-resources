// ==============================================================================
// Common Platform Storage Service
// Namespaced, local-first storage ensuring 100% isolation of existing Islamic data
// Jafri Religious Books & Audio Platform — Phase 0
// ==============================================================================

import { ReligionId } from '../types/religion';
import { UniversalBookmark, ReadingProgress, UserReadingPreferences } from '../types/user';
import { personalLibraryService } from './personalLibraryService';
import { BookmarkRecord } from '../types/personalLibrary';

const STORAGE_KEYS = {
  BOOKMARKS: 'jafri_platform_bookmarks_v1',
  PROGRESS: 'jafri_platform_progress_v1',
  PREFERENCES: 'jafri_platform_preferences_v1',
  ACTIVE_RELIGION: 'jafri_platform_active_religion_v1',
} as const;

export const DEFAULT_READING_PREFERENCES: UserReadingPreferences = {
  fontSizeRem: 1.125, // 18px equivalent
  themeMode: 'default',
  displayMode: 'side-by-side',
  showTransliteration: true,
  showWordByWord: false,
  autoScrollAudio: true,
  playbackSpeed: 1.0,
};

class PlatformStorageService {
  // ----------------------------------------------------------------------------
  // Bookmarks Management (Namespaced, Safe & Bridged to PersonalLibraryService)
  // ----------------------------------------------------------------------------

  getBookmarks(religionId?: ReligionId): UniversalBookmark[] {
    try {
      // First check PersonalLibraryService records
      const unified = personalLibraryService.getBookmarks(religionId);
      if (unified && unified.length > 0) {
        return unified.map((u) => ({
          id: u.id,
          religionId: u.religion,
          collectionId: u.collectionId || u.scriptureId,
          address: {
            religionId: u.religion,
            collectionId: u.collectionId || u.scriptureId,
            path: [
              {
                levelName: 'Chapter',
                identifier: u.chapterNumber || u.readingId,
                label: u.displaySubtitle,
              },
            ],
            unitIdentifier: u.verseNumber || u.chapterNumber || 1,
          },
          displayTitle: u.displayTitle,
          displaySubtitle: u.displaySubtitle,
          snippetRootText: u.originalTextReference,
          snippetTranslatedText: u.translationText,
          savedAtTimestamp: u.timestamp,
          userNotes: u.userNotes,
        }));
      }

      // Fallback to local key
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKMARKS);
      const bookmarks: UniversalBookmark[] = raw ? JSON.parse(raw) : [];

      if (religionId) {
        return bookmarks.filter((b) => b.religionId === religionId);
      }
      return bookmarks;
    } catch {
      return [];
    }
  }

  saveBookmark(bookmark: UniversalBookmark): boolean {
    try {
      // 1. Save in local key
      const existing = this.getBookmarks();
      const updated = [bookmark, ...existing.filter((b) => b.id !== bookmark.id)];
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));

      // 2. Sync to PersonalLibraryService
      const chPath = bookmark.address?.path?.find((p) =>
        ['Chapter', 'Book', 'Ang', 'Sutta', 'Section'].includes(p.levelName)
      );

      const record: BookmarkRecord = {
        id: bookmark.id,
        religion: bookmark.religionId,
        scriptureId: bookmark.collectionId || 'scripture',
        collectionId: bookmark.collectionId || 'collection',
        readingId: bookmark.collectionId || 'reading',
        chapterNumber: chPath?.identifier || bookmark.address?.unitIdentifier,
        verseNumber: bookmark.address?.unitIdentifier,
        originalTextReference: bookmark.snippetRootText || '',
        translationText: bookmark.snippetTranslatedText || '',
        displayTitle: bookmark.displayTitle,
        displaySubtitle: bookmark.displaySubtitle,
        createdAt: new Date(bookmark.savedAtTimestamp || Date.now()).toISOString(),
        timestamp: bookmark.savedAtTimestamp || Date.now(),
        userNotes: bookmark.userNotes,
      };

      personalLibraryService.addBookmark(record);
      return true;
    } catch {
      return false;
    }
  }

  removeBookmark(bookmarkId: string): boolean {
    try {
      const existing = this.getBookmarks();
      const updated = existing.filter((b) => b.id !== bookmarkId);
      localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(updated));
      personalLibraryService.removeBookmark(bookmarkId);
      return true;
    } catch {
      return false;
    }
  }

  clearBookmarks(religionId?: ReligionId): boolean {
    try {
      if (!religionId) {
        localStorage.removeItem(STORAGE_KEYS.BOOKMARKS);
      } else {
        const remaining = this.getBookmarks().filter((b) => b.religionId !== religionId);
        localStorage.setItem(STORAGE_KEYS.BOOKMARKS, JSON.stringify(remaining));
      }
      personalLibraryService.clearBookmarks(religionId);
      return true;
    } catch {
      return false;
    }
  }

  // ----------------------------------------------------------------------------
  // Reading Progress Management
  // ----------------------------------------------------------------------------

  getProgress(religionId: ReligionId, collectionId: string): ReadingProgress | null {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      const all: Record<string, ReadingProgress> = raw ? JSON.parse(raw) : {};
      const key = `${religionId}:${collectionId}`;
      return all[key] || null;
    } catch {
      return null;
    }
  }

  saveProgress(progress: ReadingProgress): boolean {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PROGRESS);
      const all: Record<string, ReadingProgress> = raw ? JSON.parse(raw) : {};
      const key = `${progress.religionId}:${progress.collectionId}`;
      all[key] = progress;
      localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(all));
      return true;
    } catch {
      return false;
    }
  }

  // ----------------------------------------------------------------------------
  // Platform User Preferences
  // ----------------------------------------------------------------------------

  getPreferences(): UserReadingPreferences {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.PREFERENCES);
      return raw ? { ...DEFAULT_READING_PREFERENCES, ...JSON.parse(raw) } : DEFAULT_READING_PREFERENCES;
    } catch {
      return DEFAULT_READING_PREFERENCES;
    }
  }

  savePreferences(prefs: Partial<UserReadingPreferences>): void {
    try {
      const current = this.getPreferences();
      const updated = { ...current, ...prefs };
      localStorage.setItem(STORAGE_KEYS.PREFERENCES, JSON.stringify(updated));
    } catch {
      // Storage unavailable or quota exceeded
    }
  }

  // ----------------------------------------------------------------------------
  // Active Selected Religion
  // ----------------------------------------------------------------------------

  getActiveReligion(): ReligionId | null {
    try {
      return (localStorage.getItem(STORAGE_KEYS.ACTIVE_RELIGION) as ReligionId) || null;
    } catch {
      return null;
    }
  }

  setActiveReligion(religionId: ReligionId | null): void {
    try {
      if (religionId) {
        localStorage.setItem(STORAGE_KEYS.ACTIVE_RELIGION, religionId);
      } else {
        localStorage.removeItem(STORAGE_KEYS.ACTIVE_RELIGION);
      }
    } catch {
      // Ignore
    }
  }
}

export const platformStorageService = new PlatformStorageService();
