// ==============================================================================
// Common Platform Provider Adapter Interfaces
// Jafri Religious Books & Audio Platform — Phase 0
// ==============================================================================

import { ReligionId } from './religion';
import {
  CanonicalAddress,
  ScriptureCollection,
  ScriptureUnit,
  TranslationMetadata,
} from './scripture';

/**
 * Node in a hierarchical Table of Contents navigation tree
 */
export interface NavigationNode {
  id: string | number;
  levelIndex: number;
  levelName: string; // e.g., 'Testament', 'Book', 'Chapter', 'Ang', 'Sutta'
  title: string;
  nativeTitle?: string;
  hasChildren: boolean;
  children?: NavigationNode[];
  unitCount?: number;
  targetAddress?: CanonicalAddress;
}

/**
 * Search Query Options
 */
export interface SearchOptions {
  translationId?: string;
  searchRootText?: boolean;
  searchTranslation?: boolean;
  searchTransliteration?: boolean;
  scopePath?: string[]; // Limit search to a specific book or section
  maxResults?: number;
}

/**
 * Search Result Match
 */
export interface SearchResultMatch {
  unitId: string;
  address: CanonicalAddress;
  displayTitle: string;
  matchedField: 'root' | 'translation' | 'transliteration';
  matchedSnippet: string;
  highlightIndices?: [number, number]; // Start and end offsets for highlighting
}

/**
 * Pluggable Scripture Provider Adapter Interface
 * All religion modules implement this contract to connect to their data layer
 */
export interface ScriptureProviderAdapter {
  readonly religionId: ReligionId;

  /**
   * Returns metadata for all collections available under this religion
   */
  getCollections(): Promise<ScriptureCollection[]>;

  /**
   * Returns the hierarchical navigation tree for a specific collection
   */
  getNavigationTree(collectionId: string): Promise<NavigationNode[]>;

  /**
   * Fetches an array of scripture units at a specific section or address
   */
  getScriptureUnits(address: CanonicalAddress): Promise<ScriptureUnit[]>;

  /**
   * Returns available translations for a collection
   */
  getTranslations(collectionId: string): Promise<TranslationMetadata[]>;

  /**
   * Executes a text search query across scripture units
   */
  search(query: string, collectionId: string, options?: SearchOptions): Promise<SearchResultMatch[]>;

  /**
   * Resolves audio URL for a specific scripture unit or chapter
   */
  getAudioUrl?(unit: ScriptureUnit, reciterId?: string): Promise<string | null>;
}
