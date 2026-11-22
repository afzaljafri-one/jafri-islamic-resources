/**
 * ============================================================================
 * JAFRI SACRED AUDIO LIBRARY — UNIFIED PLAYBACK SERVICE
 * Stage Gate 5.4B: Concurrency & State Orchestrator
 * Single Coordinator for Local HTML5 and YouTube Embedded Audio
 * ============================================================================
 *
 * Strict Architectural Segregation:
 * - Completely decoupled from QuranReader, quranAudioService, and Islam M4.
 * - Single-track playback lock across all Sacred Audio Library providers.
 * - Anti-leak enforcement: Strictly blocks unpermitted local assets (e.g. LibriVox).
 */

import type {
  SacredAudioRequirement,
  PlaybackProviderType
} from '../types/sacredAudio';
import { isApprovedPublicYouTubeId } from '../data/sacredAudioMasterCatalogue';
import { resolveAudioUrl } from '../utils/audioUrlResolver';

export interface SacredAudioPlaybackState {
  currentRequirement: SacredAudioRequirement | null;
  status: 'IDLE' | 'LOADING' | 'PLAYING' | 'PAUSED' | 'ERROR' | 'ENDED';
  activeProvider: PlaybackProviderType;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  errorMessage: string | null;
  resolvedMediaUrl: string | null;
}

export type PlaybackListener = (state: SacredAudioPlaybackState) => void;

export class UnifiedSacredAudioService {
  private static instance: UnifiedSacredAudioService | null = null;
  private audio: HTMLAudioElement | null = null;
  private listeners: Set<PlaybackListener> = new Set();

  private state: SacredAudioPlaybackState = {
    currentRequirement: null,
    status: 'IDLE',
    activeProvider: 'NONE',
    currentTime: 0,
    duration: 0,
    volume: 1.0,
    isMuted: false,
    errorMessage: null,
    resolvedMediaUrl: null
  };

  private constructor() {
    this.initAudioElement();
  }

  public static getInstance(): UnifiedSacredAudioService {
    if (!UnifiedSacredAudioService.instance) {
      UnifiedSacredAudioService.instance = new UnifiedSacredAudioService();
    }
    return UnifiedSacredAudioService.instance;
  }

  /**
   * Reset instance for test isolation
   */
  public static resetInstanceForTesting(): void {
    if (UnifiedSacredAudioService.instance) {
      UnifiedSacredAudioService.instance.stop();
      UnifiedSacredAudioService.instance.listeners.clear();
      UnifiedSacredAudioService.instance = null;
    }
  }

  private initAudioElement(): void {
    if (typeof window !== 'undefined' && typeof Audio !== 'undefined') {
      try {
        this.audio = new Audio();
        this.audio.preload = 'metadata';

        this.audio.addEventListener('timeupdate', () => {
          if (this.state.activeProvider === 'LOCAL_HTML5' && this.audio) {
            this.state.currentTime = this.audio.currentTime;
            this.notifyListeners();
          }
        });

        this.audio.addEventListener('durationchange', () => {
          if (this.state.activeProvider === 'LOCAL_HTML5' && this.audio) {
            this.state.duration = isNaN(this.audio.duration) ? 0 : this.audio.duration;
            this.notifyListeners();
          }
        });

        this.audio.addEventListener('play', () => {
          if (this.state.activeProvider === 'LOCAL_HTML5') {
            this.state.status = 'PLAYING';
            this.notifyListeners();
          }
        });

        this.audio.addEventListener('pause', () => {
          if (this.state.activeProvider === 'LOCAL_HTML5' && this.state.status !== 'ENDED') {
            this.state.status = 'PAUSED';
            this.notifyListeners();
          }
        });

        this.audio.addEventListener('ended', () => {
          if (this.state.activeProvider === 'LOCAL_HTML5') {
            this.state.status = 'ENDED';
            this.state.currentTime = 0;
            this.notifyListeners();
          }
        });

        this.audio.addEventListener('error', () => {
          if (this.state.activeProvider === 'LOCAL_HTML5') {
            const err = this.audio?.error;
            let msg = 'Failed to load or decode audio file.';
            if (err) {
              switch (err.code) {
                case MediaError.MEDIA_ERR_ABORTED:
                  msg = 'Playback aborted by user or browser.';
                  break;
                case MediaError.MEDIA_ERR_NETWORK:
                  msg = 'Network error during audio retrieval.';
                  break;
                case MediaError.MEDIA_ERR_DECODE:
                  msg = 'Audio decoding error occurred.';
                  break;
                case MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                  msg = 'Audio format not supported or media file not found.';
                  break;
              }
            }
            this.state.status = 'ERROR';
            this.state.errorMessage = msg;
            this.notifyListeners();
          }
        });
      } catch (err) {
        console.warn('[UnifiedSacredAudioService] Audio element initialization failed:', err);
      }
    }
  }

