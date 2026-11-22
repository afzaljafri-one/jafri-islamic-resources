// ==============================================================================
// Quran Audio Service (Singleton Engine)
// Milestone M3.5 & M3.5 Enhancement (Page-Bounded Recitation)
// Manages audio playback, seeking, state observer subscriptions, and page-bounded scope
// ==============================================================================

import { AudioPlayerState, AudioProvider, PlaybackScope } from './types';
import { DEFAULT_RECITER_ID, getReciterConfig } from './reciterConfig';
import { everyAyahProvider } from './providers/everyAyahProvider';
import { getSurahCanonicalMeta } from './surahMetadata';
import { getPageAyahBoundary } from './pageAyahBoundaries';

export class QuranAudioService {
  private static instance: QuranAudioService | null = null;
  private audio: HTMLAudioElement | null = null;
  private provider: AudioProvider = everyAyahProvider;
  private listeners: Set<(state: AudioPlayerState) => void> = new Set();

  private state: AudioPlayerState = {
    status: 'idle',
    currentSurahNumber: 1,
    currentSurahName: 'Al-Fatihah',
    currentAyahNumber: 1,
    totalAyahs: 7,
    reciterId: DEFAULT_RECITER_ID,
    currentTime: 0,
    duration: 0,
    playbackSpeed: 1.0,
    autoAdvance: true,
    errorMessage: null,
    activeAudioUrl: null,
    playbackScope: 'page', // Default scope when in Mushaf page view
    pageBoundary: null,
    pageRecitationCompleted: false,
    completionMessage: null,
  };

  private constructor() {
    // Check initial URL parameters if in browser environment to avoid stale Surah 1 defaults
    if (typeof window !== 'undefined' && window.location?.search) {
      try {
        const params = new URLSearchParams(window.location.search);
        const s = parseInt(params.get('surah') || '', 10);
        const p = parseInt(params.get('page') || '', 10);
        const ed = (params.get('edition') as '13-line' | '15-line') || '13-line';
        const pageNum = !isNaN(p) && p > 0 ? p : ed === '13-line' ? 3 : 2;
        const surahNum = !isNaN(s) && s >= 1 && s <= 114 ? s : 1;

        const boundary = getPageAyahBoundary(ed, pageNum, surahNum);
        const meta = getSurahCanonicalMeta(boundary.surahNumber);

        this.state.currentSurahNumber = boundary.surahNumber;
        this.state.currentSurahName = meta.englishName;
        this.state.totalAyahs = meta.totalAyahs;
        this.state.currentAyahNumber = boundary.startAyah > 0 ? boundary.startAyah : 1;
        this.state.pageBoundary = boundary;
      } catch {
        // Fallback to default
      }
    }
  }

  public static getInstance(): QuranAudioService {
    if (!QuranAudioService.instance) {
      QuranAudioService.instance = new QuranAudioService();
    }
    return QuranAudioService.instance;
  }

  // --------------------------------------------------------------------------
  // Observer Subscription
  // --------------------------------------------------------------------------
  public subscribe(listener: (state: AudioPlayerState) => void): () => void {
    this.listeners.add(listener);
    listener(this.getState());
    return () => {
      this.listeners.delete(listener);
    };
  }

  public getState(): AudioPlayerState {
    return { ...this.state };
  }

  private notify() {
    const currentState = this.getState();
    this.listeners.forEach((listener) => {
      try {
        listener(currentState);
      } catch (err) {
        console.error('Error notifying audio listener:', err);
      }
    });
  }

  private updateState(partial: Partial<AudioPlayerState>) {
    this.state = { ...this.state, ...partial };
    this.notify();
  }

