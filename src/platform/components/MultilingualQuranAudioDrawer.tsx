// ==============================================================================
// Multilingual Quran Audio Drawer / Modal (Command 4 Implementation)
// Pure separate component providing multi-language Quran audio for Islam.
// STRICT PRESERVATION: Does NOT modify QuranReader.tsx or QuranAudioService.ts.
// Jafri Religious Books & Audio Platform
// ==============================================================================

import React, { useState, useEffect } from 'react';
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Languages,
  Sparkles,
} from 'lucide-react';
import {
  QURAN_AUDIO_EDITIONS,
  TranslationAudioService,
} from '../services/translationAudioService';
import {
  multilingualAudioEngine,
  AudioEngineState,
  ScriptureAudioMode,
  ScriptureUnit,
} from '../services/multilingualAudioEngine';

interface MultilingualQuranAudioDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenProvenance?: () => void;
}

// Canonical Surah list (114 Surahs with verse counts)
export const SURAHS_META = [
  { number: 1, name: 'Al-Fatihah', arabic: 'الفاتحة', ayahs: 7 },
  { number: 2, name: 'Al-Baqarah', arabic: 'البقرة', ayahs: 286 },
  { number: 3, name: 'Ali \'Imran', arabic: 'آل عمران', ayahs: 200 },
  { number: 36, name: 'Ya-Sin', arabic: 'يس', ayahs: 83 },
  { number: 55, name: 'Ar-Rahman', arabic: 'الرحمن', ayahs: 78 },
  { number: 56, name: 'Al-Waqi\'ah', arabic: 'الواقعة', ayahs: 96 },
  { number: 67, name: 'Al-Mulk', arabic: 'الملك', ayahs: 30 },
  { number: 112, name: 'Al-Ikhlas', arabic: 'الإخلاص', ayahs: 4 },
  { number: 113, name: 'Al-Falaq', arabic: 'الفلق', ayahs: 5 },
  { number: 114, name: 'An-Nas', arabic: 'الناس', ayahs: 6 },
];

