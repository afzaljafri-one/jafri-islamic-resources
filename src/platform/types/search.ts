// ==============================================================================
// Universal Scripture Search Engine — Data Types & Contracts
// Jafri Religious Resources — Phase 6.3
// ==============================================================================

import { ReligionId } from './religion';
import { CoverageAvailabilityStatus, RightsStatus, ControlledLicenceIdentifier } from './coverage';

/**
 * Four mutually exclusive search match categories defined by Phase 6.3 specification
 */
export type SearchMatchType =
  | 'exact_reference' // Canonical reference match (e.g., John 3:16, Quran 2:255, Gita 2:47)
  | 'exact_phrase'    // Exact contiguous phrase match in original text or translation
  | 'word_match'       // Multi-word or root keyword match
  | 'thematic_result'; // Thematic / subject discovery (e.g., Compassion, Peace, Forgiveness)

/**
 * Parallel Translation/Edition Variant
 */
export interface ParallelTranslationRecord {
  id: string;
  translationName: string;
  translator: string;
  language: string;
  text: string;
  publicationReference?: string;
  sourceReferenceUrl?: string;
  license?: string;
  exactLicenceIdentifier?: ControlledLicenceIdentifier;
  rightsHolderOrPublisher?: string;
  rightsStatus?: RightsStatus;
  verificationStatus?: 'VERIFIED' | 'PARTIAL_VERIFIED' | 'UNKNOWN';
}

/**
 * Standard Universal Scripture Search Result Unit
 */
export interface UniversalSearchResult {
  id: string; // Unique result identifier, e.g. "search_islam_quran_2_255"
  religion: ReligionId;
  collectionId: string;
  collectionTitle: string;
  readingId?: string;
  chapterNumber?: number | string;
  verseNumber?: number | string;
  displayCoordinates: string; // e.g. "John 3:16", "Quran 2:255", "Bhagavad Gita 2:47", "SGGS Ang 471"
  displayTitle: string; // e.g. "Ayat al-Kursi (The Throne Verse)", "The Shepherd Psalm"
  originalText: string; // Authentic, untouched original script
  translationText: string; // English / primary translation
  secondaryTranslationText?: string; // Optional Urdu / Hindi / commentary translation
  transliterationText?: string; // Standard phonetic transliteration where available
  languageCode: string; // Original language ISO code ('ar', 'sa', 'he', 'pa', 'pi', 'pka', 'el')
  sourceAttribution: string; // Source attribution & scholarly translator
  matchType: SearchMatchType;
  thematicKeyword?: string; // e.g. "Compassion", "Peace" when matchType === 'thematic_result'
  matchedSnippet?: string; // Highlighted or matching excerpt
  isOfflineAvailable: boolean; // Indicates if passage is available in bundled/cached offline storage
  score: number; // Relevance ranking score

  /** Phase 6.3.1, 6.3.2 & 6.3.3: Content Coverage Transparency, Grouping, Provenance & Rights Metadata */
  availabilityStatus?: CoverageAvailabilityStatus;
  scopeNotes?: string;
  parentWorkTitle?: string;
  groupedUnitsCount?: number;
  parallelTranslations?: ParallelTranslationRecord[];
  quotationType?: 'direct_quotation' | 'scholarly_translation' | 'contextual_interpretation';
  provenanceNotes?: string;
  canonicalRecension?: string;
  sourceReferenceUrl?: string;

  /** Phase 6.3.3 & Phase 6.3.4: Numbering Conventions & Rights Remediation */
  numberingConvention?: string;
  alternateNumberingCrossReference?: string;
  exactLicenceIdentifier?: ControlledLicenceIdentifier;
  rightsHolderOrPublisher?: string;
  rightsStatus?: RightsStatus;
  geographicRestrictions?: string;
}

/**
 * Scripture Reference Parser Output
 */
export interface ParsedReference {
  religion?: ReligionId;
  collectionId?: string;
  bookOrSurah?: string | number;
  chapterNumber?: number | string;
  verseNumber?: number | string;
  rawQuery: string;
  isExactCitation: boolean;
  citationType?: 'verse' | 'chapter' | 'composition' | 'collection';
}

/**
 * Query Filters
 */
export interface SearchFilterOptions {
  religion?: ReligionId | 'all';
  matchType?: SearchMatchType | 'all';
  collectionId?: string;
  languageCode?: string;
  offlineOnly?: boolean;
  limit?: number;
  offset?: number;
}

/**
 * Search History Record
 */
export interface SearchHistoryItem {
  id: string;
  query: string;
  timestamp: string;
  religion?: ReligionId;
  resultCount?: number;
}

/**
 * Curated Thematic Subject Entry
 */
export interface ThematicSubjectDefinition {
  id: string;
  name: string; // e.g. "Compassion", "Forgiveness", "Peace"
  description: string;
  traditionTerms: Record<ReligionId, string>; // e.g. Islam: "Rahmah", Hinduism: "Karuna / Daya", etc.
  passages: UniversalSearchResult[];
}
