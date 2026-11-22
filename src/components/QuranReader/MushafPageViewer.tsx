import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  RefreshCw,
  AlertCircle,
  BookOpen,
  Layers,
  Info,
} from 'lucide-react';
import { MushafIndexEntry, MushafEditionType } from '../../types/quran';
import { quranAudioService } from '../../services/audio';

interface MushafPageViewerProps {
  currentSurahNumber: number;
  onSelectSurah: (surahNumber: number) => void;
  initialEdition?: MushafEditionType;
  initialPage?: number;
}

export const MushafPageViewer: React.FC<MushafPageViewerProps> = ({
  currentSurahNumber,
  onSelectSurah,
  initialEdition = '15-line',
  initialPage,
}) => {
  // Edition state
  const [edition, setEdition] = useState<MushafEditionType>(() => {
    // Read from URL query param if present
    const params = new URLSearchParams(window.location.search);
    const urlEdition = params.get('edition');
    if (urlEdition === '13-line' || urlEdition === '15-line') return urlEdition;
    return initialEdition;
  });

  // Current physical PDF page
  const [currentPage, setCurrentPage] = useState<number>(() => {
    const params = new URLSearchParams(window.location.search);
    const urlPage = parseInt(params.get('page') || '', 10);
    if (!isNaN(urlPage) && urlPage > 0) return urlPage;
    return initialPage || (edition === '15-line' ? 2 : 3);
  });

  const initialUrlParamsRef = useRef<URLSearchParams>(
    new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
  );
  const isEditionSwitchingRef = useRef<boolean>(false);
  const isNavigatingFromSelf = useRef<boolean>(false);
  const currentSurahRef = useRef<number>(currentSurahNumber);
  useEffect(() => {
    currentSurahRef.current = currentSurahNumber;
  }, [currentSurahNumber]);

  // Index datasets
  const [indexData, setIndexData] = useState<MushafIndexEntry[]>([]);
  const [loadingIndex, setLoadingIndex] = useState<boolean>(true);
  const [indexError, setIndexError] = useState<string | null>(null);

  // Image loading state
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [imageError, setImageError] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<'fit' | '100' | '125'>('fit');

  // Input page jump
  const [pageInput, setPageInput] = useState<string>(currentPage.toString());

  // Edition Limits
  const totalPages = edition === '13-line' ? 849 : 612;
  const firstQuranPage = edition === '13-line' ? 3 : 2;

  // --------------------------------------------------------------------------
  // 1. Load Edition-Specific Surah Index
  // --------------------------------------------------------------------------
  useEffect(() => {
    setLoadingIndex(true);
    setIndexError(null);

    const rawBase = (typeof import.meta !== 'undefined' && (import.meta as any).env?.BASE_URL) || '/';
    const baseUrl = rawBase === '/' ? '' : rawBase.replace(/\/$/, '');
    const indexUrl = `${baseUrl}/data/${edition}/surah-index.json`;
    fetch(indexUrl)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status} loading ${edition} index`);
        return res.json();
      })
      .then((data: MushafIndexEntry[]) => {
        setIndexData(data);
        setLoadingIndex(false);

        if (isEditionSwitchingRef.current) {
          isEditionSwitchingRef.current = false;
          // When switching editions, jump cleanly to active Surah's start_pdf_page in the new edition
          const targetSurah = currentSurahRef.current;
          const entry = data.find((s) => s.surah_number === targetSurah);
          if (entry) {
            setCurrentPage(entry.start_pdf_page);
          }
          return;
        }

        // Direct Surah URL navigation (?surah=X without explicit ?page=Y):
        // If a specific Surah was requested but no explicit physical page parameter was provided on mount,
        // jump directly to that Surah's start_pdf_page in the loaded edition
        const urlPage = parseInt(initialUrlParamsRef.current.get('page') || '', 10);
        const hasExplicitPage = (!isNaN(urlPage) && urlPage > 0) || Boolean(initialPage);

        if (!hasExplicitPage && currentSurahNumber > 1) {
          const entry = data.find((s) => s.surah_number === currentSurahNumber);
          if (entry) {
            setCurrentPage(entry.start_pdf_page);
            return;
          }
        }

        // On mount or direct URL navigation:
        // Sync active Surah to currentPage if inside a Surah, preserving currentSurah if already present on this page
        const surahsOnPage = data.filter((s) => currentPage >= s.start_pdf_page && currentPage <= s.end_pdf_page);
        if (surahsOnPage.length > 0) {
          const isCurrentAlreadyOnPage = surahsOnPage.some((s) => s.surah_number === currentSurahNumber);
          if (!isCurrentAlreadyOnPage) {
            isNavigatingFromSelf.current = true;
            onSelectSurah(surahsOnPage[0].surah_number);
          }
        }
      })
      .catch((err) => {
        setIndexError(`Failed to load ${edition} Surah index: ${err.message}`);
        setLoadingIndex(false);
      });
  }, [edition]);

  // --------------------------------------------------------------------------
  // 2. Synchronize when currentSurahNumber changes from external selector
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (indexData.length === 0) return;
    if (isNavigatingFromSelf.current) {
      isNavigatingFromSelf.current = false;
      return;
    }
    const entry = indexData.find((s) => s.surah_number === currentSurahNumber);
    if (entry) {
      // If current page is not within this Surah's range, jump to its starting physical page
      setCurrentPage((prevPage) => {
        if (prevPage >= entry.start_pdf_page && prevPage <= entry.end_pdf_page) {
          return prevPage;
        }
        return entry.start_pdf_page;
      });
    }
  }, [currentSurahNumber]);

  // --------------------------------------------------------------------------
  // 3. Keep page input and URL in sync with currentPage
  // --------------------------------------------------------------------------
  useEffect(() => {
    if (loadingIndex) return;
    setPageInput(currentPage.toString());
    setImageLoading(true);
    setImageError(false);

    // Update URL query parameters for direct link & browser refresh persistence
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('edition', edition);
      url.searchParams.set('page', currentPage.toString());
      url.searchParams.set('surah', currentSurahNumber.toString());
      window.history.replaceState({}, '', url.toString());
    } catch {
      // Ignore in non-standard environments
    }
  }, [currentPage, edition, currentSurahNumber, loadingIndex]);

  // --------------------------------------------------------------------------
  // Synchronize Physical Page Boundaries with QuranAudioService
  // --------------------------------------------------------------------------
  useEffect(() => {
    quranAudioService.setPageContext(edition, currentPage, currentSurahNumber);
  }, [edition, currentPage, currentSurahNumber]);

  // --------------------------------------------------------------------------
  // 4. Determine Surahs present on currentPage & sync active Surah
  // --------------------------------------------------------------------------
  const surahsOnCurrentPage = indexData.filter(
    (s) => currentPage >= s.start_pdf_page && currentPage <= s.end_pdf_page
  );

  useEffect(() => {
    if (surahsOnCurrentPage.length > 0) {
      // If the currentSurahNumber is not among the Surahs on this page, sync to the primary Surah
      const isCurrentOnPage = surahsOnCurrentPage.some((s) => s.surah_number === currentSurahNumber);
      if (!isCurrentOnPage) {
        isNavigatingFromSelf.current = true;
        onSelectSurah(surahsOnCurrentPage[0].surah_number);
      }
    }
  }, [currentPage, surahsOnCurrentPage]);

  // --------------------------------------------------------------------------
  // 5. Calculate Edition-Specific Printed Page Metadata
  // --------------------------------------------------------------------------
  const getPrintedPageInfo = () => {
    if (edition === '13-line') {
      if (currentPage === 1) return { label: 'Front Cover (Unnumbered)', value: null };
      if (currentPage === 2) return { label: 'Title Page (Unnumbered)', value: null };
      return { label: `Printed Page: ${currentPage - 1}`, value: currentPage - 1 };
    } else {
      // 15-line edition
      if (currentPage === 1) return { label: 'Introductory Cover (Unnumbered)', value: null };
      if (currentPage === 612) return { label: 'Dua Khatm al-Quran Plate (Page 612)', value: 612 };
      return { label: `Printed Page: ${currentPage}`, value: currentPage };
    }
  };

  const printedInfo = getPrintedPageInfo();

  // --------------------------------------------------------------------------
  // 6. Navigation Handlers
  // --------------------------------------------------------------------------
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleFirstPage = () => {
    setCurrentPage(firstQuranPage);
  };

  const handleLastPage = () => {
    setCurrentPage(totalPages);
  };

  const handlePageJump = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseInt(pageInput, 10);
    if (!isNaN(target) && target >= 1 && target <= totalPages) {
      setCurrentPage(target);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  // --------------------------------------------------------------------------
  // 7. Edition Switching Handler (Guaranteed Zero Stale Page Numbers)
  // --------------------------------------------------------------------------
  const handleSwitchEdition = (newEdition: MushafEditionType) => {
    if (newEdition === edition) return;
    isEditionSwitchingRef.current = true;
    setEdition(newEdition);
  };

  // Physical image path
  const imagePad = currentPage.toString().padStart(4, '0');
  const rawBase = (typeof import.meta !== 'undefined' && (import.meta as any).env?.BASE_URL) || '/';
  const baseUrl = rawBase === '/' ? '' : rawBase.replace(/\/$/, '');
  const imageUrl = `${baseUrl}/mushaf/${edition}/${imagePad}.webp`;

  // Closing / Front Matter Special Flags
  const is13LineClosing = edition === '13-line' && currentPage === 849;
  const is15LineClosing = edition === '15-line' && currentPage === 612;
  const isFrontMatter =
    (edition === '13-line' && currentPage <= 2) || (edition === '15-line' && currentPage === 1);

  return (
    <div className="space-y-4 max-w-5xl mx-auto" data-testid="mushaf-page-viewer">
      {/* Top Controls Toolbar */}
      <div className="p-2.5 sm:p-3.5 rounded-2xl bg-navy-900 border border-gold-500/30 shadow-xl flex flex-wrap items-center justify-between gap-2 sm:gap-3 text-xs">
        {/* Left: Edition Switcher */}
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <span className="text-slate-400 font-medium hidden sm:inline flex items-center gap-1">
            <Layers className="w-3.5 h-3.5 text-gold-400" />
            Edition:
          </span>
          <div className="inline-flex rounded-lg border border-gold-500/30 p-0.5 bg-navy-950">
            <button
              onClick={() => handleSwitchEdition('15-line')}
              className={`px-2 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-all ${
                edition === '15-line'
                  ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                  : 'text-slate-300 hover:text-slate-100'
              }`}
            >
              15-Line <span className="hidden xs:inline">Indo-Pak </span>(612p)
            </button>
            <button
              onClick={() => handleSwitchEdition('13-line')}
              className={`px-2 sm:px-3 py-1 rounded-md text-[11px] sm:text-xs font-medium transition-all ${
                edition === '13-line'
                  ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                  : 'text-slate-300 hover:text-slate-100'
              }`}
            >
              13-Line <span className="hidden xs:inline">Indo-Pak </span>(849p)
            </button>
          </div>
        </div>

        {/* Center: Stepper & Page Jump */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleFirstPage}
            disabled={currentPage <= 1}
            title="First Quran Page"
            className="p-1.5 rounded-lg bg-navy-950 border border-gold-500/20 text-slate-300 hover:text-gold-400 disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
          >
            <ChevronsLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            title="Previous Page"
            className="p-1.5 rounded-lg bg-navy-950 border border-gold-500/20 text-slate-300 hover:text-gold-400 disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page input jumper */}
          <form onSubmit={handlePageJump} className="flex items-center space-x-1">
            <input
              type="text"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              className="w-12 text-center bg-navy-950 border border-gold-500/30 rounded-lg py-1 text-slate-100 font-mono text-xs focus:outline-none focus:border-gold-400 font-bold"
            />
            <span className="text-slate-400 font-mono">/ {totalPages}</span>
          </form>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            title="Next Page"
            className="p-1.5 rounded-lg bg-navy-950 border border-gold-500/20 text-slate-300 hover:text-gold-400 disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={handleLastPage}
            disabled={currentPage >= totalPages}
            title="Last Page (Closing Supplication)"
            className="p-1.5 rounded-lg bg-navy-950 border border-gold-500/20 text-slate-300 hover:text-gold-400 disabled:opacity-30 disabled:hover:text-slate-300 transition-colors"
          >
            <ChevronsRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Zoom & View Controls */}
        <div className="flex items-center space-x-2">
          <div className="inline-flex rounded-lg border border-gold-500/20 p-0.5 bg-navy-950">
            <button
              onClick={() => setZoomLevel('fit')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                zoomLevel === 'fit' ? 'bg-gold-500 text-navy-950 font-bold' : 'text-slate-400'
              }`}
            >
              Fit
            </button>
            <button
              onClick={() => setZoomLevel('100')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                zoomLevel === '100' ? 'bg-gold-500 text-navy-950 font-bold' : 'text-slate-400'
              }`}
            >
              100%
            </button>
            <button
              onClick={() => setZoomLevel('125')}
              className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                zoomLevel === '125' ? 'bg-gold-500 text-navy-950 font-bold' : 'text-slate-400'
              }`}
            >
              125%
            </button>
          </div>
        </div>
      </div>

      {/* Loading & Error Banners */}
      {loadingIndex && (
        <div className="p-2.5 rounded-xl bg-navy-900/80 border border-gold-500/20 text-slate-300 text-xs flex items-center space-x-2">
          <RefreshCw className="w-3.5 h-3.5 animate-spin text-gold-400" />
          <span>Loading {edition} verified index dataset...</span>
        </div>
      )}

      {indexError && (
        <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-200 text-xs flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{indexError}</span>
        </div>
      )}

      {/* Metadata & Page Context Banner */}
      <div className="p-3 rounded-xl bg-navy-900/90 border border-gold-500/20 flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Physical PDF Page Badge */}
          <span className="px-2 py-0.5 rounded-md bg-navy-950 border border-gold-500/30 text-gold-400 font-mono font-bold">
            Physical PDF Page: {currentPage}
          </span>

          {/* Printed Page Badge */}
          <span className="px-2 py-0.5 rounded-md bg-navy-950 border border-slate-700 text-slate-200 font-medium">
            {printedInfo.label}
          </span>

          {/* Surahs present on page */}
          {surahsOnCurrentPage.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {surahsOnCurrentPage.map((s) => (
                <button
                  key={s.surah_number}
                  onClick={() => onSelectSurah(s.surah_number)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-medium transition-all ${
                    s.surah_number === currentSurahNumber
                      ? 'bg-gold-500/20 border border-gold-500/50 text-gold-300 font-bold'
                      : 'bg-navy-950 border border-slate-700 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Surah {s.surah_number} ({s.name_english})
                  {s.shared_start && s.start_pdf_page === currentPage ? ' [Begins]' : ''}
                  {s.shared_end && s.end_pdf_page === currentPage ? ' [Ends]' : ''}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Multi-Surah / Shared Leaf Indicator */}
        {surahsOnCurrentPage.length > 1 && (
          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] font-medium flex items-center gap-1">
            <Info className="w-3 h-3 text-amber-400" />
            Shared Leaf ({surahsOnCurrentPage.length} Surahs on this page)
          </span>
        )}
      </div>

      {/* Special Context Notices */}
      {isFrontMatter && (
        <div className="p-3 rounded-xl bg-blue-950/50 border border-blue-500/30 text-blue-200 text-xs flex items-center space-x-2">
          <Info className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span>
            <strong>Front Matter:</strong> Title and introductory plate of the authentic printed Mushaf. Quran text begins on{' '}
            <strong>Page {firstQuranPage}</strong> with Surah Al-Fatihah.
          </span>
        </div>
      )}

      {is13LineClosing && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Closing Leaf (Page 849):</strong> Contains concluding verses of Surah 113 (Al-Falaq), all 6 verses of Surah 114 (An-Nas), followed immediately on lines 8–13 by <em>Dua Khatm al-Quran</em> (Liturgical Closing Supplication).
          </span>
        </div>
      )}

      {is15LineClosing && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>
            <strong>Dua Khatm al-Quran (Closing Liturgical Plate):</strong> Concluding illuminated plate containing the complete formal supplication marking the completion of Quran recitation.
          </span>
        </div>
      )}

      {/* Main Image Container */}
      <div className="relative rounded-3xl bg-navy-950 border-2 border-gold-500/30 p-2 sm:p-4 shadow-2xl flex flex-col items-center justify-center min-h-[600px] overflow-hidden">
        {/* Loading Spinner */}
        {imageLoading && (
          <div className="absolute inset-0 bg-navy-950/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-gold-400" />
            <p className="text-xs text-slate-300 font-medium">Loading high-resolution page image...</p>
          </div>
        )}

        {/* Error Fallback */}
        {imageError ? (
          <div className="py-24 text-center text-red-300 space-y-3">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <p className="font-bold text-sm">Could not load scanned page {imagePad}</p>
            <p className="text-xs text-slate-400">Path: {imageUrl}</p>
            <button
              onClick={() => {
                setImageLoading(true);
                setImageError(false);
              }}
              className="px-3 py-1 bg-red-900/60 rounded border border-red-500/40 text-xs hover:bg-red-800"
            >
              Retry
            </button>
          </div>
        ) : (
          <div
            className={`transition-all duration-200 flex justify-center ${
              zoomLevel === 'fit'
                ? 'w-full max-w-3xl'
                : zoomLevel === '100'
                ? 'w-auto max-w-full overflow-x-auto'
                : 'w-[125%] max-w-none overflow-x-auto'
            }`}
          >
            <img
              src={imageUrl}
              alt={`Quran ${edition} Page ${currentPage}`}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageLoading(false);
                setImageError(true);
              }}
              className="rounded-xl shadow-2xl border border-gold-500/20 object-contain w-full h-auto select-none pointer-events-auto"
              style={{
                maxHeight: zoomLevel === 'fit' ? '82vh' : 'none',
              }}
            />
          </div>
        )}
      </div>

      {/* Bottom Sticky Page Quick Jumper Bar */}
      <div className="p-2 sm:p-2.5 rounded-xl bg-navy-900/90 border border-gold-500/20 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
        <button
          onClick={handlePrevPage}
          disabled={currentPage <= 1}
          className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-navy-950 border border-gold-500/20 hover:border-gold-400 disabled:opacity-40"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">Previous</span>
        </button>

        <span className="font-mono text-[10px] sm:text-[11px] text-slate-400 text-center">
          {edition} • p. {currentPage}/{totalPages} • {printedInfo.label}
        </span>

        <button
          onClick={handleNextPage}
          disabled={currentPage >= totalPages}
          className="flex items-center space-x-1 px-2.5 sm:px-3 py-1.5 rounded-lg bg-navy-950 border border-gold-500/20 hover:border-gold-400 disabled:opacity-40"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
