// ==============================================================================
// Spanish Neural Narration Pilot Service (Command 19 Integration)
// Modular, isolated client-side service for Kokoro LiteRT Spanish narration.
// Strictly uses voice ef_dora for Spanish translations and commentary.
// 100% Apache-2.0 Stack: LiteRT-LM + MediaPipe Tasks Audio + Kokoro-82M.
// DOES NOT MODIFY OR REPLACE QuranReader, MultilingualAudioEngine, or Islam M4.
// Jafri Religious Books & Audio Platform
// ==============================================================================

export type SpanishModelStatus =
  | 'unloaded'
  | 'downloading'
  | 'initializing'
  | 'ready'
  | 'synthesizing'
  | 'error';

export type SpanishPlaybackStatus = 'idle' | 'playing' | 'paused' | 'stopped';

export interface SpanishNarrationProgress {
  bytesDownloaded: number;
  totalBytes: number;
  percent: number;
  speedMBs: number;
  etaSeconds: number;
  phase: string;
}

export interface SpanishNarrationMetrics {
  lastDownloadDurationSec: number;
  lastInitDurationSec: number;
  lastSynthesisDurationSec: number;
  lastAudioDurationSec: number;
  lastRealTimeFactor: number;
  peakMemoryMB: number;
  activeDelegate: 'CPU' | 'GPU';
  totalSamplesGenerated: number;
}

export interface SpanishNarrationState {
  status: SpanishModelStatus;
  playbackStatus: SpanishPlaybackStatus;
  progress: SpanishNarrationProgress;
  metrics: SpanishNarrationMetrics;
  selectedSpeed: number; // 0.80, 0.85 (default), 0.90, 1.00
  currentTime: number;
  duration: number;
  voiceId: 'ef_dora';
  modelId: string;
  isSynthetic: true;
  errorMessage: string | null;
  hasCachedModel: boolean;
}

export type SpanishStateSubscriber = (state: SpanishNarrationState) => void;

class SpanishNarrationService {
  private status: SpanishModelStatus = 'unloaded';
  private playbackStatus: SpanishPlaybackStatus = 'idle';
  private selectedSpeed: number = 0.85; // Default 0.85x per project owner preference
  private voiceId: 'ef_dora' = 'ef_dora';
  private modelId = 'litert-community/Kokoro-82M (kokoro_int8_gpu_fp16.litertlm)';
  private errorMessage: string | null = null;

  private progress: SpanishNarrationProgress = {
    bytesDownloaded: 0,
    totalBytes: 294750530, // ~281.1 MiB / ~294.75 MB
    percent: 0,
    speedMBs: 0,
    etaSeconds: 0,
    phase: 'Awaiting user download request',
  };

  private metrics: SpanishNarrationMetrics = {
    lastDownloadDurationSec: 0,
    lastInitDurationSec: 0,
    lastSynthesisDurationSec: 0,
    lastAudioDurationSec: 0,
    lastRealTimeFactor: 0,
    peakMemoryMB: 0,
    activeDelegate: 'CPU',
    totalSamplesGenerated: 0,
  };

  private subscribers: Set<SpanishStateSubscriber> = new Set();
  private abortController: AbortController | null = null;

  // MediaPipe tasks & WASM instance
  private ttsEngine: any = null;
  private audioContext: AudioContext | null = null;
  private currentAudioBuffer: AudioBuffer | null = null;
  private currentSourceNode: AudioBufferSourceNode | null = null;
  private lastSynthesizedSamples: Float32Array | null = null;
  private sampleRateHz: number = 24000;

  // Playback tracking
  private playbackStartTime: number = 0;
  private pauseOffset: number = 0;
  private progressTimer: any = null;

  constructor() {
    this.checkCachedModel();
  }

