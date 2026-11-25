// ==============================================================================
// My Sacred Library: Central Personal Reading Hub
// Bookmarks, Continue Reading, Reading History & Chapter Progress
// Jafri Religious Books & Audio Platform — Phase 6.1
// ==============================================================================

import React, { useState, useEffect, useMemo } from 'react';
import {
  X,
  BookOpen,
  Bookmark,
  History,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Download,
  Upload,
  Search,
  Check,
  BookMarked,
  Clock,
  Sparkles,
} from 'lucide-react';
import { ReligionId } from '../types/religion';
import { RELIGIONS_REGISTRY } from '../config/religionsRegistry';
import { personalLibraryService, CANONICAL_SCOPES } from '../services/personalLibraryService';

export type LibraryTab = 'continue' | 'bookmarks' | 'history' | 'progress';

interface MyLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: LibraryTab;
  initialReligion?: ReligionId | 'all';
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
}

export const MyLibraryModal: React.FC<MyLibraryModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'continue',
  initialReligion = 'all',
  onNavigateToReading,
}) => {
  const [activeTab, setActiveTab] = useState<LibraryTab>(initialTab);
  const [selectedReligion, setSelectedReligion] = useState<ReligionId | 'all'>(initialReligion);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [bookmarkSort, setBookmarkSort] = useState<'recent' | 'scripture' | 'oldest'>('recent');

  // Service state
  const [libraryState, setLibraryState] = useState(() => personalLibraryService.getState());
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Sync state on updates
  useEffect(() => {
    const unsub = personalLibraryService.subscribe(() => {
      setLibraryState({ ...personalLibraryService.getState() });
    });
    return () => unsub();
  }, []);

  // Update initial tab when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
      if (initialReligion) setSelectedReligion(initialReligion);
    }
  }, [isOpen, initialTab, initialReligion]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Derived filtered bookmarks
  const filteredBookmarks = useMemo(() => {
    let list = libraryState.bookmarks;
    if (selectedReligion !== 'all') {
      list = list.filter((b) => b.religion === selectedReligion);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (b) =>
          b.displayTitle.toLowerCase().includes(q) ||
          (b.displaySubtitle && b.displaySubtitle.toLowerCase().includes(q)) ||
          b.originalTextReference.toLowerCase().includes(q) ||
          (b.translationText && b.translationText.toLowerCase().includes(q))
      );
    }
    return [...list].sort((a, b) => {
      if (bookmarkSort === 'oldest') return a.timestamp - b.timestamp;
      if (bookmarkSort === 'scripture') return a.displayTitle.localeCompare(b.displayTitle);
      return b.timestamp - a.timestamp;
    });
  }, [libraryState.bookmarks, selectedReligion, searchQuery, bookmarkSort]);

  // Derived filtered history
  const filteredHistory = useMemo(() => {
    let list = libraryState.history;
    if (selectedReligion !== 'all') {
      list = list.filter((h) => h.religion === selectedReligion);
    }
    return list;
  }, [libraryState.history, selectedReligion]);

  // All progress records
  const allProgress = useMemo(() => {
    return personalLibraryService.getAllProgress();
  }, [libraryState.progress]);

  // Export JSON handler
  const handleExportJson = () => {
    const data = personalLibraryService.exportLibrary();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jafri-sacred-library-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setExportNotice('Library backup exported successfully.');
    setTimeout(() => setExportNotice(null), 4000);
  };

  // Import JSON handler
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        const res = personalLibraryService.importLibrary(json);
        if (res.success) {
          setExportNotice(`Imported ${res.count} items into your library.`);
        } else {
          setExportNotice(res.error || 'Failed to import backup file.');
        }
        setTimeout(() => setExportNotice(null), 4000);
      } catch {
        setExportNotice('Invalid JSON file format.');
        setTimeout(() => setExportNotice(null), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/85 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div
        id="my-library-modal"
        role="dialog"
        aria-modal="true"
        aria-label="My Sacred Library"
        className="relative w-full max-w-5xl bg-navy-900 border border-gold-500/30 rounded-2xl shadow-2xl flex flex-col max-h-[92vh] z-10 overflow-hidden islamic-pattern-bg"
      >
        {/* Top Header */}
        <div className="px-4 sm:px-6 py-3.5 border-b border-gold-500/20 bg-navy-950/95 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400 flex-shrink-0 shadow-gold-sm">
              <BookMarked className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-serif text-base sm:text-lg font-bold tracking-wide text-slate-100">
                  My Sacred Library
                </h2>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-semibold border border-gold-500/40">
                  Guest Local-First
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-slate-400">
                Personal Bookmarks, Reading History & Chapter Progress across 7 World Traditions
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {/* Backup / Export Menu */}
            <button
              onClick={handleExportJson}
              title="Export Library Backup (JSON)"
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-navy-900 border border-slate-700 hover:border-gold-500/50 text-slate-300 hover:text-gold-300 text-xs font-medium transition flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden sm:inline">Backup</span>
            </button>

            <label
              title="Import Library Backup (JSON)"
              className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-navy-900 border border-slate-700 hover:border-gold-500/50 text-slate-300 hover:text-gold-300 text-xs font-medium transition flex items-center space-x-1.5 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden sm:inline">Restore</span>
              <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
            </label>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
              title="Close Library"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Export / Notification Notice */}
        {exportNotice && (
          <div className="px-4 py-2 bg-emerald-950/80 border-b border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{exportNotice}</span>
            </div>
            <button onClick={() => setExportNotice(null)} className="text-emerald-400 hover:text-emerald-200">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Main Tab Navigation */}
        <div className="px-4 sm:px-6 border-b border-slate-800 bg-navy-950/80 flex items-center justify-between overflow-x-auto">
          <div className="flex space-x-1 sm:space-x-2 py-2">
            <button
              data-testid="tab-continue"
              onClick={() => setActiveTab('continue')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                activeTab === 'continue'
                  ? 'bg-gold-500 text-navy-950 shadow-gold-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Continue Reading</span>
            </button>

            <button
              data-testid="tab-bookmarks"
              onClick={() => setActiveTab('bookmarks')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                activeTab === 'bookmarks'
                  ? 'bg-gold-500 text-navy-950 shadow-gold-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Bookmarks</span>
              {libraryState.bookmarks.length > 0 && (
                <span
                  className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    activeTab === 'bookmarks' ? 'bg-navy-950/20 text-navy-950' : 'bg-gold-500/20 text-gold-400'
                  }`}
                >
                  {libraryState.bookmarks.length}
                </span>
              )}
            </button>

            <button
              data-testid="tab-history"
              onClick={() => setActiveTab('history')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                activeTab === 'history'
                  ? 'bg-gold-500 text-navy-950 shadow-gold-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Reading History</span>
              {libraryState.history.length > 0 && (
                <span
                  className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    activeTab === 'history' ? 'bg-navy-950/20 text-navy-950' : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  {libraryState.history.length}
                </span>
              )}
            </button>

            <button
              data-testid="tab-progress"
              onClick={() => setActiveTab('progress')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                activeTab === 'progress'
                  ? 'bg-gold-500 text-navy-950 shadow-gold-sm font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Chapter Progress</span>
            </button>
          </div>
        </div>

        {/* Sub-Filter: Religion Selector */}
        <div className="px-4 sm:px-6 py-2 border-b border-slate-800/70 bg-navy-950/50 flex items-center space-x-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedReligion('all')}
            className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap text-xs font-medium ${
              selectedReligion === 'all'
                ? 'bg-slate-700 text-slate-100 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Traditions
          </button>
          {Object.values(RELIGIONS_REGISTRY).map((rel) => {
            const bCount = libraryState.bookmarks.filter((b) => b.religion === rel.id).length;
            const hasPosition = Boolean(libraryState.positions[rel.id]);
            return (
              <button
                key={rel.id}
                onClick={() => setSelectedReligion(rel.id)}
                className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap text-xs flex items-center space-x-1 ${
                  selectedReligion === rel.id
                    ? 'bg-slate-700 text-slate-100 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{rel.name}</span>
                {activeTab === 'bookmarks' && bCount > 0 && (
                  <span className="text-[10px] px-1 rounded bg-slate-800 text-gold-400 font-mono">
                    {bCount}
                  </span>
                )}
                {activeTab === 'continue' && hasPosition && (
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                )}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* =========================================================================
              TAB A: CONTINUE READING
              ========================================================================= */}
          {activeTab === 'continue' && (
            <div className="space-y-6">
              {/* Highlight Card: Global Most Recent Position */}
              {libraryState.globalLastRead ? (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-gold-500/15 via-navy-950/80 to-navy-900 border border-gold-500/40 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Sparkles className="w-4 h-4 text-gold-400" />
                      <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
                        Resume Current Reading
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>{new Date(libraryState.globalLastRead.timestamp).toLocaleString()}</span>
                    </span>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gold-500/20 text-gold-300 uppercase">
                          {libraryState.globalLastRead.religion}
                        </span>
                        <h3 className="font-serif text-base sm:text-lg font-bold text-slate-100">
                          {libraryState.globalLastRead.displayTitle}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 font-medium">
                        {libraryState.globalLastRead.displayLocation}
                      </p>
                      {libraryState.globalLastRead.preferredTranslation && (
                        <p className="text-[11px] text-slate-400">
                          Translation: <span className="text-slate-300">{libraryState.globalLastRead.preferredTranslation}</span>
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onNavigateToReading(libraryState.globalLastRead!.religion, {
                          collectionId: libraryState.globalLastRead!.collectionId,
                          readingId: libraryState.globalLastRead!.readingId,
                          chapterNumber: libraryState.globalLastRead!.chapterNumber,
                          verseNumber: libraryState.globalLastRead!.verseNumber,
                          translationId: libraryState.globalLastRead!.preferredTranslation,
                        });
                      }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 font-bold text-xs sm:text-sm shadow-gold-sm hover:brightness-110 transition flex items-center justify-center space-x-2 cursor-pointer flex-shrink-0"
                    >
                      <BookOpen className="w-4 h-4" />
                      <span>Continue Reading</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center bg-navy-950/50 rounded-2xl border border-slate-800 text-slate-400 space-y-2">
                  <BookOpen className="w-10 h-10 mx-auto text-slate-600" />
                  <p className="font-medium text-slate-300 text-sm">No Active Reading Session</p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Select any scripture from the 7 traditions to start reading. Your exact reading location will automatically be saved here so you can pick up where you left off.
                  </p>
                </div>
              )}

              {/* 7 Traditions Independent Continue Cards */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Last-Read Position by Religious Tradition
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.values(RELIGIONS_REGISTRY).map((rel) => {
                    if (selectedReligion !== 'all' && selectedReligion !== rel.id) return null;
                    const pos = libraryState.positions[rel.id];

                    return (
                      <div
                        key={rel.id}
                        className="p-3.5 rounded-xl bg-navy-950/70 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                rel.theme.badgeBg
                              } ${rel.theme.badgeText}`}
                            >
                              {rel.name}
                            </span>
                            {pos && (
                              <span className="text-[10px] text-slate-500">
                                {new Date(pos.timestamp).toLocaleDateString()}
                              </span>
                            )}
                          </div>

                          {pos ? (
                            <>
                              <div className="text-xs font-bold text-slate-200 truncate">
                                {pos.displayTitle}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate">
                                {pos.displayLocation}
                              </div>
                            </>
                          ) : (
                            <div className="text-xs text-slate-500 italic py-1">
                              Not started yet
                            </div>
                          )}
                        </div>

                        {pos ? (
                          <button
                            onClick={() => {
                              onClose();
                              onNavigateToReading(rel.id, {
                                collectionId: pos.collectionId,
                                readingId: pos.readingId,
                                chapterNumber: pos.chapterNumber,
                                verseNumber: pos.verseNumber,
                                translationId: pos.preferredTranslation,
                              });
                            }}
                            className="px-3 py-1.5 rounded-lg bg-navy-900 border border-gold-500/40 hover:border-gold-400 text-gold-300 hover:text-gold-200 text-xs font-semibold transition flex items-center space-x-1.5 flex-shrink-0 cursor-pointer"
                          >
                            <span>Resume</span>
                            <ExternalLink className="w-3 h-3 text-gold-400" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              onClose();
                              onNavigateToReading(rel.id, {});
                            }}
                            className="px-3 py-1.5 rounded-lg bg-navy-900 border border-slate-700 hover:border-slate-600 text-slate-400 text-xs font-medium transition flex items-center space-x-1 flex-shrink-0 cursor-pointer"
                          >
                            <span>Open</span>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* =========================================================================
              TAB B: SAVED BOOKMARKS
              ========================================================================= */}
          {activeTab === 'bookmarks' && (
            <div className="space-y-4">
              {/* Search & Sort Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search saved passages..."
                    className="w-full bg-navy-950 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold-500/50"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
                    >
                      &times;
                    </button>
                  )}
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                  <span className="text-[11px] text-slate-400">Sort by:</span>
                  <select
                    value={bookmarkSort}
                    onChange={(e) => setBookmarkSort(e.target.value as any)}
                    className="bg-navy-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:border-gold-500/50 cursor-pointer"
                  >
                    <option value="recent">Recently Saved</option>
                    <option value="scripture">By Scripture Title</option>
                    <option value="oldest">Oldest First</option>
                  </select>

                  {filteredBookmarks.length > 0 && (
                    <button
                      onClick={() => {
                        if (confirm(`Remove all bookmarks${selectedReligion === 'all' ? '' : ` in ${selectedReligion}`}?`)) {
                          personalLibraryService.clearBookmarks(
                            selectedReligion === 'all' ? undefined : selectedReligion
                          );
                        }
                      }}
                      className="text-red-400 hover:text-red-300 text-xs px-2 py-1.5 rounded-lg hover:bg-red-500/10 transition"
                      title="Clear bookmarks"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Bookmarks List */}
              {filteredBookmarks.length === 0 ? (
                <div className="text-center py-16 bg-navy-950/40 rounded-2xl border border-slate-800 text-slate-500 space-y-2">
                  <Bookmark className="w-10 h-10 mx-auto text-slate-700" />
                  <p className="font-medium text-slate-300 text-sm">No Bookmarks Found</p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {searchQuery
                      ? 'No bookmarks match your search query.'
                      : 'Tap the bookmark icon on any scripture verse, shloka, or section while reading to save it for offline study.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBookmarks.map((bm) => {
                    const relMeta = RELIGIONS_REGISTRY[bm.religion];
                    return (
                      <div
                        key={bm.id}
                        data-testid="bookmark-item"
                        className="p-4 rounded-xl bg-navy-950/70 border border-slate-800 hover:border-slate-700 transition space-y-2 group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                relMeta?.theme?.badgeBg || 'bg-slate-800'
                              } ${relMeta?.theme?.badgeText || 'text-slate-300'}`}
                            >
                              {relMeta?.name || bm.religion}
                            </span>
                            <span className="font-serif text-sm font-bold text-slate-100">
                              {bm.displayTitle}
                            </span>
                          </div>

                          <div className="flex items-center space-x-1.5">
                            <span className="text-[10px] text-slate-500 mr-2">
                              {new Date(bm.timestamp).toLocaleDateString()}
                            </span>
                            <button
                              onClick={() => {
                                onClose();
                                onNavigateToReading(bm.religion, {
                                  collectionId: bm.collectionId,
                                  readingId: bm.readingId,
                                  chapterNumber: bm.chapterNumber,
                                  verseNumber: bm.verseNumber,
                                  translationId: bm.translationId,
                                });
                              }}
                              title="Open original reading"
                              className="px-2.5 py-1 rounded-lg bg-navy-900 border border-gold-500/40 hover:border-gold-400 text-gold-300 hover:text-gold-200 text-xs font-semibold transition flex items-center space-x-1 cursor-pointer"
                            >
                              <span>Open</span>
                              <ExternalLink className="w-3 h-3 text-gold-400" />
                            </button>
                            <button
                              onClick={() => personalLibraryService.removeBookmark(bm.id)}
                              title="Delete bookmark"
                              className="p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {bm.displaySubtitle && (
                          <div className="text-xs text-slate-400 font-medium">
                            {bm.displaySubtitle}
                          </div>
                        )}

                        {/* Original Text Snippet */}
                        {bm.originalTextReference && (
                          <div
                            dir={relMeta?.textDirection || 'ltr'}
                            className="text-xs sm:text-sm text-gold-300 font-serif py-1 italic border-l-2 border-gold-500/30 pl-3 line-clamp-2"
                          >
                            "{bm.originalTextReference}"
                          </div>
                        )}

                        {/* Translated Snippet */}
                        {bm.translationText && (
                          <p className="text-xs text-slate-300 line-clamp-2 pl-3">
                            {bm.translationText}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB C: READING HISTORY
              ========================================================================= */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Showing recent scripture reading visits ({filteredHistory.length})
                </span>
                {filteredHistory.length > 0 && (
                  <button
                    onClick={() => {
                      if (confirm('Clear reading history log?')) {
                        personalLibraryService.clearHistory();
                      }
                    }}
                    className="text-xs text-red-400 hover:text-red-300 flex items-center space-x-1 hover:underline cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Clear History</span>
                  </button>
                )}
              </div>

              {filteredHistory.length === 0 ? (
                <div className="text-center py-16 bg-navy-950/40 rounded-2xl border border-slate-800 text-slate-500 space-y-2">
                  <History className="w-10 h-10 mx-auto text-slate-700" />
                  <p className="font-medium text-slate-300 text-sm">No Reading History</p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    Your reading activity will be automatically recorded here as you explore scriptures across the 7 traditions.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredHistory.map((item) => {
                    const relMeta = RELIGIONS_REGISTRY[item.religion];
                    return (
                      <div
                        key={item.id}
                        data-testid="history-item"
                        className="p-3 rounded-xl bg-navy-950/60 border border-slate-800 hover:border-slate-700 transition flex items-center justify-between gap-3"
                      >
                        <div className="space-y-1 min-w-0">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                relMeta?.theme?.badgeBg || 'bg-slate-800'
                              } ${relMeta?.theme?.badgeText || 'text-slate-300'}`}
                            >
                              {relMeta?.name || item.religion}
                            </span>
                            <span className="text-xs font-bold text-slate-200 truncate">
                              {item.displayTitle}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-400">{item.displayLocation}</div>
                        </div>

                        <div className="flex items-center space-x-3 flex-shrink-0">
                          <span className="text-[10px] text-slate-500 hidden sm:inline">
                            {new Date(item.timestamp).toLocaleString()}
                          </span>
                          <button
                            onClick={() => {
                              onClose();
                              onNavigateToReading(item.religion, {
                                collectionId: item.collectionId,
                                readingId: item.readingId,
                                chapterNumber: item.chapterNumber,
                                verseNumber: item.verseNumber,
                              });
                            }}
                            className="px-2.5 py-1 rounded-lg bg-navy-900 border border-slate-700 hover:border-gold-500/50 text-slate-300 hover:text-gold-300 text-xs font-medium transition flex items-center space-x-1 cursor-pointer"
                          >
                            <span>Revisit</span>
                            <ExternalLink className="w-3 h-3 text-gold-400" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* =========================================================================
              TAB D: READING PROGRESS
              ========================================================================= */}
          {activeTab === 'progress' && (
            <div className="space-y-6">
              <div className="text-xs text-slate-400">
                Track visited and completed chapters across canonical scripture scopes. You can manually mark chapters completed as you progress.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(CANONICAL_SCOPES).map((scopeKey) => {
                  const scope = CANONICAL_SCOPES[scopeKey];
                  if (selectedReligion !== 'all' && selectedReligion !== scope.religion) return null;
                  const rec = allProgress[scopeKey] || personalLibraryService.getProgress(scope.religion, scope.scriptureId);
                  const relMeta = RELIGIONS_REGISTRY[scope.religion];

                  const completedCount = rec.chaptersCompleted?.length || 0;
                  const visitedCount = rec.chaptersVisited?.length || 0;
                  const pct = rec.progressPercentage;

                  return (
                    <div
                      key={scopeKey}
                      data-testid="progress-scope-card"
                      className="p-4 rounded-2xl bg-navy-950/80 border border-slate-800 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            relMeta?.theme?.badgeBg || 'bg-slate-800'
                          } ${relMeta?.theme?.badgeText || 'text-slate-300'}`}
                        >
                          {relMeta?.name || scope.religion}
                        </span>
                        {pct !== null ? (
                          <span className="text-xs font-mono font-bold text-gold-400">
                            {pct}% Completed
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-500 italic">
                            Open Scope
                          </span>
                        )}
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-serif text-sm font-bold text-slate-100">
                          {scope.scopeTitle}
                        </h4>
                        <div className="flex items-center justify-between text-[11px] text-slate-400">
                          <span>
                            Completed: <strong className="text-slate-200">{completedCount}</strong>
                            {scope.totalChaptersKnown && (
                              <span> / {scope.totalChapters}</span>
                            )}
                          </span>
                          <span>
                            Visited: <strong className="text-slate-300">{visitedCount}</strong>
                          </span>
                        </div>
                      </div>

                      {/* Progress Bar (Only when denominator is verified) */}
                      {scope.totalChaptersKnown && scope.totalChapters ? (
                        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-gold-500 to-amber-400 h-full transition-all duration-300"
                            style={{ width: `${Math.min(100, pct || 0)}%` }}
                          />
                        </div>
                      ) : (
                        <div className="text-[10px] text-slate-500 italic bg-slate-900/60 px-2.5 py-1 rounded">
                          Curated tradition collection (total chapter denominator open-ended)
                        </div>
                      )}

                      {/* Quick Chapter Checklist / Trigger */}
                      <ChapterQuickChecklist
                        religion={scope.religion}
                        scriptureId={scope.scriptureId}
                        totalChapters={scope.totalChapters}
                        chaptersCompleted={rec.chaptersCompleted || []}
                        chaptersVisited={rec.chaptersVisited || []}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-3 border-t border-slate-800 bg-navy-950/95 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <div className="flex items-center space-x-2 text-[11px]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            <span>Local-First Guest Storage (IndexedDB + Storage Fallback)</span>
          </div>

          <div className="text-[11px] text-slate-500">
            No registration required • 100% Private to your device
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Chapter Quick Checklist Component
 */
const ChapterQuickChecklist: React.FC<{
  religion: ReligionId;
  scriptureId: string;
  totalChapters: number | null;
  chaptersCompleted: (string | number)[];
  chaptersVisited: (string | number)[];
}> = ({ religion, scriptureId, totalChapters, chaptersCompleted, chaptersVisited }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const completedSet = useMemo(() => new Set(chaptersCompleted), [chaptersCompleted]);
  const visitedSet = useMemo(() => new Set(chaptersVisited), [chaptersVisited]);

  const maxPreview = totalChapters ? Math.min(totalChapters, 20) : chaptersVisited.length;

  if (totalChapters && totalChapters > 100 && !isExpanded) {
    return (
      <div className="pt-2">
        <button
          onClick={() => setIsExpanded(true)}
          className="text-[11px] text-gold-400 hover:text-gold-300 font-medium hover:underline flex items-center space-x-1"
        >
          <span>Manage Chapter Completion Checklist &rarr;</span>
        </button>
      </div>
    );
  }

  return (
    <div className="pt-2 border-t border-slate-800/60 space-y-2">
      <div className="flex items-center justify-between text-[11px]">
        <span className="font-semibold text-slate-300">Chapters / Sections:</span>
        {totalChapters && totalChapters > 20 && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gold-400 hover:underline"
          >
            {isExpanded ? 'Show Less' : `Show All (${totalChapters})`}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto pr-1">
        {Array.from({ length: isExpanded ? totalChapters || 20 : maxPreview }, (_, i) => i + 1).map(
          (chNum) => {
            const isCompleted = completedSet.has(chNum);
            const isVisited = visitedSet.has(chNum);

            return (
              <button
                key={chNum}
                onClick={() =>
                  personalLibraryService.toggleChapterCompleted(
                    religion,
                    scriptureId,
                    chNum,
                    !isCompleted
                  )
                }
                title={`Chapter ${chNum}: ${
                  isCompleted ? 'Completed (Click to Reopen)' : 'Incomplete (Click to Mark Completed)'
                }`}
                className={`px-2 py-0.5 rounded text-[11px] font-mono transition flex items-center space-x-1 cursor-pointer ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                    : isVisited
                    ? 'bg-slate-800 text-slate-300 border border-slate-700'
                    : 'bg-navy-900/60 text-slate-500 border border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <span>{chNum}</span>
                {isCompleted && <Check className="w-2.5 h-2.5 text-emerald-400" />}
              </button>
            );
          }
        )}
      </div>
    </div>
  );
};
