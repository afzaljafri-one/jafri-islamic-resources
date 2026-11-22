// ==============================================================================
// Common Platform Generic Audio Player Bar
// Completely independent from QuranAudioService / AudioPlayerBar
// Jafri Religious Books & Audio Platform — Phase 0
// ==============================================================================

import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, X, AlertCircle } from 'lucide-react';
import { genericAudioService, GenericAudioState } from '../services/audioService';

interface GenericAudioPlayerBarProps {
  accentColorClass?: string;
}

export const GenericAudioPlayerBar: React.FC<GenericAudioPlayerBarProps> = ({
  accentColorClass = 'text-gold-400',
}) => {
  const [audioState, setAudioState] = useState<GenericAudioState>(() =>
    genericAudioService.getState()
  );
  const [isVisible, setIsVisible] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = genericAudioService.subscribe((state) => {
      setAudioState(state);
      if (state.status === 'playing' || state.status === 'loading') {
        setIsVisible(true);
      }
    });
    return () => unsubscribe();
  }, []);

  if (!isVisible || !audioState.audioUrl) {
    return null;
  }

  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const mins = Math.floor(secs / 60);
    const rem = Math.floor(secs % 60);
    return `${mins}:${rem < 10 ? '0' : ''}${rem}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-navy-950/95 backdrop-blur-md border-t border-slate-800 p-3 shadow-2xl">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        {/* Track Info */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="w-8 h-8 rounded-lg bg-navy-800 border border-slate-700 flex items-center justify-center flex-shrink-0">
            <Volume2 className={`w-4 h-4 ${accentColorClass}`} />
          </div>
          <div className="truncate">
            <div className="font-semibold text-slate-100 truncate">
              {audioState.trackTitle || 'Audio Track'}
            </div>
            <div className="text-[11px] text-slate-400 truncate">
              {audioState.performerName || 'Narration / Chanting'}
            </div>
          </div>
        </div>

        {/* Controls & Scrubber */}
        <div className="flex items-center space-x-3 w-full sm:w-2/4 justify-center">
          <button
            onClick={() => genericAudioService.seek(Math.max(0, audioState.currentTime - 10))}
            title="Rewind 10 seconds"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => {
              if (audioState.status === 'playing') {
                genericAudioService.pause();
              } else {
                genericAudioService.play();
              }
            }}
            className="p-2.5 rounded-full bg-gold-500 text-navy-950 hover:bg-gold-400 font-bold transition shadow-gold-sm"
          >
            {audioState.status === 'playing' ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4 ml-0.5" />
            )}
          </button>

          <span className="text-[11px] text-slate-400 font-mono w-10 text-right">
            {formatTime(audioState.currentTime)}
          </span>

          <input
            type="range"
            min={0}
            max={audioState.duration || 100}
            value={audioState.currentTime}
            onChange={(e) => genericAudioService.seek(Number(e.target.value))}
            className="flex-1 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
          />

          <span className="text-[11px] text-slate-400 font-mono w-10">
            {formatTime(audioState.duration)}
          </span>
        </div>

        {/* Speed, Volume & Close */}
        <div className="flex items-center space-x-3 self-end sm:self-center">
          {/* Volume Control */}
          <div className="flex items-center space-x-1.5" data-testid="generic-audio-volume-control">
            <button
              onClick={() => genericAudioService.toggleMute()}
              title={audioState.isMuted ? 'Unmute' : 'Mute'}
              className="p-1 rounded text-slate-400 hover:text-slate-100 transition"
              data-testid="audio-mute-toggle-btn"
            >
              {audioState.isMuted || audioState.volume === 0 ? (
                <VolumeX className="w-3.5 h-3.5 text-red-400" />
              ) : (
                <Volume2 className="w-3.5 h-3.5 text-slate-300" />
              )}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={audioState.isMuted ? 0 : audioState.volume}
              onChange={(e) => genericAudioService.setVolume(Number(e.target.value))}
              className="w-14 sm:w-16 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
              title={`Volume: ${Math.round((audioState.isMuted ? 0 : audioState.volume) * 100)}%`}
              data-testid="audio-volume-slider"
            />
          </div>

          {/* Speed Selector */}
          <select
            value={audioState.playbackSpeed}
            onChange={(e) => genericAudioService.setSpeed(Number(e.target.value))}
            className="bg-navy-900 border border-slate-700 text-slate-300 rounded px-1.5 py-0.5 text-[11px] cursor-pointer"
            title="Playback Speed"
            data-testid="audio-speed-select"
          >
            <option value={0.75}>0.75x</option>
            <option value={1.0}>1.0x</option>
            <option value={1.25}>1.25x</option>
            <option value={1.5}>1.5x</option>
            <option value={2.0}>2.0x</option>
          </select>

          {/* Close Player */}
          <button
            onClick={() => {
              genericAudioService.stop();
              setIsVisible(false);
            }}
            title="Close audio player"
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
            data-testid="audio-close-btn"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {audioState.errorMessage && (
        <div className="mt-1 text-center text-red-400 text-[11px] flex items-center justify-center space-x-1">
          <AlertCircle className="w-3 h-3" />
          <span>{audioState.errorMessage}</span>
        </div>
      )}
    </div>
  );
};
