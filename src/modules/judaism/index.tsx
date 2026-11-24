// ==============================================================================
// Judaism Scripture Reader Module (Production Integration)
// Tanakh: Hebrew Masoretic Text with Vocalization (Nikud) & English Translation
// Audio Recitation via Mechon Mamre (Shmuel Ofen)
// Jafri Religious Books & Audio Platform
// ==============================================================================

import React, { useState, useEffect } from 'react';
import {
  Layers,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  Share2,
  Check,
  Search,
  Sliders,
  Play,
  VolumeX,
  Info,
  Youtube,
  WifiOff,
  RotateCcw,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';
import {
  judaismProvider,
  TANAKH_BOOKS,
  TanakhBookMeta,
  TanakhVerseData,
} from '../../services/providers/judaismProvider';
import { ScriptureNavigationDrawer } from '../../platform/components/ScriptureNavigationDrawer';
import { UniversalSearchModal } from '../../platform/components/UniversalSearchModal';
import { UniversalBookmarksDrawer } from '../../platform/components/UniversalBookmarksDrawer';
import { TypographyControls } from '../../platform/components/TypographyControls';
import { GenericAudioPlayerBar } from '../../platform/components/GenericAudioPlayerBar';
import { MultilingualAudioPlayerBar } from '../../platform/components/MultilingualAudioPlayerBar';
import { AudioNoticeModal } from '../../platform/components/AudioNoticeModal';
import { ScriptureCoverageModal } from '../../platform/components/ScriptureCoverageModal';
import { YouTubeEmbedModal } from '../../platform/components/audio/YouTubeEmbedModal';
import { SACRED_AUDIO_MASTER_CATALOGUE } from '../../platform/data/sacredAudioMasterCatalogue';
import { AttributionFooter } from '../../platform/components/AttributionFooter';
import { platformStorageService } from '../../platform/services/storageService';
import { genericAudioService } from '../../platform/services/audioService';
import {
  multilingualAudioEngine,
  ScriptureAudioEditionOption,
  ScriptureUnit,
} from '../../platform/services/multilingualAudioEngine';
import { UniversalBookmark } from '../../platform/types';
import { TwoColumnReadingLayout } from '../../platform/components/layout/TwoColumnReadingLayout';
import { ReadingContext } from '../../platform/services/contextualAudioMatcher';

const JUDAISM_AUDIO_EDITIONS: ScriptureAudioEditionOption[] = [
  {
    id: 'mechon_mamre_ofen',
    name: 'Cantor Shmuel Ofen (Mechon Mamre Hebrew Recitation)',
    language: 'he',
    languageName: 'Hebrew (עברית)',
    isTranslation: false,
    isSynthesizedNarration: false,
    performerOrNarrator: 'Cantor Shmuel Ofen (Mechon Mamre)',
    license: 'Free Non-Commercial Educational Listening (Mechon Mamre)',
    provider: 'Mechon Mamre (mechon-mamre.org)',
  },
  {
    id: 'jps_english_narration',
    name: 'JPS 1917 English Translation — Narration [TTS]',
    language: 'en',
    languageName: 'English (JPS 1917)',
    isTranslation: true,
    isSynthesizedNarration: true,
    performerOrNarrator: 'Browser Speech Synthesis (Narration Voice)',
    license: 'Public Domain JPS 1917 Text. Client Speech Narration',
    provider: 'WebSpeech API',
  },
  {
    id: 'hindi_torah_narration',
    name: 'Hindi Torah Translation — Narration [TTS]',
    language: 'hi',
    languageName: 'Hindi (हिन्दी अनुवाद)',
    isTranslation: true,
    isSynthesizedNarration: true,
    performerOrNarrator: 'Browser Speech Synthesis (Hindi Voice)',
    license: 'Approved Text Translation. Client Speech Narration',
    provider: 'WebSpeech API',
  },
];

interface JudaismModuleProps {
  onReturnToHome: () => void;
}

export const JudaismModule: React.FC<JudaismModuleProps> = ({
  onReturnToHome,
}) => {
  // Book & Chapter State
  const [currentBook, setCurrentBook] = useState<TanakhBookMeta>(TANAKH_BOOKS[0]); // Genesis
  const [currentChapter, setCurrentChapter] = useState<number>(1);
  const [verses, setVerses] = useState<TanakhVerseData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedVerse, setCopiedVerse] = useState<number | null>(null);

  // Hebrew Text View Toggles
  const [showEnglish, setShowEnglish] = useState<boolean>(true);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isMultilingualPlayerVisible, setIsMultilingualPlayerVisible] = useState<boolean>(false);
  const [activeAudioUnitId, setActiveAudioUnitId] = useState<string | null>(null);
  const [isMultilingualPlaying, setIsMultilingualPlaying] = useState<boolean>(false);
  const [isAudioNoticeOpen, setIsAudioNoticeOpen] = useState<boolean>(false);
  const [isCoverageOpen, setIsCoverageOpen] = useState<boolean>(false);
  const [retryTrigger, setRetryTrigger] = useState<number>(0);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState<boolean>(false);

  // Requirement for Shema Yisrael (REQ-JUD-020)
  const shemaReq = SACRED_AUDIO_MASTER_CATALOGUE.find((r) => r.id === 'REQ-JUD-020') || null;

  // Platform Controls & Drawers
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);
  const [showTypography, setShowTypography] = useState<boolean>(false);
  const [preferences, setPreferences] = useState(() =>
    platformStorageService.getPreferences()
  );
  const [bookmarks, setBookmarks] = useState<UniversalBookmark[]>(() =>
    platformStorageService.getBookmarks('judaism')
  );

  useEffect(() => {
    const unsub = multilingualAudioEngine.subscribe((st) => {
      setActiveAudioUnitId(st.activeUnitId);
      setIsMultilingualPlaying(st.playbackState === 'playing');
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (verses.length === 0) return;
    // Mechon Mamre audio strictly quarantined pending formal written streaming authorization
    const units: ScriptureUnit[] = verses.map((v) => {
      return {
        id: `jud_${currentBook.id}_${currentChapter}_${v.verseNumber}`,
        label: `${currentBook.enTitle} ${currentChapter}:${v.verseNumber}`,
        originalText: v.hebrewText,
        translationText: v.englishText,
        translations: {
          en: v.englishText,
        },
        originalAudioUrl: null, // Strictly blocked: awaiting written permission
        translationAudioUrl: null,
        startTime: undefined, // Zero fabricated timestamps
        endTime: undefined,
      };
    });

    multilingualAudioEngine.loadUnits('judaism', units);
  }, [verses, currentBook, currentChapter]);

  const handlePlayVerse = (verseNum: number) => {
    const unitId = `jud_${currentBook.id}_${currentChapter}_${verseNum}`;
    setIsMultilingualPlayerVisible(true);
    multilingualAudioEngine.play(unitId);
  };

  const handleToggleMultilingualPlayer = () => {
    if (isMultilingualPlayerVisible && isMultilingualPlaying) {
      multilingualAudioEngine.pause();
    } else {
      setIsMultilingualPlayerVisible(true);
      if (activeAudioUnitId) {
        if (multilingualAudioEngine.getState().playbackState === 'paused') {
          multilingualAudioEngine.resume();
        } else {
          multilingualAudioEngine.play(activeAudioUnitId);
        }
      } else if (verses.length > 0) {
        handlePlayVerse(verses[0].verseNumber);
      }
    }
  };

  // Fetch Chapter Verses from Sefaria
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    judaismProvider.getChapter(currentBook.id, currentChapter).then((data) => {
      if (mounted) {
        setVerses(data);
        setLoading(false);
        // Save reading progress if verses exist
        if (data.length > 0) {
          platformStorageService.saveProgress({
            religionId: 'judaism',
            collectionId: 'tanakh',
            lastAddress: {
              religionId: 'judaism',
              collectionId: 'tanakh',
              path: [
                { levelName: 'Book', identifier: currentBook.id, label: currentBook.enTitle },
                { levelName: 'Chapter', identifier: currentChapter, label: `Chapter ${currentChapter}` },
              ],
              unitIdentifier: 1,
            },
            displayLocation: `${currentBook.enTitle} ${currentChapter}`,
            updatedAtTimestamp: Date.now(),
          });
        }
      }
    }).catch(() => {
      if (mounted) {
        setVerses([]);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [currentBook, currentChapter, retryTrigger]);

  // Audio Sync Listener
  useEffect(() => {
    const unsub = genericAudioService.subscribe((state) => {
      setIsPlayingAudio(state.status === 'playing');
    });
    return () => unsub();
  }, []);

  const handleNextChapter = () => {
    if (currentChapter < currentBook.chapters) {
      setCurrentChapter((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapter > 1) {
      setCurrentChapter((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePlayChapterAudio = () => {
    const audioUrl = judaismProvider.getAudioUrl(currentBook, currentChapter);
    if (!audioUrl) return;

    if (isPlayingAudio) {
      genericAudioService.pause();
    } else {
      genericAudioService.loadTrack(
        `tanakh-${currentBook.id}-${currentChapter}`,
        `${currentBook.enTitle} — Chapter ${currentChapter}`,
        'Hebrew Recitation (Shmuel Ofen, Mechon Mamre)',
        audioUrl
      );
      genericAudioService.play();
    }
  };

  const handleToggleBookmark = (v: TanakhVerseData) => {
    const bookmarkId = `jud:tanakh:${currentBook.id}:${currentChapter}:${v.verseNumber}`;
    const exists = bookmarks.some((b) => b.id === bookmarkId);

    if (exists) {
      platformStorageService.removeBookmark(bookmarkId);
    } else {
      const bkm: UniversalBookmark = {
        id: bookmarkId,
        religionId: 'judaism',
        collectionId: 'tanakh',
        address: {
          religionId: 'judaism',
          collectionId: 'tanakh',
          path: [
            { levelName: 'Book', identifier: currentBook.id, label: currentBook.enTitle },
            { levelName: 'Chapter', identifier: currentChapter, label: `Chapter ${currentChapter}` },
          ],
          unitIdentifier: v.verseNumber,
        },
        displayTitle: `${currentBook.enTitle} ${currentChapter}:${v.verseNumber}`,
        snippetRootText: v.hebrewText,
        snippetTranslatedText: v.englishText,
        savedAtTimestamp: Date.now(),
      };
      platformStorageService.saveBookmark(bkm);
    }
    setBookmarks(platformStorageService.getBookmarks('judaism'));
  };

  const handleCopyVerse = (v: TanakhVerseData) => {
    const text = `${v.hebrewText}\n"${v.englishText}"\n— ${currentBook.enTitle} ${currentChapter}:${v.verseNumber}`;
    navigator.clipboard.writeText(text);
    setCopiedVerse(v.verseNumber);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Breadcrumb & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-950 border border-slate-800 shadow-lg">
        {/* Navigation & Book Indicator */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onReturnToHome}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-navy-950/80 border border-slate-700/80 hover:border-gold-500/50 text-slate-300 hover:text-gold-300 text-xs font-medium transition"
            title="Return to Platform Overview"
          >
            <span>&larr; Library</span>
          </button>

          <button
            onClick={() => setIsNavOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-200 hover:text-gold-400 text-xs font-semibold transition"
          >
            <Layers className="w-4 h-4" />
            <span>Tanakh Books</span>
          </button>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-100">Tanakh</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs font-serif text-gold-400 font-bold">
              {currentBook.enTitle} {currentChapter}
            </span>
            <span className="text-xs font-serif text-sky-400 font-bold">
              ({currentBook.heTitle})
            </span>
          </div>
        </div>

        {/* Action Controls: Audio Play Button, Translation Toggle, Search, Bookmarks, Typography */}
        <div className="flex items-center space-x-2 self-end sm:self-auto flex-wrap">
          {/* Shema Yisrael Approved YouTube Chanting (REQ-JUD-020) */}
          {currentBook.id === 'Deuteronomy' && currentChapter === 6 && shemaReq && (
            <button
              onClick={() => setIsYouTubeModalOpen(true)}
              title="Listen to Shema Yisrael (Accepted YouTube Chanting • REQ-JUD-020)"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 hover:border-purple-400 text-purple-300 text-xs font-bold transition shadow-sm"
              data-testid="shema-youtube-btn"
            >
              <Youtube className="w-3.5 h-3.5 text-red-400" />
              <span>Shema Chanting</span>
            </button>
          )}

          {/* Working Audio Stream Play Button — Restricted by NonCommercial License */}
          {currentBook.mechonMamreCode && (
            <button
              disabled={true}
              onClick={handlePlayChapterAudio}
              title="Hebrew recitation by Cantor Shmuel Ofen (Mechon Mamre) is restricted by Mechon Mamre to personal non-commercial study; written streaming authorization under Permanent Audio Copyright Policy is pending."
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-navy-950 border border-slate-800 text-slate-500 opacity-50 cursor-not-allowed"
            >
              <VolumeX className="w-3.5 h-3.5" />
              <span>Awaiting Permission (NonCommercial)</span>
            </button>
          )}

          {/* Multilingual Audio Engine Button */}
          <button
            onClick={handleToggleMultilingualPlayer}
            disabled={true}
            title="Multilingual Audio Player awaiting rights-cleared Hebrew audio."
            data-testid="multilingual-audio-btn"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold bg-navy-950 border-slate-800 text-slate-500 opacity-40 cursor-not-allowed"
          >
            <Play className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Multilingual Audio</span>
          </button>

          {/* Audio Recitation Status Notice Button */}
          <button
            onClick={() => setIsAudioNoticeOpen(true)}
            title="Hebrew Scripture Audio Status & Licensing Notice"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400 text-xs font-semibold transition"
            data-testid="audio-notice-btn"
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Audio Status</span>
          </button>

          {/* Toggle English Translation */}
          <button
            onClick={() => setShowEnglish(!showEnglish)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium transition ${
              showEnglish
                ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/40'
                : 'bg-navy-950 border-slate-700 text-slate-400'
            }`}
          >
            English (JPS)
          </button>

          {/* Scripture Coverage Disclosure Button */}
          <button
            onClick={() => setIsCoverageOpen(true)}
            title="Scripture Coverage & Availability Disclosure"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400 text-xs font-semibold transition cursor-pointer"
            data-testid="judaism-coverage-btn"
          >
            <BookOpen className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden sm:inline">Coverage</span>
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            title="Search the Tanakh"
            className="p-2 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400 text-xs transition"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsBookmarksOpen(true)}
            title="Saved Tanakh Bookmarks"
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

      {/* Chapter Selection Pill Bar */}
      <div className="flex items-center justify-between p-3 rounded-2xl bg-navy-950/60 border border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <span className="text-slate-400 font-semibold">Chapter:</span>
          <div className="flex items-center space-x-1 max-w-[280px] sm:max-w-md overflow-x-auto py-1">
            {Array.from({ length: currentBook.chapters }, (_, i) => i + 1).map((ch) => (
              <button
                key={ch}
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
            disabled={currentChapter <= 1}
            onClick={handlePreviousChapter}
            className="p-1.5 rounded-lg bg-navy-900 border border-slate-700 text-slate-300 hover:text-gold-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            disabled={currentChapter >= currentBook.chapters}
            onClick={handleNextChapter}
            className="p-1.5 rounded-lg bg-navy-900 border border-slate-700 text-slate-300 hover:text-gold-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Hebrew & English Verses Area with Contextual Sacred Audio Player */}
      {(() => {
        const readingContext: ReadingContext = {
          religionId: 'judaism',
          collectionId: 'tanakh',
          bookId: currentBook.id,
          bookName: currentBook.enTitle,
          chapterId: currentChapter,
          title: `${currentBook.enTitle} ${currentChapter}`,
        };

        return (
          <TwoColumnReadingLayout context={readingContext}>
            <main className="space-y-4 min-h-[450px]">
        {/* Offline Fallback Warning for Genesis 1 */}
        {currentBook.id === 'Genesis' && currentChapter === 1 && verses.length === 2 && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                <strong>Offline Fallback Mode:</strong> Displaying 2 foundational verses (Genesis 1:1–2) stored locally offline. Sefaria API was unreachable for remaining verses (1:3–1:31).
              </span>
            </div>
            <button
              onClick={() => setRetryTrigger((prev) => prev + 1)}
              className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs whitespace-nowrap transition self-start sm:self-auto"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retry Sefaria Connection</span>
            </button>
          </div>
        )}

        {loading ? (
          <div className="py-24 text-center text-slate-400 text-xs space-y-2">
            <div className="w-6 h-6 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Loading {currentBook.enTitle} {currentChapter} from Sefaria...</p>
          </div>
        ) : verses.length === 0 ? (
          <div
            className="py-12 px-6 rounded-3xl bg-navy-950/80 border border-amber-500/30 text-center space-y-4 max-w-xl mx-auto my-8 animate-in fade-in-50 duration-200"
            data-testid="judaism-error-card"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <WifiOff className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-base sm:text-lg font-bold text-slate-100">
                Tanakh Content Unavailable (Network / Sefaria API Outage)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Unable to retrieve <strong>{currentBook.enTitle} Chapter {currentChapter}</strong> from Sefaria API v3 (`sefaria.org`).
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-navy-900/90 border border-slate-800 text-[11px] text-slate-400 text-left space-y-1.5">
              <div className="flex items-center space-x-1.5 text-amber-400 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Scripture Architecture Notice</span>
              </div>
              <p>
                The Hebrew Tanakh module dynamically streams vocalized Hebrew Masoretic text with Niqqud diacritics and JPS English translations from Sefaria. Only <strong>Genesis 1:1–2</strong> is stored locally offline as an emergency fallback.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={() => setRetryTrigger((prev) => prev + 1)}
                data-testid="judaism-retry-btn"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs transition shadow-gold-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Sefaria Retrieval</span>
              </button>
              <button
                onClick={() => {
                  setCurrentBook(TANAKH_BOOKS[0]);
                  setCurrentChapter(1);
                }}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 border border-gold-500/30 text-gold-400 text-xs font-semibold transition"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Go to Genesis 1 (Offline Fallback)</span>
              </button>
              <button
                onClick={() => setIsCoverageOpen(true)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 border border-slate-700 text-slate-300 hover:text-gold-400 text-xs font-semibold transition"
              >
                <Info className="w-3.5 h-3.5" />
                <span>View Coverage Disclosure</span>
              </button>
            </div>
          </div>
        ) : (
          verses.map((v) => {
            const unitId = `jud_${currentBook.id}_${currentChapter}_${v.verseNumber}`;
            const isPlayingThisVerse = activeAudioUnitId === unitId && isMultilingualPlaying;
            const isBookmarked = bookmarks.some(
              (b) =>
                b.id ===
                `jud:tanakh:${currentBook.id}:${currentChapter}:${v.verseNumber}`
            );

            return (
              <div
                key={v.verseNumber}
                id={`verse-${v.verseNumber}`}
                className={`p-5 rounded-2xl border transition space-y-3 group ${
                  isPlayingThisVerse
                    ? 'bg-gold-500/15 border-gold-500/60 shadow-lg ring-1 ring-gold-500/50'
                    : 'bg-navy-950/70 hover:bg-navy-900/80 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Verse Header */}
                <div className="flex items-center justify-between text-xs border-b border-slate-800/60 pb-2">
                  <div className="flex items-center space-x-2">
                    <button
                      disabled={true}
                      data-testid={`play-verse-${v.verseNumber}-btn`}
                      className="p-1 rounded text-slate-600 cursor-not-allowed opacity-40 transition"
                      title="Continuous chapter recitation (Cantor Shmuel Ofen) is awaiting written streaming authorization. Verse-by-verse sync not available."
                    >
                      <VolumeX className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-gold-400 px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/20 text-[11px]">
                      Passuk {v.verseNumber}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleCopyVerse(v)}
                      title="Copy verse"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                    >
                      {copiedVerse === v.verseNumber ? (
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

                {/* Original Hebrew Masoretic Text with Vocalization (Nikud) — Strictly Right-To-Left */}
                <div
                  dir="rtl"
                  style={{ fontSize: `${preferences.fontSizeRem * 1.35}rem` }}
                  className="font-serif text-slate-100 font-bold leading-relaxed tracking-wide text-right py-1 text-sky-200"
                >
                  {v.hebrewText}
                </div>

                {/* English JPS Translation */}
                {showEnglish && v.englishText && (
                  <p
                    dir="ltr"
                    style={{ fontSize: `${preferences.fontSizeRem}rem` }}
                    className="text-xs sm:text-sm text-slate-300 leading-relaxed pt-2 border-t border-slate-800/40 text-left font-serif"
                  >
                    {v.englishText}
                  </p>
                )}
              </div>
            );
          })
        )}
            </main>
          </TwoColumnReadingLayout>
        );
      })()}

      {/* Bottom Pagination */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-800">
        <button
          disabled={currentChapter <= 1}
          onClick={handlePreviousChapter}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold border bg-navy-950 border-slate-700 text-slate-200 hover:border-gold-500 hover:text-gold-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Chapter ({currentChapter - 1})</span>
        </button>

        <button
          disabled={currentChapter >= currentBook.chapters}
          onClick={handleNextChapter}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold border bg-navy-950 border-slate-700 text-slate-200 hover:border-gold-500 hover:text-gold-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <span>Next Chapter ({currentChapter + 1})</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Generic Audio Player Dock for Mechon Mamre */}
      <GenericAudioPlayerBar accentColorClass="text-sky-400" />

      {/* Standardized Provenance & Attribution Footer */}
      <AttributionFooter
        provenance={{
          sourceName: 'Sefaria Project API v3 & Mechon Mamre Audio',
          sourceUrl: 'https://sefaria.org',
          licenseType: 'Open Religious License',
          attributionText:
            'Hebrew Masoretic Text with vocalization (Nikud) and cantillation (Ta\'amei Hamikra). English translation based on JPS 1917 Tanakh. Hebrew audio narration recited by Cantor Shmuel Ofen via Mechon Mamre. Notice: Mechon Mamre terms permit free personal non-commercial study; online streaming is disabled under the Permanent Audio Copyright Policy pending formal written streaming authorization.',
          isAiGenerated: false,
          verifiedDate: '2026-11-18',
        }}
      />

      {/* Books Navigation Drawer */}
      <ScriptureNavigationDrawer
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        title="Tanakh Books & Sections"
        nativeTitle={'סִפְרֵי הַתַּנַ"ךְ'}
        hierarchyLabels={['Division', 'Book', 'Chapters']}
        nodes={TANAKH_BOOKS.map((b) => ({
          id: b.id,
          levelIndex: 1,
          levelName: b.category,
          title: b.enTitle,
          nativeTitle: b.heTitle,
          hasChildren: false,
          unitCount: b.chapters,
          targetAddress: {
            religionId: 'judaism',
            collectionId: 'tanakh',
            path: [
              { levelName: 'Book', identifier: b.id, label: b.enTitle },
              { levelName: 'Chapter', identifier: 1, label: 'Chapter 1' },
            ],
            unitIdentifier: 1,
          },
        }))}
        onSelectAddress={(addr) => {
          const bId = String(addr.path[0]?.identifier || 'Genesis');
          const found = TANAKH_BOOKS.find((b) => b.id === bId) || TANAKH_BOOKS[0];
          setCurrentBook(found);
          setCurrentChapter(1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Search Modal */}
      <UniversalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        collectionTitle="The Tanakh (Hebrew & English)"
        onSearch={(q) => judaismProvider.search(q)}
        onSelectResult={(addr) => {
          const bId = String(addr.path[0]?.identifier || 'Genesis');
          const found = TANAKH_BOOKS.find((b) => b.id === bId) || TANAKH_BOOKS[0];
          setCurrentBook(found);
          setCurrentChapter(Number(addr.path[1]?.identifier) || 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Bookmarks Drawer */}
      <UniversalBookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelectBookmark={(addr) => {
          const bId = String(addr.path[0]?.identifier || 'Genesis');
          const found = TANAKH_BOOKS.find((b) => b.id === bId) || TANAKH_BOOKS[0];
          setCurrentBook(found);
          setCurrentChapter(Number(addr.path[1]?.identifier) || 1);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onRemoveBookmark={(id) => {
          platformStorageService.removeBookmark(id);
          setBookmarks(platformStorageService.getBookmarks('judaism'));
        }}
        onClearBookmarks={(rel) => {
          platformStorageService.clearBookmarks(rel);
          setBookmarks(platformStorageService.getBookmarks('judaism'));
        }}
      />

      {/* Multilingual Audio Player Bar */}
      {isMultilingualPlayerVisible && (
        <MultilingualAudioPlayerBar
          title={`${currentBook.enTitle} ${currentChapter}`}
          subtitle={`${currentBook.heTitle} (Hebrew & English)`}
          availableEditions={JUDAISM_AUDIO_EDITIONS}
          onClose={() => {
            multilingualAudioEngine.stop();
            setIsMultilingualPlayerVisible(false);
          }}
        />
      )}

      {/* Audio Status Notice Modal */}
      <AudioNoticeModal
        isOpen={isAudioNoticeOpen}
        onClose={() => setIsAudioNoticeOpen(false)}
        religionId="judaism"
      />

      {/* Scripture Coverage & Availability Transparency Modal */}
      <ScriptureCoverageModal
        isOpen={isCoverageOpen}
        onClose={() => setIsCoverageOpen(false)}
        initialReligionId="judaism"
      />

      {/* Approved YouTube Embed Modal for Shema Yisrael */}
      {shemaReq && (
        <YouTubeEmbedModal
          isOpen={isYouTubeModalOpen}
          requirement={shemaReq}
          onClose={() => setIsYouTubeModalOpen(false)}
        />
      )}
    </div>
  );
};
