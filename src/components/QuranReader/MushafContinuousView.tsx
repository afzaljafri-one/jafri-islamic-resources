import React from 'react';
import { UnifiedAyah, ArabicScriptType, SurahMeta } from '../../types/quran';

interface MushafContinuousViewProps {
  surah: SurahMeta;
  ayahs: UnifiedAyah[];
  selectedScript: ArabicScriptType;
  fontSizeClass: string;
  selectedAyah: number | null;
  onSelectAyah: (ayahNumber: number) => void;
}

export const MushafContinuousView: React.FC<MushafContinuousViewProps> = ({
  surah,
  ayahs,
  selectedScript,
  fontSizeClass,
  selectedAyah,
  onSelectAyah,
}) => {
  const showBismillah = surah.number !== 1 && surah.number !== 9;

  return (
    <div className="rounded-3xl bg-navy-900 border border-gold-500/30 p-6 lg:p-12 shadow-2xl space-y-8 max-w-4xl mx-auto">
      {/* Decorative Mushaf Header Banner */}
      <div className="relative border-2 border-gold-500/40 rounded-2xl p-6 text-center bg-gradient-to-b from-navy-950/80 to-navy-900 overflow-hidden">
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-gold-500/60" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-gold-500/60" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-gold-500/60" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-gold-500/60" />

        <div className="font-quran text-3xl lg:text-4xl text-gold-400 mb-1">{surah.name}</div>
        <h2 className="font-serif text-lg font-bold text-slate-100 tracking-wider">
          Surah {surah.englishName} ({surah.englishNameTranslation})
        </h2>
        <div className="text-xs text-slate-400 mt-1">
          {surah.revelationType} • {surah.numberOfAyahs} Verses • Script: {selectedScript.toUpperCase()}
        </div>
      </div>

      {/* Bismillah Calligraphy (for all Surahs except At-Tawbah and Al-Fatihah which has it as verse 1) */}
      {showBismillah && (
        <div className="text-center py-4 border-b border-navy-800">
          <div className="arabic-quran-text text-2xl lg:text-3xl text-gold-400 tracking-wide">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </div>
        </div>
      )}

      {/* Continuous Quran Text Stream */}
      <div
        className={`${
          selectedScript === 'indopak'
            ? 'quran-script-indopak'
            : selectedScript === 'tajweed'
            ? 'quran-script-tajweed'
            : 'quran-script-uthmani'
        } ${fontSizeClass} text-slate-100 text-justify leading-[2.6] tracking-wide`}
        dir="rtl"
      >
        {ayahs.map((ayah) => {
          const isSelected = selectedAyah === ayah.numberInSurah;
          return (
            <span
              key={ayah.numberInSurah}
              id={`mushaf-ayah-${ayah.numberInSurah}`}
              onClick={() => onSelectAyah(ayah.numberInSurah)}
              className={`cursor-pointer transition-colors duration-200 inline rounded px-1 ${
                isSelected
                  ? 'bg-gold-500/20 text-gold-200 ring-1 ring-gold-400/60'
                  : 'hover:text-gold-300'
              }`}
            >
              {selectedScript === 'tajweed' ? (
                <span dangerouslySetInnerHTML={{ __html: ayah.arabicText }} />
              ) : (
                <>
                  {ayah.arabicText}
                  <span className="text-gold-400 text-xl font-sans inline-block mx-1.5 select-none font-bold">
                    ۝{ayah.numberInSurah}
                  </span>
                </>
              )}
            </span>
          );
        })}
      </div>
    </div>
  );
};
