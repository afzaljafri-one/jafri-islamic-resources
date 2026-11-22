import React from 'react';
import {
  Play,
  Pause,
  Square,
  SkipBack,
  SkipForward,
  ChevronsLeft,
  ChevronsRight,
  Volume2,
  X,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Info,
} from 'lucide-react';
import { SUPPORTED_RECITERS } from '../../types/quran';
import { PlaybackScope, PageAyahBoundary } from '../../services/audio/types';

export interface AudioPlayerBarProps {
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
  onClosePlayer: () => void;
}

function formatTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) return '00:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export const AudioPlayerBar: React.FC<AudioPlayerBarProps> = ({
  isPlaying,
  isLoading,
  currentSurahNumber,
  currentSurahName,
  currentAyahNumber,
  totalAyahs,
  reciterId,
  currentTime,
  duration,
  playbackScope,
  onTogglePlaybackScope,
  pageBoundary,
  pageRecitationCompleted,
  completionMessage,
  onSelectReciter,
  onTogglePlay,
  onStop,
  onSeek,
  onNextAyah,
  onPrevAyah,
  onNextSurah,
  onPrevSurah,
  autoAdvance,
  onToggleAutoAdvance,
  playbackSpeed,
  onChangePlaybackSpeed,
  errorMessage,
  onClosePlayer,
}) => {
  const currentReciter =
    SUPPORTED_RECITERS.find((r) => r.id === reciterId) || SUPPORTED_RECITERS[0];

  const progressPercent = duration > 0 ? Math.min(100, (currentTime / duration) * 100) : 0;

  const isPageMode = playbackScope === 'page';
  const hasPageBoundary = isPageMode && pageBoundary !== null;
  const isDuaKhatm = pageBoundary?.isDuaKhatmOnly ?? false;
  const isUnverified = hasPageBoundary && !pageBoundary.isVerified;

  const isPrevAyahDisabled = isUnverified || (hasPageBoundary && pageBoundary.startAyah > 0
    ? currentAyahNumber <= pageBoundary.startAyah
    : currentAyahNumber <= 1);

  const isNextAyahDisabled = isUnverified || (hasPageBoundary && pageBoundary.endAyah > 0
    ? currentAyahNumber >= pageBoundary.endAyah
    : currentAyahNumber >= totalAyahs);

  const isPrevSurahDisabled = isPageMode || currentSurahNumber <= 1;
  const isNextSurahDisabled = isPageMode || currentSurahNumber >= 114;
  const isPlayDisabled = isDuaKhatm || isUnverified;

  return (
    <div
      data-testid="audio-player-bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-navy-950/98 backdrop-blur-md border-t border-gold-500/30 shadow-2xl px-2.5 sm:px-6 py-2 sm:py-3 animate-in slide-in-from-bottom duration-200 select-none max-w-full overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-1.5 sm:gap-2">
        {/* Progress Scrubber Slider */}
        <div className="w-full flex items-center space-x-2 sm:space-x-2.5 text-[10px] sm:text-[11px] font-mono text-slate-400">
          <span className="w-9 sm:w-10 text-right text-gold-300 font-semibold" data-testid="audio-current-time">
            {formatTime(currentTime)}
          </span>
          <div className="relative flex-1 flex items-center group">
            <input
              type="range"
              min={0}
              max={duration > 0 ? duration : 100}
              step={0.1}
              value={currentTime}
              onInput={(e) => onSeek(parseFloat((e.target as HTMLInputElement).value))}
              onChange={(e) => onSeek(parseFloat(e.target.value))}
              aria-label="Audio scrubber"
              data-testid="audio-progress-bar"
              className="w-full h-1.5 bg-navy-800 rounded-lg appearance-none cursor-pointer accent-gold-400 hover:h-2 transition-all"
              style={{
                background: `linear-gradient(to right, #d97706 ${progressPercent}%, #1e293b ${progressPercent}%)`,
              }}
            />
          </div>
          <span className="w-9 sm:w-10 text-left text-slate-400" data-testid="audio-duration">
            {formatTime(duration)}
          </span>
        </div>

        {/* Main Controls Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 sm:gap-3 w-full">
          {/* Left: Active Track Details */}
          <div className="flex items-center space-x-2.5 sm:space-x-3 w-full md:w-auto md:max-w-[35%] justify-between md:justify-start">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 flex-shrink-0">
              <Volume2 className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-serif font-bold text-slate-100 flex items-center gap-1.5 truncate flex-wrap">
                <span className="truncate" data-testid="audio-surah-info">
                  Surah {currentSurahNumber}: {currentSurahName}
                </span>
                <span
                  data-testid="audio-ayah-badge"
                  className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-gold-500/20 text-gold-300 border border-gold-500/30 whitespace-nowrap flex-shrink-0"
                >
                  Ayah {currentAyahNumber} / {totalAyahs}
                </span>
                {isPageMode && pageBoundary && !isDuaKhatm && (
                  <span
                    data-testid="audio-page-boundary-badge"
                    title={`Page-bounded audio: Page ${pageBoundary.pageNumber} (${pageBoundary.edition})`}
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded border whitespace-nowrap flex-shrink-0 ${
                      pageBoundary.isVerified
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                    }`}
                  >
                    Page {pageBoundary.pageNumber}: {pageBoundary.isVerified ? `v.${pageBoundary.startAyah}–${pageBoundary.endAyah}` : 'Unverified'}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1.5 truncate">
                <span className="text-slate-500">Reciter:</span>
                <span className="text-gold-400 font-medium truncate" data-testid="audio-reciter-name">
                  {currentReciter.name}
                </span>
                <span className="text-slate-600 hidden sm:inline">•</span>
                <span className="text-slate-400 text-[10px] hidden sm:inline">{currentReciter.style}</span>
              </div>
            </div>

            <button
              onClick={onClosePlayer}
              data-testid="audio-close-btn-mobile"
              title="Close Player"
              className="md:hidden text-slate-400 hover:text-slate-200 p-1 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Center: Playback Controls */}
          <div className="flex items-center justify-center space-x-1.5 sm:space-x-3 w-full md:w-auto my-0.5 sm:my-0 flex-shrink-0">
            {/* Prev Surah */}
            <button
              onClick={onPrevSurah}
              disabled={isPrevSurahDisabled}
              data-testid="audio-prev-surah-btn"
              title={isPageMode ? "Surah navigation disabled in Page Mode" : "Previous Surah"}
              className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-gold-400 hover:bg-navy-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronsLeft className="w-4 h-4" />
            </button>

            {/* Prev Ayah */}
            <button
              onClick={onPrevAyah}
              disabled={isPrevAyahDisabled}
              data-testid="audio-prev-ayah-btn"
              title={isPrevAyahDisabled ? "First Ayah of page reached or unverified" : "Previous Ayah"}
              className="p-1.5 sm:p-2 rounded-full text-slate-300 hover:text-gold-400 hover:bg-navy-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            {/* Play / Pause */}
            <button
              onClick={onTogglePlay}
              data-testid="audio-play-pause-btn"
              title={isDuaKhatm ? "Dua Khatm (Audio Unavailable)" : isUnverified ? "Page boundaries not yet verified (Audio Disabled)" : isPlaying ? "Pause" : "Play"}
              disabled={isPlayDisabled}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gold-500 hover:bg-gold-400 disabled:opacity-30 disabled:hover:bg-gold-500 text-navy-950 font-bold flex items-center justify-center shadow-gold-sm transition-transform active:scale-95 flex-shrink-0"
            >
              {isLoading && isPlaying ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : isPlaying ? (
                <Pause className="w-4 h-4" />
              ) : (
                <Play className="w-4 h-4 ml-0.5" />
              )}
            </button>

            {/* Stop Button */}
            <button
              onClick={onStop}
              data-testid="audio-stop-btn"
              title="Stop Playback"
              className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-rose-400 hover:bg-navy-800 transition-colors"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
            </button>

            {/* Next Ayah */}
            <button
              onClick={onNextAyah}
              disabled={isNextAyahDisabled}
              data-testid="audio-next-ayah-btn"
              title={isNextAyahDisabled ? "Final Ayah of page reached or unverified" : "Next Ayah"}
              className="p-1.5 sm:p-2 rounded-full text-slate-300 hover:text-gold-400 hover:bg-navy-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            {/* Next Surah */}
            <button
              onClick={onNextSurah}
              disabled={isNextSurahDisabled}
              data-testid="audio-next-surah-btn"
              title={isPageMode ? "Surah navigation disabled in Page Mode" : "Next Surah"}
              className="p-1.5 sm:p-2 rounded-full text-slate-400 hover:text-gold-400 hover:bg-navy-800 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronsRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Scope Toggle, Reciter, Auto-advance, Speed, Close */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-1.5 sm:gap-2 text-xs w-full md:w-auto">
            {/* Playback Scope Toggle (Page vs Surah) */}
            <button
              onClick={onTogglePlaybackScope}
              data-testid="audio-scope-toggle"
              title={
                isPageMode
                  ? "Page Mode active: Recitation stops at page end. Click to switch to Surah Mode."
                  : "Surah Mode active: Recitation continues through entire Surah. Click to switch to Page Mode."
              }
              className={`px-2 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border text-[10px] sm:text-[11px] font-medium transition-colors whitespace-nowrap flex items-center gap-1 ${
                isPageMode
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                  : 'bg-navy-900 text-slate-400 border-navy-800 hover:text-slate-200'
              }`}
            >
              <span>{isPageMode ? '📄 Page' : '📖 Surah'}</span>
            </button>

            {/* Reciter Selector */}
            <select
              value={reciterId}
              onChange={(e) => onSelectReciter(e.target.value)}
              data-testid="audio-reciter-select"
              aria-label="Select Reciter"
              className="bg-navy-900 border border-gold-500/30 rounded-lg px-1.5 sm:px-2.5 py-1 sm:py-1.5 text-[10px] sm:text-xs text-slate-200 focus:outline-none focus:border-gold-400 max-w-[110px] sm:max-w-[130px] md:max-w-none truncate"
            >
              {SUPPORTED_RECITERS.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>

            {/* Auto-Advance Toggle */}
            <button
              onClick={onToggleAutoAdvance}
              data-testid="audio-autoadvance-toggle"
              title="Automatically advance to the next verse when current verse audio ends"
              className={`px-1.5 sm:px-2.5 py-1 sm:py-1.5 rounded-lg border text-[10px] sm:text-[11px] font-medium transition-colors whitespace-nowrap ${
                autoAdvance
                  ? 'bg-gold-500/20 text-gold-300 border-gold-500/50'
                  : 'bg-navy-900 text-slate-400 border-navy-800 hover:text-slate-200'
              }`}
            >
              Auto: {autoAdvance ? 'ON' : 'OFF'}
            </button>

            {/* Speed Selector */}
            <select
              value={playbackSpeed}
              onChange={(e) => onChangePlaybackSpeed(Number(e.target.value))}
              data-testid="audio-speed-select"
              aria-label="Playback Speed"
              className="bg-navy-900 border border-gold-500/30 rounded-lg px-1 sm:px-2 py-1 sm:py-1.5 text-[10px] sm:text-xs text-slate-200 focus:outline-none"
            >
              <option value="0.75">0.75x</option>
              <option value="1">1.0x</option>
              <option value="1.25">1.25x</option>
              <option value="1.5">1.5x</option>
            </select>

            <button
              onClick={onClosePlayer}
              data-testid="audio-close-btn-desktop"
              title="Close Player"
              className="hidden md:flex p-1.5 text-slate-400 hover:text-slate-200 hover:bg-navy-800 rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Page Recitation Completed Banner */}
      {pageRecitationCompleted && (
        <div
          data-testid="audio-page-completed-banner"
          className="mt-2 text-xs text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 rounded-lg px-3 py-1.5 flex items-center justify-between animate-in fade-in"
        >
          <div className="flex items-center space-x-1.5 min-w-0">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span className="truncate font-medium" data-testid="audio-completion-message">
              {completionMessage || 'Page recitation completed. Press Play to replay page from beginning.'}
            </span>
          </div>
          <button
            onClick={onTogglePlay}
            data-testid="audio-replay-page-btn"
            className="underline hover:text-emerald-100 ml-2 font-medium flex-shrink-0 text-xs"
          >
            Replay Page
          </button>
        </div>
      )}

      {/* Dua Khatm al-Quran Notice Banner */}
      {isDuaKhatm && (
        <div
          data-testid="audio-dua-khatm-banner"
          className="mt-2 text-xs text-gold-300 bg-gold-950/80 border border-gold-500/40 rounded-lg px-3 py-1.5 flex items-center space-x-1.5 animate-in fade-in"
        >
          <Info className="w-3.5 h-3.5 text-gold-400 flex-shrink-0" />
          <span data-testid="audio-dua-khatm-text">
            {completionMessage || 'Dua Khatm al-Quran epilogue plate (Closing Supplication — Non-Quranic text, recitation audio not available).'}
          </span>
        </div>
      )}

      {/* Unverified Page Boundaries Notice Banner */}
      {isUnverified && !isDuaKhatm && (
        <div
          data-testid="audio-unverified-page-banner"
          className="mt-2 text-xs text-amber-300 bg-amber-950/80 border border-amber-500/40 rounded-lg px-3 py-1.5 flex items-center space-x-1.5 animate-in fade-in"
        >
          <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
          <span data-testid="audio-unverified-page-text">
            {completionMessage || 'Page boundaries not yet verified. Recitation audio is disabled for this page.'}
          </span>
        </div>
      )}

      {/* Error message banner if streaming fails */}
      {errorMessage && (
        <div
          data-testid="audio-error-banner"
          className="mt-2 text-xs text-amber-300 bg-amber-950/70 border border-amber-500/30 rounded-lg px-3 py-1.5 flex items-center justify-between"
        >
          <div className="flex items-center space-x-1.5 min-w-0">
            <AlertCircle className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
            <span className="truncate">{errorMessage}</span>
          </div>
          <button
            onClick={onTogglePlay}
            className="underline hover:text-amber-100 ml-2 font-medium flex-shrink-0 text-xs"
          >
            Retry
          </button>
        </div>
      )}
    </div>
  );
};
