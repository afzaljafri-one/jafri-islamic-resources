/**
 * ============================================================================
 * JAFRI SACRED AUDIO LIBRARY — PLATFORM DOMAIN TYPES & STATUS SCHEMA
 * Stage Gate 5.4A: Static Master Catalogue Implementation
 * Authoritative Standards: ISO 15924:2022, Berne Convention, WIPO WPPT
 * ============================================================================
 */

// ----------------------------------------------------------------------------
// 1. Sacred Tradition Identifiers
// ----------------------------------------------------------------------------
export type TraditionId =
  | 'islam'
  | 'hinduism'
  | 'buddhism'
  | 'jainism'
  | 'sikhism'
  | 'christianity'
  | 'judaism';

export const ALL_TRADITION_IDS: readonly TraditionId[] = [
  'islam',
  'hinduism',
  'buddhism',
  'jainism',
  'sikhism',
  'christianity',
  'judaism'
] as const;

export const TRADITION_NAMES: Record<TraditionId, string> = {
  islam: 'Islam',
  hinduism: 'Hinduism',
  buddhism: 'Buddhism',
  jainism: 'Jainism',
  sikhism: 'Sikhism',
  christianity: 'Christianity',
  judaism: 'Judaism'
};

// ----------------------------------------------------------------------------
// 2. ISO 15924 Script Code Registry & Runtime Validator
// Source: Unicode Consortium / ISO 15924 Registration Authority (iso15924.txt)
// ----------------------------------------------------------------------------
export interface IsoScriptDefinition {
  code: string;
  numericCode: string;
  canonicalName: string;
  pva?: string;
  direction: 'ltr' | 'rtl';
}

export type RegisteredIsoScriptCode =
  | 'Arab' // 160 - Arabic (Uthmani / Naskh)
  | 'Aran' // 161 - Arabic (Nastaliq variant)
  | 'Armn' // 230 - Armenian
  | 'Beng' // 325 - Bengali (Bangla)
  | 'Brah' // 300 - Brahmi
  | 'Cyrl' // 220 - Cyrillic
  | 'Deva' // 315 - Devanagari (Nagari)
  | 'Geor' // 240 - Georgian (Mkhedruli and Mtavruli)
  | 'Grek' // 200 - Greek
  | 'Gujr' // 320 - Gujarati
  | 'Guru' // 310 - Gurmukhi
  | 'Hani' // 500 - Han (Hanzi, Kanji, Hanja)
  | 'Hans' // 501 - Han (Simplified variant)
  | 'Hant' // 502 - Han (Traditional variant)
  | 'Hebr' // 125 - Hebrew
  | 'Knda' // 345 - Kannada
  | 'Latn' // 215 - Latin
  | 'Mlym' // 347 - Malayalam
  | 'Taml' // 346 - Tamil
  | 'Telu' // 340 - Telugu
  | 'Tibt' // 330 - Tibetan
  | 'Zxxx' // 997 - Code for unwritten documents
  | 'Zyyy' // 998 - Code for undetermined script
  | 'Zzzz'; // 999 - Code for uncoded script

export type IsoScriptCode = RegisteredIsoScriptCode | (string & {});

