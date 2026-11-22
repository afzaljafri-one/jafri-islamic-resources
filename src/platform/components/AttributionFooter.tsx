// ==============================================================================
// Common Platform Attribution & Provenance Footer
// Jafri Religious Books & Audio Platform — Phase 0
// ==============================================================================

import React from 'react';
import { ShieldCheck, Info, HeartHandshake } from 'lucide-react';
import { ProvenanceMetadata } from '../types/scripture';

interface AttributionFooterProps {
  provenance?: ProvenanceMetadata;
  customAttribution?: string;
}

export const AttributionFooter: React.FC<AttributionFooterProps> = ({
  provenance,
  customAttribution,
}) => {
  return (
    <footer className="mt-8 border-t border-slate-800/80 pt-6 pb-8 text-xs text-slate-400 space-y-4">
      {provenance && (
        <div className="p-4 rounded-2xl bg-navy-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="font-semibold text-slate-200">Authentic Source Provenance</span>
              <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                {provenance.licenseType}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {provenance.attributionText} Source:{' '}
              <a
                href={provenance.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-400 hover:underline"
              >
                {provenance.sourceName}
              </a>
            </p>
          </div>

          <div className="text-[11px] text-slate-500 self-end sm:self-center">
            Verified: {provenance.verifiedDate}
          </div>
        </div>
      )}

      {customAttribution && (
        <p className="text-[11px] text-slate-400 italic text-center">
          {customAttribution}
        </p>
      )}

      {/* Core Platform Ethics & Non-Astrology Declaration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-[11px] text-slate-500">
        <div className="flex items-center space-x-2 p-2 rounded-xl bg-navy-950/40 border border-slate-900">
          <HeartHandshake className="w-4 h-4 text-gold-400 flex-shrink-0" />
          <span>100% Free Public Access • No Advertisements • No Paid Religious Placements</span>
        </div>

        <div className="flex items-center space-x-2 p-2 rounded-xl bg-navy-950/40 border border-slate-900">
          <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Strict Provenance: Zero AI-Generated Scripture Text or Synthetic Translations</span>
        </div>

        <div className="flex items-center space-x-2 p-2 rounded-xl bg-navy-950/40 border border-slate-900">
          <Info className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <span>Sacred Scripture Preservation: Religious Content Strictly Segregated from Astrology</span>
        </div>
      </div>
    </footer>
  );
};
