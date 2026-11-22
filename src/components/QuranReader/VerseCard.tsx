import React, { useState } from 'react';
import { Play, Pause, Bookmark, Copy, Check, Layers, RefreshCw } from 'lucide-react';
import { UnifiedAyah, ArabicScriptType, WordToken } from '../../types/quran';

interface VerseCardProps {
  ayah: UnifiedAyah;
  surahNumber: number;
  surahName: string;
  selectedScript: ArabicScriptType;
  selectedUrduTranslation: 'ur.jawadi' | 'ur.jalandhry';
  fontSizeClass: string;
  isPlaying: boolean;
  isBookmarked: boolean;
  onTogglePlay: (ayahNumber: number, audioUrl?: string) => void;
  onToggleBookmark: (ayah: UnifiedAyah) => void;
  onToggleWordByWord: (ayahNumber: number) => void;
  isWordsActive: boolean;
  wordsData: WordToken[];
  isLoadingWords: boolean;
}

export const VerseCard: React.FC<VerseCardProps> = ({
  ayah,
  selectedScript,
  selectedUrduTranslation,
  fontSizeClass,
  isPlaying,
  isBookmarked,
  onTogglePlay,
  onToggleBookmark,
  onToggleWordByWord,
  isWordsActive,
  wordsData,
  isLoadingWords,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = `${ayah.arabicText}\n\n[Saheeh International]: ${ayah.translations['en.sahih'] || ''}\n\n[${
      selectedUrduTranslation === 'ur.jawadi' ? 'Allama Jawadi' : 'Fateh Jalandhry'
    }]: ${ayah.translations[selectedUrduTranslation] || ''}\n\n(Quran ${ayah.numberInSurah})`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      id={`ayah-${ayah.numberInSurah}`}
      className={`p-4 lg:p-6 rounded-2xl border transition-all duration-300 ${
        isPlaying
          ? 'bg-navy-850 border-gold-400 shadow-gold-sm ring-1 ring-gold-400/50'
          : 'bg-navy-900/90 border-gold-500/20 hover:border-gold-500/40 shadow-lg'
      }`}
    >
      {/* Top Meta Bar */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-navy-800">
        {/* Ayah Badge & Details */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400 font-mono text-xs flex items-center justify-center font-bold">
            {ayah.numberInSurah}
          </div>
          <div className="text-[11px] text-slate-400">
            <span>Juz {ayah.juz}</span>
            <span className="mx-1">•</span>
            <span>Page {ayah.page}</span>
          </div>
          <span
            className={`text-[9px] px-1.5 py-0.5 rounded font-mono ${
              ayah.provider === 'ummahapi'
                ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/30'
                : ayah.provider === 'alquran_cloud'
                ? 'bg-blue-950/80 text-blue-400 border border-blue-500/30'
                : 'bg-purple-950/80 text-purple-400 border border-purple-500/30'
            }`}
          >
            {ayah.provider === 'ummahapi'
              ? 'UmmahAPI'
              : ayah.provider === 'alquran_cloud'
              ? 'AlQuran Cloud'
              : 'Hybrid'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-1.5">
          {/* Word by Word Toggle */}
          <button
            onClick={() => onToggleWordByWord(ayah.numberInSurah)}
            title="Word-by-word translation"
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
              isWordsActive
                ? 'bg-gold-500/20 text-gold-300 border-gold-500/50'
                : 'bg-navy-950 text-slate-400 border-gold-500/20 hover:text-slate-200'
            }`}
          >
            {isLoadingWords ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Layers className="w-3.5 h-3.5" />
            )}
            <span className="hidden sm:inline">Words</span>
          </button>

          {/* Bookmark Button */}
          <button
            onClick={() => onToggleBookmark(ayah)}
            title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Ayah'}
            className={`p-1.5 rounded-lg border transition-colors ${
              isBookmarked
                ? 'bg-gold-500 text-navy-950 border-gold-400'
                : 'bg-navy-950 text-slate-400 border-gold-500/20 hover:text-gold-400'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
          </button>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            title="Copy verse"
            className="p-1.5 rounded-lg bg-navy-950 text-slate-400 border border-gold-500/20 hover:text-slate-200 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>

          {/* Audio Play/Pause Button */}
          <button
            onClick={() => onTogglePlay(ayah.numberInSurah, ayah.audioUrl)}
            title={isPlaying ? 'Pause Ayah' : 'Play Ayah'}
            data-testid={`ayah-play-btn-${ayah.numberInSurah}`}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              isPlaying
                ? 'bg-gold-500 text-navy-950 shadow-gold-sm'
                : 'bg-navy-800 text-gold-400 hover:bg-gold-500/20 border border-gold-500/30'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
            <span>{isPlaying ? 'Playing' : 'Audio'}</span>
          </button>
        </div>
      </div>

      {/* Arabic Quran Text */}
      <div className="py-2">
        {selectedScript === 'tajweed' ? (
          <div
            className={`quran-script-tajweed ${fontSizeClass} text-slate-100 text-right leading-loose tracking-wide py-1`}
            dangerouslySetInnerHTML={{ __html: ayah.arabicText }}
          />
        ) : (
          <div
            className={`${
              selectedScript === 'indopak' ? 'quran-script-indopak' : 'quran-script-uthmani'
            } ${fontSizeClass} text-slate-100 text-right leading-loose tracking-wide py-1`}
            dir="rtl"
          >
            {ayah.arabicText}
            <span className="text-gold-400 text-xl font-sans inline-block mr-2 select-none">
              ۝{ayah.numberInSurah}
            </span>
          </div>
        )}
      </div>

      {/* Word-by-Word Interactive View */}
      {isWordsActive && (
        <div className="mt-3 p-3.5 rounded-xl bg-navy-950 border border-gold-500/30 animate-in fade-in duration-200">
          <div className="text-[11px] font-bold text-gold-400 mb-2 flex items-center justify-between border-b border-navy-800 pb-1.5">
            <span>Word-by-Word Translation (RTL Sequence)</span>
            <span className="text-[10px] text-slate-500 font-normal">Click word to inspect</span>
          </div>
          {isLoadingWords ? (
            <div className="py-4 text-center text-xs text-slate-400 flex items-center justify-center space-y-1">
              <RefreshCw className="w-4 h-4 animate-spin text-gold-400 mr-2" />
              <span>Loading word vocabulary...</span>
            </div>
          ) : wordsData.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-end" dir="rtl">
              {wordsData.map((w) => (
                <div
                  key={w.position}
                  className="p-2 rounded-lg bg-navy-900 border border-gold-500/20 text-center min-w-[76px] hover:border-gold-400 transition-colors"
                >
                  <div className="font-quran text-base text-gold-400 leading-normal">{w.arabic}</div>
                  {w.transliteration && (
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5" dir="ltr">
                      {w.transliteration}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-200 mt-0.5 font-medium" dir="ltr">
                    {w.translation}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 text-center py-2">
              Word vocabulary unavailable for this verse.
            </div>
          )}
        </div>
      )}

      {/* Translations Stack */}
      <div className="mt-4 pt-3.5 border-t border-navy-800/80 space-y-3">
        {/* English (Saheeh International) */}
        {ayah.translations['en.sahih'] && (
          <div>
            <div className="text-[10px] uppercase font-bold text-gold-400/90 tracking-wider">
              Saheeh International (EN):
            </div>
            <p className="text-sm text-slate-200 mt-1 leading-relaxed">
              {ayah.translations['en.sahih']}
            </p>
          </div>
        )}

        {/* Urdu Translation: Allama Jawadi (when selected) */}
        {selectedUrduTranslation === 'ur.jawadi' && ayah.translations['ur.jawadi'] && (
          <div className="pt-2 border-t border-navy-800/40">
            <div className="text-[10px] uppercase font-bold text-gold-400/90 tracking-wider flex items-center justify-between">
              <span>علامہ جوادی — Allama Syed Zeeshan Haider Jawadi (UR):</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-950 text-blue-300 font-mono">
                AlQuran Cloud
              </span>
            </div>
            <p dir="rtl" className="text-base text-slate-100 mt-1 leading-loose text-right font-sans">
              {ayah.translations['ur.jawadi']}
            </p>
          </div>
        )}

        {/* Urdu Translation: Fateh Jalandhry (when selected) */}
        {selectedUrduTranslation === 'ur.jalandhry' && ayah.translations['ur.jalandhry'] && (
          <div className="pt-2 border-t border-navy-800/40">
            <div className="text-[10px] uppercase font-bold text-gold-400/90 tracking-wider flex items-center justify-between">
              <span>فتح محمد جالندھری — Fateh Muhammad Jalandhry (UR):</span>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 font-mono">
                UmmahAPI
              </span>
            </div>
            <p dir="rtl" className="text-base text-slate-100 mt-1 leading-loose text-right font-sans">
              {ayah.translations['ur.jalandhry']}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
