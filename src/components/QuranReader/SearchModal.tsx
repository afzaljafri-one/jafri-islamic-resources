import React, { useState } from 'react';
import { Search, X, BookOpen, RefreshCw, ArrowRight } from 'lucide-react';
import { SurahMeta } from '../../types/quran';
import { ummahApi } from '../../services/ummahApi';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  surahList: SurahMeta[];
  onSelectSurahAndAyah: (surahNumber: number, ayahNumber?: number) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  surahList,
  onSelectSurahAndAyah,
}) => {
  const [query, setQuery] = useState('');
  const [verseResults, setVerseResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  // Filter Surahs matching query
  const matchedSurahs = query.trim()
    ? surahList.filter((s) => {
        const q = query.toLowerCase().trim();
        return (
          s.number.toString() === q ||
          s.englishName.toLowerCase().includes(q) ||
          s.englishNameTranslation.toLowerCase().includes(q) ||
          s.name.includes(q)
        );
      })
    : [];

  const handleSearchVerses = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const results = await ummahApi.search(query.trim(), 'sahih_international');
      setVerseResults(results);
    } catch {
      setVerseResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-navy-900 border border-gold-500/40 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden z-10 animate-in zoom-in-95 duration-200">
        {/* Search Header */}
        <form onSubmit={handleSearchVerses} className="p-4 border-b border-navy-800 bg-navy-950 flex items-center gap-3">
          <Search className="w-5 h-5 text-gold-400 flex-shrink-0" />
          <input
            type="text"
            placeholder="Search Quran (e.g. 'Patience', 'Light', 'Mercy', or Surah 'Yasin')..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setHasSearched(false);
            }}
            autoFocus
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
          />
          {query && (
            <button
              type="submit"
              disabled={isSearching}
              className="px-3 py-1 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold rounded-lg text-xs transition-colors flex items-center gap-1"
            >
              {isSearching ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : 'Search'}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </form>

        {/* Results Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 1. Surah Matches */}
          {matchedSurahs.length > 0 && (
            <div className="space-y-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-gold-400 font-mono">
                Matching Surahs ({matchedSurahs.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedSurahs.slice(0, 6).map((s) => (
                  <button
                    key={s.number}
                    onClick={() => {
                      onSelectSurahAndAyah(s.number);
                      onClose();
                    }}
                    className="p-2.5 rounded-xl bg-navy-950/70 border border-gold-500/20 hover:border-gold-400 text-left flex items-center justify-between group transition-colors"
                  >
                    <div className="flex items-center space-x-2.5">
                      <span className="w-6 h-6 rounded bg-gold-500/10 text-gold-400 text-xs font-mono font-bold flex items-center justify-center">
                        {s.number}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-slate-100 group-hover:text-gold-400 transition-colors">
                          {s.englishName}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {s.englishNameTranslation} • {s.numberOfAyahs} v
                        </div>
                      </div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-gold-400 group-hover:translate-x-0.5 transition-all" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* 2. Verse Keyword Results */}
          {hasSearched ? (
            isSearching ? (
              <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-2">
                <RefreshCw className="w-5 h-5 animate-spin text-gold-400" />
                <p className="text-xs">Searching 6,236 verses across Quran text...</p>
              </div>
            ) : verseResults.length > 0 ? (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold-400 font-mono">
                  Verse Results ({verseResults.length} matches)
                </span>
                <div className="space-y-2.5">
                  {verseResults.map((r, i) => {
                    const surahNum = r.surah_number || r.surah?.number || 1;
                    const ayahNum = r.verse_number || r.ayah || 1;
                    return (
                      <button
                        key={i}
                        onClick={() => {
                          onSelectSurahAndAyah(surahNum, ayahNum);
                          onClose();
                        }}
                        className="w-full p-3.5 rounded-xl bg-navy-950/60 border border-gold-500/15 hover:border-gold-400 text-left transition-all space-y-1.5 group"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-mono font-bold text-gold-400">
                            Surah {surahNum}:{ayahNum} ({r.surah_name || `Surah ${surahNum}`})
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1 group-hover:text-gold-400">
                            <span>Open Verse</span>
                            <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                        {r.arabic && (
                          <div className="font-quran text-base text-slate-200 text-right leading-relaxed" dir="rtl">
                            {r.arabic}
                          </div>
                        )}
                        <p className="text-xs text-slate-300 leading-relaxed">
                          {r.translation || r.text}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-xs text-slate-400 space-y-1">
                <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
                <p>No verses found matching "{query}"</p>
                <p className="text-[11px] text-slate-500">Try searching for keywords like "mercy", "paradise", "forgiveness".</p>
              </div>
            )
          ) : (
            !matchedSurahs.length && (
              <div className="py-10 text-center text-xs text-slate-400 space-y-2">
                <Search className="w-8 h-8 text-slate-600 mx-auto" />
                <p className="text-slate-300">Type any keyword and press Enter or click Search</p>
                <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
                  <span className="text-[11px] text-slate-500">Suggested:</span>
                  {['Patience', 'Gratitude', 'Mercy', 'Light', 'Peace', 'Jannah'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        setQuery(tag);
                        setIsSearching(true);
                        setHasSearched(true);
                        ummahApi.search(tag).then(setVerseResults).finally(() => setIsSearching(false));
                      }}
                      className="px-2.5 py-1 rounded-md bg-navy-950 border border-gold-500/20 text-slate-300 hover:text-gold-400 hover:border-gold-400 text-[11px] transition-colors"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