  // --------------------------------------------------------------------------
  // Core Audio Element Management (Guaranteed Single Instance)
  // --------------------------------------------------------------------------
  private setupAudioElement(url: string, autoPlay: boolean = true) {
    // Teardown previous audio element cleanly to prevent memory leaks and overlapping streams
    if (this.audio) {
      this.audio.pause();
      this.audio.onplay = null;
      this.audio.onplaying = null;
      this.audio.onpause = null;
      this.audio.ontimeupdate = null;
      this.audio.onloadedmetadata = null;
      this.audio.oncanplay = null;
      this.audio.onended = null;
      this.audio.onerror = null;
      this.audio.onwaiting = null;
      this.audio.src = '';
      this.audio.load();
      this.audio = null;
    }

    const audio = new Audio();
    audio.preload = 'auto';
    audio.playbackRate = this.state.playbackSpeed;
    this.audio = audio;

    this.updateState({
      activeAudioUrl: url,
      status: autoPlay ? 'loading' : 'paused',
      errorMessage: null,
      currentTime: 0,
      duration: 0,
    });

    audio.src = url;

    audio.onwaiting = () => {
      this.updateState({ status: 'loading' });
    };

    audio.onloadedmetadata = () => {
      const dur = isNaN(audio.duration) ? 0 : audio.duration;
      this.updateState({
        duration: dur,
        status: !autoPlay && (this.state.status === 'loading' || this.state.status === 'idle') ? 'paused' : this.state.status,
      });
    };

    audio.oncanplay = () => {
      const dur = isNaN(audio.duration) ? this.state.duration : audio.duration;
      if (!autoPlay && (this.state.status === 'loading' || this.state.status === 'idle')) {
        this.updateState({
          status: 'paused',
          duration: dur,
        });
      }
    };

    audio.onplay = () => {
      this.updateState({ status: 'playing', errorMessage: null });
    };

    audio.onplaying = () => {
      this.updateState({ status: 'playing' });
    };

    audio.onpause = () => {
      if (
        this.state.status !== 'loading' &&
        this.state.status !== 'error' &&
        this.state.status !== 'idle'
      ) {
        this.updateState({ status: 'paused' });
      }
    };

    audio.ontimeupdate = () => {
      this.updateState({
        currentTime: audio.currentTime,
        duration: isNaN(audio.duration) ? this.state.duration : audio.duration,
      });
    };

    audio.onended = () => {
      this.handleAyahEnded();
    };

    audio.onerror = () => {
      const reciter = getReciterConfig(this.state.reciterId);
      this.updateState({
        status: 'error',
        errorMessage: `Audio unavailable for Surah ${this.state.currentSurahNumber}, Ayah ${this.state.currentAyahNumber} (${reciter.name}). Check network or select another reciter.`,
      });
    };

    if (autoPlay) {
      this.executePlay();
    }
  }