export const ISO_15924_REGISTRY: Record<RegisteredIsoScriptCode, IsoScriptDefinition> = {
  Arab: { code: 'Arab', numericCode: '160', canonicalName: 'Arabic', pva: 'Arabic', direction: 'rtl' },
  Aran: { code: 'Aran', numericCode: '161', canonicalName: 'Arabic (Nastaliq variant)', pva: 'Nastaliq', direction: 'rtl' },
  Armn: { code: 'Armn', numericCode: '230', canonicalName: 'Armenian', pva: 'Armenian', direction: 'ltr' },
  Beng: { code: 'Beng', numericCode: '325', canonicalName: 'Bengali (Bangla)', pva: 'Bengali', direction: 'ltr' },
  Brah: { code: 'Brah', numericCode: '300', canonicalName: 'Brahmi', pva: 'Brahmi', direction: 'ltr' },
  Cyrl: { code: 'Cyrl', numericCode: '220', canonicalName: 'Cyrillic', pva: 'Cyrillic', direction: 'ltr' },
  Deva: { code: 'Deva', numericCode: '315', canonicalName: 'Devanagari (Nagari)', pva: 'Devanagari', direction: 'ltr' },
  Geor: { code: 'Geor', numericCode: '240', canonicalName: 'Georgian (Mkhedruli and Mtavruli)', pva: 'Georgian', direction: 'ltr' },
  Grek: { code: 'Grek', numericCode: '200', canonicalName: 'Greek', pva: 'Greek', direction: 'ltr' },
  Gujr: { code: 'Gujr', numericCode: '320', canonicalName: 'Gujarati', pva: 'Gujarati', direction: 'ltr' },
  Guru: { code: 'Guru', numericCode: '310', canonicalName: 'Gurmukhi', pva: 'Gurmukhi', direction: 'ltr' },
  Hani: { code: 'Hani', numericCode: '500', canonicalName: 'Han (Hanzi, Kanji, Hanja)', pva: 'Han', direction: 'ltr' },
  Hans: { code: 'Hans', numericCode: '501', canonicalName: 'Han (Simplified variant)', pva: 'Han (Simplified variant)', direction: 'ltr' },
  Hant: { code: 'Hant', numericCode: '502', canonicalName: 'Han (Traditional variant)', pva: 'Han (Traditional variant)', direction: 'ltr' },
  Hebr: { code: 'Hebr', numericCode: '125', canonicalName: 'Hebrew', pva: 'Hebrew', direction: 'rtl' },
  Knda: { code: 'Knda', numericCode: '345', canonicalName: 'Kannada', pva: 'Kannada', direction: 'ltr' },
  Latn: { code: 'Latn', numericCode: '215', canonicalName: 'Latin', pva: 'Latin', direction: 'ltr' },
  Mlym: { code: 'Mlym', numericCode: '347', canonicalName: 'Malayalam', pva: 'Malayalam', direction: 'ltr' },
  Taml: { code: 'Taml', numericCode: '346', canonicalName: 'Tamil', pva: 'Tamil', direction: 'ltr' },
  Telu: { code: 'Telu', numericCode: '340', canonicalName: 'Telugu', pva: 'Telugu', direction: 'ltr' },
  Tibt: { code: 'Tibt', numericCode: '330', canonicalName: 'Tibetan', pva: 'Tibetan', direction: 'ltr' },
  Zxxx: { code: 'Zxxx', numericCode: '997', canonicalName: 'Code for unwritten documents', pva: 'Unwritten', direction: 'ltr' },
  Zyyy: { code: 'Zyyy', numericCode: '998', canonicalName: 'Code for undetermined script', pva: 'Common', direction: 'ltr' },
  Zzzz: { code: 'Zzzz', numericCode: '999', canonicalName: 'Code for uncoded script', pva: 'Unknown', direction: 'ltr' }
};

export function isValidIso15924ScriptCode(code: string): code is RegisteredIsoScriptCode {
  return typeof code === 'string' && Object.prototype.hasOwnProperty.call(ISO_15924_REGISTRY, code);
}

export function validateScriptCode(code: string): {
  isValid: boolean;
  definition?: IsoScriptDefinition;
  error?: string;
} {
  if (!code || typeof code !== 'string') {
    return { isValid: false, error: 'Script code must be a non-empty string.' };
  }
  if (isValidIso15924ScriptCode(code)) {
    return { isValid: true, definition: ISO_15924_REGISTRY[code] };
  }
  return {
    isValid: false,
    error: `Unknown ISO 15924 script code '${code}'. Not registered in authoritative 24-entry registry.`
  };
}

// ----------------------------------------------------------------------------
// 3. Operational Cohorts & Status Enums
// ----------------------------------------------------------------------------
export type AudioRequirementCohort =
  | 'TEXT_CARD'                            // 4 Preserved scripture text resources without audio
  | 'LOCAL_PHYSICAL'                       // 11 Physical local audio files (9 playable, 2 blocked)
  | 'ACCEPTED_YOUTUBE'                     // 28 Accepted YouTube candidates awaiting integration (Gate 5.4D)
  | 'SOURCE_AVAILABLE_PERMISSION_REQUIRED' // 24 Requirements where source is identified but written permission is pending
  | 'PENDING_DISCOVERY';                   // 584 Requirements awaiting genuine audio discovery

