/**
 * ============================================================================
 * JAFRI RELIGIOUS RESOURCES — PERSISTENT SACRED AUDIO READING PANEL
 * Dedicated Right-Column (approx 35%) Contextual Listening Experience
 * Synchronized with Unified Universal Audio-Scripture Synchronization Engine
 * ============================================================================
 */

import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  ChevronsLeft,
  ChevronsRight,
  Volume2,
  VolumeX,
  ExternalLink,
  Headphones,
  CheckCircle2,
  Info,
  Radio,
  AlertCircle,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  X,
} from 'lucide-react';
import { SUPPORTED_RECITERS } from '../../../types/quran';
import type { PlaybackScope, PageAyahBoundary } from '../../../services/audio/types';
import type { SacredAudioRequirement } from '../../types/sacredAudio';
import {
  unifiedSacredAudioService,
  SacredAudioPlaybackState,
} from '../../services/unifiedSacredAudioService';
import {
  audioCoordinator,
  AudioEngineSourceId,
} from '../../services/audioCoordinator';
import {
  matchContextualAudio,
  ContextualAudioResult,
  CanonicalReadingContext,
} from '../../services/contextualAudioMatcher';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds <= 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export interface QuranAudioControlsProps {
  isPlaying: boolean;
  isLoading: boolean;
  currentSurahNumber: number;
  currentSurahName: string;
  currentAyahNumber: number;
  totalAyahs: number;
  reciterId: string;
  currentTime: number;
  duration: number;
  playbackScope: PlaybackScope;
  onTogglePlaybackScope: () => void;
  pageBoundary: PageAyahBoundary | null;
  pageRecitationCompleted: boolean;
  completionMessage: string | null;
  onSelectReciter: (id: string) => void;
  onTogglePlay: () => void;
  onStop: () => void;
  onSeek: (seconds: number) => void;
  onNextAyah: () => void;
  onPrevAyah: () => void;
  onNextSurah: () => void;
  onPrevSurah: () => void;
  autoAdvance: boolean;
  onToggleAutoAdvance: () => void;
  playbackSpeed: number;
  onChangePlaybackSpeed: (speed: number) => void;
  errorMessage: string | null;
}

export interface SacredAudioReadingPanelProps {
  context: CanonicalReadingContext;
  quranControls?: QuranAudioControlsProps;
  className?: string;
}

