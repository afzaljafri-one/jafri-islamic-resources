// ==============================================================================
// Common Platform Typography & Reading Preferences Controls
// Jafri Religious Books & Audio Platform — Phase 0
// ==============================================================================

import React from 'react';
import { Columns, AlignJustify } from 'lucide-react';
import { UserReadingPreferences } from '../types/user';

interface TypographyControlsProps {
  preferences: UserReadingPreferences;
  onChangePreferences: (prefs: Partial<UserReadingPreferences>) => void;
}

export const TypographyControls: React.FC<TypographyControlsProps> = ({
  preferences,
  onChangePreferences,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 p-2 bg-navy-900/80 backdrop-blur-md rounded-2xl border border-gold-500/20 text-xs">
      {/* Font Size Increment / Decrement */}
      <div className="flex items-center space-x-1 bg-navy-950 p-1 rounded-xl border border-slate-700/50">
        <button
          onClick={() =>
            onChangePreferences({
              fontSizeRem: Math.max(0.875, preferences.fontSizeRem - 0.125),
            })
          }
          title="Decrease text size"
          className="px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          A-
        </button>
        <span className="px-1 text-[11px] font-mono text-gold-400">
          {(preferences.fontSizeRem * 16).toFixed(0)}px
        </span>
        <button
          onClick={() =>
            onChangePreferences({
              fontSizeRem: Math.min(2.5, preferences.fontSizeRem + 0.125),
            })
          }
          title="Increase text size"
          className="px-2 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          A+
        </button>
      </div>

      {/* Reading Layout Modes */}
      <div className="flex items-center bg-navy-950 p-1 rounded-xl border border-slate-700/50">
        <button
          onClick={() => onChangePreferences({ displayMode: 'side-by-side' })}
          title="Side-by-side dual language layout"
          className={`flex items-center space-x-1 px-2 py-1 rounded transition ${
            preferences.displayMode === 'side-by-side'
              ? 'bg-gold-500 text-navy-950 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Columns className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Parallel</span>
        </button>
        <button
          onClick={() => onChangePreferences({ displayMode: 'stacked' })}
          title="Stacked verse and translation layout"
          className={`flex items-center space-x-1 px-2 py-1 rounded transition ${
            preferences.displayMode === 'stacked'
              ? 'bg-gold-500 text-navy-950 font-semibold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <AlignJustify className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Stacked</span>
        </button>
      </div>

      {/* Transliteration Toggle */}
      <button
        onClick={() =>
          onChangePreferences({
            showTransliteration: !preferences.showTransliteration,
          })
        }
        className={`px-2.5 py-1.5 rounded-xl border transition text-[11px] font-medium ${
          preferences.showTransliteration
            ? 'bg-gold-500/10 border-gold-500/40 text-gold-400'
            : 'bg-navy-950 border-slate-700/50 text-slate-400 hover:text-slate-200'
        }`}
      >
        Transliteration
      </button>

      {/* Theme Toggles */}
      <div className="flex items-center bg-navy-950 p-1 rounded-xl border border-slate-700/50 ml-auto">
        <button
          onClick={() => onChangePreferences({ themeMode: 'default' })}
          title="Navy Deep Theme"
          className={`w-5 h-5 rounded-full border border-navy-700 bg-navy-950 flex items-center justify-center ${
            preferences.themeMode === 'default' ? 'ring-2 ring-gold-400' : ''
          }`}
        />
        <button
          onClick={() => onChangePreferences({ themeMode: 'sepia' })}
          title="Warm Sepia Theme"
          className={`w-5 h-5 rounded-full border border-amber-800 bg-[#2b241b] ml-1.5 ${
            preferences.themeMode === 'sepia' ? 'ring-2 ring-amber-400' : ''
          }`}
        />
        <button
          onClick={() => onChangePreferences({ themeMode: 'night-onyx' })}
          title="Onyx Black Theme"
          className={`w-5 h-5 rounded-full border border-zinc-700 bg-black ml-1.5 ${
            preferences.themeMode === 'night-onyx' ? 'ring-2 ring-slate-200' : ''
          }`}
        />
      </div>
    </div>
  );
};