  public subscribe(subscriber: SpanishStateSubscriber): () => void {
    this.subscribers.add(subscriber);
    subscriber(this.getState());
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  private notify() {
    const s = this.getState();
    this.subscribers.forEach((fn) => {
      try {
        fn(s);
      } catch (err) {
        console.error('[SpanishNarrationService] Subscriber error:', err);
      }
    });
  }

  public getState(): SpanishNarrationState {
    return {
      status: this.status,
      playbackStatus: this.playbackStatus,
      progress: { ...this.progress },
      metrics: { ...this.metrics },
      selectedSpeed: this.selectedSpeed,
      currentTime: this.pauseOffset,
      duration: this.currentAudioBuffer ? this.currentAudioBuffer.duration : 0,
      voiceId: this.voiceId,
      modelId: this.modelId,
      isSynthetic: true,
      errorMessage: this.errorMessage,
      hasCachedModel: false,
    };
  }

  private async checkCachedModel() {
    // Check if browser has cached buffer in IndexedDB/Cache API
    try {
      if (typeof window !== 'undefined' && 'caches' in window) {
        const has = await caches.has('jafri-kokoro-model-v1');
        if (has) {
          this.notify();
        }
      }
    } catch {
      // Ignored
    }
  }

  /**
   * Explicit user-initiated download and initialization of Kokoro LiteRT model.
   * Model (~295 MB) is NOT downloaded until this method is explicitly called.
   */
  public async loadModel(options?: {
    sourceUrl?: string;
    allowCaching?: boolean;
    forceRemote?: boolean;
  }): Promise<void> {
    if (this.status === 'ready' && this.ttsEngine) {
      return; // Already initialized
    }

    this.status = 'downloading';
    this.errorMessage = null;
    this.progress = {
      bytesDownloaded: 0,
      totalBytes: 294750530,
      percent: 0,
      speedMBs: 0,
      etaSeconds: 0,
      phase: 'Iniciando descarga del modelo neural (~295 MB)...',
    };
    this.notify();

    this.abortController = new AbortController();

    // On-demand model resolution:
    // In production builds (where 281 MB model is excluded from dist/), stream directly from official Hugging Face CDN.
    // In local dev mode, check local staged path first, falling back to Hugging Face CDN if absent.
    const localUrl = '/kokoro_spanish_poc/kokoro_int8_gpu_fp16.litertlm';
    const remoteUrl =
      'https://huggingface.co/litert-community/Kokoro-82M/resolve/main/kokoro_int8_gpu_fp16.litertlm';

    const isProd = typeof import.meta !== 'undefined' && (import.meta as any).env?.PROD;
    let targetUrl = options?.forceRemote
      ? remoteUrl
      : (options?.sourceUrl || (isProd ? remoteUrl : localUrl));

    const tDownloadStart = performance.now();
    let modelBuffer: Uint8Array;

    try {
      // 1. Fetch with streaming progress
      let response: Response;
      try {
        response = await fetch(targetUrl, { signal: this.abortController.signal });
        if (!response.ok && targetUrl === localUrl) {
          console.warn('[SpanishNarrationService] Local model not found, falling back to Hugging Face CDN');
          targetUrl = remoteUrl;
          response = await fetch(targetUrl, { signal: this.abortController.signal });
        }
      } catch (fetchErr: any) {
        if (targetUrl === localUrl && !options?.forceRemote) {
          targetUrl = remoteUrl;
          response = await fetch(targetUrl, { signal: this.abortController.signal });
        } else {
          throw fetchErr;
        }
      }

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const contentLength = response.headers.get('Content-Length');
      const totalBytes = contentLength ? parseInt(contentLength, 10) : 294750530;
      this.progress.totalBytes = totalBytes;

      const reader = response.body?.getReader();
      if (!reader) throw new Error('Stream reader not available');

      const chunks: Uint8Array[] = [];
      let receivedBytes = 0;
      let lastTime = performance.now();
      let lastBytes = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        receivedBytes += value.length;

        const now = performance.now();
        if (now - lastTime > 200) {
          const percent = Math.min(100, Math.round((receivedBytes / totalBytes) * 100));
          const speedMBs =
            (receivedBytes - lastBytes) / (1024 * 1024) / ((now - lastTime) / 1000);
          const remainingSec =
            speedMBs > 0
              ? Math.round((totalBytes - receivedBytes) / (1024 * 1024) / speedMBs)
              : 0;

          this.progress.bytesDownloaded = receivedBytes;
          this.progress.percent = percent;
          this.progress.speedMBs = parseFloat(speedMBs.toFixed(2));
          this.progress.etaSeconds = remainingSec;
          this.progress.phase = `Descargando paquete Kokoro (${(receivedBytes / (1024 * 1024)).toFixed(1)} MB / ${(totalBytes / (1024 * 1024)).toFixed(1)} MB)...`;
          this.notify();

          lastTime = now;
          lastBytes = receivedBytes;
        }
      }

      this.metrics.lastDownloadDurationSec = parseFloat(
        ((performance.now() - tDownloadStart) / 1000).toFixed(2)
      );

      // Concatenate buffer
      modelBuffer = new Uint8Array(receivedBytes);
      let offset = 0;
      for (const chunk of chunks) {
        modelBuffer.set(chunk, offset);
        offset += chunk.length;
      }

      // 2. Initialize MediaPipe Tasks Audio WASM
      this.status = 'initializing';
      this.progress.phase = 'Compilando runtime WebAssembly y grafo neural LiteRT...';
      this.notify();

      const tInitStart = performance.now();

      // Dynamic import of @mediapipe/tasks-audio via browser native dynamic import
      const moduleUrl =
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@1.2.3/audio_bundle.mjs';
      const importDynamic = new Function('url', 'return import(url)');
      const tasksAudio = await importDynamic(moduleUrl);

      const wasmFileset = await tasksAudio.FilesetResolver.forAudioTasks(
        'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-audio@1.2.3/wasm'
      );

      // Detect delegate: test if WebGPU is available without errors
      let chosenDelegate: 'GPU' | 'CPU' = 'CPU';
      if (typeof navigator !== 'undefined' && (navigator as any).gpu) {
        try {
          const adapter = await (navigator as any).gpu.requestAdapter();
          if (adapter) {
            chosenDelegate = 'GPU';
          }
        } catch {
          chosenDelegate = 'CPU';
        }
      }
      this.metrics.activeDelegate = chosenDelegate;

      this.ttsEngine = await tasksAudio.TextToSpeech.createFromOptions(wasmFileset, {
        baseOptions: {
          modelAssetBuffer: modelBuffer,
          delegate: chosenDelegate,
        },
        defaultVoiceId: 'ef_dora',
        defaultLocale: 'es-ES',
        speakingRate: this.selectedSpeed,
      });

      this.metrics.lastInitDurationSec = parseFloat(
        ((performance.now() - tInitStart) / 1000).toFixed(2)
      );

      // Verify voice catalog
      const voices = await this.ttsEngine.listVoices();
      const hasDora = voices?.some((v: any) => v.voiceId === 'ef_dora');
      if (!hasDora) {
        throw new Error('Voz ef_dora no encontrada en el catálogo del modelo.');
      }

      // Memory tracking
      if (typeof performance !== 'undefined' && (performance as any).memory) {
        this.metrics.peakMemoryMB = Math.round(
          (performance as any).memory.usedJSHeapSize / (1024 * 1024)
        );
      }

      this.status = 'ready';
      this.progress.phase = 'Modelo inicializado y listo para narración.';
      this.progress.percent = 100;
      this.notify();
    } catch (err: any) {
      if (this.abortController?.signal.aborted) {
        this.status = 'unloaded';
        this.progress.phase = 'Descarga cancelada por el usuario.';
        this.errorMessage = 'Descarga cancelada.';
      } else {
        this.status = 'error';
        this.errorMessage = err.message || 'Error al inicializar el modelo Kokoro LiteRT.';
        this.progress.phase = `Error: ${this.errorMessage}`;
      }
      this.notify();
      throw err;
    }
  }

