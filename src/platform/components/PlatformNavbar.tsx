// ==============================================================================
// Common Platform Unified Navbar
// Jafri Religious Books & Audio Platform — Phase 0
// ==============================================================================

import React from 'react';
import { Home, Bookmark, Globe, ChevronDown, Headphones, BookOpen, BookMarked, Search } from 'lucide-react';
import { ReligionId } from '../types/religion';
import { RELIGIONS_REGISTRY, ALL_RELIGION_IDS } from '../config/religionsRegistry';

interface PlatformNavbarProps {
  activeReligion: ReligionId | 'home' | 'sacred-audio';
  onSelectReligion: (rel: ReligionId | 'home' | 'sacred-audio') => void;
  onOpenSearch?: () => void;
  onOpenBookmarks?: () => void;
  onOpenMyLibrary?: (initialTab?: 'continue' | 'bookmarks' | 'history' | 'progress') => void;
  onOpenCoverage?: () => void;
  onOpenSpanishPilot?: () => void;
  onOpenStudio?: () => void;
  onOpenSacredAudio?: () => void;
  bookmarksCount?: number;
}

export const PlatformNavbar: React.FC<PlatformNavbarProps> = ({
  activeReligion,
  onSelectReligion,
  onOpenSearch,
  onOpenBookmarks,
  onOpenMyLibrary,
  onOpenCoverage,
  onOpenSpanishPilot,
  onOpenStudio,
  bookmarksCount = 0,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur-md border-b border-gold-500/20 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 shadow-lg max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2.5 sm:gap-4">
        {/* Brand Logo & Title */}
        <button
          onClick={() => onSelectReligion('home')}
          className="flex items-center space-x-2.5 sm:space-x-3.5 text-left group"
        >
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-navy-800 border border-gold-500/40 shadow-gold-sm flex-shrink-0 group-hover:border-gold-400 transition">
            <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-gold-400" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-serif text-sm sm:text-base font-bold tracking-wider text-slate-100">
                JAFRI
              </span>
              <span className="font-serif text-xs sm:text-sm font-semibold tracking-widest text-gold-400">
                SACRED LIBRARY
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 tracking-wide hidden md:block">
              Seven Sacred World Traditions • Free Public Access
            </p>
          </div>
        </button>

        {/* Religion Switcher / Dropdown for Header */}
        <div className="flex items-center space-x-2">
          {/* Quick Home Pill */}
          <button
            onClick={() => onSelectReligion('home')}
            className={`flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              activeReligion === 'home'
                ? 'bg-gold-500 text-navy-950 border-gold-500 shadow-gold-sm'
                : 'bg-navy-950 border-slate-700 text-slate-300 hover:text-gold-400 hover:border-gold-500/50'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Overview</span>
          </button>

          {/* Quick Religion Dropdown */}
          <div className="relative">
            <select
              id="platform-religion-selector"
              value={activeReligion}
              onChange={(e) => onSelectReligion(e.target.value as ReligionId | 'home')}
              className="bg-navy-950 border border-gold-500/30 text-slate-100 rounded-xl px-2.5 sm:px-3 py-1.5 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-gold-500 cursor-pointer appearance-none pr-7 sm:pr-8"
            >
              <option value="home">All 7 Religions...</option>
              {ALL_RELIGION_IDS.map((id) => {
                const rel = RELIGIONS_REGISTRY[id];
                return (
                  <option key={id} value={id}>
                    {rel.name} ({rel.nativeName})
                  </option>
                );
              })}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-gold-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Sacred Audio Library Button (Gates 5.4B-D) */}
          <button
            id="platform-nav-sacred-audio-btn"
            onClick={() => onSelectReligion('sacred-audio')}
            title="Jafri Sacred Audio Library (651 Requirements across 7 Traditions)"
            className={`flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              activeReligion === 'sacred-audio'
                ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 border-gold-400 font-bold shadow-gold-sm'
                : 'bg-navy-950 border-gold-500/40 hover:border-gold-400 text-gold-300 hover:text-gold-200'
            }`}
          >
            <Headphones className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden sm:inline">Sacred Audio</span>
          </button>

          {/* 30 Languages Global Studio Button (Command 20) */}
          {onOpenStudio && (
            <button
              id="platform-nav-studio-btn"
              onClick={onOpenStudio}
              title="Estudio Multilingüe de Lectura y Audio (30 Lenguas)"
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-navy-950 border border-gold-500/40 hover:border-gold-400 text-gold-300 hover:text-gold-200 text-xs font-semibold transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden sm:inline">30 Lenguas</span>
            </button>
          )}

          {/* Spanish Pilot Button (Command 19) */}
          {onOpenSpanishPilot && (
            <button
              id="platform-nav-spanish-pilot-btn"
              onClick={onOpenSpanishPilot}
              title="Piloto de Narración en Español (ef_dora)"
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-navy-950 border border-emerald-500/40 hover:border-emerald-400 text-emerald-300 hover:text-emerald-200 text-xs font-semibold transition"
            >
              <span className="text-xs">🇪🇸</span>
              <span className="hidden md:inline">Piloto Español (ef_dora)</span>
            </button>
          )}

          {/* Scripture Coverage Disclosure Button */}
          {onOpenCoverage && (
            <button
              id="platform-nav-coverage-btn"
              onClick={onOpenCoverage}
              title="Scripture Content Coverage & Availability Disclosure"
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400 text-xs font-semibold transition cursor-pointer"
            >
              <BookOpen className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden lg:inline">Coverage</span>
            </button>
          )}

          {/* Universal Scripture Search Button (Phase 6.3) */}
          {onOpenSearch && (
            <button
              id="platform-nav-search-btn"
              data-testid="platform-nav-search-btn"
              onClick={onOpenSearch}
              title="Search Scripture across all 7 Traditions (Press / or ⌘K)"
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500/50 text-slate-300 hover:text-gold-300 text-xs font-semibold transition cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden sm:inline">Search Scripture</span>
              <kbd className="hidden lg:inline-block px-1.5 py-0.2 text-[10px] font-mono rounded bg-slate-800 text-slate-400 border border-slate-700">
                /
              </kbd>
            </button>
          )}

          {/* My Library & Bookmarks Toggle (Phase 6.1) */}
          {onOpenMyLibrary ? (
            <button
              id="platform-nav-my-library-btn"
              data-testid="platform-nav-my-library-btn"
              onClick={() => onOpenMyLibrary('continue')}
              title="My Sacred Library (Bookmarks, Reading History & Chapter Progress)"
              className="flex items-center space-x-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-navy-950 border border-gold-500/40 hover:border-gold-400 text-gold-300 hover:text-gold-200 text-xs font-semibold transition cursor-pointer"
            >
              <BookMarked className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden md:inline">My Library</span>
              {bookmarksCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-gold-500/20 text-gold-400 text-[10px] font-mono">
                  {bookmarksCount}
                </span>
              )}
            </button>
          ) : (
            onOpenBookmarks && (
              <button
                onClick={onOpenBookmarks}
                title="Saved Bookmarks"
                className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400 text-xs font-semibold transition"
              >
                <Bookmark className="w-3.5 h-3.5 text-gold-400" />
                <span className="hidden md:inline">Bookmarks</span>
                {bookmarksCount > 0 && (
                  <span className="ml-1 px-1.5 py-0.2 rounded-full bg-gold-500/20 text-gold-400 text-[10px] font-mono">
                    {bookmarksCount}
                  </span>
                )}
              </button>
            )
          )}
        </div>
      </div>
    </header>
  );
};
