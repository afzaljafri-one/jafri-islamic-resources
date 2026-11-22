// ==============================================================================
// Common Platform Universal Bookmarks Drawer
// Jafri Religious Books & Audio Platform — Phase 0
// ==============================================================================

import React, { useState } from 'react';
import { X, Bookmark, Trash2, ChevronRight } from 'lucide-react';
import { UniversalBookmark } from '../types/user';
import { ReligionId } from '../types/religion';
import { RELIGIONS_REGISTRY } from '../config/religionsRegistry';
import { CanonicalAddress } from '../types/scripture';

interface UniversalBookmarksDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: UniversalBookmark[];
  onSelectBookmark: (address: CanonicalAddress) => void;
  onRemoveBookmark: (id: string) => void;
  onClearBookmarks: (religionId?: ReligionId) => void;
}

export const UniversalBookmarksDrawer: React.FC<UniversalBookmarksDrawerProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onSelectBookmark,
  onRemoveBookmark,
  onClearBookmarks,
}) => {
  const [filterReligion, setFilterReligion] = useState<ReligionId | 'all'>('all');

  if (!isOpen) return null;

  const filteredBookmarks =
    filterReligion === 'all'
      ? bookmarks
      : bookmarks.filter((b) => b.religionId === filterReligion);

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-navy-900 border-l border-slate-800 flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-navy-950/90">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
              <Bookmark className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-slate-100">Saved Bookmarks</h2>
              <p className="text-[11px] text-slate-400">
                {filteredBookmarks.length} saved scripture unit(s)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Religion Filter Tabs */}
        <div className="p-2 border-b border-slate-800/80 bg-navy-950/60 flex items-center space-x-1 overflow-x-auto text-xs">
          <button
            onClick={() => setFilterReligion('all')}
            className={`px-2.5 py-1 rounded-lg transition whitespace-nowrap ${
              filterReligion === 'all'
                ? 'bg-gold-500 text-navy-950 font-bold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All ({bookmarks.length})
          </button>
          {Object.values(RELIGIONS_REGISTRY).map((rel) => {
            const count = bookmarks.filter((b) => b.religionId === rel.id).length;
            if (count === 0) return null;
            return (
              <button
                key={rel.id}
                onClick={() => setFilterReligion(rel.id)}
                className={`px-2 py-1 rounded-lg transition whitespace-nowrap ${
                  filterReligion === rel.id
                    ? 'bg-gold-500 text-navy-950 font-bold'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {rel.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Bookmarks List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {filteredBookmarks.length === 0 ? (
            <div className="text-center py-16 text-slate-500 text-xs space-y-1">
              <Bookmark className="w-8 h-8 mx-auto text-slate-700" />
              <p className="font-medium text-slate-400">No Bookmarks Saved</p>
              <p className="text-[11px] text-slate-600">
                Tap the bookmark icon on any scripture verse or section to save it locally.
              </p>
            </div>
          ) : (
            filteredBookmarks.map((item) => {
              const relMeta = RELIGIONS_REGISTRY[item.religionId];
              return (
                <div
                  key={item.id}
                  className="p-3 rounded-2xl bg-navy-950/70 border border-slate-800 hover:border-slate-700 transition space-y-2 group"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded ${
                        relMeta?.theme?.badgeBg || 'bg-slate-800'
                      } ${relMeta?.theme?.badgeText || 'text-slate-300'}`}
                    >
                      {relMeta?.name || item.religionId}
                    </span>
                    <button
                      onClick={() => onRemoveBookmark(item.id)}
                      title="Remove bookmark"
                      className="text-slate-500 hover:text-red-400 p-1 rounded transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div
                    onClick={() => {
                      onSelectBookmark(item.address);
                      onClose();
                    }}
                    className="cursor-pointer space-y-1"
                  >
                    <div className="text-xs font-bold text-slate-200 group-hover:text-gold-400 transition flex items-center justify-between">
                      <span>{item.displayTitle}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-gold-400" />
                    </div>
                    {item.displaySubtitle && (
                      <div className="text-[11px] text-slate-400">
                        {item.displaySubtitle}
                      </div>
                    )}
                    <p className="text-xs text-slate-300 line-clamp-2 italic font-serif">
                      "{item.snippetRootText}"
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {filteredBookmarks.length > 0 && (
          <div className="p-3 border-t border-slate-800 bg-navy-950/90 flex justify-between items-center text-xs">
            <span className="text-slate-500 text-[11px]">Stored locally on device</span>
            <button
              onClick={() => onClearBookmarks(filterReligion === 'all' ? undefined : filterReligion)}
              className="text-red-400 hover:text-red-300 font-medium hover:underline text-[11px]"
            >
              Clear {filterReligion === 'all' ? 'All' : relName(filterReligion)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

function relName(id: ReligionId): string {
  return RELIGIONS_REGISTRY[id]?.name || id;
}