  public getState(): SacredAudioPlaybackState {
    return { ...this.state };
  }

  public subscribe(listener: PlaybackListener): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(): void {
    const currentState = this.getState();
    for (const listener of this.listeners) {
      try {
        listener(currentState);
      } catch (err) {
        console.error('[UnifiedSacredAudioService] Error in listener callback:', err);
      }
    }
  }

  /**
   * Resolves the runtime web URL for local physical assets.
   * Guarantees idempotent base path resolution under Vite dev and GitHub Pages.
   */
  public resolveLocalAudioUrl(filePath: string): string {
    return resolveAudioUrl(filePath);
  }

  /**
   * Primary playback initiator with strict anti-leak verification.
   */
  public async playRequirement(requirement: SacredAudioRequirement): Promise<void> {
    // 1. Anti-leak invariant check: NEVER serve blocked or unpermitted items
    if (
      requirement.availability === 'AWAITING_PERMISSION' ||
      requirement.availability === 'SOURCE_AVAILABLE_PERMISSION_REQUIRED' ||
      requirement.cohort === 'SOURCE_AVAILABLE_PERMISSION_REQUIRED' ||
      requirement.rightsClassification === 'SOURCE_AVAILABLE_PERMISSION_REQUIRED' ||
      requirement.rightsClassification === 'UNRESOLVED_NEIGHBORING_RIGHTS' ||
      (requirement.cohort === 'LOCAL_PHYSICAL' && !requirement.isPlayable)
    ) {
      this.stop();
      this.state.currentRequirement = requirement;
      this.state.status = 'ERROR';
      this.state.activeProvider = 'NONE';
      this.state.errorMessage =
        'BLOCKED_RIGHTS_ERROR: Recording is blocked pending legal permission and cannot be played.';
      this.notifyListeners();
      throw new Error(
        `BLOCKED_RIGHTS_ERROR: Requirement ${requirement.id} is blocked awaiting rights clearance.`
      );
    }

    // 2. Reject non-audio text cards
    if (requirement.cohort === 'TEXT_CARD' || requirement.availability === 'TEXT_CARD') {
      this.stop();
      this.state.currentRequirement = requirement;
      this.state.status = 'ERROR';
      this.state.activeProvider = 'NONE';
      this.state.errorMessage = 'NON_AUDIO_CARD: This sacred item is a preserved non-audio reference card.';
      this.notifyListeners();
      return;
    }

    // 3. Reject pending discovery requirements
    if (requirement.cohort === 'PENDING_DISCOVERY' || requirement.availability === 'PENDING_DISCOVERY') {
      this.stop();
      this.state.currentRequirement = requirement;
      this.state.status = 'ERROR';
      this.state.activeProvider = 'NONE';
      this.state.errorMessage =
        'PENDING_DISCOVERY: No authentic recording has been integrated for this requirement yet.';
      this.notifyListeners();
      return;
    }

    // 4. Handle Local HTML5 Playback (9 Rights-Cleared Assets)
    if (requirement.playbackProvider === 'LOCAL_HTML5') {
      if (!requirement.isPlayable || !requirement.physicalAsset) {
        this.stop();
        this.state.currentRequirement = requirement;
        this.state.status = 'ERROR';
        this.state.errorMessage = 'ASSET_ERROR: Missing physical audio asset configuration.';
        this.notifyListeners();
        return;
      }

      // Stop any existing playback first (single-track lock)
      this.stopInternalAudio();

      const mediaUrl = this.resolveLocalAudioUrl(requirement.physicalAsset.filePath);

      this.state = {
        currentRequirement: requirement,
        status: 'LOADING',
        activeProvider: 'LOCAL_HTML5',
        currentTime: 0,
        duration: 0,
        volume: this.audio ? this.audio.volume : this.state.volume,
        isMuted: this.audio ? this.audio.muted : this.state.isMuted,
        errorMessage: null,
        resolvedMediaUrl: mediaUrl
      };
      this.notifyListeners();

      if (this.audio) {
        try {
          this.audio.src = mediaUrl;
          this.audio.currentTime = 0;
          await this.audio.play();
          this.state.status = 'PLAYING';
          this.notifyListeners();
        } catch (playErr: any) {
          // Autoplay policy or media load failure
          if (playErr?.name !== 'AbortError') {
            this.state.status = 'ERROR';
            this.state.errorMessage = playErr?.message || 'Failed to start HTML5 playback.';
            this.notifyListeners();
          }
        }
      } else {
        // Node / mock fallback for testing
        this.state.status = 'PLAYING';
        this.notifyListeners();
      }
      return;
    }

    // 5. Handle YouTube Embed Stream (28 Approved & Tested YouTube Recordings)
    if (requirement.playbackProvider === 'YOUTUBE_EMBED') {
      // Release Gate: Public Release Gating
      // Only the 28 individually playback-tested and content-verified YouTube recordings are enabled for public streaming.
      // The other 112 candidates remain strictly gated pending independent content & CDP playback audits.
      if (!isApprovedPublicYouTubeId(requirement.id)) {
        this.stop();
        const msg = `UNVERIFIED_STREAM_GATE: Requirement ${requirement.id} is awaiting independent content verification and browser playback testing prior to public release.`;
        this.state.currentRequirement = requirement;
        this.state.status = 'ERROR';
        this.state.activeProvider = 'NONE';
        this.state.errorMessage = msg;
        this.notifyListeners();
        throw new Error(msg);
      }

      if (!requirement.youtubeMetadata?.videoId) {
        this.stop();
        this.state.currentRequirement = requirement;
        this.state.status = 'ERROR';
        this.state.errorMessage = 'YOUTUBE_ERROR: Missing YouTube video ID in metadata.';
        this.notifyListeners();
        return;
      }

      // Stop any local HTML5 audio immediately
      this.stopInternalAudio();

      this.state = {
        currentRequirement: requirement,
        status: 'PLAYING',
        activeProvider: 'YOUTUBE_EMBED',
        currentTime: 0,
        duration: 0,
        volume: 1.0,
        isMuted: false,
        errorMessage: null,
        resolvedMediaUrl: requirement.youtubeMetadata.embedUrl
      };
      this.notifyListeners();
      return;
    }

    // Fallback for unknown provider
    this.stop();
    this.state.errorMessage = `Unsupported playback provider: ${requirement.playbackProvider}`;
    this.notifyListeners();
  }

