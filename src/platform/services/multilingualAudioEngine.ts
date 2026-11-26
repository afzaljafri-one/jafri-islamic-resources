// ==============================================================================
// Multilingual Scripture Audio Engine (Command 5 Production Audio Engine)
// Unified, multi-mode audio architecture supporting all seven religious traditions.
// Supports Original-only, Translation-only, and Dual-Interleaved playback.
// Jafri Religious Books & Audio Platform
// ==============================================================================

import { ReligionId } from '../types';
import { audioProvenanceRegistry } from './audioProvenanceRegistry';
import { resolveAudioUrl } from '../utils/audioUrlResolver';
import { audioCoordinator } from './audioCoordinator';

export type ScriptureAudioMode = 'original_only' | 'translation_only' | 'dual_interleaved';
export type AudioPlaybackState = 'idle' | 'playing' | 'paused' | 'buffering' | 'ended' | 'error';
export type DualPhase = 'original' | 'translation' | 'idle';

export interface AudioProvenanceInfo {
  audioUrl: string;
  performer: string;
  source: string;
  license: string;
  isHuman: boolean;
  licensingTerms?: string;
  title?: string;
  language?: string;
  languageName?: string;
  sourceUrl?: string;
}

export interface ScriptureUnit {
  id: string; // e.g. "1:1", "1.1", "matthew_1_1", "dhp_1", "tattvartha_1_1"
  label: string; // e.g. "Surah 1:1", "Chapter 1, Verse 1", "Shloka 1"
  originalText?: string;
  translationText?: string;
  translations?: Record<string, string>; // e.g. { en: "...", hi: "...", pa: "..." }
  originalAudioUrl?: string | null;
  translationAudioUrl?: string | null;
  startTime?: number; // In seconds
  endTime?: number;   // In seconds
  audio?: AudioProvenanceInfo;
}

export interface ScriptureAudioEditionOption {
  id: string;
  name: string;
  language: string;
  languageName: string;
  isTranslation: boolean;
  isSynthesizedNarration: boolean;
  performerOrNarrator: string;
  license: string;
  provider: string;
}

export interface AudioEngineState {
  religion: ReligionId;
  mode: ScriptureAudioMode;
  playbackState: AudioPlaybackState;
  activeUnitId: string | null;
  activePhase: DualPhase;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  playbackSpeed: number;
  selectedEditionId: string;
  errorMessage: string | null;
}

export type AudioStateSubscriber = (state: AudioEngineState) => void;

export class MultilingualScriptureAudioEngine {
  private audioElement: HTMLAudioElement;
  private currentSpeechUtterance: SpeechSynthesisUtterance | null = null;
  private speechTimer: any = null;
  private speechStartTime: number = 0;
  private speechElapsedBeforePause: number = 0;
  private subscribers: Set<AudioStateSubscriber> = new Set();

  // Async Play/Pause State Machine guards to prevent DOMException AbortError
  private playPromise: Promise<void> | null = null;
  private isPausePending: boolean = false;
  private playRequestId: number = 0;

  private religion: ReligionId = 'islam';
  private mode: ScriptureAudioMode = 'original_only';
  private playbackState: AudioPlaybackState = 'idle';
  private activeUnitId: string | null = null;
  private activePhase: DualPhase = 'idle';
  private currentTime: number = 0;
  private duration: number = 0;
  private volume: number = 1.0;
  private isMuted: boolean = false;
  private playbackSpeed: number = 1.0;
  private selectedEditionId: string = 'default';
  private errorMessage: string | null = null;

  private units: ScriptureUnit[] = [];
  private unitIndexMap: Map<string, number> = new Map();

  private ensureAudioAttached(): void {
    if (typeof document !== 'undefined' && document.body) {
      if (!document.getElementById('multilingual-audio-element')) {
        this.audioElement.id = 'multilingual-audio-element';
        this.audioElement.style.display = 'none';
        document.body.appendChild(this.audioElement);
      }
    }
  }

  constructor() {
    this.audioElement = new Audio();
    this.audioElement.id = 'multilingual-audio-element';
    this.ensureAudioAttached();
    if (typeof window !== 'undefined') {
      (window as any).__multilingualAudioEngine = this;
      window.addEventListener('DOMContentLoaded', () => this.ensureAudioAttached());
    }
    this.setupAudioListeners();
    audioCoordinator.register('multilingual', () => this.stop());
  }

