// ==============================================================================
// Universal Scripture Search Modal
// Unified Multilingual Search across All Seven World Religious Traditions
// Jafri Religious Resources — Phase 6.3
// ==============================================================================

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  X,
  BookOpen,
  BookMarked,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  History,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { ReligionId } from '../types/religion';
import { ALL_RELIGION_IDS, RELIGIONS_REGISTRY } from '../config/religionsRegistry';
import {
  UniversalSearchResult,
  SearchMatchType,
  SearchHistoryItem,
} from '../types/search';
import { universalScriptureSearchService } from '../services/universalScriptureSearchService';
import { personalLibraryService } from '../services/personalLibraryService';

interface UniversalScriptureSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToReading: (
    religion: ReligionId,
    params: {
      collectionId?: string;
      readingId?: string;
      chapterNumber?: number | string;
      verseNumber?: number | string;
      translationId?: string;
    }
  ) => void;
  initialQuery?: string;
  initialReligion?: ReligionId | 'all';
}

export const UniversalScriptureSearchModal: React.FC<UniversalScriptureSearchModalProps> = ({
  isOpen,
  onClose,
  onNavigateToReading,
  initialQuery = '',
  initialReligion = 'all',
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [selectedReligion, setSelectedReligion] = useState<ReligionId | 'all'>(initialReligion);
  const [selectedMatchType, setSelectedMatchType] = useState<SearchMatchType | 'all'>('all');
  const [results, setResults] = useState<UniversalSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<SearchHistoryItem[]>([]);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimerRef = useRef<any>(null);

  // Focus input and load recents when opened
  useEffect(() => {
    if (isOpen) {
      setRecentSearches(universalScriptureSearchService.getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 100);
      if (initialQuery.trim()) {
        executeSearch(initialQuery.trim(), selectedReligion, selectedMatchType);
      }
    }
  }, [isOpen]);

  // Execute Search
  const executeSearch = async (
    q: string,
    rel: ReligionId | 'all',
    matchType: SearchMatchType | 'all'
  ) => {
    const trimmed = q.trim();
    if (!trimmed) {
      setResults([]);
      setHasSearched(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const searchResults = await universalScriptureSearchService.search(trimmed, {
        religion: rel,
        matchType,
      });
      setResults(searchResults);
      setRecentSearches(universalScriptureSearchService.getRecentSearches());
    } catch (err) {
      console.error('Search execution error:', err);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Handle Query Input with Debounce
  const handleQueryChange = (val: string) => {
    setQuery(val);
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);

    if (!val.trim()) {
      setResults([]);
      setHasSearched(false);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      executeSearch(val, selectedReligion, selectedMatchType);
    }, 280);
  };

  // Handle Form Submission
  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    executeSearch(query, selectedReligion, selectedMatchType);
  };

  // Handle Religion Filter Change
  const handleSelectReligion = (rel: ReligionId | 'all') => {
    setSelectedReligion(rel);
    if (query.trim()) {
      executeSearch(query, rel, selectedMatchType);
    }
  };

  // Handle Match Type Filter Change
  const handleSelectMatchType = (m: SearchMatchType | 'all') => {
    setSelectedMatchType(m);
    if (query.trim()) {
      executeSearch(query, selectedReligion, m);
    }
  };

  // Direct Bookmark Action
  const handleBookmarkResult = (result: UniversalSearchResult) => {
    personalLibraryService.addBookmark({
      id: `bm_${result.religion}_${result.collectionId}_${result.chapterNumber || 1}_${result.verseNumber || 1}`,
      religion: result.religion,
      scriptureId: result.collectionId,
      collectionId: result.collectionId,
      readingId: result.readingId || String(result.chapterNumber || 1),
      chapterNumber: result.chapterNumber,
      verseNumber: result.verseNumber,
      originalTextReference: result.originalText,
      translationText: result.translationText,
      displayTitle: result.displayCoordinates,
      displaySubtitle: result.displayTitle,
      timestamp: Date.now(),
      createdAt: new Date().toISOString(),
      userNotes: result.sourceAttribution ? `Source: ${result.sourceAttribution}` : undefined,
    });

    setActionNotice('Saved to My Sacred Library Bookmarks!');
    setTimeout(() => setActionNotice(null), 3000);
  };

  // Result Navigation with Zero Audio Autoplay
  const handleSelectResult = (result: UniversalSearchResult) => {
    onClose();
    onNavigateToReading(result.religion, {
      collectionId: result.collectionId,
      readingId: result.readingId,
      chapterNumber: result.chapterNumber,
      verseNumber: result.verseNumber,
    });
  };

  // Count results per religion
  const religionCounts = useMemo(() => {
    const counts: Record<string, number> = { all: results.length };
    ALL_RELIGION_IDS.forEach((r) => {
      counts[r] = results.filter((item) => item.religion === r).length;
    });
    return counts;
  }, [results]);

  const quickSuggestions = useMemo(
    () => universalScriptureSearchService.getQuickSuggestions(),
    []
  );

  const getReligionBadgeColor = (rel: ReligionId) => {
    switch (rel) {
      case 'islam':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'hinduism':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'christianity':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'judaism':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'sikhism':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      case 'buddhism':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'jainism':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  const getMatchTypeLabel = (type: SearchMatchType) => {
    switch (type) {
      case 'exact_reference':
        return { label: 'Exact Reference Match', color: 'bg-gold-500/20 text-gold-300 border-gold-500/40' };
      case 'exact_phrase':
        return { label: 'Exact Phrase Match', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' };
      case 'word_match':
        return { label: 'Word Match', color: 'bg-blue-500/20 text-blue-300 border-blue-500/40' };
      case 'thematic_result':
        return { label: 'Related / Thematic Result', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40' };
    }
  };

  if (!isOpen) return null;

  return (
    <div
      id="universal-scripture-search-modal"
      data-testid="universal-scripture-search-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-navy-900 border border-gold-500/30 rounded-3xl shadow-2xl z-10 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Search Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-navy-950/90 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Search className="w-5 h-5 text-gold-400" />
              <div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-slate-100 flex items-center space-x-2">
                  <span>Universal Scripture Search</span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30">
                    7 Traditions
                  </span>
                </h3>
                <p className="text-xs text-slate-400">
                  Search across verified passages, citations, prayers, hymns, and spiritual themes.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              data-testid="close-search-modal-btn"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
              title="Close Search (Escape)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search Input Bar */}
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <Search className="w-4 h-4 text-gold-400 absolute left-4 pointer-events-none" />
            <input
              ref={inputRef}
              data-testid="universal-search-input"
              type="text"
              value={query}
              onChange={(e) => handleQueryChange(e.target.value)}
              placeholder="Search reference (John 3:16, Quran 2:255, Gita 2:47), phrase, or theme (Compassion, Peace)..."
              className="w-full bg-navy-950 border border-slate-700 focus:border-gold-500 rounded-2xl pl-11 pr-24 py-3 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-gold-500 shadow-inner"
            />
            <div className="absolute right-3 flex items-center space-x-1.5">
              {query && (
                <button
                  type="button"
                  data-testid="clear-search-query-btn"
                  onClick={() => {
                    setQuery('');
                    setResults([]);
                    setHasSearched(false);
                    inputRef.current?.focus();
                  }}
                  className="p-1 text-slate-500 hover:text-slate-300 transition"
                  title="Clear input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                data-testid="universal-search-submit-btn"
                className="px-3 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs transition shadow-gold-sm flex items-center space-x-1"
                title="Search"
              >
                <span>Search</span>
              </button>
            </div>
          </form>

          {/* Action Notice Banner */}
          {actionNotice && (
            <div className="px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-in fade-in-50">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{actionNotice}</span>
              </div>
              <button onClick={() => setActionNotice(null)} className="text-emerald-400 hover:text-emerald-200">
                ✕
              </button>
            </div>
          )}

          {/* Filters Bar: Religion Pills */}
          <div className="flex items-center space-x-1 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
            <button
              data-testid="filter-religion-all"
              onClick={() => handleSelectReligion('all')}
              className={`px-3 py-1.5 rounded-xl font-medium transition flex items-center space-x-1.5 flex-shrink-0 ${
                selectedReligion === 'all'
                  ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                  : 'bg-navy-950 text-slate-400 border border-slate-800 hover:text-slate-200'
              }`}
            >
              <span>All Traditions</span>
              {hasSearched && (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-full bg-navy-900/50 text-slate-300">
                  {religionCounts.all}
                </span>
              )}
            </button>

            {ALL_RELIGION_IDS.map((relId) => {
              const meta = RELIGIONS_REGISTRY[relId];
              const isSelected = selectedReligion === relId;
              const count = religionCounts[relId] || 0;
              return (
                <button
                  key={relId}
                  data-testid={`filter-religion-${relId}`}
                  onClick={() => handleSelectReligion(relId)}
                  className={`px-2.5 py-1.5 rounded-xl font-medium transition flex items-center space-x-1 flex-shrink-0 ${
                    isSelected
                      ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                      : 'bg-navy-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  <span>{meta.name}</span>
                  {hasSearched && (
                    <span className="text-[10px] font-mono px-1 py-0.2 rounded-full bg-slate-800/80 text-slate-300">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Match Type Secondary Tabs (Visible when search is active) */}
          {hasSearched && results.length > 0 && (
            <div className="flex items-center space-x-1.5 pt-1 text-[11px] overflow-x-auto scrollbar-none border-t border-slate-800/60">
              <span className="text-slate-500 font-medium mr-1 flex items-center space-x-1">
                <Filter className="w-3 h-3" />
                <span>Match:</span>
              </span>
              {[
                { id: 'all', label: 'All Results' },
                { id: 'exact_reference', label: 'Exact References' },
                { id: 'exact_phrase', label: 'Phrases' },
                { id: 'word_match', label: 'Words' },
                { id: 'thematic_result', label: 'Thematic Discovery' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  data-testid={`filter-match-${tab.id}`}
                  onClick={() => handleSelectMatchType(tab.id as any)}
                  className={`px-2 py-0.5 rounded-lg transition ${
                    selectedMatchType === tab.id
                      ? 'bg-slate-800 text-gold-400 font-bold border border-gold-500/30'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Body / Results Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {/* STATE 1: Empty Query — Show Suggestions & Recents */}
          {!hasSearched && !isSearching && (
            <div className="space-y-6 py-2">
              {/* Quick Search Suggestions */}
              <div className="space-y-2.5">
                <div className="flex items-center space-x-2 text-xs font-semibold text-slate-300">
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span>Suggested Citations & Spiritual Themes</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickSuggestions.map((item, idx) => (
                    <button
                      key={idx}
                      data-testid="quick-suggestion-chip"
                      onClick={() => {
                        setQuery(item.query);
                        if (item.religion) setSelectedReligion(item.religion);
                        executeSearch(item.query, item.religion || 'all', 'all');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-navy-950/80 hover:bg-navy-950 border border-slate-800 hover:border-gold-500/40 text-slate-300 hover:text-gold-300 text-xs font-medium transition flex items-center space-x-1.5 group cursor-pointer"
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-3 h-3 text-slate-500 group-hover:text-gold-400 group-hover:translate-x-0.5 transition" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="space-y-2.5 pt-4 border-t border-slate-800">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <div className="flex items-center space-x-1.5 font-semibold text-slate-300">
                      <History className="w-4 h-4 text-slate-400" />
                      <span>Recent Searches</span>
                    </div>
                    <button
                      data-testid="clear-recent-searches-btn"
                      onClick={() => {
                        universalScriptureSearchService.clearRecentSearches();
                        setRecentSearches([]);
                      }}
                      className="text-[11px] text-slate-500 hover:text-rose-400 transition"
                    >
                      Clear history
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {recentSearches.map((rec) => (
                      <button
                        key={rec.id}
                        data-testid="recent-search-chip"
                        onClick={() => {
                          setQuery(rec.query);
                          if (rec.religion) setSelectedReligion(rec.religion);
                          executeSearch(rec.query, rec.religion || 'all', 'all');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-navy-950 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-mono transition flex items-center space-x-1.5"
                      >
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{rec.query}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Instruction Guide */}
              <div className="p-4 rounded-2xl bg-navy-950/50 border border-slate-800/80 space-y-2 text-xs text-slate-400">
                <span className="font-semibold text-slate-300 block">Supported Search Formats:</span>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] list-disc list-inside text-slate-400">
                  <li><strong>Exact Citations:</strong> John 3:16, Quran 2:255, Gita 2:47</li>
                  <li><strong>Phrases:</strong> "The LORD is my shepherd", "Bismillah"</li>
                  <li><strong>Original Languages:</strong> Arabic, Sanskrit, Hebrew, Gurmukhi, Pali</li>
                  <li><strong>Transliterations:</strong> IAST, Roman Gurmukhi, Roman Arabic</li>
                  <li><strong>Spiritual Themes:</strong> Compassion, Forgiveness, Peace, Patience</li>
                </ul>
              </div>
            </div>
          )}

          {/* STATE 2: Loading State */}
          {isSearching && (
            <div className="py-16 text-center space-y-3">
              <div className="w-8 h-8 rounded-full border-2 border-gold-400 border-t-transparent animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-medium">Searching scripture corpus across 7 traditions...</p>
            </div>
          )}

          {/* STATE 3: No Matches Found */}
          {hasSearched && !isSearching && results.length === 0 && (
            <div className="py-16 text-center space-y-3 max-w-md mx-auto">
              <div className="w-12 h-12 rounded-full bg-navy-950 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                <AlertCircle className="w-6 h-6 text-slate-400" />
              </div>
              <h4 className="font-semibold text-sm text-slate-200">No Scripture Matches Found</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                No verified passages found for "{query}". Try checking the reference spelling (e.g., <em>John 3:16</em>, <em>Quran 2:255</em>, <em>Gita 2:47</em>), or search by broad spiritual themes like <em>Compassion</em> or <em>Peace</em>.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setQuery('Compassion');
                    executeSearch('Compassion', 'all', 'all');
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-gold-500/20 text-gold-300 border border-gold-500/40 text-xs font-semibold hover:bg-gold-500 hover:text-navy-950 transition"
                >
                  Explore Theme: Compassion
                </button>
              </div>
            </div>
          )}

          {/* STATE 4: Search Results List */}
          {hasSearched && !isSearching && results.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                <span>
                  Found <strong>{results.length}</strong> verified passages across{' '}
                  {selectedReligion === 'all' ? 'all traditions' : selectedReligion}
                </span>
                <span className="text-[11px] font-mono text-slate-500">Local-first & offline resilient</span>
              </div>

              {results.map((result) => {
                const badge = getMatchTypeLabel(result.matchType);
                return (
                  <div
                    key={result.id}
                    data-testid="search-result-card"
                    className="p-4 rounded-2xl bg-navy-950/80 border border-slate-800 hover:border-gold-500/40 transition space-y-3 group"
                  >
                    {/* Top Meta Bar */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-semibold border ${getReligionBadgeColor(
                            result.religion
                          )}`}
                        >
                          {result.religion}
                        </span>
                        <span className="text-xs font-medium text-slate-400 font-serif">
                          {result.collectionTitle}
                        </span>
                        {result.isOfflineAvailable && (
                          <span className="text-[10px] font-mono text-emerald-400 px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/30">
                            Offline Ready
                          </span>
                        )}
                      </div>

                      {/* Match Type Badge */}
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border ${badge.color}`}
                      >
                        {badge.label}
                      </span>
                    </div>

                    {/* Coordinates & Display Title */}
                    <div>
                      <h4 className="font-serif text-sm sm:text-base font-bold text-slate-100 group-hover:text-gold-300 transition">
                        {result.displayCoordinates} — {result.displayTitle}
                      </h4>
                      {result.matchType === 'thematic_result' && (
                        <p className="text-[11px] text-purple-300/90 font-serif italic mt-0.5">
                          Thematic discovery — contextual spiritual reflection, not direct scriptural equivalence.
                        </p>
                      )}
                    </div>

                    {/* Original Authentic Language Script */}
                    {result.originalText && (
                      <div className="p-3 rounded-xl bg-navy-900/60 border border-slate-850 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                          <span>Original Text ({result.languageCode.toUpperCase()})</span>
                          <span>Authentic Canonical Script</span>
                        </div>
                        <p
                          dir={['ar', 'he'].includes(result.languageCode) ? 'rtl' : 'ltr'}
                          className={`text-slate-100 leading-relaxed ${
                            result.languageCode === 'ar'
                              ? 'font-arabic text-base sm:text-lg'
                              : result.languageCode === 'he'
                              ? 'font-serif text-base'
                              : 'font-serif text-sm sm:text-base'
                          }`}
                        >
                          {result.originalText}
                        </p>
                      </div>
                    )}

                    {/* Transliteration (if present) */}
                    {result.transliterationText && (
                      <p className="text-xs text-gold-300/80 font-mono italic leading-relaxed">
                        {result.transliterationText}
                      </p>
                    )}

                    {/* Translation */}
                    <div className="space-y-1">
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif">
                        {result.translationText}
                      </p>
                      {result.secondaryTranslationText && (
                        <p
                          dir="rtl"
                          className="text-xs text-slate-400 font-urdu leading-relaxed pt-1 border-t border-slate-850"
                        >
                          {result.secondaryTranslationText}
                        </p>
                      )}
                    </div>

                    {/* Attribution & Actions Footer */}
                    <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <span className="text-[11px] text-slate-500 font-mono">
                        {result.sourceAttribution}
                      </span>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {/* Bookmark Button */}
                        <button
                          data-testid="search-result-bookmark-btn"
                          onClick={() => handleBookmarkResult(result)}
                          className="px-2.5 py-1.5 rounded-lg bg-navy-900 hover:bg-slate-800 border border-slate-700 hover:border-gold-500/50 text-slate-300 hover:text-gold-300 text-xs font-medium transition flex items-center space-x-1"
                          title="Save this passage to My Sacred Library Bookmarks"
                        >
                          <BookMarked className="w-3.5 h-3.5 text-gold-400" />
                          <span>Bookmark</span>
                        </button>

                        {/* Read Passage Button */}
                        <button
                          data-testid="search-result-read-btn"
                          onClick={() => handleSelectResult(result)}
                          className="px-3.5 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs transition shadow-gold-sm flex items-center space-x-1.5"
                          title="Open in reader (keeps audio paused)"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>Read Passage</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
