// ==============================================================================
// Hinduism Scripture Reader Module (Phase 1 Content Expansion)
// 12 Major Collections: Bhagavad Gita, Valmiki Ramayana, Ramcharitmanas,
// Principal Upanishads, Vedas, Puranas, Hanuman Chalisa, Aartis, Bhajans,
// Mantras, Stotras, Puja Procedures & Festival Readings
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
  Volume2,
  VolumeX,
  Info,
  Play,
  Pause,
  ShieldCheck,
  ExternalLink,
  Youtube,
  Wifi,
  WifiOff,
  RotateCcw,
  AlertTriangle,
  BookOpen,
  CheckCircle2,
} from 'lucide-react';
import {
  hinduismProvider,
  GITA_CHAPTERS,
  GitaChapterMeta,
  GitaVerseData,
  HINDUISM_COLLECTIONS,
  HinduismCollectionMeta,
  HinduismVerseUnit,
} from '../../services/providers/hinduismProvider';
import { ScriptureNavigationDrawer } from '../../platform/components/ScriptureNavigationDrawer';
import { UniversalSearchModal } from '../../platform/components/UniversalSearchModal';
import { UniversalBookmarksDrawer } from '../../platform/components/UniversalBookmarksDrawer';
import { personalLibraryService } from '../../platform/services/personalLibraryService';
import { AudioNoticeModal } from '../../platform/components/AudioNoticeModal';
import { ScriptureCoverageModal } from '../../platform/components/ScriptureCoverageModal';
import { YouTubeEmbedModal } from '../../platform/components/audio/YouTubeEmbedModal';
import { TwoColumnReadingLayout } from '../../platform/components/layout/TwoColumnReadingLayout';
import type { ReadingContext } from '../../platform/services/contextualAudioMatcher';
import { unifiedSacredAudioService } from '../../platform/services/unifiedSacredAudioService';
import { SACRED_AUDIO_MASTER_CATALOGUE } from '../../platform/data/sacredAudioMasterCatalogue';
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

export const getHinduismAudioEditions = (collectionId: string): ScriptureAudioEditionOption[] => {
  switch (collectionId) {
    case 'gita':
      // Audio quarantined under Permanent Copyright Policy pending commercial-use rights clearance
      return [
        {
          id: 'english_translation_reading',
          name: 'English Translation Reading [TTS]',
          language: 'en',
          languageName: 'English (Swami Sivananda)',
          isTranslation: true,
          isSynthesizedNarration: true,
          performerOrNarrator: 'Browser Speech Synthesis',
          license: 'Public Domain Translation Texts',
          provider: 'WebSpeech API',
        },
        {
          id: 'hindi_translation_reading',
          name: 'Hindi Translation Reading [TTS]',
          language: 'hi',
          languageName: 'Hindi (Gita Press)',
          isTranslation: true,
          isSynthesizedNarration: true,
          performerOrNarrator: 'Browser Speech Synthesis',
          license: 'Open Religious Instruction',
          provider: 'WebSpeech API',
        },
      ];
    case 'aartis':
      // Audio disabled: Content audit confirmed Wikimedia audio files mapped to Aartis
      // did not match the sacred texts (contained Ramayan invocation and Ramachandra aarti).
      // Mode set to text-only pending verified matching recordings.
      return [];
    case 'mantras':
      return [
        {
          id: 'mantra_vedic_recitation',
          name: 'Authentic Vedic Chanting (Gayatri Mantra)',
          language: 'sa',
          languageName: 'Sanskrit Liturgy',
          isTranslation: false,
          isSynthesizedNarration: false,
          performerOrNarrator: 'Wilfredor',
          license: 'CC0 1.0 Universal',
          provider: 'Wikimedia Commons Free Cultural Works',
        },
        {
          id: 'english_translation_reading',
          name: 'English Translation Reading [TTS]',
          language: 'en',
          languageName: 'English Translation',
          isTranslation: true,
          isSynthesizedNarration: true,
          performerOrNarrator: 'Browser Speech Synthesis',
          license: 'Public Domain Translation Texts',
          provider: 'WebSpeech API',
        },
        {
          id: 'hindi_translation_reading',
          name: 'Hindi Translation Reading [TTS]',
          language: 'hi',
          languageName: 'Hindi Translation',
          isTranslation: true,
          isSynthesizedNarration: true,
          performerOrNarrator: 'Browser Speech Synthesis',
          license: 'Open Religious Instruction',
          provider: 'WebSpeech API',
        },
      ];
    case 'vedas':
      return [
        {
          id: 'vedas_purusha_recitation',
          name: 'Vedic Recitation (Purusha, Sri & Ganapati Suktams)',
          language: 'sa',
          languageName: 'Vedic Sanskrit',
          isTranslation: false,
          isSynthesizedNarration: false,
          performerOrNarrator: 'Vedadhayana Gosthi',
          license: 'CC BY 3.0',
          provider: 'Wikimedia Commons Free Cultural Works',
        },
        {
          id: 'english_translation_reading',
          name: 'English Translation Reading [TTS]',
          language: 'en',
          languageName: 'English Translation',
          isTranslation: true,
          isSynthesizedNarration: true,
          performerOrNarrator: 'Browser Speech Synthesis',
          license: 'Public Domain Translation Texts',
          provider: 'WebSpeech API',
        },
        {
          id: 'hindi_translation_reading',
          name: 'Hindi Translation Reading [TTS]',
          language: 'hi',
          languageName: 'Hindi Translation',
          isTranslation: true,
          isSynthesizedNarration: true,
          performerOrNarrator: 'Browser Speech Synthesis',
          license: 'Open Religious Instruction',
          provider: 'WebSpeech API',
        },
      ];
    case 'bhajans':
      // Audio quarantined under Phase 2 Requirement 4 (CC BY-SA 3.0 ShareAlike compatibility review pending)
      return [];
    case 'stotras':
      return [
        {
          id: 'stotras_classical_recitation',
          name: 'Classical Sanskrit Stotra & Suktam Chanting',
          language: 'sa',
          languageName: 'Sanskrit Liturgy',
          isTranslation: false,
          isSynthesizedNarration: false,
          performerOrNarrator: 'Swami Atmananda / Vedadhayana Gosthi',
          license: 'CC0 1.0 / CC BY 3.0',
          provider: 'Wikimedia Commons Free Cultural Works',
        },
        {
          id: 'english_translation_reading',
          name: 'English Translation Reading [TTS]',
          language: 'en',
          languageName: 'English Translation',
          isTranslation: true,
          isSynthesizedNarration: true,
          performerOrNarrator: 'Browser Speech Synthesis',
          license: 'Public Domain Translation Texts',
          provider: 'WebSpeech API',
        },
        {
          id: 'hindi_translation_reading',
          name: 'Hindi Translation Reading [TTS]',
          language: 'hi',
          languageName: 'Hindi Translation',
          isTranslation: true,
          isSynthesizedNarration: true,
          performerOrNarrator: 'Browser Speech Synthesis',
          license: 'Open Religious Instruction',
          provider: 'WebSpeech API',
        },
      ];
    default:
      // Collections without verified audio (hanuman_chalisas, valmiki_ramayana, upanishads, puranas, etc.)
      return [];
  }
};

