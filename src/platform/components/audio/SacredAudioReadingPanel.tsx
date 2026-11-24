/**
 * ============================================================================
 * ZODIACBEE / JAFRI SACRED AUDIO LIBRARY — PERSISTENT READING PLAYER PANEL
 * Dedicated Right-Column (approx 35%) Contextual Listening Experience
 * Synchronized with UnifiedSacredAudioService & Master Catalogue
 * ============================================================================
 */

import React, { useEffect, useState, useMemo, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ExternalLink,
  Headphones,
  CheckCircle2,
  Info
} from 'lucide-react';
import type { SacredAudioRequirement } from '../../types/sacredAudio';
import {
  unifiedSacredAudioService,
  SacredAudioPlaybackState,
} from '../../services/unifiedSacredAudioService';
import {
  ReadingContext,
  matchContextualAudio,
  ContextualAudioResult,
} from '../../services/contextualAudioMatcher';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds <= 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export interface SacredAudioReadingPanelProps {
  context: ReadingContext;
  className?: string;
}

export const SacredAudioReadingPanel: React.FC<SacredAudioReadingPanelProps> = ({
  context,
  className = '',
}) => {
  // Global playback state from UnifiedSacredAudioService
  const [playbackState, setPlaybackState] = useState<SacredAudioPlaybackState>(() =>
    unifiedSacredAudioService.getState()
  );

  // Subscribe to playback changes
  useEffect(() => {
    const unsubscribe = unifiedSacredAudioService.subscribe((state) => {
      setPlaybackState(state);
    });
    return unsubscribe;
  }, []);

  // Compute contextual audio match result based on reading context
  const matchResult: ContextualAudioResult = useMemo(() => {
    return matchContextualAudio(context);
  }, [
    context.religionId,
    context.categoryId,
    context.collectionId,
    context.bookId,
    context.bookName,
    context.chapterId,
    context.sectionId,
    context.title,
  ]);

  const {
    scopeLabel,
    primaryMatches,
    additionalRecordings,
    totalAvailableForTradition,
    hasDirectMatch,
    message,
  } = matchResult;

  // Combined playlist: primary matches first, followed by other approved recordings in tradition
  const activePlaylist = useMemo(() => {
    return [...primaryMatches, ...additionalRecordings];
  }, [primaryMatches, additionalRecordings]);

  // Selected requirement for display/interaction
  const [selectedReq, setSelectedReq] = useState<SacredAudioRequirement | null>(() => {
    return primaryMatches.length > 0 ? primaryMatches[0] : null;
  });

  // Track canonical reading context key to detect genuine navigation transitions
  const contextKey = [
    context.religionId || '',
    context.categoryId || '',
    context.collectionId || '',
    context.bookId || '',
    context.bookName || '',
    context.chapterId ?? '',
    context.sectionId || '',
    context.title || '',
  ].join('::');

  const prevContextKeyRef = useRef<string>(contextKey);

  // Synchronize selection and stop previous playback when reading context changes
  useEffect(() => {
    const isContextChanged = prevContextKeyRef.current !== contextKey;

    if (isContextChanged) {
      prevContextKeyRef.current = contextKey;

      // Check if active playback belongs to the new reading
      const isCurrentPlayingInNewMatches =
        playbackState.currentRequirement &&
        primaryMatches.some((r) => r.id === playbackState.currentRequirement?.id);

      // Stop previous playback immediately if it belonged to previous reading
      if (playbackState.status !== 'IDLE' && !isCurrentPlayingInNewMatches) {
        unifiedSacredAudioService.stop();
      }

      // Immediately select the matching track for the new reading, or clear if no direct match
      if (primaryMatches.length > 0) {
        setSelectedReq(primaryMatches[0]);
      } else {
        // Clear selection to ensure previous scripture track is NEVER displayed
        setSelectedReq(null);
      }
    } else {
      // Keep selectedReq valid on mount or after direct matches update
      if (!selectedReq && primaryMatches.length > 0) {
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

  // Determine currently active requirement (playing or matching selection)
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

  // Current index in playlist for next/previous navigation
  const currentIndex = activePlaylist.findIndex((r) => r.id === activeReq?.id);

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

  // Next / Previous navigation
  const handlePreviousTrack = () => {
    if (activePlaylist.length <= 1) return;
    const prevIndex =
      currentIndex <= 0 ? activePlaylist.length - 1 : currentIndex - 1;
    const prevReq = activePlaylist[prevIndex];
    setSelectedReq(prevReq);
    if (playbackState.status === 'PLAYING') {
      unifiedSacredAudioService.playRequirement(prevReq);
    }
  };

  const handleNextTrack = () => {
    if (activePlaylist.length <= 1) return;
    const nextIndex =
      currentIndex >= activePlaylist.length - 1 ? 0 : currentIndex + 1;
    const nextReq = activePlaylist[nextIndex];
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

  // Attribution details
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
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-gold-500/15 border border-gold-500/40 flex items-center justify-center text-gold-400">
            <Headphones className="w-4 h-4" />
          </div>
          <div>
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

        {hasDirectMatch ? (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3" />
            <span>Matching Audio</span>
          </span>
        ) : (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <Info className="w-3 h-3" />
            <span>Library Audio</span>
          </span>
        )}
      </div>

      {/* -----------------------------------------------------------------------
          NO DIRECT MATCH NOTICE (Graceful Contextual Fallback)
          ----------------------------------------------------------------------- */}
      {!hasDirectMatch && message && (
        <div
          data-testid="no-audio-matched"
          className="p-3 rounded-2xl bg-navy-900/80 border border-amber-500/30 text-amber-300 text-xs flex items-start space-x-2.5"
        >
          <Info className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">{message}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Showing authentic approved recordings available from this sacred tradition below.
            </p>
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------------------
          MAIN PLAYER CARD: Current Track Controls & Visualizer
          ----------------------------------------------------------------------- */}
      {activeReq ? (
        <div className="p-4 rounded-2xl bg-gradient-to-b from-navy-900 to-navy-950 border border-gold-500/25 space-y-3.5 shadow-lg">
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
              disabled={activePlaylist.length <= 1}
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
              disabled={activePlaylist.length <= 1}
              data-testid="audio-next-track-btn"
              className="p-2 rounded-xl bg-navy-950 border border-slate-700 text-slate-300 hover:text-gold-400 hover:border-gold-500/40 disabled:opacity-30 disabled:cursor-not-allowed transition"
              title="Next Recording"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div
          data-testid="no-audio-card"
          className="p-6 text-center bg-navy-900/60 border border-amber-500/30 rounded-2xl space-y-3 shadow-lg"
        >
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
            <VolumeX className="w-6 h-6" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-sm font-bold text-slate-100">
              No approved recording currently available for this reading.
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
              This scripture text is available for authentic study. You may browse and play approved liturgical recordings from the broader tradition catalogue below.
            </p>
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------------------
          PLAYLIST: Additional Relevant Recordings
          ----------------------------------------------------------------------- */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-semibold text-slate-300">
            {hasDirectMatch
              ? `Recordings (${activePlaylist.length})`
              : `Tradition Catalogue (${activePlaylist.length})`}
          </span>
          <span className="text-[10px] text-gold-400/80 font-mono">
            {activePlaylist.length} Playable
          </span>
        </div>

        <div className="max-h-60 sm:max-h-72 overflow-y-auto space-y-1.5 pr-1 custom-scrollbar">
          {activePlaylist.map((req) => {
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
                  {req.playbackProvider === 'LOCAL_HTML5' ? (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      Audio
                    </span>
                  ) : (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
                      Video
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