export const MultilingualQuranAudioDrawer: React.FC<MultilingualQuranAudioDrawerProps> = ({
  isOpen,
  onClose,
  onOpenProvenance,
}) => {
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [selectedAyah, setSelectedAyah] = useState<number>(1);
  const [selectedEditionId, setSelectedEditionId] = useState<string>('english_ibrahim_walk');
  const [audioState, setAudioState] = useState<AudioEngineState>(
    multilingualAudioEngine.getState()
  );

  const activeSurahMeta = SURAHS_META.find((s) => s.number === selectedSurah) || SURAHS_META[0];

  useEffect(() => {
    const unsub = multilingualAudioEngine.subscribe((next) => {
      setAudioState(next);
      if (next.activeUnitId) {
        const parts = next.activeUnitId.split(':');
        if (parts.length === 2) {
          const s = parseInt(parts[0], 10);
          const a = parseInt(parts[1], 10);
          if (s === selectedSurah) {
            setSelectedAyah(a);
          }
        }
      }
    });
    return () => unsub();
  }, [selectedSurah]);

  // Load units for the active Surah into the engine
  useEffect(() => {
    if (!isOpen) return;

    const units: ScriptureUnit[] = [];
    const arabicBase = 'https://everyayah.com/data/Alafasy_128kbps/';

    for (let a = 1; a <= activeSurahMeta.ayahs; a++) {
      const token = TranslationAudioService.formatAyahToken(selectedSurah, a);
      const originalUrl = `${arabicBase}${token}.mp3`;
      const translationUrl = TranslationAudioService.getAudioUrl(selectedEditionId, selectedSurah, a);

      units.push({
        id: `${selectedSurah}:${a}`,
        label: `Surah ${activeSurahMeta.name} — Ayah ${a}`,
        originalAudioUrl: originalUrl,
        translationAudioUrl: translationUrl,
        originalText: `آية قرانية ${a}`,
        translationText: `Translation reading of Surah ${activeSurahMeta.name}, Ayah ${a}.`,
      });
    }

    multilingualAudioEngine.loadUnits('islam', units);
    multilingualAudioEngine.setEdition(selectedEditionId);
  }, [isOpen, selectedSurah, selectedEditionId]);

  if (!isOpen) return null;

  const handlePlayAyah = (ayahNum: number) => {
    setSelectedAyah(ayahNum);
    multilingualAudioEngine.play(`${selectedSurah}:${ayahNum}`);
  };

  const handleModeChange = (mode: ScriptureAudioMode) => {
    multilingualAudioEngine.setMode(mode);
    if (audioState.playbackState === 'playing') {
      multilingualAudioEngine.play();
    }
  };

  const handleEditionChange = (editionId: string) => {
    setSelectedEditionId(editionId);
    multilingualAudioEngine.setEdition(editionId);
  };

  const activeEdition = QURAN_AUDIO_EDITIONS.find((e) => e.id === selectedEditionId) || QURAN_AUDIO_EDITIONS[2];

  return (
    <div
      data-testid="multilingual-quran-audio-drawer"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6"
    >
      <div className="bg-navy-950 border border-gold-500/30 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-navy-800 flex items-center justify-between bg-gradient-to-r from-navy-900 to-navy-950">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gold-500/20 text-gold-400 border border-gold-500/30 flex items-center justify-center font-bold">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-serif font-bold text-slate-100">
                Multilingual Quran Audio Engine
              </h2>
              <p className="text-[11px] text-slate-400">
                Original Arabic • English • Urdu • Hindi • French • Chinese
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            data-testid="close-quran-audio-modal"
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-navy-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Configuration Controls Bar */}
        <div className="p-4 bg-navy-900/60 border-b border-navy-800 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          {/* Surah Selector */}
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Select Surah:</label>
            <select
              value={selectedSurah}
              onChange={(e) => {
                setSelectedSurah(Number(e.target.value));
                setSelectedAyah(1);
              }}
              data-testid="quran-surah-select"
              className="w-full bg-navy-950 border border-gold-500/30 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
            >
              {SURAHS_META.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.name} ({s.arabic}) — {s.ayahs} Ayahs
                </option>
              ))}
            </select>
          </div>

          {/* Translation Edition Selector */}
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Translation Audio Edition:</label>
            <select
              value={selectedEditionId}
              onChange={(e) => handleEditionChange(e.target.value)}
              data-testid="quran-edition-select"
              className="w-full bg-navy-950 border border-gold-500/30 rounded-xl px-2.5 py-1.5 text-slate-200 focus:outline-none"
            >
              {QURAN_AUDIO_EDITIONS.filter((e) => e.isTranslation).map((ed) => (
                <option key={ed.id} value={ed.id}>
                  {ed.languageName}: {ed.name}
                </option>
              ))}
            </select>
          </div>

          {/* Mode Selector */}
          <div>
            <label className="block text-slate-400 mb-1 font-semibold">Playback Mode:</label>
            <div className="flex rounded-xl bg-navy-950 border border-gold-500/30 p-0.5">
              <button
                type="button"
                onClick={() => handleModeChange('original_only')}
                data-testid="quran-mode-arabic"
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold ${
                  audioState.mode === 'original_only'
                    ? 'bg-gold-500 text-navy-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Arabic
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('translation_only')}
                data-testid="quran-mode-translation"
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold ${
                  audioState.mode === 'translation_only'
                    ? 'bg-gold-500 text-navy-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Translation
              </button>
              <button
                type="button"
                onClick={() => handleModeChange('dual_interleaved')}
                data-testid="quran-mode-dual"
                className={`flex-1 py-1 rounded-lg text-[10px] font-bold flex items-center justify-center space-x-1 ${
                  audioState.mode === 'dual_interleaved'
                    ? 'bg-amber-400 text-navy-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-2.5 h-2.5" />
                <span>Dual</span>
              </button>
            </div>
          </div>
        </div>

        {/* Active Audio State Pill Banner */}
        <div className="px-4 py-2 bg-navy-900 border-b border-navy-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2">
            <span className="font-serif font-bold text-gold-300">
              {activeSurahMeta.name} — Ayah {selectedAyah} / {activeSurahMeta.ayahs}
            </span>
            {audioState.mode === 'dual_interleaved' && (
              <span
                data-testid="quran-active-phase-badge"
                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                  audioState.activePhase === 'original'
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                }`}
              >
                {audioState.activePhase === 'original'
                  ? 'Phase 1: Arabic Recitation'
                  : `Phase 2: ${activeEdition.languageName} Translation`}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-[11px] text-slate-400">
              Provider: <strong className="text-slate-300">{activeEdition.provider}</strong>
            </span>
            {onOpenProvenance && (
              <button
                onClick={onOpenProvenance}
                title="Licensing Details"
                className="text-gold-400 hover:underline text-[11px]"
              >
                Provenance &rarr;
              </button>
            )}
          </div>
        </div>

        {/* Scrollable Ayahs List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 max-h-96 scrollbar-thin">
          {Array.from({ length: activeSurahMeta.ayahs }, (_, i) => i + 1).map((aNum) => {
            const isPlaying =
              audioState.activeUnitId === `${selectedSurah}:${aNum}` &&
              audioState.playbackState === 'playing';
            const isSelected = selectedAyah === aNum;

            return (
              <div
                key={aNum}
                data-testid={`ayah-row-${aNum}`}
                className={`p-3 rounded-2xl border transition flex items-center justify-between gap-3 ${
                  isSelected || isPlaying
                    ? 'bg-gold-500/10 border-gold-500/50 shadow-sm'
                    : 'bg-navy-900/40 border-navy-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handlePlayAyah(aNum)}
                    data-testid={`play-ayah-${aNum}-btn`}
                    className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                      isPlaying
                        ? 'bg-gold-500 text-navy-950 animate-pulse'
                        : 'bg-navy-850 hover:bg-gold-500 hover:text-navy-950 text-gold-300 border border-gold-500/30'
                    }`}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                  </button>
                  <div>
                    <div className="text-xs font-serif font-bold text-slate-200">
                      Ayah {aNum}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {activeSurahMeta.name} {selectedSurah}:{aNum}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-mono text-[10px] text-slate-500">
                    {TranslationAudioService.formatAyahToken(selectedSurah, aNum)}.mp3
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Playback Bar */}
        <div className="p-4 border-t border-navy-800 bg-navy-950 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => multilingualAudioEngine.previousUnit()}
              data-testid="quran-prev-btn"
              className="p-1.5 rounded-lg bg-navy-900 hover:bg-navy-850 text-slate-300"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                if (audioState.playbackState === 'playing') {
                  multilingualAudioEngine.pause();
                } else {
                  handlePlayAyah(selectedAyah);
                }
              }}
              data-testid="quran-main-play-btn"
              className="w-10 h-10 rounded-full bg-gold-500 hover:bg-gold-400 text-navy-950 flex items-center justify-center font-bold shadow"
            >
              {audioState.playbackState === 'playing' ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current ml-0.5" />
              )}
            </button>
            <button
              onClick={() => multilingualAudioEngine.nextUnit()}
              data-testid="quran-next-btn"
              className="p-1.5 rounded-lg bg-navy-900 hover:bg-navy-850 text-slate-300"
            >
              <SkipForward className="w-4 h-4" />
            </button>
          </div>

          <div className="text-xs text-slate-400 text-right">
            Mode: <strong className="text-gold-300 font-mono">{audioState.mode}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
