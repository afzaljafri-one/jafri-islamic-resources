import React, { useState } from 'react';
import { PrayerTimesView } from './PrayerTimesView';
import { PrayerNotificationPanel } from './PrayerNotificationPanel';
import { QiblaCompassView } from './QiblaCompassView';
import { HijriCalendarView } from './HijriCalendarView';
import { HadithBrowserView } from './HadithBrowserView';
import { SixKalimasView } from './SixKalimasView';
import { DailyDuasView } from './DailyDuasView';
import { AsmaUlHusnaView } from './AsmaUlHusnaView';
import { ZakatCalculatorView } from './ZakatCalculatorView';

export type IslamicToolTab =
  | 'prayer'
  | 'qibla'
  | 'calendar'
  | 'hadith'
  | 'kalimas'
  | 'duas'
  | 'names'
  | 'zakat';

interface TabDefinition {
  id: IslamicToolTab;
  title: string;
  arabicTitle: string;
  icon: string;
  description: string;
}

const TABS: TabDefinition[] = [
  {
    id: 'prayer',
    title: 'Prayer Timings',
    arabicTitle: 'مواقيت الصلاة',
    icon: '🕌',
    description: 'Astronomical calculation of 5 daily prayers, sunrise, and countdown',
  },
  {
    id: 'qibla',
    title: 'Qibla Direction',
    arabicTitle: 'اتجاه القبلة',
    icon: '🧭',
    description: 'Precise bearing to the Holy Kaaba with live compass sensor',
  },
  {
    id: 'calendar',
    title: 'Hijri Calendar',
    arabicTitle: 'التقويم الهجري',
    icon: '📅',
    description: 'Monthly Hijri calendar, Ramadan timings, and moon sighting adjustment',
  },
  {
    id: 'hadith',
    title: 'Hadith Library',
    arabicTitle: 'كتب الحديث',
    icon: '📚',
    description: 'Authentic traditions from Bukhari, Muslim, and the Sunan collections',
  },
  {
    id: 'kalimas',
    title: 'Six Kalimas',
    arabicTitle: 'الكلمات الست',
    icon: '✨',
    description: 'Six foundational declarations of Islamic faith with audio and Urdu',
  },
  {
    id: 'duas',
    title: 'Daily Duas',
    arabicTitle: 'أدعية وأذكار',
    icon: '🤲',
    description: 'Supplications from Hisn al-Muslim across 10 structured categories',
  },
  {
    id: 'names',
    title: 'Asma-ul-Husna',
    arabicTitle: 'أسماء الله الحسنى',
    icon: '💫',
    description: 'The 99 Beautiful Names of Allah with translations and meanings',
  },
  {
    id: 'zakat',
    title: 'Zakat Calculator',
    arabicTitle: 'حاسبة الزكاة',
    icon: '⚖️',
    description: 'Multi-asset zakat calculation with classical Nisab thresholds',
  },
];

export const IslamicToolsContainer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<IslamicToolTab>('prayer');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 pb-20" data-testid="islamic-tools-container">
      {/* Sub-Header Navigation */}
      <div className="sticky top-14 z-30 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 overflow-x-auto scrollbar-none gap-2">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  data-testid={`tool-tab-${tab.id}`}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <span className="text-base">{tab.icon}</span>
                  <div className="text-left">
                    <span className="block font-semibold leading-tight">{tab.title}</span>
                    <span className="block text-[10px] text-slate-400 font-serif leading-tight">
                      {tab.arabicTitle}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Tab Content View */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'prayer' && (
          <div className="space-y-6">
            <PrayerTimesView />
            <PrayerNotificationPanel />
          </div>
        )}
        {activeTab === 'qibla' && <QiblaCompassView />}
        {activeTab === 'calendar' && <HijriCalendarView />}
        {activeTab === 'hadith' && <HadithBrowserView />}
        {activeTab === 'kalimas' && <SixKalimasView />}
        {activeTab === 'duas' && <DailyDuasView />}
        {activeTab === 'names' && <AsmaUlHusnaView />}
        {activeTab === 'zakat' && <ZakatCalculatorView />}
      </main>
    </div>
  );
};
export default IslamicToolsContainer;