  public cancelLoad(): void {
    if (this.abortController) {
      this.abortController.abort();
    }
  }

  /**
   * Synthesize Spanish text using voice ef_dora.
   * Strictly enforces voice ef_dora and Spanish locale.
   */
  public async synthesize(text: string): Promise<Float32Array> {
    if (!text || !text.trim()) {
      throw new Error('El texto para narración en español no puede estar vacío.');
    }
    if (this.status !== 'ready' || !this.ttsEngine) {
      throw new Error('El modelo Kokoro LiteRT debe inicializarse antes de sintetizar audio.');
    }

    this.status = 'synthesizing';
    this.errorMessage = null;
    this.notify();

    const tSynthStart = performance.now();

    try {
      // Direct synthesis call to MediaPipe
      const result = await this.ttsEngine.synthesize(text.trim(), {
        voiceId: 'ef_dora',
        locale: 'es-ES',
      });

      const synthDurationSec = (performance.now() - tSynthStart) / 1000;
      const audioDurationSec = result.samples.length / result.sampleRateHz;
      const rtf = synthDurationSec / audioDurationSec;

      this.metrics.lastSynthesisDurationSec = parseFloat(synthDurationSec.toFixed(2));
      this.metrics.lastAudioDurationSec = parseFloat(audioDurationSec.toFixed(2));
      this.metrics.lastRealTimeFactor = parseFloat(rtf.toFixed(2));
      this.metrics.totalSamplesGenerated = result.samples.length;
      this.sampleRateHz = result.sampleRateHz || 24000;
      this.lastSynthesizedSamples = result.samples;

      // Prepare Web Audio Buffer
      this.ensureAudioContext();
      if (this.audioContext) {
        this.currentAudioBuffer = this.audioContext.createBuffer(
          1,
          result.samples.length,
          this.sampleRateHz
        );
        this.currentAudioBuffer.copyToChannel(result.samples, 0);
      }

      this.status = 'ready';
      this.pauseOffset = 0;
      this.notify();
      return result.samples;
    } catch (err: any) {
      this.status = 'error';
      this.errorMessage = err.message || 'Error durante la síntesis neural de audio.';
      this.notify();
      throw err;
    }
  }

