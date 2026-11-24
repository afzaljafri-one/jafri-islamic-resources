/**
 * ============================================================================
 * ZODIACBEE / JAFRI SACRED AUDIO LIBRARY — TWO-COLUMN READING LAYOUT
 * Shared Universal Reading (approx 65%) & Sacred Audio Player (approx 35%)
 * Responsive Desktop & Mobile Architecture Across All Seven Religion Modules
 * ============================================================================
 */

import React from 'react';
import {
  SacredAudioReadingPanel,
} from '../audio/SacredAudioReadingPanel';
import type { ReadingContext } from '../../services/contextualAudioMatcher';

export interface TwoColumnReadingLayoutProps {
  context: ReadingContext;
  children: React.ReactNode;
  topBanner?: React.ReactNode;
  className?: string;
}

export const TwoColumnReadingLayout: React.FC<TwoColumnReadingLayoutProps> = ({
  context,
  children,
  topBanner,
  className = '',
}) => {
  return (
    <div className={`w-full space-y-6 ${className}`} data-testid="two-column-container">
      {/* Optional Top Full-Width Breadcrumb / Toolbar Banner */}
      {topBanner && <div>{topBanner}</div>}

      {/* Responsive Two-Column Grid: 65% Scripture Reading / 35% Sacred Audio Player */}
      <div
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
        data-testid="two-column-reading-layout"
      >
        {/* Left Column (approx 65%): Scripture & Religious Reading */}
        <div
          className="lg:col-span-8 w-full min-w-0 space-y-6"
          data-testid="reading-column"
        >
          {children}
        </div>

        {/* Right Column (approx 35%): Persistent Sacred Audio Library Panel */}
        <div
          className="lg:col-span-4 w-full sticky top-20 z-10 space-y-6"
          data-testid="sacred-audio-column"
        >
          <SacredAudioReadingPanel context={context} />
        </div>
      </div>
    </div>
  );
};
