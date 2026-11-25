// ==============================================================================
// Content Coverage Registry Types
// Jafri Religious Resources — Phase 6.3.1
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

export interface CollectionCoverageRecord {
  /** Unique coverage record identifier */
  id: string;
  /** Religion tradition */
  religion: ReligionId;
  /** Primary collection identifier (e.g., 'quran', 'bible-kjv', 'gita', 'sggs', 'tanakh-torah') */
  collectionId: string;
  /** Canonical display title of the collection or scripture */
  canonicalTitle: string;
  /** Native or scriptural title */
  nativeTitle?: string;
  /** Source edition or translation attribution */
  sourceEdition: string;
  /** Language identifier (ISO 639-1 or full name) */
  language: string;
  /** Script name (e.g., Arabic, Devanagari, Hebrew, Gurmukhi, Latin) */
  script: string;
  /** Actual number of searchable / readable units currently indexed */
  indexedUnits: number;
  /** Authoritative denominator where known */
  totalKnownUnits?: number;
  /** Unit descriptor (e.g., 'Surahs', 'Ayahs', 'Books', 'Chapters', 'Verses', 'Angs', 'Shlokas') */
  unitType: string;
  /** Coverage availability classification */
  availabilityStatus: CoverageAvailabilityStatus;
  /** Storage mechanism */
  storageType: CoverageStorageType;
  /** Academic or public-domain licensing / provenance */
  provenance: string;
  /** ISO date of last verification audit */
  lastVerified: string;
  /** Transparent notes explaining the exact boundary between offline and dynamic content */
  scopeNotes: string;
}
