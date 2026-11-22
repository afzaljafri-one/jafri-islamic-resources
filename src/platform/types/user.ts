// ==============================================================================
// Common Platform User Data Models (Local-First, No Mandatory Auth)
// Jafri Religious Books & Audio Platform — Phase 0
// ==============================================================================

import { ReligionId } from './religion';
import { CanonicalAddress } from './scripture';

/**
 * Universal User Bookmark Item
 */
export interface UniversalBookmark {
  id: string; // UUID or deterministic string hash
  religionId: ReligionId;
  collectionId: string;
  address: CanonicalAddress;
  displayTitle: string; // Human-readable citation, e.g. "Genesis 1:1" or "Bhagavad Gita 2:47"
  displaySubtitle?: string; // Optional context, e.g. "Creation of the Heavens"
  snippetRootText: string;
  snippetTranslatedText?: string;
  savedAtTimestamp: number;
  userNotes?: string;
}

/**
 * Universal Reading Progress State
 */
export interface ReadingProgress {
  religionId: ReligionId;
  collectionId: string;
  lastAddress: CanonicalAddress;
  displayLocation: string; // e.g., "Ang 42" or "John 3:16"
  percentageCompleted?: number;
  updatedAtTimestamp: number;
}

/**
 * Universal Typography & Reading Preferences
 */
export interface UserReadingPreferences {
  fontSizeRem: number; // 0.875 to 2.5
  themeMode: 'default' | 'sepia' | 'dark' | 'night-onyx';
  displayMode: 'side-by-side' | 'stacked' | 'root-only' | 'translation-only';
  showTransliteration: boolean;
  showWordByWord: boolean;
  autoScrollAudio: boolean;
  playbackSpeed: number; // 0.75, 1.0, 1.25, 1.5, 2.0
}
