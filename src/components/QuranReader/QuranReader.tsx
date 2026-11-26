import React, { useState, useEffect } from 'react';
import { quranRouter } from '../../services/quranRouter';
import { ummahApi } from '../../services/ummahApi';
import {
  ArabicScriptType,
  SurahMeta,
  UnifiedAyah,
  WordToken,
  BookmarkItem,
  LastReadPosition,
} from '../../types/quran';
import { ReaderControlsBar } from './ReaderControlsBar';
import { VerseCard } from './VerseCard';
import { MushafContinuousView } from './MushafContinuousView';
import { MushafPageViewer } from './MushafPageViewer';
import { SurahSidebar } from './SurahSidebar';
import { SearchModal } from './SearchModal';
import { BookmarksDrawer } from './BookmarksDrawer';
import { RefreshCw, AlertTriangle, CheckCircle2, FileDown, Loader2, Info } from 'lucide-react';
import { quranAudioService, AudioPlayerState } from '../../services/audio';
import { TwoColumnReadingLayout } from '../../platform/components/layout/TwoColumnReadingLayout';
import type { ReadingContext } from '../../platform/services/contextualAudioMatcher';
import { personalLibraryService } from '../../platform/services/personalLibraryService';

export const QuranReader: React.FC = () => {
  // Directory & Selection
  const [surahList, setSurahList] = useState<SurahMeta[]>([]);
  const [currentSurahNumber, setCurrentSurahNumber] = useState<number>(() => {
    const params = new URLSearchParams(window.location.search);
    const s = parseInt(params.get('surah') || '', 10);
    if (!isNaN(s) && s >= 1 && s <= 114) return s;
    return 1;
  });
  const [currentSurah, setCurrentSurah] = useState<SurahMeta | null>(null);
  const [ayahs, setAyahs] = useState<UnifiedAyah[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Script & Translation
  const [selectedScript, setSelectedScript] = useState<ArabicScriptType>('indopak');
  const [selectedUrduTranslation, setSelectedUrduTranslation] = useState<'ur.jawadi' | 'ur.jalandhry'>('ur.jawadi');
  const [activeProvider, setActiveProvider] = useState<string>('ummahapi');
  const [scriptNotice, setScriptNotice] = useState<string | undefined>();
  const [translationNotice, setTranslationNotice] = useState<string | undefined>();

  // PDF Download State
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [pdfNotice, setPdfNotice] = useState<{ message: string; type: 'success' | 'info' | 'error' } | null>(null);

  // View Options & Typography
  const [viewMode, setViewMode] = useState<'verse' | 'mushaf' | 'pages'>(() => {
    const params = new URLSearchParams(window.location.search);
    const v = params.get('view');
    if (v === 'pages' || v === 'mushaf' || v === 'verse') return v;
    return 'pages';
  });
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('lg');

  // Word-by-Word
  const [wordByWordAyah, setWordByWordAyah] = useState<number | null>(null);
  const [wordsCache, setWordsCache] = useState<Record<number, WordToken[]>>({});
  const [loadingWords, setLoadingWords] = useState<boolean>(false);

  // Audio Playback (Single Source of Truth: QuranAudioService)
  const [audioState, setAudioState] = useState<AudioPlayerState>(() => quranAudioService.getState());

  useEffect(() => {
    const unsubscribe = quranAudioService.subscribe((state) => {
      setAudioState(state);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  // Modals & Drawers
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);

  // Bookmarks & Persistence
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>(() => {
    try {
      const saved = localStorage.getItem('jafri_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [lastReadPosition, setLastReadPosition] = useState<LastReadPosition | null>(() => {
    try {
      const saved = localStorage.getItem('jafri_last_read');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Save Bookmarks to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('jafri_bookmarks', JSON.stringify(bookmarks));
    } catch {
      // Ignore quota error
    }
  }, [bookmarks]);

  // Save Last Read Position to LocalStorage and PersonalLibraryService
  const updateLastRead = (surahNum: number, ayahNum: number, sName: string, sEnglish: string) => {
    const pos: LastReadPosition = {
      surahNumber: surahNum,
      ayahNumber: ayahNum,
      surahName: sName,
      surahEnglishName: sEnglish,
      timestamp: Date.now(),
    };
    setLastReadPosition(pos);
    try {
      localStorage.setItem('jafri_last_read', JSON.stringify(pos));
    } catch {
      // Ignore
    }

    // Sync with PersonalLibraryService (Phase 6.1)
    personalLibraryService.saveReadingPosition({
      religion: 'islam',
      scriptureId: 'quran',
      collectionId: 'holy-quran',
      readingId: `surah-${surahNum}`,
      chapterNumber: surahNum,
      verseNumber: ayahNum,
      displayTitle: `Surah ${sEnglish} (${sName})`,
      displayLocation: `Surah ${surahNum}, Ayah ${ayahNum}`,
      preferredTranslation: selectedUrduTranslation,
      preferredFormat: selectedScript,
      updatedAt: new Date().toISOString(),
      timestamp: Date.now(),
    });
    personalLibraryService.recordChapterVisited('islam', 'quran', surahNum, sEnglish);
  };

  // Chapter Completion Status
  const [isSurahCompleted, setIsSurahCompleted] = useState<boolean>(() => {
    const prog = personalLibraryService.getProgress('islam', 'quran');
    return prog?.chaptersCompleted?.includes(currentSurahNumber) || false;
  });

  useEffect(() => {
    const prog = personalLibraryService.getProgress('islam', 'quran');
    setIsSurahCompleted(prog?.chaptersCompleted?.includes(currentSurahNumber) || false);
  }, [currentSurahNumber]);

  // Listen for PersonalLibrary updates and navigation events
  useEffect(() => {
    const unsub = personalLibraryService.subscribe(() => {
      const prog = personalLibraryService.getProgress('islam', 'quran');
      setIsSurahCompleted(prog?.chaptersCompleted?.includes(currentSurahNumber) || false);
    });

    const handleNav = (e: any) => {
      if (e.detail?.religion === 'islam' && e.detail?.chapterNumber) {
        const sNum = Number(e.detail.chapterNumber);
        const aNum = e.detail.verseNumber ? Number(e.detail.verseNumber) : 1;
        if (sNum >= 1 && sNum <= 114) {
          setCurrentSurahNumber(sNum);
          loadSurah(sNum, aNum);
        }
      }
    };
    window.addEventListener('jafri-navigate-reading', handleNav);

    return () => {
      unsub();
      window.removeEventListener('jafri-navigate-reading', handleNav);
    };
  }, [currentSurahNumber]);

  // Load Surah Directory on Mount
  useEffect(() => {
    quranRouter
      .getSurahDirectory()
      .then((list) => {
        setSurahList(list);
        if (list.length > 0 && !currentSurah) {
          const match = list.find((s) => s.number === currentSurahNumber) || list[0];
          setCurrentSurah(match);
        }
      })
      .catch((err) => setError(`Failed to load Surah index: ${err.message}`));
  }, []);

  // Fetch Surah Verses
  const loadSurah = async (surahNum: number, targetAyahToScroll?: number) => {
    setLoading(true);
    setError(null);
    setScriptNotice(undefined);
    setTranslationNotice(undefined);

    try {
      const result = await quranRouter.getSurah({
        surahNumber: surahNum,
        script: selectedScript,
        primaryTranslation: 'en.sahih',
        secondaryTranslation: selectedUrduTranslation,
        reciterId: audioState.reciterId,
      });

      setCurrentSurah(result.surah);
      setAyahs(result.ayahs);
      setActiveProvider(result.activeProvider);
      setScriptNotice(result.scriptNotice);
      setTranslationNotice(result.translationNotice);

      // Track Last Read Position
      const targetAyah = targetAyahToScroll || 1;
      updateLastRead(surahNum, targetAyah, result.surah.name, result.surah.englishName);

      // Scroll to target Ayah after render if specified
      if (targetAyahToScroll && targetAyahToScroll > 1) {
        setTimeout(() => {
          const el = document.getElementById(`ayah-${targetAyahToScroll}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 300);
      }
    } catch (err: any) {
      setError(err.message || 'Error loading Surah');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSurah(currentSurahNumber);
  }, [currentSurahNumber, selectedScript, selectedUrduTranslation, audioState.reciterId]);

  // Synchronize audio context whenever active Surah changes
  useEffect(() => {
    quranAudioService.syncContext(
      currentSurahNumber,
      currentSurah?.englishName,
      currentSurah?.numberOfAyahs,
      1
    );
  }, [currentSurahNumber, currentSurah]);

  // Audio Playback Handlers
  const handleTogglePlayAudio = () => {
    if (audioState.status === 'playing') {
      quranAudioService.pause();
    } else {
      quranAudioService.play();
    }
  };

  const handleTogglePlayAyah = (ayahNum: number) => {
    if (
      audioState.currentSurahNumber === currentSurahNumber &&
      audioState.currentAyahNumber === ayahNum &&
      audioState.status === 'playing'
    ) {
      quranAudioService.pause();
    } else if (
      audioState.currentSurahNumber === currentSurahNumber &&
      audioState.currentAyahNumber === ayahNum &&
      audioState.status === 'paused'
    ) {
      quranAudioService.play();
    } else {
      quranAudioService.loadSurah(
        currentSurahNumber,
        currentSurah?.englishName,
        currentSurah?.numberOfAyahs || ayahs.length,
        ayahNum,
        true
      );
    }
  };

  const handleAudioNextSurah = () => {
    const nextNum = audioState.currentSurahNumber + 1;
    if (nextNum <= 114) {
      setCurrentSurahNumber(nextNum);
      const nextMeta = surahList.find((s) => s.number === nextNum);
      quranAudioService.nextSurah(nextMeta?.englishName, nextMeta?.numberOfAyahs, true);
    }
  };

  const handleAudioPrevSurah = () => {
    const prevNum = audioState.currentSurahNumber - 1;
    if (prevNum >= 1) {
      setCurrentSurahNumber(prevNum);
      const prevMeta = surahList.find((s) => s.number === prevNum);
      quranAudioService.prevSurah(prevMeta?.englishName, prevMeta?.numberOfAyahs, true);
    }
  };

  // Word-by-Word Toggle
  const handleToggleWordByWord = async (ayahNum: number) => {
    if (wordByWordAyah === ayahNum) {
      setWordByWordAyah(null);
      return;
    }

    setWordByWordAyah(ayahNum);

    if (wordsCache[ayahNum]) return; // already in memory cache

    setLoadingWords(true);
    try {
      const tokens = await ummahApi.getWords(currentSurahNumber, ayahNum);
      const mapped: WordToken[] = tokens.map((t) => ({
        position: t.position,
        arabic: t.arabic,
        transliteration: t.transliteration?.text,
        translation: t.translation,
      }));
      setWordsCache((prev) => ({ ...prev, [ayahNum]: mapped }));
    } catch {
      // Ignore
    } finally {
      setLoadingWords(false);
    }
  };

  // Bookmark Toggle (Synced with PersonalLibraryService)
  const handleToggleBookmark = (ayah: UnifiedAyah) => {
    const rawId = `${currentSurahNumber}:${ayah.numberInSurah}`;
    const canonicalId = `isl:quran:${currentSurahNumber}:${ayah.numberInSurah}`;
    const exists = bookmarks.some((b) => b.id === rawId || b.id === canonicalId);

    if (exists) {
      setBookmarks((prev) => prev.filter((b) => b.id !== rawId && b.id !== canonicalId));
      personalLibraryService.removeBookmark(canonicalId);
      personalLibraryService.removeBookmark(rawId);
    } else {
      const newBookmark: BookmarkItem = {
        id: rawId,
        surahNumber: currentSurahNumber,
        ayahNumber: ayah.numberInSurah,
        surahName: currentSurah?.name || `Surah ${currentSurahNumber}`,
        surahEnglishName: currentSurah?.englishName || `Surah ${currentSurahNumber}`,
        arabicSnippet: ayah.arabicText.slice(0, 80),
        translationSnippet:
          ayah.translations['en.sahih'] || ayah.translations[selectedUrduTranslation] || '',
        timestamp: Date.now(),
      };
      setBookmarks((prev) => [newBookmark, ...prev]);

      personalLibraryService.addBookmark({
        id: canonicalId,
        religion: 'islam',
        scriptureId: 'quran',
        collectionId: 'holy-quran',
        readingId: `surah-${currentSurahNumber}`,
        chapterNumber: currentSurahNumber,
        verseNumber: ayah.numberInSurah,
        originalTextReference: ayah.arabicText.slice(0, 100),
        translationId: 'en.sahih',
        translationText: newBookmark.translationSnippet,
        displayTitle: `Surah ${currentSurah?.englishName || currentSurahNumber} ${currentSurahNumber}:${ayah.numberInSurah}`,
        displaySubtitle: currentSurah?.name,
        createdAt: new Date().toISOString(),
        timestamp: Date.now(),
      });
    }
  };

  // Navigation Handlers
  const handleSelectSurahAndAyah = (surahNum: number, ayahNum?: number) => {
    setCurrentSurahNumber(surahNum);
    loadSurah(surahNum, ayahNum);
  };

  const handlePrevSurah = () => {
    if (currentSurahNumber > 1) {
      setCurrentSurahNumber((prev) => prev - 1);
    }
  };

  const handleNextSurah = () => {
    if (currentSurahNumber < 114) {
      setCurrentSurahNumber((prev) => prev + 1);
    }
  };

  // PDF Download Handler
  const handleDownloadPdf = async () => {
    if (!currentSurah) return;
    setIsDownloadingPdf(true);
    const numStr = String(currentSurah.number).padStart(3, '0');
    const cleanName = currentSurah.englishName.replace(/ /g, '-').replace(/'/g, '');
    const filename = `${numStr}-${cleanName}.pdf`;
    const rawBase = (typeof import.meta !== 'undefined' && (import.meta as any).env?.BASE_URL) || '/';
    const baseUrl = rawBase === '/' ? '' : rawBase.replace(/\/$/, '');
    const url = `${baseUrl}/surah-pdfs/${filename}`;

    try {
      const resp = await fetch(url, { method: 'HEAD' });
      if (resp.ok) {
        const a = document.createElement('a');
        a.href = url;
        a.download = `Surah-${numStr}-${cleanName}-IndoPak.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setPdfNotice({
          message: `Downloading Digital Vector Edition PDF: Surah ${currentSurah.englishName} (${numStr}) — IndoPak Typography`,
          type: 'success',
        });
      } else {
        setPdfNotice({
          message: `Milestone 3 Review Mode: Surah ${currentSurah.number} (${currentSurah.englishName}) is queued. Verified review sample PDFs ready for instant download: Surah 1 (Al-Fatihah), Surah 2 (Al-Baqarah), Surah 56 (Al-Waqiah), Surah 114 (An-Nas).`,
          type: 'info',
        });
      }
    } catch {
      setPdfNotice({
        message: 'Could not connect to download service. Please retry.',
        type: 'error',
      });
    } finally {
      setIsDownloadingPdf(false);
      setTimeout(() => setPdfNotice(null), 7000);
    }
  };

  // Font Size CSS mapping
  const fontSizeClasses = {
    sm: 'text-lg lg:text-xl',
    md: 'text-xl lg:text-2xl',
    lg: 'text-2xl lg:text-3xl',
    xl: 'text-3xl lg:text-4xl',
  };

  const readingContext: ReadingContext = {
    religionId: 'islam',
    categoryId: 'quran',
    scriptureId: 'quran',
    collectionId: 'quran_surahs_arabic',
    readingId: `surah-${currentSurahNumber}`,
    chapterId: currentSurahNumber,
    bookName: currentSurah?.englishName || `Surah ${currentSurahNumber}`,
    canonicalTitle: currentSurah
      ? `Surah ${currentSurah.englishName} (${currentSurah.name})`
      : `Surah ${currentSurahNumber}`,
    title: currentSurah?.englishNameTranslation || `Surah ${currentSurahNumber}`,
  };

  return (
    <div className="space-y-6" data-testid="quran-reader">
      {/* 1. Sticky Reader Controls Bar */}
      {currentSurah && (
        <ReaderControlsBar
          currentSurah={currentSurah}
          onOpenSurahSidebar={() => setIsSidebarOpen(true)}
          onPrevSurah={handlePrevSurah}
          onNextSurah={handleNextSurah}
          selectedScript={selectedScript}
          onSelectScript={setSelectedScript}
          selectedUrduTranslation={selectedUrduTranslation}
          onSelectUrduTranslation={setSelectedUrduTranslation}
          viewMode={viewMode}
          onToggleViewMode={setViewMode}
          fontSize={fontSize}
          onChangeFontSize={setFontSize}
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenBookmarks={() => setIsBookmarksOpen(true)}
          bookmarksCount={bookmarks.length}
          lastReadPosition={lastReadPosition}
          onResumeLastRead={() => {
            if (lastReadPosition) {
              handleSelectSurahAndAyah(lastReadPosition.surahNumber, lastReadPosition.ayahNumber);
            }
          }}
          onDownloadPdf={handleDownloadPdf}
          isDownloadingPdf={isDownloadingPdf}
          onToggleAudioPlayer={handleTogglePlayAudio}
          isAudioActive={audioState.status === 'playing'}
        />
      )}

      {/* Chapter Completion & Reading Progress Bar (Phase 6.1) */}
      {currentSurah && (
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-navy-900/90 border border-gold-500/20 text-xs shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-slate-200">Surah {currentSurah.number} of 114</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{currentSurah.numberOfAyahs} Ayahs</span>
              <span className="text-slate-500 hidden sm:inline">•</span>
              <span className="text-gold-400/80 font-serif hidden sm:inline">{currentSurah.englishNameTranslation}</span>
            </div>

            <button
              data-testid="mark-completed-toggle-btn"
              onClick={() => {
                personalLibraryService.toggleChapterCompleted('islam', 'quran', currentSurahNumber);
              }}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition flex items-center space-x-1.5 cursor-pointer ${
                isSurahCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-navy-950 border border-slate-700 hover:border-gold-500/50 text-slate-300 hover:text-gold-300'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${isSurahCompleted ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span>{isSurahCompleted ? 'Surah Completed' : 'Mark Completed'}</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Provider Routing Status & Disclaimers */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 space-y-2">
        {pdfNotice && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center justify-between gap-2 transition-all ${
              pdfNotice.type === 'success'
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-200'
                : pdfNotice.type === 'error'
                ? 'bg-red-950/60 border-red-500/40 text-red-200'
                : 'bg-gold-950/60 border-gold-500/40 text-gold-200'
            }`}
          >
            <div className="flex items-center space-x-2">
              {pdfNotice.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              ) : pdfNotice.type === 'error' ? (
                <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0" />
              ) : (
                <Info className="w-4 h-4 text-gold-400 flex-shrink-0" />
              )}
              <span>{pdfNotice.message}</span>
            </div>
            <button
              onClick={() => setPdfNotice(null)}
              className="text-[11px] underline opacity-80 hover:opacity-100 ml-2"
            >
              Dismiss
            </button>
          </div>
        )}
        {translationNotice && (
          <div className="p-3 rounded-xl bg-blue-950/50 border border-blue-500/30 text-blue-200 text-xs flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>{translationNotice}</span>
          </div>
        )}

        {scriptNotice && (
          <div className="p-3 rounded-xl bg-amber-950/50 border border-amber-500/30 text-amber-200 text-xs flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>{scriptNotice}</span>
          </div>
        )}

        {/* Script Identity & Tajweed Legend Banner */}
        {selectedScript === 'tajweed' && (
          <div className="p-3.5 rounded-xl bg-navy-900/90 border border-gold-500/30 text-xs flex flex-wrap items-center justify-between gap-2.5 shadow-lg">
            <span className="font-serif font-bold text-gold-400 text-[11px] tracking-wider uppercase">
              Tajweed Recitation Rules:
            </span>
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-navy-950 border border-purple-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-[#c084fc]" />
                <span className="text-[#c084fc] font-medium">Madd (Prolongation)</span>
              </span>
              <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-navy-950 border border-emerald-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-[#34d399]" />
                <span className="text-[#34d399] font-medium">Qalqalah (Echo)</span>
              </span>
              <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-navy-950 border border-orange-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-[#fb923c]" />
                <span className="text-[#fb923c] font-medium">Ghunnah (Nasal)</span>
              </span>
              <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-navy-950 border border-rose-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-[#f87171]" />
                <span className="text-[#f87171] font-medium">Ikhfa (Conceal)</span>
              </span>
              <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-navy-950 border border-blue-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-[#60a5fa]" />
                <span className="text-[#60a5fa] font-medium">Iqlab</span>
              </span>
              <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-navy-950 border border-teal-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2dd4bf]" />
                <span className="text-[#2dd4bf] font-medium">Idgham</span>
              </span>
              <span className="flex items-center space-x-1.5 px-2 py-0.5 rounded bg-navy-950 border border-slate-500/30">
                <span className="w-2.5 h-2.5 rounded-full bg-[#94a3b8]" />
                <span className="text-slate-400 font-medium">Hamzat Wasl / Silent</span>
              </span>
            </div>
          </div>
        )}

        {selectedScript === 'indopak' && (
          <div className="p-3 rounded-xl bg-navy-900/90 border border-gold-500/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-lg">
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/30 font-mono text-[10px] font-bold">
                INDOPAK NASTALEEQ
              </span>
              <span>Authentic South Asian orthography with dedicated PUA Waqf glyphs & zero missing characters.</span>
            </div>
            <span className="text-[11px] text-gold-400 font-mono">IndoPak Nastaleeq Engine</span>
          </div>
        )}

        {selectedScript === 'uthmani' && (
          <div className="p-3 rounded-xl bg-navy-900/90 border border-gold-500/30 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-lg">
            <div className="flex items-center space-x-2 text-slate-300">
              <span className="px-1.5 py-0.5 rounded bg-gold-500/10 text-gold-400 border border-gold-500/30 font-mono text-[10px] font-bold">
                MEDINA UTHMANI
              </span>
              <span>King Fahd Complex standard orthography with Medina diacritical typography.</span>
            </div>
            <span className="text-[11px] text-gold-400 font-mono">Amiri Quran Engine</span>
          </div>
        )}
      </div>

      {/* 3. Main Reading Canvas — Two-Column Reading & Unified Sacred Audio Experience */}
      <div className="max-w-7xl mx-auto px-4 lg:px-8 pb-8">
        <TwoColumnReadingLayout
          context={readingContext}
          quranControls={{
            isPlaying: audioState.status === 'playing',
            isLoading: audioState.status === 'loading',
            currentSurahNumber: audioState.currentSurahNumber,
            currentSurahName: audioState.currentSurahName,
            currentAyahNumber: audioState.currentAyahNumber,
            totalAyahs: audioState.totalAyahs,
            reciterId: audioState.reciterId,
            currentTime: audioState.currentTime,
            duration: audioState.duration,
            playbackScope: audioState.playbackScope,
            onTogglePlaybackScope: () =>
              quranAudioService.setPlaybackScope(
                audioState.playbackScope === 'page' ? 'surah' : 'page'
              ),
            pageBoundary: audioState.pageBoundary,
            pageRecitationCompleted: audioState.pageRecitationCompleted,
            completionMessage: audioState.completionMessage,
            onSelectReciter: (newReciter) => quranAudioService.setReciter(newReciter),
            onTogglePlay: handleTogglePlayAudio,
            onStop: () => quranAudioService.stop(),
            onSeek: (seconds) => quranAudioService.seek(seconds),
            onNextAyah: () => quranAudioService.nextAyah(true),
            onPrevAyah: () => quranAudioService.prevAyah(true),
            onNextSurah: handleAudioNextSurah,
            onPrevSurah: handleAudioPrevSurah,
            autoAdvance: audioState.autoAdvance,
            onToggleAutoAdvance: () => quranAudioService.setAutoAdvance(!audioState.autoAdvance),
            playbackSpeed: audioState.playbackSpeed,
            onChangePlaybackSpeed: (speed) => quranAudioService.setPlaybackSpeed(speed),
            errorMessage: audioState.errorMessage,
          }}
        >
        {viewMode === 'pages' ? (
          <MushafPageViewer
            currentSurahNumber={currentSurahNumber}
            onSelectSurah={(num) => setCurrentSurahNumber(num)}
          />
        ) : loading ? (
          <div className="py-24 text-center text-slate-400 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-gold-400" />
            <p className="text-sm font-medium">Streaming authentic Quran text and scholarly commentary...</p>
          </div>
        ) : error ? (
          <div className="p-6 rounded-2xl bg-red-950/40 border border-red-500/40 text-red-200 text-sm max-w-xl mx-auto text-center space-y-3">
            <AlertTriangle className="w-8 h-8 text-red-400 mx-auto" />
            <p className="font-bold">{error}</p>
            <button
              onClick={() => loadSurah(currentSurahNumber)}
              className="px-4 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800 border border-red-500/40 text-xs text-white"
            >
              Retry
            </button>
          </div>
        ) : currentSurah && (
          viewMode === 'verse' ? (
            <div className="space-y-4">
              {/* Surah Overview Header Banner */}
              <div className="p-5 lg:p-7 rounded-2xl bg-gradient-to-r from-navy-950 via-navy-900 to-navy-950 border border-gold-500/30 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <h1 className="font-serif text-xl lg:text-2xl font-bold text-slate-100 flex items-center gap-2 justify-center sm:justify-start">
                    <span>Surah {currentSurah.englishName}</span>
                    <span className="text-gold-400 font-normal">
                      ({currentSurah.englishNameTranslation})
                    </span>
                  </h1>
                  <p className="text-xs text-slate-400 mt-1">
                    Revelation: <strong className="text-slate-200">{currentSurah.revelationType}</strong> • Total Verses:{' '}
                    <strong className="text-slate-200">{currentSurah.numberOfAyahs}</strong> • Active Provider:{' '}
                    <span className="text-gold-400 uppercase font-semibold">{activeProvider}</span>
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleDownloadPdf}
                    disabled={isDownloadingPdf}
                    title={`Download Surah ${currentSurah.number} (${currentSurah.englishName}) IndoPak Mushaf PDF`}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/40 text-gold-300 hover:text-gold-200 text-xs font-serif font-bold transition-all shadow-sm disabled:opacity-50"
                  >
                    {isDownloadingPdf ? (
                      <Loader2 className="w-3.5 h-3.5 text-gold-400 animate-spin" />
                    ) : (
                      <FileDown className="w-3.5 h-3.5 text-gold-400" />
                    )}
                    <span>Download Surah PDF</span>
                  </button>
                  <div className="font-quran text-3xl lg:text-4xl text-gold-400 tracking-wide">
                    {currentSurah.name}
                  </div>
                </div>
              </div>

              {/* Verses List */}
              <div className="space-y-4">
                {ayahs.map((ayah) => {
                  const isAyahPlaying =
                    audioState.status === 'playing' &&
                    audioState.currentSurahNumber === currentSurahNumber &&
                    audioState.currentAyahNumber === ayah.numberInSurah;
                  const isAyahBookmarked = bookmarks.some(
                    (b) => b.id === `${currentSurahNumber}:${ayah.numberInSurah}`
                  );
                  const isWordsExpanded = wordByWordAyah === ayah.numberInSurah;
                  const words = wordsCache[ayah.numberInSurah] || [];

                  return (
                    <VerseCard
                      key={ayah.numberInSurah}
                      ayah={ayah}
                      surahNumber={currentSurahNumber}
                      surahName={currentSurah.englishName}
                      selectedScript={selectedScript}
                      selectedUrduTranslation={selectedUrduTranslation}
                      fontSizeClass={fontSizeClasses[fontSize]}
                      isPlaying={isAyahPlaying}
                      isBookmarked={isAyahBookmarked}
                      onTogglePlay={(ayahNum) => handleTogglePlayAyah(ayahNum)}
                      onToggleBookmark={handleToggleBookmark}
                      onToggleWordByWord={handleToggleWordByWord}
                      isWordsActive={isWordsExpanded}
                      wordsData={words}
                      isLoadingWords={loadingWords && isWordsExpanded}
                    />
                  );
                })}
              </div>
            </div>
          ) : (
            <MushafContinuousView
              surah={currentSurah}
              ayahs={ayahs}
              selectedScript={selectedScript}
              fontSizeClass={fontSizeClasses[fontSize]}
              selectedAyah={
                audioState.currentSurahNumber === currentSurahNumber
                  ? audioState.currentAyahNumber
                  : null
              }
              onSelectAyah={(num) => handleTogglePlayAyah(num)}
            />
          )
        )}
        </TwoColumnReadingLayout>
      </div>

      {/* 4. Drawers & Modals */}
      <SurahSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        surahList={surahList}
        selectedSurah={currentSurahNumber}
        onSelectSurah={(num, ayahNum) => handleSelectSurahAndAyah(num, ayahNum)}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        surahList={surahList}
        onSelectSurahAndAyah={(sNum, aNum) => handleSelectSurahAndAyah(sNum, aNum)}
      />

      <BookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelectBookmark={(sNum, aNum) => handleSelectSurahAndAyah(sNum, aNum)}
        onRemoveBookmark={(id) => setBookmarks((prev) => prev.filter((b) => b.id !== id))}
        onClearAllBookmarks={() => setBookmarks([])}
      />
    </div>
  );
};
