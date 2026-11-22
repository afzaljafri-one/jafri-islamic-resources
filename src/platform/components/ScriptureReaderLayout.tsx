// ==============================================================================
// Common Platform Scripture Reader Layout (Structural Shell)
// Jafri Religious Books & Audio Platform — Phase 0
// ==============================================================================

import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bookmark,
  Sliders,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { ReligionMetadata } from '../types/religion';
import { ScriptureCollection, ProvenanceMetadata } from '../types/scripture';
import { UserReadingPreferences } from '../types/user';
import { TypographyControls } from './TypographyControls';
import { TranslationSelector } from './TranslationSelector';
import { AttributionFooter } from './AttributionFooter';
import { GenericAudioPlayerBar } from './GenericAudioPlayerBar';

interface ScriptureReaderLayoutProps {
  religion: ReligionMetadata;
  collection?: ScriptureCollection;
  currentSectionTitle: string;
  onOpenNavigation: () => void;
  onOpenSearch: () => void;
  onOpenBookmarks: () => void;
  onPreviousSection?: () => void;
  onNextSection?: () => void;
  hasPreviousSection?: boolean;
  hasNextSection?: boolean;
  preferences: UserReadingPreferences;
  onChangePreferences: (prefs: Partial<UserReadingPreferences>) => void;
  selectedTranslationId: string;
  onSelectTranslation: (id: string) => void;
  children: React.ReactNode;
  provenance?: ProvenanceMetadata;
}

export const ScriptureReaderLayout: React.FC<ScriptureReaderLayoutProps> = ({
  religion,
  collection,
  currentSectionTitle,
  onOpenNavigation,
  onOpenSearch,
  onOpenBookmarks,
  onPreviousSection,
  onNextSection,
  hasPreviousSection = false,
  hasNextSection = false,
  preferences,
  onChangePreferences,
  selectedTranslationId,
  onSelectTranslation,
  children,
  provenance,
}) => {
  const [showTypographyControls, setShowTypographyControls] = useState(false);

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
      {/* Top Breadcrumb & Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-950 border border-slate-800 shadow-lg">
        {/* Navigation / TOC button & Current Title */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenNavigation}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-200 hover:text-gold-400 text-xs font-semibold transition"
          >
            <Menu className="w-4 h-4" />
            <span>Table of Contents</span>
          </button>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div className="truncate">
            <span className="text-xs font-bold text-slate-100">{religion.name}</span>
            <span className="text-xs text-slate-500 mx-1.5">•</span>
            <span className="text-xs font-serif text-gold-400 font-medium">
              {collection?.title || currentSectionTitle}
            </span>
          </div>
        </div>

        {/* Toolbar Buttons: Search, Bookmarks, Typography Controls */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button
            onClick={onOpenSearch}
            title="Search scripture text"
            className="p-2 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400 text-xs transition"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenBookmarks}
            title="Saved bookmarks"
            className="p-2 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400 text-xs transition"
          >
            <Bookmark className="w-4 h-4" />
          </button>

          <button
            onClick={() => setShowTypographyControls(!showTypographyControls)}
            title="Display and font settings"
            className={`p-2 rounded-xl border text-xs transition ${
              showTypographyControls
                ? 'bg-gold-500 text-navy-950 border-gold-500'
                : 'bg-navy-950 border-slate-700 text-slate-300 hover:text-gold-400 hover:border-gold-500'
            }`}
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expandable Typography Controls Bar */}
      {showTypographyControls && (
        <div className="animate-in fade-in-50 duration-150">
          <TypographyControls
            preferences={preferences}
            onChangePreferences={onChangePreferences}
          />
        </div>
      )}

      {/* Translation Edition Selector */}
      {collection && collection.availableTranslations.length > 0 && (
        <TranslationSelector
          translations={collection.availableTranslations}
          selectedTranslationId={selectedTranslationId}
          onSelectTranslation={onSelectTranslation}
        />
      )}

      {/* Main Content Area */}
      <main className="min-h-[500px]">{children}</main>

      {/* Bottom Section Pagination */}
      {(onPreviousSection || onNextSection) && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          <button
            disabled={!hasPreviousSection}
            onClick={onPreviousSection}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
              hasPreviousSection
                ? 'bg-navy-950 border-slate-700 text-slate-200 hover:border-gold-500 hover:text-gold-400'
                : 'opacity-40 cursor-not-allowed bg-navy-950/40 border-slate-800 text-slate-600'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Section</span>
          </button>

          <button
            disabled={!hasNextSection}
            onClick={onNextSection}
            className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold border transition ${
              hasNextSection
                ? 'bg-navy-950 border-slate-700 text-slate-200 hover:border-gold-500 hover:text-gold-400'
                : 'opacity-40 cursor-not-allowed bg-navy-950/40 border-slate-800 text-slate-600'
            }`}
          >
            <span>Next Section</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Generic Audio Player Dock */}
      <GenericAudioPlayerBar />

      {/* Standardized Attribution & Provenance Footer */}
      <AttributionFooter provenance={provenance || collection?.provenance} />
    </div>
  );
};
