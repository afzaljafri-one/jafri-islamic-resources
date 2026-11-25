// ==============================================================================
// Content Coverage Registry Types
// Cross-Tradition Corpus Transparency for All 7 World Religions
// Jafri Religious Resources — Phase 6.3.2 (Integrity, Provenance & Validation)
// ==============================================================================

import { ReligionId } from './religion';

export type CoverageAvailabilityStatus =
  | 'FULL'
  | 'PARTIAL'
  | 'CATALOG_ONLY'
  | 'API_DEPENDENT'
  | 'UNKNOWN';

export type CoverageStorageType =
  | 'BUNDLED_OFFLINE'
  | 'LOCAL_CACHE'
  | 'DYNAMIC_FETCH';

export type VerificationStatus =
  | 'VERIFIED'
  | 'PARTIAL_VERIFIED'
  | 'UNKNOWN';

/**
 * Separate, traceable metadata for the canonical original religious source
 */
export interface CanonicalSourceProvenance {
  /** Name of the canonical source institution or standard recension */
  originalSource: string;
  /** Original sacred language (e.g. Classical Arabic, Biblical Hebrew, Sanskrit, Gurmukhi, Pali, Prakrit) */
  language: string;
  /** Primary script used for original text (e.g. Arabic Uthmani, Hebrew Square, Devanagari, Gurmukhi) */
  script: string;
  /** Precise historical or theological recension */
  recensionEdition: string;
  /** Identifiable web or scholarly source reference URL */
  sourceReferenceUrl?: string;
  /** Applicable licensing or public heritage rights */
  license: string;
  /** Verification audit status */
  verificationStatus: VerificationStatus;
  /** ISO date of last scholarly verification */
  lastVerified: string;
}

/**
 * Separate, traceable metadata for displayed translations
 */
export interface TranslationProvenanceRecord {
  /** Identifier for translation record */
  id: string;
  /** Name of the scholarly translator or translation committee */
  translator: string;
  /** Formal translation work title or publication edition */
  translationEdition: string;
  /** Target translation language (e.g. English, Urdu, Hindi) */
  targetLanguage: string;
  /** Year or publication reference */
  publicationReference?: string;
  /** Identifiable scholarly or public repository URL */
  sourceReferenceUrl?: string;
  /** Applicable rights or public domain status */
  license: string;
  /** Verification audit status */
  verificationStatus: VerificationStatus;
}

/**
 * Authoritative Collection Coverage Record
 * Strictly enforces that unit counts are comparable and never divides disparate unit types.
 */
export interface CollectionCoverageRecord {
  /** Unique coverage record identifier */
  id: string;
  /** Religion tradition */
  religion: ReligionId;
  /** Primary collection identifier (e.g., 'quran', 'bible-kjv', 'gita', 'sggs', 'tanakh', 'dhammapada') */
  collectionId: string;
  /** Canonical display title of the collection or scripture */
  canonicalTitle: string;
  /** Native or scriptural title in original script */
  nativeTitle?: string;
  /** Explicit scope definition */
  scopeDefinition: string;
  /** Explicit, non-conflated unit descriptor (e.g. 'Ayahs', 'Chapters', 'Shlokas', 'Angs', 'Stanzas', 'Liturgies') */
  unitType: string;
  /** Actual number of searchable / readable units currently indexed */
  indexedUnits: number;
  /** Authoritative total units within the explicitly defined scope */
  totalUnitsInScope: number;
  /** Coverage availability classification */
  availabilityStatus: CoverageAvailabilityStatus;
  /** Storage mechanism */
  storageType: CoverageStorageType;
  /** Traceable original source provenance */
  canonicalSource: CanonicalSourceProvenance;
  /** Traceable translation provenance records */
  translations: TranslationProvenanceRecord[];
  /** Detailed transparent notes explaining exact boundaries */
  scopeNotes: string;
}