export const SacredAudioReadingPanel: React.FC<SacredAudioReadingPanelProps> = ({
  context,
  quranControls,
  className = '',
}) => {
  const [isViewAllOpen, setIsViewAllOpen] = useState(false);
  const [showTextInfo, setShowTextInfo] = useState(false);
  const [activeCoordinatorSource, setActiveCoordinatorSource] = useState<AudioEngineSourceId | null>(() =>
    audioCoordinator.getActiveSource()
  );
  // Global playback state from UnifiedSacredAudioService
  const [playbackState, setPlaybackState] = useState<SacredAudioPlaybackState>(() =>
    unifiedSacredAudioService.getState()
  );

  // Monotonically increasing request counter to prevent asynchronous race conditions
  const syncRequestIdRef = useRef<number>(0);

  // Subscribe to playback changes and global audio coordinator active source
  useEffect(() => {
    const unsubSacred = unifiedSacredAudioService.subscribe((state) => {
      setPlaybackState(state);
    });
    const unsubCoordinator = audioCoordinator.subscribe((source) => {
      setActiveCoordinatorSource(source);
    });
    return () => {
      unsubSacred();
      unsubCoordinator();
    };
  }, []);

  // Compute canonical contextual audio match result using the Universal Synchronization Engine
  const matchResult: ContextualAudioResult = useMemo(() => {
    return matchContextualAudio(context);
  }, [
    context.religionId,
    context.categoryId,
    context.scriptureId,
    context.collectionId,
    context.resourceId,
    context.readingId,
    context.bookId,
    context.bookName,
    context.chapterId,
    context.sectionId,
    context.verseId,
    context.verseRange,
    context.canonicalTitle,
    context.title,
  ]);

  const {
    matchLevel,
    scopeLabel,
    primaryMatches,
    additionalRecordings,
    totalAvailableForTradition,
    hasDirectMatch,
    activeReadingTitle,
  } = matchResult;

  // Selected requirement for display/interaction
  const [selectedReq, setSelectedReq] = useState<SacredAudioRequirement | null>(() => {
    return primaryMatches.length > 0 ? primaryMatches[0] : null;
  });

  // Track canonical reading context key to detect genuine navigation transitions
  const contextKey = [
    context.religionId || '',
    context.categoryId || '',
    context.scriptureId || '',
    context.collectionId || '',
    context.resourceId || '',
    context.readingId || '',
    context.bookId ?? '',
    context.chapterId ?? '',
    context.sectionId ?? '',
    context.verseId ?? '',
    context.canonicalTitle || '',
  ].join('::');

  const prevContextKeyRef = useRef<string>(contextKey);

  // Synchronize selection and immediately invalidate previous playback upon context transition
  useEffect(() => {
    const isContextChanged = prevContextKeyRef.current !== contextKey;
    const currentRequestId = ++syncRequestIdRef.current;

    if (isContextChanged) {
      prevContextKeyRef.current = contextKey;

      // Check if active playback belongs to the new reading's verified primary matches
      const isCurrentPlayingInNewMatches =
        playbackState.currentRequirement &&
        primaryMatches.some((r) => r.id === playbackState.currentRequirement?.id);

      // Stop and reset previous playback immediately if it belonged to previous reading
      if (playbackState.status !== 'IDLE' && !isCurrentPlayingInNewMatches) {
        unifiedSacredAudioService.stop();
      }

      // Check request ID to protect against asynchronous state races
      if (currentRequestId === syncRequestIdRef.current) {
        if (primaryMatches.length > 0) {
          setSelectedReq(primaryMatches[0]);
        } else {
          // Strict Level 5 (No Match): Clear selection. NEVER retain previous track!
          setSelectedReq(null);
        }
      }
    } else {
      // Maintain selected requirement state on initial mount or updates
      if (!selectedReq && primaryMatches.length > 0 && currentRequestId === syncRequestIdRef.current) {
        setSelectedReq(primaryMatches[0]);
      }
    }
  }, [
    contextKey,
    primaryMatches,
    playbackState.currentRequirement,
    playbackState.status,
    selectedReq,
  ]);

  // Determine active requirement:
  // An audio requirement is only active if it belongs to the current verified context or explicit user selection
  const isPlaybackActiveInCurrentContext =
    Boolean(playbackState.currentRequirement) &&
    (playbackState.status === 'PLAYING' ||
      playbackState.status === 'PAUSED' ||
      playbackState.status === 'LOADING') &&
    (primaryMatches.some((r) => r.id === playbackState.currentRequirement?.id) ||
      (selectedReq && selectedReq.id === playbackState.currentRequirement?.id));

  const activeReq = isPlaybackActiveInCurrentContext
    ? playbackState.currentRequirement
    : selectedReq;

  const isCurrentActivePlaying =
    Boolean(activeReq) &&
    playbackState.currentRequirement?.id === activeReq?.id &&
    playbackState.status === 'PLAYING';

  const isCurrentActiveLoading =
    Boolean(activeReq) &&
    playbackState.currentRequirement?.id === activeReq?.id &&
    playbackState.status === 'LOADING';

  // Navigation playlist: primary matches if direct match, otherwise additional tradition recordings
  const activeNavigationList = useMemo(() => {
    return primaryMatches.length > 0 ? primaryMatches : additionalRecordings;
  }, [primaryMatches, additionalRecordings]);

  const currentIndex = activeNavigationList.findIndex((r) => r.id === activeReq?.id);

  // Play / Pause handler
  const handleTogglePlay = async (reqToPlay?: SacredAudioRequirement) => {
    const target = reqToPlay || activeReq;
    if (!target) return;

    if (playbackState.currentRequirement?.id === target.id) {
      if (playbackState.status === 'PLAYING') {
        unifiedSacredAudioService.pause();
      } else {
        unifiedSacredAudioService.resume();
      }
    } else {
      setSelectedReq(target);
      await unifiedSacredAudioService.playRequirement(target);
    }
  };

  // Next / Previous navigation within the relevant group
  const handlePreviousTrack = () => {
    if (activeNavigationList.length <= 1) return;
    const prevIndex =
      currentIndex <= 0 ? activeNavigationList.length - 1 : currentIndex - 1;
    const prevReq = activeNavigationList[prevIndex];
    setSelectedReq(prevReq);
    if (playbackState.status === 'PLAYING') {
      unifiedSacredAudioService.playRequirement(prevReq);
    }
  };

  const handleNextTrack = () => {
    if (activeNavigationList.length <= 1) return;
    const nextIndex =
      currentIndex >= activeNavigationList.length - 1 ? 0 : currentIndex + 1;
    const nextReq = activeNavigationList[nextIndex];
    setSelectedReq(nextReq);
    if (playbackState.status === 'PLAYING') {
      unifiedSacredAudioService.playRequirement(nextReq);
    }
  };

  // Seek and Volume Handlers
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    unifiedSacredAudioService.seek(newTime);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseFloat(e.target.value);
    unifiedSacredAudioService.setVolume(newVol);
  };

  const handleToggleMute = () => {
    unifiedSacredAudioService.toggleMute();
  };

  // Reciter / Performer Attribution
  const getReciterAttribution = (req: SacredAudioRequirement): string => {
    if (req.youtubeMetadata?.channelTitle) {
      return req.youtubeMetadata.channelTitle;
    }
    if (req.rightsEvidence?.performerName) {
      return req.rightsEvidence.performerName;
    }
    if (req.rightsEvidence?.rightsHolder) {
      return req.rightsEvidence.rightsHolder;
    }
    return 'Authentic Sacred Chanting';
  };

  // Determine active player mode: follows active audio source, falls back to reading context
  const isSacredSourceActive =
    activeCoordinatorSource === 'sacred' ||
    (playbackState.currentRequirement !== null &&
      (playbackState.status === 'PLAYING' ||
        playbackState.status === 'LOADING' ||
        playbackState.status === 'PAUSED'));
  const showQuranPlayer = Boolean(quranControls) && !isSacredSourceActive;
  const showSacredPlayer = !showQuranPlayer && Boolean(activeReq);

  return (
    <aside
      className={`flex flex-col bg-navy-950/95 border border-gold-500/30 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4 ${className}`}
      role="region"
      aria-label="Sacred Audio Library Player"
      data-testid="sacred-audio-reading-panel"
    >
      {/* -----------------------------------------------------------------------
          PANEL HEADER: Sacred Audio Library & Scope
          ----------------------------------------------------------------------- */}
      <div className="flex items-center justify-between pb-3 border-b border-navy-800">
        <div className="flex items-center space-x-2 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-gold-400 flex-shrink-0">
            <Headphones className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold uppercase tracking-wider text-gold-400 flex items-center space-x-1">
              <span>Sacred Audio Library</span>
              <span className="text-slate-600">•</span>
              <span className="text-slate-400 font-mono">
                {totalAvailableForTradition} Available
              </span>
            </div>
            <h2 className="font-serif text-xs sm:text-sm font-bold text-slate-200 truncate">
              {scopeLabel}
            </h2>
          </div>
        </div>

        {/* -------------------------------------------------------------------
            STRICT MATCH LEVEL BADGE (Levels 1 to 5)
            ------------------------------------------------------------------- */}
        <div className="flex-shrink-0">
          {matchLevel === 'EXACT' && (
            <span
              data-testid="match-scope-badge"
              className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              title="Exact match for this individual reading"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Matching Audio</span>
            </span>
          )}
          {matchLevel === 'CHAPTER' && (
            <span
              data-testid="match-scope-badge"
              className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/30"
              title="Recording covers this chapter or section"
            >
              <CheckCircle2 className="w-3 h-3" />
              <span>Chapter / Section Audio</span>
            </span>
          )}
          {matchLevel === 'COLLECTION' && (
            <span
              data-testid="match-scope-badge"
              className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30"
              title="Recording covers the broader collection"
            >
              <Radio className="w-3 h-3" />
              <span>Collection Recording</span>
            </span>
          )}
          {!hasDirectMatch && (
            <span
              data-testid="match-scope-badge"
              className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30"
              title="No direct recording for this reading"
            >
              <Info className="w-3 h-3" />
              <span>Library Audio</span>
            </span>
          )}
        </div>
      </div>

      {/* -----------------------------------------------------------------------
          COLLECTION MATCH EXPLANATORY NOTICE
          ----------------------------------------------------------------------- */}
      {matchLevel === 'COLLECTION' && (
        <div
          data-testid="collection-recording-notice"
          className="p-2.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-indigo-200 text-xs flex items-start space-x-2"
        >
          <Info className="w-4 h-4 text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="leading-snug">
            This recording covers the broader scripture collection, not necessarily the specific individual reading currently open.
          </p>
        </div>
      )}

      {/* -----------------------------------------------------------------------
          QURAN AYAH-BY-AYAH RECITATION CONTROLS (Unified into Sacred Audio Panel)
          Preserves reciter selection, Ayah/Surah nav, Page/Surah scope, seek,
          speed, auto-advance, and page-boundary notices without a fixed dock.
          ----------------------------------------------------------------------- */}
      {showQuranPlayer && quranControls && (() => {
        const currentReciter =
          SUPPORTED_RECITERS.find((r) => r.id === quranControls.reciterId) || SUPPORTED_RECITERS[0];
        const progressPercent =
          quranControls.duration > 0
            ? Math.min(100, (quranControls.currentTime / quranControls.duration) * 100)
            : 0;
        const isPageMode = quranControls.playbackScope === 'page';
        const pageBoundary = quranControls.pageBoundary;
        const hasPageBoundary = isPageMode && pageBoundary !== null;
        const isDuaKhatm = pageBoundary?.isDuaKhatmOnly ?? false;
        const isUnverified = hasPageBoundary && !pageBoundary.isVerified;
        const isPrevAyahDisabled =
          isUnverified ||
          (hasPageBoundary && pageBoundary.startAyah > 0
            ? quranControls.currentAyahNumber <= pageBoundary.startAyah
            : quranControls.currentAyahNumber <= 1);
        const isNextAyahDisabled =
          isUnverified ||
          (hasPageBoundary && pageBoundary.endAyah > 0
            ? quranControls.currentAyahNumber >= pageBoundary.endAyah
            : quranControls.currentAyahNumber >= quranControls.totalAyahs);
        const isPrevSurahDisabled = isPageMode || quranControls.currentSurahNumber <= 1;
        const isNextSurahDisabled = isPageMode || quranControls.currentSurahNumber >= 114;
        const isPlayDisabled = isDuaKhatm || isUnverified;

        return (
          <div
            data-testid="quran-unified-player-section"
            className="p-4 rounded-2xl bg-gradient-to-b from-navy-900 to-navy-950 border border-gold-500/30 space-y-3 shadow-lg"
          >
            {/* Track & Ayah Info */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <div className="text-xs font-serif font-bold text-slate-100 flex items-center gap-1.5 flex-wrap">
                  <span className="truncate" data-testid="audio-surah-info">
                    Surah {quranControls.currentSurahNumber}: {quranControls.currentSurahName}
                  </span>
                  <span
                    data-testid="audio-ayah-badge"
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-300 border border-gold-500/30 whitespace-nowrap"
                  >
                    Ayah {quranControls.currentAyahNumber} / {quranControls.totalAyahs}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5 flex-wrap">
                  <span className="text-slate-500">Reciter:</span>
                  <span className="text-gold-400 font-medium truncate" data-testid="audio-reciter-name">
                    {currentReciter.name}
                  </span>
                  {isPageMode && pageBoundary && !isDuaKhatm && (
                    <span
                      data-testid="audio-page-boundary-badge"
                      className={`text-[10px] font-mono px-1.5 py-0.5 rounded border whitespace-nowrap ${
                        pageBoundary.isVerified
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      }`}
                    >
                      Page {pageBoundary.pageNumber}:{' '}
                      {pageBoundary.isVerified ? `v.${pageBoundary.startAyah}–${pageBoundary.endAyah}` : 'Unverified'}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Scrubber Slider */}
            <div className="w-full flex items-center space-x-2 text-[10px] font-mono text-slate-400">
              <span className="w-9 text-right text-gold-300 font-semibold" data-testid="audio-current-time">
                {formatTime(quranControls.currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={quranControls.duration > 0 ? quranControls.duration : 100}
                step={0.1}
                value={quranControls.currentTime}
                onInput={(e) => quranControls.onSeek(parseFloat((e.target as HTMLInputElement).value))}
                onChange={(e) => quranControls.onSeek(parseFloat(e.target.value))}
                aria-label="Audio scrubber"
                data-testid="audio-progress-bar"
                className="flex-1 h-1.5 bg-navy-800 rounded-lg appearance-none cursor-pointer accent-gold-400"
                style={{
                  background: `linear-gradient(to right, #d97706 ${progressPercent}%, #1e293b ${progressPercent}%)`,
                }}
              />
              <span className="w-9 text-left text-slate-400" data-testid="audio-duration">
                {formatTime(quranControls.duration)}
              </span>
            </div>

            {/* Transport Controls */}
            <div className="flex items-center justify-center space-x-1.5">
              <button
                onClick={quranControls.onPrevSurah}
                disabled={isPrevSurahDisabled}
                data-testid="audio-prev-surah-btn"
                title={isPageMode ? 'Surah navigation disabled in Page Mode' : 'Previous Surah'}
                className="p-1.5 rounded-full text-slate-400 hover:text-gold-400 hover:bg-navy-800 disabled:opacity-30 transition-colors"
              >
                <ChevronsLeft className="w-4 h-4" />
              </button>
              <button
                onClick={quranControls.onPrevAyah}
                disabled={isPrevAyahDisabled}
                data-testid="audio-prev-ayah-btn"
                title="Previous Ayah"
                className="p-1.5 rounded-full text-slate-300 hover:text-gold-400 hover:bg-navy-800 disabled:opacity-30 transition-colors"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                onClick={quranControls.onTogglePlay}
                data-testid="audio-play-pause-btn"
                title={
                  isDuaKhatm
                    ? 'Dua Khatm (Audio Unavailable)'
                    : isUnverified
                    ? 'Page boundaries not yet verified (Audio Disabled)'
                    : quranControls.isPlaying
                    ? 'Pause'
                    : 'Play'
                }
                disabled={isPlayDisabled}
                className="w-10 h-10 rounded-full bg-gold-500 hover:bg-gold-400 disabled:opacity-30 text-navy-950 font-bold flex items-center justify-center shadow-gold-sm transition-transform active:scale-95 flex-shrink-0"
              >
                {quranControls.isLoading && quranControls.isPlaying ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : quranControls.isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </button>
              <button
                onClick={quranControls.onStop}
                data-testid="audio-stop-btn"
                title="Stop Playback"
                className="p-1.5 rounded-full text-slate-400 hover:text-rose-400 hover:bg-navy-800 transition-colors"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
              <button
                onClick={quranControls.onNextAyah}
                disabled={isNextAyahDisabled}
                data-testid="audio-next-ayah-btn"
                title="Next Ayah"
                className="p-1.5 rounded-full text-slate-300 hover:text-gold-400 hover:bg-navy-800 disabled:opacity-30 transition-colors"
              >
                <SkipForward className="w-4 h-4" />
              </button>
              <button
                onClick={quranControls.onNextSurah}
                disabled={isNextSurahDisabled}
                data-testid="audio-next-surah-btn"
                title={isPageMode ? 'Surah navigation disabled in Page Mode' : 'Next Surah'}
                className="p-1.5 rounded-full text-slate-400 hover:text-gold-400 hover:bg-navy-800 disabled:opacity-30 transition-colors"
              >
                <ChevronsRight className="w-4 h-4" />
              </button>
            </div>

            {/* Scope, Reciter, Auto-Advance & Speed */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 pt-2 border-t border-navy-800/80 text-xs">
              <button
                onClick={quranControls.onTogglePlaybackScope}
                data-testid="audio-scope-toggle"
                className={`px-2 py-1 rounded-lg border text-[11px] font-medium transition-colors whitespace-nowrap ${
                  isPageMode
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                    : 'bg-navy-900 text-slate-400 border-navy-800 hover:text-slate-200'
                }`}
              >
                {isPageMode ? '📄 Page' : '📖 Surah'}
              </button>

              <select
                value={quranControls.reciterId}
                onChange={(e) => quranControls.onSelectReciter(e.target.value)}
                data-testid="audio-reciter-select"
                aria-label="Select Reciter"
                className="bg-navy-900 border border-gold-500/30 rounded-lg px-2 py-1 text-[11px] text-slate-200 focus:outline-none focus:border-gold-400 max-w-[140px] truncate"
              >
                {SUPPORTED_RECITERS.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              <button
                onClick={quranControls.onToggleAutoAdvance}
                data-testid="audio-autoadvance-toggle"
                className={`px-2 py-1 rounded-lg border text-[11px] font-medium transition-colors whitespace-nowrap ${
                  quranControls.autoAdvance
                    ? 'bg-gold-500/20 text-gold-300 border-gold-500/50'
                    : 'bg-navy-900 text-slate-400 border-navy-800 hover:text-slate-200'
                }`}
              >
                Auto: {quranControls.autoAdvance ? 'ON' : 'OFF'}
              </button>

              <select
                value={quranControls.playbackSpeed}
                onChange={(e) => quranControls.onChangePlaybackSpeed(Number(e.target.value))}
                data-testid="audio-speed-select"
                aria-label="Playback Speed"
                className="bg-navy-900 border border-gold-500/30 rounded-lg px-1.5 py-1 text-[11px] text-slate-200 focus:outline-none"
              >
                <option value="0.75">0.75x</option>
                <option value="1">1.0x</option>
                <option value="1.25">1.25x</option>
                <option value="1.5">1.5x</option>
              </select>
            </div>

            {/* Quran Boundary / Status Banners */}
            {quranControls.pageRecitationCompleted && (
              <div
                data-testid="audio-page-completed-banner"
                className="text-xs text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 rounded-lg px-3 py-1.5 flex items-center justify-between"
              >
                <div className="flex items-center space-x-1.5 min-w-0">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                  <span className="truncate font-medium" data-testid="audio-completion-message">
                    {quranControls.completionMessage || 'Page recitation completed.'}
                  </span>
                </div>
                <button
                  onClick={quranControls.onTogglePlay}
                  data-testid="audio-replay-page-btn"
                  className="underline hover:text-emerald-100 ml-2 font-medium flex-shrink-0 text-xs"
                >
                  Replay
                </button>
              </div>
            )}

            {isDuaKhatm && (
              <div
                data-testid="audio-dua-khatm-banner"
                className="text-xs text-gold-300 bg-gold-950/80 border border-gold-500/40 rounded-lg px-3 py-1.5 flex items-center space-x-1.5"
              >
                <Info className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
                <span data-testid="audio-dua-khatm-text">
                  {quranControls.completionMessage || 'Dua Khatm al-Quran epilogue plate (Recitation audio unavailable).'}
                </span>
              </div>
            )}

            {isUnverified && !isDuaKhatm && (
              <div
                data-testid="audio-unverified-page-banner"
                className="text-xs text-amber-300 bg-amber-950/80 border border-amber-500/40 rounded-lg px-3 py-1.5 flex items-center space-x-1.5"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span data-testid="audio-unverified-page-text">
                  {quranControls.completionMessage || 'Page boundaries not yet verified. Audio disabled for this page.'}
                </span>
              </div>
            )}

            {quranControls.errorMessage && (
              <div
                data-testid="audio-error-banner"
                className="text-xs text-amber-300 bg-amber-950/70 border border-amber-500/30 rounded-lg px-3 py-1.5 flex items-center justify-between"
              >
                <div className="flex items-center space-x-1.5 min-w-0">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="truncate">{quranControls.errorMessage}</span>
                </div>
                <button
                  onClick={quranControls.onTogglePlay}
                  className="underline hover:text-amber-100 ml-2 font-medium flex-shrink-0 text-xs"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        );
      })()}

      {/* -----------------------------------------------------------------------
          MAIN PLAYER CARD: Current Track Controls & Visualizer (Sacred Audio)
          ----------------------------------------------------------------------- */}
      {showSacredPlayer && activeReq ? (
        <div
          data-testid="sacred-audio-active-player"
          className="p-4 rounded-2xl bg-gradient-to-b from-navy-900 to-navy-950 border border-gold-500/25 space-y-3.5 shadow-lg"
        >
          {quranControls && (
            <div className="flex items-center justify-between pb-2 border-b border-navy-800/80">
              <span className="text-[11px] font-medium text-emerald-400">
                Sacred Audio Active
              </span>
              <button
                type="button"
                onClick={quranControls.onTogglePlay}
                data-testid="switch-to-quran-btn"
                className="text-[11px] font-semibold text-gold-400 hover:text-gold-300 underline"
              >
                Switch to Quran Recitation
              </button>
            </div>
          )}
          {/* Header row: ID & Type Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="font-mono text-[11px] font-bold text-gold-400">
                {activeReq.id}
              </span>
              <span className="text-slate-600">•</span>
              {activeReq.playbackProvider === 'LOCAL_HTML5' ? (
                <span
                  data-testid="audio-format-badge"
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                >
                  Direct Audio
                </span>
              ) : (
                <span
                  data-testid="audio-format-badge"
                  className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30"
                >
                  Video Recitation
                </span>
              )}
            </div>

            <span className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
              {activeReq.tradition}
            </span>
          </div>

          {/* Title & Reciter Metadata */}
          <div>
            <h3
              data-testid="active-track-title"
              className="font-serif text-sm font-bold text-slate-100 leading-snug line-clamp-2"
            >
              {activeReq.requirementTitle}
            </h3>
            <p
              data-testid="active-track-artist"
              className="text-xs text-gold-400/90 font-serif mt-1 truncate"
            >
              {getReciterAttribution(activeReq)}
            </p>
          </div>

          {/* YouTube Embedded Player Frame (When Active & Playing) */}
          {activeReq.playbackProvider === 'YOUTUBE_EMBED' &&
            activeReq.youtubeMetadata?.embedUrl && (
              <div className="space-y-2">
                {isCurrentActivePlaying ? (
                  <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-gold-500/30 shadow-md">
                    <iframe
                      src={`${activeReq.youtubeMetadata.embedUrl}?autoplay=1&enablejsapi=1&rel=0&origin=${encodeURIComponent(
                        typeof window !== 'undefined' ? window.location.origin : ''
                      )}`}
                      title={activeReq.requirementTitle}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div
                    onClick={() => handleTogglePlay(activeReq)}
                    className="relative aspect-video w-full rounded-xl bg-navy-900 border border-gold-500/20 hover:border-gold-500/50 cursor-pointer overflow-hidden flex flex-col items-center justify-center group transition"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-purple-600/30 border border-purple-400/50 flex items-center justify-center text-purple-300 group-hover:scale-110 group-hover:bg-purple-600/50 transition">
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </div>
                    <span className="mt-2 text-xs font-semibold text-slate-300 group-hover:text-gold-300">
                      Watch Video Recitation
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Streamed via Official YouTube Player</span>
                  {activeReq.youtubeMetadata.watchUrl && (
                    <a
                      href={activeReq.youtubeMetadata.watchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-gold-400 hover:underline"
                    >
                      <span>YouTube</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

          {/* Local HTML5 Player Progress & Controls */}
          {activeReq.playbackProvider === 'LOCAL_HTML5' && (
            <div className="space-y-3 pt-1">
              {/* Progress Slider */}
              <div className="space-y-1">
                <input
                  type="range"
                  min="0"
                  max={playbackState.duration > 0 ? playbackState.duration : 100}
                  step="0.1"
                  value={playbackState.currentTime}
                  onChange={handleSeek}
                  disabled={playbackState.duration <= 0}
                  aria-label="Seek audio"
                  data-testid="audio-seek-slider"
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-400">
                  <span>{formatTime(playbackState.currentTime)}</span>
                  <span>{formatTime(playbackState.duration)}</span>
                </div>
              </div>

              {/* Volume Slider */}
              <div className="flex items-center space-x-2 pt-1 border-t border-navy-800/80">
                <button
                  onClick={handleToggleMute}
                  className="text-slate-400 hover:text-gold-400 transition"
                  title={playbackState.isMuted ? 'Unmute' : 'Mute'}
                >
                  {playbackState.isMuted || playbackState.volume === 0 ? (
                    <VolumeX className="w-4 h-4 text-rose-400" />
                  ) : (
                    <Volume2 className="w-4 h-4" />
                  )}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={playbackState.isMuted ? 0 : playbackState.volume}
                  onChange={handleVolume}
                  aria-label="Audio volume"
                  data-testid="audio-volume-slider"
                  className="w-24 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
                />
                <span className="text-[10px] font-mono text-slate-500 ml-auto">
                  {activeReq.rightsEvidence?.exactLicense || 'Rights Cleared'}
                </span>
              </div>
            </div>
          )}

          {/* Playback Action Buttons: Previous, Play/Pause, Next */}
          <div className="flex items-center justify-center space-x-4 pt-2">
            <button
              onClick={handlePreviousTrack}
              disabled={activeNavigationList.length <= 1}
              data-testid="audio-prev-track-btn"
              className="p-2 rounded-xl bg-navy-950 border border-slate-700 text-slate-300 hover:text-gold-400 hover:border-gold-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Previous Recording"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleTogglePlay(activeReq)}
              data-testid="audio-play-pause-btn"
              className="flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-navy-950 font-bold shadow-gold transition transform hover:scale-105"
              title={isCurrentActivePlaying ? 'Pause' : 'Play Recording'}
            >
              {isCurrentActiveLoading ? (
                <div className="w-5 h-5 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
              ) : isCurrentActivePlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={handleNextTrack}
              disabled={activeNavigationList.length <= 1}
              data-testid="audio-next-track-btn"
              className="p-2 rounded-xl bg-navy-950 border border-slate-700 text-slate-300 hover:text-gold-400 hover:border-gold-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Next Recording"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : !showQuranPlayer ? (
        /* ---------------------------------------------------------------------
           LEVEL 5: NO APPROVED MATCH (Strict Graceful Empty State)
           --------------------------------------------------------------------- */
        <div
          data-testid="no-audio-card"
          className="p-5 text-center bg-navy-900/60 border border-amber-500/30 rounded-2xl space-y-2.5 shadow-lg"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <VolumeX className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-sm font-bold text-slate-100">
              No approved recording currently available for this reading.
            </h3>
            <p className="text-xs text-gold-400 font-medium truncate">
              Reading: {activeReadingTitle}
            </p>
          </div>
        </div>
      ) : null}

      {/* Expandable Text & Audio Information (Clutter Simplification) */}
      <div className="border-t border-navy-800/80 pt-2">
        <button
          type="button"
          onClick={() => setShowTextInfo((prev) => !prev)}
          data-testid="text-info-toggle"
          className="w-full flex items-center justify-between text-xs text-slate-400 hover:text-gold-300 py-1 transition"
        >
          <span className="flex items-center space-x-1.5 font-medium">
            <Info className="w-3.5 h-3.5 text-gold-400" />
            <span>Text information</span>
          </span>
          {showTextInfo ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
        {showTextInfo && (
          <div
            data-testid="text-info-details"
            className="mt-2 p-3 rounded-xl bg-navy-900/70 border border-slate-800 text-[11px] text-slate-300 space-y-1.5 leading-relaxed"
          >
            <p>
              <strong className="text-slate-100">Reading:</strong> {activeReadingTitle}
            </p>
            <p>
              <strong className="text-slate-100">Tradition:</strong> {context.religionId} ({totalAvailableForTradition} approved recordings in library)
            </p>
            {activeReq?.rightsEvidence?.exactLicense && (
              <p>
                <strong className="text-slate-100">Audio Rights:</strong> {activeReq.rightsEvidence.exactLicense}
              </p>
            )}
            <p className="text-slate-400">
              Only verified open-licensed or explicitly authorized recordings are enabled. Blocked or pending-permission audio remains disabled.
            </p>
          </div>
        )}
      </div>

      {/* -----------------------------------------------------------------------
          PRIMARY MATCHES LIST (Natural document flow, max 3 items + View all)
          ----------------------------------------------------------------------- */}
      {primaryMatches.length > 1 && (
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold text-slate-300">
              Matching Recordings ({primaryMatches.length})
            </span>
            {primaryMatches.length > 3 && (
              <button
                type="button"
                onClick={() => setIsViewAllOpen(true)}
                data-testid="view-all-recordings-btn"
                className="text-[11px] font-semibold text-gold-400 hover:text-gold-300 underline"
              >
                View all ({primaryMatches.length})
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            {primaryMatches.slice(0, 3).map((req) => {
              const isSelected = activeReq?.id === req.id;
              const isPlayingThis =
                playbackState.currentRequirement?.id === req.id &&
                playbackState.status === 'PLAYING';

              return (
                <div
                  key={req.id}
                  data-testid={`playlist-item-${req.id}`}
                  onClick={() => handleTogglePlay(req)}
                  className={`p-2 rounded-xl border text-left cursor-pointer transition flex items-center justify-between group ${
                    isSelected
                      ? 'bg-gold-500/10 border-gold-500/50 shadow-gold-sm'
                      : 'bg-navy-900/70 border-slate-800/80 hover:bg-navy-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0 pr-2">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-mono ${
                        isPlayingThis
                          ? 'bg-gold-500 text-navy-950 font-bold'
                          : isSelected
                          ? 'bg-gold-500/20 text-gold-400'
                          : 'bg-navy-950 text-slate-400 group-hover:text-gold-400'
                      }`}
                    >
                      {isPlayingThis ? (
                        <Pause className="w-3 h-3 fill-current" />
                      ) : (
                        <Play className="w-3 h-3 fill-current ml-0.5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-gold-300">
                        {req.requirementTitle}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {getReciterAttribution(req)}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------------------
          LEVEL 4: RECOMMENDED TRADITION RECORDINGS (Natural document flow, max 3 + View all)
          ----------------------------------------------------------------------- */}
      {additionalRecordings.length > 0 && (
        <div className="space-y-2 pt-2 border-t border-navy-800/80">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1">
            <span className="font-semibold text-slate-300">
              Recommended Recordings ({additionalRecordings.length})
            </span>
            {additionalRecordings.length > 3 && (
              <button
                type="button"
                onClick={() => setIsViewAllOpen(true)}
                data-testid="view-all-recordings-btn"
                className="text-[11px] font-semibold text-gold-400 hover:text-gold-300 underline"
              >
                View all ({additionalRecordings.length})
              </button>
            )}
          </div>

          <div className="space-y-1.5">
            {additionalRecordings.slice(0, 3).map((req) => {
              const isSelected = activeReq?.id === req.id;
              const isPlayingThis =
                playbackState.currentRequirement?.id === req.id &&
                playbackState.status === 'PLAYING';

              return (
                <div
                  key={req.id}
                  data-testid={`playlist-item-${req.id}`}
                  onClick={() => handleTogglePlay(req)}
                  className={`p-2.5 rounded-xl border text-left cursor-pointer transition flex items-center justify-between group ${
                    isSelected
                      ? 'bg-gold-500/10 border-gold-500/50 shadow-gold-sm'
                      : 'bg-navy-900/70 border-slate-800/80 hover:bg-navy-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0 pr-2">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-mono ${
                        isPlayingThis
                          ? 'bg-gold-500 text-navy-950 font-bold'
                          : isSelected
                          ? 'bg-gold-500/20 text-gold-400'
                          : 'bg-navy-950 text-slate-400 group-hover:text-gold-400'
                      }`}
                    >
                      {isPlayingThis ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-200 truncate group-hover:text-gold-300">
                        {req.requirementTitle}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {getReciterAttribution(req)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5 flex-shrink-0">
                    <span
                      className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                        req.playbackProvider === 'LOCAL_HTML5'
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                          : 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                      }`}
                    >
                      {req.playbackProvider === 'LOCAL_HTML5' ? 'Audio' : 'Video'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Explicit View All Recordings Modal */}
      {isViewAllOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          data-testid="all-recordings-modal"
        >
          <div className="relative w-full max-w-2xl max-h-[85vh] bg-navy-950 border border-gold-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-navy-800">
              <div>
                <h3 className="font-serif text-base font-bold text-slate-100">
                  All Available Recordings — {context.religionId}
                </h3>
                <p className="text-xs text-slate-400">
                  {primaryMatches.length + additionalRecordings.length} verified recordings
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsViewAllOpen(false)}
                data-testid="close-all-recordings-modal"
                className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-navy-900 transition"
                aria-label="Close recordings modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {[...primaryMatches, ...additionalRecordings].map((req) => {
                const isSelected = activeReq?.id === req.id;
                const isPlayingThis =
                  playbackState.currentRequirement?.id === req.id &&
                  playbackState.status === 'PLAYING';
                return (
                  <div
                    key={req.id}
                    onClick={() => {
                      handleTogglePlay(req);
                      setIsViewAllOpen(false);
                    }}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-gold-500/10 border-gold-500/50'
                        : 'bg-navy-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0 pr-2">
                      <div className="w-8 h-8 rounded-lg bg-navy-950 flex items-center justify-center text-gold-400 flex-shrink-0">
                        {isPlayingThis ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-100 truncate">
                          {req.requirementTitle}
                        </div>
                        <div className="text-[11px] text-slate-400 truncate">
                          {getReciterAttribution(req)}
                        </div>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-gold-400/80 flex-shrink-0">{req.id}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};
