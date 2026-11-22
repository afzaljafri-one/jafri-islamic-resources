// ==============================================================================
// Common Platform Scripture Data Models
// Accommodates diverse scriptural hierarchies across seven world religions
// Jafri Religious Books & Audio Platform — Phase 0
// ==============================================================================

import { ReligionId, TextDirection } from './religion';

/**
 * Strict Provenance & Licensing Metadata.
 * In accordance with Product Principle #10, AI-generated scripture is strictly forbidden.
 */
export interface ProvenanceMetadata {
  sourceName: string;
  sourceUrl: string;
  licenseType:
    | 'Public Domain'
    | 'Creative Commons Zero (CC0)'
    | 'Creative Commons Attribution (CC-BY)'
    | 'Creative Commons Non-Commercial (CC-BY-NC)'
    | 'Open Religious License'
    | 'Authorized Academic Distribution';
  licenseUrl?: string;
  attributionText: string;
  isAiGenerated: false; // Must strictly be false across all records
  verifiedDate: string; // ISO format date of verification
}

/**
 * Translation & Commentary Edition Metadata
 */
export interface TranslationMetadata {
  id: string; // e.g., 'en.kjv', 'en.sivananda', 'en.sujato', 'ur.jawadi'
  languageCode: string; // ISO 639-1 code ('en', 'ur', 'hi', 'pa', 'he', etc.)
  languageName: string;
  editionTitle: string;
  translatorOrAuthor: string;
  publicationYear?: number;
  direction: TextDirection;
  provenance: ProvenanceMetadata;
}

/**
 * Audio Track & Recitation Metadata
 */
export interface AudioMetadata {
  id: string;
  title: string;
  performerOrReciter: string;
  performerTradition?: string; // e.g., 'Damdami Taksal', 'Vedic Chanting Shakha', 'Ashkenazi Cantillation'
  streamUrl: string;
  durationMs?: number;
  format: 'mp3' | 'aac' | 'ogg' | 'm4a';
  provenance: ProvenanceMetadata;
}

/**
 * Definition of a single level in the scripture hierarchy
 * Examples:
 * - Bible: ['Testament', 'Book', 'Chapter', 'Verse']
 * - Gita: ['Adhyaya (Chapter)', 'Shloka (Verse)']
 * - Tanakh: ['Division', 'Book', 'Chapter', 'Verse']
 * - SGGS: ['Raag', 'Ang (Page)', 'Shabad (Hymn)', 'Tuk (Line)']
 * - Tipitaka: ['Pitaka', 'Nikaya', 'Sutta', 'Segment']
 * - Jain Agamas: ['Collection', 'Agama', 'Section', 'Sutra']
 */
export interface HierarchyLevelDefinition {
  levelIndex: number;
  name: string; // e.g., 'Book', 'Ang', 'Sutta'
  nativeName?: string; // e.g., 'अध्याय', 'ਅੰਗ', 'פרק', 'سورة'
  isTerminalUnit: boolean; // True if this level represents the atomic readable verse/shloka/sutra
}

/**
 * Canonical Address pointing to an exact scripture unit
 */
export interface CanonicalAddress {
  religionId: ReligionId;
  collectionId: string;
  path: Array<{
    levelName: string;
    identifier: string | number; // e.g., 'Genesis', 1, 1430
    label?: string; // e.g., 'First Ang', 'Bereshit'
  }>;
  unitIdentifier: string | number; // e.g., verse number, shloka number, tuk number
}

/**
 * Word-level token for grammatical or vocabulary analysis
 */
export interface ScriptureWordToken {
  position: number;
  original: string;
  transliteration?: string;
  translation: string;
  morphologyNote?: string;
}

/**
 * Atomic Scripture Unit (Verse, Shloka, Sutra, Tuk, Segment)
 */
export interface ScriptureUnit {
  id: string; // Unique global string ID, e.g. 'christianity/bible-kjv/genesis/1/1'
  address: CanonicalAddress;
  rootText: string; // Native text in original script
  rootScript: string;
  transliteration?: string; // Optional phonetic transliteration (e.g. IAST, Roman Gurmukhi)
  translations: Record<string, string>; // translationId -> translated string
  commentaries?: Record<string, string>; // commentaryId -> scholarly exposition
  words?: ScriptureWordToken[];
  audioTiming?: {
    startMs: number;
    endMs: number;
  };
}

/**
 * Scripture Collection (e.g., 'Holy Bible', 'Bhagavad Gita', 'Sri Guru Granth Sahib', 'Pali Tipitaka')
 */
export interface ScriptureCollection {
  id: string;
  religionId: ReligionId;
  title: string;
  nativeTitle: string;
  description: string;
  hierarchyLevels: HierarchyLevelDefinition[];
  defaultTranslationId: string;
  availableTranslations: TranslationMetadata[];
  availableAudioReciters: AudioMetadata[];
  totalUnitsCount?: number;
  provenance: ProvenanceMetadata;
}
