// ==============================================================================
// Multilingual Scripture Audio Player Bar (Command 4 Implementation)
// Unified, responsive player bar supporting Original, Translation, and Dual Interleaved modes.
// Jafri Religious Books & Audio Platform
// ==============================================================================

import React, { useState, useEffect } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Info,
  X,
  Languages,
  Sparkles,
  Layers,
  ExternalLink,
} from 'lucide-react';
import {
  multilingualAudioEngine,
  AudioEngineState,
  ScriptureAudioMode,
  ScriptureAudioEditionOption,
} from '../services/multilingualAudioEngine';

interface MultilingualAudioPlayerBarProps {
  title: string;
  subtitle?: string;
  availableEditions: ScriptureAudioEditionOption[];
  onOpenProvenanceModal?: () => void;
  onClose?: () => void;
}

export const MultilingualAudioPlayerBar: React.FC<MultilingualAudioPlayerBarProps> = ({
  title,
  subtitle,
  availableEditions,
  onOpenProvenanceModal,
  onClose,
}) => {
  const [state, setState] = useState<AudioEngineState>(
    multilingualAudioEngine.getState()
  );

  useEffect(() => {
    const unsubscribe = multilingualAudioEngine.subscribe((next) => {
      setState(next);
    });
    return () => unsubscribe();
  }, []);

  const handlePlayPause = () => {
    if (state.playbackState === 'playing' || state.playbackState === 'buffering') {
      multilingualAudioEngine.pause();
    } else if (state.playbackState === 'paused') {
      multilingualAudioEngine.resume();
    } else {
      multilingualAudioEngine.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    multilingualAudioEngine.seekTo(val);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    multilingualAudioEngine.setVolume(val);
  };

  const handleMute = () => {
    multilingualAudioEngine.toggleMute();
  };

  const handleSpeed = (e: React.ChangeEvent<HTMLSelectElement>) => {
    multilingualAudioEngine.setPlaybackSpeed(parseFloat(e.target.value));
  };

  const handleModeChange = (mode: ScriptureAudioMode) => {
    multilingualAudioEngine.setMode(mode);
  };

  const handleEditionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    multilingualAudioEngine.setEdition(e.target.value);
  };

  const formatTime = (secs: number) => {
    if (!Number.isFinite(secs) || secs < 0) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const activeUnit = multilingualAudioEngine.getActiveUnit();
  const activeAudio = activeUnit?.audio;

  // Sync selected edition if current state.selectedEditionId is not in availableEditions
  useEffect(() => {
    if (availableEditions.length > 0) {
      const match = availableEditions.find((e) => e.id === state.selectedEditionId);
      if (!match) {
        multilingualAudioEngine.setEdition(availableEditions[0].id);
      }
    }
  }, [availableEditions, state.selectedEditionId]);

  const selectedEdition = availableEditions.find(
    (e) => e.id === state.selectedEditionId
  ) || availableEditions[0];

  const displayTitle = activeAudio?.title || title;
  const displaySubtitle = activeAudio?.performer
    ? `${activeAudio.performer} • ${activeAudio.license}`
    : subtitle;

  return (
    <div
      data-testid="multilingual-audio-player-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-navy-950/95 backdrop-blur-md border-t border-gold-500/30 px-3 sm:px-6 py-2.5 sm:py-3 shadow-2xl text-slate-100"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-2">
        {/* Top Controls Row: Mode Selector & Passage Header & Edition Picker */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Active Unit / Title & Dual Phase Indicator */}
          <div className="flex items-center space-x-2">
            <span
              data-testid="audio-player-title"
              className="font-serif font-bold text-slate-200 truncate max-w-[180px] sm:max-w-xs"
            >
              {displayTitle}
            </span>
            {displaySubtitle && (
              <span
                data-testid="audio-player-subtitle"
                className="text-[11px] text-slate-400 hidden md:inline"
              >
                • {displaySubtitle}
              </span>
            )}

            {/* Active Dual Phase Pill */}
            {state.mode === 'dual_interleaved' ? (
              <span
                data-testid="dual-phase-badge"
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center space-x-1 ${
                  state.activePhase === 'original'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                }`}
              >
                <Layers className="w-2.5 h-2.5" />
                <span>
                  {state.activePhase === 'original'
                    ? 'Phase 1: Original'
                    : 'Phase 2: Translation'}
                </span>
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium hidden sm:inline">
                {state.mode === 'translation_only'
                  ? 'Translation Audio'
                  : 'Original Recitation'}
              </span>
            )}
          </div>

          {/* Mode Selector Dropdown / Pills */}
          <div className="flex items-center space-x-1 sm:space-x-1.5" data-testid="audio-mode-selector">
            <button
              onClick={() => handleModeChange('original_only')}
              data-testid="audio-mode-original"
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                state.mode === 'original_only'
                  ? 'bg-gold-500 text-navy-950 font-bold'
                  : 'bg-navy-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              Original
            </button>
            <button
              onClick={() => handleModeChange('translation_only')}
              data-testid="audio-mode-translation"
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-medium transition ${
                state.mode === 'translation_only'
                  ? 'bg-gold-500 text-navy-950 font-bold'
                  : 'bg-navy-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              Translation
            </button>
            <button
              onClick={() => handleModeChange('dual_interleaved')}
              data-testid="audio-mode-dual"
              className={`px-2 sm:px-2.5 py-1 rounded-lg text-[11px] font-medium transition flex items-center space-x-1 ${
                state.mode === 'dual_interleaved'
                  ? 'bg-amber-400 text-navy-950 font-bold'
                  : 'bg-navy-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sparkles className="w-2.5 h-2.5" />
              <span>Dual Interleaved</span>
            </button>
          </div>

          {/* Translation Edition Selector */}
          {availableEditions.length > 1 && (
            <div className="flex items-center space-x-1">
              <Languages className="w-3.5 h-3.5 text-gold-400 hidden sm:inline" />
              <select
                value={
                  state.selectedEditionId === 'default'
                    ? (availableEditions[0]?.id || 'default')
                    : state.selectedEditionId
                }
                onChange={handleEditionChange}
                data-testid="audio-edition-select"
                className="bg-navy-900 border border-gold-500/30 rounded-lg px-2 py-1 text-slate-200 text-[11px] focus:outline-none focus:border-gold-400"
              >
                {availableEditions.map((ed) => (
                  <option key={ed.id} value={ed.id}>
                    {ed.languageName}: {ed.name}{' '}
                    {ed.isSynthesizedNarration ? '[Narration TTS]' : '[Human Audio]'}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Close & Info Actions */}
          <div className="flex items-center space-x-1">
            {onOpenProvenanceModal && (
              <button
                onClick={onOpenProvenanceModal}
                data-testid="audio-provenance-btn"
                title="Licensing & Audio Provenance"
                className="p-1 rounded-lg text-slate-400 hover:text-gold-300 hover:bg-navy-900"
              >
                <Info className="w-4 h-4" />
              </button>
            )}
            {onClose && (
              <button
                onClick={onClose}
                data-testid="audio-close-btn"
                title="Close Audio Bar"
                className="p-1 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-navy-900"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Bottom Playback Controls Row: Play/Pause, Seek, Volume, Speed */}
        <div className="flex items-center justify-between gap-3 pt-1">
          {/* Skip Prev, Play/Pause, Skip Next */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            <button
              onClick={() => multilingualAudioEngine.previousUnit()}
              data-testid="audio-prev-btn"
              title="Previous Passage"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-navy-900 transition"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={handlePlayPause}
              data-testid="audio-play-pause-btn"
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gold-500 hover:bg-gold-400 text-navy-950 flex items-center justify-center font-bold shadow transition transform hover:scale-105"
            >
              {state.playbackState === 'playing' ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={() => multilingualAudioEngine.nextUnit()}
              data-testid="audio-next-btn"
              title="Next Passage"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-navy-900 transition"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          {/* Time & Progress Scrubber */}
          <div className="flex-1 flex items-center space-x-2 text-xs">
            <span className="font-mono text-[10px] text-slate-400 w-10 text-right">
              {formatTime(state.currentTime)}
            </span>
            <input
              type="range"
              min="0"
              max={state.duration || 100}
              step="0.5"
              value={state.currentTime}
              onChange={handleSeek}
              data-testid="audio-seek-slider"
              className="flex-1 accent-gold-500 cursor-pointer h-1.5 bg-navy-800 rounded-lg"
            />
            <span className="font-mono text-[10px] text-slate-400 w-10">
              {formatTime(state.duration)}
            </span>
          </div>

          {/* Speed Selector */}
          <div className="hidden sm:flex items-center space-x-1 text-xs">
            <select
              value={state.playbackSpeed}
              onChange={handleSpeed}
              data-testid="audio-speed-select"
              className="bg-navy-900 border border-slate-700 rounded-lg px-1.5 py-0.5 text-gold-300 text-[11px] font-mono focus:outline-none"
            >
              <option value="0.75">0.75x</option>
              <option value="1">1.0x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
              <option value="2">2.0x</option>
            </select>
          </div>

          {/* Mute & Volume */}
          <div className="flex items-center space-x-1.5 text-xs">
            <button
              onClick={handleMute}
              data-testid="audio-mute-toggle-btn"
              className="p-1 text-slate-400 hover:text-slate-200"
            >
              {state.isMuted || state.volume === 0 ? (
                <VolumeX className="w-4 h-4 text-rose-400" />
              ) : (
                <Volume2 className="w-4 h-4 text-gold-400" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={state.isMuted ? 0 : state.volume}
              onChange={handleVolume}
              data-testid="audio-volume-slider"
              className="w-14 sm:w-20 accent-gold-500 cursor-pointer h-1.5 bg-navy-800 rounded-lg"
            />
          </div>
        </div>

        {/* Error, Provenance, or Synthetic Narration notice bar */}
        {state.errorMessage ? (
          <div
            data-testid="audio-error-notice"
            className="text-[10px] text-rose-400 bg-rose-950/40 border border-rose-500/30 px-2 py-0.5 rounded text-center"
          >
            {state.errorMessage}
          </div>
        ) : activeAudio && !selectedEdition?.isSynthesizedNarration ? (
          <div
            data-testid="audio-provenance-bar"
            className="text-[10px] text-amber-200/90 bg-amber-950/40 border border-amber-500/25 px-2.5 py-0.5 rounded-lg flex flex-wrap items-center justify-between gap-2"
          >
            <div className="flex items-center space-x-1.5 truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
              <span className="font-semibold text-emerald-300">Authentic Human Recording:</span>
              <span className="text-slate-200 font-medium truncate">{activeAudio.title || activeUnit?.label}</span>
              <span className="text-slate-400 truncate">({activeAudio.performer})</span>
            </div>
            <div className="flex items-center space-x-2 text-[10px] text-slate-300 flex-shrink-0">
              <span className="px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300">
                {activeAudio.license}
              </span>
              {activeAudio.audioUrl && (
                <a
                  href={activeAudio.audioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gold-400 hover:text-gold-200 underline flex items-center"
                  title="Source Audio Stream"
                >
                  Source <ExternalLink className="w-2.5 h-2.5 ml-0.5" />
                </a>
              )}
            </div>
          </div>
        ) : selectedEdition?.isSynthesizedNarration ? (
          <div
            data-testid="audio-synthetic-notice"
            className="text-[10px] text-slate-400 flex items-center justify-center space-x-1.5"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span>
              Synthetic Translation Narration ({selectedEdition.languageName}). Text: {selectedEdition.performerOrNarrator}.
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
};
