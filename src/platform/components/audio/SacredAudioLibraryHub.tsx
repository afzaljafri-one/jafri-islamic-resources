/**
 * ============================================================================
 * JAFRI SACRED AUDIO LIBRARY — MAIN LIBRARY HUB
 * Stage Gate 5.4C: Complete Library Interface for all 651 Master Requirements
 * Supports 7 Sacred Traditions, 47 Sub-Collections, Filtering, Search & Playback
 * ============================================================================
 */

import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Globe,
  Headphones,
  ChevronLeft,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import type {
  SacredAudioRequirement,
  TraditionId
} from '../../types/sacredAudio';
import { ISO_15924_REGISTRY } from '../../types/sacredAudio';
import {
  SACRED_AUDIO_MASTER_CATALOGUE,
  getPlayableRequirements,
  getBlockedRequirements,
  getAwaitingIntegrationRequirements,
  getSourceAvailablePermissionRequiredRequirements,
  getPendingDiscoveryRequirements,
  getTextCardRequirements,
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

export const SacredAudioLibraryHub: React.FC<SacredAudioLibraryHubProps> = ({
  onReturnToHome,
  initialTradition = 'all',
}) => {
  // Navigation & Filtering States
  const [selectedTradition, setSelectedTradition] = useState<TraditionId | 'all'>(initialTradition);
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
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
      // 1. Tradition Filter
      if (selectedTradition !== 'all' && req.tradition !== selectedTradition) {
        return false;
      }

      // 2. Collection Filter
      if (selectedCollectionId !== 'all' && req.collectionId !== selectedCollectionId) {
        return false;
      }

      // 3. Availability Filter
      if (availabilityFilter !== 'all') {
        if (availabilityFilter === 'playable' && (!req.isPlayable || req.availability !== 'AVAILABLE_VERIFIED')) {
          return false;
        }
        if (availabilityFilter === 'youtube' && req.availability !== 'AWAITING_APP_INTEGRATION') {
          return false;
        }
        if (availabilityFilter === 'blocked' && req.availability !== 'AWAITING_PERMISSION') {
          return false;
        }
        if (availabilityFilter === 'permission' && req.availability !== 'SOURCE_AVAILABLE_PERMISSION_REQUIRED') {
          return false;
        }
        if (availabilityFilter === 'pending' && req.availability !== 'PENDING_DISCOVERY') {
          return false;
        }
        if (availabilityFilter === 'text' && req.availability !== 'TEXT_CARD') {
          return false;
        }
      }

      // 4. Text Search Query
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
  }, [selectedTradition, selectedCollectionId, availabilityFilter, searchQuery]);

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(filteredRequirements.length / itemsPerPage));
  const paginatedRequirements = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredRequirements.slice(start, start + itemsPerPage);
  }, [filteredRequirements, currentPage]);

  // Computed dynamic tradition counts for accurate button labels
  const traditionCounts = useMemo(() => {
    const counts: Record<string, { local: number; yt: number }> = {};
    for (const req of SACRED_AUDIO_MASTER_CATALOGUE) {
      if (!counts[req.tradition]) counts[req.tradition] = { local: 0, yt: 0 };
      if (req.availability === 'AVAILABLE_VERIFIED' && req.isPlayable) {
        counts[req.tradition].local++;
      }
      if (req.playbackProvider === 'YOUTUBE_EMBED' && isApprovedPublicYouTubeId(req.id)) {
        counts[req.tradition].yt++;
      }
    }
    return counts;
  }, []);

  // Overall Library Metrics
  const metrics = useMemo(() => {
    return {
      total: SACRED_AUDIO_MASTER_CATALOGUE.length, // 651
      playableLocal: getPlayableRequirements().length, // 9
      youtubeAccepted: getAwaitingIntegrationRequirements().length, // 28
      blockedLocal: getBlockedRequirements().length, // 2
      permissionRequired: getSourceAvailablePermissionRequiredRequirements().length, // 24
      pendingDiscovery: getPendingDiscoveryRequirements().length, // 584
      textCards: getTextCardRequirements().length, // 4
      combinedCleared: getPlayableRequirements().length + getAwaitingIntegrationRequirements().length // 37
    };
  }, []);

  const handlePlayRequirement = async (req: SacredAudioRequirement) => {
    try {
      if (req.playbackProvider === 'YOUTUBE_EMBED') {
        setActiveYouTubeReq(req);
      }
      await unifiedSacredAudioService.playRequirement(req);
    } catch (err) {
      console.error('[SacredAudioLibraryHub] Playback error:', err);
    }
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-8 animate-in fade-in-50 duration-200 pb-28">
      {/* =========================================================================
          HERO & HEADER BANNER
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
              <span>Full Liturgical Architecture • 651 Master Requirements</span>
            </div>

            <h1 className="font-serif text-2xl sm:text-4xl font-extrabold text-slate-100 tracking-wide">
              JAFRI SACRED AUDIO LIBRARY
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-gold-400/90 font-serif">
              Authentic Liturgical Recitations, Scriptural Cantillations & Sacred Texts across Seven World Traditions
            </p>
          </div>

          <div className="flex items-center space-x-3 self-stretch md:self-auto justify-end">
            <div className="px-4 py-2.5 rounded-2xl bg-navy-950 border border-gold-500/30 text-right">
              <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Authoritative Master Register
              </div>
              <div className="font-mono text-lg font-bold text-gold-400">
                651 <span className="text-xs text-slate-300 font-normal">Requirements</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Counts Overview Bar */}
        <div className="mt-6 pt-6 border-t border-navy-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2.5 text-center">
          <div className="p-3 rounded-2xl bg-navy-950/80 border border-emerald-500/30">
            <div className="text-[10px] uppercase tracking-wider font-bold text-emerald-400">
              Playable Now (Local)
            </div>
            <div className="font-mono text-xl font-bold text-slate-100 mt-0.5">
              {metrics.playableLocal}
            </div>
            <div className="text-[10px] text-slate-500">Rights Cleared (HTML5)</div>
          </div>

          <div className="p-3 rounded-2xl bg-navy-950/80 border border-purple-500/30">
            <div className="text-[10px] uppercase tracking-wider font-bold text-purple-300">
              YouTube Streams
            </div>
            <div className="font-mono text-xl font-bold text-slate-100 mt-0.5">
              {metrics.youtubeAccepted}
            </div>
            <div className="text-[10px] text-slate-500">28 Approved • 112 Pending</div>
          </div>

          <div className="p-3 rounded-2xl bg-navy-950/80 border border-rose-500/30">
            <div className="text-[10px] uppercase tracking-wider font-bold text-rose-400">
              Rights Blocked
            </div>
            <div className="font-mono text-xl font-bold text-slate-100 mt-0.5">
              {metrics.blockedLocal}
            </div>
            <div className="text-[10px] text-slate-500">LibriVox Preserved on Disk</div>
          </div>

          <div className="p-3 rounded-2xl bg-navy-950/80 border border-amber-500/30">
            <div className="text-[10px] uppercase tracking-wider font-bold text-amber-400">
              Permission Required
            </div>
            <div className="font-mono text-xl font-bold text-slate-100 mt-0.5">
              {metrics.permissionRequired}
            </div>
            <div className="text-[10px] text-slate-500">Mechon Mamre Tanakh</div>
          </div>

          <div className="p-3 rounded-2xl bg-navy-950/80 border border-slate-700">
            <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">
              Pending Discovery
            </div>
            <div className="font-mono text-xl font-bold text-slate-100 mt-0.5">
              {metrics.pendingDiscovery}
            </div>
            <div className="text-[10px] text-slate-500">Awaiting Discovery</div>
          </div>

          <div className="p-3 rounded-2xl bg-navy-950/80 border border-indigo-500/30">
            <div className="text-[10px] uppercase tracking-wider font-bold text-indigo-300">
              Text Cards
            </div>
            <div className="font-mono text-xl font-bold text-slate-100 mt-0.5">
              {metrics.textCards}
            </div>
            <div className="text-[10px] text-slate-500">Non-Audio Reference</div>
          </div>

          <div className="p-3 rounded-2xl bg-navy-950/80 border border-gold-500/30">
            <div className="text-[10px] uppercase tracking-wider font-bold text-gold-400">
              Total Requirements
            </div>
            <div className="font-mono text-xl font-bold text-gold-400 mt-0.5">
              {metrics.total}
            </div>
            <div className="text-[10px] text-slate-500">7 Sacred Traditions</div>
          </div>
        </div>
      </div>

      {/* =========================================================================
          TRADITION PORTALS SELECTOR (7 Portals)
          ========================================================================= */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-serif text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center space-x-1.5">
            <Globe className="w-4 h-4 text-gold-400" />
            <span>Select Sacred Tradition Portal</span>
          </h2>
          <span className="text-xs text-slate-500 font-mono">
            {selectedTradition === 'all' ? 'All 7 Traditions' : selectedTradition.toUpperCase()}
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
            <div className={`text-[10px] ${selectedTradition === 'all' ? 'text-navy-900' : 'text-slate-500'}`}>
              651 Items
            </div>
          </button>

          {/* 7 Tradition Buttons */}
          {TRADITION_COLLECTIONS.map((trad) => {
            const isSelected = selectedTradition === trad.id;
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
                <div className={`text-[10px] ${isSelected ? 'text-navy-900' : 'text-slate-500'}`}>
                  {trad.totalRequirements} Reqs
                  {(traditionCounts[trad.id]?.local || 0) > 0 && ` • ${traditionCounts[trad.id].local} Local`}
                  {(traditionCounts[trad.id]?.yt || 0) > 0 && ` • ${traditionCounts[trad.id].yt} YT`}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          SEARCH & MULTI-CRITERIA FILTERS BAR
          ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-3xl bg-navy-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Instant Search Bar */}
          <div className="relative w-full md:w-1/2">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, ID, reciter, channel, language or script..."
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

        {/* Availability Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-800 text-xs">
          <span className="text-[11px] text-slate-500 font-semibold mr-1 uppercase">Filter:</span>
          {[
            { id: 'all', label: 'All Items' },
            { id: 'playable', label: `Local Audio (${metrics.playableLocal})` },
            { id: 'youtube', label: `YouTube Streams (${metrics.youtubeAccepted})` },
            { id: 'blocked', label: `Rights Blocked (${metrics.blockedLocal})` },
            { id: 'permission', label: `Permission Required (${metrics.permissionRequired})` },
            { id: 'pending', label: `Pending Discovery (${metrics.pendingDiscovery})` },
            { id: 'text', label: `Text Cards (${metrics.textCards})` },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => {
                setAvailabilityFilter(pill.id);
                setCurrentPage(1);
              }}
              className={`px-3 py-1 rounded-xl text-xs font-medium whitespace-nowrap transition ${
                availabilityFilter === pill.id
                  ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                  : 'bg-navy-950 text-slate-300 hover:bg-navy-800 border border-slate-800'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* =========================================================================
          REQUIREMENTS RESULTS LIST / GRID
          ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <div>
            Showing{' '}
            <span className="font-bold text-slate-100">{filteredRequirements.length}</span>{' '}
            of <span className="font-mono text-gold-400">651</span> sacred requirements
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
              No matching sacred requirements found
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Try adjusting your search keywords, clearing your filters, or switching tradition portals.
            </p>
            <button
              onClick={() => {
                setSelectedTradition('all');
                setSelectedCollectionId('all');
                setAvailabilityFilter('all');
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="px-4 py-2 rounded-xl bg-navy-900 border border-gold-500/30 text-gold-400 text-xs font-semibold hover:bg-navy-800 transition"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedRequirements.map((req) => (
              <RequirementCard
                key={req.id}
                requirement={req}
                onPlay={handlePlayRequirement}
                onViewDetails={(r) => setActiveDetailReq(r)}
                isCurrentlyPlaying={
                  playbackState.currentRequirement?.id === req.id &&
                  playbackState.status === 'PLAYING'
                }
              />
            ))}
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center space-x-2 pt-6">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-300 hover:text-gold-400 disabled:opacity-40 disabled:hover:text-slate-300 transition"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="px-4 py-1.5 rounded-xl bg-navy-950 border border-slate-800 text-xs font-mono text-slate-300">
              {currentPage} / {totalPages}
            </span>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-navy-950 border border-slate-800 text-slate-300 hover:text-gold-400 disabled:opacity-40 disabled:hover:text-slate-300 transition"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          MODALS & PLAYERS
          ========================================================================= */}
      <RequirementDetailModal
        isOpen={activeDetailReq !== null}
        requirement={activeDetailReq}
        onClose={() => setActiveDetailReq(null)}
        onPlay={handlePlayRequirement}
      />

      <YouTubeEmbedModal
        isOpen={activeYouTubeReq !== null}
        requirement={activeYouTubeReq}
        onClose={() => {
          setActiveYouTubeReq(null);
          unifiedSacredAudioService.stop();
        }}
      />

      {/* Local HTML5 Player Bar (Bottom) */}
      <SacredAudioPlayerBar />
    </div>
  );
};
