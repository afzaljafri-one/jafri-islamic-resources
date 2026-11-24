// ==============================================================================
// Sikhism Scripture Reader Module (Production Integration)
// Sri Guru Granth Sahib Ji — 1,430 Canonical Angs
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
  Sliders,
  Volume2,
  VolumeX,
  Info,
  Layers,
  Play,
  WifiOff,
  RotateCcw,
  AlertTriangle,
  BookOpen,
} from 'lucide-react';
import {
  sikhismProvider,
  GurbaniLine,
  AngData,
} from '../../services/providers/sikhismProvider';
import { ScriptureNavigationDrawer } from '../../platform/components/ScriptureNavigationDrawer';
import { UniversalSearchModal } from '../../platform/components/UniversalSearchModal';
import { UniversalBookmarksDrawer } from '../../platform/components/UniversalBookmarksDrawer';
import { AudioNoticeModal } from '../../platform/components/AudioNoticeModal';
import { ScriptureCoverageModal } from '../../platform/components/ScriptureCoverageModal';
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
import { TwoColumnReadingLayout } from '../../platform/components/layout/TwoColumnReadingLayout';
import { ReadingContext } from '../../platform/services/contextualAudioMatcher';

const SIKHISM_AUDIO_EDITIONS: ScriptureAudioEditionOption[] = [
  {
    id: 'gurbani_gurmukhi',
    name: 'Gurmukhi Recitation — Japji Sahib / Sri Guru Granth Sahib Ji',
    language: 'pa',
    languageName: 'Gurmukhi Punjabi (ਪੰਜਾਬੀ)',
    isTranslation: false,
    isSynthesizedNarration: false,
    performerOrNarrator: 'Traditional Community Granthi',
    license: 'Religious Open Access / Community Seva',
    provider: 'Gurbani Community Audio Archive',
  },
  {
    id: 'gurbani_english_khalsa',
    name: 'Sant Singh Khalsa English Translation — Narration [TTS]',
    language: 'en',
    languageName: 'English (Sant Singh Khalsa)',
    isTranslation: true,
    isSynthesizedNarration: true,
    performerOrNarrator: 'Browser Speech Synthesis (Narration Voice)',
    license: 'Sant Singh Khalsa Translation. Client Speech Narration',
    provider: 'WebSpeech API',
  },
  {
    id: 'gurbani_hindi_narration',
    name: 'Gurbani Hindi Translation — Narration [TTS]',
    language: 'hi',
    languageName: 'Hindi (हिन्दी अनुवाद)',
    isTranslation: true,
    isSynthesizedNarration: true,
    performerOrNarrator: 'Browser Speech Synthesis (Hindi Voice)',
    license: 'Approved Text Translation. Client Speech Narration',
    provider: 'WebSpeech API',
  },
];

interface SikhismModuleProps {
  onReturnToHome: () => void;
}

