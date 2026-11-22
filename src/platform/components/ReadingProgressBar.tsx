// ==============================================================================
// Common Platform Reading Progress Component
// Jafri Religious Books & Audio Platform — Phase 0
// ==============================================================================

import React from 'react';
import { Compass } from 'lucide-react';
import { ReadingProgress } from '../types/user';

interface ReadingProgressBarProps {
  progress: ReadingProgress | null;
  onResumeReading?: () => void;
  accentColorClass?: string;
}

export const ReadingProgressBar: React.FC<ReadingProgressBarProps> = ({
  progress,
  onResumeReading,
  accentColorClass = 'text-gold-400',
}) => {
  if (!progress) return null;

  return (
    <div className="flex items-center justify-between p-3 rounded-2xl bg-navy-950/70 border border-slate-800 text-xs">
      <div className="flex items-center space-x-2.5">
        <Compass className={`w-4 h-4 ${accentColorClass}`} />
        <div>
          <span className="text-slate-400">Last Read: </span>
          <span className="font-bold text-slate-100">{progress.displayLocation}</span>
        </div>
      </div>

      {onResumeReading && (
        <button
          onClick={onResumeReading}
          className="px-3 py-1 rounded-xl bg-gold-500/10 border border-gold-500/30 text-gold-400 hover:bg-gold-500/20 font-medium transition"
        >
          Resume &rarr;
        </button>
      )}
    </div>
  );
};
