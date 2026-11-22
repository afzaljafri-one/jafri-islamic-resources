// ==============================================================================
// Quran Audio Service - Type Definitions
// Milestone M3.5 & M3.5 Enhancement
// ==============================================================================

export type AudioPlayerStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export type PlaybackScope = 'page' | 'surah';

export interface PageAyahBoundary {
  edition: '13-line' | '15-line';
  pageNumber: number;
  surahNumber: number;
  startAyah: number;
  endAyah: number;
  isVerified: boolean;
  isDuaKhatmOnly?: boolean;
  isFrontMatter?: boolean;
  availableSurahsOnPage?: {
    surahNumber: number;
    surahName: string;
    startAyah: number;
    endAyah: number;
  }[];
  notes?: string;
}

export interface ReciterConfig {
  id: string;
  name: string;
  nameArabic: string;
  style: 'Murattal' | 'Mujawwad';
  providerFolder: string;
  bitrate: string;
  isDefault?: boolean;
}

export interface AudioPlayerState {
  status: AudioPlayerStatus;
  currentSurahNumber: number;
  currentSurahName: string;
  currentAyahNumber: number;
  totalAyahs: number;
  reciterId: string;
  currentTime: number;
  duration: number;
  playbackSpeed: number;
  autoAdvance: boolean;
  errorMessage: string | null;
  activeAudioUrl: string | null;
  // M3.5 Page-Bounded Recitation Extensions
  playbackScope: PlaybackScope;
  pageBoundary: PageAyahBoundary | null;
  pageRecitationCompleted: boolean;
  completionMessage: string | null;
}

export interface AudioProvider {
  id: string;
  name: string;
  baseUrl: string;
  getAyahAudioUrl(surah: number, ayah: number, reciterId: string): string;
  isReciterSupported(reciterId: string): boolean;
}

export interface AudioPlayRequest {
  surahNumber: number;
  surahName?: string;
  totalAyahs?: number;
  ayahNumber?: number;
  reciterId?: string;
  autoPlay?: boolean;
}
