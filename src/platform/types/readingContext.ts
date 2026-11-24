/**
 * ============================================================================
 * JAFRI RELIGIOUS RESOURCES — CANONICAL READING CONTEXT SCHEMA
 * Authoritative, Shared Coordinate Model across All Seven Religious Traditions
 * ============================================================================
 */

import type { TraditionId } from './sacredAudio';

export type MatchScopeLevel =
  | 'EXACT'       // LEVEL 1 — EXACT READING MATCH: Recording explicitly belongs to selected reading
  | 'CHAPTER'     // LEVEL 2 — CHAPTER / SECTION MATCH: Recording explicitly covers chapter or section
  | 'COLLECTION'  // LEVEL 3 — COLLECTION MATCH: Recording covers broader scripture/collection
  | 'TRADITION'   // LEVEL 4 — RELATED TRADITION RECORDING: Belongs to tradition, not active reading
  | 'NONE';       // LEVEL 5 — NO APPROVED MATCH: No eligible recording exists for active reading

export interface CanonicalReadingContext {
  /** Canonical religious tradition identifier ('islam', 'hinduism', 'christianity', etc.) */
  religionId: TraditionId | string;

  /** Canonical category within tradition ('quran', 'Itihasa', 'Old Testament', etc.) */
  categoryId?: string;

  /** Canonical scripture identifier ('quran', 'gita', 'bible', 'tipitaka', 'sggs', 'agamas', 'tanakh') */
  scriptureId?: string;

  /** Canonical collection identifier ('quran_surahs_arabic', 'gita', 'bhajans', 'suttas_sutras', etc.) */
  collectionId?: string;

  /** Unique resource identifier for the specific document or item */
  resourceId?: string;

  /** Canonical reading identifier ('surah-1', 'gita-ch-1', 'matthew-6', 'genesis-1', 'ang-1', etc.) */
  readingId?: string;

  /** Canonical book identifier ('GEN', 'MAT', 1, 40, 'sggs') */
  bookId?: string | number;

  /** Canonical human-readable book title ('Bhagavad Gita', 'Matthew', 'Genesis') */
  bookName?: string;

  /** Canonical chapter, adhyaya, surah, or ang number */
  chapterId?: string | number;

  /** Canonical section or subsection identifier ('doha-1', 'pauris-1-5', etc.) */
  sectionId?: string | number;

  /** Canonical verse, shloka, or ayah identifier */
  verseId?: string | number;

  /** Canonical verse range ('1-10', '9-13', etc.) */
  verseRange?: string;

  /** Language code of displayed text ('ar', 'sa', 'pli', 'en', 'he', 'pa', 'pra') */
  language?: string;

  /** Translation identifier ('kjv', 'sujato', 'jacobi', 'asael', 'amiri') */
  translationId?: string;

  /** Edition identifier ('uthmani', 'indopak', '1870-phillauri', etc.) */
  editionId?: string;

  /** Canonical title of the currently displayed reading */
  canonicalTitle?: string;

  /** Optional display title (e.g. translated or subtitle) */
  title?: string;

  /** Optional explicit list of audio requirement IDs supported by this reading */
  supportedAudioRequirementIdentifiers?: readonly string[];
}

/**
 * Backward-compatible alias for existing components.
 */
export type ReadingContext = CanonicalReadingContext;
