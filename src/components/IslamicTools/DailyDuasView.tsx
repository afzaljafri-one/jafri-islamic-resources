import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Search,
  Copy,
  Check,
  BookOpen,
} from 'lucide-react';
import {
  DAILY_DUAS,
  DUA_CATEGORIES,
} from '../../services/islamic/dailyDuasData';
import { DailyDuaItem } from '../../services/islamic/types';

export const DailyDuasView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Duas');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredDuas = useMemo(() => {
    return DAILY_DUAS.filter((dua) => {
      const matchesCategory =
        selectedCategory === 'All Duas' || dua.category === selectedCategory;
      if (!matchesCategory) return false;

      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        dua.title.toLowerCase().includes(q) ||
        dua.englishTranslation.toLowerCase().includes(q) ||
        (dua.urduTranslation && dua.urduTranslation.includes(q)) ||
        dua.context.toLowerCase().includes(q) ||
        dua.reference.toLowerCase().includes(q)
      );
    });
  }, [selectedCategory, searchQuery]);

  const handleCopy = (dua: DailyDuaItem) => {
    const textToCopy = `${dua.title} (${dua.arabicTitle})\n\n${dua.arabicText}\n\n[Transliteration]: ${dua.transliteration}\n\n[English]: ${dua.englishTranslation}\n\n[Urdu]: ${dua.urduTranslation}\n\nContext: ${dua.context}\nReference: ${dua.reference}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(dua.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6" data-testid="daily-duas-view">
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-gold-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gold-400 text-xs font-serif font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Hisn al-Muslim (حصن المسلم)</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-normal">Authentic Supplications</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-100 mt-1">
            Structured Daily Duas Library
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Authentic prophetic prayers for daily routines, protection, forgiveness, and guidance.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-xs font-serif font-bold text-gold-400 shadow-gold-sm">
          10 Comprehensive Occasion Categories
        </div>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-thin">
        {DUA_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            data-testid={`dua-cat-btn-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                : 'bg-navy-900 text-slate-300 hover:text-gold-300 border border-gold-500/20'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search Input Bar */}
      <div className="p-4 rounded-2xl bg-navy-900 border border-gold-500/20 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search duas by occasion, translation, or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="dua-search-input"
            className="w-full bg-navy-950 border border-gold-500/30 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-400"
          />
        </div>
        <div className="text-xs text-slate-400 whitespace-nowrap">
          Showing <strong>{filteredDuas.length}</strong> supplications
        </div>
      </div>

      {/* Duas List Cards */}
      <div className="space-y-5">
        {filteredDuas.length > 0 ? (
          filteredDuas.map((dua) => (
            <div
              key={dua.id}
              data-testid={`dua-card-${dua.id}`}
              className="p-5 sm:p-7 rounded-3xl bg-navy-900 border border-gold-500/20 hover:border-gold-500/40 transition-all space-y-4 shadow-xl"
            >
              {/* Header: Category Badge, Title, Copy */}
              <div className="flex flex-wrap items-center justify-between pb-3 border-b border-navy-800 gap-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30">
                    {dua.category}
                  </span>
                  <h3
                    className="font-serif font-bold text-slate-100 text-sm sm:text-base"
                    data-testid={`dua-title-${dua.id}`}
                  >
                    {dua.title}
                  </h3>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="font-quran text-gold-400 text-sm hidden sm:inline">
                    {dua.arabicTitle}
                  </span>
                  <button
                    onClick={() => handleCopy(dua)}
                    title="Copy Dua"
                    className="p-1.5 rounded-xl bg-navy-950 text-slate-400 hover:text-slate-200 border border-gold-500/20 transition-colors"
                  >
                    {copiedId === dua.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Context / Occasion */}
              <div className="text-xs text-slate-400 italic">
                Occasion: <strong className="text-slate-300 not-italic">{dua.context}</strong>
              </div>

              {/* Arabic Text */}
              <div
                dir="rtl"
                className="font-quran text-2xl sm:text-3xl text-gold-300 leading-loose tracking-wide text-right py-1 px-1"
              >
                {dua.arabicText}
              </div>

              {/* Transliteration */}
              <div className="p-3 rounded-xl bg-navy-950/70 border border-navy-800 text-xs text-slate-300 italic leading-relaxed">
                <span className="font-semibold text-gold-400 not-italic mr-1.5">[Transliteration]:</span>
                {dua.transliteration}
              </div>

              {/* English Translation */}
              <div className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-1">
                <strong className="text-gold-400 font-serif mr-1.5">[English]:</strong>
                {dua.englishTranslation}
              </div>

              {/* Urdu Translation */}
              <div
                dir="rtl"
                className="font-urdu text-sm sm:text-base text-slate-200 leading-relaxed pt-3 border-t border-navy-850 text-right"
              >
                <span className="font-sans text-xs font-semibold text-gold-400 ml-2">[اردو ترجمہ]:</span>
                {dua.urduTranslation}
              </div>

              {/* Authentic Source Reference */}
              <div className="flex items-center justify-between pt-2 border-t border-navy-850 text-[11px] text-slate-400">
                <span className="flex items-center gap-1.5" data-testid={`dua-ref-${dua.id}`}>
                  <BookOpen className="w-3 h-3 text-gold-400" />
                  <span>Reference: <strong>{dua.reference}</strong></span>
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 rounded-2xl bg-navy-900 border border-gold-500/20 text-center text-slate-400 space-y-2">
            <p className="text-sm">No supplications found matching your filter criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory('All Duas');
                setSearchQuery('');
              }}
              className="text-xs text-gold-400 underline hover:text-gold-300"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
