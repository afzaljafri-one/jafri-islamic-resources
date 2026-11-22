// ==============================================================================
// Common Platform Translation & Commentary Edition Selector
// Jafri Religious Books & Audio Platform — Phase 0
// ==============================================================================

import React from 'react';
import { Languages, ShieldCheck } from 'lucide-react';
import { TranslationMetadata } from '../types/scripture';

interface TranslationSelectorProps {
  translations: TranslationMetadata[];
  selectedTranslationId: string;
  onSelectTranslation: (id: string) => void;
  accentColorClass?: string;
}

export const TranslationSelector: React.FC<TranslationSelectorProps> = ({
  translations,
  selectedTranslationId,
  onSelectTranslation,
  accentColorClass = 'text-gold-400',
}) => {
  const selected = translations.find((t) => t.id === selectedTranslationId);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-navy-900/60 rounded-2xl border border-slate-800 text-xs">
      <div className="flex items-center space-x-2">
        <Languages className={`w-4 h-4 ${accentColorClass}`} />
        <span className="font-semibold text-slate-200">Translation Edition:</span>
        <select
          value={selectedTranslationId}
          onChange={(e) => onSelectTranslation(e.target.value)}
          className="bg-navy-950 border border-slate-700 text-slate-100 rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-gold-500"
        >
          {translations.length === 0 ? (
            <option value="">No translations configured</option>
          ) : (
            translations.map((t) => (
              <option key={t.id} value={t.id}>
                {t.editionTitle} ({t.translatorOrAuthor}) — [{t.languageName}]
              </option>
            ))
          )}
        </select>
      </div>

      {selected && (
        <div className="flex items-center space-x-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{selected.provenance.licenseType}</span>
          <span>•</span>
          <span className="text-slate-300">{selected.provenance.sourceName}</span>
        </div>
      )}
    </div>
  );
};
