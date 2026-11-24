// ==============================================================================
// Buddhism Scripture Reader Module (Production Integration)
// Early Buddhist Texts: Pali Canon (Tipitaka) with Bhikkhu Sujato CC0 Translations
// Jafri Religious Books & Audio Platform
// ==============================================================================

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Bookmark,
  Share2,
  Check,
  Search,
  Sliders,
  Volume2,
  VolumeX,
  Info,
  ShieldCheck,
  Play,
  Pause,
  BookOpen,
} from 'lucide-react';
import {
  buddhismProvider,
  CANONICAL_SUTTAS,
  SuttaMeta,
  SuttaSegment,
} from '../../services/providers/buddhismProvider';
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

const BUDDHISM_AUDIO_EDITIONS: ScriptureAudioEditionOption[] = [
  {
    id: 'theravada_patimokkha_pali',
    name: 'Bhikkhu Patimokkha Monastic Recitation (Pali • CC BY 3.0)',
    language: 'pli',
    languageName: 'Pali Monastic Recitation',
    isTranslation: false,
    isSynthesizedNarration: false,
    performerOrNarrator: 'พระวินัยธर (Phra Winaithorn)',
    license: 'Creative Commons Attribution 3.0 (CC BY 3.0)',
    provider: 'Wikimedia Commons Free Cultural Works',
  },
  {
    id: 'mahayana_heart_sutra',
    name: 'Heart Sutra Recitation (Classical Mandarin • CC0 1.0)',
    language: 'zh',
    languageName: 'Chinese (般若波罗蜜多心经)',
    isTranslation: false,
    isSynthesizedNarration: false,
    performerOrNarrator: 'Traditional Chinese Buddhist Layperson',
    license: 'Creative Commons Zero (CC0 1.0 Universal)',
    provider: 'Wikimedia Commons',
  },
  {
    id: 'sujato_english_narration',
    name: 'Bhikkhu Sujato English Translation — Approved Narration [TTS]',
    language: 'en',
    languageName: 'English (Bhikkhu Sujato)',
    isTranslation: true,
    isSynthesizedNarration: true,
    performerOrNarrator: 'Browser Speech Synthesis (Narration Voice)',
    license: 'CC0 Public Domain Text. Client-side Speech Narration',
    provider: 'WebSpeech API',
  },
  {
    id: 'hindi_dhammapada_narration',
    name: 'Dhammapada Hindi Translation — Narration [TTS]',
    language: 'hi',
    languageName: 'Hindi (धम्मपद हिन्दी अनुवाद)',
    isTranslation: true,
    isSynthesizedNarration: true,
    performerOrNarrator: 'Browser Speech Synthesis (Hindi Voice)',
    license: 'Approved Text Translation. Client Speech Narration',
    provider: 'WebSpeech API',
  },
];

interface BuddhismModuleProps {
  onReturnToHome: () => void;
}

