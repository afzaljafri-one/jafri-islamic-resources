// ==============================================================================
// Common Platform Universal Search Modal
// Jafri Religious Books & Audio Platform — Phase 0
// ==============================================================================

import React, { useState } from 'react';
import { Search, X, BookOpen, AlertCircle, Loader2 } from 'lucide-react';
import { SearchResultMatch } from '../types/adapter';
import { CanonicalAddress } from '../types/scripture';

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  collectionTitle: string;
  onSearch: (query: string) => Promise<SearchResultMatch[]>;
  onSelectResult: (address: CanonicalAddress) => void;
  accentColorClass?: string;
}

export const UniversalSearchModal: React.FC<UniversalSearchModalProps> = ({
  isOpen,
  onClose,
  collectionTitle,
  onSearch,
  onSelectResult,
  accentColorClass = 'text-gold-400',
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResultMatch[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setHasSearched(true);
    try {
      const res = await onSearch(query.trim());
      setResults(res);
    } catch {
      setResults([]);
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
      <div className="relative w-full max-w-xl bg-navy-900 border border-slate-800 rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[85vh] animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800 bg-navy-950/80">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Search className={`w-4 h-4 ${accentColorClass}`} />
              <span className="text-xs font-semibold text-slate-200">
                Search in {collectionTitle}
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
            className="relative flex items-center"
          >
            <input
              type="text"
              autoFocus
              placeholder="Search words, verses, or keywords..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
              className="w-full bg-navy-950 border border-slate-700 rounded-2xl pl-4 pr-20 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
            <div className="absolute right-2 flex items-center space-x-1">
              {query && (
                <button
                  type="button"
                  onClick={() => {
                    setQuery('');
                    setResults([]);
                    setHasSearched(false);
                  }}
                  className="p-1 text-slate-500 hover:text-slate-300"
                  title="Clear query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                type="button"
                onClick={() => handleSubmit()}
                className={`p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition ${accentColorClass}`}
                title="Search scripture"
                data-testid="search-submit-btn"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>

        {/* Results Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isSearching ? (
            <div className="py-12 text-center text-slate-400 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin mx-auto text-gold-400" />
              <p className="text-xs">Searching scripture corpus...</p>
            </div>
          ) : hasSearched && results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-2">
              <AlertCircle className="w-6 h-6 mx-auto text-slate-600" />
              <p className="text-xs font-medium">No matches found for "{query}"</p>
              <p className="text-[11px] text-slate-600">
                Try searching for broader root words or synonyms.
              </p>
            </div>
          ) : (
            results.map((match) => (
              <button
                key={match.unitId}
                onClick={() => {
                  onSelectResult(match.address);
                  onClose();
                }}
                className="w-full text-left p-3 rounded-2xl bg-navy-950/60 hover:bg-navy-950 border border-slate-800 hover:border-slate-700 transition space-y-1 group"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-gold-400 group-hover:underline">
                    {match.displayTitle}
                  </span>
                  <span className="text-[10px] text-slate-500 uppercase">
                    Matched in {match.matchedField}
                  </span>
                </div>
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {match.matchedSnippet}
                </p>
              </button>
            ))
          )}

          {!hasSearched && (
            <div className="py-12 text-center text-slate-500 text-xs space-y-1">
              <BookOpen className="w-8 h-8 mx-auto text-slate-700" />
              <p className="font-medium text-slate-400">Search Scripture Text</p>
              <p className="text-[11px] text-slate-600">
                Search root text, transliteration, or authorized translations.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
