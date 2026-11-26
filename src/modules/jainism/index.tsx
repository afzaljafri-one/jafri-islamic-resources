// ==============================================================================
// Jainism Scripture Reader Module (Production Integration)
// Classical Scholarly Corpus: Hermann Jacobi Translations (Public Domain)
// Tattvartha Sutra & Navkar Mantra (Authentic Ardhamagadhi Prakrit & Sanskrit)
// Jafri Religious Books & Audio Platform
// ==============================================================================

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Bookmark,
  Share2,
  Check,
  CheckCircle2,
  Search,
  Sliders,
  Volume2,
  VolumeX,
  Info,
  ShieldCheck,
  Youtube,
  BookOpen,
} from 'lucide-react';
import {
  jainismProvider,
  JAIN_CANONICAL_TEXTS,
  JainTextMeta,
  JainSutraUnit,
} from '../../services/providers/jainismProvider';
import { ScriptureNavigationDrawer } from '../../platform/components/ScriptureNavigationDrawer';
import { UniversalSearchModal } from '../../platform/components/UniversalSearchModal';
import { UniversalBookmarksDrawer } from '../../platform/components/UniversalBookmarksDrawer';
import { AudioNoticeModal } from '../../platform/components/AudioNoticeModal';
import { ScriptureCoverageModal } from '../../platform/components/ScriptureCoverageModal';
import { YouTubeEmbedModal } from '../../platform/components/audio/YouTubeEmbedModal';
import { SACRED_AUDIO_MASTER_CATALOGUE } from '../../platform/data/sacredAudioMasterCatalogue';
import { TypographyControls } from '../../platform/components/TypographyControls';
import { AttributionFooter } from '../../platform/components/AttributionFooter';
import { platformStorageService } from '../../platform/services/storageService';
import { personalLibraryService } from '../../platform/services/personalLibraryService';
import { BookmarkRecord } from '../../platform/types/personalLibrary';
import {
  multilingualAudioEngine,
  ScriptureAudioEditionOption,
  ScriptureUnit,
} from '../../platform/services/multilingualAudioEngine';
import { UniversalBookmark } from '../../platform/types';
import { TwoColumnReadingLayout } from '../../platform/components/layout/TwoColumnReadingLayout';
import { ReadingContext } from '../../platform/services/contextualAudioMatcher';

const JAINISM_AUDIO_EDITIONS: ScriptureAudioEditionOption[] = [
  {
    id: 'jacobi_english_narration',
    name: 'Hermann Jacobi English Translation — Narration [TTS]',
    language: 'en',
    languageName: 'English (Hermann Jacobi)',
    isTranslation: true,
    isSynthesizedNarration: true,
    performerOrNarrator: 'Browser Speech Synthesis (Narration Voice)',
    license: 'Public Domain Translation. Client-side Speech Narration',
    provider: 'WebSpeech API',
  },
  {
    id: 'hindi_tattvartha_narration',
    name: 'Tattvartha Sutra Hindi Translation — Narration [TTS]',
    language: 'hi',
    languageName: 'Hindi (तत्वार्थ सूत्र हिन्दी अनुवाद)',
    isTranslation: true,
    isSynthesizedNarration: true,
    performerOrNarrator: 'Browser Speech Synthesis (Hindi Voice)',
    license: 'Approved Text Translation. Client Speech Narration',
    provider: 'WebSpeech API',
  },
];

interface JainismModuleProps {
  onReturnToHome: () => void;
}