  private setupAudioListeners(): void {
    this.audioElement.addEventListener('timeupdate', () => {
      if (this.currentSpeechUtterance) return; // Speech timer handles its own progress
      if (this.playbackState !== 'playing' && this.playbackState !== 'buffering') return;

      const currentUnit = this.getActiveUnit();
      const base = currentUnit?.startTime || 0;
      const cur = this.audioElement.currentTime;

      if (currentUnit && currentUnit.endTime !== undefined) {
        this.currentTime = Math.max(0, Math.min(this.duration, Math.round((cur - base) * 10) / 10));
        if (cur >= currentUnit.endTime) {
          this.handleAudioPhaseEnded();
          return;
        }
      } else {
        this.currentTime = Math.round(cur * 10) / 10;
      }

      this.notifySubscribers();
    });

    this.audioElement.addEventListener('loadedmetadata', () => {
      if (this.currentSpeechUtterance) return;
      const currentUnit = this.getActiveUnit();
      if (currentUnit && currentUnit.startTime !== undefined && currentUnit.endTime !== undefined) {
        this.duration = Math.max(1, currentUnit.endTime - currentUnit.startTime);
      } else {
        this.duration = this.audioElement.duration || 0;
      }
      this.notifySubscribers();
    });

    this.audioElement.addEventListener('waiting', () => {
      if (this.currentSpeechUtterance) return;
      if (this.playbackState === 'playing') {
        this.playbackState = 'buffering';
        this.notifySubscribers();
      }
    });

    this.audioElement.addEventListener('playing', () => {
      if (this.currentSpeechUtterance) return;
      this.playbackState = 'playing';
      this.errorMessage = null;
      this.notifySubscribers();
    });

    this.audioElement.addEventListener('pause', () => {
      if (this.currentSpeechUtterance) return;
      // Only transition to paused if we were active and not in a pending play request
      if (!this.playPromise && (this.playbackState === 'playing' || this.playbackState === 'buffering')) {
        this.playbackState = 'paused';
        this.notifySubscribers();
      }
    });

    this.audioElement.addEventListener('ended', () => {
      if (this.currentSpeechUtterance) return;
      this.handleAudioPhaseEnded();
    });

    this.audioElement.addEventListener('error', () => {
      if (this.currentSpeechUtterance) return;
      if (!this.audioElement.src || this.audioElement.src === window.location.href) return;
      const err = this.audioElement.error;
      this.errorMessage = `Audio stream unavailable (${err ? err.code : 'Network Error'}).`;
      this.playbackState = 'error';
      this.notifySubscribers();
    });
  }

