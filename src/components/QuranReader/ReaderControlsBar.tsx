import React from 'react';
import {
  BookOpen,
  Search,
  Bookmark,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  BookMarked,
  Type,
  FileDown,
  Loader2,
  Volume2,
} from 'lucide-react';
import { ArabicScriptType, SurahMeta, LastReadPosition } from '../../types/quran';

interface ReaderControlsBarProps {
  currentSurah: SurahMeta;
  onOpenSurahSidebar: () => void;
  onPrevSurah: () => void;
  onNextSurah: () => void;
  selectedScript: ArabicScriptType;
  onSelectScript: (script: ArabicScriptType) => void;
  selectedUrduTranslation: 'ur.jawadi' | 'ur.jalandhry';
  onSelectUrduTranslation: (trans: 'ur.jawadi' | 'ur.jalandhry') => void;
  viewMode: 'verse' | 'mushaf' | 'pages';
  onToggleViewMode: (mode: 'verse' | 'mushaf' | 'pages') => void;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  onChangeFontSize: (size: 'sm' | 'md' | 'lg' | 'xl') => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  bookmarksCount: number;
  lastReadPosition: LastReadPosition | null;
  onResumeLastRead: () => void;
  onDownloadPdf?: () => void;
  isDownloadingPdf?: boolean;
  onToggleAudioPlayer?: () => void;
  isAudioActive?: boolean;
}