export const JainismModule: React.FC<JainismModuleProps> = ({
  onReturnToHome,
}) => {
  // Selected Text State
  const [selectedText, setSelectedText] = useState<JainTextMeta>(() => {
    if (typeof window !== 'undefined' && window.location?.search) {
      const p = new URLSearchParams(window.location.search);
      const t = p.get('text') || p.get('collection');
      if (t) {
        const found = JAIN_CANONICAL_TEXTS.find((tx) => tx.id === t);
        if (found) return found;
      }
    }
    return JAIN_CANONICAL_TEXTS[0]; // Navkar Mantra
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const p = new URLSearchParams(window.location.search);
    const t = p.get('text') || p.get('collection');
    if (t) {
      const found = JAIN_CANONICAL_TEXTS.find((tx) => tx.id === t);
      if (found && found.id !== selectedText.id) {
        setSelectedText(found);
      }
    }
  }, [window.location.search]);
  const [copiedUnit, setCopiedUnit] = useState<string | null>(null);

  // Platform Controls & Drawers
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);
  const [isAudioNoticeOpen, setIsAudioNoticeOpen] = useState<boolean>(false);
  const [isCoverageOpen, setIsCoverageOpen] = useState<boolean>(false);
  const [isYouTubeModalOpen, setIsYouTubeModalOpen] = useState<boolean>(false);
  const navkarReq = SACRED_AUDIO_MASTER_CATALOGUE.find((r) => r.id === 'REQ-JAI-007') || null;
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState<boolean>(false);

  // Stop multilingual audio when leaving Jainism reading context (unmount only)
  useEffect(() => {
    return () => {
      multilingualAudioEngine.stop();
    };
  }, []);
  const [activeAudioUnitId, setActiveAudioUnitId] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [showTypography, setShowTypography] = useState<boolean>(false);
  const [preferences, setPreferences] = useState(() =>
    platformStorageService.getPreferences()
  );
  const [bookmarks, setBookmarks] = useState<UniversalBookmark[]>(() =>
    platformStorageService.getBookmarks('jainism')
  );

  useEffect(() => {
    const unsub = multilingualAudioEngine.subscribe((st) => {
      setActiveAudioUnitId(st.activeUnitId);
      setIsAudioPlaying(st.playbackState === 'playing');
    });
    return () => unsub();
  }, []);

  // Synchronize Reading Position & Text Progress (Phase 6.1)
  useEffect(() => {
    if (selectedText) {
      const scopeId = (selectedText.id === 'tirthankar_teachings' || selectedText.id === 'tattvartha') ? 'tattvartha' : 'agamas';
      personalLibraryService.saveReadingPosition({
        religion: 'jainism',
        scriptureId: scopeId,
        collectionId: selectedText.id,
        readingId: selectedText.id,
        chapterNumber: selectedText.id,
        verseNumber: 1,
        displayTitle: `${selectedText.titleEn} (${selectedText.titlePrakrit})`,
        displayLocation: selectedText.titleEn,
        updatedAt: new Date().toISOString(),
        timestamp: Date.now(),
      });
      personalLibraryService.recordChapterVisited('jainism', scopeId, selectedText.id, selectedText.titleEn);
    }
  }, [selectedText]);

  // Text Completion State
  const getJainScope = (textId: string) => (textId === 'tirthankar_teachings' || textId === 'tattvartha') ? 'tattvartha' : 'agamas';
  const [isTextCompleted, setIsTextCompleted] = useState<boolean>(() => {
    const scopeId = getJainScope(selectedText.id);
    const prog = personalLibraryService.getProgress('jainism', scopeId);
    return prog?.chaptersCompleted?.includes(selectedText.id) || false;
  });

  useEffect(() => {
    const scopeId = getJainScope(selectedText.id);
    const prog = personalLibraryService.getProgress('jainism', scopeId);
    setIsTextCompleted(prog?.chaptersCompleted?.includes(selectedText.id) || false);
  }, [selectedText.id]);

  // Listen for PersonalLibrary updates and navigation events
  useEffect(() => {
    const unsub = personalLibraryService.subscribe(() => {
      setBookmarks(platformStorageService.getBookmarks('jainism'));
      const scopeId = getJainScope(selectedText.id);
      const prog = personalLibraryService.getProgress('jainism', scopeId);
      setIsTextCompleted(prog?.chaptersCompleted?.includes(selectedText.id) || false);
    });

    const handleNav = (e: any) => {
      if (e.detail?.religion === 'jainism') {
        const targetId = e.detail.readingId || e.detail.collectionId || e.detail.chapter;
        if (targetId) {
          const found = JAIN_CANONICAL_TEXTS.find((tx) => tx.id === targetId);
          if (found) setSelectedText(found);
        }
      }
    };
    window.addEventListener('jafri-navigate-reading', handleNav);

    return () => {
      unsub();
      window.removeEventListener('jafri-navigate-reading', handleNav);
    };
  }, [selectedText.id]);

  const units: JainSutraUnit[] = jainismProvider.getUnits(selectedText.id);

  useEffect(() => {
    if (units.length === 0) return;

    const scriptureUnits: ScriptureUnit[] = units.map((u) => {
      const translations: Record<string, string> = { en: u.englishText };
      if (u.hindiText) {
        translations.hi = u.hindiText;
      }
      return {
        id: `jain_${selectedText.id}_${u.unitId}`,
        label: `${selectedText.titleEn} — ${u.unitId}`,
        originalText: u.prakritText,
        translationText: u.englishText,
        translations,
        originalAudioUrl: null,
        translationAudioUrl: null,
      };
    });

    multilingualAudioEngine.loadUnits('jainism', scriptureUnits);
  }, [selectedText]);

  const handlePlayUnit = (unitId: string) => {
    const uId = `jain_${selectedText.id}_${unitId}`;
    setIsAudioPlayerVisible(true);
    multilingualAudioEngine.play(uId);
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
      } else if (units.length > 0) {
        handlePlayUnit(units[0].unitId);
      }
    }
  };

  const handleSelectText = (text: JainTextMeta) => {
    setSelectedText(text);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    platformStorageService.saveProgress({
      religionId: 'jainism',
      collectionId: text.id,
      lastAddress: {
        religionId: 'jainism',
        collectionId: text.id,
        path: [{ levelName: 'Agama', identifier: text.id, label: text.titleEn }],
        unitIdentifier: 1,
      },
      displayLocation: `${text.titleEn} (${text.titlePrakrit})`,
      updatedAtTimestamp: Date.now(),
    });
  };

  const handleToggleBookmark = (unit: JainSutraUnit) => {
    const bookmarkId = `jai:${selectedText.id}:${unit.unitId}`;
    const exists = bookmarks.some((b) => b.id === bookmarkId);
    const scopeId = getJainScope(selectedText.id);

    if (exists) {
      personalLibraryService.removeBookmark(bookmarkId);
    } else {
      const bkm: BookmarkRecord = {
        id: bookmarkId,
        religion: 'jainism',
        scriptureId: scopeId,
        collectionId: selectedText.id,
        readingId: selectedText.id,
        chapterNumber: selectedText.id,
        verseNumber: unit.unitId,
        displayTitle: `${selectedText.titleEn} [${unit.unitId}]`,
        displaySubtitle: unit.chapterTitle,
        originalTextReference: unit.prakritText,
        translationText: unit.englishText,
        createdAt: new Date().toISOString(),
        timestamp: Date.now(),
      };
      personalLibraryService.addBookmark(bkm);
    }
    setBookmarks(platformStorageService.getBookmarks('jainism'));
  };

  const handleCopyUnit = (unit: JainSutraUnit) => {
    const text = `${unit.prakritText}\n${unit.transliteration || ''}\n"${unit.englishText}"\n— ${selectedText.titleEn} (${unit.unitId})`;
    navigator.clipboard.writeText(text);
    setCopiedUnit(unit.unitId);
    setTimeout(() => setCopiedUnit(null), 2000);
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Breadcrumb & Controls Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-950 border border-slate-800 shadow-lg">
        {/* Navigation & Text Indicator */}
        <div className="flex items-center flex-wrap gap-2 min-w-0">
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
            <span>Agama Catalog</span>
          </button>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div className="flex items-center space-x-2 truncate">
            <span className="text-xs font-bold text-slate-100">Jain Scriptures</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs font-serif text-gold-400 font-bold truncate">
              {selectedText.titleEn}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 font-medium hidden sm:inline">
              {selectedText.category}
            </span>
          </div>
        </div>

        {/* Action Controls: Text Switcher, Search, Bookmarks, Typography */}
        <div className="flex items-center flex-wrap gap-2 self-end lg:self-auto">
          {/* Quick Scripture Switcher */}
          <select
            value={selectedText.id}
            onChange={(e) => {
              const found = JAIN_CANONICAL_TEXTS.find((t) => t.id === e.target.value);
              if (found) handleSelectText(found);
            }}
            className="bg-navy-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-gold-500 font-medium cursor-pointer max-w-[200px] truncate"
          >
            {JAIN_CANONICAL_TEXTS.map((t) => (
              <option key={t.id} value={t.id}>
                {t.titleEn}
              </option>
            ))}
          </select>

          {/* Navkar Mantra Approved YouTube Chanting (REQ-JAI-007) */}
          {selectedText.id === 'navkar_mahamantra' && navkarReq && (
            <button
              onClick={() => setIsYouTubeModalOpen(true)}
              title="Listen to Navkar Mantra (108 Repetitions • Accepted YouTube Chanting • REQ-JAI-007)"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 hover:border-amber-400 text-amber-300 text-xs font-bold transition shadow-sm"
              data-testid="navkar-youtube-btn"
            >
              <Youtube className="w-3.5 h-3.5 text-red-400" />
              <span>Navkar Chanting</span>
            </button>
          )}

          {/* Multilingual Audio Player Button — Disabled pending verified open human audio */}
          <button
            disabled={true}
            onClick={handleToggleAudioPlayer}
            title="Audio unavailable for this text. Awaiting verified open licensing clearance."
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold bg-navy-950 border-slate-800 text-slate-500 opacity-40 cursor-not-allowed"
            data-testid="multilingual-audio-btn"
          >
            <VolumeX className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Audio Unavailable</span>
          </button>

          {/* Audio Recitation Status */}
          <button
            onClick={() => setIsAudioNoticeOpen(true)}
            title="Navkar Mantra & Sutra Audio Status"
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
            data-testid="jainism-coverage-btn"
          >
            <BookOpen className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden sm:inline">Coverage</span>
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            title="Search Jain Agamas"
            className="p-2 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400 text-xs transition"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsBookmarksOpen(true)}
            title="Saved Sutra Bookmarks"
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

      {/* Jain Collections Quick Switcher Bar */}
      <div className="p-3.5 rounded-2xl bg-navy-950/70 border border-slate-800 space-y-2.5">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Jain Sacred Collections & Treatises:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {JAIN_CANONICAL_TEXTS.map((t) => {
            const isSelected = selectedText.id === t.id;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectText(t)}
                className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'bg-rose-500/15 border-rose-500/80 ring-1 ring-rose-500/40 text-rose-300'
                    : 'bg-navy-900/50 border-slate-800/80 hover:bg-navy-800/60 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="font-semibold truncate">{t.titleEn}</div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {t.tradition.includes('Both') ? 'Universal / Both' : t.tradition}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Text Overview Header Banner */}
      <div className="p-5 rounded-2xl bg-navy-950/80 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-rose-400 uppercase tracking-wide px-2 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-[11px]">
              {selectedText.category}
            </span>
            <span className="text-slate-400 text-xs">
              {selectedText.tradition} • {selectedText.originalLanguage}
            </span>
          </div>
          <span className="text-emerald-400 font-medium text-[11px] flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{selectedText.licensingStatus} (Zero AI Content)</span>
          </span>
        </div>

        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h2 className="text-base sm:text-lg font-serif font-bold text-slate-100">
            {selectedText.titleEn}
          </h2>
          <span className="text-sm font-serif text-gold-400">
            {selectedText.titlePrakrit}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {selectedText.summary}
        </p>

        {/* Sectarian Distinction Box (Essential for Bhaktamar Stotra & Agamas) */}
        {selectedText.sectarianNote && (
          <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl text-xs text-amber-200 leading-relaxed">
            <span className="font-bold text-amber-400">Sectarian Context (Shvetambara & Digambara):</span>{' '}
            {selectedText.sectarianNote}
          </div>
        )}

        <div className="pt-2 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center gap-2">
            <span>
              <strong>Author/Compiler:</strong> {selectedText.authorOrCompiler}
            </span>
            {selectedText.translatorOrCommentator && (
              <span>
                <strong>Scholarly Translation:</strong> {selectedText.translatorOrCommentator}
              </span>
            )}
          </div>
          <button
            data-testid="mark-completed-toggle-btn"
            onClick={() => {
              const scopeId = getJainScope(selectedText.id);
              personalLibraryService.toggleChapterCompleted('jainism', scopeId, selectedText.id);
            }}
            title={isTextCompleted ? "Text marked as completed. Click to reopen." : "Click to mark this text as completed"}
            className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition flex items-center space-x-1 cursor-pointer ${
              isTextCompleted
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold'
                : 'bg-navy-900 border border-slate-700 hover:border-gold-500/50 text-slate-300 hover:text-gold-300'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isTextCompleted ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>{isTextCompleted ? 'Text Completed' : 'Mark Text Done'}</span>
          </button>
        </div>
      </div>

      {/* Main Sutras Reading Area with Contextual Sacred Audio Player */}
      {(() => {
        const readingContext: ReadingContext = {
          religionId: 'jainism',
          categoryId: selectedText.category || 'Agamas & Stotras',
          scriptureId: selectedText.id,
          collectionId: selectedText.id,
          readingId: selectedText.id,
          bookName: selectedText.titleEn,
          canonicalTitle: selectedText.titleEn,
          title: selectedText.titlePrakrit ? `${selectedText.titleEn} (${selectedText.titlePrakrit})` : selectedText.titleEn,
        };

        return (
          <TwoColumnReadingLayout
            context={readingContext}
            multilingualControls={{
              isVisible: isAudioPlayerVisible,
              title: `${selectedText.titleEn}`,
              subtitle: `${selectedText.titlePrakrit} (Prakrit & English)`,
              availableEditions: JAINISM_AUDIO_EDITIONS,
              onOpenProvenanceModal: () => setIsAudioNoticeOpen(true),
              onClose: () => {
                multilingualAudioEngine.stop();
                setIsAudioPlayerVisible(false);
              },
            }}
          >
            <main className="space-y-4 min-h-[450px]">
        {units.length === 0 ? (
          <div className="py-24 text-center text-slate-500 text-xs space-y-2">
            <Info className="w-8 h-8 mx-auto text-slate-600" />
            <p>No sutras available for this collection.</p>
          </div>
        ) : (
          units.map((unit) => {
            const uId = `jain_${selectedText.id}_${unit.unitId}`;
            const isPlayingThisUnit = activeAudioUnitId === uId && isAudioPlaying;
            const isBookmarked = bookmarks.some(
              (b) => b.id === `jai:${selectedText.id}:${unit.unitId}`
            );

            return (
              <div
                key={unit.unitId}
                id={`unit-${unit.unitId}`}
                data-sutra-id={unit.unitId}
                className={`p-5 rounded-2xl border transition space-y-3 group ${
                  isPlayingThisUnit
                    ? 'bg-gold-500/15 border-gold-500/60 shadow-lg ring-1 ring-gold-500/50'
                    : 'bg-navy-950/70 hover:bg-navy-900/80 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Header: Sutra ID & Chapter */}
                <div className="flex items-center justify-between text-xs border-b border-slate-800/60 pb-2">
                  <div className="flex items-center space-x-2">
                    <button
                      disabled={true}
                      data-testid={`play-unit-${unit.unitId}-btn`}
                      className="p-1 rounded text-slate-600 cursor-not-allowed opacity-40 transition"
                      title="Authentic Prakrit chanting not available for this unit. For English narration [TTS], activate the audio player bar."
                    >
                      <VolumeX className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono text-gold-400 px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/20 text-[11px]">
                      {unit.unitId}
                    </span>
                    {unit.chapterTitle && (
                      <span className="text-slate-400 text-[11px] font-medium">
                        {unit.chapterTitle}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleCopyUnit(unit)}
                      title="Copy sutra"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                    >
                      {copiedUnit === unit.unitId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      data-testid="verse-bookmark-btn"
                      onClick={() => handleToggleBookmark(unit)}
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

                {/* Original Ardhamagadhi Prakrit / Sanskrit in Devanagari */}
                <div
                  style={{ fontSize: `${preferences.fontSizeRem * 1.25}rem` }}
                  className="font-serif text-slate-100 font-bold leading-relaxed tracking-wide text-center py-1 whitespace-pre-line text-rose-200"
                >
                  {unit.prakritText}
                </div>

                {/* Roman Phonetic Transliteration */}
                {preferences.showTransliteration && unit.transliteration && (
                  <p className="text-xs text-slate-400 italic text-center font-serif leading-relaxed whitespace-pre-line">
                    {unit.transliteration}
                  </p>
                )}

                {/* Authentic English Translation */}
                <p
                  style={{ fontSize: `${preferences.fontSizeRem}rem` }}
                  className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-2 border-t border-slate-800/40 font-serif"
                >
                  {unit.englishText}
                </p>
              </div>
            );
          })
        )}
            </main>
          </TwoColumnReadingLayout>
        );
      })()}

      {/* Audio Status Note */}
      <div className="p-3.5 rounded-2xl bg-navy-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>
            <strong>Traditional Audio Status:</strong> Authentic Navkar Mantra and sutra chanting audio from verified Jain pedagogical trusts require institutional host authorization. Controls remain disabled to guarantee authentic non-commercial attribution.
          </span>
        </div>
      </div>

      {/* Standardized Provenance & Attribution Footer */}
      <AttributionFooter
        provenance={{
          sourceName:
            'Sacred Books of the East (Vols. 22 & 45, Oxford Clarendon Press)',
          sourceUrl: 'https://sacred-texts.com/jai/',
          licenseType: 'Public Domain',
          attributionText:
            'Canonical Jain Agamas and Treatises. English translations by Professor Hermann Jacobi (1884/1895). Ardhamagadhi Prakrit and Sanskrit root texts preserved from canonical recensions. Free of artificial or synthetic generation.',
          isAiGenerated: false,
          verifiedDate: '2026-11-17',
        }}
      />

      {/* Agamas Navigation Drawer */}
      <ScriptureNavigationDrawer
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        title="Jain Agama & Treatise Catalog"
        nativeTitle="जैन आगम एवं ग्रन्थावली"
        hierarchyLabels={['Category', 'Scripture']}
        nodes={JAIN_CANONICAL_TEXTS.map((t) => ({
          id: t.id,
          levelIndex: 1,
          levelName: t.category,
          title: t.titleEn,
          nativeTitle: t.titlePrakrit,
          hasChildren: false,
          targetAddress: {
            religionId: 'jainism',
            collectionId: t.id,
            path: [{ levelName: 'Agama', identifier: t.id, label: t.titleEn }],
            unitIdentifier: 1,
          },
        }))}
        onSelectAddress={(addr) => {
          const tId = String(addr.path[0]?.identifier || 'navkar');
          const found = JAIN_CANONICAL_TEXTS.find((t) => t.id === tId) || JAIN_CANONICAL_TEXTS[0];
          handleSelectText(found);
        }}
      />

      {/* Search Modal */}
      <UniversalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        collectionTitle="Jain Agamas & Treatises"
        onSearch={async (q) => jainismProvider.search(q)}
        onSelectResult={(addr) => {
          const tId = String(addr.path[0]?.identifier || 'navkar');
          const found = JAIN_CANONICAL_TEXTS.find((t) => t.id === tId) || JAIN_CANONICAL_TEXTS[0];
          handleSelectText(found);
        }}
      />

      {/* Bookmarks Drawer */}
      <UniversalBookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelectBookmark={(addr) => {
          const tId = String(addr.path[0]?.identifier || 'navkar');
          const found = JAIN_CANONICAL_TEXTS.find((t) => t.id === tId) || JAIN_CANONICAL_TEXTS[0];
          handleSelectText(found);
        }}
        onRemoveBookmark={(id) => {
          platformStorageService.removeBookmark(id);
          setBookmarks(platformStorageService.getBookmarks('jainism'));
        }}
        onClearBookmarks={(rel) => {
          platformStorageService.clearBookmarks(rel);
          setBookmarks(platformStorageService.getBookmarks('jainism'));
        }}
      />

      {/* Audio Status & Licensing Notice Modal */}
      <AudioNoticeModal
        isOpen={isAudioNoticeOpen}
        onClose={() => setIsAudioNoticeOpen(false)}
        religionId="jainism"
      />

      {/* Scripture Coverage & Availability Transparency Modal */}
      <ScriptureCoverageModal
        isOpen={isCoverageOpen}
        onClose={() => setIsCoverageOpen(false)}
        initialReligionId="jainism"
      />

      {/* Approved YouTube Embed Modal for Navkar Mantra */}
      {navkarReq && (
        <YouTubeEmbedModal
          isOpen={isYouTubeModalOpen}
          requirement={navkarReq}
          onClose={() => setIsYouTubeModalOpen(false)}
        />
      )}
    </div>
  );
};
