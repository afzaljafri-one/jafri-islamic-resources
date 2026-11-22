// ==============================================================================
// Unified Multilingual Audio Service (Command 20 Architecture)
// Reusable, four-tier multilingual audio engine supporting all 30 target languages.
// Tier 1: Authentic Human Audio
// Tier 2: Commercially Eligible Synthetic Narration (Kokoro LiteRT)
// Tier 3: Browser-Native SpeechSynthesis (Owner Approved Voices Only)
// Tier 4: Text-Only Presentation (When audio is unavailable or licensing uncertain)
// Jafri Multilingual Religious Books & Audio Platform
// ==============================================================================

import {
  TARGET_30_LANGUAGES,
  TargetLanguageMetadata,
  AudioEngineType,
} from '../config/languagesRegistry';
import { spanishNarrationService } from './spanishNarrationService';

export type UnifiedPlaybackStatus =
  | 'idle'
  | 'loading'
  | 'playing'
  | 'paused'
  | 'stopped'
  | 'text_only'
  | 'error';

export interface UnifiedAudioState {
  activeLanguage: TargetLanguageMetadata;
  activeEngine: AudioEngineType;
  playbackStatus: UnifiedPlaybackStatus;
  selectedSpeed: number; // 0.80, 0.85 (default), 0.90, 1.00
  currentTime: number;
  duration: number;
  isSynthetic: boolean;
  voiceLabel: string;
  errorMessage: string | null;
  progressPhase: string | null;
  canPlayAudio: boolean;
}

export type UnifiedAudioSubscriber = (state: UnifiedAudioState) => void;

class UnifiedMultilingualAudioService {
  private activeLanguage: TargetLanguageMetadata = TARGET_30_LANGUAGES[0]; // English default
  private playbackStatus: UnifiedPlaybackStatus = 'idle';
  private selectedSpeed: number = 0.85; // Default 0.85x
  private currentTime: number = 0;
  private duration: number = 0;
  private errorMessage: string | null = null;
  private progressPhase: string | null = null;

  private subscribers: Set<UnifiedAudioSubscriber> = new Set();

  // Tier 1: Human Audio Player
  private audioElement: HTMLAudioElement | null = null;

