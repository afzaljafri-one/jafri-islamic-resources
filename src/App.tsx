import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { QuranReader } from './components/QuranReader/QuranReader';
import { IslamicToolsContainer } from './components/IslamicTools/IslamicToolsContainer';
import { QuranLiveTestCard } from './components/QuranLiveTestCard';
import { PrayerQiblaEngineCard } from './components/PrayerQiblaEngineCard';
import { ZakatCalculatorPreview } from './components/ZakatCalculatorPreview';
import { CacheDiagnosticCard } from './components/CacheDiagnosticCard';
import { LicensingProvenanceCard } from './components/LicensingProvenanceCard';
import {
  BookOpen,
  Shield,
  Calculator,
  Database,
  Scale,
  FlaskConical,
  Sparkles,
  Compass,
  Globe,
  Languages,
} from 'lucide-react';

// Common Platform Imports (Phase 0)
import { ReligionId } from './platform/types/religion';
import { PlatformNavbar } from './platform/components/PlatformNavbar';
import { PlatformHomepage } from './platform/components/PlatformHomepage';
import { UniversalBookmarksDrawer } from './platform/components/UniversalBookmarksDrawer';
import { MyLibraryModal, LibraryTab } from './platform/components/MyLibraryModal';
import { UniversalScriptureSearchModal } from './platform/components/UniversalScriptureSearchModal';
import { MultilingualQuranAudioDrawer } from './platform/components/MultilingualQuranAudioDrawer';
import { SpanishNarrationPilotModal } from './platform/components/SpanishNarrationPilotModal';
import { MultilingualReadingStudio } from './platform/components/MultilingualReadingStudio';
import { ScriptureCoverageModal } from './platform/components/ScriptureCoverageModal';
import { platformStorageService } from './platform/services/storageService';
import { personalLibraryService } from './platform/services/personalLibraryService';
import { ALL_RELIGION_IDS } from './platform/config/religionsRegistry';

// Independent Religion Modules (Phase 0 Foundation)
import { HinduismModule } from './modules/hinduism';
import { ChristianityModule } from './modules/christianity';
import { JudaismModule } from './modules/judaism';
import { SikhismModule } from './modules/sikhism';
import { BuddhismModule } from './modules/buddhism';
import { JainismModule } from './modules/jainism';

// Jafri Sacred Audio Library (Gates 5.4B-D)
import { SacredAudioLibraryHub } from './platform/components/audio/SacredAudioLibraryHub';

export type AppReligionView = ReligionId | 'home' | 'sacred-audio';