  public subscribe(subscriber: AudioStateSubscriber): () => void {
    this.subscribers.add(subscriber);
    subscriber(this.getState());
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  private notifySubscribers(): void {
    const state = this.getState();
    this.subscribers.forEach((sub) => sub(state));
  }

  public getState(): AudioEngineState {
    return {
      religion: this.religion,
      mode: this.mode,
      playbackState: this.playbackState,
      activeUnitId: this.activeUnitId,
      activePhase: this.activePhase,
      currentTime: this.currentTime,
      duration: this.duration,
      volume: this.volume,
      isMuted: this.isMuted,
      playbackSpeed: this.playbackSpeed,
      selectedEditionId: this.selectedEditionId,
      errorMessage: this.errorMessage,
    };
  }

  public loadUnits(religion: ReligionId, units: ScriptureUnit[]): void {
    // Sanitize units against Central Audio Provenance Registry (Permanent Audio Copyright Policy)
    const sanitizedUnits = units.map((u) => {
      if (u.originalAudioUrl) {
        const validation = audioProvenanceRegistry.validateAudioUrl(u.originalAudioUrl);
        if (!validation.isPermitted) {
          return {
            ...u,
            originalAudioUrl: null,
            audio: undefined,
          };
        }
      }
      return u;
    });

    const isSameCollection =
      this.religion === religion &&
      this.units.length === sanitizedUnits.length &&
      this.units[0]?.id === sanitizedUnits[0]?.id &&
      this.units[this.units.length - 1]?.id === sanitizedUnits[sanitizedUnits.length - 1]?.id;

    if (!isSameCollection) {
      this.stop();
      this.currentTime = 0;
      this.duration = 0;
      this.errorMessage = null;
    }

    this.religion = religion;
    this.units = sanitizedUnits;
    this.unitIndexMap.clear();
    sanitizedUnits.forEach((u, idx) => {
      this.unitIndexMap.set(u.id, idx);
    });

    if (sanitizedUnits.length > 0 && (!this.activeUnitId || !isSameCollection)) {
      // Prioritize the first unit that has authentic human audio configured
      const firstWithAudio = sanitizedUnits.find((u) => Boolean(u.originalAudioUrl));
      this.activeUnitId = firstWithAudio ? firstWithAudio.id : sanitizedUnits[0].id;
    }
    this.notifySubscribers();
  }

  public setMode(mode: ScriptureAudioMode): void {
    if (this.mode === mode) return;
    const wasActive = this.playbackState === 'playing' || this.playbackState === 'buffering';
    this.mode = mode;
    this.notifySubscribers();
    if (wasActive && this.activeUnitId) {
      this.play(this.activeUnitId);
    }
  }

  public setEdition(editionId: string): void {
    if (this.selectedEditionId === editionId) return;
    this.selectedEditionId = editionId;
    this.notifySubscribers();
    // In translation mode or active translation phase, changing edition immediately speaks the new edition
    if (this.activeUnitId) {
      if (this.mode === 'translation_only' || this.activePhase === 'translation') {
        this.play(this.activeUnitId);
      }
    }
  }

  public setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    this.audioElement.volume = this.isMuted ? 0 : this.volume;
    this.notifySubscribers();
  }

  public toggleMute(): void {
    this.isMuted = !this.isMuted;
    this.audioElement.volume = this.isMuted ? 0 : this.volume;
    this.notifySubscribers();
  }

  public setPlaybackSpeed(speed: number): void {
    this.playbackSpeed = speed;
    this.audioElement.playbackRate = speed;
    this.notifySubscribers();
  }

  public seekTo(seconds: number): void {
    if (this.currentSpeechUtterance) {
      this.currentTime = Math.max(0, Math.min(seconds, this.duration));
      this.notifySubscribers();
      return;
    }
    if (this.duration > 0 && Number.isFinite(seconds)) {
      const currentUnit = this.getActiveUnit();
      const baseOffset = currentUnit?.startTime || 0;
      const bounded = Math.max(0, Math.min(seconds, this.duration));
      this.audioElement.currentTime = baseOffset + bounded;
      this.currentTime = bounded;
      this.notifySubscribers();
    }
  }

  public play(unitId?: string): void {
    audioCoordinator.activate('multilingual');
    if (unitId) {
      this.activeUnitId = unitId;
    }
    if (!this.activeUnitId && this.units.length > 0) {
      this.activeUnitId = this.units[0].id;
    }
    if (!this.activeUnitId) return;

    this.errorMessage = null;

    if (this.mode === 'dual_interleaved') {
      this.startPhase('original');
    } else if (this.mode === 'translation_only') {
      this.startPhase('translation');
    } else {
      this.startPhase('original');
    }
  }