export const BuddhismModule: React.FC<BuddhismModuleProps> = ({
  onReturnToHome,
}) => {
  // Selected Sutta & Segments State
  const [selectedSutta, setSelectedSutta] = useState<SuttaMeta>(CANONICAL_SUTTAS[0]); // SN 56.11
  const [segments, setSegments] = useState<SuttaSegment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [copiedSegment, setCopiedSegment] = useState<string | null>(null);

  // Platform Controls & Drawers
  const [isNavOpen, setIsNavOpen] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isBookmarksOpen, setIsBookmarksOpen] = useState<boolean>(false);
  const [isAudioNoticeOpen, setIsAudioNoticeOpen] = useState<boolean>(false);
  const [isCoverageOpen, setIsCoverageOpen] = useState<boolean>(false);
  const [isAudioPlayerVisible, setIsAudioPlayerVisible] = useState<boolean>(false);
  const [activeAudioUnitId, setActiveAudioUnitId] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [showTypography, setShowTypography] = useState<boolean>(false);
  const [preferences, setPreferences] = useState(() =>
    platformStorageService.getPreferences()
  );
  const [bookmarks, setBookmarks] = useState<UniversalBookmark[]>(() =>
    platformStorageService.getBookmarks('buddhism')
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

  const handleSelectSutta = (sutta: SuttaMeta) => {
    multilingualAudioEngine.stop();
    setIsAudioPlayerVisible(false);
    setActiveAudioUnitId(null);
    setSelectedSutta(sutta);
  };

  useEffect(() => {
    if (segments.length === 0) return;

    const units: ScriptureUnit[] = segments.map((seg) => ({
      id: `bud_${selectedSutta.uid}_${seg.segmentId}`,
      label: `${selectedSutta.titlePali} — ${seg.segmentId}`,
      originalText: seg.paliText,
      translationText: seg.englishText,
      translations: {
        en: seg.englishText,
      },
      originalAudioUrl: seg.audio?.audioUrl || null,
      translationAudioUrl: null,
      audio: seg.audio
        ? {
            ...seg.audio,
            title: `${selectedSutta.titleEn} (${selectedSutta.titlePali})`,
          }
        : undefined,
    }));

    multilingualAudioEngine.loadUnits('buddhism', units);
  }, [segments, selectedSutta]);

  const handlePlaySegment = (segId: string) => {
    const unitId = `bud_${selectedSutta.uid}_${segId}`;
    setIsAudioPlayerVisible(true);
    if (activeAudioUnitId === unitId && isAudioPlaying) {
      multilingualAudioEngine.pause();
    } else {
      multilingualAudioEngine.play(unitId);
    }
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
      } else if (segments.length > 0) {
        handlePlaySegment(segments[0].segmentId);
      }
    }
  };

  // Fetch Sutta Segments from SuttaCentral
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    buddhismProvider.getSuttaSegments(selectedSutta.uid).then((data) => {
      if (mounted) {
        setSegments(data);
        setLoading(false);
        // Save reading progress
        platformStorageService.saveProgress({
          religionId: 'buddhism',
          collectionId: 'tipitaka',
          lastAddress: {
            religionId: 'buddhism',
            collectionId: 'tipitaka',
            path: [
              { levelName: 'Nikaya', identifier: selectedSutta.nikaya, label: `${selectedSutta.nikaya} Nikaya` },
              { levelName: 'Sutta', identifier: selectedSutta.uid, label: selectedSutta.titlePali },
            ],
            unitIdentifier: '1.1',
          },
          displayLocation: `${selectedSutta.titlePali} (${selectedSutta.titleEn})`,
          updatedAtTimestamp: Date.now(),
        });
      }
    });

    return () => {
      mounted = false;
    };
  }, [selectedSutta]);

  const handleToggleBookmark = (seg: SuttaSegment) => {
    const bookmarkId = `bud:tipitaka:${selectedSutta.uid}:${seg.segmentId}`;
    const exists = bookmarks.some((b) => b.id === bookmarkId);

    if (exists) {
      platformStorageService.removeBookmark(bookmarkId);
    } else {
      const bkm: UniversalBookmark = {
        id: bookmarkId,
        religionId: 'buddhism',
        collectionId: 'tipitaka',
        address: {
          religionId: 'buddhism',
          collectionId: 'tipitaka',
          path: [
            { levelName: 'Nikaya', identifier: selectedSutta.nikaya, label: `${selectedSutta.nikaya} Nikaya` },
            { levelName: 'Sutta', identifier: selectedSutta.uid, label: selectedSutta.titlePali },
          ],
          unitIdentifier: seg.segmentId,
        },
        displayTitle: `${selectedSutta.titlePali} [${seg.segmentId}]`,
        displaySubtitle: selectedSutta.titleEn,
        snippetRootText: seg.paliText,
        snippetTranslatedText: seg.englishText,
        savedAtTimestamp: Date.now(),
      };
      platformStorageService.saveBookmark(bkm);
    }
    setBookmarks(platformStorageService.getBookmarks('buddhism'));
  };

  const handleCopySegment = (seg: SuttaSegment) => {
    const text = `${seg.paliText}\n"${seg.englishText}"\n— ${selectedSutta.titlePali} (${seg.segmentId}), Tr. Bhikkhu Sujato`;
    navigator.clipboard.writeText(text);
    setCopiedSegment(seg.segmentId);
    setTimeout(() => setCopiedSegment(null), 2000);
  };

  return (
    <div className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6 animate-in fade-in-50 duration-200">
      {/* Top Breadcrumb & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-950 border border-slate-800 shadow-lg">
        {/* Navigation & Sutta Title */}
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
            data-testid="buddhism-nav-drawer-btn"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-200 hover:text-gold-400 text-xs font-semibold transition"
          >
            <Layers className="w-4 h-4" />
            <span>Sutta Catalog</span>
          </button>

          <div className="h-4 w-px bg-slate-700 hidden sm:block" />

          <div className="flex items-center space-x-2 truncate">
            <span className="text-xs font-bold text-slate-100">Pali Tipitaka</span>
            <span className="text-xs text-slate-500">•</span>
            <span className="text-xs font-serif text-gold-400 font-bold truncate">
              {selectedSutta.titlePali}
            </span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 font-mono hidden sm:inline">
              {selectedSutta.uid.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Action Controls: Search, Bookmarks, Typography */}
        <div className="flex items-center space-x-2 self-end sm:self-auto">
          {/* Quick Sutta Switcher */}
          <select
            value={selectedSutta.uid}
            onChange={(e) => {
              const found = CANONICAL_SUTTAS.find((s) => s.uid === e.target.value);
              if (found) handleSelectSutta(found);
            }}
            className="bg-navy-950 border border-slate-700 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-gold-500 font-medium cursor-pointer max-w-[200px] truncate"
          >
            {CANONICAL_SUTTAS.map((s) => (
              <option key={s.uid} value={s.uid}>
                {s.titlePali}
              </option>
            ))}
          </select>

          {/* Multilingual Audio Player Button */}
          {(() => {
            const hasAudio = segments.some((s) => Boolean(s.audio?.audioUrl));
            return (
              <button
                onClick={handleToggleAudioPlayer}
                title={
                  hasAudio
                    ? 'Play authentic chanting audio'
                    : 'English translation audio [TTS]. Authentic chanting pending rights clearance.'
                }
                className={`flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-semibold transition ${
                  isAudioPlayerVisible
                    ? 'bg-gold-500 text-navy-950 font-bold border-gold-400'
                    : 'bg-navy-950 border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400'
                }`}
                data-testid="multilingual-audio-btn"
              >
                {isAudioPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span className="hidden sm:inline">
                  {hasAudio ? 'Play Chanting' : 'Play Audio [TTS]'}
                </span>
              </button>
            );
          })()}

          {/* Audio Recitation Status */}
          <button
            onClick={() => setIsAudioNoticeOpen(true)}
            title="Pali Chanting Audio Status"
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
            data-testid="buddhism-coverage-btn"
          >
            <BookOpen className="w-3.5 h-3.5 text-gold-400" />
            <span className="hidden sm:inline">Coverage</span>
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            title="Search Buddhist Suttas"
            className="p-2 rounded-xl bg-navy-950 border border-slate-700 hover:border-gold-500 text-slate-300 hover:text-gold-400 text-xs transition"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsBookmarksOpen(true)}
            title="Saved Sutta Bookmarks"
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

      {/* Buddhist Collections Quick Switcher Bar */}
      <div className="p-3.5 rounded-2xl bg-navy-950/70 border border-slate-800 space-y-2.5">
        <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Buddhist Canonical & Liturgical Collections:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
          {CANONICAL_SUTTAS.map((s) => {
            const isSelected = selectedSutta.uid === s.uid;
            return (
              <button
                key={s.uid}
                data-testid={`sutta-btn-${s.uid}`}
                onClick={() => handleSelectSutta(s)}
                className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                  isSelected
                    ? 'bg-yellow-500/15 border-yellow-500/80 ring-1 ring-yellow-500/40 text-yellow-300'
                    : 'bg-navy-900/50 border-slate-800/80 hover:bg-navy-800/60 hover:border-slate-700 text-slate-300'
                }`}
              >
                <div className="font-semibold truncate">{s.titleEn}</div>
                <div className="text-[10px] text-slate-500 truncate mt-0.5">
                  {s.tradition.split('(')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sutta Overview Header Banner */}
      <div className="p-5 rounded-2xl bg-navy-950/80 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-xs flex-wrap gap-2">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-yellow-400 uppercase tracking-wide px-2 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/20 text-[11px]">
              {selectedSutta.category}
            </span>
            <span className="text-slate-400 text-xs">
              {selectedSutta.tradition} • {selectedSutta.originalLanguage}
            </span>
          </div>
          <span className="text-emerald-400 font-medium text-[11px]">
            {selectedSutta.licensingStatus} (Zero AI Content)
          </span>
        </div>

        <div className="flex items-baseline justify-between flex-wrap gap-2">
          <h2 className="text-base sm:text-lg font-serif font-bold text-slate-100">
            {selectedSutta.titleEn}
          </h2>
          <span className="text-sm font-serif text-amber-300 font-bold">
            {selectedSutta.titlePali}
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {selectedSutta.summary}
        </p>

        {/* Tradition Distinction Box (Theravada, Mahayana, Vajrayana) */}
        {selectedSutta.traditionNote && (
          <div className="p-3 bg-amber-950/30 border border-amber-500/40 rounded-xl text-xs text-amber-200 leading-relaxed">
            <span className="font-bold text-amber-400">Tradition Context:</span>{' '}
            {selectedSutta.traditionNote}
          </div>
        )}

        <div className="pt-2 border-t border-slate-800/70 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
          <span>
            <strong>Author/Compiler:</strong> {selectedSutta.authorOrCompiler}
          </span>
          {selectedSutta.translatorOrCommentator && (
            <span>
              <strong>Translation/Edition:</strong> {selectedSutta.translatorOrCommentator}
            </span>
          )}
        </div>
      </div>

      {/* Main Sutta Segments Reading Area with Contextual Sacred Audio Player */}
      {(() => {
        const readingContext: ReadingContext = {
          religionId: 'buddhism',
          categoryId: selectedSutta.nikaya ? `${selectedSutta.nikaya} Nikaya` : 'Tipitaka',
          collectionId: selectedSutta.id || selectedSutta.uid,
          bookName: selectedSutta.titleEn || selectedSutta.title,
          title: `${selectedSutta.titleEn || selectedSutta.title} ${selectedSutta.titlePali || selectedSutta.nativeTitle || ''}`.trim(),
        };

        return (
          <TwoColumnReadingLayout context={readingContext}>
            <main className="space-y-4 min-h-[450px]">
        {loading ? (
          <div className="py-24 text-center text-slate-400 text-xs space-y-2">
            <div className="w-6 h-6 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Loading {selectedSutta.titlePali} from SuttaCentral...</p>
          </div>
        ) : segments.length === 0 ? (
          <div className="py-24 text-center text-slate-500 text-xs space-y-2">
            <Info className="w-8 h-8 mx-auto text-slate-600" />
            <p>Sutta segments currently unavailable from API. Please retry.</p>
          </div>
        ) : (
          segments.map((seg) => {
            const unitId = `bud_${selectedSutta.uid}_${seg.segmentId}`;
            const isPlayingThisSegment = activeAudioUnitId === unitId && isAudioPlaying;
            const isBookmarked = bookmarks.some(
              (b) => b.id === `bud:tipitaka:${selectedSutta.uid}:${seg.segmentId}`
            );

            return (
              <div
                key={seg.segmentId}
                id={`segment-${seg.segmentId}`}
                data-seg-id={seg.segmentId}
                className={`p-5 rounded-2xl border transition space-y-2 group ${
                  isPlayingThisSegment
                    ? 'bg-gold-500/15 border-gold-500/60 shadow-lg ring-1 ring-gold-500/50'
                    : 'bg-navy-950/70 hover:bg-navy-900/80 border-slate-800/80 hover:border-slate-700'
                }`}
              >
                {/* Segment Header */}
                <div className="flex items-center justify-between text-xs border-b border-slate-800/60 pb-2">
                  <div className="flex items-center space-x-2">
                    {seg.audio?.audioUrl ? (
                      <button
                        data-testid={`play-segment-${seg.segmentId}-btn`}
                        onClick={() => handlePlaySegment(seg.segmentId)}
                        className={`p-1.5 rounded-lg transition flex items-center space-x-1.5 ${
                          isPlayingThisSegment
                            ? 'bg-gold-500 text-navy-950 font-bold shadow'
                            : 'text-gold-400 bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30'
                        }`}
                        title={`Play authentic chanting (${seg.audio.performer})`}
                      >
                        {isPlayingThisSegment ? (
                          <Pause className="w-3.5 h-3.5" />
                        ) : (
                          <Play className="w-3.5 h-3.5" />
                        )}
                        <span className="text-[10px] font-semibold hidden sm:inline">
                          Authentic Human ({seg.audio.license})
                        </span>
                      </button>
                    ) : (
                      <button
                        disabled={true}
                        data-testid={`play-segment-${seg.segmentId}-btn`}
                        className="p-1 rounded text-slate-600 cursor-not-allowed opacity-40 transition"
                        title="Authentic chanting for this text is pending rights clearance. For English narration [TTS], activate the audio player bar."
                      >
                        <VolumeX className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <span className="font-mono text-gold-400 px-2 py-0.5 rounded bg-gold-500/10 border border-gold-500/20 text-[11px]">
                      {seg.segmentId}
                    </span>
                  </div>

                  <div className="flex items-center space-x-1 opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={() => handleCopySegment(seg)}
                      title="Copy segment"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                    >
                      {copiedSegment === seg.segmentId ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Share2 className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleToggleBookmark(seg)}
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

                {/* Root Pali Text with Accurate Diacritics */}
                {seg.paliText && (
                  <p
                    style={{ fontSize: `${preferences.fontSizeRem * 1.15}rem` }}
                    className="font-serif text-yellow-200 font-semibold leading-relaxed tracking-wide"
                  >
                    {seg.paliText}
                  </p>
                )}

                {/* Bhikkhu Sujato's English Translation */}
                {seg.englishText && (
                  <p
                    style={{ fontSize: `${preferences.fontSizeRem}rem` }}
                    className="text-xs sm:text-sm text-slate-200 leading-relaxed pt-1 border-t border-slate-800/40 font-serif"
                  >
                    {seg.englishText}
                  </p>
                )}

                {/* Scholarly Commentary Note if Present */}
                {seg.comment && (
                  <div className="p-2.5 rounded-xl bg-navy-900/60 border border-slate-800/60 text-[11px] text-slate-400 italic font-serif">
                    <span className="font-bold text-gold-400 not-italic">Note: </span>
                    <span dangerouslySetInnerHTML={{ __html: seg.comment }} />
                  </div>
                )}

                {/* Audio Provenance Attribution */}
                {seg.audio && (
                  <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-800/60 text-[11px] text-emerald-400">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>
                      <strong>Authentic Human Chanting:</strong> {seg.audio.performer} • {seg.audio.license} • {seg.audio.source}
                    </span>
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

      {/* Audio Status Note */}
      <div className="p-3.5 rounded-2xl bg-navy-950/60 border border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Volume2 className="w-4 h-4 text-yellow-400 flex-shrink-0" />
          <span>
            <strong>Chanted Audio Provenance:</strong> Authentic human recitations verified under CC0 and CC BY-SA 4.0 licenses (Ti-sarana Refuges, Sri Lankan Maha Piritha, Prajnaparamita Heart Sutra). Texts without verified open recordings remain in text-only mode with optional client [TTS] narration.
          </span>
        </div>
      </div>

      {/* Standardized Provenance & Attribution Footer */}
      <AttributionFooter
        provenance={{
          sourceName: 'SuttaCentral Bilara API (Early Buddhist Texts)',
          sourceUrl: 'https://suttacentral.net',
          licenseType: 'Creative Commons Zero (CC0)',
          attributionText:
            'Pali Canon (Tipiṭaka: Sutta Piṭaka). Root text based on Mahāsaṅgīti Tipiṭaka Buddhavasse 2500. English translations by Bhikkhu Sujato dedicated unconditionally to the Public Domain under Creative Commons Zero (CC0 1.0 Universal).',
          isAiGenerated: false,
          verifiedDate: '2026-11-17',
        }}
      />

      {/* Suttas Navigation Drawer */}
      <ScriptureNavigationDrawer
        isOpen={isNavOpen}
        onClose={() => setIsNavOpen(false)}
        title="Pali Canon Sutta Catalog"
        hierarchyLabels={['Nikaya', 'Sutta']}
        nodes={CANONICAL_SUTTAS.map((s) => ({
          id: s.uid,
          levelIndex: 1,
          levelName: s.nikaya,
          title: s.titlePali,
          nativeTitle: s.titleEn,
          hasChildren: false,
          targetAddress: {
            religionId: 'buddhism',
            collectionId: 'tipitaka',
            path: [
              { levelName: 'Nikaya', identifier: s.nikaya, label: `${s.nikaya} Nikaya` },
              { levelName: 'Sutta', identifier: s.uid, label: s.titlePali },
            ],
            unitIdentifier: '1.1',
          },
        }))}
        onSelectAddress={(addr) => {
          const sUid = String(addr.path[1]?.identifier || 'sn56.11');
          const found = CANONICAL_SUTTAS.find((s) => s.uid === sUid) || CANONICAL_SUTTAS[0];
          handleSelectSutta(found);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Search Modal */}
      <UniversalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        collectionTitle="Pali Sutta Pitaka"
        onSearch={(q) => buddhismProvider.search(q)}
        onSelectResult={(addr) => {
          const sUid = String(addr.path[1]?.identifier || 'sn56.11');
          const found = CANONICAL_SUTTAS.find((s) => s.uid === sUid) || CANONICAL_SUTTAS[0];
          handleSelectSutta(found);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Bookmarks Drawer */}
      <UniversalBookmarksDrawer
        isOpen={isBookmarksOpen}
        onClose={() => setIsBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelectBookmark={(addr) => {
          const sUid = String(addr.path[1]?.identifier || 'sn56.11');
          const found = CANONICAL_SUTTAS.find((s) => s.uid === sUid) || CANONICAL_SUTTAS[0];
          handleSelectSutta(found);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onRemoveBookmark={(id) => {
          platformStorageService.removeBookmark(id);
          setBookmarks(platformStorageService.getBookmarks('buddhism'));
        }}
        onClearBookmarks={(rel) => {
          platformStorageService.clearBookmarks(rel);
          setBookmarks(platformStorageService.getBookmarks('buddhism'));
        }}
      />

      {/* Audio Status & Licensing Notice Modal */}
      <AudioNoticeModal
        isOpen={isAudioNoticeOpen}
        onClose={() => setIsAudioNoticeOpen(false)}
        religionId="buddhism"
      />

      {/* Scripture Coverage & Availability Transparency Modal */}
      <ScriptureCoverageModal
        isOpen={isCoverageOpen}
        onClose={() => setIsCoverageOpen(false)}
        initialReligionId="buddhism"
      />

      {/* Multilingual Audio Player Bar */}
      {isAudioPlayerVisible && (
        <MultilingualAudioPlayerBar
          title={`${selectedSutta.titlePali}`}
          subtitle={`${selectedSutta.titleEn} (Bhikkhu Sujato)`}
          availableEditions={BUDDHISM_AUDIO_EDITIONS}
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