export const App: React.FC = () => {
  // Top-Level Multi-Religion Navigation State
  const [currentReligion, setCurrentReligion] = useState<AppReligionView>(() => {
    if (typeof window !== 'undefined' && window.location?.search) {
      const params = new URLSearchParams(window.location.search);
      const relParam = params.get('religion');
      const viewParam = params.get('view');
      if (relParam === 'sacred-audio' || viewParam === 'sacred-audio') {
        return 'sacred-audio';
      }
      if (relParam === 'home') {
        return 'home';
      }
      if (relParam && ALL_RELIGION_IDS.includes(relParam as ReligionId)) {
        return relParam as ReligionId;
      }
      // If legacy Quran URL parameters are present, open Islam directly
      if (params.get('surah') || params.get('page') || params.get('view')) {
        return 'islam';
      }
    }
    return 'home';
  });

  // PWA Offline Connectivity State (Phase 6.4)
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && 'onLine' in navigator) {
      return navigator.onLine;
    }
    return true;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Islamic Module View State (100% Preserved)
  const [mainView, setMainView] = useState<'reader' | 'tools' | 'lab'>(() => {
    if (typeof window !== 'undefined' && window.location?.search) {
      const params = new URLSearchParams(window.location.search);
      const v = params.get('view');
      if (v === 'tools' || v === 'lab') {
        return v;
      }
    }
    return 'reader';
  });
  const [activeTab, setActiveTab] = useState<'all' | 'quran' | 'prayer' | 'zakat' | 'cache' | 'licensing'>('all');

  // Platform Universal Bookmarks Drawer State
  const [isPlatformBookmarksOpen, setIsPlatformBookmarksOpen] = useState(false);
  const [isQuranMultilingualAudioOpen, setIsQuranMultilingualAudioOpen] = useState(false);
  const [isSpanishPilotOpen, setIsSpanishPilotOpen] = useState(() => {
    if (typeof window !== 'undefined' && window.location?.search) {
      return Boolean(new URLSearchParams(window.location.search).get('pilot'));
    }
    return false;
  });
  const [isMultilingualStudioOpen, setIsMultilingualStudioOpen] = useState(() => {
    if (typeof window !== 'undefined' && window.location?.search) {
      return Boolean(new URLSearchParams(window.location.search).get('studio'));
    }
    return false;
  });
  const [bookmarks, setBookmarks] = useState(() => platformStorageService.getBookmarks());
  const [isCoverageModalOpen, setIsCoverageModalOpen] = useState(false);
  const [coverageModalReligion, setCoverageModalReligion] = useState<ReligionId>('islam');

  // Universal Scripture Search State (Phase 6.3)
  const [isUniversalSearchOpen, setIsUniversalSearchOpen] = useState(false);

  // My Sacred Library State (Phase 6.1)
  const [isMyLibraryOpen, setIsMyLibraryOpen] = useState(false);
  const [myLibraryInitialTab, setMyLibraryInitialTab] = useState<LibraryTab>('continue');
  const [myLibraryInitialReligion, setMyLibraryInitialReligion] = useState<ReligionId | 'all'>('all');

  // Sync bookmarks with personalLibraryService
  useEffect(() => {
    const unsub = personalLibraryService.subscribe(() => {
      setBookmarks(platformStorageService.getBookmarks());
    });
    return () => unsub();
  }, []);

  // Global Keyboard Shortcuts (Phase 6.3: '/' or '⌘K' to search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsUniversalSearchOpen((prev) => !prev);
      } else if (e.key === '/') {
        const target = e.target as HTMLElement | null;
        const isEditable = target && (
          ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName) ||
          target.isContentEditable ||
          target.getAttribute('contenteditable') === 'true'
        );
        if (!isEditable) {
          e.preventDefault();
          setIsUniversalSearchOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenMyLibrary = (tab: LibraryTab = 'continue', religion: ReligionId | 'all' = 'all') => {
    setMyLibraryInitialTab(tab);
    setMyLibraryInitialReligion(religion);
    setIsMyLibraryOpen(true);
  };

  const handleNavigateToReading = (
    religion: ReligionId,
    params: {
      collectionId?: string;
      readingId?: string;
      chapterNumber?: number | string;
      verseNumber?: number | string;
      translationId?: string;
    }
  ) => {
    setIsMyLibraryOpen(false);
    setIsPlatformBookmarksOpen(false);
    setIsUniversalSearchOpen(false);

    // Build URL query params
    if (typeof window !== 'undefined' && window.location) {
      const url = new URL(window.location.href);
      url.searchParams.set('religion', religion);

      // Clean existing reading coordinates
      ['surah', 'ayah', 'chapter', 'shloka', 'verse', 'ang', 'sutta', 'book', 'text', 'collection'].forEach(
        (key) => url.searchParams.delete(key)
      );

      if (religion === 'islam') {
        if (params.chapterNumber) url.searchParams.set('surah', String(params.chapterNumber));
        if (params.verseNumber) url.searchParams.set('ayah', String(params.verseNumber));
      } else if (religion === 'hinduism') {
        if (params.collectionId) url.searchParams.set('collection', params.collectionId);
        if (params.chapterNumber) url.searchParams.set('chapter', String(params.chapterNumber));
        if (params.verseNumber) url.searchParams.set('shloka', String(params.verseNumber));
      } else if (religion === 'christianity') {
        if (params.chapterNumber) url.searchParams.set('chapter', String(params.chapterNumber));
        if (params.readingId && !isNaN(Number(params.readingId))) {
          url.searchParams.set('book', String(params.readingId));
        }
        if (params.translationId) url.searchParams.set('translation', params.translationId);
        if (params.verseNumber) url.searchParams.set('verse', String(params.verseNumber));
      } else if (religion === 'judaism') {
        if (params.chapterNumber) url.searchParams.set('chapter', String(params.chapterNumber));
        if (params.collectionId) url.searchParams.set('collection', params.collectionId);
        if (params.verseNumber) url.searchParams.set('verse', String(params.verseNumber));
      } else if (religion === 'sikhism') {
        if (params.chapterNumber) url.searchParams.set('ang', String(params.chapterNumber));
      } else if (religion === 'buddhism') {
        if (params.readingId) url.searchParams.set('sutta', params.readingId);
      } else if (religion === 'jainism') {
        if (params.collectionId) url.searchParams.set('text', params.collectionId);
      }

      window.history.replaceState({}, '', url.toString());
    }

    setCurrentReligion(religion);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Dispatch custom event for live mounted modules
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('jafri-navigate-reading', {
          detail: { religion, ...params },
        })
      );
    }
  };

  const handleOpenPlatformBookmarks = () => {
    handleOpenMyLibrary('bookmarks');
  };

  const handleOpenCoverage = (religionId?: ReligionId) => {
    if (religionId && ALL_RELIGION_IDS.includes(religionId)) {
      setCoverageModalReligion(religionId);
    } else if (ALL_RELIGION_IDS.includes(currentReligion as ReligionId)) {
      setCoverageModalReligion(currentReligion as ReligionId);
    } else {
      setCoverageModalReligion('islam');
    }
    setIsCoverageModalOpen(true);
  };

  // Sync religion in URL without reloading
  useEffect(() => {
    if (typeof window !== 'undefined' && window.history) {
      const url = new URL(window.location.href);
      if (currentReligion === 'home') {
        url.searchParams.delete('religion');
        if (url.searchParams.get('view') === 'sacred-audio') {
          url.searchParams.delete('view');
        }
      } else if (currentReligion === 'sacred-audio') {
        url.searchParams.set('religion', 'sacred-audio');
      } else {
        url.searchParams.set('religion', currentReligion);
      }
      window.history.replaceState({}, '', url.toString());
    }
  }, [currentReligion]);

  // Handle Religion Change
  const handleSelectReligion = (rel: AppReligionView) => {
    setCurrentReligion(rel);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (typeof window !== 'undefined') {
    (window as any).__platformNavigate = handleSelectReligion;
  }

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 islamic-pattern-bg selection:bg-gold-500 selection:text-navy-950 flex flex-col">
      {/* PWA Offline Status Indicator (Phase 6.4) */}
      {!isOnline && (
        <aside
          data-testid="offline-status-indicator"
          className="bg-amber-950/95 text-amber-200 border-b border-amber-700/60 px-4 py-2 text-xs md:text-sm font-sans flex items-center justify-center gap-2 sticky top-0 z-50 backdrop-blur-sm shadow-md"
          role="status"
          aria-live="polite"
        >
          <span className="inline-block w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>Offline Mode — Cached application shell &amp; locally available scriptures active.</span>
        </aside>
      )}

      {/* =========================================================================
          VIEW 1: PLATFORM HOMEPAGE (Overview of all 7 Religions)
          ========================================================================= */}
      {currentReligion === 'home' && (
        <>
          <PlatformNavbar
            activeReligion="home"
            onSelectReligion={handleSelectReligion}
            onOpenSearch={() => setIsUniversalSearchOpen(true)}
            onOpenBookmarks={handleOpenPlatformBookmarks}
            onOpenMyLibrary={handleOpenMyLibrary}
            onOpenCoverage={handleOpenCoverage}
            onOpenSpanishPilot={() => setIsSpanishPilotOpen(true)}
            onOpenStudio={() => setIsMultilingualStudioOpen(true)}
            bookmarksCount={bookmarks.length}
          />
          <PlatformHomepage
            onSelectReligion={(rel) => handleSelectReligion(rel)}
            onOpenSearch={() => setIsUniversalSearchOpen(true)}
            onOpenSpanishPilot={() => setIsSpanishPilotOpen(true)}
            onOpenStudio={() => setIsMultilingualStudioOpen(true)}
            onOpenMyLibrary={() => handleOpenMyLibrary('continue')}
            onResumeReading={(pos) => handleNavigateToReading(pos.religion, pos)}
          />
        </>
      )}

      {/* =========================================================================
          VIEW 2: ISLAMIC RESOURCES MODULE (100% Preserved & Unmodified)
          ========================================================================= */}
      {currentReligion === 'islam' && (
        <>
          {/* Universal Platform Top Navbar */}
          <PlatformNavbar
            activeReligion="islam"
            onSelectReligion={handleSelectReligion}
            onOpenSearch={() => setIsUniversalSearchOpen(true)}
            onOpenBookmarks={handleOpenPlatformBookmarks}
            onOpenMyLibrary={handleOpenMyLibrary}
            onOpenCoverage={handleOpenCoverage}
            onOpenSpanishPilot={() => setIsSpanishPilotOpen(true)}
            onOpenStudio={() => setIsMultilingualStudioOpen(true)}
            bookmarksCount={bookmarks.length}
          />

          {/* Universal Platform Top Sub-Strip to allow quick Multilingual Quran Audio & Status */}
          <div className="bg-navy-950/80 border-b border-gold-500/20 px-3 sm:px-6 lg:px-8 py-1.5 text-xs flex items-center justify-between">
            <button
              onClick={() => handleSelectReligion('home')}
              className="inline-flex items-center space-x-1.5 text-gold-400 hover:text-gold-300 font-semibold transition"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>&larr; Platform Homepage (All 7 Traditions)</span>
            </button>

            <div className="flex items-center space-x-2 text-[11px] text-slate-400">
              <button
                onClick={() => setIsQuranMultilingualAudioOpen(true)}
                data-testid="open-multilingual-quran-audio"
                className="inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-gold-500/15 hover:bg-gold-500/25 border border-gold-500/30 text-gold-300 font-bold transition mr-1 sm:mr-2"
                title="Multilingual Quran Audio (Arabic, English, Urdu, Hindi)"
              >
                <Languages className="w-3.5 h-3.5 text-gold-400" />
                <span>Multilingual Quran Audio</span>
              </button>
              <span className="hidden sm:inline">Active Tradition:</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold">
                Islam (M4 Complete)
              </span>
            </div>
          </div>

          {/* Original Islamic Navbar */}
          <Navbar activeView={mainView} onViewChange={setMainView} />

          {/* Master Quran Reader View */}
          {mainView === 'reader' && (
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-6 space-y-6">
              {/* Breadcrumb banner with quick Navigation */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-3 sm:px-5 py-2.5 sm:py-3 rounded-2xl bg-gradient-to-r from-navy-900 via-navy-900/90 to-navy-950 border border-gold-500/20 text-xs overflow-hidden">
                <div className="flex items-center flex-wrap gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-gold-500"></span>
                    </span>
                    <span className="font-serif font-bold text-slate-200 tracking-wider">
                      DUAL-MUSHAF QURAN READER
                    </span>
                  </div>
                  <span className="text-slate-500 hidden sm:inline">•</span>
                  <span className="text-slate-400 hidden sm:inline">
                    114 Surahs • 30 Juz • Dual Urdu Scholars • EveryAyah Audio
                  </span>
                </div>

                <div className="flex items-center space-x-4 self-start sm:self-auto">
                  <button
                    onClick={() => setMainView('tools')}
                    className="inline-flex items-center space-x-1.5 text-amber-400 hover:text-amber-300 font-medium hover:underline"
                  >
                    <Compass className="w-3.5 h-3.5" />
                    <span>Islamic Tools &rarr;</span>
                  </button>
                  <button
                    onClick={() => setMainView('lab')}
                    className="inline-flex items-center space-x-1.5 text-gold-400 hover:text-gold-300 font-medium hover:underline"
                  >
                    <FlaskConical className="w-3.5 h-3.5" />
                    <span>Verification Lab &rarr;</span>
                  </button>
                </div>
              </div>

              {/* Master Quran Reader Component */}
              <QuranReader />
            </main>
          )}

          {/* Islamic Tools & Services View */}
          {mainView === 'tools' && (
            <div className="flex-1 w-full">
              <IslamicToolsContainer />
            </div>
          )}

          {/* Verification Lab View */}
          {mainView === 'lab' && (
            <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-8 space-y-8">
              {/* Hero Section */}
              <div className="relative rounded-3xl bg-gradient-to-b from-navy-900 to-navy-950 border border-gold-500/30 p-6 lg:p-10 shadow-2xl overflow-hidden text-center">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />

                <div className="arabic-quran-text text-2xl lg:text-4xl text-gold-400 mb-3 tracking-wide">
                  بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>

                <h1 className="font-serif text-2xl lg:text-4xl font-extrabold tracking-wide text-slate-100 uppercase">
                  Jafri Islamic Resources Lab
                </h1>
                <p className="mt-2 text-sm lg:text-base text-gold-400 font-serif font-medium tracking-wider">
                  Primary: UmmahAPI • Specialised: Al Quran Cloud • Engine: Adhan-JS
                </p>
                <p className="max-w-2xl mx-auto mt-2 text-xs lg:text-sm text-slate-400 leading-relaxed">
                  Multi-provider Islamic platform demonstrating primary integration with UmmahAPI, dedicated Allama Syed Zeeshan Haider Jawadi Urdu routing via Al Quran Cloud, Adhan-JS offline prayer calculations, live Nisab Zakat assessment, and multi-tier caching.
                </p>

                <div className="mt-5 flex flex-wrap justify-center gap-3">
                  <button
                    onClick={() => setMainView('reader')}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-gold-500 to-gold-400 text-navy-950 font-bold text-sm shadow-gold hover:from-gold-400 hover:to-gold-300 transition-all transform hover:-translate-y-0.5"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>Open Full Quran Reader</span>
                    <Sparkles className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setMainView('tools')}
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 text-white font-bold text-sm shadow hover:from-amber-500 hover:to-amber-400 transition-all transform hover:-translate-y-0.5"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Open Islamic Tools & Services (M4)</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 mt-6 pt-4 border-t border-navy-800">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeTab === 'all'
                        ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                        : 'bg-navy-900/90 text-slate-300 hover:bg-navy-800 border border-gold-500/20'
                    }`}
                  >
                    All Verification Modules
                  </button>
                  <button
                    onClick={() => setActiveTab('quran')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeTab === 'quran'
                        ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                        : 'bg-navy-900/90 text-slate-300 hover:bg-navy-800 border border-gold-500/20'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Quran API Live Test</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('prayer')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeTab === 'prayer'
                        ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                        : 'bg-navy-900/90 text-slate-300 hover:bg-navy-800 border border-gold-500/20'
                    }`}
                  >
                    <Shield className="w-3.5 h-3.5" />
                    <span>Proxy & Offline Prayers</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('zakat')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeTab === 'zakat'
                        ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                        : 'bg-navy-900/90 text-slate-300 hover:bg-navy-800 border border-gold-500/20'
                    }`}
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Zakat Calculator</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('cache')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeTab === 'cache'
                        ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                        : 'bg-navy-900/90 text-slate-300 hover:bg-navy-800 border border-gold-500/20'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>Cache Diagnostics</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('licensing')}
                    className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      activeTab === 'licensing'
                        ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                        : 'bg-navy-900/90 text-slate-300 hover:bg-navy-800 border border-gold-500/20'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Licensing & Provenance</span>
                  </button>
                </div>
              </div>

              {/* Verification Modules */}
              <div className="space-y-8">
                {(activeTab === 'all' || activeTab === 'quran') && <QuranLiveTestCard />}
                {(activeTab === 'all' || activeTab === 'prayer') && <PrayerQiblaEngineCard />}
                {(activeTab === 'all' || activeTab === 'zakat') && <ZakatCalculatorPreview />}
                {(activeTab === 'all' || activeTab === 'cache') && <CacheDiagnosticCard />}
                {(activeTab === 'all' || activeTab === 'licensing') && <LicensingProvenanceCard />}
              </div>
            </main>
          )}

          {/* Islamic Module Footer */}
          <footer className="mt-auto border-t border-navy-800 bg-navy-900/90 px-4 lg:px-8 py-8 text-xs text-slate-400">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left">
              <div className="space-y-1">
                <div className="font-serif font-bold text-slate-200 tracking-wider">
                  JAFRI ISLAMIC RESOURCES LAB
                </div>
                <p className="text-[11px] text-slate-500">
                  Developed as a standalone prototype for eventual handover to the development team.
                </p>
              </div>
              <div className="text-[11px] text-slate-400 space-y-1 md:text-right">
                <div>
                  Primary Quran & Islamic Services powered by{' '}
                  <a
                    href="https://ummahapi.com"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold-400 hover:underline"
                  >
                    UmmahAPI
                  </a>
                  {' '}• Urdu Jawadi via{' '}
                  <a
                    href="https://alquran.cloud"
                    target="_blank"
                    rel="noreferrer"
                    className="text-gold-400 hover:underline"
                  >
                    Al Quran Cloud
                  </a>
                </div>
                <div>
                  Offline Prayer Engine by Adhan-JS • Typography by Dr. Khaled Hosny (SIL OFL)
                </div>
              </div>
            </div>
          </footer>

          {/* Multilingual Quran Audio Modal / Drawer */}
          <MultilingualQuranAudioDrawer
            isOpen={isQuranMultilingualAudioOpen}
            onClose={() => setIsQuranMultilingualAudioOpen(false)}
          />
        </>
      )}

      {/* =========================================================================
          VIEW 3: HINDUISM MODULE (Bhagavad Gita, Upanishads, Vedas, Stotras)
          ========================================================================= */}
      {currentReligion === 'hinduism' && (
        <>
          <PlatformNavbar
            activeReligion="hinduism"
            onSelectReligion={handleSelectReligion}
            onOpenSearch={() => setIsUniversalSearchOpen(true)}
            onOpenBookmarks={handleOpenPlatformBookmarks}
            onOpenMyLibrary={handleOpenMyLibrary}
            onOpenCoverage={handleOpenCoverage}
            onOpenSpanishPilot={() => setIsSpanishPilotOpen(true)}
            onOpenStudio={() => setIsMultilingualStudioOpen(true)}
            bookmarksCount={bookmarks.length}
          />
          <HinduismModule onReturnToHome={() => handleSelectReligion('home')} />
        </>
      )}

      {/* =========================================================================
          VIEW 4: CHRISTIANITY MODULE (Holy Bible: KJV, WEB, ASV, YLT)
          ========================================================================= */}
      {currentReligion === 'christianity' && (
        <>
          <PlatformNavbar
            activeReligion="christianity"
            onSelectReligion={handleSelectReligion}
            onOpenSearch={() => setIsUniversalSearchOpen(true)}
            onOpenBookmarks={handleOpenPlatformBookmarks}
            onOpenMyLibrary={handleOpenMyLibrary}
            onOpenCoverage={handleOpenCoverage}
            onOpenSpanishPilot={() => setIsSpanishPilotOpen(true)}
            onOpenStudio={() => setIsMultilingualStudioOpen(true)}
            bookmarksCount={bookmarks.length}
          />
          <ChristianityModule onReturnToHome={() => handleSelectReligion('home')} />
        </>
      )}

      {/* =========================================================================
          VIEW 5: JUDAISM MODULE (The Tanakh: Torah, Nevi'im, Ketuvim)
          ========================================================================= */}
      {currentReligion === 'judaism' && (
        <>
          <PlatformNavbar
            activeReligion="judaism"
            onSelectReligion={handleSelectReligion}
            onOpenSearch={() => setIsUniversalSearchOpen(true)}
            onOpenBookmarks={handleOpenPlatformBookmarks}
            onOpenMyLibrary={handleOpenMyLibrary}
            onOpenCoverage={handleOpenCoverage}
            onOpenSpanishPilot={() => setIsSpanishPilotOpen(true)}
            onOpenStudio={() => setIsMultilingualStudioOpen(true)}
            bookmarksCount={bookmarks.length}
          />
          <JudaismModule onReturnToHome={() => handleSelectReligion('home')} />
        </>
      )}

      {/* =========================================================================
          VIEW 6: SIKHISM MODULE (Sri Guru Granth Sahib Ji — 1,430 Angs)
          ========================================================================= */}
      {currentReligion === 'sikhism' && (
        <>
          <PlatformNavbar
            activeReligion="sikhism"
            onSelectReligion={handleSelectReligion}
            onOpenSearch={() => setIsUniversalSearchOpen(true)}
            onOpenBookmarks={handleOpenPlatformBookmarks}
            onOpenMyLibrary={handleOpenMyLibrary}
            onOpenCoverage={handleOpenCoverage}
            onOpenSpanishPilot={() => setIsSpanishPilotOpen(true)}
            onOpenStudio={() => setIsMultilingualStudioOpen(true)}
            bookmarksCount={bookmarks.length}
          />
          <SikhismModule onReturnToHome={() => handleSelectReligion('home')} />
        </>
      )}

      {/* =========================================================================
          VIEW 7: BUDDHISM MODULE (Early Buddhist Texts — Pali Canon Tipitaka)
          ========================================================================= */}
      {currentReligion === 'buddhism' && (
        <>
          <PlatformNavbar
            activeReligion="buddhism"
            onSelectReligion={handleSelectReligion}
            onOpenSearch={() => setIsUniversalSearchOpen(true)}
            onOpenBookmarks={handleOpenPlatformBookmarks}
            onOpenMyLibrary={handleOpenMyLibrary}
            onOpenCoverage={handleOpenCoverage}
            onOpenSpanishPilot={() => setIsSpanishPilotOpen(true)}
            onOpenStudio={() => setIsMultilingualStudioOpen(true)}
            bookmarksCount={bookmarks.length}
          />
          <BuddhismModule onReturnToHome={() => handleSelectReligion('home')} />
        </>
      )}

      {/* =========================================================================
          VIEW 8: JAINISM MODULE (Classical Jain Agamas & Tattvartha Sutra)
          ========================================================================= */}
      {currentReligion === 'jainism' && (
        <>
          <PlatformNavbar
            activeReligion="jainism"
            onSelectReligion={handleSelectReligion}
            onOpenSearch={() => setIsUniversalSearchOpen(true)}
            onOpenBookmarks={handleOpenPlatformBookmarks}
            onOpenMyLibrary={handleOpenMyLibrary}
            onOpenCoverage={handleOpenCoverage}
            onOpenSpanishPilot={() => setIsSpanishPilotOpen(true)}
            onOpenStudio={() => setIsMultilingualStudioOpen(true)}
            bookmarksCount={bookmarks.length}
          />
          <JainismModule onReturnToHome={() => handleSelectReligion('home')} />
        </>
      )}

      {/* =========================================================================
          VIEW 9: JAFRI SACRED AUDIO LIBRARY (Gates 5.4B + 5.4C + 5.4D)
          ========================================================================= */}
      {currentReligion === 'sacred-audio' && (
        <>
          <PlatformNavbar
            activeReligion="sacred-audio"
            onSelectReligion={handleSelectReligion}
            onOpenSearch={() => setIsUniversalSearchOpen(true)}
            onOpenBookmarks={handleOpenPlatformBookmarks}
            onOpenMyLibrary={handleOpenMyLibrary}
            onOpenCoverage={handleOpenCoverage}
            onOpenSpanishPilot={() => setIsSpanishPilotOpen(true)}
            onOpenStudio={() => setIsMultilingualStudioOpen(true)}
            bookmarksCount={bookmarks.length}
          />
          <SacredAudioLibraryHub onReturnToHome={() => handleSelectReligion('home')} />
        </>
      )}

      {/* =========================================================================
          UNIVERSAL MULTI-RELIGION SCRIPTURE SEARCH MODAL (Phase 6.3)
          ========================================================================= */}
      <UniversalScriptureSearchModal
        isOpen={isUniversalSearchOpen}
        onClose={() => setIsUniversalSearchOpen(false)}
        onNavigateToReading={handleNavigateToReading}
      />

      {/* =========================================================================
          MY SACRED LIBRARY MODAL (Phase 6.1)
          ========================================================================= */}
      <MyLibraryModal
        isOpen={isMyLibraryOpen}
        onClose={() => setIsMyLibraryOpen(false)}
        initialTab={myLibraryInitialTab}
        initialReligion={myLibraryInitialReligion}
        onNavigateToReading={handleNavigateToReading}
      />

      {/* =========================================================================
          UNIVERSAL PLATFORM BOOKMARKS DRAWER
          ========================================================================= */}
      <UniversalBookmarksDrawer
        isOpen={isPlatformBookmarksOpen}
        onClose={() => setIsPlatformBookmarksOpen(false)}
        bookmarks={bookmarks}
        onSelectBookmark={(address) => {
          const ch = address.path?.find((p) =>
            ['Chapter', 'Book', 'Ang', 'Sutta', 'Section'].includes(p.levelName)
          );
          handleNavigateToReading(address.religionId, {
            collectionId: address.collectionId,
            chapterNumber: ch?.identifier,
            verseNumber: address.unitIdentifier,
          });
        }}
        onRemoveBookmark={(id) => {
          platformStorageService.removeBookmark(id);
          setBookmarks(platformStorageService.getBookmarks());
        }}
        onClearBookmarks={(rel) => {
          platformStorageService.clearBookmarks(rel);
          setBookmarks(platformStorageService.getBookmarks());
        }}
      />
      {/* =========================================================================
          CONTROLLED RESEARCH PILOT: SPANISH NEURAL NARRATION (Command 19)
          ========================================================================= */}
      <SpanishNarrationPilotModal
        isOpen={isSpanishPilotOpen}
        onClose={() => setIsSpanishPilotOpen(false)}
      />

      {/* =========================================================================
          UNIVERSAL 30-LANGUAGE READING & AUDIO STUDIO (Command 20)
          ========================================================================= */}
      <MultilingualReadingStudio
        isOpen={isMultilingualStudioOpen}
        onClose={() => setIsMultilingualStudioOpen(false)}
      />

      {/* =========================================================================
          SCRIPTURE COVERAGE & AVAILABILITY TRANSPARENCY MODAL
          ========================================================================= */}
      <ScriptureCoverageModal
        isOpen={isCoverageModalOpen}
        onClose={() => setIsCoverageModalOpen(false)}
        initialReligionId={coverageModalReligion}
      />
    </div>
  );
};
