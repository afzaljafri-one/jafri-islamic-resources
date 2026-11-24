/**
 * ============================================================================
 * JAFRI SACRED AUDIO LIBRARY — REQUIREMENT CARD COMPONENT
 * Interactive Liturgical Card for individual sacred requirements
 * ============================================================================
 */

import React from 'react';
import {
  Play,
  Pause,
  Youtube,
  Lock,
  Clock,
  FileText,
  Info,
  CheckCircle2
} from 'lucide-react';
import type { SacredAudioRequirement } from '../../types/sacredAudio';
import { isApprovedPublicYouTubeId } from '../../data/sacredAudioMasterCatalogue';

interface RequirementCardProps {
  requirement: SacredAudioRequirement;
  onPlay: (requirement: SacredAudioRequirement) => void;
  onViewDetails: (requirement: SacredAudioRequirement) => void;
  isCurrentlyPlaying: boolean;
}

export const RequirementCard: React.FC<RequirementCardProps> = ({
  requirement,
  onPlay,
  onViewDetails,
  isCurrentlyPlaying,
}) => {
  const isLocalPlayable = requirement.availability === 'AVAILABLE_VERIFIED' && requirement.isPlayable;
  const isYouTube = requirement.playbackProvider === 'YOUTUBE_EMBED';
  const isApprovedYouTube = isYouTube && isApprovedPublicYouTubeId(requirement.id);
  const isPendingAuditYouTube = isYouTube && !isApprovedYouTube;
  const isBlocked = requirement.availability === 'AWAITING_PERMISSION';
  const isPermissionRequired = requirement.availability === 'SOURCE_AVAILABLE_PERMISSION_REQUIRED';
  const isPending = requirement.availability === 'PENDING_DISCOVERY';
  const isTextCard = requirement.availability === 'TEXT_CARD';

  const getStatusBadge = () => {
    if (isLocalPlayable) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" />
          <span>Direct Audio</span>
        </span>
      );
    }
    if (isApprovedYouTube) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30">
          <Youtube className="w-3 h-3 text-red-400" />
          <span>Video Recitation</span>
        </span>
      );
    }
    if (isPermissionRequired) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/15 text-amber-300 border border-amber-500/30">
          <Lock className="w-3 h-3" />
          <span>Archival Preservation</span>
        </span>
      );
    }
    if (isTextCard) {
      return (
        <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
          <FileText className="w-3 h-3" />
          <span>Sacred Text</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-slate-800 text-slate-400 border border-slate-700">
        <Clock className="w-3 h-3" />
        <span>In Preparation</span>
      </span>
    );
  };

  return (
    <div
      data-testid="requirement-card"
      data-requirement-id={requirement.id}
      className={`rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 border ${
        isCurrentlyPlaying
          ? 'bg-navy-900 border-gold-400 shadow-gold-sm ring-1 ring-gold-400'
          : isLocalPlayable
          ? 'bg-navy-950/90 border-gold-500/30 hover:border-gold-500/60 hover:bg-navy-900/60 shadow-lg'
          : isApprovedYouTube
          ? 'bg-navy-950/80 border-purple-500/30 hover:border-purple-500/60 hover:bg-navy-900/50 shadow-md'
          : isPendingAuditYouTube
          ? 'bg-navy-950/60 border-amber-900/40 opacity-85'
          : isBlocked
          ? 'bg-navy-950/60 border-rose-900/40 opacity-80'
          : isPermissionRequired
          ? 'bg-navy-950/60 border-amber-900/40 opacity-80'
          : isTextCard
          ? 'bg-navy-950/70 border-indigo-500/30'
          : 'bg-navy-950/50 border-slate-800/80'
      }`}
    >
      {/* Top Header Row */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
            <span className="font-mono text-[11px] font-bold text-gold-400">
              {requirement.id}
            </span>
            <span className="text-slate-600">•</span>
            <span className="px-2 py-0.2 rounded-full text-[9px] font-bold uppercase tracking-wider bg-navy-900 text-slate-300 border border-slate-700">
              {requirement.tradition}
            </span>
          </div>
          {getStatusBadge()}
        </div>

        {/* Title */}
        <h3 className="font-serif text-sm font-bold text-slate-100 line-clamp-2 leading-snug mb-2">
          {requirement.requirementTitle}
        </h3>

        {/* Reciter & Script Information */}
        <div className="space-y-1 text-xs text-slate-400 mb-4">
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Performer:</span>
            <span className="font-medium text-slate-300 truncate max-w-[65%] text-right">
              {requirement.rightsEvidence?.performerName || requirement.youtubeMetadata?.channelTitle || (
                <span className="italic text-slate-500">Undiscovered</span>
              )}
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Language / Script:</span>
            <span className="font-mono text-slate-300">
              {requirement.language} ({requirement.scriptCode})
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <button
          onClick={() => onViewDetails(requirement)}
          className="inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs text-slate-300 hover:text-gold-400 hover:bg-navy-900 transition"
          title="View full requirement details and rights provenance"
        >
          <Info className="w-3.5 h-3.5" />
          <span>Details</span>
        </button>

        {isLocalPlayable && (
          <button
            onClick={() => onPlay(requirement)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 hover:from-gold-400 hover:to-gold-300 text-navy-950 font-bold text-xs shadow-gold transition transform hover:scale-105"
            aria-label={isCurrentlyPlaying ? 'Pause' : 'Play'}
          >
            {isCurrentlyPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5 fill-current" />
                <span>Playing</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                <span>Play Audio</span>
              </>
            )}
          </button>
        )}

        {isApprovedYouTube && (
          <button
            onClick={() => onPlay(requirement)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow transition transform hover:scale-105"
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>Watch Video</span>
          </button>
        )}

        {isPendingAuditYouTube && (
          <button
            onClick={() => onViewDetails(requirement)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 text-xs font-medium"
            title="Authentic recitation recording currently in preparation"
          >
            <Clock className="w-3 h-3 text-slate-400" />
            <span>In Preparation</span>
          </button>
        )}

        {isBlocked && (
          <button
            onClick={() => onViewDetails(requirement)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 text-xs font-medium"
            title="Recording currently in preparation"
          >
            <Clock className="w-3 h-3 text-slate-400" />
            <span>In Preparation</span>
          </button>
        )}

        {isPermissionRequired && (
          <button
            onClick={() => onViewDetails(requirement)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-medium"
            title="Hebrew cantillation preserved in archival preservation; licensing permissions in progress"
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span>Archival Info</span>
          </button>
        )}

        {isTextCard && (
          <button
            onClick={() => onViewDetails(requirement)}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 text-xs font-medium"
          >
            <FileText className="w-3 h-3 text-indigo-400" />
            <span>Read Text</span>
          </button>
        )}

        {isPending && (
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 text-[11px] text-slate-500 font-medium">
            <span>In Curation</span>
          </span>
        )}
      </div>
    </div>
  );
};
