import React, { useState, useMemo } from 'react';
import { Sun, Search, Copy, Check } from 'lucide-react';
import { ASMA_UL_HUSNA } from '../../services/islamic/asmaUlHusnaData';
import { AsmaUlHusnaName } from '../../services/islamic/types';

export const AsmaUlHusnaView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedName, setSelectedName] = useState<AsmaUlHusnaName | null>(null);
  const [copiedNumber, setCopiedNumber] = useState<number | null>(null);

  const filteredNames = useMemo(() => {
    if (!searchQuery.trim()) return ASMA_UL_HUSNA;
    const q = searchQuery.toLowerCase();
    return ASMA_UL_HUSNA.filter((item) => {
      return (
        item.number.toString() === q ||
        item.transliteration.toLowerCase().includes(q) ||
        item.englishMeaning.toLowerCase().includes(q) ||
        item.urduMeaning.includes(q) ||
        item.explanation.toLowerCase().includes(q) ||
        item.arabic.includes(q)
      );
    });
  }, [searchQuery]);

  const handleCopy = (item: AsmaUlHusnaName) => {
    const textToCopy = `${item.number}. ${item.arabic} (${item.transliteration})\nEnglish: ${item.englishMeaning}\nUrdu: ${item.urduMeaning}\nExplanation: ${item.explanation}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedNumber(item.number);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <div className="space-y-6" data-testid="asma-ul-husna-view">
      {/* Top Banner */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-gold-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gold-400 text-xs font-serif font-bold uppercase tracking-wider">
            <Sun className="w-4 h-4" />
            <span>Asma-ul-Husna (أسماء الله الحسنى)</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-normal">Divine Attributes</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-100 mt-1">
            The 99 Beautiful Names of Allah
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            "And to Allah belong the most beautiful names, so invoke Him by them." (Quran 7:180)
          </p>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-xs font-serif font-bold text-gold-400 shadow-gold-sm">
          Complete 99 Names with Meanings & Explanations
        </div>
      </div>

      {/* Search Filter */}
      <div className="p-4 rounded-2xl bg-navy-900 border border-gold-500/20 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by number (1-99), transliteration, English or Urdu meaning..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            data-testid="asma-search-input"
            className="w-full bg-navy-950 border border-gold-500/30 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-gold-400"
          />
        </div>
        <div className="text-xs text-slate-400 whitespace-nowrap">
          Showing <strong>{filteredNames.length}</strong> of 99 Names
        </div>
      </div>

      {/* 99 Names Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredNames.map((item) => (
          <div
            key={item.number}
            data-testid={`asma-card-${item.number}`}
            onClick={() => setSelectedName(item)}
            className="p-4 rounded-2xl bg-navy-900 border border-gold-500/20 hover:border-gold-500/50 hover:bg-navy-850 transition-all cursor-pointer space-y-2.5 shadow-lg group relative overflow-hidden flex flex-col justify-between"
          >
            {/* Top row: Number and copy */}
            <div className="flex items-center justify-between">
              <span className="w-7 h-7 rounded-lg bg-gold-500/10 border border-gold-500/30 text-gold-400 font-mono text-xs font-bold flex items-center justify-center">
                {item.number}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(item);
                }}
                title="Copy Name"
                className="p-1 rounded-lg text-slate-500 hover:text-slate-200 hover:bg-navy-950 transition-colors"
              >
                {copiedNumber === item.number ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
            </div>

            {/* Arabic Calligraphy */}
            <div
              dir="rtl"
              className="font-quran text-2xl sm:text-3xl text-gold-300 text-center py-1 group-hover:scale-105 transition-transform"
            >
              {item.arabic}
            </div>

            {/* Transliteration & English Meaning */}
            <div className="text-center space-y-0.5">
              <div className="text-xs font-serif font-bold text-slate-100">
                {item.transliteration}
              </div>
              <div className="text-[11px] text-gold-400 font-medium">
                {item.englishMeaning}
              </div>
              <div dir="rtl" className="font-urdu text-xs text-slate-400 pt-0.5">
                {item.urduMeaning}
              </div>
            </div>

            {/* Explanation snippet */}
            <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed pt-2 border-t border-navy-800">
              {item.explanation}
            </p>
          </div>
        ))}
      </div>

      {/* Selected Name Detail Modal */}
      {selectedName && (
        <div
          className="fixed inset-0 z-50 bg-navy-950/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedName(null)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-navy-900 border border-gold-500/40 p-6 sm:p-8 space-y-5 shadow-2xl animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
            data-testid="name-modal"
          >
            <div className="flex items-center justify-between pb-3 border-b border-navy-800">
              <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30">
                Name #{selectedName.number} of 99
              </span>
              <button
                onClick={() => setSelectedName(null)}
                data-testid="close-name-modal-btn"
                className="text-slate-400 hover:text-slate-200 text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div
              dir="rtl"
              data-testid="modal-arabic-name"
              className="font-quran text-4xl sm:text-5xl text-gold-300 text-center py-2"
            >
              {selectedName.arabic}
            </div>

            <div className="text-center space-y-1">
              <h3 className="font-serif text-lg font-bold text-slate-100">
                {selectedName.transliteration}
              </h3>
              <div className="text-sm font-semibold text-gold-400" data-testid="modal-eng-name">
                {selectedName.englishMeaning}
              </div>
              <div dir="rtl" className="font-urdu text-base text-slate-300 pt-1" data-testid="modal-urdu-name">
                {selectedName.urduMeaning}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-navy-950/80 border border-navy-800 text-xs text-slate-300 leading-relaxed space-y-1">
              <div className="font-serif font-bold text-gold-400">Divine Meaning & Significance:</div>
              <p data-testid="modal-explanation">{selectedName.explanation}</p>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => handleCopy(selectedName)}
                className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gold-500 text-navy-950 font-bold text-xs shadow-gold-sm hover:bg-gold-400 transition-colors"
              >
                {copiedNumber === selectedName.number ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Full Description</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