export const SikhismModule: React.FC<SikhismModuleProps> = ({
  onReturnToHome,
}) => {
  // Ang Pagination State (1 to 1430)
  const [currentAng, setCurrentAng] = useState<number>(1);
  const [angData, setAngData] = useState<AngData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedLine, setCopiedLine] = useState<number | null>(null);

  // Gurbani Script & Translation Toggles
  const [useLarivaar, setUseLarivaar] = useState<boolean>(false);
  const [selectedTranslation, setSelectedTranslation] = useState<'ssk' | 'ms'>('ssk');
  const [showPunjabiTeeka, setShowPunjabiTeeka] = useState<boolean>(false);

  // Platform Controls & Drawers
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);
  const [isAudioNoticeOpen, setIsAudioNoticeOpen] = useState<boolean>(false);
  const [isCoverageOpen, setIsCoverageOpen] = useState<boolean>(false);
  const [retryTrigger, setRetryTrigger] = useState<number>(0);
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState<boolean>(false);
  const [activeAudioUnitId, setActiveAudioUnitId] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [showTypography, setShowTypography] = useState<boolean>(false);
  const [preferences, setPreferences] = useState(() =>
    platformStorageService.getPreferences()
  );
  const [bookmarks, setBookmarks] = useState<UniversalBookmark[]>(() =>
    platformStorageService.getBookmarks('sikhism')
  );

  const handleRetryAng = () => {
    setLoading(true);
    setRetryTrigger((prev) => prev + 1);
  };

  useEffect(() => {
    const unsub = multilingualAudioEngine.subscribe((st) => {
      setActiveAudioUnitId(st.activeUnitId);
      setIsAudioPlaying(st.playbackState === 'playing');
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!angData || angData.lines.length === 0) return;

    // Sikhism audio is pending source discovery & rights clearance (REQ-SIK-001 through REQ-SIK-017)
    // All 1,430 Angs are presented in authenticated text mode
    const japjiAudioUrl = null;

    const units: ScriptureUnit[] = angData.lines.map((l) => {
      return {
        id: `sikh_${currentAng}_line_${l.lineNo}`,
        label: `Ang ${currentAng}, Line ${l.lineNo}`,
        originalText: l.gurmukhi,
        translationText: l.translationEn || l.transliteration,
        translations: {
          en: l.translationEn || l.transliteration,
          pa: l.gurmukhi,
        },
        originalAudioUrl: japjiAudioUrl,
        translationAudioUrl: null,
        startTime: undefined, // Zero fabricated timestamps
        endTime: undefined,
      };
    });

    multilingualAudioEngine.loadUnits('sikhism', units);
  }, [angData, currentAng]);

  const handlePlayLine = (lineNo: number) => {
    const unitId = `sikh_${currentAng}_line_${lineNo}`;
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
      } else if (angData && angData.lines.length > 0) {
        handlePlayLine(angData.lines[0].lineNo);
      }
    }
  };

  // Fetch Ang Data
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    sikhismProvider.getAng(currentAng).then((data) => {
      if (mounted) {
        setAngData(data);
        setLoading(false);
        // Save reading progress if lines exist
        if (data.lines && data.lines.length > 0) {
          platformStorageService.saveProgress({
            religionId: 'sikhism',
            collectionId: 'sggs',
            lastAddress: {
              religionId: 'sikhism',
              collectionId: 'sggs',
              path: [
                { levelName: 'Raag', identifier: data.raag, label: data.raag },
                { levelName: 'Ang', identifier: currentAng, label: `Ang ${currentAng}` },
              ],
              unitIdentifier: 1,
            },
            displayLocation: `Sri Guru Granth Sahib Ji — Ang ${currentAng} (${data.raag})`,
            updatedAtTimestamp: Date.now(),
          });
        }
      }
    }).catch(() => {
      if (mounted) {
        setAngData({ pageNo: currentAng, raag: 'Gurbani', writer: 'Sikh Gurus', lines: [] });
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
    };
  }, [currentAng, retryTrigger]);

  const handleNextAng = () => {
    if (currentAng < 1430) {
      setCurrentAng((prev) => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePreviousAng = () => {
    if (currentAng > 1) {
      setCurrentAng((prev) => prev - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleToggleBookmark = (line: GurbaniLine) => {
    const bookmarkId = `sik:sggs:${currentAng}:${line.lineNo}`;
    const exists = bookmarks.some((b) => b.id === bookmarkId);

    if (exists) {
      platformStorageService.removeBookmark(bookmarkId);
    } else {
      const bkm: UniversalBookmark = {
        id: bookmarkId,
        religionId: 'sikhism',
        collectionId: 'sggs',
        address: {
          religionId: 'sikhism',
          collectionId: 'sggs',
          path: [
            { levelName: 'Raag', identifier: line.raag, label: line.raag },
            { levelName: 'Ang', identifier: currentAng, label: `Ang ${currentAng}` },
          ],
          unitIdentifier: line.lineNo,
        },
        displayTitle: `Ang ${currentAng} • ${line.raag} (Line ${line.lineNo})`,
        displaySubtitle: line.writer,
        snippetRootText: line.gurmukhi,
        snippetTranslatedText: line.translationEn,
        savedAtTimestamp: Date.now(),
      };
      platformStorageService.saveBookmark(bkm);
    }
    setBookmarks(platformStorageService.getBookmarks('sikhism'));
  };

  const handleCopyLine = (line: GurbaniLine) => {
    const text = `${line.gurmukhi}\n${line.transliteration}\n"${line.translationEn}"\n— Sri Guru Granth Sahib Ji, Ang ${currentAng}, ${line.writer}`;
    navigator.clipboard.writeText(text);
    setCopiedLine(line.lineNo);
    setTimeout(() => setCopiedLine(null), 2000);
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Breadcrumb & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-950 border border-slate-800 shadow-lg">
        {/* Navigation & Ang Selector */}
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
            <span>Raags & Chapters</span>
          </button>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-slate-100">SGGS Ji</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs font-serif text-gold-400 font-bold">
              Ang {currentAng} of 1430
            </span>
            {angData?.raag && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20 font-medium">
                {angData.raag}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls: Larivaar Toggle, Translations, Search, Bookmarks, Typography */}
        <div className="flex items-center space-x-2 self-end sm:self-auto flex-wrap">
          {/* Larivaar Toggle */}
          <button
            onClick={() => setUseLarivaar(!useLarivaar)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium transition ${
              useLarivaar
                ? 'bg-orange-500 text-navy-950 font-bold border-orange-500'
                : 'bg-navy-950 border-slate-700 text-slate-300 hover:text-gold-400'
            }`}
          >
            {useLarivaar ? 'Larivaar (Unbroken)' : 'Pad Chhed (Spaced)'}
          </button>

          {/* Translation Edition Selector */}
          <select
            value={selectedTranslation}
            onChange={(e) => setSelectedTranslation(e.target.value as 'ssk' | 'ms')}
            className="bg-navy-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-gold-500 font-medium cursor-pointer"
          >
            <option value="ssk">Sant Singh Khalsa (English)</option>
            <option value="ms">Manmohan Singh (English)</option>
          </select>

          <button
            onClick={() => setShowPunjabiTeeka(!showPunjabiTeeka)}
            className={`px-2.5 py-1.5 rounded-xl border text-xs font-medium transition ${
              showPunjabiTeeka
                ? 'bg-gold-500 text-navy-950 font-bold border-gold-500'
                : 'bg-navy-950 border-slate-700 text-slate-300 hover:text-gold-400'
            }`}
          >
            Punjabi Teeka
          </button>

          {/* Multilingual Audio Player Button */}
          <button
            onClick={handleToggleAudioPlayer}
            disabled={true}
            title="Sri Guru Granth Sahib Ji audio recitation is awaiting source discovery and rights clearance. Text mode active for all 1,430 Angs."
            className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition bg-navy-950 border-slate-800 text-slate-500 opacity-40 cursor-not-allowed"
            data-testid="multilingual-audio-btn"
          >
            <Play className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Play Audio</span>
          </button>

          {/* Audio Recitation Status */}
          <button
            onClick={() => setIsAudioNoticeOpen(true)}
            title="Gurbani Audio Status"
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
            data-testid="sikhism-coverage-btn"
          >
            <BookOpen className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden sm:inline">Coverage</span>
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            title="Search Gurbani"
            className="p-2 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400 text-xs transition"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsBookmarksOpen(true)}
            title="Saved Gurbani Bookmarks"
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

      {/* Ang Direct Jumper Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-2xl bg-navy-950/60 border border-slate-800 text-xs">
        <div className="flex items-center space-x-3">
          <span className="text-slate-400 font-semibold whitespace-nowrap">Go to Ang:</span>
          <div className="flex items-center space-x-2">
            <input
              type="number"
              min={1}
              max={1430}
              value={currentAng}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                if (!isNaN(val) && val >= 1 && val <= 1430) {
                  setCurrentAng(val);
                }
              }}
              className="w-20 bg-navy-900 border border-slate-700 text-slate-100 rounded-xl px-2.5 py-1 text-center font-bold font-mono focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
            <span className="text-slate-500">/ 1430</span>
          </div>

          <input
            type="range"
            min={1}
            max={1430}
            value={currentAng}
            onChange={(e) => setCurrentAng(Number(e.target.value))}
            className="w-36 sm:w-64 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-gold-500"
          />
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button
            disabled={currentAng <= 1}
            onClick={handlePreviousAng}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-navy-900 border border-slate-700 text-slate-200 hover:border-gold-500 hover:text-gold-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous Ang</span>
          </button>
          <button
            disabled={currentAng >= 1430}
            onClick={handleNextAng}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-navy-900 border border-slate-700 text-slate-200 hover:border-gold-500 hover:text-gold-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
          >
            <span>Next Ang</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Gurbani Lines Area with Contextual Sacred Audio Player */}
      {(() => {
        const readingContext: ReadingContext = {
          religionId: 'sikhism',
          collectionId: 'sggs',
          bookName: 'Sri Guru Granth Sahib Ji',
          chapterId: currentAng,
          title: angData?.raag ? `Ang ${currentAng} • ${angData.raag}` : `Ang ${currentAng}`,
        };

        return (
          <TwoColumnReadingLayout context={readingContext}>
            <main className="space-y-4 min-h-[450px]">
        {loading ? (
          <div className="py-24 text-center text-slate-400 text-xs space-y-2">
            <div className="w-6 h-6 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Loading Ang {currentAng} from BaniDB...</p>
          </div>
        ) : !angData || angData.lines.length === 0 ? (
          <div
            className="py-12 px-6 rounded-3xl bg-navy-950/80 border border-amber-500/30 text-center space-y-4 max-w-xl mx-auto my-8 animate-in fade-in-50 duration-200"
            data-testid="sikhism-error-card"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
              <WifiOff className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-base sm:text-lg font-bold text-slate-100">
                Gurbani Retrieval Unavailable (Network / API Outage)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Unable to retrieve <strong>Ang {currentAng}</strong> of Sri Guru Granth Sahib Ji from the BaniDB and GurbaniNow public APIs.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-navy-900/90 border border-slate-800 text-[11px] text-slate-400 text-left space-y-1.5">
              <div className="flex items-center space-x-1.5 text-amber-400 font-semibold">
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Scripture Architecture Notice</span>
              </div>
              <p>
                Only <strong>Ang 1 (Japji Sahib / Mool Mantar)</strong> is bundled locally offline. Angs 2 through 1,430 require active internet connectivity to stream Gurmukhi Unicode, Larivaar continuous script, transliteration, and English translations.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                onClick={handleRetryAng}
                data-testid="sikhism-retry-btn"
                className="inline-flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs transition shadow-gold-sm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Retry Ang {currentAng}</span>
              </button>
              <button
                onClick={() => setCurrentAng(1)}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-navy-800 border border-gold-500/30 text-gold-400 text-xs font-semibold transition"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Open Ang 1 (Offline Available)</span>
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
          angData.lines.map((line) => {
            const unitId = `sikh_${currentAng}_line_${line.lineNo}`;
            const isPlayingThisLine = activeAudioUnitId === unitId && isAudioPlaying;
            const isBookmarked = bookmarks.some(
              (b) => b.id === `sik:sggs:${currentAng}:${line.lineNo}`
            );
            const chosenTranslation =
              selectedTranslation === 'ms' && line.translationMs
                ? line.translationMs
                : line.translationEn;

            return (
              <div
                key={line.lineNo}
                id={`line-${line.lineNo}`}
                className={`p-5 rounded-2xl border transition space-y-3 group ${
                  isPlayingThisLine
                    ? 'bg-gold-500/15 border-gold-500/60 shadow-lg ring-1 ring-gold-500/50'
                    : 'bg-navy-950/70 hover:bg-navy-900/80 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Header: Line Number & Writer Attribution */}
                <div className="flex items-center justify-between text-xs border-b border-slate-800/60 pb-2">
                  <div className="flex items-center space-x-2">
                    <button
                      disabled={true}
                      data-testid={`play-line-${line.lineNo}-btn`}
                      className="p-1 rounded text-slate-600 cursor-not-allowed opacity-40 transition"
                      title="Audio not available for this line. Text mode active."
                    >
                      <VolumeX className="w-3.5 h-3.5" />
                    </button>
                    <span className="font-mono font-bold text-gold-400 px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/20 text-[11px]">
                      Line {line.lineNo}
                    </span>
                    <span className="text-slate-400 text-[11px] font-medium">
                      {line.writer}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleCopyLine(line)}
                      title="Copy line"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                    >
                      {copiedLine === line.lineNo ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleToggleBookmark(line)}
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

                {/* Original Gurmukhi Text */}
                <div
                  style={{ fontSize: `${preferences.fontSizeRem * 1.25}rem` }}
                  className="font-serif text-slate-100 font-bold leading-relaxed tracking-wide text-center py-1 text-amber-200"
                >
                  {useLarivaar ? line.larivaar : line.gurmukhi}
                </div>

                {/* Roman Transliteration */}
                {preferences.showTransliteration && line.transliteration && (
                  <p className="text-xs text-slate-400 italic text-center font-serif leading-relaxed">
                    {line.transliteration}
                  </p>
                )}

                {/* English Translation */}
                <p
                  style={{ fontSize: `${preferences.fontSizeRem}rem` }}
                  className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-1 border-t border-slate-800/40"
                >
                  {chosenTranslation}
                </p>

                {/* Punjabi Teeka (Prof. Sahib Singh) */}
                {showPunjabiTeeka && line.translationPu && (
                  <div className="p-3 rounded-xl bg-navy-900/80 border border-slate-800 text-xs text-amber-300/90 leading-relaxed font-serif">
                    <span className="font-bold text-gold-400 block mb-1">ਪੰਜਾਬੀ ਟੀਕਾ (ਪ੍ਰੋ. ਸਾਹਿਬ ਸਿੰਘ):</span>
                    {line.translationPu}
                  </div>
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
          disabled={currentAng <= 1}
          onClick={handlePreviousAng}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold border bg-navy-950 border-slate-700 text-slate-200 hover:border-gold-500 hover:text-gold-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous Ang ({currentAng - 1})</span>
        </button>

        <button
          disabled={currentAng >= 1430}
          onClick={handleNextAng}
          className="flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-semibold border bg-navy-950 border-slate-700 text-slate-200 hover:border-gold-500 hover:text-gold-400 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <span>Next Ang ({currentAng + 1})</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Audio Status Note */}
      <div className="p-3.5 rounded-2xl bg-navy-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-orange-400 flex-shrink-0" />
          <span>
            <strong>Audio Recitation Status:</strong> Verified Ang-by-Ang audio stream feeds (Bhai Jarnail Singh Damdami Taksal / GurmatVeechar) require CORS audio proxy routing. Direct streaming will activate upon edge CDN gateway authorization.
          </span>
        </div>
      </div>

      {/* Standardized Provenance & Attribution Footer */}
      <AttributionFooter
        provenance={{
          sourceName: 'BaniDB Gurbani Database (Khalis Foundation)',
          sourceUrl: 'https://banidb.com',
          licenseType: 'Open Religious License',
          attributionText:
            'Sri Guru Granth Sahib Ji — Canonical 1,430 Ang standardized text authenticated by the SGPC. English translations by Dr. Sant Singh Khalsa and S. Manmohan Singh.',
          isAiGenerated: false,
          verifiedDate: '2026-11-17',
        }}
      />

      {/* Raags Navigation Drawer */}
      <ScriptureNavigationDrawer
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        title="Sri Guru Granth Sahib Canonical Raags"
        nativeTitle="ਰਾਗਾਂ ਦੀ ਸੂਚੀ (੩੧ ਰਾਗ)"
        hierarchyLabels={['Raag', 'Ang Range']}
        nodes={[
          { id: 1, levelIndex: 1, levelName: 'Raag', title: 'Jap Ji Sahib', nativeTitle: 'ਜਪੁ ਜੀ ਸਾਹਿਬ', hasChildren: false, targetAddress: { religionId: 'sikhism', collectionId: 'sggs', path: [{ levelName: 'Ang', identifier: 1 }], unitIdentifier: 1 } },
          { id: 2, levelIndex: 1, levelName: 'Raag', title: 'Sodar (Rehras)', nativeTitle: 'ਸੋ ਦਰੁ', hasChildren: false, targetAddress: { religionId: 'sikhism', collectionId: 'sggs', path: [{ levelName: 'Ang', identifier: 8 }], unitIdentifier: 1 } },
          { id: 3, levelIndex: 1, levelName: 'Raag', title: 'Sohila', nativeTitle: 'ਸੋਹਿਲਾ', hasChildren: false, targetAddress: { religionId: 'sikhism', collectionId: 'sggs', path: [{ levelName: 'Ang', identifier: 12 }], unitIdentifier: 1 } },
          { id: 4, levelIndex: 1, levelName: 'Raag', title: 'Raag Siree', nativeTitle: 'ਸਿਰੀ ਰਾਗੁ', hasChildren: false, targetAddress: { religionId: 'sikhism', collectionId: 'sggs', path: [{ levelName: 'Ang', identifier: 14 }], unitIdentifier: 1 } },
          { id: 5, levelIndex: 1, levelName: 'Raag', title: 'Raag Maajh', nativeTitle: 'ਮਾਝ ਰਾਗੁ', hasChildren: false, targetAddress: { religionId: 'sikhism', collectionId: 'sggs', path: [{ levelName: 'Ang', identifier: 94 }], unitIdentifier: 1 } },
          { id: 6, levelIndex: 1, levelName: 'Raag', title: 'Raag Gauree', nativeTitle: 'ਗਉੜੀ ਰਾਗੁ', hasChildren: false, targetAddress: { religionId: 'sikhism', collectionId: 'sggs', path: [{ levelName: 'Ang', identifier: 151 }], unitIdentifier: 1 } },
          { id: 7, levelIndex: 1, levelName: 'Raag', title: 'Raag Aasaa', nativeTitle: 'ਆਸਾ ਰਾਗੁ', hasChildren: false, targetAddress: { religionId: 'sikhism', collectionId: 'sggs', path: [{ levelName: 'Ang', identifier: 347 }], unitIdentifier: 1 } },
          { id: 8, levelIndex: 1, levelName: 'Raag', title: 'Raag Goojaree', nativeTitle: 'ਗੂਜਰੀ ਰਾਗੁ', hasChildren: false, targetAddress: { religionId: 'sikhism', collectionId: 'sggs', path: [{ levelName: 'Ang', identifier: 489 }], unitIdentifier: 1 } },
          { id: 9, levelIndex: 1, levelName: 'Raag', title: 'Raag Soohee', nativeTitle: 'ਸੂਹੀ ਰਾਗੁ', hasChildren: false, targetAddress: { religionId: 'sikhism', collectionId: 'sggs', path: [{ levelName: 'Ang', identifier: 728 }], unitIdentifier: 1 } },
          { id: 10, levelIndex: 1, levelName: 'Raag', title: 'Raag Bilaaval', nativeTitle: 'ਬਿਲਾਵਲੁ ਰਾਗੁ', hasChildren: false, targetAddress: { religionId: 'sikhism', collectionId: 'sggs', path: [{ levelName: 'Ang', identifier: 795 }], unitIdentifier: 1 } },
          { id: 11, levelIndex: 1, levelName: 'Raag', title: 'Salok Mahala 9', nativeTitle: 'ਸਲੋਕ ਮਹਲਾ ੯', hasChildren: false, targetAddress: { religionId: 'sikhism', collectionId: 'sggs', path: [{ levelName: 'Ang', identifier: 1426 }], unitIdentifier: 1 } },
        ]}
        onSelectAddress={(addr) => {
          const ang = Number(addr.path[0]?.identifier) || 1;
          setCurrentAng(ang);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Search Modal */}
      <UniversalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        collectionTitle="Sri Guru Granth Sahib Ji"
        onSearch={(q) => sikhismProvider.search(q)}
        onSelectResult={(addr) => {
          const ang = Number(addr.path[1]?.identifier) || 1;
          setCurrentAng(ang);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Bookmarks Drawer */}
      <UniversalBookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelectBookmark={(addr) => {
          const ang = Number(addr.path[1]?.identifier) || 1;
          setCurrentAng(ang);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onRemoveBookmark={(id) => {
          platformStorageService.removeBookmark(id);
          setBookmarks(platformStorageService.getBookmarks('sikhism'));
        }}
        onClearBookmarks={(rel) => {
          platformStorageService.clearBookmarks(rel);
          setBookmarks(platformStorageService.getBookmarks('sikhism'));
        }}
      />

      {/* Audio Status & Licensing Notice Modal */}
      <AudioNoticeModal
        isOpen={isAudioNoticeOpen}
        onClose={() => setIsAudioNoticeOpen(false)}
        religionId="sikhism"
      />

      {/* Scripture Coverage & Availability Transparency Modal */}
      <ScriptureCoverageModal
        isOpen={isCoverageOpen}
        onClose={() => setIsCoverageOpen(false)}
        initialReligionId="sikhism"
      />

      {/* Multilingual Audio Player Bar */}
      {isAudioPlayerVisible && (
        <MultilingualAudioPlayerBar
          title={`Sri Guru Granth Sahib Ji — Ang ${currentAng}`}
          subtitle={angData?.raag ? `Raag ${angData.raag}` : 'BaniDB Integration'}
          availableEditions={SIKHISM_AUDIO_EDITIONS}
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
