import React from 'react';
import { X, Bookmark, Trash2, ArrowRight } from 'lucide-react';
import { BookmarkItem } from '../../types/quran';

interface BookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkItem[];
  onSelectBookmark: (surahNumber: number, ayahNumber: number) => void;
  onRemoveBookmark: (id: string) => void;
  onClearAllBookmarks: () => void;
}

export const BookmarksDrawer: React.FC<BookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onSelectBookmark,
  onRemoveBookmark,
  onClearAllBookmarks,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-navy-900 border-l border-gold-500/30 flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-navy-800 flex items-center justify-between bg-navy-950/80">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-slate-100">Saved Bookmarks</h2>
              <p className="text-[11px] text-slate-400">{bookmarks.length} saved verse(s)</p>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            {bookmarks.length > 0 && (
              <button
                onClick={onClearAllBookmarks}
                title="Clear all bookmarks"
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-navy-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {bookmarks.length > 0 ? (
            bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="p-3.5 rounded-xl bg-navy-950/80 border border-gold-500/20 hover:border-gold-400 transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between pb-1 border-b border-navy-800/80">
                  <button
                    onClick={() => {
                      onSelectBookmark(bm.surahNumber, bm.ayahNumber);
                      onClose();
                    }}
                    className="flex items-center space-x-2 text-left group-hover:text-gold-400 transition-colors"
                  >
                    <span className="font-serif font-bold text-xs text-slate-100">
                      Surah {bm.surahName} ({bm.surahEnglishName})
                    </span>
                    <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-gold-500/20 text-gold-300 border border-gold-500/30">
                      Verse {bm.ayahNumber}
                    </span>
                  </button>

                  <button
                    onClick={() => onRemoveBookmark(bm.id)}
                    title="Remove Bookmark"
                    className="text-slate-500 hover:text-red-400 p-1 rounded transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {bm.arabicSnippet && (
                  <div
                    className="font-quran text-sm text-slate-200 text-right line-clamp-2 leading-relaxed"
                    dir="rtl"
                  >
                    {bm.arabicSnippet}
                  </div>
                )}

                {bm.translationSnippet && (
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                    {bm.translationSnippet}
                  </p>
                )}

                <div className="pt-1 flex items-center justify-between text-[10px] text-slate-500">
                  <span>Saved {new Date(bm.timestamp).toLocaleDateString()}</span>
                  <button
                    onClick={() => {
                      onSelectBookmark(bm.surahNumber, bm.ayahNumber);
                      onClose();
                    }}
                    className="flex items-center gap-1 text-gold-400 hover:underline font-medium"
                  >
                    <span>Read verse</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="py-16 text-center text-xs text-slate-400 space-y-2">
              <Bookmark className="w-10 h-10 text-slate-600 mx-auto" />
              <p className="text-slate-300 font-medium">No bookmarks saved yet</p>
              <p className="text-[11px] text-slate-500 max-w-xs mx-auto">
                Click the ribbon icon on any verse while reading to save it here for quick access.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