export type PlaybackProviderType =
  | 'NONE'               // Text cards or permission required (no active audio)
  | 'LOCAL_HTML5'        // Rights-cleared local audio files
  | 'YOUTUBE_EMBED'      // Accepted YouTube embedded streams
  | 'PENDING';           // Undiscovered requirements

export type AudioAvailabilityState =
  | 'TEXT_CARD'                            // Non-audio text resource
  | 'AVAILABLE_VERIFIED'                   // Rights-cleared and playable now
  | 'AWAITING_PERMISSION'                  // Physical file preserved on disk but blocked pending permission
  | 'AWAITING_APP_INTEGRATION'             // Human review PASS, awaiting Gate 5.4D YouTube integration
  | 'SOURCE_AVAILABLE_PERMISSION_REQUIRED' // Source identified but written streaming permission required
  | 'PENDING_DISCOVERY';                   // Genuine recording not yet discovered

export type RightsClassification =
  | 'OPEN_COMMONS_VERIFIED'                // Permissive CC-BY-SA or CC-BY verified
  | 'CC0_DEDICATION_VERIFIED'              // Dedicated to public domain under CC0 1.0 Universal
  | 'PUBLIC_DOMAIN_VERIFIED'               // Historic public domain sound recording
  | 'OPEN_QURANIC_WAQF_EDUCATIONAL'        // YouTube stream permitted under educational terms
  | 'UNRESOLVED_NEIGHBORING_RIGHTS'        // LibriVox: lack of civil-law neighboring rights waiver
  | 'AWAITING_PERMISSION'                  // Preserved file awaiting legal rights clearance
  | 'SOURCE_AVAILABLE_PERMISSION_REQUIRED' // Identified source awaiting bilateral written streaming permission
  | 'PENDING_DISCOVERY'                    // Undiscovered recording (null rights)
  | 'NOT_APPLICABLE_TEXT_CARD';            // Non-audio text card

export type HumanReviewDecision =
  | 'PASS'
  | 'PARTIAL_REVIEW'
  | 'FAIL'
  | 'AWAITING_REVIEW'
  | 'NOT_APPLICABLE';

export type AttestationType =
  | 'USER_CONFIRMED_COMPLETE_HUMAN_REVIEW'
  | 'UNAUDITED'
  | 'NOT_APPLICABLE';

export type ScriptDisposition =
  | 'UNAMBIGUOUS_PRIMARY'
  | 'MULTIPLE_HISTORICAL'
  | 'TRANSLATION_FALLBACK';

// ----------------------------------------------------------------------------
// 4. Domain Metadata Interfaces
// ----------------------------------------------------------------------------
export interface SacredAudioRightsEvidence {
  exactLicense: string;
  licenseUrl?: string;
  rightsHolder?: string | null;
  performerName?: string | null;
  performerAttribution?: string | null;
  commercialStreamingCleared: boolean;
  rehostingPermission: boolean;
  directSourceEvidenceUrl?: string | null;
  secondarySourceEvidenceUrl?: string | null;
  provenanceNotes?: string | null;
  licenseReviewWarnings?: string | null;
  restrictionsOrConflicts?: string | null;
}

export interface SacredAudioPhysicalAsset {
  filePath: string;
  fileSizeBytes: number;
  format: string;
  codec: string;
  channels: number;
  sampleRateHz: number;
  nominalBitrateKbps?: number;
  sha256Hash?: string;
}

export interface SacredAudioYouTubeMetadata {
  videoId: string;
  watchUrl: string;
  embedUrl: string;
  channelTitle: string;
  channelId?: string;
  durationSeconds?: number;
  isOfficialChannel?: boolean;
}

export interface SacredAudioReviewEvidence {
  decision: HumanReviewDecision;
  attestation: AttestationType;
  coveragePercent: number;
  auditedDurationSeconds?: number | null;
  canonicalTextFollowed?: string | null;
  notes?: string | null;
  reviewDate?: string | null;
}