export const ReaderControlsBar: React.FC<ReaderControlsBarProps> = ({
  currentSurah,
  onOpenSurahSidebar,
  onPrevSurah,
  onNextSurah,
  selectedScript,
  onSelectScript,
  selectedUrduTranslation,
  onSelectUrduTranslation,
  viewMode,
  onToggleViewMode,
  fontSize,
  onChangeFontSize,
  onOpenSearch,
  onOpenBookmarks,
  bookmarksCount,
  lastReadPosition,
  onResumeLastRead,
  onDownloadPdf,
  isDownloadingPdf,
  onToggleAudioPlayer,
  isAudioActive,
}) => {
  return (
    <div className="sticky top-[69px] z-30 bg-navy-950/90 backdrop-blur-md border-b border-gold-500/20 py-2 px-2.5 sm:px-4 lg:px-8 space-y-2" data-testid="reader-controls-bar">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-xs">
        {/* Left: Surah Navigator Trigger & Prev/Next */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          {/* Prev Surah */}
          <button
            onClick={onPrevSurah}
            disabled={currentSurah.number <= 1}
            title="Previous Surah"
            className="p-1.5 rounded-lg bg-navy-900 border border-gold-500/20 text-slate-300 hover:text-gold-400 hover:border-gold-400 disabled:opacity-40 disabled:hover:text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Surah Picker Trigger Button */}
          <button
            onClick={onOpenSurahSidebar}
            data-testid="surah-picker-btn"
            className="flex items-center space-x-1.5 sm:space-x-2 px-2.5 sm:px-3 py-1.5 rounded-xl bg-navy-900 border border-gold-500/40 hover:border-gold-400 text-slate-100 font-serif font-bold shadow-sm transition-all max-w-[200px] sm:max-w-none"
          >
            <BookOpen className="w-4 h-4 text-gold-400 flex-shrink-0" />
            <span className="truncate">
              {currentSurah.number}. {currentSurah.englishName}
            </span>
            <span className="font-quran text-sm text-gold-400 mr-1 hidden xs:inline">{currentSurah.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1 flex-shrink-0" />
          </button>

          {/* Next Surah */}
          <button
            onClick={onNextSurah}
            disabled={currentSurah.number >= 114}
            title="Next Surah"
            className="p-1.5 rounded-lg bg-navy-900 border border-gold-500/20 text-slate-300 hover:text-gold-400 hover:border-gold-400 disabled:opacity-40 disabled:hover:text-slate-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Center: Script & Translation Controls */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* Script Selector */}
          <div className="inline-flex rounded-lg border border-gold-500/30 p-0.5 bg-navy-900">
            <button
              onClick={() => onSelectScript('uthmani')}
              className={`px-1.5 sm:px-2 py-1 rounded text-[10px] sm:text-[11px] font-medium transition-colors ${
                selectedScript === 'uthmani'
                  ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Uthmani
            </button>
            <button
              onClick={() => onSelectScript('indopak')}
              className={`px-1.5 sm:px-2 py-1 rounded text-[10px] sm:text-[11px] font-medium transition-colors ${
                selectedScript === 'indopak'
                  ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              IndoPak
            </button>
            <button
              onClick={() => onSelectScript('tajweed')}
              className={`px-1.5 sm:px-2 py-1 rounded text-[10px] sm:text-[11px] font-medium transition-colors ${
                selectedScript === 'tajweed'
                  ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tajweed
            </button>
          </div>

          {/* Urdu Scholar Selector */}
          <div className="flex items-center space-x-1.5 bg-navy-900 border border-gold-500/30 rounded-lg px-2 py-1 max-w-[170px] sm:max-w-none">
            <span className="text-[10px] text-slate-400 font-medium">Urdu:</span>
            <select
              value={selectedUrduTranslation}
              onChange={(e) => onSelectUrduTranslation(e.target.value as any)}
              className="bg-transparent text-[11px] text-gold-400 font-medium focus:outline-none cursor-pointer max-w-[120px] sm:max-w-none truncate"
            >
              <option value="ur.jawadi" className="bg-navy-900 text-slate-100">
                Allama Syed Zeeshan Haider Jawadi [AlQuran Cloud]
              </option>
              <option value="ur.jalandhry" className="bg-navy-900 text-slate-100">
                Fateh Muhammad Jalandhry [UmmahAPI]
              </option>
            </select>
          </div>
        </div>

        {/* Right: View Mode, Font Size, Bookmarks & Search */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {/* View Mode Toggle */}
          <div className="inline-flex rounded-lg border border-gold-500/30 p-0.5 bg-navy-900">
            <button
              onClick={() => onToggleViewMode('verse')}
              data-testid="view-mode-verse"
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                viewMode === 'verse'
                  ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Verses
            </button>
            <button
              onClick={() => onToggleViewMode('mushaf')}
              data-testid="view-mode-mushaf"
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                viewMode === 'mushaf'
                  ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Flow
            </button>
            <button
              onClick={() => onToggleViewMode('pages')}
              data-testid="view-mode-pages"
              className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                viewMode === 'pages'
                  ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Mushaf Pages
            </button>
          </div>

          {/* Font Size Toggle */}
          <div className="flex items-center bg-navy-900 border border-gold-500/30 rounded-lg p-0.5">
            <button
              onClick={() => {
                const sizes: ('sm' | 'md' | 'lg' | 'xl')[] = ['sm', 'md', 'lg', 'xl'];
                const idx = sizes.indexOf(fontSize);
                if (idx > 0) onChangeFontSize(sizes[idx - 1]);
              }}
              disabled={fontSize === 'sm'}
              title="Decrease font size"
              className="px-1.5 py-0.5 text-[10px] text-slate-300 hover:text-gold-400 disabled:opacity-40"
            >
              A-
            </button>
            <Type className="w-3 h-3 text-gold-400 mx-0.5" />
            <button
              onClick={() => {
                const sizes: ('sm' | 'md' | 'lg' | 'xl')[] = ['sm', 'md', 'lg', 'xl'];
                const idx = sizes.indexOf(fontSize);
                if (idx < sizes.length - 1) onChangeFontSize(sizes[idx + 1]);
              }}
              disabled={fontSize === 'xl'}
              title="Increase font size"
              className="px-1.5 py-0.5 text-[10px] text-slate-300 hover:text-gold-400 disabled:opacity-40"
            >
              A+
            </button>
          </div>

          {/* Download IndoPak Mushaf PDF */}
          {onDownloadPdf && (
            <button
              onClick={onDownloadPdf}
              disabled={isDownloadingPdf}
              title={`Download Surah ${currentSurah.number} (${currentSurah.englishName}) Digital Vector PDF`}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-navy-900 border border-gold-500/40 hover:border-gold-400 hover:bg-gold-500/10 text-gold-300 transition-colors disabled:opacity-50"
            >
              {isDownloadingPdf ? (
                <Loader2 className="w-3.5 h-3.5 text-gold-400 animate-spin" />
              ) : (
                <FileDown className="w-3.5 h-3.5 text-gold-400" />
              )}
              <span className="hidden sm:inline font-medium">Download PDF</span>
            </button>
          )}

          {/* Audio Player Trigger */}
          {onToggleAudioPlayer && (
            <button
              onClick={onToggleAudioPlayer}
              data-testid="controls-audio-toggle"
              title={isAudioActive ? 'Hide Audio Player' : 'Open Quran Audio Player'}
              className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg border transition-colors ${
                isAudioActive
                  ? 'bg-gold-500/20 text-gold-300 border-gold-500/50 shadow-sm'
                  : 'bg-navy-900 border-gold-500/30 text-slate-200 hover:text-gold-400 hover:border-gold-400'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden sm:inline">Audio</span>
            </button>
          )}

          {/* Bookmarks Drawer Trigger */}
          <button
            onClick={onOpenBookmarks}
            title="Saved Bookmarks"
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-navy-900 border border-gold-500/30 text-slate-200 hover:text-gold-400 hover:border-gold-400 transition-colors"
          >
            <Bookmark className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden sm:inline">Bookmarks</span>
            {bookmarksCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-gold-500 text-navy-950 font-mono text-[9px] font-bold flex items-center justify-center">
                {bookmarksCount}
              </span>
            )}
          </button>

          {/* Search Trigger */}
          <button
            onClick={onOpenSearch}
            title="Search Quran"
            className="p-1.5 rounded-lg bg-navy-900 border border-gold-500/30 text-slate-300 hover:text-gold-400 hover:border-gold-400 transition-colors"
          >
            <Search className="w-4 h-4 text-gold-400" />
          </button>
        </div>
      </div>

      {/* Optional: Resume Last Read Position Pill */}
      {lastReadPosition && lastReadPosition.surahNumber !== currentSurah.number && (
        <div className="max-w-7xl mx-auto flex items-center justify-between px-3 py-1.5 rounded-lg bg-gold-500/10 border border-gold-500/30 text-[11px]">
          <div className="flex items-center space-x-2 text-gold-300">
            <BookMarked className="w-3.5 h-3.5 text-gold-400" />
            <span>
              Last Reading Position: <strong>Surah {lastReadPosition.surahEnglishName}</strong> (Verse {lastReadPosition.ayahNumber})
            </span>
          </div>
          <button
            onClick={onResumeLastRead}
            className="text-xs font-bold text-gold-400 hover:underline hover:text-gold-300"
          >
            Resume Reading →
          </button>
        </div>
      )}
    </div>
  );
};