  private executePlay() {
    if (!this.audio) return;
    const playPromise = this.audio.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          this.updateState({ status: 'playing', errorMessage: null });
        })
        .catch((err) => {
          // Handle browser autoplay policy restrictions gracefully
          if (err.name === 'NotAllowedError') {
            this.updateState({
              status: 'paused',
              errorMessage: 'Playback requires user gesture. Click Play to start audio.',
            });
          } else {
            this.updateState({
              status: 'error',
              errorMessage: `Playback error: ${err.message}`,
            });
          }
        });
    }
  }

  private handleAyahEnded() {
    const isPageMode = this.state.playbackScope === 'page';
    const boundary = this.state.pageBoundary;

    if (isPageMode && boundary && boundary.isVerified && boundary.endAyah > 0) {
      if (this.state.currentAyahNumber < boundary.endAyah) {
        // Advance to next Ayah on the current Surah slice of this page
        this.nextAyah(true);
      } else {
        // Current Surah slice on this page has ended!
        // Check if there is another Surah slice on this same physical page
        const slices = boundary.availableSurahsOnPage || [];
        const currentSliceIndex = slices.findIndex(
          (s) => s.surahNumber === this.state.currentSurahNumber
        );

        if (currentSliceIndex >= 0 && currentSliceIndex < slices.length - 1) {
          // Advance to the NEXT Surah slice on this SAME physical page!
          const nextSlice = slices[currentSliceIndex + 1];
          const nextMeta = getSurahCanonicalMeta(nextSlice.surahNumber);

          const updatedBoundary = {
            ...boundary,
            surahNumber: nextSlice.surahNumber,
            surahName: nextSlice.surahName,
            startAyah: nextSlice.startAyah,
            endAyah: nextSlice.endAyah,
          };

          this.updateState({
            pageBoundary: updatedBoundary,
            currentSurahNumber: nextSlice.surahNumber,
            currentSurahName: nextMeta.englishName,
            totalAyahs: nextMeta.totalAyahs,
            currentAyahNumber: nextSlice.startAyah,
            pageRecitationCompleted: false,
            completionMessage: null,
          });

          const url = this.provider.getAyahAudioUrl(
            nextSlice.surahNumber,
            nextSlice.startAyah,
            this.state.reciterId
          );
          this.setupAudioElement(url, true);
        } else {
          // End of the final Surah on this physical Mushaf page reached!
          this.stop();
          this.updateState({
            status: 'idle',
            currentTime: 0,
            pageRecitationCompleted: true,
            completionMessage: `Page ${boundary.pageNumber} recitation completed.`,
          });
        }
      }
    } else {
      // Surah mode: continue until the Surah ends
      if (this.state.autoAdvance && this.state.currentAyahNumber < this.state.totalAyahs) {
        this.nextAyah(true);
      } else {
        this.updateState({
          status: 'idle',
          currentTime: 0,
          pageRecitationCompleted: false,
          completionMessage: `Surah ${this.state.currentSurahName} recitation completed.`,
        });
      }
    }
  }

  // --------------------------------------------------------------------------
  // Public Playback Controls
  // --------------------------------------------------------------------------
  public setPlaybackScope(scope: PlaybackScope) {
    if (scope === this.state.playbackScope) return;
    this.updateState({
      playbackScope: scope,
      pageRecitationCompleted: false,
      completionMessage: null,
    });
  }

  /**
   * Set page context from MushafPageViewer.
   * Recalculates page boundaries, updates scope bounds, and handles page transitions.
   */
  public setPageContext(
    edition: '13-line' | '15-line',
    pageNumber: number,
    surahNumber?: number
  ) {
    const boundary = getPageAyahBoundary(
      edition,
      pageNumber,
      surahNumber || this.state.currentSurahNumber
    );
    const meta = getSurahCanonicalMeta(boundary.surahNumber);

    // Handle front matter or Dua Khatm non-Quranic plates
    if (boundary.isDuaKhatmOnly || boundary.isFrontMatter) {
      this.stop();
      this.updateState({
        pageBoundary: boundary,
        currentSurahNumber: boundary.surahNumber,
        currentSurahName: meta.englishName,
        totalAyahs: meta.totalAyahs,
        pageRecitationCompleted: false,
        completionMessage: boundary.isDuaKhatmOnly
          ? 'Dua Khatm al-Quran epilogue plate (Closing Supplication — Non-Quranic text, recitation audio not available).'
          : 'Front matter folio (No Quranic text).',
      });
      return;
    }

    // Handle unverified pages: strictly disable audio and notify user
    if (!boundary.isVerified) {
      this.stop();
      this.updateState({
        pageBoundary: boundary,
        currentSurahNumber: boundary.surahNumber,
        currentSurahName: meta.englishName,
        totalAyahs: meta.totalAyahs,
        currentAyahNumber: 0,
        pageRecitationCompleted: false,
        completionMessage: 'Page boundaries not yet verified. Recitation audio is disabled for this page.',
      });
      return;
    }

    const isSamePage =
      this.state.pageBoundary &&
      this.state.pageBoundary.edition === edition &&
      this.state.pageBoundary.pageNumber === pageNumber &&
      this.state.pageBoundary.surahNumber === boundary.surahNumber;

    if (isSamePage) {
      this.updateState({ pageBoundary: boundary });
      return;
    }

    // Changing page or edition:
    // "If the currently playing Ayah is not present on the newly selected page, stop playback and reset the page context."
    const isPlaying = this.state.status === 'playing';
    const isAyahOnNewPage =
      this.state.currentSurahNumber === boundary.surahNumber &&
      this.state.currentAyahNumber >= boundary.startAyah &&
      this.state.currentAyahNumber <= boundary.endAyah;

    if (this.state.playbackScope === 'page' && isPlaying && !isAyahOnNewPage) {
      this.stop();
      this.loadSurah(boundary.surahNumber, meta.englishName, meta.totalAyahs, boundary.startAyah, false);
      this.updateState({
        pageBoundary: boundary,
        pageRecitationCompleted: false,
        completionMessage: null,
      });
      return;
    }

    // If audio is paused or idle, or in surah mode:
    const targetAyah = isAyahOnNewPage ? this.state.currentAyahNumber : boundary.startAyah;
    this.updateState({
      pageBoundary: boundary,
      pageRecitationCompleted: false,
      completionMessage: null,
    });

    if (!isAyahOnNewPage) {
      this.loadSurah(boundary.surahNumber, meta.englishName, meta.totalAyahs, targetAyah, isPlaying);
    }
  }

  public loadSurah(
    surahNumber: number,
    surahName?: string,
    totalAyahs?: number,
    startAyah: number = 1,
    autoPlay: boolean = false
  ) {
    const sNum = Math.max(1, Math.min(114, surahNumber));
    const meta = getSurahCanonicalMeta(sNum);
    const sName = surahName || meta.englishName;
    const tAyahs = totalAyahs !== undefined ? totalAyahs : meta.totalAyahs;
    const aNum = Math.max(1, Math.min(tAyahs, startAyah));

    this.state.currentSurahNumber = sNum;
    this.state.currentSurahName = sName;
    this.state.currentAyahNumber = aNum;
    this.state.totalAyahs = tAyahs;

    const url = this.provider.getAyahAudioUrl(sNum, aNum, this.state.reciterId);
    this.setupAudioElement(url, autoPlay);
  }

  /**
   * Synchronize active reading context with the audio player.
   * If audio is already playing, transitions cleanly to the new Surah/Ayah.
   * If audio is idle/paused, loads track metadata in paused state ready to play.
   */
  public syncContext(
    surahNumber: number,
    surahName?: string,
    totalAyahs?: number,
    ayahNumber: number = 1
  ) {
    const sNum = Math.max(1, Math.min(114, surahNumber));
    const meta = getSurahCanonicalMeta(sNum);
    const sName = surahName || meta.englishName;
    const tAyahs = totalAyahs !== undefined ? totalAyahs : meta.totalAyahs;
    const aNum = Math.max(1, Math.min(tAyahs, ayahNumber));

    const isSameTrack =
      this.state.currentSurahNumber === sNum && this.state.currentAyahNumber === aNum;

    if (isSameTrack && this.audio) {
      this.updateState({
        currentSurahName: sName,
        totalAyahs: tAyahs,
      });
      return;
    }

    const shouldAutoPlay = this.state.status === 'playing';
    this.loadSurah(sNum, sName, tAyahs, aNum, shouldAutoPlay);
  }

  public play() {
    // If page boundaries are not yet verified, strictly disallow playback
    if (this.state.playbackScope === 'page' && this.state.pageBoundary && !this.state.pageBoundary.isVerified) {
      this.updateState({
        errorMessage: 'Page boundaries not yet verified. Recitation audio is disabled for this page.',
      });
      return;
    }

    // If page recitation was completed and user presses Play again:
    // Reset to start of page (first slice) and replay!
    if (this.state.pageRecitationCompleted && this.state.pageBoundary) {
      const boundary = this.state.pageBoundary;
      const firstSlice =
        boundary.availableSurahsOnPage && boundary.availableSurahsOnPage.length > 0
          ? boundary.availableSurahsOnPage[0]
          : null;
      const startSurah = firstSlice ? firstSlice.surahNumber : boundary.surahNumber;
      const startAyah = firstSlice ? firstSlice.startAyah : boundary.startAyah;
      const meta = getSurahCanonicalMeta(startSurah);

      this.updateState({
        pageBoundary: firstSlice
          ? {
              ...boundary,
              surahNumber: firstSlice.surahNumber,
              startAyah: firstSlice.startAyah,
              endAyah: firstSlice.endAyah,
            }
          : boundary,
        currentSurahNumber: startSurah,
        currentSurahName: meta.englishName,
        totalAyahs: meta.totalAyahs,
        pageRecitationCompleted: false,
        completionMessage: null,
      });
      this.setAyah(startAyah, true);
      return;
    }

    this.updateState({ pageRecitationCompleted: false, completionMessage: null });
    if (this.audio && this.audio.src) {
      this.executePlay();
    } else {
      const url = this.provider.getAyahAudioUrl(
        this.state.currentSurahNumber,
        this.state.currentAyahNumber,
        this.state.reciterId
      );
      this.setupAudioElement(url, true);
    }
  }

  public resume() {
    this.play();
  }

  public pause() {
    if (this.audio) {
      this.audio.pause();
    }
    this.updateState({ status: 'paused' });
  }

  public stop() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
    this.updateState({
      status: 'idle',
      currentTime: 0,
    });
  }

  public seek(targetSeconds: number) {
    if (!this.audio) return;
    const maxDur =
      this.state.duration > 0
        ? this.state.duration
        : !isNaN(this.audio.duration) && this.audio.duration > 0
        ? this.audio.duration
        : targetSeconds;
    const clamped = Math.max(0, Math.min(maxDur, targetSeconds));
    try {
      this.audio.currentTime = clamped;
      this.updateState({ currentTime: clamped });
    } catch (err) {
      console.error('Seek error:', err);
    }
  }

  public setAyah(ayahNumber: number, autoPlay: boolean = true) {
    const aNum = Math.max(1, Math.min(this.state.totalAyahs, ayahNumber));
    this.state.currentAyahNumber = aNum;
    const url = this.provider.getAyahAudioUrl(
      this.state.currentSurahNumber,
      aNum,
      this.state.reciterId
    );
    this.setupAudioElement(url, autoPlay);
  }

  public nextAyah(autoPlay: boolean = true) {
    const isPageMode = this.state.playbackScope === 'page';
    const boundary = this.state.pageBoundary;
    const maxAyah =
      isPageMode && boundary && boundary.endAyah > 0
        ? boundary.endAyah
        : this.state.totalAyahs;

    if (this.state.currentAyahNumber < maxAyah) {
      this.setAyah(this.state.currentAyahNumber + 1, autoPlay);
    }
  }

  public prevAyah(autoPlay: boolean = true) {
    const isPageMode = this.state.playbackScope === 'page';
    const boundary = this.state.pageBoundary;
    const minAyah =
      isPageMode && boundary && boundary.startAyah > 0
        ? boundary.startAyah
        : 1;

    if (this.state.currentAyahNumber > minAyah) {
      this.setAyah(this.state.currentAyahNumber - 1, autoPlay);
    }
  }

  public nextSurah(surahName?: string, totalAyahs?: number, autoPlay: boolean = true) {
    if (this.state.currentSurahNumber < 114) {
      const nextNum = this.state.currentSurahNumber + 1;
      const meta = getSurahCanonicalMeta(nextNum);
      this.loadSurah(
        nextNum,
        surahName || meta.englishName,
        totalAyahs !== undefined ? totalAyahs : meta.totalAyahs,
        1,
        autoPlay
      );
    }
  }

  public prevSurah(surahName?: string, totalAyahs?: number, autoPlay: boolean = true) {
    if (this.state.currentSurahNumber > 1) {
      const prevNum = this.state.currentSurahNumber - 1;
      const meta = getSurahCanonicalMeta(prevNum);
      this.loadSurah(
        prevNum,
        surahName || meta.englishName,
        totalAyahs !== undefined ? totalAyahs : meta.totalAyahs,
        1,
        autoPlay
      );
    }
  }

  public setReciter(reciterId: string) {
    if (reciterId === this.state.reciterId) return;
    this.state.reciterId = reciterId;
    // When reciter changes, reload audio for current Surah & Ayah from beginning
    const wasPlaying = this.state.status === 'playing' || this.state.status === 'loading';
    const url = this.provider.getAyahAudioUrl(
      this.state.currentSurahNumber,
      this.state.currentAyahNumber,
      reciterId
    );
    this.setupAudioElement(url, wasPlaying);
  }

  public setPlaybackSpeed(speed: number) {
    this.state.playbackSpeed = speed;
    if (this.audio) {
      this.audio.playbackRate = speed;
    }
    this.updateState({ playbackSpeed: speed });
  }

  public setAutoAdvance(enabled: boolean) {
    this.updateState({ autoAdvance: enabled });
  }

  public getAudioElement(): HTMLAudioElement | null {
    return this.audio;
  }

  public destroy() {
    this.stop();
    if (this.audio) {
      this.audio.src = '';
      this.audio = null;
    }
    this.listeners.clear();
  }
}

export const quranAudioService = QuranAudioService.getInstance();

if (typeof window !== 'undefined') {
  (window as any).__quranAudioService = quranAudioService;
}
