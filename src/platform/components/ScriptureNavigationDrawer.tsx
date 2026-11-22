// ==============================================================================
// Common Platform Scripture Navigation Drawer
// Hierarchical table of contents for books, chapters, sections, and hymns
// Jafri Religious Books & Audio Platform — Phase 0
// ==============================================================================

import React, { useState } from 'react';
import { X, Search, ChevronRight, Layers } from 'lucide-react';
import { NavigationNode } from '../types/adapter';
import { CanonicalAddress } from '../types/scripture';

interface ScriptureNavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  nativeTitle?: string;
  hierarchyLabels: string[];
  nodes: NavigationNode[];
  onSelectAddress: (address: CanonicalAddress) => void;
  accentColorClass?: string;
}

export const ScriptureNavigationDrawer: React.FC<ScriptureNavigationDrawerProps> = ({
  isOpen,
  onClose,
  title,
  nativeTitle,
  hierarchyLabels,
  nodes,
  onSelectAddress,
  accentColorClass = 'text-gold-400',
}) => {
  const [searchFilter, setSearchFilter] = useState('');

  if (!isOpen) return null;

  const filteredNodes = searchFilter.trim()
    ? nodes.filter(
        (n) =>
          n.title.toLowerCase().includes(searchFilter.toLowerCase().trim()) ||
          (n.nativeTitle && n.nativeTitle.includes(searchFilter.trim()))
      )
    : nodes;

  return (
    <div className="fixed inset-0 z-50 flex justify-start">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-sm sm:max-w-md bg-navy-900 border-r border-slate-800 flex flex-col h-full shadow-2xl z-10 animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-navy-950/90">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center">
              <Layers className={`w-4 h-4 ${accentColorClass}`} />
            </div>
            <div>
              <h2 className="text-sm font-serif font-bold text-slate-100">{title}</h2>
              {nativeTitle && <p className="text-[11px] text-slate-400">{nativeTitle}</p>}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Hierarchy Context Badge */}
        {hierarchyLabels.length > 0 && (
          <div className="px-4 py-2 bg-navy-950/60 border-b border-slate-800/60 text-[11px] text-slate-400 flex items-center space-x-1.5">
            <span className="font-semibold text-slate-300">Structure:</span>
            <span>{hierarchyLabels.join(' → ')}</span>
          </div>
        )}

        {/* Filter Input */}
        <div className="p-3 border-b border-slate-800/80 bg-navy-950/40">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Filter chapters or sections..."
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              className="w-full bg-navy-950 border border-slate-700/60 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-gold-500"
            />
          </div>
        </div>

        {/* Nodes List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
          {filteredNodes.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              {nodes.length === 0
                ? 'Structure under development. Canonical index will appear here.'
                : 'No sections match your filter.'}
            </div>
          ) : (
            filteredNodes.map((node) => (
              <button
                key={node.id}
                data-testid={`nav-node-${node.id}`}
                onClick={() => {
                  if (node.targetAddress) {
                    onSelectAddress(node.targetAddress);
                    onClose();
                  }
                }}
                className="w-full text-left p-2.5 rounded-xl bg-navy-950/60 hover:bg-navy-950 border border-slate-800/80 hover:border-slate-700 transition flex items-center justify-between group"
              >
                <div className="space-y-0.5">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-gold-400 transition">
                    {node.title}
                  </div>
                  {node.nativeTitle && (
                    <div className="text-[11px] text-slate-400 font-serif">
                      {node.nativeTitle}
                    </div>
                  )}
                  {node.unitCount && (
                    <div className="text-[10px] text-slate-500">
                      {node.unitCount} units
                    </div>
                  )}
                </div>
                <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-gold-400 group-hover:translate-x-0.5 transition" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