  public pause(): void {
    if (this.activePhase === 'translation') {
      if (this.speechTimer) {
        clearInterval(this.speechTimer);
        this.speechTimer = null;
      }
      this.speechElapsedBeforePause = this.currentTime;
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.pause();
      }
      this.playbackState = 'paused';
      this.notifySubscribers();
    } else {
      this.safePauseAudio();
    }
  }

  public resume(): void {
    this.errorMessage = null;

    // If not paused, delegate to clean play()
    if (this.playbackState !== 'paused') {
      this.play(this.activeUnitId || undefined);
      return;
    }

    if (this.activePhase === 'translation') {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.resume();
      }
      this.speechStartTime = Date.now();
      this.startSpeechTimer();
      this.playbackState = 'playing';
      this.notifySubscribers();
      return;
    }

    if (this.activePhase === 'original') {
      const activeUnit = this.getActiveUnit();
      if (!activeUnit || !activeUnit.originalAudioUrl) {
        this.stopAudioAndSpeech();
        this.errorMessage = 'Audio unavailable for this text.';
        this.playbackState = 'idle';
        this.notifySubscribers();
        return;
      }

      const isMatchingSrc =
        this.audioElement.src === activeUnit.originalAudioUrl ||
        (typeof window !== 'undefined' &&
          this.audioElement.src === new URL(activeUnit.originalAudioUrl, window.location.href).href);

      if (isMatchingSrc && this.audioElement.readyState >= 1) {
        this.safePlayAudio();
      } else {
        this.play(this.activeUnitId || undefined);
      }
    } else {
      this.play(this.activeUnitId || undefined);
    }
  }

  public stop(): void {
    this.playRequestId++;
    this.stopAudioAndSpeech();
    this.playbackState = 'idle';
    this.activePhase = 'idle';
    this.currentTime = 0;
    this.duration = 0;
    this.notifySubscribers();
  }

  public nextUnit(): void {
    if (!this.activeUnitId) return;
    const currentIdx = this.unitIndexMap.get(this.activeUnitId);
    if (currentIdx !== undefined && currentIdx < this.units.length - 1) {
      const nextUnit = this.units[currentIdx + 1];
      this.play(nextUnit.id);
    } else {
      this.stop();
      this.playbackState = 'ended';
      this.notifySubscribers();
    }
  }

  public previousUnit(): void {
    if (!this.activeUnitId) return;
    const currentIdx = this.unitIndexMap.get(this.activeUnitId);
    if (currentIdx !== undefined && currentIdx > 0) {
      const prevUnit = this.units[currentIdx - 1];
      this.play(prevUnit.id);
    }
  }

  public getActiveUnit(): ScriptureUnit | undefined {
    if (!this.activeUnitId) return undefined;
    return this.units.find((u) => u.id === this.activeUnitId);
  }

  /**
   * Starts a specific phase ('original' or 'translation') for the active unit.
   */
  private startPhase(phase: DualPhase): void {
    if (!this.activeUnitId) return;
    const unit = this.getActiveUnit();
    if (!unit) return;

    this.activePhase = phase;
    this.currentTime = 0;

    if (phase === 'original') {
      if (unit.originalAudioUrl) {
        this.playAudioUrl(unit.originalAudioUrl, unit.startTime, unit.endTime);
      } else {
        // Human audio not available for this passage!
        this.stopAudioAndSpeech();
        this.errorMessage = 'Audio unavailable for this text.';
        this.playbackState = 'idle';
        this.notifySubscribers();
      }
    } else if (phase === 'translation') {
      this.safePauseAudio(); // Mute/pause audio element when translation starts
      if (unit.translationAudioUrl) {
        this.playAudioUrl(unit.translationAudioUrl);
      } else {
        // Resolve translation text matching selected edition language
        const targetLang = this.selectedEditionId.includes('hi')
          ? 'hi'
          : this.selectedEditionId.includes('ur')
          ? 'ur'
          : 'en';
        const text =
          targetLang === 'en'
            ? (unit.translations?.['en'] || unit.translationText || '')
            : (unit.translations?.[targetLang] || '');

        if (text && text.trim().length > 0) {
          this.playSpeech(text, targetLang);
        } else {
          const langLabel = targetLang === 'hi' ? 'Hindi' : targetLang === 'ur' ? 'Urdu' : 'English';
          this.stopAudioAndSpeech();
          this.errorMessage = `${langLabel} translation narration is not available for this passage.`;
          this.playbackState = 'idle';
          this.notifySubscribers();
        }
      }
    }
  }

  /**
   * Asynchronous, race-free playback execution for HTMLAudioElement.
   */
  private safePlayAudio(): void {
    const currentReq = ++this.playRequestId;
    this.isPausePending = false;
    this.playbackState = 'buffering';
    this.errorMessage = null;
    this.notifySubscribers();

    const promise = this.audioElement.play();
    this.playPromise = promise;

    promise
      .then(() => {
        this.playPromise = null;
        if (this.playRequestId !== currentReq) return;

        if (this.isPausePending) {
          this.isPausePending = false;
          this.audioElement.pause();
          this.playbackState = 'paused';
          this.notifySubscribers();
        } else {
          this.playbackState = 'playing';
          this.errorMessage = null;
          this.notifySubscribers();
        }
      })
      .catch((err) => {
        this.playPromise = null;
        if (this.playRequestId !== currentReq) return;

        if (err.name === 'AbortError') {
          // Play was superseded by pause() or track switch.
          if (this.isPausePending) {
            this.isPausePending = false;
            this.playbackState = 'paused';
            this.notifySubscribers();
          }
          return;
        }

        console.warn('Audio stream playback failed:', err);
        this.errorMessage = `Could not start playback: ${err.message}`;
        this.playbackState = 'error';
        this.notifySubscribers();
      });
  }

  /**
   * Asynchronous, race-free pause execution for HTMLAudioElement.
   */
  private safePauseAudio(): void {
    if (this.playPromise) {
      // Audio play() promise is in flight. Mark pause as pending to prevent
      // DOMException "The play() request was interrupted by a call to pause()".
      this.isPausePending = true;
      this.playbackState = 'paused';
      this.notifySubscribers();
    } else {
      this.isPausePending = false;
      this.audioElement.pause();
      this.playbackState = 'paused';
      this.notifySubscribers();
    }
  }

  private playAudioUrl(url: string, startTime?: number, endTime?: number): void {
    this.ensureAudioAttached();
    // Validate audio against Central Audio Provenance Registry (Permanent Audio Copyright Policy)
    const validation = audioProvenanceRegistry.validateAudioUrl(url);
    if (!validation.isPermitted) {
      console.warn(`[AudioProvenanceRegistry Blocked]: ${validation.rejectionReason}`);
      this.audioElement.pause();
      this.audioElement.src = '';
      this.playbackState = 'idle';
      this.errorMessage =
        validation.rejectionReason || 'Playback prohibited under Permanent Audio Copyright Policy.';
      this.notifySubscribers();
      return;
    }

    // Cancel speech synthesis (mutual exclusion)
    if (this.speechTimer) {
      clearInterval(this.speechTimer);
      this.speechTimer = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.currentSpeechUtterance = null;
    (window as any).__activeSpeechUtterance = null;

    const baseStart = startTime !== undefined ? startTime : 0;
    const baseEnd = endTime;

    if (baseEnd !== undefined && baseEnd > baseStart) {
      this.duration = Math.max(1, baseEnd - baseStart);
    } else if (this.audioElement.duration && Number.isFinite(this.audioElement.duration)) {
      this.duration = this.audioElement.duration;
    }

    this.currentTime = 0;

    // Resolve URL for playback (safe under Base URL / GitHub Pages)
    const resolvedUrl = resolveAudioUrl(url);

    // Check if the current audioElement.src already points to this url
    const isSameSrc =
      this.audioElement.src === resolvedUrl ||
      (typeof window !== 'undefined' && this.audioElement.src === new URL(resolvedUrl, window.location.href).href);

    if (isSameSrc) {
      if (this.audioElement.readyState >= 1) {
        if (Math.abs(this.audioElement.currentTime - baseStart) > 0.3) {
          this.audioElement.currentTime = baseStart;
        }
      }
      this.safePlayAudio();
      return;
    } else {
      this.audioElement.src = resolvedUrl;
      this.audioElement.playbackRate = this.playbackSpeed;
      this.audioElement.volume = this.isMuted ? 0 : this.volume;

      const onMetadata = () => {
        if (baseStart > 0) {
          this.audioElement.currentTime = baseStart;
        }
        if (baseEnd !== undefined && baseEnd > baseStart) {
          this.duration = Math.max(1, baseEnd - baseStart);
        } else if (this.audioElement.duration && Number.isFinite(this.audioElement.duration)) {
          this.duration = this.audioElement.duration;
        }
        this.notifySubscribers();
        this.audioElement.removeEventListener('loadedmetadata', onMetadata);
      };

      if (this.audioElement.readyState >= 1) {
        if (baseStart > 0) {
          this.audioElement.currentTime = baseStart;
        }
        if (baseEnd !== undefined && baseEnd > baseStart) {
          this.duration = Math.max(1, baseEnd - baseStart);
        }
      } else {
        this.audioElement.addEventListener('loadedmetadata', onMetadata);
      }

      this.safePlayAudio();
    }
  }

  /**
   * Plays approved text translation using client Web Speech API.
   * STRICT PLATFORM RULE: Always clearly labeled as Synthetic Narration. Never claims authenticity.
   */
  private playSpeech(text: string, langCode: string): void {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      this.errorMessage = 'Browser Speech Synthesis is not supported in this environment.';
      this.playbackState = 'error';
      this.notifySubscribers();
      return;
    }

    window.speechSynthesis.cancel();
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = this.playbackSpeed;
    utterance.volume = this.isMuted ? 0 : this.volume;

    if (langCode === 'hi') utterance.lang = 'hi-IN';
    else if (langCode === 'ur') utterance.lang = 'ur-PK';
    else if (langCode === 'pa') utterance.lang = 'pa-IN';
    else if (langCode === 'sa') utterance.lang = 'sa-IN';
    else if (langCode === 'he') utterance.lang = 'he-IL';
    else utterance.lang = 'en-US';

    // Best-effort voice matching
    try {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const matchingVoice = voices.find((v) => v.lang.startsWith(langCode));
        if (matchingVoice) utterance.voice = matchingVoice;
      }
    } catch {}

    const estimatedSecs = Math.max(2, Math.ceil(text.length / 14));
    this.duration = estimatedSecs;
    this.currentTime = 0;
    this.speechElapsedBeforePause = 0;
    this.speechStartTime = Date.now();

    utterance.onstart = () => {
      this.playbackState = 'playing';
      this.errorMessage = null;
      this.speechStartTime = Date.now();
      this.startSpeechTimer();
      this.notifySubscribers();
    };

    utterance.onend = () => {
      // In headless or virtualized audio drivers where onend fires prematurely,
      // allow the speech timer to complete natural passage pacing.
      if (this.currentTime >= this.duration) {
        if (this.speechTimer) {
          clearInterval(this.speechTimer);
          this.speechTimer = null;
        }
        this.currentTime = this.duration;
        this.notifySubscribers();
        this.handleAudioPhaseEnded();
      }
    };

    utterance.onerror = (e) => {
      if (this.speechTimer) {
        clearInterval(this.speechTimer);
        this.speechTimer = null;
      }
      console.warn('Speech synthesis event notice:', e);
      this.handleAudioPhaseEnded();
    };

    this.currentSpeechUtterance = utterance;
    // Guard against V8 garbage collection and preserve last spoken utterance
    (window as any).__activeSpeechUtterance = utterance;
    (window as any).__lastSpokenSpeechUtterance = { text: utterance.text, lang: utterance.lang };

    window.speechSynthesis.speak(utterance);
  }

  private startSpeechTimer(): void {
    if (this.speechTimer) clearInterval(this.speechTimer);
    this.speechTimer = setInterval(() => {
      if (this.playbackState === 'playing') {
        const deltaSec = (Date.now() - this.speechStartTime) / 1000;
        const currentTotal = this.speechElapsedBeforePause + deltaSec;
        this.currentTime = Math.min(this.duration, Math.round(currentTotal * 10) / 10);
        this.notifySubscribers();

        // Safety timeout in case utterance.onend doesn't fire
        if (this.currentTime >= this.duration) {
          clearInterval(this.speechTimer);
          this.speechTimer = null;
          this.handleAudioPhaseEnded();
        }
      }
    }, 200);
  }

  private stopAudioAndSpeech(): void {
    this.safePauseAudio();
    try {
      this.audioElement.removeAttribute('src');
      this.audioElement.load();
    } catch {}
    if (this.speechTimer) {
      clearInterval(this.speechTimer);
      this.speechTimer = null;
    }
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.currentSpeechUtterance = null;
    (window as any).__activeSpeechUtterance = null;
  }

  /**
   * Called when the active phase (original or translation) ends.
   */
  private handleAudioPhaseEnded(): void {
    if (this.mode === 'dual_interleaved') {
      if (this.activePhase === 'original') {
        // Switch to translation phase for the same unit
        this.startPhase('translation');
      } else {
        // Translation finished; advance to next unit!
        this.nextUnit();
      }
    } else {
      // Single mode ended; advance to next unit!
      this.nextUnit();
    }
  }

  public getUnits(): ScriptureUnit[] {
    return this.units;
  }

  public getAudioElement(): HTMLAudioElement {
    this.ensureAudioAttached();
    return this.audioElement;
  }
}

export const multilingualAudioEngine = new MultilingualScriptureAudioEngine();
if (typeof window !== 'undefined') {
  (window as any).__multilingualAudioEngine = multilingualAudioEngine;
}
