// ==============================================================================
// Christianity Scripture Reader Module (Production Integration)
// Public Domain Bibles: KJV, WEB, ASV, YLT
// Jafri Religious Books & Audio Platform
// ==============================================================================

import React, { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Share2,
  Check,
  Search,
  Layers,
  Info,
  Sliders,
  Volume2,
  VolumeX,
  Play,
  Pause,
} from 'lucide-react';
import {
  christianityProvider,
  BibleBookMeta,
  BollsVerseRaw,
  BIBLE_TRANSLATIONS,
  cleanBibleText,
} from '../../services/providers/christianityProvider';
import { ScriptureNavigationDrawer } from '../../platform/components/ScriptureNavigationDrawer';
import { UniversalSearchModal } from '../../platform/components/UniversalSearchModal';
import { UniversalBookmarksDrawer } from '../../platform/components/UniversalBookmarksDrawer';
import { AudioNoticeModal } from '../../platform/components/AudioNoticeModal';
import { MultilingualAudioPlayerBar } from '../../platform/components/MultilingualAudioPlayerBar';
import { TypographyControls } from '../../platform/components/TypographyControls';
import { AttributionFooter } from '../../platform/components/AttributionFooter';
import { platformStorageService } from '../../platform/services/storageService';
import {
  multilingualAudioEngine,
  ScriptureAudioEditionOption,
  ScriptureUnit,
} from '../../platform/services/multilingualAudioEngine';
import { UniversalBookmark } from '../../platform/types';

const CHRISTIANITY_AUDIO_EDITIONS: ScriptureAudioEditionOption[] = [
  {
    id: 'web_librivox',
    name: 'World English Bible — Continuous Audio [Quarantined / Awaiting Permission]',
    language: 'en',
    languageName: 'English (World English Bible)',
    isTranslation: false,
    isSynthesizedNarration: false,
    performerOrNarrator: 'LibriVox Volunteer Reader',
    license: 'Awaiting Written Permission (REC-LIB-01 / REC-LIB-02 Quarantined)',
    provider: 'LibriVox / Archive.org',
  },
  {
    id: 'latin_pater_noster',
    name: "The Lord's Prayer (Pater Noster — Latin Choral Recitation)",
    language: 'la',
    languageName: 'Ecclesiastical Latin',
    isTranslation: false,
    isSynthesizedNarration: false,
    performerOrNarrator: 'The Tudor Consort (Directed by Alastair Carey)',
    license: 'CC BY 3.0 Unported',
    provider: 'The Tudor Consort / Wikimedia Commons',
  },
  {
    id: 'web_narration',
    name: 'World English Bible (WEB) — English Narration [TTS]',
    language: 'en',
    languageName: 'English (WEB)',
    isTranslation: true,
    isSynthesizedNarration: true,
    performerOrNarrator: 'Browser Speech Synthesis (Narration Voice)',
    license: 'Public Domain Text. Client-side Speech Narration',
    provider: 'WebSpeech API',
  },
  {
    id: 'hindi_bible_narration',
    name: 'Pavitra Baibil (पवित्र बाइबिल) — Hindi Narration [TTS]',
    language: 'hi',
    languageName: 'Hindi (हिन्दी)',
    isTranslation: true,
    isSynthesizedNarration: true,
    performerOrNarrator: 'Browser Speech Synthesis (Hindi Voice)',
    license: 'Public Domain Text. Client-side Speech Narration',
    provider: 'WebSpeech API',
  },
];

interface ChristianityModuleProps {
  onReturnToHome: () => void;
}

