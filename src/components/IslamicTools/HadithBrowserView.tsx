import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  Search,
  CheckCircle2,
  Copy,
  Check,
  Info,
} from 'lucide-react';
import {
  HADITH_COLLECTIONS,
  CURATED_HADITHS,
} from '../../services/islamic/hadithData';
import { HadithItemModel } from '../../services/islamic/types';

export const HadithBrowserView: React.FC = () => {
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('bukhari');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const selectedCollection = useMemo(() => {
    return (
      HADITH_COLLECTIONS.find((c) => c.id === selectedCollectionId) ||
      HADITH_COLLECTIONS[0]
    );
  }, [selectedCollectionId]);

  // Filter hadiths by selected collection and search query
  const filteredHadiths = useMemo(() => {
    return CURATED_HADITHS.filter((h) => {
      const matchesCollection =
        selectedCollectionId === 'all' || h.collectionId === selectedCollectionId;
      if (!matchesCollection) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        h.englishText.toLowerCase().includes(q) ||
        (h.urduText && h.urduText.includes(q)) ||
        h.narrator.toLowerCase().includes(q) ||
        h.referenceString.toLowerCase().includes(q) ||
        h.bookName.toLowerCase().includes(q)
      );
    });
  }, [selectedCollectionId, searchQuery]);

  const handleCopy = (hadith: HadithItemModel) => {
    const textToCopy = `${hadith.arabicText}\n\n[English]: ${hadith.englishText}\n\n[Urdu]: ${hadith.urduText || ''}\n\nNarrated by: ${hadith.narrator}\nReference: ${hadith.referenceString} (${hadith.grade || 'Ungraded'})`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(hadith.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6" data-testid="hadith-browser-view">
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-gold-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gold-400 text-xs font-serif font-bold uppercase tracking-wider">
            <BookOpen className="w-4 h-4" />
            <span data-testid="hadith-header-label">Foundational Curated Selection — 8 Traditions</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-normal">Kutub al-Sittah Sources</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-100 mt-1">
            {selectedCollection.name} (<span className="font-quran text-gold-400">{selectedCollection.arabicName}</span>)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Compiled by {selectedCollection.scholar} (d. {selectedCollection.deathYearHijri} AH) • Displaying verified core traditions rather than complete text compendia.
          </p>
        </div>

        {/* Collection Selector Dropdown */}
        <div className="w-full md:w-auto">
          <label className="block text-[11px] text-slate-400 mb-1 font-medium">Filter Curated Traditions by Source:</label>
          <select
            value={selectedCollectionId}
            onChange={(e) => setSelectedCollectionId(e.target.value)}
            data-testid="hadith-collection-select"
            className="w-full md:w-64 bg-navy-950 border border-gold-500/30 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-gold-400"
          >
            {HADITH_COLLECTIONS.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="p-4 rounded-2xl bg-navy-900 border border-gold-500/20 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search hadiths by keyword, narrator, book, or reference..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="hadith-search-input"
            className="w-full bg-navy-950 border border-gold-500/30 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-400"
          />
        </div>
        <div className="text-xs text-slate-400 whitespace-nowrap" data-testid="hadith-count-display">
          Showing <strong>{filteredHadiths.length}</strong> of <strong>8 Curated Traditions</strong>
        </div>
      </div>

      {/* Hadith Cards List */}
      <div className="space-y-4">
        {filteredHadiths.length > 0 ? (
          filteredHadiths.map((hadith) => (
            <div
              key={hadith.id}
              data-testid={`hadith-card-${hadith.id}`}
              className="p-5 sm:p-6 rounded-2xl bg-navy-900 border border-gold-500/20 hover:border-gold-500/40 transition-all space-y-4 shadow-lg"
            >
              {/* Card Header: Collection, Book, Grade */}
              <div className="flex flex-wrap items-center justify-between pb-3 border-b border-navy-800 gap-2">
                <div className="flex items-center space-x-2">
                  <span className="px-2.5 py-1 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400 font-mono text-[11px] font-bold">
                    {hadith.referenceString}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {hadith.bookName}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  {hadith.grade && (
                    <span
                      data-testid={`hadith-grade-${hadith.id}`}
                      className="flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-[10px] font-bold"
                    >
                      <CheckCircle2 className="w-3 h-3" />
                      <span>{hadith.grade}</span>
                    </span>
                  )}

                  <button
                    onClick={() => handleCopy(hadith)}
                    title="Copy Hadith"
                    className="p-1.5 rounded-lg bg-navy-950 text-slate-400 hover:text-slate-200 border border-gold-500/20 transition-colors"
                  >
                    {copiedId === hadith.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Narrator */}
              <div className="text-xs text-slate-400 italic">
                Narrated by: <strong className="text-slate-200 not-italic" data-testid={`hadith-narrator-${hadith.id}`}>{hadith.narrator}</strong>
              </div>

              {/* Arabic Text */}
              <div
                dir="rtl"
                data-testid={`hadith-arabic-${hadith.id}`}
                className="font-quran text-xl sm:text-2xl text-slate-100 leading-relaxed tracking-wide text-right py-1"
              >
                {hadith.arabicText}
              </div>

              {/* English Translation */}
              <div
                className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-navy-850"
                data-testid={`hadith-english-${hadith.id}`}
              >
                <span className="font-semibold text-gold-400 mr-1.5">[English]:</span>
                {hadith.englishText}
              </div>

              {/* Urdu Translation if available */}
              {hadith.urduText && (
                <div
                  dir="rtl"
                  data-testid={`hadith-urdu-${hadith.id}`}
                  className="font-urdu text-sm sm:text-base text-slate-300 leading-relaxed pt-2 border-t border-navy-850 text-right"
                >
                  <span className="font-sans text-xs font-semibold text-gold-400 ml-1.5">[اردو ترجمہ]:</span>
                  {hadith.urduText}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="p-8 rounded-2xl bg-navy-900 border border-gold-500/20 text-center text-slate-400 space-y-2">
            <p className="text-sm">No hadiths found matching your search query.</p>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs text-gold-400 underline hover:text-gold-300"
            >
              Clear Search Filter
            </button>
          </div>
        )}
      </div>

      {/* Scholarly Integrity Disclaimer */}
      <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold-500/20 text-xs text-slate-400 flex items-start space-x-3 leading-relaxed">
        <Info className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-slate-200">Scholarly Preservation & Grading Integrity:</strong> All Hadith texts, chains of narration, book numbering, and authenticity grading classifications are preserved directly from authoritative scholarly compilations. In accordance with strict integrity directives, no Hadith references, narrators, or grades are invented or estimated, and unclassified traditions are never prematurely labelled as Sahih.
        </div>
      </div>
    </div>
  );
};