export interface SacredAudioRequirement {
  id: string; // REQ-TRAD-NNN
  tradition: TraditionId;
  collectionId: string;
  requirementTitle: string;
  language: string;
  scriptCode: IsoScriptCode;
  scriptDisposition: ScriptDisposition;
  cohort: AudioRequirementCohort;
  availability: AudioAvailabilityState;
  playbackProvider: PlaybackProviderType;
  rightsClassification: RightsClassification;
  isPlayable: boolean; // Strictly true ONLY for AVAILABLE_VERIFIED local assets
  catalogueBaselineDate: string; // '2026-11-21'
  lastAuditDate?: string | null;
  physicalAsset?: SacredAudioPhysicalAsset | null;
  youtubeMetadata?: SacredAudioYouTubeMetadata | null;
  rightsEvidence?: SacredAudioRightsEvidence | null;
  reviewEvidence?: SacredAudioReviewEvidence | null;
  notes?: string | null;
}

// ----------------------------------------------------------------------------
// 5. Collection Interfaces
// ----------------------------------------------------------------------------
export interface SacredAudioTraditionCollection {
  id: TraditionId;
  title: string;
  requirementIds: string[];
  totalRequirements: number;
  availableCount: number;
  blockedCount: number;
  awaitingIntegrationCount: number;
  permissionRequiredCount?: number;
  pendingDiscoveryCount: number;
  textCardCount: number;
}

export interface SacredAudioSubCollection {
  id: string;
  tradition: TraditionId;
  title: string;
  description: string;
  requirementIds: string[];
  requirementCount: number;
}

// ----------------------------------------------------------------------------
// 6. Invariant & Servability Validators
// ----------------------------------------------------------------------------
export function isRecordPlayable(req: SacredAudioRequirement): boolean {
  // Strict rule: A record is ONLY playable if it is a local physical asset that has been
  // verified and cleared with commercialStreamingCleared = true.
  // Blocked LibriVox assets, YouTube records awaiting integration, text cards, undiscovered
  // items, and permission-required items MUST NEVER return true.
  if (req.cohort !== 'LOCAL_PHYSICAL') {
    return false;
  }
  if (req.availability !== 'AVAILABLE_VERIFIED') {
    return false;
  }
  if (req.playbackProvider !== 'LOCAL_HTML5') {
    return false;
  }
  if (
    req.rightsClassification === 'UNRESOLVED_NEIGHBORING_RIGHTS' ||
    req.rightsClassification === 'AWAITING_PERMISSION' ||
    req.rightsClassification === 'SOURCE_AVAILABLE_PERMISSION_REQUIRED'
  ) {
    return false;
  }
  if (!req.rightsEvidence || !req.rightsEvidence.commercialStreamingCleared) {
    return false;
  }
  return true;
}