export const ChristianityModule: React.FC<ChristianityModuleProps> = ({
  onReturnToHome,
}) => {
  // Book & Chapter State
  const [books, setBooks] = useState<BibleBookMeta[]>([]);
  const [selectedTranslation, setSelectedTranslation] = useState<string>('KJV');
  const [currentBookId, setCurrentBookId] = useState<number>(1); // 1 = Genesis
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [verses, setVerses] = useState<BollsVerseRaw[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);

  // Platform Controls & Drawers
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);
  const [isAudioNoticeOpen, setIsAudioNoticeOpen] = useState<boolean>(false);
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState<boolean>(false);
  const [activeAudioUnitId, setActiveAudioUnitId] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [showTypography, setShowTypography] = useState<boolean>(false);
  const [preferences, setPreferences] = useState(() =>
    platformStorageService.getPreferences()
  );
  const [bookmarks, setBookmarks] = useState<UniversalBookmark[]>(() =>
    platformStorageService.getBookmarks('christianity')
  );

  useEffect(() => {
    const unsub = multilingualAudioEngine.subscribe((st) => {
      setActiveAudioUnitId(st.activeUnitId);
      setIsAudioPlaying(st.playbackState === 'playing');
    });
    return () => {
      unsub();
      multilingualAudioEngine.stop();
    };
  }, []);

  // Load Books List
  useEffect(() => {
    let mounted = true;
    christianityProvider.getBooks(selectedTranslation).then((bList) => {
      if (mounted) setBooks(bList);
    });
    return () => {
      mounted = false;
    };
  }, [selectedTranslation]);

  // Load Chapter Verses
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    christianityProvider
      .getChapterVerses(currentBookId, currentChapter, selectedTranslation)
      .then((vList) => {
        if (mounted) {
          setVerses(vList);
          setLoading(false);
          // Save reading progress
          const currentBook = books.find((b) => b.bookid === currentBookId);
          if (currentBook) {
            platformStorageService.saveProgress({
              religionId: 'christianity',
              collectionId: `bible-${selectedTranslation.toLowerCase()}`,
              lastAddress: {
                religionId: 'christianity',
                collectionId: `bible-${selectedTranslation.toLowerCase()}`,
                path: [
                  { levelName: 'Book', identifier: currentBookId, label: currentBook.name },
                  { levelName: 'Chapter', identifier: currentChapter, label: `Chapter ${currentChapter}` },
                ],
                unitIdentifier: 1,
              },
              displayLocation: `${currentBook.name} ${currentChapter}`,
              updatedAtTimestamp: Date.now(),
            });
          }
        }
      });

    return () => {
      mounted = false;
    };
  }, [currentBookId, currentChapter, selectedTranslation, books]);

  const currentBook = books.find((b) => b.bookid === currentBookId) || {
    bookid: 1,
    name: 'Genesis',
    chapters: 50,
    chronorder: 1,
  };

  const currentTransMeta =
    BIBLE_TRANSLATIONS.find((t) => t.id === selectedTranslation) ||
    BIBLE_TRANSLATIONS[0];

  const handleNextChapter = () => {
    multilingualAudioEngine.stop();
    setIsAudioPlayerVisible(false);
    setActiveAudioUnitId(null);
    if (currentChapter < currentBook.chapters) {
      setCurrentChapter((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Advance to next book
      const nextBook = books.find((b) => b.bookid === currentBookId + 1);
      if (nextBook) {
        setCurrentBookId(nextBook.bookid);
        setCurrentChapter(1);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handlePreviousChapter = () => {
    multilingualAudioEngine.stop();
    setIsAudioPlayerVisible(false);
    setActiveAudioUnitId(null);
    if (currentChapter > 1) {
      setCurrentChapter((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Step back to previous book
      const prevBook = books.find((b) => b.bookid === currentBookId - 1);
      if (prevBook) {
        setCurrentBookId(prevBook.bookid);
        setCurrentChapter(prevBook.chapters);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const isGalatians = currentBookId === 48;
  const isEphesians = currentBookId === 49;
  const isPaterNosterChapter = currentBookId === 40 && currentChapter === 6;
  const isChapterAudioAvailable = isPaterNosterChapter; // Strictly Matthew 6:9–13 cleared (Pater Noster); LibriVox quarantined

  useEffect(() => {
    if (verses.length === 0) return;

    // LibriVox recordings REC-LIB-01 and REC-LIB-02 strictly blocked pending written permission
    const units: ScriptureUnit[] = verses.map((v) => {
      const cleanText = cleanBibleText(v.text);
      let vAudioUrl: string | null = null;
      let vAudio: any = undefined;

      if (isPaterNosterChapter && v.verse >= 9 && v.verse <= 13) {
        vAudioUrl =
          '/audio/christianity/christianity_prayers_pater_noster_the_tudor_consort.ogg';
        vAudio = {
          audioUrl: vAudioUrl,
          performer: 'The Tudor Consort (Directed by Alastair Carey)',
          source: 'The Tudor Consort / Wikimedia Commons',
          license: 'CC BY 3.0 Unported',
          isHuman: true,
          title: "The Lord's Prayer (Pater Noster • Matthew 6:9–13)",
        };
      }

      return {
        id: `chr_${currentBookId}_${currentChapter}_${v.verse}`,
        label: `${currentBook.name} ${currentChapter}:${v.verse}`,
        originalText: cleanText,
        translationText: cleanText,
        translations: {
          en: cleanText,
        },
        originalAudioUrl: vAudioUrl,
        translationAudioUrl: null,
        startTime: undefined, // Zero fabricated timestamps
        endTime: undefined,
        audio: vAudio,
      };
    });

    multilingualAudioEngine.loadUnits('christianity', units);
  }, [
    verses,
    currentBookId,
    currentChapter,
    currentBook.name,
    isGalatians,
    isEphesians,
    isPaterNosterChapter,
  ]);

  const handlePlayVerse = (verseNum: number) => {
    const unitId = `chr_${currentBookId}_${currentChapter}_${verseNum}`;
    setIsAudioPlayerVisible(true);
    multilingualAudioEngine.play(unitId);
  };

  const handleToggleAudioPlayer = () => {
    if (isAudioPlayerVisible && isAudioPlaying) {
      multilingualAudioEngine.pause();
    } else {
      setIsAudioPlayerVisible(true);
      if (activeAudioUnitId) {
        if (multilingualAudioEngine.getState().playbackState === 'paused') {
          multilingualAudioEngine.resume();
        } else {
          multilingualAudioEngine.play(activeAudioUnitId);
        }
      } else if (verses.length > 0) {
        handlePlayVerse(verses[0].verse);
      }
    }
  };

  const handleToggleBookmark = (v: BollsVerseRaw) => {
    const bookmarkId = `chr:${selectedTranslation}:${currentBookId}:${currentChapter}:${v.verse}`;
    const exists = bookmarks.some((b) => b.id === bookmarkId);

    if (exists) {
      platformStorageService.removeBookmark(bookmarkId);
    } else {
      const bkm: UniversalBookmark = {
        id: bookmarkId,
        religionId: 'christianity',
        collectionId: `bible-${selectedTranslation.toLowerCase()}`,
        address: {
          religionId: 'christianity',
          collectionId: `bible-${selectedTranslation.toLowerCase()}`,
          path: [
            { levelName: 'Book', identifier: currentBookId, label: currentBook.name },
            { levelName: 'Chapter', identifier: currentChapter, label: `Chapter ${currentChapter}` },
          ],
          unitIdentifier: v.verse,
        },
        displayTitle: `${currentBook.name} ${currentChapter}:${v.verse} (${selectedTranslation})`,
        snippetRootText: cleanBibleText(v.text),
        savedAtTimestamp: Date.now(),
      };
      platformStorageService.saveBookmark(bkm);
    }
    setBookmarks(platformStorageService.getBookmarks('christianity'));
  };

  const handleCopyVerse = (v: BollsVerseRaw) => {
    const text = `"${cleanBibleText(v.text)}" — ${currentBook.name} ${currentChapter}:${v.verse} (${selectedTranslation})`;
    navigator.clipboard.writeText(text);
    setCopiedVerse(v.verse);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Breadcrumb & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-950 border border-slate-800 shadow-lg">
        {/* Navigation & Book Selector */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              multilingualAudioEngine.stop();
              setIsAudioPlayerVisible(false);
              setActiveAudioUnitId(null);
              onReturnToHome();
            }}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-navy-950/80 border border-slate-700/80 hover:border-gold-500/50 text-slate-300 hover:text-gold-300 text-xs font-medium transition"
            title="Return to Platform Overview"
          >
            <span>&larr; Library</span>
          </button>

          <button
            onClick={() => setIsNavOpen(true)}
            data-testid="christianity-nav-drawer-btn"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-200 hover:text-gold-400 text-xs font-semibold transition"
          >
            <Layers className="w-4 h-4" />
            <span>Books & Chapters</span>
          </button>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-100">Holy Bible</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs font-serif text-gold-400 font-bold">
              {currentBook.name} {currentChapter}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {verses.length} verses
            </span>
          </div>
        </div>

        {/* Action Buttons: Translation, Search, Bookmarks, Typography */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          {/* Translation Dropdown */}
          <select
            value={selectedTranslation}
            onChange={(e) => setSelectedTranslation(e.target.value)}
            className="bg-navy-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-gold-500 font-semibold cursor-pointer"
          >
            {BIBLE_TRANSLATIONS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.id} — {t.name}
              </option>
            ))}
          </select>

          {/* Multilingual Audio Player Button */}
          <button
            onClick={handleToggleAudioPlayer}
            disabled={!isChapterAudioAvailable}
            title={
              isChapterAudioAvailable
                ? 'Play Scripture Audio'
                : 'Audio recording not cleared for this chapter. Text-only mode active.'
            }
            className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition ${
              !isChapterAudioAvailable
                ? 'bg-navy-950 border-slate-800 text-slate-500 opacity-40 cursor-not-allowed'
                : isAudioPlayerVisible
                ? 'bg-gold-500 text-navy-950 font-bold border-gold-400'
                : 'bg-navy-950 border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400'
            }`}
            data-testid="multilingual-audio-btn"
          >
            {isAudioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">Play Audio</span>
          </button>

          {/* Audio Notice Button */}
          <button
            onClick={() => setIsAudioNoticeOpen(true)}
            title="Spoken Bible Audio Status"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400 text-xs font-semibold transition"
            data-testid="audio-notice-btn"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Audio</span>
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            title="Search the Bible"
            data-testid="christianity-search-btn"
            className="p-2 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400 text-xs transition"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsBookmarksOpen(true)}
            title="Saved Bible Bookmarks"
            className="p-2 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400 text-xs transition relative"
          >
            <Bookmark className="w-4 h-4" />
            {bookmarks.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-500 text-navy-950 rounded-full text-[10px] font-bold flex items-center justify-center">
                {bookmarks.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setShowTypography(!showTypography)}
            title="Appearance settings"
            className={`p-2 rounded-xl border text-xs transition ${
              showTypography
                ? 'bg-gold-500 text-navy-950 border-gold-500'
                : 'bg-navy-950 border-slate-700 text-slate-300 hover:text-gold-400'
            }`}
          >
            <Sliders className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Typography Controls Bar */}
      {showTypography && (
        <div className="animate-in fade-in-50 duration-150">
          <TypographyControls
            preferences={preferences}
            onChangePreferences={(p) => {
              const updated = { ...preferences, ...p };
              setPreferences(updated);
              platformStorageService.savePreferences(updated);
            }}
          />
        </div>
      )}

      {/* Chapter Selection Bar */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-navy-950/60 border border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-semibold">Jump to Chapter:</span>
          <div className="flex items-center space-x-1 max-w-[280px] sm:max-w-md overflow-x-auto py-1">
            {Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map((ch) => (
              <button
                key={ch}
                data-testid={`chapter-btn-${ch}`}
                onClick={() => {
                  setCurrentChapter(ch);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                  currentChapter === ch
                    ? 'bg-gold-500 text-navy-950 shadow-gold-sm'
                    : 'bg-navy-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            data-testid="prev-chapter-btn"
            disabled={currentBookId === 1 && currentChapter === 1}
            onClick={handlePreviousChapter}
            className="p-1.5 rounded-lg bg-navy-900 border border-slate-700 text-slate-300 hover:text-gold-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            data-testid="next-chapter-btn"
            disabled={
              currentBookId === (books[books.length - 1]?.bookid || 66) &&
              currentChapter === currentBook.chapters
            }
            onClick={handleNextChapter}
            className="p-1.5 rounded-lg bg-navy-900 border border-slate-700 text-slate-300 hover:text-gold-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Scripture Reading Cards Area */}
      <main className="space-y-3 min-h-[400px]">
        {loading ? (
          <div className="py-20 text-center text-slate-400 text-xs space-y-2">
            <div className="w-6 h-6 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Loading {currentBook.name} {currentChapter} ({selectedTranslation})...</p>
          </div>
        ) : verses.length === 0 ? (
          <div className="py-20 text-center text-slate-500 text-xs space-y-2">
            <Info className="w-8 h-8 mx-auto text-slate-600" />
            <p>Chapter text currently unavailable from provider. Try selecting another translation.</p>
          </div>
        ) : (
          verses.map((v) => {
            const unitId = `chr_${currentBookId}_${currentChapter}_${v.verse}`;
            const isPlayingThisVerse = activeAudioUnitId === unitId && isAudioPlaying;
            const isBookmarked = bookmarks.some(
              (b) =>
                b.id ===
                `chr:${selectedTranslation}:${currentBookId}:${currentChapter}:${v.verse}`
            );
            return (
              <div
                key={v.pk}
                id={`verse-${v.verse}`}
                className={`p-4 sm:p-5 rounded-2xl border transition space-y-2 group ${
                  isPlayingThisVerse
                    ? 'bg-gold-500/15 border-gold-500/60 shadow-lg ring-1 ring-gold-500/50'
                    : 'bg-navy-950/70 hover:bg-navy-900/80 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-baseline space-x-2.5">
                    <button
                      disabled={true}
                      data-testid={`play-verse-${v.verse}-btn`}
                      className="p-1 rounded text-slate-600 cursor-not-allowed opacity-40 transition"
                      title={
                        isChapterAudioAvailable
                          ? 'Continuous audio available via player bar. Verse-by-verse sync not available.'
                          : 'Audio recording not cleared for this chapter. Text-only mode active.'
                      }
                    >
                      <VolumeX className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-gold-400 text-xs px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/20">
                      {v.verse}
                    </span>
                    <p
                      style={{ fontSize: `${preferences.fontSizeRem}rem` }}
                      className="text-slate-100 font-serif leading-relaxed"
                    >
                      {cleanBibleText(v.text)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition flex-shrink-0">
                    <button
                      onClick={() => handleCopyVerse(v)}
                      title="Copy verse"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                    >
                      {copiedVerse === v.verse ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleToggleBookmark(v)}
                      title="Save bookmark"
                      className={`p-1.5 rounded-lg transition ${
                        isBookmarked
                          ? 'text-gold-400 bg-gold-500/10'
                          : 'text-slate-400 hover:text-gold-400 hover:bg-slate-800'
                      }`}
                    >
                      <Bookmark className="w-3.5 h-3.5" fill={isBookmarked ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </main>

      {/* Chapter Pagination Bottom Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          disabled={currentBookId === 1 && currentChapter === 1}
          onClick={handlePreviousChapter}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold border bg-navy-950 border-slate-700 text-slate-200 hover:border-gold-500 hover:text-gold-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Chapter</span>
        </button>

        <button
          disabled={
            currentBookId === (books[books.length - 1]?.bookid || 66) &&
            currentChapter === currentBook.chapters
          }
          onClick={handleNextChapter}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold border bg-navy-950 border-slate-700 text-slate-200 hover:border-gold-500 hover:text-gold-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <span>Next Chapter</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Audio Transparency & Integrity Note */}
      <div className="p-3.5 rounded-2xl bg-navy-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <span>
            <strong>Audio Bible Status:</strong> Complete spoken chapter audio is authorized via Faith Comes By Hearing (Bible Brain DBP v4). Free institutional API registration is pending configuration; audio controls remain hidden to prevent unauthenticated stream errors.
          </span>
        </div>
      </div>

      {/* Standardized Provenance & Attribution Footer */}
      <AttributionFooter
        provenance={{
          sourceName: 'Bolls Life Bible API (Open Biblical Text Repository)',
          sourceUrl: 'https://bolls.life',
          licenseType: currentTransMeta.license as any,
          attributionText: `${currentTransMeta.name} — ${currentTransMeta.attribution}`,
          isAiGenerated: false,
          verifiedDate: '2026-11-17',
        }}
      />

      {/* Navigation Drawer: Books & Chapters */}
      <ScriptureNavigationDrawer
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        title="Bible Books & Canonical Sections"
        hierarchyLabels={['Testament', 'Book', 'Chapter']}
        nodes={books.map((b) => ({
          id: b.bookid,
          levelIndex: 1,
          levelName: 'Book',
          title: b.name,
          nativeTitle: b.bookid <= 39 ? 'Old Testament' : 'New Testament',
          hasChildren: false,
          unitCount: b.chapters,
          targetAddress: {
            religionId: 'christianity',
            collectionId: `bible-${selectedTranslation.toLowerCase()}`,
            path: [
              { levelName: 'Book', identifier: b.bookid, label: b.name },
              { levelName: 'Chapter', identifier: 1, label: 'Chapter 1' },
            ],
            unitIdentifier: 1,
          },
        }))}
        onSelectAddress={(addr) => {
          multilingualAudioEngine.stop();
          setIsAudioPlayerVisible(false);
          setActiveAudioUnitId(null);
          const bId = Number(addr.path[0]?.identifier) || 1;
          const chId = Number(addr.path[1]?.identifier) || 1;
          setCurrentBookId(bId);
          setCurrentChapter(chId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Search Modal */}
      <UniversalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        collectionTitle={`Holy Bible (${selectedTranslation})`}
        onSearch={(q) => christianityProvider.search(q, selectedTranslation)}
        onSelectResult={(addr) => {
          multilingualAudioEngine.stop();
          setIsAudioPlayerVisible(false);
          setActiveAudioUnitId(null);
          const bId = Number(addr.path[0]?.identifier) || 1;
          const chId = Number(addr.path[1]?.identifier) || 1;
          setCurrentBookId(bId);
          setCurrentChapter(chId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Bookmarks Drawer */}
      <UniversalBookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelectBookmark={(addr) => {
          multilingualAudioEngine.stop();
          setIsAudioPlayerVisible(false);
          setActiveAudioUnitId(null);
          const bId = Number(addr.path[0]?.identifier) || 1;
          const chId = Number(addr.path[1]?.identifier) || 1;
          setCurrentBookId(bId);
          setCurrentChapter(chId);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onRemoveBookmark={(id) => {
          platformStorageService.removeBookmark(id);
          setBookmarks(platformStorageService.getBookmarks('christianity'));
        }}
        onClearBookmarks={(rel) => {
          platformStorageService.clearBookmarks(rel);
          setBookmarks(platformStorageService.getBookmarks('christianity'));
        }}
      />

      {/* Audio Status & Licensing Notice Modal */}
      <AudioNoticeModal
        isOpen={isAudioNoticeOpen}
        onClose={() => setIsAudioNoticeOpen(false)}
        religionId="christianity"
      />

      {/* Multilingual Audio Player Bar */}
      {isAudioPlayerVisible && (
        <MultilingualAudioPlayerBar
          title={`${currentBook.name} ${currentChapter}`}
          subtitle={selectedTranslation}
          availableEditions={CHRISTIANITY_AUDIO_EDITIONS}
          onOpenProvenanceModal={() => setIsAudioNoticeOpen(true)}
          onClose={() => {
            multilingualAudioEngine.stop();
            setIsAudioPlayerVisible(false);
          }}
        />
      )}
    </div>
  );
};