  // Tier 3: Browser Native Speech Synthesis
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private synthTimer: any = null;
  private synthStartTime: number = 0;
  private synthElapsedBeforePause: number = 0;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioElement = new Audio();
      this.setupAudioElementListeners();
    }
  }

  public subscribe(subscriber: UnifiedAudioSubscriber): () => void {
    this.subscribers.add(subscriber);
    subscriber(this.getState());
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  private notify(): void {
    const s = this.getState();
    this.subscribers.forEach((fn) => {
      try {
        fn(s);
      } catch (err) {
        console.error('[UnifiedAudioService] Subscriber error:', err);
      }
    });
  }

  public getState(): UnifiedAudioState {
    const engine = this.activeLanguage.audioEngine;
    const canPlay = engine !== 'text_only';

    let voiceLabel = 'Solo Lectura de Texto (Audio No Disponible)';
    let isSynthetic = false;

    if (engine === 'human_recording') {
      voiceLabel = this.activeLanguage.voiceDisplayName || 'Grabación Humana Auténtica';
      isSynthetic = false;
    } else if (engine === 'kokoro_litert') {
      voiceLabel = this.activeLanguage.voiceDisplayName || 'Kokoro LiteRT (Apache 2.0)';
      isSynthetic = true;
    } else if (engine === 'browser_native') {
      voiceLabel = this.activeLanguage.voiceDisplayName || 'Voz Nativa de Navegador';
      isSynthetic = true;
    }

    return {
      activeLanguage: this.activeLanguage,
      activeEngine: engine,
      playbackStatus: canPlay ? this.playbackStatus : 'text_only',
      selectedSpeed: this.selectedSpeed,
      currentTime: this.currentTime,
      duration: this.duration,
      isSynthetic,
      voiceLabel,
      errorMessage: this.errorMessage,
      progressPhase: this.progressPhase,
      canPlayAudio: canPlay,
    };
  }

  public setLanguage(languageId: string): void {
    const found = TARGET_30_LANGUAGES.find((l) => l.id === languageId);
    if (!found) {
      console.warn(`[UnifiedAudioService] Language ${languageId} not found in registry.`);
      return;
    }

    this.stop();
    this.activeLanguage = found;
    this.errorMessage = null;
    this.progressPhase = null;
    this.currentTime = 0;
    this.duration = 0;

    if (found.audioEngine === 'text_only') {
      this.playbackStatus = 'text_only';
    } else {
      this.playbackStatus = 'idle';
    }

    this.notify();
  }

  public setSpeed(speed: number): void {
    const valid = [0.8, 0.85, 0.9, 1.0];
    if (!valid.includes(speed)) return;
    this.selectedSpeed = speed;

    if (this.audioElement) {
      this.audioElement.playbackRate = speed;
    }
    if (this.currentUtterance && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.currentUtterance.rate = speed;
    }
    spanishNarrationService.setSpeed(speed);

    this.notify();
  }

  /**
   * Universal Playback Dispatcher adhering to the 4-tier ladder.
   */
  public async playText(
    text: string,
    options?: {
      stablePassageId?: string | null;
      humanAudioUrl?: string | null;
      passageLabel?: string;
      isPassageMatch?: boolean;
      unmatchedReason?: string;
    }
  ): Promise<void> {
    const lang = this.activeLanguage;
    this.errorMessage = null;

    // TIER 4: Text-Only Presentation
    if (lang.audioEngine === 'text_only' || !text.trim()) {
      this.playbackStatus = 'text_only';
      this.notify();
      return;
    }

    // TIER 1: Authentic Human Audio (e.g. Arabic recitation, Urdu EveryAyah)
    if (lang.audioEngine === 'human_recording') {
      if (options?.humanAudioUrl && options?.isPassageMatch) {
        this.playHumanAudio(options.humanAudioUrl);
        return;
      } else {
        this.playbackStatus = 'text_only';
        this.errorMessage =
          options?.unmatchedReason ||
          `Audio auténtico no disponible para este texto específico en ${lang.name}. La grabación humana está estrictamente restringida a la muestra registrada.`;
        this.notify();
        return;
      }
    }

    // TIER 2: Commercially Eligible Synthetic Narration (Kokoro LiteRT)
    if (lang.audioEngine === 'kokoro_litert') {
      await this.playKokoroLiteRT(text);
      return;
    }

    // TIER 3: Browser-Native Speech Synthesis (Owner Approved Voices Only)
    if (lang.audioEngine === 'browser_native') {
      this.playBrowserNative(text);
      return;
    }

    // Fallback if no matching engine
    this.playbackStatus = 'text_only';
    this.notify();
  }

  private playHumanAudio(url: string): void {
    if (!this.audioElement) return;

    this.stop();
    this.playbackStatus = 'loading';
    this.progressPhase = 'Cargando grabación humana auténtica...';
    this.notify();

    this.audioElement.src = url;
    this.audioElement.playbackRate = this.selectedSpeed;

    this.audioElement
      .play()
      .then(() => {
        this.playbackStatus = 'playing';
        this.progressPhase = null;
        this.notify();
      })
      .catch((err) => {
        this.playbackStatus = 'error';
        this.errorMessage = `Error al reproducir audio humano: ${err.message}`;
        this.notify();
      });
  }

  private async playKokoroLiteRT(text: string): Promise<void> {
    // Kokoro LiteRT in this service is specifically implemented and verified for Spanish (ef_dora).
    // If called for other candidate languages, fall back to browser-native speech synthesis.
    if (this.activeLanguage.id !== 'es') {
      console.warn(
        `[UnifiedAudioService] Kokoro LiteRT multi-voice for ${this.activeLanguage.name} is an open-weight candidate not yet technically tested in this runtime service. Falling back to device speech synthesis.`
      );
      this.playBrowserNative(text);
      return;
    }

    this.stop();
    this.playbackStatus = 'loading';
    this.progressPhase = 'Inicializando síntesis neural Kokoro LiteRT (ef_dora)...';
    this.notify();

    try {
      const state = spanishNarrationService.getState();
      if (state.status !== 'ready') {
        this.progressPhase = 'Cargando modelo Kokoro LiteRT (~295 MB)...';
        this.notify();
        await spanishNarrationService.loadModel();
      }

      this.progressPhase = 'Sintetizando voz neural ef_dora...';
      this.notify();

      await spanishNarrationService.synthesize(text);
      spanishNarrationService.play();

      this.playbackStatus = 'playing';
      this.progressPhase = null;
      this.duration = spanishNarrationService.getState().duration;
      this.notify();
    } catch (err: any) {
      this.playbackStatus = 'error';
      this.errorMessage = `Error en Kokoro LiteRT: ${err.message}`;
      this.progressPhase = null;
      this.notify();
    }
  }

  private playBrowserNative(text: string): void {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      this.playbackStatus = 'error';
      this.errorMessage = 'El navegador no soporta la API Web Speech.';
      this.notify();
      return;
    }

    this.stop();
    window.speechSynthesis.cancel();

    // Check owner rejected voices
    const lang = this.activeLanguage;
    if (lang.ownerStatus === 'OWNER_REJECTED') {
      this.playbackStatus = 'text_only';
      this.errorMessage = `La voz de dispositivo para ${lang.name} fue rechazada en la evaluación de escucha. Modo solo texto activo.`;
      this.notify();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang.bcp47;
    utterance.rate = this.selectedSpeed;

    // Detect matched device voice
    const voices = window.speechSynthesis.getVoices();
    if (lang.voiceIdentifier) {
      const targetVoice = voices.find(
        (v) =>
          v.name.toLowerCase().includes(lang.voiceIdentifier!.toLowerCase()) ||
          v.voiceURI.toLowerCase().includes(lang.voiceIdentifier!.toLowerCase())
      );
      if (targetVoice) {
        utterance.voice = targetVoice;
      }
    }

    utterance.onstart = () => {
      this.playbackStatus = 'playing';
      this.synthStartTime = performance.now();
      this.startSynthTimer(text);
      this.notify();
    };

    utterance.onend = () => {
      this.stopSynthTimer();
      this.playbackStatus = 'stopped';
      this.currentTime = 0;
      this.notify();
    };

    utterance.onerror = (e) => {
      this.stopSynthTimer();
      this.playbackStatus = 'error';
      this.errorMessage = `Error en síntesis nativa: ${e.error}`;
      this.notify();
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  public pause(): void {
    const engine = this.activeLanguage.audioEngine;

    if (engine === 'human_recording' && this.audioElement) {
      this.audioElement.pause();
      this.playbackStatus = 'paused';
      this.notify();
    } else if (engine === 'kokoro_litert') {
      spanishNarrationService.pause();
      this.playbackStatus = 'paused';
      this.notify();
    } else if (engine === 'browser_native' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.pause();
      this.synthElapsedBeforePause += (performance.now() - this.synthStartTime) / 1000;
      this.stopSynthTimer();
      this.playbackStatus = 'paused';
      this.notify();
    }
  }

  public resume(): void {
    const engine = this.activeLanguage.audioEngine;

    if (engine === 'human_recording' && this.audioElement) {
      this.audioElement.play();
      this.playbackStatus = 'playing';
      this.notify();
    } else if (engine === 'kokoro_litert') {
      spanishNarrationService.resume();
      this.playbackStatus = 'playing';
      this.notify();
    } else if (engine === 'browser_native' && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
      this.synthStartTime = performance.now();
      this.playbackStatus = 'playing';
      this.notify();
    }
  }

  public stop(): void {
    if (this.audioElement) {
      this.audioElement.pause();
      this.audioElement.currentTime = 0;
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      this.stopSynthTimer();
    }
    spanishNarrationService.stop();

    this.playbackStatus = this.activeLanguage.audioEngine === 'text_only' ? 'text_only' : 'stopped';
    this.currentTime = 0;
    this.progressPhase = null;
    this.notify();
  }

  public replay(text: string, options?: { humanAudioUrl?: string | null }): void {
    this.stop();
    this.playText(text, options);
  }

  private startSynthTimer(text: string): void {
    this.stopSynthTimer();
    // Estimate duration based on word count (approx 130 words per minute / speed)
    const words = text.trim().split(/\s+/).length;
    const estimatedSecs = (words / (130 * this.selectedSpeed)) * 60;
    this.duration = Math.max(5, estimatedSecs);

    this.synthTimer = setInterval(() => {
      const elapsed =
        this.synthElapsedBeforePause + (performance.now() - this.synthStartTime) / 1000;
      this.currentTime = Math.min(elapsed, this.duration);
      this.notify();
    }, 250);
  }

  private stopSynthTimer(): void {
    if (this.synthTimer) {
      clearInterval(this.synthTimer);
      this.synthTimer = null;
    }
    this.synthElapsedBeforePause = 0;
  }

  private setupAudioElementListeners(): void {
    if (!this.audioElement) return;

    this.audioElement.ontimeupdate = () => {
      if (this.audioElement) {
        this.currentTime = this.audioElement.currentTime;
        this.duration = this.audioElement.duration || 0;
        this.notify();
      }
    };

    this.audioElement.onended = () => {
      this.playbackStatus = 'stopped';
      this.currentTime = 0;
      this.notify();
    };

    this.audioElement.onerror = () => {
      this.playbackStatus = 'error';
      this.errorMessage = 'Fallo en la reproducción del archivo de audio humano.';
      this.notify();
    };
  }
}

export const unifiedMultilingualAudioService = new UnifiedMultilingualAudioService();
