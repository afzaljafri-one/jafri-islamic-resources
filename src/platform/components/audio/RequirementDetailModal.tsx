/**
 * ============================================================================
 * JAFRI SACRED AUDIO LIBRARY — REQUIREMENT DETAIL MODAL
 * Comprehensive Transparency & Provenance Viewer for all 651 Requirements
 * ============================================================================
 */

import React, { useEffect } from 'react';
import {
  X,
  Play,
  Youtube,
  ShieldAlert,
  ShieldCheck,
  FileText,
  Clock,
  BookOpen,
  Tag,
  Lock
} from 'lucide-react';
import type { SacredAudioRequirement } from '../../types/sacredAudio';
import { ISO_15924_REGISTRY } from '../../types/sacredAudio';
import { isApprovedPublicYouTubeId } from '../../data/sacredAudioMasterCatalogue';

interface RequirementDetailModalProps {
  isOpen: boolean;
  requirement: SacredAudioRequirement | null;
  onClose: () => void;
  onPlay: (requirement: SacredAudioRequirement) => void;
}

export const RequirementDetailModal: React.FC<RequirementDetailModalProps> = ({
  isOpen,
  requirement,
  onClose,
  onPlay,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !requirement) {
    return null;
  }

  const isoEntry = ISO_15924_REGISTRY[requirement.scriptCode as keyof typeof ISO_15924_REGISTRY];
  const isApprovedYouTube = requirement.playbackProvider === 'YOUTUBE_EMBED' && isApprovedPublicYouTubeId(requirement.id);

  const getStatusBadge = () => {
    switch (requirement.availability) {
      case 'AVAILABLE_VERIFIED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>DIRECT AUDIO RECORDING (HIGH FIDELITY HTML5)</span>
          </span>
        );
      case 'AWAITING_APP_INTEGRATION':
        if (isApprovedYouTube) {
          return (
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 flex items-center space-x-1.5">
              <Youtube className="w-3.5 h-3.5 text-red-400" />
              <span>OFFICIAL VIDEO RECITATION (OFFICIAL EMBED)</span>
            </span>
          );
        }
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>RECORDING IN PREPARATION</span>
          </span>
        );
      case 'AWAITING_PERMISSION':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>RECORDING IN PREPARATION (RIGHTS REVIEW)</span>
          </span>
        );
      case 'SOURCE_AVAILABLE_PERMISSION_REQUIRED':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center space-x-1.5">
            <Lock className="w-3.5 h-3.5" />
            <span>ARCHIVAL PRESERVATION (INSTITUTIONAL PERMISSIONS IN PROGRESS)</span>
          </span>
        );
      case 'PENDING_DISCOVERY':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-400 border border-slate-700 flex items-center space-x-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>SACRED WORK PRESERVED (AUDIO IN CURATION)</span>
          </span>
        );
      case 'TEXT_CARD':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 flex items-center space-x-1.5">
            <FileText className="w-3.5 h-3.5" />
            <span>SACRED REFERENCE TEXT (LITURGICAL READING)</span>
          </span>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-modal-title"
    >
      <div
        className="relative w-full max-w-2xl bg-navy-950 border border-gold-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-start justify-between p-5 sm:p-6 bg-gradient-to-r from-navy-900 to-navy-950 border-b border-gold-500/20">
          <div className="space-y-1.5 pr-4">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="font-mono text-xs font-bold text-gold-400 px-2 py-0.5 rounded bg-navy-950 border border-gold-500/30">
                {requirement.id}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-gold-500/10 text-gold-300 border border-gold-500/20">
                {requirement.tradition}
              </span>
              <span className="text-xs text-slate-400">
                Collection: <span className="text-slate-300 font-mono">{requirement.collectionId}</span>
              </span>
            </div>
            <h2
              id="detail-modal-title"
              className="font-serif text-lg sm:text-xl font-bold text-slate-100"
            >
              {requirement.requirementTitle}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-navy-800 transition flex-shrink-0"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-navy-900/90 border border-slate-800">
            <div>
              <div className="text-[11px] text-slate-400 mb-1">Media Availability:</div>
              {getStatusBadge()}
            </div>
            {requirement.isPlayable && (
              <button
                onClick={() => {
                  onPlay(requirement);
                  onClose();
                }}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 font-bold shadow-gold hover:from-gold-400 hover:to-gold-300 transition"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Audio Recording</span>
              </button>
            )}
            {requirement.availability === 'AWAITING_APP_INTEGRATION' && isApprovedYouTube && (
              <button
                onClick={() => {
                  onPlay(requirement);
                  onClose();
                }}
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold shadow transition"
              >
                <Youtube className="w-4 h-4" />
                <span>Watch Video Recitation</span>
              </button>
            )}
            {requirement.availability === 'AWAITING_APP_INTEGRATION' && !isApprovedYouTube && (
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 font-medium text-xs">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Recording in Preparation</span>
              </div>
            )}
            {requirement.availability === 'SOURCE_AVAILABLE_PERMISSION_REQUIRED' && (
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-amber-950/60 border border-amber-500/40 text-amber-300 font-medium text-xs">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Archival Recording (Permissions in Progress)</span>
              </div>
            )}
            {requirement.availability === 'AWAITING_PERMISSION' && (
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 font-medium text-xs">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Recording in Preparation</span>
              </div>
            )}
            {requirement.availability === 'PENDING_DISCOVERY' && (
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 font-medium text-xs">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Liturgical Work Catalogued</span>
              </div>
            )}
            {requirement.availability === 'TEXT_CARD' && (
              <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-indigo-950/60 border border-indigo-500/40 text-indigo-300 font-medium text-xs">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span>Liturgical Reading Available</span>
              </div>
            )}
          </div>

          {/* Linguistic & Script Metadata */}
          <div className="space-y-3">
            <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center space-x-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Language & ISO 15924 Script Code</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-navy-900 border border-slate-800">
                <span className="text-slate-400 text-[11px]">Primary Language:</span>
                <p className="font-semibold text-slate-200 mt-0.5">{requirement.language}</p>
              </div>
              <div className="p-3 rounded-xl bg-navy-900 border border-slate-800">
                <span className="text-slate-400 text-[11px]">ISO 15924 Code & Numeric:</span>
                <p className="font-semibold text-slate-200 mt-0.5">
                  <span className="font-mono text-gold-400">{requirement.scriptCode}</span>
                  {isoEntry ? ` (${isoEntry.numericCode}) — ${isoEntry.canonicalName}` : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Performer & Source Metadata */}
          <div className="space-y-3">
            <h3 className="font-serif text-xs font-bold uppercase tracking-wider text-gold-400 flex items-center space-x-1.5">
              <Tag className="w-3.5 h-3.5" />
              <span>Performer, Reciter & Provenance</span>
            </h3>
            <div className="p-3.5 rounded-xl bg-navy-900 border border-slate-800 space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Reciter / Performer:</span>
                <span className="font-semibold text-slate-200">
                  {requirement.rightsEvidence?.performerName || requirement.youtubeMetadata?.channelTitle || 'Awaiting Discovery / Unassigned'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Rights Classification:</span>
                <span className="font-mono text-gold-300">{requirement.rightsClassification}</span>
              </div>
              {requirement.rightsEvidence && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Licence Type:</span>
                    <span className="font-semibold text-emerald-400">
                      {requirement.rightsEvidence.exactLicense}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Rights Holder:</span>
                    <span className="text-slate-300">{requirement.rightsEvidence.rightsHolder}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800">
                    <strong>Attribution:</strong> {requirement.rightsEvidence.performerAttribution || 'N/A'}
                  </div>
                </>
              )}
              {requirement.youtubeMetadata && (
                <>
                  <div className="flex justify-between">
                    <span className="text-slate-400">YouTube Channel:</span>
                    <span className="font-semibold text-gold-400">
                      {requirement.youtubeMetadata.channelTitle}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Video ID:</span>
                    <span className="font-mono text-slate-300">
                      {requirement.youtubeMetadata.videoId}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Blocked Rights Notice (for LibriVox) */}
          {requirement.availability === 'AWAITING_PERMISSION' && (
            <div data-testid="blocked-rights-notice" className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-rose-200">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Statutory Neighboring Rights Restriction</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                The physical recording ({requirement.physicalAsset?.filePath}) is preserved on disk but blocked from web streaming. LibriVox recordings lack an explicit CC0 dedication or foreign civil-law neighboring rights waiver. In accordance with Jafri Project Legal Policy, playback is strictly disabled until formal bilateral clearance is secured.
              </p>
            </div>
          )}

          {/* Permission Required Notice (for Mechon Mamre) */}
          {requirement.availability === 'SOURCE_AVAILABLE_PERMISSION_REQUIRED' && (
            <div data-testid="permission-required-notice" className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-300 space-y-2">
              <div className="flex items-center space-x-2 font-bold text-amber-200">
                <Lock className="w-4 h-4 text-amber-400" />
                <span>Written Streaming Permission Required (Mechon Mamre)</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Source recordings identified (Cantor Shmuel Ofen via Mechon Mamre) for personal study. However, under the Jafri Permanent Audio Copyright Policy, online streaming in this application strictly requires bilateral written authorization from Mechon Mamre. All audio URLs remain disabled and playback is strictly blocked.
              </p>
            </div>
          )}

          {/* Human Review Attestation */}
          {requirement.reviewEvidence && (
            <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 space-y-1.5">
              <div className="flex items-center space-x-1.5 font-bold text-emerald-200">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Human Review Acceptance Record</span>
              </div>
              <p className="text-[11px]">
                <strong>Decision:</strong> {requirement.reviewEvidence.decision} •{' '}
                <strong>Attestation:</strong> {requirement.reviewEvidence.attestation}
              </p>
              <p className="text-[11px] text-slate-400">
                {requirement.reviewEvidence.notes}
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-navy-900 border-t border-gold-500/20 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-navy-800 hover:bg-navy-700 text-slate-200 font-semibold text-xs transition"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
