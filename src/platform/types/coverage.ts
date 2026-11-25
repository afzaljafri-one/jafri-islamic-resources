// ==============================================================================
// Content Coverage Registry Types
// Cross-Tradition Corpus Transparency for All 7 World Religions
// Jafri Religious Resources — Phase 6.3.3 (Canonical Citation, Coverage & Rights)
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

export type RightsStatus =
  | 'VERIFIED'
  | 'RESTRICTED'
  | 'PERMISSION_REQUIRED'
  | 'UNKNOWN';

/**
 * Controlled formal licence classifications permitted by the Phase 6.3.5 rights gate.
 * Strictly separates licence / rights basis from operational rights status.
 * 'PERMISSION_REQUIRED' and 'UNKNOWN' are rights statuses, NOT licence identifiers.
 */
export type ControlledLicenceIdentifier =
  | 'CC BY 3.0'
  | 'CC BY 4.0'
  | 'CC BY-SA 4.0'
  | 'CC BY-NC 4.0'
  | 'CC0 1.0'
  | 'Public Domain'
  | 'Written Permission'
  | 'Custom Terms'
  | 'Unknown';

export type RemoteAvailabilityStatus =
  | 'FULL'
  | 'PARTIAL'
  | 'API_DEPENDENT'
  | 'NONE'
  | 'UNKNOWN';

export type LocalCacheStatus =
  | 'CACHED'
  | 'UNCACHED'
  | 'NOT_APPLICABLE';

/**
 * Granular, traceable metadata for the canonical original religious source
 */
export interface CanonicalSourceProvenance {
  /** Exact canonical work title */
  exactWorkTitle?: string;
  /** Exact edition or version identification */
  editionAndVersion?: string;
  /** Name of the canonical source institution or standard recension */
  originalSource: string;
  /** Original sacred language (e.g. Classical Arabic, Biblical Hebrew, Sanskrit, Gurmukhi, Pali, Prakrit) */
  language: string;
  /** Primary script used for original text (e.g. Arabic Uthmani, Hebrew Square, Devanagari, Gurmukhi) */
  script: string;
  /** Precise historical or theological recension */
  recensionEdition: string;
  /** Primary source URL or scholarly repository */
  primarySourceUrl?: string;
  /** Identifiable web or scholarly source reference URL (alias for primarySourceUrl) */
  sourceReferenceUrl?: string;
  /** Descriptive licence summary */
  license: string;
  /** Controlled formal licence classification */
  exactLicenceIdentifier: ControlledLicenceIdentifier;
  /** Formal copyright holder or custodial institution */
  copyrightHolderOrPublisher?: string;
  /** Documented rights holder, traditional custodian, or publishing institution (alias) */
  rightsHolderOrPublisher: string;
  /** Formal rights classification status */
  rightsStatus: RightsStatus;
  /** Reference to exact licence document or written permission agreement */
  exactLicenceOrPermissionDoc?: string;
  /** ISO date of verification audit */
  verificationDate?: string;
  /** Attribution requirement text */
  attributionRequirement: string;
  /** Commercial usage permission flag */
  commercialUsePermission: boolean;
  /** Non-commercial restriction details or flag */
  nonCommercialRestrictions?: boolean | string;
  /** Non-commercial restriction flag (alias) */
  nonCommercialRestriction: boolean;
  /** Textual modification permission flag (strictly false for sacred scriptures) */
  modificationPermission: boolean;
  /** Redistribution permission flag */
  redistributionPermission: boolean;
  /** Explicit permission to bundle in client application offline storage */
  offlineBundlingPermission: boolean;
  /** Specific territorial or jurisdictional limitations (e.g. UK Crown Copyright) */
  geographicRestrictions?: string;
  /** Name of reviewer, date, and verifiable documentary evidence summary */
  rightsReviewerAndEvidence?: string;
  /** Required verbatim copyright notice */
  requiredCopyrightNotice: string;
  /** Verification audit status */
  verificationStatus: VerificationStatus;
  /** ISO date of last scholarly verification (alias) */
  lastVerified: string;
}

/**
 * Granular, traceable metadata for displayed translations
 */