export function validateRequirementIntegrity(req: SacredAudioRequirement): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // 1. Script validation
  const scriptCheck = validateScriptCode(req.scriptCode);
  if (!scriptCheck.isValid) {
    errors.push(scriptCheck.error || `Invalid script code ${req.scriptCode}`);
  }

  // 2. Cohort consistency
  switch (req.cohort) {
    case 'TEXT_CARD':
      if (req.availability !== 'TEXT_CARD') errors.push(`Text card ${req.id} must have availability 'TEXT_CARD'`);
      if (req.playbackProvider !== 'NONE') errors.push(`Text card ${req.id} must have playbackProvider 'NONE'`);
      if (req.isPlayable !== false) errors.push(`Text card ${req.id} must have isPlayable false`);
      if (req.physicalAsset !== null && req.physicalAsset !== undefined) errors.push(`Text card ${req.id} cannot have physicalAsset`);
      if (req.youtubeMetadata !== null && req.youtubeMetadata !== undefined) errors.push(`Text card ${req.id} cannot have youtubeMetadata`);
      break;

    case 'LOCAL_PHYSICAL':
      if (!req.physicalAsset) {
        errors.push(`Local physical asset ${req.id} must define physicalAsset`);
      }
      if (req.availability === 'AVAILABLE_VERIFIED') {
        if (req.playbackProvider !== 'LOCAL_HTML5') errors.push(`Playable local asset ${req.id} must use LOCAL_HTML5 provider`);
        if (req.isPlayable !== true) errors.push(`Playable local asset ${req.id} must have isPlayable true`);
        if (!req.rightsEvidence || !req.rightsEvidence.commercialStreamingCleared) {
          errors.push(`Playable local asset ${req.id} must have commercialStreamingCleared true`);
        }
      } else if (req.availability === 'AWAITING_PERMISSION') {
        if (req.isPlayable !== false) errors.push(`Blocked local asset ${req.id} must have isPlayable false`);
        if (req.playbackProvider === 'LOCAL_HTML5') errors.push(`Blocked local asset ${req.id} cannot use LOCAL_HTML5 provider`);
      } else {
        errors.push(`Local asset ${req.id} has invalid availability '${req.availability}'`);
      }
      break;

    case 'ACCEPTED_YOUTUBE':
      if (req.availability !== 'AWAITING_APP_INTEGRATION') {
        errors.push(`YouTube asset ${req.id} must have availability 'AWAITING_APP_INTEGRATION'`);
      }
      if (req.playbackProvider !== 'YOUTUBE_EMBED') {
        errors.push(`YouTube asset ${req.id} must have playbackProvider 'YOUTUBE_EMBED'`);
      }
      if (req.isPlayable !== false) {
        errors.push(`YouTube asset ${req.id} cannot be marked playable prior to Gate 5.4D integration`);
      }
      if (!req.youtubeMetadata) {
        errors.push(`YouTube asset ${req.id} must define youtubeMetadata`);
      }
      if (req.physicalAsset !== null && req.physicalAsset !== undefined) {
        errors.push(`YouTube asset ${req.id} cannot define physicalAsset`);
      }
      break;

    case 'SOURCE_AVAILABLE_PERMISSION_REQUIRED':
      if (req.availability !== 'SOURCE_AVAILABLE_PERMISSION_REQUIRED') {
        errors.push(`Permission required asset ${req.id} must have availability 'SOURCE_AVAILABLE_PERMISSION_REQUIRED'`);
      }
      if (req.playbackProvider !== 'NONE') {
        errors.push(`Permission required asset ${req.id} must have playbackProvider 'NONE'`);
      }
      if (req.isPlayable !== false) {
        errors.push(`Permission required asset ${req.id} must have isPlayable false`);
      }
      if (req.physicalAsset !== null && req.physicalAsset !== undefined) {
        errors.push(`Permission required asset ${req.id} cannot have physicalAsset`);
      }
      if (req.youtubeMetadata !== null && req.youtubeMetadata !== undefined) {
        errors.push(`Permission required asset ${req.id} cannot have youtubeMetadata`);
      }
      if (!req.rightsEvidence) {
        errors.push(`Permission required asset ${req.id} must have rightsEvidence preserving source and permission details`);
      }
      if (req.rightsEvidence && req.rightsEvidence.commercialStreamingCleared !== false) {
        errors.push(`Permission required asset ${req.id} cannot have commercialStreamingCleared true`);
      }
      break;

    case 'PENDING_DISCOVERY':
      if (req.availability !== 'PENDING_DISCOVERY') errors.push(`Pending asset ${req.id} must have availability 'PENDING_DISCOVERY'`);
      if (req.playbackProvider !== 'PENDING') errors.push(`Pending asset ${req.id} must have playbackProvider 'PENDING'`);
      if (req.isPlayable !== false) errors.push(`Pending asset ${req.id} must have isPlayable false`);
      if (req.physicalAsset !== null && req.physicalAsset !== undefined) errors.push(`Pending asset ${req.id} cannot have physicalAsset`);
      if (req.youtubeMetadata !== null && req.youtubeMetadata !== undefined) errors.push(`Pending asset ${req.id} cannot have youtubeMetadata`);
      if (req.rightsEvidence !== null && req.rightsEvidence !== undefined) errors.push(`Pending asset ${req.id} cannot have rightsEvidence`);
      if (req.lastAuditDate !== null && req.lastAuditDate !== undefined) errors.push(`Pending asset ${req.id} cannot have lastAuditDate`);
      break;
  }

  // 3. Playable synchronization
  if (req.isPlayable !== isRecordPlayable(req)) {
    errors.push(`Record ${req.id} isPlayable (${req.isPlayable}) does not match isRecordPlayable() (${isRecordPlayable(req)})`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
