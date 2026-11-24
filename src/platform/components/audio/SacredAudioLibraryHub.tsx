/**
 * ============================================================================
 * JAFRI SACRED AUDIO LIBRARY — MAIN LIBRARY HUB
 * Public Multi-Religion Sacred Listening & Viewing Library
 * Supports 7 Sacred Traditions, Search, Recitation & Source Filters, Playback
 * ============================================================================
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Globe,
  Headphones,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Video,
  FileText,
  Filter,
  Volume2
} from 'lucide-react';
import type {
  SacredAudioRequirement,
  TraditionId
} from '../../types/sacredAudio';
import { ISO_15924_REGISTRY } from '../../types/sacredAudio';
import {
  SACRED_AUDIO_MASTER_CATALOGUE,
  isApprovedPublicYouTubeId
} from '../../data/sacredAudioMasterCatalogue';
import {
  TRADITION_COLLECTIONS,
  SUB_COLLECTIONS
} from '../../data/sacredAudioCollections';
import {
  unifiedSacredAudioService,
  SacredAudioPlaybackState
} from '../../services/unifiedSacredAudioService';
import { RequirementCard } from './RequirementCard';
import { RequirementDetailModal } from './RequirementDetailModal';
import { YouTubeEmbedModal } from './YouTubeEmbedModal';
import { SacredAudioPlayerBar } from './SacredAudioPlayerBar';

interface SacredAudioLibraryHubProps {
  onReturnToHome?: () => void;
  initialTradition?: TraditionId | 'all';
}

export type MediaSourceFilter = 'playable' | 'all' | 'audio' | 'video' | 'text';
export type RecitationTypeFilter = 'all' | 'scripture' | 'chant' | 'prayer';

export const SacredAudioLibraryHub: React.FC<SacredAudioLibraryHubProps> = ({
  onReturnToHome,
  initialTradition = 'all',
}) => {
  // Navigation & Filtering States
  const [selectedTradition, setSelectedTradition] = useState<TraditionId | 'all'>(initialTradition);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('all');
  const [mediaSourceFilter, setMediaSourceFilter] = useState<MediaSourceFilter>('playable');
  const [recitationTypeFilter, setRecitationTypeFilter] = useState<RecitationTypeFilter>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 24;

  // Modal States
  const [activeDetailReq, setActiveDetailReq] = useState<SacredAudioRequirement | null>(null);
  const [activeYouTubeReq, setActiveYouTubeReq] = useState<SacredAudioRequirement | null>(null);

  // Playback Service State
  const [playbackState, setPlaybackState] = useState<SacredAudioPlaybackState>(() =>
    unifiedSacredAudioService.getState()
  );

  useEffect(() => {
    const unsubscribe = unifiedSacredAudioService.subscribe((state) => {
      setPlaybackState(state);
      if (state.activeProvider === 'YOUTUBE_EMBED' && state.currentRequirement) {
        setActiveYouTubeReq(state.currentRequirement);
      }
    });
    return unsubscribe;
  }, []);

  // Filter Sub-collections by active tradition
  const availableSubCollections = useMemo(() => {
    if (selectedTradition === 'all') {
      return SUB_COLLECTIONS;
    }
    return SUB_COLLECTIONS.filter((sub) => sub.tradition === selectedTradition);
  }, [selectedTradition]);

  // Reset collection filter and page when tradition changes
  const handleTraditionChange = (trad: TraditionId | 'all') => {
    setSelectedTradition(trad);
    setSelectedCollectionId('all');
    setCurrentPage(1);
  };

  // Filter 651 Master Requirements
  const filteredRequirements = useMemo(() => {
    return SACRED_AUDIO_MASTER_CATALOGUE.filter((req) => {
      const isLocal = req.availability === 'AVAILABLE_VERIFIED' && req.isPlayable;
      const isApprovedYt = req.playbackProvider === 'YOUTUBE_EMBED' && isApprovedPublicYouTubeId(req.id);
      const isPlayable = isLocal || isApprovedYt;

      // 1. Tradition Filter
      if (selectedTradition !== 'all' && req.tradition !== selectedTradition) {
        return false;
      }

      // 2. Collection Filter
      if (selectedCollectionId !== 'all' && req.collectionId !== selectedCollectionId) {
        return false;
      }

      // 3. Media / Source Filter
      if (mediaSourceFilter === 'playable' && !isPlayable) {
        return false;
      }
      if (mediaSourceFilter === 'audio' && !isLocal) {
        return false;
      }
      if (mediaSourceFilter === 'video' && !isApprovedYt) {
        return false;
      }
      if (mediaSourceFilter === 'text' && req.availability !== 'TEXT_CARD') {
        return false;
      }
      // 'all' includes all 651 catalogued items

      // 4. Recitation / Liturgical Genre Filter
      if (recitationTypeFilter !== 'all') {
        const titleLower = req.requirementTitle.toLowerCase();
        const collLower = req.collectionId.toLowerCase();

        if (recitationTypeFilter === 'scripture') {
          const isScripture =
            titleLower.includes('surah') ||
            titleLower.includes('gita') ||
            titleLower.includes('ang') ||
            titleLower.includes('sutta') ||
            titleLower.includes('sutra') ||
            titleLower.includes('psalm') ||
            titleLower.includes('genesis') ||
            titleLower.includes('corinthians') ||
            titleLower.includes('beatitudes') ||
            collLower.includes('gita') ||
            collLower.includes('quran') ||
            collLower.includes('bible') ||
            collLower.includes('tanakh');
          if (!isScripture) return false;
        } else if (recitationTypeFilter === 'chant') {
          const isChant =
            titleLower.includes('mantra') ||
            titleLower.includes('chant') ||
            titleLower.includes('suktam') ||
            titleLower.includes('paritta') ||
            titleLower.includes('jaap') ||
            titleLower.includes('simran') ||
            titleLower.includes('navkar') ||
            titleLower.includes('namokar');
          if (!isChant) return false;
        } else if (recitationTypeFilter === 'prayer') {
          const isPrayer =
            titleLower.includes('adhan') ||
            titleLower.includes('dua') ||
            titleLower.includes('aarti') ||
            titleLower.includes('stotra') ||
            titleLower.includes('bhajan') ||
            titleLower.includes('pater noster') ||
            titleLower.includes('magnificat') ||
            titleLower.includes('credo') ||
            titleLower.includes('shema') ||
            titleLower.includes('ardas') ||
            titleLower.includes('anand sahib');
          if (!isPrayer) return false;
        }
      }

      // 5. Text Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        const matchesId = req.id.toLowerCase().includes(query);
        const matchesTitle = req.requirementTitle.toLowerCase().includes(query);
        const matchesLang = req.language.toLowerCase().includes(query);
        const matchesScript = req.scriptCode.toLowerCase().includes(query);
        const scriptDef = ISO_15924_REGISTRY[req.scriptCode as keyof typeof ISO_15924_REGISTRY];
        const matchesScriptName = scriptDef ? scriptDef.canonicalName.toLowerCase().includes(query) : false;
        const matchesPerformer = req.rightsEvidence?.performerName
          ? req.rightsEvidence.performerName.toLowerCase().includes(query)
          : false;
        const matchesChannel = req.youtubeMetadata?.channelTitle
          ? req.youtubeMetadata.channelTitle.toLowerCase().includes(query)
          : false;

        if (
          !matchesId &&
          !matchesTitle &&
          !matchesLang &&
          !matchesScript &&
          !matchesScriptName &&
          !matchesPerformer &&
          !matchesChannel
        ) {
          return false;
        }
      }

      return true;
    });
  }, [selectedTradition, selectedCollectionId, mediaSourceFilter, recitationTypeFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredRequirements.length / itemsPerPage));
  const paginatedRequirements = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRequirements.slice(start, start + itemsPerPage);
  }, [filteredRequirements, currentPage]);

  // Dynamic counts per tradition for button labels
  const traditionCounts = useMemo(() => {
    const counts: Record<string, { total: number; playable: number; local: number; yt: number }> = {};
    for (const req of SACRED_AUDIO_MASTER_CATALOGUE) {
      if (!counts[req.tradition]) {
        counts[req.tradition] = { total: 0, playable: 0, local: 0, yt: 0 };
      }
      counts[req.tradition].total++;
      const isLocal = req.availability === 'AVAILABLE_VERIFIED' && req.isPlayable;
      const isApprovedYt = req.playbackProvider === 'YOUTUBE_EMBED' && isApprovedPublicYouTubeId(req.id);
      if (isLocal) {
        counts[req.tradition].local++;
        counts[req.tradition].playable++;
      }
      if (isApprovedYt) {
        counts[req.tradition].yt++;
        counts[req.tradition].playable++;
      }
    }
    return counts;
  }, []);

  // Overall Library Metrics
  const libraryMetrics = useMemo(() => {
    let local = 0;
    let yt = 0;
    let text = 0;
    for (const req of SACRED_AUDIO_MASTER_CATALOGUE) {
      if (req.availability === 'AVAILABLE_VERIFIED' && req.isPlayable) local++;
      if (req.playbackProvider === 'YOUTUBE_EMBED' && isApprovedPublicYouTubeId(req.id)) yt++;
      if (req.availability === 'TEXT_CARD') text++;
    }
    return {
      totalCatalogued: SACRED_AUDIO_MASTER_CATALOGUE.length, // 651
      playableTotal: local + yt, // 154
      playableLocal: local, // 14
      playableYouTube: yt, // 140
      textCards: text // 4
    };
  }, []);

  const handlePlayRequirement = async (req: SacredAudioRequirement) => {
    try {
      if (req.playbackProvider === 'YOUTUBE_EMBED') {
        if (!isApprovedPublicYouTubeId(req.id)) {
          console.warn('[SacredAudioLibraryHub] Playback blocked for unverified candidate:', req.id);
          return;
        }
        setActiveYouTubeReq(req);
      }
      await unifiedSacredAudioService.playRequirement(req);
    } catch (err) {
      setActiveYouTubeReq(null);
      console.error('[SacredAudioLibraryHub] Playback error:', err);
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-8 animate-in fade-in-50 duration-200 pb-28">
      {/* =========================================================================
          HERO & VISITOR OVERVIEW
          ========================================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-b from-navy-900 via-navy-900/95 to-navy-950 border border-gold-500/30 p-6 sm:p-10 shadow-2xl overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            {onReturnToHome && (
              <button
                onClick={onReturnToHome}
                className="inline-flex items-center space-x-1.5 text-xs text-gold-400 hover:text-gold-300 font-semibold mb-3 hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Platform Overview</span>
              </button>
            )}

            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Headphones className="w-3.5 h-3.5" />
              <span>Sacred Audio & Video Library • Seven World Traditions</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-wide">
              JAFRI SACRED AUDIO LIBRARY
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gold-400/90 font-serif">
              Authentic Liturgical Recitations, Scriptural Chants & Choral Works across World Traditions
            </p>
          </div>

          <div className="flex items-center space-x-3 self-stretch md:self-auto justify-end">
            <div className="px-4 py-2.5 rounded-2xl bg-navy-950 border border-gold-500/30 text-right">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Available to Listen & Watch
              </div>
              <div className="font-mono text-lg font-bold text-gold-400">
                {libraryMetrics.playableTotal}{' '}
                <span className="text-xs text-slate-300 font-normal">Recordings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Visitor Summary Cards (4 Cards) */}
        <div className="mt-6 pt-6 border-t border-navy-800 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3.5 rounded-2xl bg-navy-950/80 border border-emerald-500/30">
            <div className="flex items-center justify-center space-x-1.5 text-emerald-400 mb-1">
              <Volume2 className="w-3.5 h-3.5" />
              <span className="text-[11px] uppercase tracking-wider font-bold">Direct Audio</span>
            </div>
            <div className="font-mono text-xl font-bold text-slate-100">
              {libraryMetrics.playableLocal}
            </div>
            <div className="text-[10px] text-slate-400">High-Fidelity HTML5 Audio</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-navy-950/80 border border-purple-500/30">
            <div className="flex items-center justify-center space-x-1.5 text-purple-300 mb-1">
              <Video className="w-3.5 h-3.5" />
              <span className="text-[11px] uppercase tracking-wider font-bold">Video Recitations</span>
            </div>
            <div className="font-mono text-xl font-bold text-slate-100">
              {libraryMetrics.playableYouTube}
            </div>
            <div className="text-[10px] text-slate-400">Official Video Embeds</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-navy-950/80 border border-gold-500/30">
            <div className="flex items-center justify-center space-x-1.5 text-gold-400 mb-1">
              <Globe className="w-3.5 h-3.5" />
              <span className="text-[11px] uppercase tracking-wider font-bold">World Traditions</span>
            </div>
            <div className="font-mono text-xl font-bold text-gold-400">7</div>
            <div className="text-[10px] text-slate-400">Authentic Sacred Canons</div>
          </div>

          <div className="p-3.5 rounded-2xl bg-navy-950/80 border border-slate-700">
            <div className="flex items-center justify-center space-x-1.5 text-slate-400 mb-1">
              <FileText className="w-3.5 h-3.5" />
              <span className="text-[11px] uppercase tracking-wider font-bold">Total Corpus</span>
            </div>
            <div className="font-mono text-xl font-bold text-slate-200">
              {libraryMetrics.totalCatalogued}
            </div>
            <div className="text-[10px] text-slate-400">Catalogued Sacred Works</div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TRADITION PORTALS SELECTOR (7 World Traditions)
          ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <Globe className="w-4 h-4 text-gold-400" />
            <span>Select Sacred Tradition</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {selectedTradition === 'all'
              ? `All Traditions (${libraryMetrics.playableTotal} Playable)`
              : `${selectedTradition.toUpperCase()} (${traditionCounts[selectedTradition]?.playable || 0} Playable)`}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {/* All Traditions Option */}
          <button
            onClick={() => handleTraditionChange('all')}
            className={`p-3 rounded-2xl text-left border transition-all ${
              selectedTradition === 'all'
                ? 'bg-gold-500 text-navy-950 border-gold-400 font-bold shadow-gold-sm'
                : 'bg-navy-950 border-slate-800 text-slate-300 hover:border-gold-500/40 hover:bg-navy-900'
            }`}
          >
            <div className="text-xs font-bold">All Traditions</div>
            <div className={`text-[10px] ${selectedTradition === 'all' ? 'text-navy-900' : 'text-slate-400'}`}>
              {libraryMetrics.playableTotal} Playable
            </div>
          </button>

          {/* 7 Tradition Buttons */}
          {TRADITION_COLLECTIONS.map((trad) => {
            const isSelected = selectedTradition === trad.id;
            const counts = traditionCounts[trad.id] || { total: 0, playable: 0, local: 0, yt: 0 };

            return (
              <button
                key={trad.id}
                onClick={() => handleTraditionChange(trad.id)}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 border-gold-400 font-bold shadow-gold-sm'
                    : 'bg-navy-950 border-slate-800 text-slate-300 hover:border-gold-500/40 hover:bg-navy-900'
                }`}
              >
                <div className="text-xs font-bold truncate">{trad.title}</div>
                <div className={`text-[10px] ${isSelected ? 'text-navy-900' : 'text-slate-400'}`}>
                  {counts.playable} Playable
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SEARCH, MEDIA SOURCE & LITURGICAL FILTERS
          ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-3xl bg-navy-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Instant Search Bar */}
          <div className="relative w-full md:w-1/2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, reciter, channel, tradition, scripture or language..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-navy-950 border border-slate-700 text-slate-100 placeholder-slate-500 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sub-Collection Selector */}
          <div className="flex items-center space-x-2 w-full md:w-auto">
            <span className="text-xs text-slate-400 whitespace-nowrap hidden sm:inline">Collection:</span>
            <select
              value={selectedCollectionId}
              onChange={(e) => {
                setSelectedCollectionId(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full md:w-64 px-3 py-2 rounded-xl bg-navy-950 border border-slate-700 text-slate-200 text-xs focus:outline-none focus:ring-1 focus:ring-gold-500 cursor-pointer"
            >
              <option value="all">All Sub-Collections ({availableSubCollections.length})</option>
              {availableSubCollections.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  {sc.title} ({sc.requirementIds.length})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Filter Rows: Media Source & Recitation Type */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-800">
          {/* Media / Source Filter Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] text-slate-500 font-semibold mr-1 uppercase flex items-center gap-1">
              <Filter className="w-3 h-3" />
              <span>Media:</span>
            </span>
            {[
              { id: 'playable', label: `Available to Listen / Watch (${libraryMetrics.playableTotal})` },
              { id: 'audio', label: `Direct Audio (${libraryMetrics.playableLocal})` },
              { id: 'video', label: `Video Recitations (${libraryMetrics.playableYouTube})` },
              { id: 'text', label: `Sacred Texts (${libraryMetrics.textCards})` },
              { id: 'all', label: `All Catalogued (${libraryMetrics.totalCatalogued})` },
            ].map((pill) => (
              <button
                key={pill.id}
                onClick={() => {
                  setMediaSourceFilter(pill.id as MediaSourceFilter);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                  mediaSourceFilter === pill.id
                    ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                    : 'bg-navy-950 text-slate-300 hover:bg-navy-800 border border-slate-800'
                }`}
              >
                {pill.label}
              </button>
            ))}
          </div>

          {/* Liturgical Genre Filter */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
            <span className="text-[11px] text-slate-500 font-semibold mr-1 uppercase">Genre:</span>
            {[
              { id: 'all', label: 'All Genres' },
              { id: 'scripture', label: 'Scripture' },
              { id: 'chant', label: 'Chants & Mantras' },
              { id: 'prayer', label: 'Prayers & Liturgy' },
            ].map((genre) => (
              <button
                key={genre.id}
                onClick={() => {
                  setRecitationTypeFilter(genre.id as RecitationTypeFilter);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-medium whitespace-nowrap transition ${
                  recitationTypeFilter === genre.id
                    ? 'bg-slate-200 text-navy-950 font-bold'
                    : 'bg-navy-950 text-slate-400 hover:text-slate-200 border border-slate-800'
                }`}
              >
                {genre.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          SACRED REQUIREMENTS GRID
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing{' '}
            <span className="font-bold text-slate-100">{filteredRequirements.length}</span>{' '}
            sacred liturgical works
            {mediaSourceFilter === 'playable' && (
              <span className="text-emerald-400 font-medium ml-1.5">
                • All ready to play & watch
              </span>
            )}
          </div>
          {totalPages > 1 && (
            <div>
              Page <span className="font-bold text-slate-100">{currentPage}</span> of{' '}
              <span className="font-bold text-slate-100">{totalPages}</span>
            </div>
          )}
        </div>

        {filteredRequirements.length === 0 ? (
          <div className="p-12 text-center rounded-3xl bg-navy-950/60 border border-slate-800 space-y-3">
            <Search className="w-10 h-10 text-slate-600 mx-auto" />
            <h3 className="font-serif text-base font-bold text-slate-300">
              No matching sacred works found
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your search query, clearing filters, or switching tradition portals.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {paginatedRequirements.map((req) => (
              <RequirementCard
                key={req.id}
                requirement={req}
                onPlay={handlePlayRequirement}
                onViewDetails={(r) => setActiveDetailReq(r)}
                isCurrentlyPlaying={
                  playbackState.status === 'PLAYING' &&
                  playbackState.currentRequirement?.id === req.id
                }
              />
            ))}
          </div>
        )}

        {/* Pagination Bar */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 pt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-navy-900 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-navy-800 transition"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs text-slate-400 px-3">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-navy-900 border border-slate-700 text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-navy-800 transition"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODALS & STICKY AUDIO PLAYER BAR
          ========================================================================= */}
      <RequirementDetailModal
        isOpen={!!activeDetailReq}
        requirement={activeDetailReq}
        onClose={() => setActiveDetailReq(null)}
        onPlay={handlePlayRequirement}
      />

      <YouTubeEmbedModal
        isOpen={!!activeYouTubeReq}
        requirement={activeYouTubeReq}
        onClose={() => setActiveYouTubeReq(null)}
      />

      <SacredAudioPlayerBar />
    </div>
  );
};
