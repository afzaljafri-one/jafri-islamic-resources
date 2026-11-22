import React, { useState } from 'react';
import {
  CheckSquare,
  Copy,
  Check,
} from 'lucide-react';
import { SIX_KALIMAS } from '../../services/islamic/sixKalimasData';
import { SixKalimaItem } from '../../services/islamic/types';

export const SixKalimasView: React.FC = () => {
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const handleCopy = (kalima: SixKalimaItem) => {
    const textToCopy = `${kalima.title} (${kalima.arabicTitle})\n\n${kalima.arabicText}\n\n[Transliteration]: ${kalima.transliteration}\n\n[English]: ${kalima.englishTranslation}\n\n[Urdu]: ${kalima.urduTranslation}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(kalima.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6" data-testid="six-kalimas-view">
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-gold-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gold-400 text-xs font-serif font-bold uppercase tracking-wider">
            <CheckSquare className="w-4 h-4" />
            <span>Foundations of Faith (الكلمات الست)</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-normal">Authentic Creed</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-100 mt-1">
            The Six Kalimas of Islam
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Essential declarations of Islamic creed, monotheism, repentance, and rejection of disbelief.
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-xs font-serif font-bold text-gold-400 shadow-gold-sm">
          Complete 6 Kalimas with Arabic, Urdu & English
        </div>
      </div>

      {/* Cards for all 6 Kalimas */}
      <div className="space-y-6">
        {SIX_KALIMAS.map((kalima) => (
          <div
            key={kalima.id}
            data-testid={`kalima-card-${kalima.id}`}
            className="p-5 sm:p-7 rounded-3xl bg-navy-900 border border-gold-500/20 hover:border-gold-500/40 transition-all space-y-5 shadow-xl relative overflow-hidden"
          >
            {/* Header: Number, Title, Copy */}
            <div className="flex items-center justify-between pb-3 border-b border-navy-800 gap-3">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 font-mono font-bold text-sm flex items-center justify-center flex-shrink-0">
                  {kalima.id}
                </div>
                <div>
                  <h3 className="font-serif font-bold text-slate-100 text-sm sm:text-base">
                    {kalima.title}
                  </h3>
                  <div className="font-quran text-gold-400 text-sm sm:text-base mt-0.5">
                    {kalima.arabicTitle}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCopy(kalima)}
                title="Copy Kalima"
                data-testid={`copy-kalima-${kalima.id}`}
                className="p-2 rounded-xl bg-navy-950 text-slate-400 hover:text-slate-200 border border-gold-500/20 transition-colors flex-shrink-0"
              >
                {copiedId === kalima.id ? (
                  <Check className="w-4 h-4 text-emerald-400" data-testid={`copy-success-${kalima.id}`} />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Arabic Text with Tashkeel */}
            <div
              dir="rtl"
              className="font-quran text-2xl sm:text-3xl text-gold-300 leading-loose tracking-wide text-right py-2 px-2"
            >
              {kalima.arabicText}
            </div>

            {/* Transliteration */}
            <div className="p-3.5 rounded-xl bg-navy-950/70 border border-navy-800 text-xs text-slate-300 italic leading-relaxed">
              <span className="font-semibold text-gold-400 not-italic mr-1.5">[Transliteration]:</span>
              {kalima.transliteration}
            </div>

            {/* English Translation */}
            <div className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-1">
              <strong className="text-gold-400 font-serif mr-1.5">[English]:</strong>
              {kalima.englishTranslation}
            </div>

            {/* Urdu Translation */}
            <div
              dir="rtl"
              className="font-urdu text-sm sm:text-base text-slate-200 leading-relaxed pt-3 border-t border-navy-850 text-right"
            >
              <span className="font-sans text-xs font-semibold text-gold-400 ml-2">[اردو ترجمہ]:</span>
              {kalima.urduTranslation}
            </div>
          </div>
        ))}
      </div>

      {/* Educational & Pedagogical Attribution Note */}
      <div
        data-testid="kalimas-attribution-notice"
        className="p-4 rounded-2xl bg-navy-900/80 border border-gold-500/20 text-xs text-slate-400 leading-relaxed space-y-1"
      >
        <strong className="text-slate-200 block">Pedagogical Compilation Attribution:</strong>
        <p className="text-[11px] text-slate-400">
          The Six Kalimas represent an established educational curriculum developed within traditional South Asian madrasas (Dars-e-Nizami) to instruct students in foundational Islamic articles of faith, praise, repentance, and rejection of polytheism. While the first two Kalimas are canonical declarations (Shahadah) recurring across the Quran and Sunnah, and Kalimas 3–6 comprise authentic Prophetic supplications and dhikr, their specific sixfold numerical grouping is an instructional pedagogical tradition rather than an explicit single Prophetic enumeration.
        </p>
      </div>
    </div>
  );
};
