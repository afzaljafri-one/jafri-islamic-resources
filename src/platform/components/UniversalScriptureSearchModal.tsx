// ==============================================================================
// Universal Scripture Search Modal
// Unified Multilingual Search across All Seven World Religious Traditions
// Jafri Religious Resources — Phase 6.3.1 (Integrity, Accessibility & Transparency)
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
  Layers,
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
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  const debounceTimerRef = useRef<any>(null);

  // Focus input and load recents when opened
  useEffect(() => {
    if (isOpen) {
      lastFocusedElementRef.current = document.activeElement as HTMLElement;
      setRecentSearches(universalScriptureSearchService.getRecentSearches());
      setTimeout(() => inputRef.current?.focus(), 80);
      if (initialQuery.trim()) {
        executeSearch(initialQuery.trim(), selectedReligion, selectedMatchType);
      }
    }
  }, [isOpen]);

  // Accessibility: Handle Escape key to close, and Tab focus trap within modal
  useEffect(() => {
    if (!isOpen) return;

    const handleModalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }

      if (e.key === 'Tab') {
        const dialog = document.getElementById('universal-scripture-search-modal');
        if (!dialog) return;

        const focusableElements = dialog.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const focusable = Array.from(focusableElements).filter(
          (el) => !el.hasAttribute('disabled') && el.offsetParent !== null
        );
        if (focusable.length === 0) return;

        const firstElement = focusable[0];
        const lastElement = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener('keydown', handleModalKeyDown);
    return () => {
      window.removeEventListener('keydown', handleModalKeyDown);
      lastFocusedElementRef.current?.focus();
    };
  }, [isOpen, onClose]);

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

  const exactRefCount = results.filter((r) => r.matchType === 'exact_reference').length;

  return (
    <div
      id="universal-scripture-search-modal"
      data-testid="universal-scripture-search-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="universal-search-title"
      aria-describedby="universal-search-desc"
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
                <h3
                  id="universal-search-title"
                  className="font-serif text-base sm:text-lg font-bold text-slate-100 flex items-center space-x-2"
                >
                  <span>Universal Scripture Search</span>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-gold-500/10 text-gold-400 border border-gold-500/30">
                    7 Traditions
                  </span>
                </h3>
                <p id="universal-search-desc" className="text-xs text-slate-400">
                  Search across verified passages, citations, prayers, hymns, and spiritual themes.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              data-testid="close-search-modal-btn"
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition cursor-pointer"
              title="Close Search (Escape)"
              aria-label="Close Scripture Search"
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
              placeholder='Search by reference (e.g. "John 3:16", "Quran 2:255", "Gita 2:47", "Psalm 23") or theme ("Peace", "Compassion")...'
              aria-label="Search Scripture Query"
              className="w-full pl-11 pr-24 py-3 rounded-2xl bg-navy-950/90 border border-slate-700/80 focus:border-gold-500/70 focus:outline-none focus:ring-1 focus:ring-gold-500/30 text-slate-100 placeholder-slate-500 text-sm transition shadow-inner font-sans"
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
                  className="p-1 text-slate-400 hover:text-slate-200 transition rounded-lg hover:bg-slate-800"
                  title="Clear query"
                  aria-label="Clear Search Input"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="submit"
                data-testid="universal-search-submit-btn"
                className="px-3 py-1.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs transition shadow-gold-sm"
              >
                Search
              </button>
            </div>
          </form>

          {/* Action / Notification Banner */}
          {actionNotice && (
            <div className="p-2.5 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center space-x-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{actionNotice}</span>
            </div>
          )}

          {/* Tradition Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto scrollbar-none pb-1 pt-1">
            <button
              data-testid="filter-religion-all"
              onClick={() => handleSelectReligion('all')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer flex items-center space-x-1.5 ${
                selectedReligion === 'all'
                  ? 'bg-gold-500 text-navy-950 shadow-gold-sm font-bold'
                  : 'bg-navy-900/80 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>All Traditions</span>
              {hasSearched && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    selectedReligion === 'all'
                      ? 'bg-navy-950 text-gold-300'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {religionCounts.all || 0}
                </span>
              )}
            </button>

            {ALL_RELIGION_IDS.map((relId) => {
              const relMeta = RELIGIONS_REGISTRY[relId];
              const isSelected = selectedReligion === relId;
              const count = religionCounts[relId] || 0;

              return (
                <button
                  key={relId}
                  data-testid={`filter-religion-${relId}`}
                  onClick={() => handleSelectReligion(relId)}
                  className={`px-2.5 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition cursor-pointer flex items-center space-x-1.5 border ${
                    isSelected
                      ? 'bg-slate-800 text-gold-400 border-gold-500/60 font-bold'
                      : 'bg-navy-900/60 text-slate-400 hover:text-slate-200 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <span>{relMeta.name}</span>
                  {hasSearched && count > 0 && (
                    <span className="text-[10px] px-1 py-0.2 rounded-full bg-slate-800/80 text-slate-300 font-mono">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Match Category Tabs */}
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
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 max-h-[60vh] islamic-pattern-bg">
          {/* Quick Suggestions & Recents (When query is empty) */}
          {!hasSearched && !isSearching && (
            <div className="space-y-5">
              {/* Suggested Citations */}
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
                <div className="space-y-2.5 pt-3 border-t border-slate-800/80">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center space-x-1.5 font-medium">
                      <History className="w-3.5 h-3.5 text-slate-500" />
                      <span>Recent Searches</span>
                    </span>
                    <button
                      data-testid="clear-recent-searches-btn"
                      onClick={() => {
                        universalScriptureSearchService.clearRecentSearches();
                        setRecentSearches([]);
                      }}
                      className="text-[11px] text-slate-500 hover:text-slate-300 hover:underline"
                    >
                      Clear
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((item) => (
                      <button
                        key={item.id}
                        data-testid="recent-search-chip"
                        onClick={() => {
                          setQuery(item.query);
                          if (item.religion) setSelectedReligion(item.religion);
                          executeSearch(item.query, item.religion || 'all', 'all');
                        }}
                        className="px-2.5 py-1 rounded-lg bg-navy-950/60 hover:bg-slate-800 border border-slate-850 text-slate-400 hover:text-slate-200 text-xs transition flex items-center space-x-1.5"
                      >
                        <Clock className="w-3 h-3 text-slate-500" />
                        <span>{item.query}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Coverage Transparency Note */}
              <div className="p-3.5 rounded-2xl bg-navy-950/70 border border-slate-800/80 space-y-1.5 text-xs text-slate-400">
                <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Authoritative Corpus Coverage</span>
                </span>
                <p className="leading-relaxed text-[11px] text-slate-400">
                  Search covers authentic canonical collections across Islam, Christianity, Hinduism, Judaism, Sikhism,
                  Buddhism, and Jainism. All results distinguish exact references from related word and thematic matches.
                </p>
              </div>
            </div>
          )}

          {/* Loading Indicator */}
          {isSearching && (
            <div className="py-12 flex flex-col items-center justify-center space-y-3 text-slate-400">
              <div className="w-7 h-7 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
              <p className="text-xs font-mono">Searching verified scriptures...</p>
            </div>
          )}

          {/* Empty Search State */}
          {hasSearched && !isSearching && results.length === 0 && (
            <div className="py-12 text-center space-y-3">
              <AlertCircle className="w-8 h-8 text-amber-400/80 mx-auto" />
              <h4 className="font-serif text-base font-bold text-slate-200">
                No Scripture Matches Found
              </h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                No verified passage matched "{query}". Try searching by standard citation (e.g. "John 3:16", "Quran 2:255", "Gita 2:47", "Psalm 23") or by spiritual theme.
              </p>
            </div>
          )}

          {/* Search Results List */}
          {hasSearched && !isSearching && results.length > 0 && (
            <div className="space-y-3">
              {/* Result Summary Bar */}
              <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                <span>
                  Found <strong>{results.length}</strong> {results.length === 1 ? 'passage' : 'passages'}
                  {exactRefCount > 0 && (
                    <span className="text-gold-400 ml-1 font-semibold">
                      ({exactRefCount} Exact Reference)
                    </span>
                  )}
                  {' '}across {selectedReligion === 'all' ? 'all traditions' : selectedReligion}
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

                        {/* Availability Transparency Badge */}
                        {result.availabilityStatus && (
                          <span
                            title={result.scopeNotes || ''}
                            className={`text-[10px] font-mono px-1.5 py-0.2 rounded border ${
                              result.availabilityStatus === 'FULL'
                                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                : result.availabilityStatus === 'PARTIAL'
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                : 'bg-slate-700/40 text-slate-400 border-slate-700'
                            }`}
                          >
                            {result.availabilityStatus === 'FULL'
                              ? 'Full Text Offline'
                              : result.availabilityStatus === 'PARTIAL'
                              ? 'Curated Core'
                              : 'Catalog Reference'}
                          </span>
                        )}

                        {/* Grouped Composition Indicator */}
                        {result.groupedUnitsCount && (
                          <span className="text-[10px] font-mono px-2 py-0.2 rounded-full font-bold bg-gold-500/15 text-gold-300 border border-gold-500/40 flex items-center space-x-1">
                            <Layers className="w-2.5 h-2.5 text-gold-400" />
                            <span>Grouped ({result.groupedUnitsCount} Units)</span>
                          </span>
                        )}

                        {/* Quotation Type Badge */}
                        {result.quotationType && (
                          <span
                            data-testid="quotation-type-badge"
                            className={`text-[10px] font-mono px-2 py-0.2 rounded-full border ${
                              result.quotationType === 'direct_quotation'
                                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                                : result.quotationType === 'scholarly_translation'
                                ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/30'
                                : 'bg-purple-500/10 text-purple-300 border-purple-500/30'
                            }`}
                          >
                            {result.quotationType === 'direct_quotation'
                              ? 'Direct Text'
                              : result.quotationType === 'scholarly_translation'
                              ? 'Scholarly Translation'
                              : 'Contextual Reflection'}
                          </span>
                        )}

                        {/* Component-Level Canonical Scripture Rights Badge (Phase 6.3.5) */}
                        {result.canonicalTextRights && (
                          <span
                            data-testid="canonical-rights-badge"
                            className="text-[10px] font-mono px-2 py-0.2 rounded-full border bg-cyan-500/10 text-cyan-300 border-cyan-500/30"
                            title={`Canonical Source Text: ${result.canonicalTextRights.rightsHolderOrPublisher || 'Traditional Canon'} • Exact Licence: ${result.canonicalTextRights.exactLicenceIdentifier} • Status: ${result.canonicalTextRights.rightsStatus}`}
                          >
                            Text: {result.canonicalTextRights.exactLicenceIdentifier}
                          </span>
                        )}

                        {/* Translation Rights & Licence Badge (Phase 6.3.5 Fail-Closed Gate) */}
                        {(() => {
                          const transRights = result.primaryTranslationRights;
                          const status = transRights ? transRights.rightsStatus : result.rightsStatus;
                          const licence = transRights ? transRights.exactLicenceIdentifier : result.exactLicenceIdentifier;
                          const holder = transRights ? transRights.rightsHolderOrPublisher : result.rightsHolderOrPublisher;

                          if (!status || status === 'UNKNOWN' || !licence) {
                            return (
                              <span
                                data-testid="rights-licence-badge"
                                data-component-testid="translation-rights-badge"
                                className="text-[10px] font-mono px-2 py-0.2 rounded-full border bg-slate-800/80 text-slate-400 border-slate-700"
                                title={`Translation Rights Status: UNKNOWN • ${holder ? `Rights Holder: ${holder}` : 'Rights Holder: Unspecified'}`}
                              >
                                Rights not verified
                              </span>
                            );
                          }

                          if (status === 'PERMISSION_REQUIRED') {
                            return (
                              <span
                                data-testid="rights-licence-badge"
                                data-component-testid="translation-rights-badge"
                                className="text-[10px] font-mono px-2 py-0.2 rounded-full border bg-rose-500/10 text-rose-300 border-rose-500/30 font-semibold"
                                title={`Translation Rights Status: PERMISSION_REQUIRED • ${holder ? `Rights Holder: ${holder}` : 'Rights Holder: Unspecified'} • Permission required for redistribution`}
                              >
                                Permission Required
                              </span>
                            );
                          }

                          if (status === 'RESTRICTED') {
                            return (
                              <span
                                data-testid="rights-licence-badge"
                                data-component-testid="translation-rights-badge"
                                className="text-[10px] font-mono px-2 py-0.2 rounded-full border bg-amber-500/10 text-amber-300 border-amber-500/30"
                                title={`Translation Rights Status: RESTRICTED • Rights Holder: ${holder || 'Documented Terms'} • Conditional non-commercial use only`}
                              >
                                {licence}
                              </span>
                            );
                          }

                          return (
                            <span
                              data-testid="rights-licence-badge"
                              data-component-testid="translation-rights-badge"
                              className="text-[10px] font-mono px-2 py-0.2 rounded-full border bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                              title={`Translation Rights Status: VERIFIED • Rights Holder: ${holder || 'Verified Source'} • Exact Licence: ${licence}`}
                            >
                              {licence}
                            </span>
                          );
                        })()}
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
                        <p
                          data-testid="thematic-result-note"
                          className="text-[11px] text-purple-300/90 font-serif italic mt-0.5"
                        >
                          Thematic discovery — contextual spiritual reflection, not direct scriptural equivalence.
                        </p>
                      )}
                    </div>

                    {/* Numbering Convention & Cross-References (Phase 6.3.3) */}
                    {result.numberingConvention && (
                      <div
                        data-testid="numbering-convention-badge"
                        className="text-[10px] font-mono text-slate-400 bg-navy-900/50 p-2 rounded-lg border border-slate-800 space-y-0.5"
                      >
                        <div className="flex items-center space-x-1.5 flex-wrap">
                          <span className="text-gold-400/90 font-semibold">Numbering:</span>
                          <span>{result.numberingConvention}</span>
                        </div>
                        {result.alternateNumberingCrossReference && (
                          <p className="text-slate-400 italic text-[10px] font-serif">
                            {result.alternateNumberingCrossReference}
                          </p>
                        )}
                      </div>
                    )}

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
                      {(() => {
                        const isWithheld =
                          result.primaryTranslationRights?.isAvailable === false ||
                          result.translationText.includes('withheld') ||
                          result.translationText.includes('स्थगित') ||
                          result.primaryTranslationRights?.rightsStatus === 'PERMISSION_REQUIRED';

                        if (isWithheld) {
                          return (
                            <div
                              data-testid="translation-withheld-notice"
                              className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1 my-1"
                            >
                              <div className="flex items-center space-x-1.5 text-xs text-rose-300 font-semibold font-mono">
                                <span>⚠️ Authorised Translation Withheld</span>
                              </div>
                              <p className="text-xs text-rose-200/90 font-serif leading-relaxed">
                                {result.primaryTranslationRights?.withheldNotice || result.translationText}
                              </p>
                            </div>
                          );
                        }

                        return (
                          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-serif">
                            {result.translationText}
                          </p>
                        );
                      })()}
                      {result.secondaryTranslationText && (
                        <p
                          dir="rtl"
                          className="text-xs text-slate-400 font-urdu leading-relaxed pt-1 border-t border-slate-850"
                        >
                          {result.secondaryTranslationText}
                        </p>
                      )}
                    </div>

                    {/* Parallel Translations Section (if present) */}
                    {result.parallelTranslations && result.parallelTranslations.length > 0 && (
                      <div className="p-3 rounded-xl bg-navy-900/60 border border-slate-800 space-y-2">
                        <span className="text-[10px] font-mono text-gold-400 font-semibold uppercase tracking-wider block">
                          Parallel Translations ({result.parallelTranslations.length} Editions)
                        </span>
                        <div className="grid gap-2 sm:grid-cols-2">
                          {result.parallelTranslations.map((tr) => {
                            const isWithheld =
                              tr.isAvailable === false ||
                              tr.rightsStatus === 'PERMISSION_REQUIRED' ||
                              tr.text.includes('withheld') ||
                              tr.text.includes('स्थगित');

                            return (
                              <div
                                key={tr.id}
                                data-testid="parallel-translation-card"
                                className={`p-2 rounded-lg border text-xs space-y-1 ${
                                  isWithheld
                                    ? 'bg-rose-950/20 border-rose-500/30 text-rose-200'
                                    : 'bg-navy-950/60 border-slate-850 text-slate-200'
                                }`}
                              >
                                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                                  <span className={`font-semibold ${isWithheld ? 'text-rose-300' : 'text-gold-400/90'}`}>
                                    {tr.translationName} ({tr.language})
                                  </span>
                                  {(() => {
                                    const st = tr.rightsStatus;
                                    const lic = tr.exactLicenceIdentifier;
                                    if (!st || st === 'UNKNOWN' || !lic) {
                                      return (
                                        <span className="text-[9px] text-slate-400 bg-slate-800 px-1 py-0.2 rounded border border-slate-700">
                                          Rights not verified
                                        </span>
                                      );
                                    }
                                    if (st === 'PERMISSION_REQUIRED' || isWithheld) {
                                      return (
                                        <span className="text-[9px] text-rose-300 bg-rose-950/40 px-1 py-0.2 rounded border border-rose-500/30">
                                          Permission Required
                                        </span>
                                      );
                                    }
                                    if (st === 'RESTRICTED') {
                                      return (
                                        <span className="text-[9px] text-amber-300 bg-amber-950/40 px-1 py-0.2 rounded border border-amber-500/30">
                                          {lic}
                                        </span>
                                      );
                                    }
                                    return (
                                      <span className="text-[9px] text-emerald-400/80 bg-emerald-950/40 px-1 py-0.2 rounded border border-emerald-500/20">
                                        {lic}
                                      </span>
                                    );
                                  })()}
                                </div>
                                {isWithheld ? (
                                  <p className="text-rose-300/80 font-serif italic text-xs leading-relaxed">
                                    {tr.withheldNotice || tr.text}
                                  </p>
                                ) : (
                                  <p className="text-slate-200 font-serif leading-relaxed text-xs">{tr.text}</p>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Attribution & Actions Footer */}
                    <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <div className="text-[11px] text-slate-400 font-mono flex items-center space-x-1.5 flex-wrap">
                          <span>{result.sourceAttribution}</span>
                          {result.canonicalRecension && (
                            <span className="text-[10px] text-slate-500">
                              • Recension: {result.canonicalRecension}
                            </span>
                          )}
                          {result.rightsHolderOrPublisher ? (
                            <span className="text-[10px] text-slate-500">
                              • Rights: {result.rightsHolderOrPublisher}
                            </span>
                          ) : (
                            <span className="text-[10px] text-slate-500 italic">
                              • Rights: Unspecified / Pending Verification
                            </span>
                          )}
                        </div>
                        {result.provenanceNotes && (
                          <p className="text-[10px] text-slate-500 font-serif italic">
                            {result.provenanceNotes}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        {/* Bookmark Button */}
                        <button
                          data-testid="search-result-bookmark-btn"
                          onClick={() => handleBookmarkResult(result)}
                          className="px-2.5 py-1.5 rounded-lg bg-navy-900 hover:bg-slate-800 border border-slate-700 hover:border-gold-500/50 text-slate-300 hover:text-gold-300 text-xs font-medium transition flex items-center space-x-1 cursor-pointer"
                          title="Save this passage to My Sacred Library Bookmarks"
                          aria-label={`Bookmark ${result.displayCoordinates}`}
                        >
                          <BookMarked className="w-3.5 h-3.5 text-gold-400" />
                          <span>Bookmark</span>
                        </button>

                        {/* Read Passage Button */}
                        <button
                          data-testid="search-result-read-btn"
                          onClick={() => handleSelectResult(result)}
                          className="px-3.5 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs transition shadow-gold-sm flex items-center space-x-1.5 cursor-pointer"
                          title="Open in reader (keeps audio paused)"
                          aria-label={`Read ${result.displayCoordinates}`}
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

        {/* Modal Footer */}
        <div className="p-3 border-t border-slate-800 bg-navy-950 flex items-center justify-between text-[11px] text-slate-400 font-mono">
          <div className="flex items-center space-x-2">
            <span>Shortcut: Press <kbd className="px-1 py-0.2 rounded bg-slate-800 text-gold-400">Esc</kbd> to close</span>
          </div>
          <span>Jafri Sacred Library • Verified Multi-Tradition Search</span>
        </div>
      </div>
    </div>
  );
};