  public pause(): void {
    if (this.state.activeProvider === 'LOCAL_HTML5' && this.audio) {
      this.audio.pause();
    }
    if (this.state.status === 'PLAYING') {
      this.state.status = 'PAUSED';
      this.notifyListeners();
    }
  }

  public resume(): void {
    if (this.state.activeProvider === 'LOCAL_HTML5' && this.audio) {
      this.audio.play().catch((err) => {
        this.state.status = 'ERROR';
        this.state.errorMessage = err.message;
        this.notifyListeners();
      });
    } else if (this.state.status === 'PAUSED') {
      this.state.status = 'PLAYING';
      this.notifyListeners();
    }
  }

  public seek(seconds: number): void {
    const target = Math.max(0, seconds);
    if (this.audio) {
      const maxDuration = this.audio.duration || target;
      const clamped = Math.min(target, maxDuration);
      this.audio.currentTime = clamped;
      this.state.currentTime = clamped;
    } else {
      this.state.currentTime = target;
    }
    this.notifyListeners();
  }

  public setVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(volume, 1.0));
    this.state.volume = clamped;
    if (this.audio) {
      this.audio.volume = clamped;
    }
    this.notifyListeners();
  }

  public toggleMute(): void {
    const nextMuted = !this.state.isMuted;
    this.state.isMuted = nextMuted;
    if (this.audio) {
      this.audio.muted = nextMuted;
    }
    this.notifyListeners();
  }

  private stopInternalAudio(): void {
    if (this.audio) {
      try {
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.src = '';
      } catch (err) {
        // Ignore reset errors
      }
    }
  }

  public stop(): void {
    this.stopInternalAudio();
    this.state = {
      currentRequirement: null,
      status: 'IDLE',
      activeProvider: 'NONE',
      currentTime: 0,
      duration: 0,
      volume: this.state.volume,
      isMuted: this.state.isMuted,
      errorMessage: null,
      resolvedMediaUrl: null
    };
    this.notifyListeners();
  }
}

export const unifiedSacredAudioService = UnifiedSacredAudioService.getInstance();
