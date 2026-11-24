/**
 * ============================================================================
 * JAFRI SACRED AUDIO LIBRARY — LOCAL AUDIO PLAYER BAR
 * Stage Gate 5.4B & 5.4C: Persistent Bottom Player for Local HTML5 Audio
 * Dedicated to the 14 Rights-Cleared Local Audio Assets
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Disc3,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import {
  unifiedSacredAudioService,
  SacredAudioPlaybackState
} from '../../services/unifiedSacredAudioService';

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds <= 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const SacredAudioPlayerBar: React.FC = () => {
  const [playbackState, setPlaybackState] = useState<SacredAudioPlaybackState>(
    () => unifiedSacredAudioService.getState()
  );

  useEffect(() => {
    const unsubscribe = unifiedSacredAudioService.subscribe((state) => {
      setPlaybackState(state);
    });
    return unsubscribe;
  }, []);

  const { currentRequirement, status, activeProvider, currentTime, duration, volume, isMuted, errorMessage } =
    playbackState;

  // Only render for local HTML5 playback
  if (activeProvider !== 'LOCAL_HTML5' || !currentRequirement) {
    return null;
  }

  const isPlaying = status === 'PLAYING';
  const isLoading = status === 'LOADING';
  const isError = status === 'ERROR';

  const handleTogglePlay = () => {
    if (isPlaying) {
      unifiedSacredAudioService.pause();
    } else {
      unifiedSacredAudioService.resume();
    }
  };

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

  const handleClose = () => {
    unifiedSacredAudioService.stop();
  };

  const licenceBadge = currentRequirement.rightsEvidence?.exactLicense || 'Rights Cleared';

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-navy-950/95 backdrop-blur-md border-t border-gold-500/30 shadow-2xl px-3 sm:px-6 py-2.5 sm:py-3 transition-transform animate-in slide-in-from-bottom duration-200"
      role="region"
      aria-label="Sacred Audio Player Bar"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4">
        {/* Track Metadata Info */}
        <div className="flex items-center space-x-3 w-full md:w-1/3 min-w-0">
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center flex-shrink-0 ${
              isPlaying ? 'animate-spin-slow' : ''
            }`}
          >
            <Disc3 className="w-5 h-5 text-gold-400" />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex items-center space-x-1.5 flex-wrap">
              <span className="font-mono text-[10px] font-bold text-gold-400">
                {currentRequirement.id}
              </span>
              <span className="text-slate-600">•</span>
              <span className="px-1.5 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider bg-gold-500/10 text-gold-300 border border-gold-500/20">
                {currentRequirement.tradition}
              </span>
            </div>
            <h4 className="font-serif text-xs sm:text-sm font-bold text-slate-100 truncate mt-0.5">
              {currentRequirement.requirementTitle}
            </h4>
            <p className="text-[11px] text-slate-400 truncate">
              {currentRequirement.rightsEvidence?.performerName || 'Traditional Recitation'}
            </p>
          </div>
        </div>

        {/* Central Controls & Seek Bar */}
        <div className="flex flex-col items-center w-full md:w-1/2 space-y-1">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleTogglePlay}
              disabled={isLoading || isError}
              className="p-2 sm:p-2.5 rounded-full bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 hover:from-gold-400 hover:to-gold-300 shadow-gold transition transform hover:scale-105 disabled:opacity-50"
              aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>
          </div>

          {/* Time & Progress Bar */}
          <div className="w-full flex items-center space-x-2 text-[11px] font-mono text-slate-400">
            <span className="w-10 text-right">{formatTime(currentTime)}</span>
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              disabled={isLoading || isError || !duration}
              className="flex-1 h-1.5 bg-navy-800 rounded-lg appearance-none cursor-pointer accent-gold-500 focus:outline-none"
              aria-label="Seek audio position"
            />
            <span className="w-10 text-left">{formatTime(duration)}</span>
          </div>

          {errorMessage && (
            <div className="flex items-center space-x-1 text-[11px] text-rose-400">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="truncate">{errorMessage}</span>
            </div>
          )}
        </div>

        {/* Volume & Close Controls */}
        <div className="hidden md:flex items-center justify-end space-x-4 w-1/4">
          {/* Rights Badge */}
          <div className="flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <ShieldCheck className="w-3 h-3" />
            <span>{licenceBadge}</span>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleToggleMute}
              className="p-1 text-slate-400 hover:text-gold-400 transition"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolume}
              className="w-16 h-1 bg-navy-800 rounded appearance-none cursor-pointer accent-gold-500"
              aria-label="Volume slider"
            />
          </div>

          {/* Close Player Button */}
          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-navy-800 transition"
            aria-label="Close audio player"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mobile Close Button */}
        <button
          onClick={handleClose}
          className="md:hidden absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-100"
          aria-label="Close audio player"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
