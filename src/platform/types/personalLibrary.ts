// ==============================================================================
// Common Platform Personal Library Data Models (Local-First, No Auth Required)
// Jafri Religious Books & Audio Platform — Phase 6.1
// ==============================================================================

import { ReligionId } from './religion';

/**
 * Universal Scripture Bookmark Record
 * Preserves canonical coordinates and offline reference text across 7 world traditions.
 */
export interface BookmarkRecord {
  /** Unique deterministic identifier, e.g. "isl:quran:2:255" or "hin:gita:2:47" */
  id: string;
  /** Religion tradition identifier */
  religion: ReligionId;
  /** Primary scripture collection, e.g. "holy-quran", "gita", "bible", "tanakh", "sggs", "tipitaka", "agamas" */
  scriptureId: string;
  /** Sub-collection identifier */
  collectionId: string;
  /** Canonical reading identifier, e.g. "surah-2", "gita-2", "jhn-3", "tanakh-gen-1" */
  readingId: string;

  /** Chapter, Adhyaya, Surah, Ang, or Sutta identifier */
  chapterNumber?: number | string;
  /** Verse, Ayah, Shloka, Tuk, or Segment identifier */
  verseNumber?: number | string;
  /** Section identifier */
  sectionId?: string;
  /** Sub-unit or passage identifier */
  passageId?: string;

  /** Original-language text reference (Arabic, Sanskrit, Hebrew, Greek, Gurmukhi, Pali, Prakrit) */
  originalTextReference: string;
  /** Translation or edition identifier (e.g. "en.sahih", "KJV", "sivananda") */
  translationId?: string;
  /** Translated English snippet for offline viewing */
  translationText?: string;

  /** Human-readable display citation, e.g. "Surah Al-Baqarah 2:255", "Bhagavad Gita 2:47", "John 3:16" */
  displayTitle: string;
  /** Secondary subtitle or context, e.g. "The Cow • Ayat al-Kursi" */
  displaySubtitle?: string;

  /** ISO 8601 creation timestamp */
  createdAt: string;
  /** Epoch milliseconds for fast chronological sorting */
  timestamp: number;
  /** Optional personal notes */
  userNotes?: string;
}

/**
 * Last Read Position for "Continue Reading"
 * Stored independently per religion plus one global most-recent record.
 */
export interface ReadingPosition {
  religion: ReligionId;
  scriptureId: string;
  collectionId: string;
  readingId: string;
  chapterNumber: number | string;
  verseNumber?: number | string;
  sectionId?: string;
  displayTitle: string;
  displayLocation: string;
  preferredTranslation?: string;
  preferredFormat?: string;
  updatedAt: string;
  timestamp: number;
}

/**
 * Reading History Entry for Chronological Audit & Revisit
 */
export interface ReadingHistoryEntry {
  id: string;
  religion: ReligionId;
  scriptureId: string;
  collectionId: string;
  readingId: string;
  chapterNumber: number | string;
  verseNumber?: number | string;
  displayTitle: string;
  displayLocation: string;
  timestamp: number;
  dateString: string;
}

/**
 * Chapter-Level Progress Record
 */
export interface ChapterProgressItem {
  chapterId: string | number;
  chapterTitle?: string;
  visited: boolean;
  completed: boolean;
  completedAt?: string;
  lastVisitedAt?: string;
}

/**
 * Collection-Level Reading Progress State
 */
export interface ReadingProgressRecord {
  religion: ReligionId;
  scriptureId: string;
  collectionId: string;
  scopeTitle: string;
  /** True if there is a verified, closed canonical chapter count (e.g. 114 Quran, 18 Gita, 66 Bible) */
  totalChaptersKnown: boolean;
  /** Total chapters count denominator, or null if open-ended/curated collection */
  totalChapters: number | null;
  /** Array of chapter numbers/IDs visited */
  chaptersVisited: (string | number)[];
  /** Array of chapter numbers/IDs explicitly marked completed by user */
  chaptersCompleted: (string | number)[];
  /** Detailed chapter status map */
  chaptersDetail: Record<string | number, ChapterProgressItem>;
  /** Most recent position string */
  lastReadPosition?: string;
  /** ISO date of last reading activity */
  lastReadingDate: string;
  /** Calculated progress percentage (0 - 100), or null if denominator is unknown */
  progressPercentage: number | null;
}

/**
 * Export / Backup Schema for Personal Library Data
 */
export interface PersonalLibraryExport {
  schemaVersion: number;
  exportedAt: string;
  platform: 'Jafri Sacred Library';
  bookmarks: BookmarkRecord[];
  readingPositions: Record<ReligionId, ReadingPosition | null>;
  readingHistory: ReadingHistoryEntry[];
  readingProgress: Record<string, ReadingProgressRecord>;
}

/**
 * Personal Library State (Synchronous React In-Memory Cache)
 */
export interface PersonalLibraryState {
  bookmarks: BookmarkRecord[];
  positions: Record<ReligionId, ReadingPosition | null>;
  globalLastRead: ReadingPosition | null;
  history: ReadingHistoryEntry[];
  progress: Record<string, ReadingProgressRecord>;
  isLoading: boolean;
}
