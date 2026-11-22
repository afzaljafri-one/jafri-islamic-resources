import React from 'react';
import { BookOpen, Compass, Zap, FlaskConical } from 'lucide-react';

interface NavbarProps {
  activeMethodName?: string;
  activeView?: 'reader' | 'tools' | 'lab';
  onViewChange?: (view: 'reader' | 'tools' | 'lab') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeMethodName = 'Karachi / Hanafi',
  activeView = 'reader',
  onViewChange,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-navy-900/95 backdrop-blur-md border-b border-gold-500/20 px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5 shadow-lg max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 sm:gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-2 sm:space-x-3.5">
          <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-xl bg-navy-800 border border-gold-500/40 shadow-gold-sm flex-shrink-0">
            {/* 8-point Seljuk Star Emblem */}
            <svg viewBox="0 0 100 100" className="w-7 h-7 sm:w-8 sm:h-8 text-gold-500">
              <polygon
                points="50,4 62,38 96,50 62,62 50,96 38,62 4,50 38,38"
                fill="rgba(212, 175, 55, 0.2)"
                stroke="currentColor"
                strokeWidth="3"
              />
              <rect
                x="22"
                y="22"
                width="56"
                height="56"
                transform="rotate(45 50 50)"
                fill="none"
                stroke="#E6CA65"
                strokeWidth="2"
              />
              <circle cx="50" cy="50" r="8" fill="currentColor" />
            </svg>
          </div>
          <div>
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <span className="font-serif text-base sm:text-lg font-bold tracking-wider text-slate-100">JAFRI</span>
              <span className="font-serif text-xs sm:text-sm font-semibold tracking-widest text-gold-400">ISLAMIC</span>
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-widest px-1 sm:px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/30">
                LAB
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide hidden md:block">
              UmmahAPI Primary Integration • 2-Provider Architecture
            </p>
          </div>
        </div>

        {/* View Switcher: Quran Reader vs Islamic Tools vs Verification Lab */}
        {onViewChange && (
          <div className="flex items-center bg-navy-950 p-0.5 sm:p-1 rounded-xl border border-gold-500/30 shadow-inner flex-shrink-0">
            <button
              onClick={() => onViewChange('reader')}
              data-testid="nav-btn-reader"
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'reader'
                  ? 'bg-gold-500 text-navy-950 shadow-gold-sm'
                  : 'text-slate-300 hover:text-gold-300 hover:bg-navy-900/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Quran<span className="hidden sm:inline"> Reader</span></span>
            </button>
            <button
              onClick={() => onViewChange('tools')}
              data-testid="nav-btn-tools"
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'tools'
                  ? 'bg-gold-500 text-navy-950 shadow-gold-sm'
                  : 'text-slate-300 hover:text-gold-300 hover:bg-navy-900/60'
              }`}
            >
              <Compass className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span><span className="hidden sm:inline">Islamic </span>Tools</span>
            </button>
            <button
              onClick={() => onViewChange('lab')}
              data-testid="nav-btn-lab"
              className={`flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeView === 'lab'
                  ? 'bg-gold-500 text-navy-950 shadow-gold-sm'
                  : 'text-slate-300 hover:text-gold-300 hover:bg-navy-900/60'
              }`}
            >
              <FlaskConical className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span><span className="hidden sm:inline">Verification </span>Lab</span>
            </button>
          </div>
        )}

        {/* Center Pill: India Location & Calculation Mode */}
        <div className="hidden xl:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-navy-950/80 border border-gold-500/30 text-xs">
          <Compass className="w-3.5 h-3.5 text-gold-400" />
          <span className="text-slate-300">Location:</span>
          <span className="font-medium text-slate-100">New Delhi, India</span>
          <span className="text-slate-500">•</span>
          <span className="text-gold-400 font-medium">{activeMethodName}</span>
        </div>

        {/* Actions & Status */}
        <div className="hidden md:flex items-center space-x-3">
          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-500/40 text-[11px] text-emerald-300">
            <Zap className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-medium">UmmahAPI Primary</span>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-blue-950/80 border border-blue-500/40 text-[11px] text-blue-300">
            <BookOpen className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-medium">AlQuran Cloud Standby</span>
          </div>
        </div>
      </div>
    </header>
  );
};
