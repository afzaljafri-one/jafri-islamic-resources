/**
 * ============================================================================
 * JAFRI RELIGIOUS RESOURCES — CONTEXTUAL AUDIO MATCHER
 * Universal Synchronization Bridge to Authoritative Linkage Registry
 * Stage Gate: One Universal Synchronization Architecture across All Seven Religions
 * ============================================================================
 */

import type { SacredAudioRequirement, TraditionId } from '../types/sacredAudio';
import type {
  CanonicalReadingContext,
  MatchScopeLevel,
  ReadingContext,
} from '../types/readingContext';
import {
  SACRED_AUDIO_MASTER_CATALOGUE,
} from '../data/sacredAudioMasterCatalogue';
import {
  resolveReadingAudioMatches,
  isRequirementPlayable,
  UniversalMatchResult,
} from './readingAudioLinkageRegistry';

export type { ReadingContext, CanonicalReadingContext, MatchScopeLevel };
export { isRequirementPlayable };

export interface ContextualAudioResult {
  matchLevel: MatchScopeLevel;
  scopeLabel: string;
  primaryMatches: SacredAudioRequirement[];
  additionalRecordings: SacredAudioRequirement[];
  totalAvailableForTradition: number;
  hasDirectMatch: boolean;
  message?: string;
  activeReadingTitle: string;
}

/**
 * Normalizes input string for robust comparisons
 */
function normalize(str: string | number | undefined | null): string {
  if (str === undefined || str === null) return '';
  return String(str).toLowerCase().replace(/['"’‘\-–—\s]+/g, ' ').trim();
}

/**
 * Retrieves all approved playable recordings for a given religion/tradition.
 */
export function getApprovedRecordingsForTradition(
  traditionId: TraditionId | string
): SacredAudioRequirement[] {
  const normTrad = normalize(traditionId);
  return SACRED_AUDIO_MASTER_CATALOGUE.filter((req) => {
    return normalize(req.tradition) === normTrad && isRequirementPlayable(req);
  });
}

/**
 * Universal Contextual Audio Matcher
 * Maps CanonicalReadingContext to verified master catalogue requirements through
 * the authoritative declarative Reading-to-Audio Linkage Registry.
 */
export function matchContextualAudio(context: CanonicalReadingContext): ContextualAudioResult {
  const res: UniversalMatchResult = resolveReadingAudioMatches(context);

  return {
    matchLevel: res.matchLevel,
    scopeLabel: res.scopeLabel,
    primaryMatches: res.primaryMatches,
    additionalRecordings: res.relatedTraditionRecordings,
    totalAvailableForTradition: res.totalTraditionCount,
    hasDirectMatch: res.hasDirectMatch,
    message: res.message,
    activeReadingTitle: res.activeReadingTitle,
  };
}
