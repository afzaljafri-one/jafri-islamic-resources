import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import './index.css';
import { quranRouter } from './services/quranRouter';
import { ummahApi } from './services/ummahApi';
import { alQuranApi } from './services/alQuranApi';
import { calculateOfflinePrayerTimes } from './services/offlinePrayerCalc';
import { cacheService } from './services/cacheService';
import { quranAudioService } from './services/audio';

// Expose services for automated test harness & verification
if (typeof window !== 'undefined') {
  (window as any).__SERVICES__ = {
    quranRouter,
    ummahApi,
    alQuranApi,
    calculateOfflinePrayerTimes,
    cacheService,
    quranAudioService,
  };
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
