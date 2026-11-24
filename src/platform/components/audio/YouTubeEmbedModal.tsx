/**
 * ============================================================================
 * JAFRI SACRED AUDIO LIBRARY — YOUTUBE EMBED PLAYER MODAL
 * Stage Gate 5.4D: Official YouTube Embedded Player Integration
 * Strictly preserves channel attribution, controls, branding and ads.
 * Zero downloading, stream extraction, proxying or rehosting.
 * ============================================================================
 */

import React, { useEffect, useState } from 'react';
import { X, ExternalLink, ShieldCheck, AlertCircle, Info, Youtube } from 'lucide-react';
import type { SacredAudioRequirement } from '../../types/sacredAudio';
import { isSafeYouTubeEmbedUrl } from '../../services/unifiedSacredAudioService';

interface YouTubeEmbedModalProps {
  isOpen: boolean;
  requirement: SacredAudioRequirement | null;
  onClose: () => void;
}

export const YouTubeEmbedModal: React.FC<YouTubeEmbedModalProps> = ({
  isOpen,
  requirement,
  onClose,
}) => {
  const [hasEmbedError, setHasEmbedError] = useState(false);

  useEffect(() => {
    setHasEmbedError(false);
  }, [requirement]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !requirement || !requirement.youtubeMetadata?.videoId) {
    return null;
  }

  const { watchUrl, embedUrl, channelTitle } = requirement.youtubeMetadata;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="youtube-player-title"
    >
      <div
        className="relative w-full max-w-4xl bg-navy-950 border border-gold-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-navy-900 to-navy-950 border-b border-gold-500/20">
          <div className="flex items-center space-x-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center flex-shrink-0">
              <Youtube className="w-4 h-4 text-red-400" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center space-x-2">
                <span className="font-mono text-xs font-bold text-gold-400">
                  {requirement.id}
                </span>
                <span className="text-slate-500">•</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-500/15 text-purple-300 border border-purple-500/30">
                  {requirement.tradition}
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  Human Review PASS
                </span>
              </div>
              <h2
                id="youtube-player-title"
                className="font-serif text-sm sm:text-base font-bold text-slate-100 truncate mt-0.5"
              >
                {requirement.requirementTitle}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0 ml-3">
            <a
              href={watchUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-navy-900 border border-slate-700 text-xs text-slate-300 hover:text-gold-400 hover:border-gold-500/40 transition"
              title="Open video on YouTube"
            >
              <span>Watch on YouTube</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-navy-800 transition"
              aria-label="Close player"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Frame Container (Responsive 16:9 Aspect Ratio) */}
        <div className="relative w-full aspect-video bg-black flex items-center justify-center">
          {hasEmbedError || !isSafeYouTubeEmbedUrl(embedUrl) ? (
            <div className="p-6 text-center space-y-3 max-w-md">
              <AlertCircle className="w-10 h-10 text-amber-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-200">
                YouTube Player Restricted or Unavailable
              </h3>
              <p className="text-xs text-slate-400">
                This recording could not be embedded directly in your current browser session. You can watch the authentic recitation directly on the official channel.
              </p>
              <a
                href={watchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow transition"
              >
                <Youtube className="w-4 h-4" />
                <span>Open in Official YouTube</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          ) : (
            <iframe
              id="youtube-embed-iframe"
              src={`${embedUrl}?autoplay=1&enablejsapi=1&rel=0&origin=${typeof window !== 'undefined' ? window.location.origin : ''}`}
              title={requirement.requirementTitle}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={() => setHasEmbedError(true)}
            />
          )}
        </div>

        {/* Attribution & Legal Compliance Footer */}
        <div className="p-4 sm:p-5 bg-navy-900/90 border-t border-gold-500/20 text-xs space-y-2.5 overflow-y-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2 flex-wrap gap-y-1">
              <span className="text-slate-400">Channel / Artist:</span>
              <span className="font-semibold text-gold-400">{channelTitle}</span>
              {requirement.rightsEvidence?.performerName && (
                <>
                  <span className="text-slate-600">•</span>
                  <span className="text-slate-400">Reciter:</span>
                  <span className="font-semibold text-slate-200">{requirement.rightsEvidence.performerName}</span>
                </>
              )}
            </div>
            <div className="flex items-center space-x-1.5 text-[11px] text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Attested Complete Human Review</span>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-navy-950 border border-slate-800 text-[11px] text-slate-400 flex items-start space-x-2">
            <Info className="w-3.5 h-3.5 text-gold-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-slate-300">Operational Policy & Terms of Service:</strong> Streamed via official YouTube Embedded Player API without modification. Audio streams are not downloaded, extracted, proxied, or rehosted. All original branding, channel monetization, and platform advertising remain intact.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
