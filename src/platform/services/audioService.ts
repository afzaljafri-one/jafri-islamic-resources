// ==============================================================================
// Generic Scripture Audio Service (Independent from QuranAudioService)
// Jafri Religious Books & Audio Platform — Phase 0
// ==============================================================================

import { audioProvenanceRegistry } from './audioProvenanceRegistry';
import { resolveAudioUrl } from '../utils/audioUrlResolver';

export interface GenericAudioState {
  status: 'idle' | 'loading' | 'playing' | 'paused' | 'error';
  activeTrackId: string | null;
  trackTitle: string | null;
  performerName: string | null;
  audioUrl: string | null;
  currentTime: number;
  duration: number;
  playbackSpeed: number;
  volume: number;
  isMuted: boolean;
  errorMessage: string | null;
}

export class GenericScriptureAudioService {
  private static instance: GenericScriptureAudioService | null = null;
  private audio: HTMLAudioElement | null = null;
  private listeners: Set<(state: GenericAudioState) => void> = new Set();

  private state: GenericAudioState = {
    status: 'idle',
    activeTrackId: null,
    trackTitle: null,
    performerName: null,
    audioUrl: null,
    currentTime: 0,
    duration: 0,
    playbackSpeed: 1.0,
    volume: 1.0,
    isMuted: false,
    errorMessage: null,
  };

  private constructor() {
    if (typeof window !== 'undefined') {
      this.audio = new Audio();
      this.setupListeners();
    }
  }

  static getInstance(): GenericScriptureAudioService {
    if (!GenericScriptureAudioService.instance) {
      GenericScriptureAudioService.instance = new GenericScriptureAudioService();
    }
    return GenericScriptureAudioService.instance;
  }

  private setupListeners(): void {
    if (!this.audio) return;

    this.audio.addEventListener('timeupdate', () => {
      if (this.audio) {
        this.updateState({ currentTime: this.audio.currentTime });
      }
    });

    this.audio.addEventListener('loadedmetadata', () => {
      if (this.audio) {
        this.updateState({ duration: this.audio.duration, status: 'paused' });
      }
    });

    this.audio.addEventListener('ended', () => {
      this.updateState({ status: 'idle', currentTime: 0 });
    });

    this.audio.addEventListener('error', () => {
      this.updateState({
        status: 'error',
        errorMessage: 'Unable to stream audio track from provider.',
      });
    });
  }

  subscribe(listener: (state: GenericAudioState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  getState(): GenericAudioState {
    return { ...this.state };
  }

  private updateState(partial: Partial<GenericAudioState>): void {
    this.state = { ...this.state, ...partial };
    this.listeners.forEach((l) => l(this.state));
  }

  loadTrack(trackId: string, title: string, performer: string, url: string): void {
    if (!this.audio) return;

    // Validate audio against Central Audio Provenance Registry (Permanent Audio Copyright Policy)
    const validation = audioProvenanceRegistry.validateAudioUrl(url);
    if (!validation.isPermitted) {
      console.warn(`[GenericScriptureAudioService Blocked]: ${validation.rejectionReason}`);
      this.audio.src = '';
      this.updateState({
        status: 'error',
        activeTrackId: trackId,
        trackTitle: title,
        performerName: performer,
        audioUrl: null,
        errorMessage:
          validation.rejectionReason || 'Playback prohibited under Permanent Audio Copyright Policy.',
      });
      return;
    }

    const resolvedUrl = resolveAudioUrl(url);
    this.audio.src = resolvedUrl;
    this.audio.playbackRate = this.state.playbackSpeed;
    this.updateState({
      status: 'loading',
      activeTrackId: trackId,
      trackTitle: title,
      performerName: performer,
      audioUrl: resolvedUrl,
      currentTime: 0,
      duration: 0,
      errorMessage: null,
    });
    this.audio.load();
  }

  play(): void {
    if (this.audio && this.audio.src) {
      this.audio.play().catch((err) => {
        this.updateState({ status: 'error', errorMessage: err.message });
      });
      this.updateState({ status: 'playing' });
    }
  }

  pause(): void {
    if (this.audio) {
      this.audio.pause();
      this.updateState({ status: 'paused' });
    }
  }

  seek(timeInSeconds: number): void {
    if (this.audio && !isNaN(timeInSeconds)) {
      this.audio.currentTime = timeInSeconds;
      this.updateState({ currentTime: timeInSeconds });
    }
  }

  setSpeed(speed: number): void {
    if (this.audio) {
      this.audio.playbackRate = speed;
    }
    this.updateState({ playbackSpeed: speed });
  }

  setVolume(volume: number): void {
    const clamped = Math.max(0, Math.min(1, volume));
    if (this.audio) {
      this.audio.volume = clamped;
      if (clamped > 0 && this.state.isMuted) {
        this.audio.muted = false;
        this.updateState({ isMuted: false });
      }
    }
    this.updateState({ volume: clamped });
  }

  toggleMute(): void {
    if (this.audio) {
      const nextMuted = !this.state.isMuted;
      this.audio.muted = nextMuted;
      this.updateState({ isMuted: nextMuted });
    }
  }

  stop(): void {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.updateState({
      status: 'idle',
      activeTrackId: null,
      trackTitle: null,
      performerName: null,
      audioUrl: null,
      currentTime: 0,
    });
  }
}

export const genericAudioService = GenericScriptureAudioService.getInstance();
if (typeof window !== 'undefined' && (import.meta as any).env?.DEV) {
  (window as any).__genericAudioService = genericAudioService;
}
