// ==============================================================================
// Common Platform Module Placeholder Reader
// Clean, respectful development placeholder for in-development religious modules
// Jafri Religious Books & Audio Platform — Phase 0
// ==============================================================================

import React, { useState } from 'react';
import { ReligionMetadata } from '../types/religion';
import { ScriptureReaderLayout } from './ScriptureReaderLayout';
import { ScriptureNavigationDrawer } from './ScriptureNavigationDrawer';
import { UniversalSearchModal } from './UniversalSearchModal';
import { UniversalBookmarksDrawer } from './UniversalBookmarksDrawer';
import {
  platformStorageService,
} from '../services/storageService';
import {
  BookOpen,
  Construction,
  ShieldCheck,
  Layers,
  ExternalLink,
} from 'lucide-react';

interface PlannedCollection {
  title: string;
  nativeTitle: string;
  hierarchy: string;
  sourceProvider: string;
  sourceUrl: string;
  licenseStatus: string;
  audioStatus: string;
  description: string;
}

interface ModulePlaceholderReaderProps {
  religion: ReligionMetadata;
  plannedCollections: PlannedCollection[];
  canonicalIndexSummary: string;
  onReturnToHome: () => void;
}

export const ModulePlaceholderReader: React.FC<ModulePlaceholderReaderProps> = ({
  religion,
  plannedCollections,
  canonicalIndexSummary,
  onReturnToHome,
}) => {
  const [preferences, setPreferences] = useState(
    platformStorageService.getPreferences()
  );
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState(() =>
    platformStorageService.getBookmarks(religion.id)
  );

  return (
    <ScriptureReaderLayout
      religion={religion}
      currentSectionTitle="Canonical Overview & Architecture"
      onOpenNavigation={() => setIsNavOpen(true)}
      onOpenSearch={() => setIsSearchOpen(true)}
      onOpenBookmarks={() => setIsBookmarksOpen(true)}
      preferences={preferences}
      onChangePreferences={(newPrefs) => {
        const updated = { ...preferences, ...newPrefs };
        setPreferences(updated);
        platformStorageService.savePreferences(updated);
      }}
      selectedTranslationId=""
      onSelectTranslation={() => {}}
      provenance={{
        sourceName: `${religion.name} Canonical Integration Architecture`,
        sourceUrl: 'https://github.com/afzaljafri-one/jafri-islamic-resources',
        licenseType: 'Authorized Academic Distribution',
        attributionText: `Authentic canonical texts for ${religion.name} are curated in accordance with academic standards and strict non-AI licensing directives.`,
        isAiGenerated: false,
        verifiedDate: '2026-11-17',
      }}
    >
      <div className="space-y-8 animate-in fade-in-50 duration-200">
        {/* Module Under Development Notice */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-950 border border-slate-800 shadow-xl relative overflow-hidden">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center space-x-1.5">
                  <Construction className="w-3.5 h-3.5" />
                  <span>Module in Development (Phase 0 Foundation)</span>
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-400 text-xs font-mono">
                  {religion.scriptName} Script ({religion.textDirection.toUpperCase()})
                </span>
              </div>

              <h1 className="font-serif text-2xl lg:text-3xl font-extrabold text-slate-100 flex items-center space-x-3">
                <span>{religion.name} Sacred Library</span>
                <span className="text-xl lg:text-2xl font-normal text-gold-400 font-serif">
                  ({religion.nativeName})
                </span>
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
                {religion.shortDescription}
              </p>
            </div>

            <button
              onClick={onReturnToHome}
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-200 hover:text-gold-400 text-xs font-semibold transition flex-shrink-0"
            >
              <span>&larr; Platform Homepage</span>
            </button>
          </div>
        </div>

        {/* Canonical Index & Textual Tradition Overview */}
        <div className="p-6 rounded-3xl bg-navy-900/70 border border-slate-800 space-y-4">
          <div className="flex items-center space-x-2.5">
            <Layers className="w-5 h-5 text-gold-400" />
            <h2 className="text-base font-serif font-bold text-slate-100">
              Canonical Textual Structure & Traditions
            </h2>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed">
            {canonicalIndexSummary}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            <span className="text-xs text-slate-400 font-semibold self-center mr-1">
              Traditions Covered:
            </span>
            {religion.traditions.map((trad) => (
              <span
                key={trad}
                className="px-2.5 py-1 rounded-xl text-xs bg-navy-950 border border-slate-800 text-slate-300"
              >
                {trad}
              </span>
            ))}
          </div>
        </div>

        {/* Planned Collections Roadmap */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <BookOpen className="w-5 h-5 text-gold-400" />
              <h2 className="text-base font-serif font-bold text-slate-100">
                Planned Collections & Verified Sources
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              {plannedCollections.length} Collection(s) in Roadmap
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plannedCollections.map((col, idx) => (
              <div
                key={idx}
                className="p-5 rounded-3xl bg-navy-950/70 border border-slate-800/80 hover:border-slate-700 transition space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-100 text-sm">{col.title}</h3>
                    <p className="text-xs text-gold-400 font-serif">{col.nativeTitle}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300 font-mono">
                    {col.hierarchy}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {col.description}
                </p>

                <div className="pt-2 border-t border-slate-800/60 space-y-1.5 text-[11px]">
                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-slate-500">Source Provider:</span>
                    <a
                      href={col.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gold-400 hover:underline flex items-center space-x-1"
                    >
                      <span>{col.sourceProvider}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-slate-500">Licensing:</span>
                    <span className="text-emerald-400 font-medium">{col.licenseStatus}</span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span className="text-slate-500">Audio Narration:</span>
                    <span className="text-sky-400">{col.audioStatus}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sacred Content Verification Guarantee Notice */}
        <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 text-xs text-emerald-300/90 flex items-center space-x-3">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Authenticity Guarantee:</strong> To preserve sacred dignity, this
            module will ingest only verified public domain or CC-licensed editions with
            explicit scholarly attribution. No AI-generated verses or synthetic translations will ever be displayed.
          </span>
        </div>
      </div>

      {/* Navigation Drawer */}
      <ScriptureNavigationDrawer
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        title={`${religion.name} Canonical Table of Contents`}
        nativeTitle={religion.nativeName}
        hierarchyLabels={['Collection', 'Section', 'Unit']}
        nodes={[]}
        onSelectAddress={() => {}}
      />

      {/* Universal Search Modal */}
      <UniversalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        collectionTitle={religion.name}
        onSearch={async () => []}
        onSelectResult={() => {}}
      />

      {/* Bookmarks Drawer */}
      <UniversalBookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelectBookmark={() => {}}
        onRemoveBookmark={(id) => {
          platformStorageService.removeBookmark(id);
          setBookmarks(platformStorageService.getBookmarks(religion.id));
        }}
        onClearBookmarks={(rel) => {
          platformStorageService.clearBookmarks(rel);
          setBookmarks(platformStorageService.getBookmarks(religion.id));
        }}
      />
    </ScriptureReaderLayout>
  );
};
