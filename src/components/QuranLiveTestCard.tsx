import React, { useState, useEffect } from 'react';
import { quranRouter } from '../services/quranRouter';
import { ummahApi } from '../services/ummahApi';
import { ArabicScriptType, SurahMeta, UnifiedAyah, WordToken } from '../types/quran';
import { BookOpen, Play, Pause, CheckCircle2, RefreshCw, AlertTriangle, Layers } from 'lucide-react';

export const QuranLiveTestCard: React.FC = () => {
  const [surahList, setSurahList] = useState<SurahMeta[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<number>(1);
  const [selectedScript, setSelectedScript] = useState<ArabicScriptType>('uthmani');
  const [selectedUrduTranslation, setSelectedUrduTranslation] = useState<'ur.jawadi' | 'ur.jalandhry'>('ur.jawadi');
  const [currentSurah, setCurrentSurah] = useState<SurahMeta | null>(null);
  const [ayahs, setAyahs] = useState<UnifiedAyah[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [playingAyah, setPlayingAyah] = useState<number | null>(null);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [networkLatencyMs, setNetworkLatencyMs] = useState<number | null>(null);
  const [activeProvider, setActiveProvider] = useState<string>('ummahapi');
  const [scriptNotice, setScriptNotice] = useState<string | undefined>();
  const [translationNotice, setTranslationNotice] = useState<string | undefined>();
  const [wordByWordAyah, setWordByWordAyah] = useState<number | null>(null);
  const [wordsData, setWordsData] = useState<WordToken[]>([]);

  // Load 114 Surahs on mount
  useEffect(() => {
    quranRouter
      .getSurahDirectory()
      .then((list) => setSurahList(list))
      .catch((err) => setError(`Failed to load Surah list: ${err.message}`));
  }, []);

  // Fetch Surah via Quran Smart Router
  const loadSurahData = async (
    surahNum: number,
    script: ArabicScriptType,
    urduTrans: 'ur.jawadi' | 'ur.jalandhry'
  ) => {
    setLoading(true);
    setError(null);
    setScriptNotice(undefined);
    setTranslationNotice(undefined);
    const start = performance.now();
    try {
      const result = await quranRouter.getSurah({
        surahNumber: surahNum,
        script: script,
        primaryTranslation: 'en.sahih',
        secondaryTranslation: urduTrans,
        reciterId: '1', // Alafasy
      });

      setNetworkLatencyMs(Math.round(performance.now() - start));
      setCurrentSurah(result.surah);
      setAyahs(result.ayahs);
      setActiveProvider(result.activeProvider);
      setScriptNotice(result.scriptNotice);
      setTranslationNotice(result.translationNotice);
    } catch (err: any) {
      setError(err.message || 'Error fetching Surah data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurahData(selectedSurah, selectedScript, selectedUrduTranslation);
  }, [selectedSurah, selectedScript, selectedUrduTranslation]);

  // Audio Playback
  const togglePlayAyah = (ayahNum: number, audioUrl?: string) => {
    if (!audioUrl) return;

    if (playingAyah === ayahNum && audioElement) {
      audioElement.pause();
      setPlayingAyah(null);
      return;
    }

    if (audioElement) {
      audioElement.pause();
    }

    const audio = new Audio(audioUrl);
    setAudioElement(audio);
    setPlayingAyah(ayahNum);

    audio.play().catch(() => setPlayingAyah(null));
    audio.onended = () => setPlayingAyah(null);
  };

  // Word-by-Word Toggle
  const toggleWordByWord = async (ayahNum: number) => {
    if (wordByWordAyah === ayahNum) {
      setWordByWordAyah(null);
      setWordsData([]);
      return;
    }
    setWordByWordAyah(ayahNum);
    try {
      const words = await ummahApi.getWords(selectedSurah, ayahNum);
      const mapped: WordToken[] = words.map((w) => ({
        position: w.position,
        arabic: w.arabic,
        transliteration: w.transliteration?.text,
        translation: w.translation,
      }));
      setWordsData(mapped);
    } catch {
      setWordsData([]);
    }
  };

  return (
    <div className="rounded-2xl bg-navy-900 border border-gold-500/30 p-5 lg:p-6 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-navy-800 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-slate-100 flex items-center gap-2">
              Quran Multi-Provider Router Engine
              <span
                className={`text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full border ${
                  activeProvider === 'ummahapi'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                    : activeProvider === 'alquran_cloud'
                    ? 'bg-blue-950 text-blue-400 border-blue-500/40'
                    : 'bg-purple-950 text-purple-400 border-purple-500/40'
                }`}
              >
                {activeProvider === 'ummahapi'
                  ? 'UmmahAPI (Primary)'
                  : activeProvider === 'alquran_cloud'
                  ? 'Al Quran Cloud (Specialized)'
                  : 'Hybrid Routing Active'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Verified scripts (Uthmani, IndoPak, Tajweed) • Scholarly Urdu safeguards (Jawadi vs Jalandhry) • Zero silent substitution
            </p>
          </div>
        </div>

        {/* Latency & Surah Selector */}
        <div className="flex items-center space-x-3 text-xs">
          {networkLatencyMs !== null && (
            <span className="text-slate-400 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-gold-400 font-mono font-medium">{networkLatencyMs}ms</span>
            </span>
          )}
          <select
            value={selectedSurah}
            onChange={(e) => setSelectedSurah(Number(e.target.value))}
            className="bg-navy-950 border border-gold-500/40 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-gold-400"
          >
            {surahList.length > 0 ? (
              surahList.map((s) => (
                <option key={s.number} value={s.number}>
                  {s.number}. {s.englishName} ({s.name}) — {s.numberOfAyahs} v
                </option>
              ))
            ) : (
              <option value="1">1. Al-Faatiha (سُورَةُ ٱلْفَاتِحَةِ)</option>
            )}
          </select>
        </div>
      </div>

      {/* Script & Translation Integrity Bar */}
      <div className="p-3.5 rounded-xl bg-navy-950/80 border border-gold-500/20 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Script Selector */}
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-300">Arabic Script:</span>
          <div className="inline-flex rounded-lg border border-gold-500/30 p-0.5 bg-navy-900">
            <button
              onClick={() => setSelectedScript('uthmani')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                selectedScript === 'uthmani' ? 'bg-gold-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Medina Uthmani
            </button>
            <button
              onClick={() => setSelectedScript('indopak')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                selectedScript === 'indopak' ? 'bg-gold-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              IndoPak (South Asian)
            </button>
            <button
              onClick={() => setSelectedScript('tajweed')}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                selectedScript === 'tajweed' ? 'bg-gold-500 text-navy-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Tajweed Rules
            </button>
          </div>
        </div>

        {/* Translation Selector (Integrity Safeguard) */}
        <div className="flex items-center space-x-2">
          <span className="font-bold text-slate-300">Urdu Scholar:</span>
          <select
            value={selectedUrduTranslation}
            onChange={(e) => setSelectedUrduTranslation(e.target.value as any)}
            className="bg-navy-900 border border-gold-500/40 rounded px-2.5 py-1 text-xs text-gold-400 focus:outline-none"
          >
            <option value="ur.jawadi">Allama Syed Zeeshan Haider Jawadi (Urdu) [AlQuran Cloud]</option>
            <option value="ur.jalandhry">Fateh Muhammad Jalandhry (Urdu) [UmmahAPI]</option>
          </select>
        </div>
      </div>

      {/* Notices & Disclaimers */}
      {translationNotice && (
        <div className="p-3 rounded-lg bg-blue-950/40 border border-blue-500/30 text-blue-200 text-xs flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span>{translationNotice}</span>
        </div>
      )}

      {scriptNotice && (
        <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{scriptNotice}</span>
        </div>
      )}

      {/* Main Verses Display */}
      {loading ? (
        <div className="py-12 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
          <RefreshCw className="w-6 h-6 animate-spin text-gold-400" />
          <p className="text-sm">Routing Quran data through smart service layer...</p>
        </div>
      ) : error ? (
        <div className="p-4 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 text-sm">
          {error}
        </div>
      ) : (
        <div className="space-y-4">
          {/* Surah Banner */}
          {currentSurah && (
            <div className="p-4 rounded-xl bg-navy-950/70 border border-gold-500/20 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-3">
              <div>
                <h3 className="font-serif text-lg font-bold text-slate-100">
                  Surah {currentSurah.englishName}{' '}
                  <span className="text-gold-400 font-normal">({currentSurah.englishNameTranslation})</span>
                </h3>
                <p className="text-xs text-slate-400">
                  Revelation: <span className="text-slate-200 font-medium">{currentSurah.revelationType}</span> • Total Verses:{' '}
                  <span className="text-slate-200 font-medium">{currentSurah.numberOfAyahs}</span> • Script:{' '}
                  <span className="text-gold-400 uppercase font-semibold">{selectedScript}</span>
                </p>
              </div>
              <div className="font-quran text-2xl text-gold-400 tracking-wide">{currentSurah.name}</div>
            </div>
          )}

          {/* Verses Preview List */}
          <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
            {ayahs.slice(0, 5).map((ayah) => {
              const isPlaying = playingAyah === ayah.numberInSurah;
              const isWordsActive = wordByWordAyah === ayah.numberInSurah;

              return (
                <div
                  key={ayah.numberInSurah}
                  className={`p-4 rounded-xl border transition-all duration-200 ${
                    isPlaying
                      ? 'bg-navy-850 border-gold-400/80 shadow-gold-sm ring-1 ring-gold-400/50'
                      : 'bg-navy-950/40 border-gold-500/15 hover:border-gold-500/30'
                  }`}
                >
                  {/* Top Bar: Verse Badge + Controls */}
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-navy-800/80">
                    <div className="flex items-center space-x-2">
                      <span className="w-6 h-6 rounded-md bg-gold-500/10 border border-gold-500/30 text-gold-400 font-mono text-xs flex items-center justify-center font-bold">
                        {ayah.numberInSurah}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Juz {ayah.juz} • Page {ayah.page}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy-800 text-slate-400 font-mono">
                        {ayah.provider === 'ummahapi'
                          ? 'UmmahAPI'
                          : ayah.provider === 'alquran_cloud'
                          ? 'AlQuran Cloud'
                          : 'Hybrid'}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleWordByWord(ayah.numberInSurah)}
                        className={`flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] border transition-colors ${
                          isWordsActive
                            ? 'bg-gold-500/20 text-gold-300 border-gold-500/50'
                            : 'bg-navy-800 text-slate-400 border-navy-700 hover:text-slate-200'
                        }`}
                      >
                        <Layers className="w-3 h-3" />
                        <span>Words</span>
                      </button>

                      {ayah.audioUrl && (
                        <button
                          onClick={() => togglePlayAyah(ayah.numberInSurah, ayah.audioUrl)}
                          className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
                            isPlaying
                              ? 'bg-gold-500 text-navy-950 font-bold'
                              : 'bg-navy-800 text-gold-400 hover:bg-gold-500/20'
                          }`}
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                          <span>{isPlaying ? 'Playing...' : 'Play Audio'}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Arabic Quran Text (Supports HTML for Tajweed tags) */}
                  {selectedScript === 'tajweed' ? (
                    <div
                      className="arabic-quran-text text-xl lg:text-2xl text-slate-100 py-1 tracking-wide"
                      dangerouslySetInnerHTML={{ __html: ayah.arabicText }}
                    />
                  ) : (
                    <div className="arabic-quran-text text-xl lg:text-2xl text-slate-100 py-1 tracking-wide">
                      {ayah.arabicText} <span className="text-gold-400 text-lg mr-1">۝{ayah.numberInSurah}</span>
                    </div>
                  )}

                  {/* Word-by-Word Sub-View */}
                  {isWordsActive && wordsData.length > 0 && (
                    <div className="mt-3 p-3 rounded-lg bg-navy-950 border border-gold-500/30 flex flex-wrap gap-2 justify-end" dir="rtl">
                      {wordsData.map((w) => (
                        <div key={w.position} className="p-2 rounded bg-navy-900 border border-navy-800 text-center min-w-[70px]">
                          <div className="font-quran text-base text-gold-400">{w.arabic}</div>
                          {w.transliteration && (
                            <div className="text-[10px] text-slate-400 font-mono" dir="ltr">{w.transliteration}</div>
                          )}
                          <div className="text-[10px] text-slate-200 mt-0.5" dir="ltr">{w.translation}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Translations Stack */}
                  <div className="mt-3 pt-3 border-t border-navy-800/60 space-y-2">
                    {/* Saheeh English */}
                    {ayah.translations['en.sahih'] && (
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gold-400/90 tracking-wider">
                          Saheeh International (EN):
                        </span>
                        <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
                          {ayah.translations['en.sahih']}
                        </p>
                      </div>
                    )}

                    {/* Allama Jawadi Urdu (When selected) */}
                    {selectedUrduTranslation === 'ur.jawadi' && ayah.translations['ur.jawadi'] && (
                      <div className="pt-1">
                        <span className="text-[10px] uppercase font-bold text-gold-400/90 tracking-wider">
                          علامہ جوادی — Allama Syed Zeeshan Haider Jawadi (UR) [Al Quran Cloud]:
                        </span>
                        <p dir="rtl" className="text-xs text-slate-200 mt-0.5 leading-relaxed font-sans text-right">
                          {ayah.translations['ur.jawadi']}
                        </p>
                      </div>
                    )}

                    {/* Fateh Jalandhry Urdu (When selected) */}
                    {selectedUrduTranslation === 'ur.jalandhry' &&
                      (ayah.translations['ur.jalandhry'] || ayah.translations['urdu']) && (
                        <div className="pt-1">
                          <span className="text-[10px] uppercase font-bold text-gold-400/90 tracking-wider">
                            فتح محمد جالندھری — Fateh Muhammad Jalandhry (UR) [UmmahAPI]:
                          </span>
                          <p dir="rtl" className="text-xs text-slate-200 mt-0.5 leading-relaxed font-sans text-right">
                            {ayah.translations['ur.jalandhry'] || ayah.translations['urdu']}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              );
            })}
          </div>
          {ayahs.length > 5 && (
            <p className="text-center text-[11px] text-slate-400 pt-1">
              Showing preview of 5 of {ayahs.length} verses in Surah {currentSurah?.englishName}.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