  private ensureAudioContext(): AudioContext {
    if (!this.audioContext || this.audioContext.state === 'closed') {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioContext = new AudioCtx({ sampleRate: this.sampleRateHz });
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  public play(): void {
    if (!this.currentAudioBuffer) {
      console.warn('[SpanishNarrationService] No audio buffer to play.');
      return;
    }
    const ctx = this.ensureAudioContext();

    if (this.currentSourceNode) {
      try {
        this.currentSourceNode.stop();
      } catch {}
    }

    this.currentSourceNode = ctx.createBufferSource();
    this.currentSourceNode.buffer = this.currentAudioBuffer;
    this.currentSourceNode.playbackRate.value = this.selectedSpeed;
    this.currentSourceNode.connect(ctx.destination);

    this.playbackStartTime = ctx.currentTime - this.pauseOffset / this.selectedSpeed;
    this.currentSourceNode.start(0, this.pauseOffset);
    this.playbackStatus = 'playing';
    this.notify();

    this.startProgressTracking();

    this.currentSourceNode.onended = () => {
      this.stopProgressTracking();
      this.playbackStatus = 'stopped';
      this.pauseOffset = 0;
      this.notify();
    };
  }

  public pause(): void {
    if (this.playbackStatus !== 'playing' || !this.currentSourceNode || !this.audioContext) {
      return;
    }
    this.pauseOffset =
      (this.audioContext.currentTime - this.playbackStartTime) * this.selectedSpeed;
    try {
      this.currentSourceNode.stop();
    } catch {}
    this.stopProgressTracking();
    this.playbackStatus = 'paused';
    this.notify();
  }

  public resume(): void {
    if (this.playbackStatus === 'paused') {
      this.play();
    }
  }

  public stop(): void {
    if (this.currentSourceNode) {
      try {
        this.currentSourceNode.stop();
      } catch {}
    }
    this.stopProgressTracking();
    this.playbackStatus = 'stopped';
    this.pauseOffset = 0;
    this.notify();
  }

  public replay(): void {
    this.pauseOffset = 0;
    this.play();
  }

  public setSpeed(speed: number): void {
    const validSpeeds = [0.8, 0.85, 0.9, 1.0];
    if (!validSpeeds.includes(speed)) return;
    this.selectedSpeed = speed;
    if (this.currentSourceNode && this.playbackStatus === 'playing') {
      this.currentSourceNode.playbackRate.value = speed;
    }
    this.notify();
  }

  private startProgressTracking(): void {
    this.stopProgressTracking();
    this.progressTimer = setInterval(() => {
      if (this.audioContext && this.playbackStatus === 'playing') {
        const current =
          (this.audioContext.currentTime - this.playbackStartTime) * this.selectedSpeed;
        const total = this.currentAudioBuffer ? this.currentAudioBuffer.duration : 0;
        if (current >= total) {
          this.pauseOffset = 0;
        } else {
          this.pauseOffset = current;
        }
        this.notify();
      }
    }, 250);
  }

  private stopProgressTracking(): void {
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  public exportWavBlob(): Blob | null {
    if (!this.lastSynthesizedSamples) return null;
    return this.floatTo16BitPCM(this.lastSynthesizedSamples, this.sampleRateHz);
  }

  private floatTo16BitPCM(samples: Float32Array, sampleRate: number): Blob {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    const writeStr = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeStr(0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    writeStr(8, 'WAVE');
    writeStr(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true); // PCM
    view.setUint16(22, 1, true); // Mono
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * 2, true);
    view.setUint16(32, 2, true);
    view.setUint16(34, 16, true);
    writeStr(36, 'data');
    view.setUint32(40, samples.length * 2, true);

    let offset = 44;
    for (let i = 0; i < samples.length; i++, offset += 2) {
      const s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
    }

    return new Blob([buffer], { type: 'audio/wav' });
  }
}

export const spanishNarrationService = new SpanishNarrationService();