export interface TranslationProvenanceRecord {
  /** Identifier for translation record */
  id: string;
  /** Exact work title of the translation */
  exactWorkTitle?: string;
  /** Exact edition, version, or printing */
  editionAndVersion?: string;
  /** Name of the scholarly translator or translation committee */
  translator: string;
  /** Formal translation work title or publication edition */
  translationEdition: string;
  /** Target translation language (e.g. English, Urdu, Hindi) */
  targetLanguage: string;
  /** Year or publication reference */
  publicationReference?: string;
  /** Primary source URL or scholarly repository */
  primarySourceUrl?: string;
  /** Identifiable scholarly or public repository URL (alias) */
  sourceReferenceUrl?: string;
  /** Descriptive licence summary */
  license: string;
  /** Controlled formal licence classification */
  exactLicenceIdentifier: ControlledLicenceIdentifier;
  /** Formal copyright holder or publisher */
  copyrightHolderOrPublisher?: string;
  /** Documented rights holder, estate, or publishing house (alias) */
  rightsHolderOrPublisher: string;
  /** Formal rights classification status */
  rightsStatus: RightsStatus;
  /** Reference to exact licence document or written permission agreement */
  exactLicenceOrPermissionDoc?: string;
  /** ISO date of verification audit */
  verificationDate?: string;
  /** Attribution requirement text */
  attributionRequirement: string;
  /** Commercial usage permission flag */
  commercialUsePermission: boolean;
  /** Non-commercial restriction details or flag */
  nonCommercialRestrictions?: boolean | string;
  /** Non-commercial restriction flag (alias) */
  nonCommercialRestriction: boolean;
  /** Textual modification permission flag */
  modificationPermission: boolean;
  /** Redistribution permission flag */
  redistributionPermission: boolean;
  /** Explicit permission to bundle in client application offline storage */
  offlineBundlingPermission: boolean;
  /** Specific territorial or jurisdictional limitations (e.g. UK Crown Copyright) */
  geographicRestrictions?: string;
  /** Name of reviewer, date, and verifiable documentary evidence summary */
  rightsReviewerAndEvidence?: string;
  /** Required verbatim copyright notice */
  requiredCopyrightNotice: string;
  /** Verification audit status */
  verificationStatus: VerificationStatus;
}

/**
 * Authoritative Collection Coverage Record
 * Strictly enforces that unit counts are comparable and never divides disparate unit types.
 * Distinguishes offline bundled units from remote dynamic availability.
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
  /** Actual number of searchable / readable units currently indexed in this record */
  indexedUnits: number;
  /** Authoritative total units within the explicitly defined scope (or 'UNKNOWN') */
  totalUnitsInScope: number | 'UNKNOWN';
  /** Overall coverage availability classification */
  availabilityStatus: CoverageAvailabilityStatus;
  /** Legacy/primary storage mechanism descriptor */
  storageType: CoverageStorageType;

  // --- Granular Storage & Remote Architecture (Phase 6.3.3) ---
  /** Explicit offline coverage availability status */
  offlineCoverageStatus: CoverageAvailabilityStatus;
  /** Actual number of units bundled offline in local build */
  offlineIndexedUnits: number;
  /** Total units within offline scope (or total canonical denominator) */
  offlineTotalUnits: number | 'UNKNOWN';
  /** Remote dynamic content availability status */
  remoteAvailabilityStatus: RemoteAvailabilityStatus;
  /** Name of the external dynamic provider (e.g. 'UmmahAPI', 'Bolls Life API', 'BaniDB') */
  remoteProvider?: string;
  /** Remote API endpoint or authoritative data source */
  remoteEndpointOrSource?: string;
  /** Remote available content scope definition */
  remoteContentScope?: string;
  /** Local client caching status */
  localCacheStatus: LocalCacheStatus;
  /** ISO date/timestamp of last verified fetch */
  lastSuccessfulFetch?: string;
  /** Explicit deterministic fallback behavior when network is unavailable */
  fallbackBehaviour: string;

  // --- Canonical Numbering Conventions & Cross-References (Phase 6.3.3) ---
  /** Primary canonical numbering convention used by the platform */
  numberingConvention?: string;
  /** Explicit cross-reference note for traditions with alternate recension counting */
  alternateNumberingCrossReference?: string;

  /** Traceable original source provenance */
  canonicalSource: CanonicalSourceProvenance;
  /** Traceable translation provenance records */
  translations: TranslationProvenanceRecord[];
  /** Detailed transparent notes explaining exact boundaries */
  scopeNotes: string;
}
