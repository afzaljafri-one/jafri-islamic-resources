import React, { useState } from 'react';
import { SurahMeta, JUZ_LIST } from '../../types/quran';
import { Search, X, BookOpen } from 'lucide-react';

interface SurahSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  surahList: SurahMeta[];
  selectedSurah: number;
  onSelectSurah: (surahNum: number, ayahNum?: number) => void;
}

export const SurahSidebar: React.FC<SurahSidebarProps> = ({
  isOpen,
  onClose,
  surahList,
  selectedSurah,
  onSelectSurah,
}) => {
  const [activeTab, setActiveTab] = useState<'surahs' | 'juz'>('surahs');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredSurahs = surahList.filter((s) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      s.number.toString() === q ||
      s.englishName.toLowerCase().includes(q) ||
      s.englishNameTranslation.toLowerCase().includes(q) ||
      s.name.includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-navy-900 border-r border-gold-500/30 flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="p-4 border-b border-navy-800 flex items-center justify-between bg-navy-950/70">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-slate-100">Quran Index</h2>
              <p className="text-[11px] text-slate-400">114 Surahs • 30 Juz • 6,236 Verses</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-2 gap-1.5 bg-navy-950 border-b border-navy-800 text-xs">
          <button
            onClick={() => setActiveTab('surahs')}
            className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-all ${
              activeTab === 'surahs'
                ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900'
            }`}
          >
            Surahs (114)
          </button>
          <button
            onClick={() => setActiveTab('juz')}
            className={`flex-1 py-1.5 px-3 rounded-md font-medium transition-all ${
              activeTab === 'juz'
                ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-navy-900'
            }`}
          >
            Juz (30)
          </button>
        </div>

        {/* Search Bar (for Surahs tab) */}
        {activeTab === 'surahs' && (
          <div className="p-3 border-b border-navy-800 bg-navy-900">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Filter by name, number (e.g. 36, Yasin, الفاتحة)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-navy-950 border border-gold-500/20 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-gold-400 placeholder:text-slate-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-200"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {activeTab === 'surahs' ? (
            filteredSurahs.length > 0 ? (
              filteredSurahs.map((surah) => {
                const isSelected = selectedSurah === surah.number;
                return (
                  <button
                    key={surah.number}
                    onClick={() => {
                      onSelectSurah(surah.number);
                      onClose();
                    }}
                    className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-navy-800 border border-gold-400/80 shadow-gold-sm'
                        : 'hover:bg-navy-800/60 border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold ${
                          isSelected
                            ? 'bg-gold-500 text-navy-950'
                            : 'bg-navy-950 text-gold-400 border border-gold-500/20'
                        }`}
                      >
                        {surah.number}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                          <span>{surah.englishName}</span>
                          <span className="text-[10px] font-normal text-slate-400">
                            ({surah.englishNameTranslation})
                          </span>
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <span
                            className={`px-1 rounded text-[9px] ${
                              surah.revelationType === 'Meccan'
                                ? 'bg-amber-950/80 text-amber-300 border border-amber-500/30'
                                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/30'
                            }`}
                          >
                            {surah.revelationType}
                          </span>
                          <span>• {surah.numberOfAyahs} verses</span>
                        </div>
                      </div>
                    </div>
                    <div className="font-quran text-lg text-gold-400">{surah.name}</div>
                  </button>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs text-slate-400">
                No Surah found matching "{searchQuery}"
              </div>
            )
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1">
              {JUZ_LIST.map((j) => (
                <button
                  key={j.juzNumber}
                  onClick={() => {
                    onSelectSurah(j.startSurah, j.startAyah);
                    onClose();
                  }}
                  className="p-3 rounded-xl bg-navy-950 border border-gold-500/20 hover:border-gold-400 text-left transition-colors flex flex-col justify-between space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gold-400 uppercase font-mono">
                      Juz {j.juzNumber}
                    </span>
                    <span className="font-quran text-sm text-slate-200">{j.nameArabic}</span>
                  </div>
                  <div className="text-xs font-medium text-slate-200">{j.nameEnglish}</div>
                  <div className="text-[10px] text-slate-400">
                    Starts at Surah {j.startSurah}, Verse {j.startAyah}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