interface HinduismModuleProps {
  onReturnToHome: () => void;
}

export const HinduismModule: React.FC<HinduismModuleProps> = ({
  onReturnToHome,
}) => {
  // Collection Selection State
  const [selectedCollectionId, setSelectedCollectionId] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location?.search) {
      const p = new URLSearchParams(window.location.search);
      const c = p.get('collection');
      if (c && HINDUISM_COLLECTIONS.some((col) => col.id === c)) return c;
    }
    return 'gita';
  });
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('All');
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  // Chapter & Verses State (Gita)
  const [currentChapterNum, setCurrentChapterNum] = useState<number>(() => {
    if (typeof window !== 'undefined' && window.location?.search) {
      const p = new URLSearchParams(window.location.search);
      const ch = p.get('chapter');
      if (ch && !isNaN(Number(ch))) return Number(ch);
    }
    return 1;
  });
  const [verses, setVerses] = useState<GitaVerseData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCommentary, setSelectedCommentary] = useState<
    'siva' | 'gambir' | 'purohit' | 'rams'
  >('siva');
  const [copiedVerse, setCopiedVerse] = useState<number | string | null>(null);

  // Platform Controls & Drawers
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);
  const [isAudioNoticeOpen, setIsAudioNoticeOpen] = useState<boolean>(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState<boolean>(false);
  const gitaCh1Req = SACRED_AUDIO_MASTER_CATALOGUE.find((r) => r.id === 'REQ-HIN-001') || null;
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState<boolean>(false);
  const [activeAudioUnitId, setActiveAudioUnitId] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [showTypography, setShowTypography] = useState<boolean>(false);
  const [isCoverageOpen, setIsCoverageOpen] = useState<boolean>(false);
  const [retryTrigger, setRetryTrigger] = useState<number>(0);
  const [preferences, setPreferences] = useState(() =>
    platformStorageService.getPreferences()
  );

  const isOfflineGitaVerse = (chapter: number, verse: number): boolean => {
    return chapter === 1 || (chapter === 2 && verse === 47);
  };
  const [bookmarks, setBookmarks] = useState<UniversalBookmark[]>(() =>
    platformStorageService.getBookmarks('hinduism')
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

  const currentChapter: GitaChapterMeta =
    GITA_CHAPTERS.find((c) => c.chapter_number === currentChapterNum) ||
    GITA_CHAPTERS[0];

  const selectedCollection: HinduismCollectionMeta =
    HINDUISM_COLLECTIONS.find((c) => c.id === selectedCollectionId) ||
    HINDUISM_COLLECTIONS[0];

  // Synchronize Reading Position & Chapter Progress (Phase 6.1)
  useEffect(() => {
    if (selectedCollectionId === 'gita') {
      personalLibraryService.saveReadingPosition({
        religion: 'hinduism',
        scriptureId: 'gita',
        collectionId: 'gita',
        readingId: `gita-${currentChapterNum}`,
        chapterNumber: currentChapterNum,
        verseNumber: 1,
        displayTitle: `Bhagavad Gita — Chapter ${currentChapterNum}`,
        displayLocation: `Chapter ${currentChapterNum}: ${currentChapter.translation}`,
        updatedAt: new Date().toISOString(),
        timestamp: Date.now(),
      });
      personalLibraryService.recordChapterVisited('hinduism', 'gita', currentChapterNum, currentChapter.translation);
    } else {
      personalLibraryService.saveReadingPosition({
        religion: 'hinduism',
        scriptureId: 'bhajans',
        collectionId: selectedCollectionId,
        readingId: selectedCollectionId,
        chapterNumber: 1,
        displayTitle: selectedCollection.title,
        displayLocation: selectedCollection.category,
        updatedAt: new Date().toISOString(),
        timestamp: Date.now(),
      });
      personalLibraryService.recordChapterVisited('hinduism', 'bhajans', selectedCollectionId, selectedCollection.title);
    }
  }, [currentChapterNum, selectedCollectionId, currentChapter.translation, selectedCollection.title, selectedCollection.category]);

  // Gita Chapter Completion State
  const [isChapterCompleted, setIsChapterCompleted] = useState<boolean>(() => {
    const prog = personalLibraryService.getProgress('hinduism', 'gita');
    return prog?.chaptersCompleted?.includes(currentChapterNum) || false;
  });

  useEffect(() => {
    const prog = personalLibraryService.getProgress('hinduism', 'gita');
    setIsChapterCompleted(prog?.chaptersCompleted?.includes(currentChapterNum) || false);
  }, [currentChapterNum]);

  // Listen for PersonalLibrary updates and navigation events
  useEffect(() => {
    const unsub = personalLibraryService.subscribe(() => {
      setBookmarks(platformStorageService.getBookmarks('hinduism'));
      const prog = personalLibraryService.getProgress('hinduism', 'gita');
      setIsChapterCompleted(prog?.chaptersCompleted?.includes(currentChapterNum) || false);
    });

    const handleNav = (e: any) => {
      if (e.detail?.religion === 'hinduism') {
        if (e.detail.collectionId) setSelectedCollectionId(e.detail.collectionId);
        if (e.detail.chapterNumber) setCurrentChapterNum(Number(e.detail.chapterNumber));
        if (e.detail.verseNumber) {
          setTimeout(() => {
            const el = document.getElementById(`verse-${e.detail.verseNumber}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }, 300);
        }
      }
    };
    window.addEventListener('jafri-navigate-reading', handleNav);

    return () => {
      unsub();
      window.removeEventListener('jafri-navigate-reading', handleNav);
    };
  }, [currentChapterNum]);

  const nonGitaUnits: HinduismVerseUnit[] =
    selectedCollectionId !== 'gita'
      ? hinduismProvider.getCollectionUnits(selectedCollectionId)
      : [];

  const handleSelectCollection = (colId: string, chapterNum?: number) => {
    // Immediately stop active audio and unload media to prevent any cross-collection leakage
    multilingualAudioEngine.stop();
    unifiedSacredAudioService.stop();
    setIsAudioPlayerVisible(false);
    setActiveAudioUnitId(null);
    setSelectedUnitId(null);
    setSelectedCollectionId(colId);
    if (chapterNum !== undefined) {
      setCurrentChapterNum(chapterNum);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Load Units into Audio Engine for Bhagavad Gita and Non-Gita Collections
  useEffect(() => {
    if (selectedCollectionId === 'gita') {
      if (verses.length === 0) return;
      // Bhagavad Gita authentic chanting is quarantined pending commercial rights clearance under Permanent Audio Copyright Policy
      const units: ScriptureUnit[] = verses.map((v) => {
        return {
          id: `${currentChapterNum}.${v.verse}`,
          label: `Adhyaya ${currentChapterNum}, Shloka ${v.verse}`,
          originalText: v.slok,
          translationText: v.sivanandaEn || v.gambhiranandaEn || v.ramsukhdasHi,
          translations: {
            en: v.sivanandaEn || v.gambhiranandaEn || v.purohitEn,
            hi: v.ramsukhdasHi,
          },
          originalAudioUrl: null,
          translationAudioUrl: null,
          startTime: undefined,
          endTime: undefined,
          audio: undefined,
        };
      });

      multilingualAudioEngine.loadUnits('hinduism', units);
    } else {
      // Non-Gita collections: load units with authentic audio where verified
      const units: ScriptureUnit[] = nonGitaUnits.map((u) => {
        const translations: Record<string, string> = { en: u.translationEn };
        if (u.translationHi) {
          translations.hi = u.translationHi;
        }
        return {
          id: `hin_${selectedCollectionId}_${u.id}`,
          label: `${selectedCollection.title} — ${u.unitNumber}`,
          originalText: u.originalText,
          translationText: u.translationEn,
          translations,
          originalAudioUrl: u.audio?.audioUrl || null,
          translationAudioUrl: null,
          audio: u.audio
            ? {
                ...u.audio,
                title: `${selectedCollection.title} — ${u.unitNumber}`,
              }
            : undefined,
        };
      });
      multilingualAudioEngine.loadUnits('hinduism', units);
    }
  }, [verses, currentChapterNum, selectedCollectionId, nonGitaUnits, selectedCollection]);

  const handleToggleAudioPlayer = () => {
    if (selectedCollectionId === 'gita') {
      setIsAudioNoticeOpen(true);
      return;
    } else {
      const unitWithAudio = nonGitaUnits.find((u) => Boolean(u.audio?.audioUrl));
      if (!unitWithAudio) {
        setIsAudioNoticeOpen(true);
        return;
      }
      const targetUnit =
        nonGitaUnits.find(
          (u) => `hin_${selectedCollectionId}_${u.id}` === activeAudioUnitId && Boolean(u.audio?.audioUrl)
        ) || unitWithAudio;

      const targetUnitId = `hin_${selectedCollectionId}_${targetUnit.id}`;
      if (isAudioPlayerVisible && isAudioPlaying) {
        multilingualAudioEngine.pause();
      } else {
        setIsAudioPlayerVisible(true);
        if (activeAudioUnitId === targetUnitId && multilingualAudioEngine.getState().playbackState === 'paused') {
          multilingualAudioEngine.resume();
        } else {
          multilingualAudioEngine.play(targetUnitId);
        }
      }
    }
  };

  const handlePlayNonGitaUnit = (u: HinduismVerseUnit) => {
    setSelectedUnitId(u.id);
    if (!u.audio?.audioUrl) return;
    const unitId = `hin_${selectedCollectionId}_${u.id}`;
    setIsAudioPlayerVisible(true);
    if (activeAudioUnitId === unitId && isAudioPlaying) {
      multilingualAudioEngine.pause();
    } else {
      multilingualAudioEngine.play(unitId);
    }
  };

  // Load Chapter Verses when in Gita mode
  useEffect(() => {
    if (selectedCollectionId !== 'gita') {
      setLoading(false);
      return;
    }
    let mounted = true;
    setLoading(true);
    hinduismProvider.getChapterVerses(currentChapterNum).then((data) => {
      if (mounted) {
        setVerses(data);
        setLoading(false);
        // Save reading progress if verses exist
        if (data.length > 0) {
          platformStorageService.saveProgress({
            religionId: 'hinduism',
            collectionId: 'gita',
            lastAddress: {
              religionId: 'hinduism',
              collectionId: 'gita',
              path: [
                {
                  levelName: 'Chapter',
                  identifier: currentChapterNum,
                  label: currentChapter.translation,
                },
              ],
              unitIdentifier: 1,
            },
            displayLocation: `Bhagavad Gita ${currentChapterNum}: ${currentChapter.translation}`,
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
  }, [currentChapterNum, currentChapter, selectedCollectionId, retryTrigger]);

  const handleNextChapter = () => {
    if (currentChapterNum < 18) {
      setCurrentChapterNum((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousChapter = () => {
    if (currentChapterNum > 1) {
      setCurrentChapterNum((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleBookmark = (v: GitaVerseData) => {
    const bookmarkId = `hin:gita:${v.chapter}:${v.verse}`;
    const exists = bookmarks.some((b) => b.id === bookmarkId);

    if (exists) {
      platformStorageService.removeBookmark(bookmarkId);
    } else {
      const bkm: UniversalBookmark = {
        id: bookmarkId,
        religionId: 'hinduism',
        collectionId: 'gita',
        address: {
          religionId: 'hinduism',
          collectionId: 'gita',
          path: [
            {
              levelName: 'Chapter',
              identifier: v.chapter,
              label: currentChapter.translation,
            },
          ],
          unitIdentifier: v.verse,
        },
        displayTitle: `Bhagavad Gita ${v.chapter}:${v.verse}`,
        displaySubtitle: currentChapter.translation,
        snippetRootText: v.slok,
        snippetTranslatedText: v.sivanandaEn,
        savedAtTimestamp: Date.now(),
      };
      platformStorageService.saveBookmark(bkm);
    }
    setBookmarks(platformStorageService.getBookmarks('hinduism'));
  };

  const handleToggleNonGitaBookmark = (u: HinduismVerseUnit) => {
    const bookmarkId = `hin:${selectedCollectionId}:${u.id}`;
    const exists = bookmarks.some((b) => b.id === bookmarkId);

    if (exists) {
      platformStorageService.removeBookmark(bookmarkId);
    } else {
      const bkm: UniversalBookmark = {
        id: bookmarkId,
        religionId: 'hinduism',
        collectionId: selectedCollectionId,
        address: {
          religionId: 'hinduism',
          collectionId: selectedCollectionId,
          path: [
            {
              levelName: 'Collection',
              identifier: selectedCollectionId,
              label: selectedCollection.title,
            },
          ],
          unitIdentifier: String(u.unitNumber),
        },
        displayTitle: `${selectedCollection.title} — ${u.unitNumber}`,
        displaySubtitle: selectedCollection.category,
        snippetRootText: u.originalText,
        snippetTranslatedText: u.translationEn,
        savedAtTimestamp: Date.now(),
      };
      platformStorageService.saveBookmark(bkm);
    }
    setBookmarks(platformStorageService.getBookmarks('hinduism'));
  };

  const handleCopyVerse = (v: GitaVerseData) => {
    const transText =
      selectedCommentary === 'gambir'
        ? v.gambhiranandaEn
        : selectedCommentary === 'purohit'
        ? v.purohitEn
        : selectedCommentary === 'rams'
        ? v.ramsukhdasHi
        : v.sivanandaEn;

    const text = `${v.slok}\n${v.transliteration}\n"${transText}"\n— Bhagavad Gita ${v.chapter}:${v.verse} (${currentChapter.translation})`;
    navigator.clipboard.writeText(text);
    setCopiedVerse(v.verse);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  const handleCopyNonGitaUnit = (u: HinduismVerseUnit) => {
    const text = `${u.originalText}\n${u.transliteration || ''}\n"${u.translationEn}"\n— ${selectedCollection.title} (${u.unitNumber})`;
    navigator.clipboard.writeText(text);
    setCopiedVerse(u.id);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  // Category filter tabs
  const CATEGORIES = [
    'All',
    'Itihasa / Epics',
    'Upanishads',
    'Shruti / Vedas',
    'Puranas',
    'Chalisas',
    'Aartis',
    'Bhajans',
    'Mantras',
    'Stotras',
    'Puja Vidhi',
  ];

  const filteredCollections = HINDUISM_COLLECTIONS.filter((col) => {
    if (activeCategoryFilter === 'All') return true;
    return col.category === activeCategoryFilter;
  });

  const handleSelectCategory = (cat: string) => {
    setActiveCategoryFilter(cat);
    if (cat !== 'All') {
      const firstInCat = HINDUISM_COLLECTIONS.find((col) => col.category === cat);
      if (firstInCat) {
        handleSelectCollection(firstInCat.id);
      }
    }
  };

  const activeUnit = nonGitaUnits.find((u) => u.id === selectedUnitId) || null;

  const readingContext: ReadingContext = {
    religionId: 'hinduism',
    categoryId: selectedCollection.category,
    scriptureId: selectedCollectionId === 'gita' ? 'gita' : selectedCollectionId,
    collectionId: selectedCollectionId,
    chapterId: selectedCollectionId === 'gita' ? currentChapterNum : undefined,
    readingId: selectedCollectionId === 'gita'
      ? `gita-ch-${currentChapterNum}`
      : activeUnit
      ? activeUnit.id
      : undefined,
    sectionId: activeUnit ? activeUnit.id : undefined,
    bookName: selectedCollectionId === 'gita' ? 'Bhagavad Gita' : selectedCollection.title,
    canonicalTitle: selectedCollectionId === 'gita'
      ? `Bhagavad Gita — Chapter ${currentChapterNum}`
      : activeUnit
      ? String(activeUnit.unitNumber || activeUnit.sectionTitle || selectedCollection.title)
      : selectedCollection.title,
    title: selectedCollectionId === 'gita'
      ? currentChapter.translation
      : activeUnit
      ? String(activeUnit.sectionTitle || activeUnit.unitNumber || selectedCollection.title)
      : selectedCollection.title,
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Breadcrumb & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-950 border border-slate-800 shadow-lg">
        {/* Navigation & Chapter/Collection Indicator */}
        <div className="flex items-center space-x-3 flex-wrap gap-y-2">
          <button
            onClick={onReturnToHome}
            className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl bg-navy-950/80 border border-slate-700/80 hover:border-gold-500/50 text-slate-300 hover:text-gold-300 text-xs font-medium transition"
            title="Return to Platform Overview"
          >
            <span>&larr; Library</span>
          </button>

          <button
            onClick={() => setIsNavOpen(true)}
            data-testid="hinduism-nav-drawer-btn"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-200 hover:text-gold-400 text-xs font-semibold transition"
          >
            <Layers className="w-4 h-4 text-gold-400" />
            <span className="hidden xs:inline">12 Collections & Texts</span>
            <span className="xs:hidden">Index</span>
          </button>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-100">{selectedCollection.title}</span>
            {selectedCollectionId === 'gita' && (
              <>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs font-serif text-gold-400 font-bold">
                  Ch {currentChapterNum}: {currentChapter.translation}
                </span>
                <span className="text-xs font-serif text-amber-300 font-bold hidden sm:inline">
                  ({currentChapter.name})
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Controls: Commentary Switcher, Audio, Search, Bookmarks, Typography */}
        <div className="flex items-center space-x-2 self-end sm:self-auto flex-wrap gap-y-1">
          {/* Commentary Switcher (Active on Gita) */}
          {selectedCollectionId === 'gita' && (
            <select
              value={selectedCommentary}
              onChange={(e) => setSelectedCommentary(e.target.value as any)}
              className="bg-navy-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-gold-500 font-medium cursor-pointer"
            >
              <option value="siva">Swami Sivananda (English)</option>
              <option value="gambir">Swami Gambhirananda (English)</option>
              <option value="purohit">Shri Purohit Swami (English)</option>
              <option value="rams">Swami Ramsukhdas (Hindi)</option>
            </select>
          )}

          {/* Bhagavad Gita Ch 1 Approved YouTube Chanting (REQ-HIN-001) */}
          {selectedCollectionId === 'gita' && currentChapterNum === 1 && gitaCh1Req && (
            <button
              onClick={() => setIsYouTubeModalOpen(true)}
              title="Listen to Bhagavad Gita Chapter 1 Chanting (Accepted YouTube Chanting • REQ-HIN-001)"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-500/20 border border-orange-500/40 hover:border-orange-400 text-orange-300 text-xs font-bold transition shadow-sm"
              data-testid="gita-ch1-youtube-btn"
            >
              <Youtube className="w-3.5 h-3.5 text-red-400" />
              <span>Gita Ch 1 Chanting</span>
            </button>
          )}

          {/* Multilingual Audio Player Button */}
          {(() => {
            const collectionHasAudio =
              selectedCollectionId !== 'gita' &&
              nonGitaUnits.some((u) => Boolean(u.audio?.audioUrl));
            return (
              <button
                onClick={handleToggleAudioPlayer}
                disabled={!collectionHasAudio}
                title={
                  collectionHasAudio
                    ? 'Play Scripture Audio'
                    : selectedCollectionId === 'gita'
                    ? 'Bhagavad Gita audio awaiting commercial rights clearance. Text-only mode active.'
                    : 'Correct devotional recording awaiting verification.'
                }
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition ${
                  !collectionHasAudio
                    ? 'bg-navy-950 border-slate-800 text-slate-500 opacity-40 cursor-not-allowed'
                    : isAudioPlayerVisible
                    ? 'bg-gold-500 text-navy-950 font-bold border-gold-400'
                    : 'bg-navy-950 border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400'
                }`}
                data-testid="multilingual-audio-btn"
              >
                {isAudioPlaying ? (
                  <Pause className="w-3.5 h-3.5" />
                ) : (
                  <Play className="w-3.5 h-3.5" />
                )}
                <span className="hidden sm:inline">Play Audio</span>
              </button>
            );
          })()}

          {/* Audio Recitation Status */}
          <button
            onClick={() => setIsAudioNoticeOpen(true)}
            title="Sanskrit Chanting Audio Status"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400 text-xs font-semibold transition"
            data-testid="audio-notice-btn"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Audio</span>
          </button>

          {/* Scripture Coverage Disclosure Button */}
          <button
            onClick={() => setIsCoverageOpen(true)}
            title="Scripture Coverage & Availability Disclosure"
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400 text-xs font-semibold transition cursor-pointer"
            data-testid="hinduism-coverage-btn"
          >
            <BookOpen className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden sm:inline">Coverage</span>
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            title="Search Hindu Scriptures"
            className="p-2 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400 text-xs transition"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsBookmarksOpen(true)}
            title="Saved Bookmarks"
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

      {/* Collections Catalogue Browser Bar */}
      <div className="p-4 rounded-2xl bg-navy-950/70 border border-slate-800 space-y-3">
        {/* Category Filter Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 text-[11px] font-semibold uppercase tracking-wider mr-1">
            Category:
          </span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleSelectCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                activeCategoryFilter === cat
                  ? 'bg-gold-500 text-navy-950 font-bold shadow'
                  : 'bg-navy-900/80 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Collection Selector Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {filteredCollections.map((col) => {
            const isSelected = selectedCollectionId === col.id;
            return (
              <button
                key={col.id}
                data-testid={`collection-btn-${col.id}`}
                onClick={() => handleSelectCollection(col.id)}
                className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'bg-gold-500/15 border-gold-500/80 ring-1 ring-gold-500/40 text-gold-300'
                    : 'bg-navy-900/50 border-slate-800/80 hover:bg-navy-800/60 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="font-semibold truncate">{col.title}</div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {col.category}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Collection Provenance & Overview Header Banner */}
      <div className="p-5 rounded-2xl bg-navy-950/80 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-gold-400 uppercase tracking-wide px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/20 text-[11px]">
              {selectedCollection.category}
            </span>
            <span className="text-slate-400 text-xs">
              {selectedCollection.tradition} • {selectedCollection.originalLanguage}
            </span>
          </div>

          <div className="flex items-center space-x-2 text-[11px]">
            <span className="text-emerald-400 font-medium flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{selectedCollection.licensingStatus}</span>
            </span>
            <a
              href={selectedCollection.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-500 hover:text-slate-300 flex items-center space-x-0.5 transition"
              title="View authentic source"
            >
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h2 className="text-base sm:text-lg font-serif font-bold text-slate-100">
            {selectedCollection.title}
          </h2>
          <span className="text-sm font-serif text-amber-300 font-bold">
            {selectedCollection.nativeTitle}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {selectedCollection.summary}
        </p>

        <div className="pt-2 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <span>
            <strong>Author/Compiler:</strong> {selectedCollection.authorOrCompiler}
          </span>
          {selectedCollection.translatorOrCommentator && (
            <span>
              <strong>Edition/Translation:</strong>{' '}
              {selectedCollection.translatorOrCommentator}
            </span>
          )}
        </div>
      </div>

      {/* CHAPTER SELECTION BAR (When in Gita Mode) */}
      {selectedCollectionId === 'gita' && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-navy-950/60 border border-slate-800 text-xs">
          <div className="flex items-center space-x-2">
            <span className="text-slate-400 font-semibold">Adhyaya:</span>
            <div className="flex items-center space-x-1 max-w-[280px] sm:max-w-md overflow-x-auto py-1">
              {GITA_CHAPTERS.map((ch) => (
                <button
                  key={ch.chapter_number}
                  onClick={() => {
                    setCurrentChapterNum(ch.chapter_number);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition whitespace-nowrap ${
                    currentChapterNum === ch.chapter_number
                      ? 'bg-gold-500 text-navy-950 shadow-gold-sm'
                      : 'bg-navy-900 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  Ch {ch.chapter_number}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              data-testid="mark-completed-toggle-btn"
              onClick={() => {
                personalLibraryService.toggleChapterCompleted('hinduism', 'gita', currentChapterNum);
              }}
              title={isChapterCompleted ? "Chapter marked as completed. Click to reopen." : "Click to mark this chapter as completed"}
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center space-x-1 cursor-pointer ${
                isChapterCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                  : 'bg-navy-900 border border-slate-700 hover:border-gold-500/50 text-slate-300 hover:text-gold-300'
              }`}
            >
              <CheckCircle2 className={`w-3.5 h-3.5 ${isChapterCompleted ? 'text-emerald-400' : 'text-slate-400'}`} />
              <span className="hidden sm:inline">{isChapterCompleted ? 'Completed' : 'Mark Done'}</span>
            </button>
            <button
              disabled={currentChapterNum <= 1}
              onClick={handlePreviousChapter}
              className="p-1.5 rounded-lg bg-navy-900 border border-slate-700 text-slate-300 hover:text-gold-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={currentChapterNum >= 18}
              onClick={handleNextChapter}
              className="p-1.5 rounded-lg bg-navy-900 border border-slate-700 text-slate-300 hover:text-gold-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MAIN READING AREA — Two-Column Scripture & Sacred Audio Experience */}
      <TwoColumnReadingLayout context={readingContext}>
        <main className="space-y-4 min-h-[450px]">
        {selectedCollectionId === 'gita' ? (
          /* =========================================================================
             VIEW 1: BHAGAVAD GITA (18 CHAPTERS & 700 SHLOKAS)
             ========================================================================= */
          <>
            {/* Gita Chapter Availability & Offline Notice */}
            <div className="p-3.5 rounded-2xl bg-navy-950/70 border border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2 text-slate-300">
                <span className="font-semibold text-gold-400">Availability:</span>
                <span>
                  {currentChapterNum === 1 && 'Chapter 1 (all 47 Shlokas) is bundled locally offline in the application bundle. Zero external network dependency.'}
                  {currentChapterNum > 1 && `Chapter ${currentChapterNum} (${currentChapter.verses_count} Shlokas) is loaded from the verified static dataset with multi-tier IndexedDB caching & VedicScriptures fallback.`}
                </span>
              </div>
              <button
                onClick={() => setIsCoverageOpen(true)}
                className="inline-flex items-center space-x-1 text-gold-400 hover:text-gold-300 font-semibold text-[11px] whitespace-nowrap self-start sm:self-auto"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Coverage Details &rarr;</span>
              </button>
            </div>

            {/* Offline Partial Verses Banner */}
            {verses.length > 0 && verses.length < currentChapter.verses_count && (
              <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>
                    <strong>Offline Partial Display:</strong> Displaying {verses.length} of {currentChapter.verses_count} Shlokas stored locally offline. Remaining {currentChapter.verses_count - verses.length} Shlokas could not be retrieved from the network.
                  </span>
                </div>
                <button
                  onClick={() => setRetryTrigger((prev) => prev + 1)}
                  className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 font-bold text-xs whitespace-nowrap transition self-start sm:self-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Retry Network Stream</span>
                </button>
              </div>
            )}

            {loading ? (
              <div className="py-24 text-center text-slate-400 text-xs space-y-2">
                <div className="w-6 h-6 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
                <p>Loading Shlokas from Chapter {currentChapterNum}...</p>
              </div>
            ) : verses.length === 0 ? (
              <div
                className="py-12 px-6 rounded-3xl bg-navy-950/80 border border-amber-500/30 text-center space-y-4 max-w-xl mx-auto my-8 animate-in fade-in-50 duration-200"
                data-testid="hinduism-error-card"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
                  <WifiOff className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-slate-100">
                    Bhagavad Gita Shlokas Unavailable (Network / API Outage)
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Unable to retrieve Shlokas for <strong>Chapter {currentChapterNum}: {currentChapter.translation}</strong> from the VedicScriptures API (`vedicscriptures.github.io`).
                  </p>
                </div>
                <div className="p-3.5 rounded-xl bg-navy-900/90 border border-slate-800 text-[11px] text-slate-400 text-left space-y-1.5">
                  <div className="flex items-center space-x-1.5 text-amber-400 font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Scripture Architecture Notice</span>
                  </div>
                  <p>
                    Unable to load Chapter {currentChapterNum} ({currentChapter.verses_count} Shlokas). The application queries verified static assets, IndexedDB cache, and VedicScriptures API with automatic multi-tier fallback. Check network connectivity or return to Chapter 1 (100% offline bundle).
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => setRetryTrigger((prev) => prev + 1)}
                    data-testid="hinduism-retry-btn"
                    className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs transition shadow-gold-sm"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Retry Chapter {currentChapterNum}</span>
                  </button>
                  <button
                    onClick={() => setCurrentChapterNum(1)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 border border-gold-500/30 text-gold-400 text-xs font-semibold transition"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Go to Chapter 1 (Offline Available)</span>
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
                const unitId = `${currentChapterNum}.${v.verse}`;
                const isPlayingThisShloka = activeAudioUnitId === unitId && isAudioPlaying;
                const isBookmarked = bookmarks.some(
                  (b) => b.id === `hin:gita:${v.chapter}:${v.verse}`
                );
                const translationText =
                  selectedCommentary === 'gambir'
                    ? v.gambhiranandaEn
                    : selectedCommentary === 'purohit'
                    ? v.purohitEn
                    : selectedCommentary === 'rams'
                    ? v.ramsukhdasHi
                    : v.sivanandaEn;

                return (
                  <div
                    key={v.verse}
                    id={`shloka-${v.verse}`}
                    className={`p-5 rounded-2xl border transition space-y-3 group ${
                      isPlayingThisShloka
                        ? 'bg-gold-500/15 border-gold-500/60 shadow-lg ring-1 ring-gold-500/50'
                        : 'bg-navy-950/70 hover:bg-navy-900/80 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    {/* Header: Shloka Number & Actions */}
                    <div className="flex items-center justify-between text-xs border-b border-slate-800/60 pb-2">
                      <div className="flex items-center space-x-2">
                        <button
                          disabled={true}
                          data-testid={`play-shloka-${v.verse}-btn`}
                          className="p-1 rounded text-slate-600 cursor-not-allowed opacity-40 transition"
                          title="Continuous chapter recitation (T.S. Ranganathan). Individual verse synchronization is unavailable to prevent fabricated timestamps."
                        >
                          <VolumeX className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono font-bold text-gold-400 px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/20 text-[11px]">
                          Shloka {v.chapter}.{v.verse}
                        </span>
                        {isOfflineGitaVerse(v.chapter, v.verse) ? (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Offline Bundled</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">
                            <Wifi className="w-3 h-3" />
                            <span>Network Streamed</span>
                          </span>
                        )}
                      </div>

                    <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleCopyVerse(v)}
                        title="Copy shloka"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                      >
                        {copiedVerse === v.verse ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        data-testid="verse-bookmark-btn"
                        onClick={() => handleToggleBookmark(v)}
                        title="Save bookmark"
                        className={`p-1.5 rounded-lg transition ${
                          isBookmarked
                            ? 'text-gold-400 bg-gold-500/10'
                            : 'text-slate-400 hover:text-gold-400 hover:bg-slate-800'
                        }`}
                      >
                        <Bookmark
                          className="w-3.5 h-3.5"
                          fill={isBookmarked ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Original Sanskrit Shloka in Devanagari */}
                  <div
                    style={{ fontSize: `${preferences.fontSizeRem * 1.25}rem` }}
                    className="font-serif text-slate-100 font-bold leading-relaxed tracking-wide text-center py-1 whitespace-pre-line text-amber-200"
                  >
                    {v.slok}
                  </div>

                  {/* Roman IAST Transliteration */}
                  {preferences.showTransliteration && v.transliteration && (
                    <p className="text-xs text-slate-400 italic text-center font-serif leading-relaxed whitespace-pre-line">
                      {v.transliteration}
                    </p>
                  )}

                  {/* Translation */}
                  <div
                    style={{ fontSize: `${preferences.fontSizeRem}rem` }}
                    className="text-slate-200 leading-relaxed text-sm pt-1"
                  >
                    {translationText}
                  </div>

                  {/* Shankara Bhashya Commentary note if available */}
                  {v.shankaraBhashya && (
                    <div className="pt-2 border-t border-slate-800/60 text-xs text-slate-400">
                      <span className="font-semibold text-gold-400">
                        Adi Shankaracharya Bhashya:
                      </span>{' '}
                      {v.shankaraBhashya}
                    </div>
                  )}
                </div>
              );
            })
          )}
          </>
        ) : (
          /* =========================================================================
             VIEW 2: EXPANDED 11 HINDUISM COLLECTIONS & TEXTS
             ========================================================================= */
          nonGitaUnits.length === 0 ? (
            <div className="py-24 text-center text-slate-500 text-xs space-y-2">
              <Info className="w-8 h-8 mx-auto text-slate-600" />
              <p>Content for this collection is awaiting verified critical edition ingestion.</p>
            </div>
          ) : (
            nonGitaUnits.map((u) => {
              const isBookmarked = bookmarks.some(
                (b) => b.id === `hin:${selectedCollectionId}:${u.id}`
              );
              const unitId = `hin_${selectedCollectionId}_${u.id}`;
              const isPlayingThisUnit = activeAudioUnitId === unitId && isAudioPlaying;
              const hasAudio = Boolean(u.audio?.audioUrl);

              return (
                <div
                  key={u.id}
                  id={`unit-${u.id}`}
                  onClick={() => setSelectedUnitId(u.id)}
                  className={`p-5 rounded-2xl border transition space-y-3 group cursor-pointer ${
                    isPlayingThisUnit || selectedUnitId === u.id
                      ? 'bg-gold-500/15 border-gold-500/60 shadow-lg ring-1 ring-gold-500/50'
                      : 'bg-navy-950/70 hover:bg-navy-900/80 border-slate-800/80 hover:border-slate-700'
                  }`}
                >
                  {/* Unit Header */}
                  <div className="flex items-center justify-between text-xs border-b border-slate-800/60 pb-2">
                    <div className="flex items-center space-x-2">
                      {hasAudio ? (
                        <button
                          data-testid={`play-unit-${u.id}-btn`}
                          onClick={() => handlePlayNonGitaUnit(u)}
                          className={`p-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                            isPlayingThisUnit
                              ? 'bg-gold-500 text-navy-950 font-bold shadow'
                              : 'text-gold-400 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30'
                          }`}
                          title={`Play authentic recording (${u.audio?.performer})`}
                        >
                          {isPlayingThisUnit ? (
                            <Pause className="w-3.5 h-3.5" />
                          ) : (
                            <Play className="w-3.5 h-3.5" />
                          )}
                          <span className="text-[10px] font-semibold hidden sm:inline">
                            Authentic Human ({u.audio?.license})
                          </span>
                        </button>
                      ) : (
                        <button
                          disabled={true}
                          data-testid={`play-unit-${u.id}-btn`}
                          className="p-1 rounded text-slate-600 cursor-not-allowed opacity-40 transition"
                          title="Correct devotional recording awaiting verification."
                        >
                          <VolumeX className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <span className="font-mono font-bold text-gold-400 px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/20 text-[11px]">
                        {u.unitNumber}
                      </span>
                      {u.sectionTitle && (
                        <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">
                          {u.sectionTitle}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition">
                      <button
                        onClick={() => handleCopyNonGitaUnit(u)}
                        title="Copy verse"
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                      >
                        {copiedVerse === u.id ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        data-testid="verse-bookmark-btn"
                        onClick={() => handleToggleNonGitaBookmark(u)}
                        title="Save bookmark"
                        className={`p-1.5 rounded-lg transition ${
                          isBookmarked
                            ? 'text-gold-400 bg-gold-500/10'
                            : 'text-slate-400 hover:text-gold-400 hover:bg-slate-800'
                        }`}
                      >
                        <Bookmark
                          className="w-3.5 h-3.5"
                          fill={isBookmarked ? 'currentColor' : 'none'}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Original Sanskrit / Awadhi / Hindi Text */}
                  <div
                    style={{ fontSize: `${preferences.fontSizeRem * 1.25}rem` }}
                    className="font-serif text-slate-100 font-bold leading-relaxed tracking-wide text-center py-2 whitespace-pre-line text-amber-200"
                  >
                    {u.originalText}
                  </div>

                  {/* Roman IAST Transliteration */}
                  {preferences.showTransliteration && u.transliteration && (
                    <p className="text-xs text-slate-400 italic text-center font-serif leading-relaxed whitespace-pre-line">
                      {u.transliteration}
                    </p>
                  )}

                  {/* English Translation */}
                  <div
                    style={{ fontSize: `${preferences.fontSizeRem}rem` }}
                    className="text-slate-200 leading-relaxed text-sm pt-1"
                  >
                    {u.translationEn}
                  </div>

                  {/* Hindi Translation if available */}
                  {u.translationHi && (
                    <div className="pt-2 border-t border-slate-800/60 text-xs text-amber-100/90 leading-relaxed font-serif">
                      <span className="font-semibold text-gold-400">हिन्दी अनुवाद:</span>{' '}
                      {u.translationHi}
                    </div>
                  )}

                  {/* Audio Provenance Attribution */}
                  {u.audio ? (
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60 text-[11px] text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span>
                        <strong>Authentic Human Recording:</strong> {u.audio.performer} • {u.audio.license} • {u.audio.source}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60 text-[11px] text-slate-500">
                      <VolumeX className="w-3.5 h-3.5 text-slate-500" />
                      <span>Correct devotional recording awaiting verification.</span>
                    </div>
                  )}
                </div>
              );
            })
          )
        )}
      </main>
      </TwoColumnReadingLayout>

      {/* Audio Status Note */}
      <div className="p-4 rounded-xl bg-navy-950/50 border border-slate-800/80 text-xs text-slate-400 space-y-1">
        <p className="font-semibold text-slate-300">
          Liturgical Provenance & Authenticity Notice:
        </p>
        <p>
          For Vedas, Mantras, and Stotras, authentic human recitations verified under open licenses (CC0, CC BY) are integrated into local playback. Bhagavad Gita Chapter 1 chanting is available via official accepted YouTube embed (Chinmaya Channel). Collections without verified open recordings (including Aartis, Chalisas, and Ramayana) remain in authenticated text-only mode.
        </p>
      </div>

      {/* Scripture Navigation Drawer */}
      <ScriptureNavigationDrawer
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        title="Hinduism Sacred Corpus"
        nativeTitle="सनातन धर्म साहित्य"
        hierarchyLabels={['Collection', 'Text / Adhyaya']}
        nodes={HINDUISM_COLLECTIONS.map((col, idx) => ({
          id: idx + 1,
          levelIndex: 1,
          levelName: 'Collection',
          title: col.title,
          nativeTitle: col.nativeTitle,
          unitCount: col.versesCount,
          hasChildren: col.id === 'gita',
          targetAddress: {
            religionId: 'hinduism',
            collectionId: col.id,
            path: [{ levelName: 'Collection', identifier: col.id, label: col.title }],
            unitIdentifier: 1,
          },
        }))}
        onSelectAddress={(addr) => {
          handleSelectCollection(addr.collectionId);
        }}
      />

      {/* Search Modal */}
      <UniversalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        collectionTitle="Hinduism Sacred Library"
        onSearch={(q) => hinduismProvider.search(q)}
        onSelectResult={(addr) => {
          const ch = addr.collectionId === 'gita' ? (Number(addr.path[0]?.identifier) || 1) : undefined;
          handleSelectCollection(addr.collectionId, ch);
        }}
      />

      {/* Bookmarks Drawer */}
      <UniversalBookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelectBookmark={(addr) => {
          const ch = addr.collectionId === 'gita' ? (Number(addr.path[0]?.identifier) || 1) : undefined;
          handleSelectCollection(addr.collectionId, ch);
        }}
        onRemoveBookmark={(id) => {
          platformStorageService.removeBookmark(id);
          setBookmarks(platformStorageService.getBookmarks('hinduism'));
        }}
        onClearBookmarks={(rel) => {
          platformStorageService.clearBookmarks(rel);
          setBookmarks(platformStorageService.getBookmarks('hinduism'));
        }}
      />

      {/* Audio Status & Licensing Notice Modal */}
      <AudioNoticeModal
        isOpen={isAudioNoticeOpen}
        onClose={() => setIsAudioNoticeOpen(false)}
        religionId="hinduism"
      />

      {/* Scripture Coverage & Availability Transparency Modal */}
      <ScriptureCoverageModal
        isOpen={isCoverageOpen}
        onClose={() => setIsCoverageOpen(false)}
        initialReligionId="hinduism"
      />

      {/* Multilingual Audio Player Bar */}
      {isAudioPlayerVisible && (
        <MultilingualAudioPlayerBar
          title={
            selectedCollectionId === 'gita'
              ? `Bhagavad Gita — Chapter ${currentChapter.chapter_number}`
              : selectedCollection.title
          }
          subtitle={
            selectedCollectionId === 'gita'
              ? `${currentChapter.transliteration} (${currentChapter.name})`
              : selectedCollection.category
          }
          availableEditions={getHinduismAudioEditions(selectedCollectionId)}
          onOpenProvenanceModal={() => setIsAudioNoticeOpen(true)}
          onClose={() => {
            multilingualAudioEngine.stop();
            setIsAudioPlayerVisible(false);
          }}
        />
      )}

      {/* Attribution Footer */}
      <AttributionFooter
        provenance={{
          sourceName: 'Gita Press, Sacred Books of the East & VedicScriptures Critical Corpus',
          sourceUrl: 'https://vedicscriptures.github.io',
          licenseType: 'Public Domain',
          attributionText:
            'Translations by Swami Sivananda (1942), Swami Gambhirananda, Shri Purohit Swami (1935), and Swami Ramsukhdas. Original Sanskrit texts in classical Devanagari. Verified non-AI religious library.',
          isAiGenerated: false,
          verifiedDate: '2026-11-17',
        }}
      />

      {/* Approved YouTube Embed Modal for Bhagavad Gita Chapter 1 */}
      {gitaCh1Req && (
        <YouTubeEmbedModal
          isOpen={isYouTubeModalOpen}
          requirement={gitaCh1Req}
          onClose={() => setIsYouTubeModalOpen(false)}
        />
      )}
    </div>
  );
};
