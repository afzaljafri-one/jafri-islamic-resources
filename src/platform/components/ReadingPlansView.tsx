// ==============================================================================
// Reading Plans & Daily Schedules View (Phase 6.2)
// Custom & Curated Multi-Religion Plans, Schedules, Progress & Reminders
// Jafri Religious Resources
// ==============================================================================

import React, { useState, useMemo } from 'react';
import {
  Calendar,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Play,
  SkipForward,
  CalendarDays,
  PlusCircle,
  PauseCircle,
  RotateCcw,
  Trash2,
  Bell,
  BellOff,
  Sparkles,
  Layers,
  ChevronRight,
  BookOpen,
  Info,
} from 'lucide-react';
import { ReligionId } from '../types/religion';
import { ALL_RELIGION_IDS, RELIGIONS_REGISTRY } from '../config/religionsRegistry';
import type { ReadingPlan } from '../types/personalLibrary';
import {
  personalLibraryService,
  CURATED_PLAN_TEMPLATES,
  getLocalDateString,
} from '../services/personalLibraryService';

interface ReadingPlansViewProps {
  onNavigateToReading: (
    religion: ReligionId,
    item: {
      collectionId?: string;
      readingId?: string;
      chapterNumber?: number | string;
      verseNumber?: number | string;
      translationId?: string;
    }
  ) => void;
}

type PlanSubTab = 'today' | 'plans' | 'create';

export const ReadingPlansView: React.FC<ReadingPlansViewProps> = ({ onNavigateToReading }) => {
  const [subTab, setSubTab] = useState<PlanSubTab>('today');
  const [libraryState, setLibraryState] = useState(() => personalLibraryService.getState());
  const [notificationStatus, setNotificationStatus] = useState<NotificationPermission>(() => {
    return typeof window !== 'undefined' && 'Notification' in window
      ? Notification.permission
      : 'denied';
  });
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Subscribe to updates
  React.useEffect(() => {
    const unsub = personalLibraryService.subscribe(() => {
      setLibraryState({ ...personalLibraryService.getState() });
    });
    return () => unsub();
  }, []);

  const todayStr = useMemo(() => getLocalDateString(), []);
  const todaySessions = useMemo(() => {
    return personalLibraryService.getTodaySessions();
  }, [libraryState.sessions, todayStr]);

  // Request browser notification permission
  const handleRequestPermission = async () => {
    const perm = await personalLibraryService.requestNotificationPermission();
    setNotificationStatus(perm);
    if (perm === 'granted') {
      setActionNotice('Browser reminders enabled successfully!');
    } else {
      setActionNotice('Notification permission was not granted by your browser.');
    }
    setTimeout(() => setActionNotice(null), 4000);
  };

  // Adopt curated template
  const handleAdoptTemplate = (template: (typeof CURATED_PLAN_TEMPLATES)[0]) => {
    const newPlan: ReadingPlan = {
      ...template,
      id: `plan_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      status: 'active',
      currentIndex: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    personalLibraryService.savePlan(newPlan);
    setActionNotice(`Reading Plan "${newPlan.name}" activated!`);
    setTimeout(() => setActionNotice(null), 4000);
    setSubTab('today');
  };

  // Custom plan form state
  const [customName, setCustomName] = useState('');
  const [customReligions, setCustomReligions] = useState<ReligionId[]>(['islam']);
  const [customTargetType, setCustomTargetType] = useState<'chapter' | 'passage' | 'time'>('chapter');
  const [customTargetValue, setCustomTargetValue] = useState(1);
  const [customWeekdays, setCustomWeekdays] = useState<number[]>([0, 1, 2, 3, 4, 5, 6]);
  const [customTime, setCustomTime] = useState('07:00');
  const [customReminder, setCustomReminder] = useState(true);

  const handleToggleReligion = (rel: ReligionId) => {
    if (customReligions.includes(rel)) {
      if (customReligions.length > 1) {
        setCustomReligions(customReligions.filter((r) => r !== rel));
      }
    } else {
      setCustomReligions([...customReligions, rel]);
    }
  };

  const handleToggleWeekday = (day: number) => {
    if (customWeekdays.includes(day)) {
      if (customWeekdays.length > 1) {
        setCustomWeekdays(customWeekdays.filter((d) => d !== day));
      }
    } else {
      setCustomWeekdays([...customWeekdays, day].sort());
    }
  };

  const handleCreateCustomPlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customName.trim()) return;

    // Build planned items from selected religions
    const items: ReadingPlan['items'] = [];
    customReligions.forEach((rel) => {
      if (rel === 'islam') {
        items.push({
          id: `custom-isl-${Date.now()}`,
          religion: 'islam',
          scriptureId: 'quran',
          collectionId: 'holy-quran',
          readingId: 'surah-1',
          chapterNumber: 1,
          verseNumber: 1,
          displayTitle: 'The Holy Quran — Surah Al-Faatiha',
          displayLocation: 'Surah 1:1',
          estimatedMinutes: 5,
        });
      } else if (rel === 'hinduism') {
        items.push({
          id: `custom-hin-${Date.now()}`,
          religion: 'hinduism',
          scriptureId: 'gita',
          collectionId: 'gita',
          readingId: 'gita-1',
          chapterNumber: 1,
          verseNumber: 1,
          displayTitle: 'Shrimad Bhagavad Gita — Chapter 1',
          displayLocation: 'Chapter 1: Arjuna Visada Yoga',
          estimatedMinutes: 10,
        });
      } else if (rel === 'christianity') {
        items.push({
          id: `custom-chr-${Date.now()}`,
          religion: 'christianity',
          scriptureId: 'bible-kjv',
          collectionId: 'bible-kjv',
          readingId: 'genesis-1',
          chapterNumber: 1,
          verseNumber: 1,
          displayTitle: 'The Holy Bible — Genesis 1',
          displayLocation: 'Genesis 1:1',
          estimatedMinutes: 8,
        });
      } else if (rel === 'judaism') {
        items.push({
          id: `custom-jud-${Date.now()}`,
          religion: 'judaism',
          scriptureId: 'tanakh',
          collectionId: 'torah',
          readingId: 'genesis-1',
          chapterNumber: 'Genesis',
          verseNumber: 1,
          displayTitle: 'The Tanakh — Bereshit (Genesis 1)',
          displayLocation: 'Genesis 1:1',
          estimatedMinutes: 8,
        });
      } else if (rel === 'sikhism') {
        items.push({
          id: `custom-sikh-${Date.now()}`,
          religion: 'sikhism',
          scriptureId: 'sggs',
          collectionId: 'sggs',
          readingId: 'ang-1',
          chapterNumber: 1,
          verseNumber: 1,
          displayTitle: 'Sri Guru Granth Sahib Ji — Ang 1',
          displayLocation: 'SGGS Ang 1',
          estimatedMinutes: 8,
        });
      } else if (rel === 'buddhism') {
        items.push({
          id: `custom-bud-${Date.now()}`,
          religion: 'buddhism',
          scriptureId: 'tipitaka',
          collectionId: 'khuddaka',
          readingId: 'mangala',
          chapterNumber: 'mangala',
          verseNumber: 1,
          displayTitle: 'Pali Canon Tipitaka — Maha-Mangala Sutta',
          displayLocation: 'Sutta Nipata 2.4',
          estimatedMinutes: 8,
        });
      } else if (rel === 'jainism') {
        items.push({
          id: `custom-jain-${Date.now()}`,
          religion: 'jainism',
          scriptureId: 'agamas',
          collectionId: 'navkar',
          readingId: 'navkar',
          chapterNumber: 'navkar',
          verseNumber: 1,
          displayTitle: 'Canonical Jain Agamas — Namokar Maha Mantra',
          displayLocation: 'Canonical Liturgy',
          estimatedMinutes: 5,
        });
      }
    });

    const newPlan: ReadingPlan = {
      id: `custom_plan_${Date.now()}`,
      name: customName.trim(),
      religions: customReligions,
      planType: customReligions.length > 1 ? 'multi-religion' : 'single-religion',
      targetType: customTargetType,
      dailyTarget: customTargetValue,
      targetUnit:
        customTargetType === 'chapter'
          ? 'chapters'
          : customTargetType === 'passage'
          ? 'passages'
          : 'minutes',
      items,
      startDate: todayStr,
      selectedWeekdays: customWeekdays,
      preferredTime: customTime,
      timeZone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'UTC',
      reminderEnabled: customReminder,
      reminderTime: customTime,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      currentIndex: 0,
    };

    personalLibraryService.savePlan(newPlan);
    setActionNotice(`Custom Reading Plan "${newPlan.name}" created!`);
    setTimeout(() => setActionNotice(null), 4000);
    setCustomName('');
    setSubTab('today');
  };

  const getReligionBadgeColor = (rel: ReligionId) => {
    switch (rel) {
      case 'islam':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
      case 'hinduism':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'christianity':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/40';
      case 'judaism':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40';
      case 'sikhism':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/40';
      case 'buddhism':
        return 'bg-orange-500/20 text-orange-300 border-orange-500/40';
      case 'jainism':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
    }
  };

  const weekdayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Action Notification */}
      {actionNotice && (
        <div className="px-3.5 py-2 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionNotice}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-emerald-400 hover:text-emerald-200 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Controls Bar: Sub-Tabs + Reminder Permission Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-1.5 p-1 bg-navy-950/90 rounded-xl border border-slate-800">
          <button
            data-testid="subtab-today"
            onClick={() => setSubTab('today')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              subTab === 'today'
                ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <CalendarCheck className="w-3.5 h-3.5" />
            <span>Today's Readings</span>
            {todaySessions.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-navy-900/80 text-gold-300 ml-1 font-mono">
                {todaySessions.length}
              </span>
            )}
          </button>

          <button
            data-testid="subtab-plans"
            onClick={() => setSubTab('plans')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              subTab === 'plans'
                ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Active Plans ({libraryState.plans.length})</span>
          </button>

          <button
            data-testid="subtab-create"
            onClick={() => setSubTab('create')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              subTab === 'create'
                ? 'bg-gold-500 text-navy-950 font-bold shadow-gold-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Create New Plan</span>
          </button>
        </div>

        {/* Reminder Permission Status Pill */}
        <div className="flex items-center space-x-2">
          {notificationStatus === 'granted' ? (
            <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-[11px]">
              <Bell className="w-3.5 h-3.5 text-emerald-400" />
              <span>Reminders Active</span>
            </div>
          ) : (
            <button
              data-testid="enable-reminders-btn"
              onClick={handleRequestPermission}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-xl bg-navy-900 border border-slate-700 hover:border-gold-500/50 text-slate-300 hover:text-gold-300 text-[11px] transition"
              title="Enable browser notifications for reading schedule reminders"
            >
              <BellOff className="w-3.5 h-3.5 text-slate-400" />
              <span>Enable Reminders</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {/* SUBTAB 1: TODAY'S SCHEDULE */}
        {subTab === 'today' && (
          <div className="space-y-4">
            {/* Today Overview Header */}
            <div className="p-4 rounded-xl bg-navy-950/70 border border-gold-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="flex items-center space-x-2">
                  <CalendarDays className="w-4 h-4 text-gold-400" />
                  <h3 className="font-serif text-sm sm:text-base font-bold text-slate-100">
                    Today's Reading Routine • {new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })}
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  {todaySessions.length === 0
                    ? 'No readings scheduled for today. You can adopt a curated plan or create your custom schedule below.'
                    : `${todaySessions.filter((s) => s.status === 'completed').length} of ${todaySessions.length} reading tasks completed today.`}
                </p>
              </div>

              {todaySessions.length > 0 && (
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block">Today's Progress</span>
                    <span className="text-xs font-bold text-gold-400 font-mono">
                      {Math.round(
                        (todaySessions.filter((s) => s.status === 'completed').length / todaySessions.length) * 100
                      )}%
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* In-App Reminder Notice if uncompleted readings exist */}
            {todaySessions.some((s) => s.status === 'scheduled') && (
              <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>
                    You have <strong>{todaySessions.filter((s) => s.status === 'scheduled').length}</strong> scheduled reading task(s) waiting for today.
                  </span>
                </div>
                <span className="text-[11px] font-mono text-amber-400 font-semibold px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30">
                  Scheduled
                </span>
              </div>
            )}

            {/* Today Sessions List */}
            {todaySessions.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-xl border border-dashed border-slate-800 bg-navy-950/40 space-y-3">
                <div className="w-12 h-12 rounded-full bg-navy-900 border border-slate-800 flex items-center justify-center mx-auto text-slate-500">
                  <BookOpen className="w-6 h-6 text-slate-400" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-semibold text-sm text-slate-200">No Readings Scheduled for Today</h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Start a personalized reading routine across Islam, Hinduism, Christianity, Judaism, Sikhism, Buddhism, Jainism or Multi-Religion paths.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => setSubTab('create')}
                    className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs transition shadow-gold-sm inline-flex items-center space-x-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Explore Curated Plans</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todaySessions.map((session) => (
                  <div
                    key={session.id}
                    data-testid="today-session-card"
                    className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      session.status === 'completed'
                        ? 'bg-emerald-950/20 border-emerald-500/30'
                        : session.status === 'skipped'
                        ? 'bg-slate-900/40 border-slate-800 opacity-60'
                        : session.status === 'postponed'
                        ? 'bg-amber-950/20 border-amber-500/30'
                        : 'bg-navy-950/80 border-slate-800 hover:border-gold-500/40'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded font-semibold border ${getReligionBadgeColor(
                            session.item.religion
                          )}`}
                        >
                          {session.item.religion}
                        </span>
                        <span className="text-xs font-medium text-slate-400">• {session.planName}</span>
                        {session.item.estimatedMinutes && (
                          <span className="text-[11px] text-slate-500 flex items-center space-x-1 font-mono">
                            <Clock className="w-3 h-3" />
                            <span>{session.item.estimatedMinutes} mins</span>
                          </span>
                        )}
                      </div>

                      <h4 className="font-serif text-sm font-bold text-slate-100">{session.item.displayTitle}</h4>
                      <p className="text-xs text-slate-400">{session.item.displayLocation}</p>
                    </div>

                    <div className="flex items-center space-x-1.5 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-800">
                      {/* Start / Resume Reading Button */}
                      <button
                        data-testid="start-plan-reading-btn"
                        onClick={() => onNavigateToReading(session.item.religion, session.item)}
                        className="px-3 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs transition flex items-center space-x-1 shadow-gold-sm"
                        title="Navigate to scripture reading (does not play audio)"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{session.status === 'completed' ? 'Revisit' : 'Start Reading'}</span>
                      </button>

                      {/* Mark Completed Button */}
                      <button
                        data-testid="mark-session-completed-btn"
                        onClick={() => personalLibraryService.markSessionCompleted(session.id)}
                        className={`p-1.5 rounded-lg border transition ${
                          session.status === 'completed'
                            ? 'bg-emerald-500 text-navy-950 border-emerald-400'
                            : 'bg-navy-900 text-slate-300 border-slate-700 hover:border-emerald-500 hover:text-emerald-300'
                        }`}
                        title={session.status === 'completed' ? 'Completed' : 'Mark as Completed'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </button>

                      {/* Postpone to Tomorrow */}
                      {session.status !== 'completed' && (
                        <button
                          data-testid="postpone-session-btn"
                          onClick={() => personalLibraryService.postponeSession(session.id)}
                          className="p-1.5 rounded-lg bg-navy-900 text-slate-400 border border-slate-700 hover:border-amber-500 hover:text-amber-300 transition"
                          title="Postpone to tomorrow"
                        >
                          <Calendar className="w-4 h-4" />
                        </button>
                      )}

                      {/* Skip Session */}
                      {session.status !== 'completed' && (
                        <button
                          data-testid="skip-session-btn"
                          onClick={() => personalLibraryService.skipSession(session.id)}
                          className="p-1.5 rounded-lg bg-navy-900 text-slate-400 border border-slate-700 hover:border-slate-500 hover:text-slate-200 transition"
                          title="Skip reading for today (no penalty)"
                        >
                          <SkipForward className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 2: ACTIVE PLANS */}
        {subTab === 'plans' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="font-serif text-sm font-bold text-slate-200">
                Your Reading Plans ({libraryState.plans.length})
              </h3>
              <button
                onClick={() => setSubTab('create')}
                className="text-xs font-semibold text-gold-400 hover:text-gold-300 flex items-center space-x-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Plan</span>
              </button>
            </div>

            {libraryState.plans.length === 0 ? (
              <div className="text-center py-10 px-4 rounded-xl border border-dashed border-slate-800 bg-navy-950/40 space-y-2">
                <p className="text-xs text-slate-400">You do not have any active reading plans yet.</p>
                <button
                  onClick={() => setSubTab('create')}
                  className="px-3.5 py-1.5 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs transition"
                >
                  Create Plan
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {libraryState.plans.map((plan) => {
                  const progress = personalLibraryService.getPlanProgress(plan.id);
                  return (
                    <div
                      key={plan.id}
                      data-testid="plan-card"
                      className="p-4 rounded-xl bg-navy-950/90 border border-slate-800 hover:border-gold-500/30 transition flex flex-col justify-between space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {plan.religions.map((r) => (
                              <span
                                key={r}
                                className={`text-[10px] uppercase font-mono px-1.5 py-0.5 rounded font-semibold border ${getReligionBadgeColor(
                                  r
                                )}`}
                              >
                                {r}
                              </span>
                            ))}
                          </div>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold border ${
                              plan.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : plan.status === 'completed'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {plan.status.toUpperCase()}
                          </span>
                        </div>

                        <h4 className="font-serif text-sm font-bold text-slate-100">{plan.name}</h4>
                        {plan.description && <p className="text-xs text-slate-400 line-clamp-2">{plan.description}</p>}

                        {/* Progress Bar & Denominator */}
                        <div className="space-y-1 pt-1">
                          <div className="flex items-center justify-between text-[11px] font-mono">
                            <span className="text-slate-400">
                              Completed: <strong>{progress.completedSessions}</strong> / {progress.totalItems}
                            </span>
                            <span className="text-gold-400 font-bold">
                              {progress.progressPercentage !== null ? `${progress.progressPercentage}%` : 'Open Scope'}
                            </span>
                          </div>
                          {progress.progressPercentage !== null && (
                            <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gold-500 rounded-full transition-all duration-300"
                                style={{ width: `${progress.progressPercentage}%` }}
                              />
                            </div>
                          )}
                        </div>

                        {/* Weekly & Monthly Statistics (Non-punitive) */}
                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-[11px]">
                          <div className="bg-navy-900/60 p-2 rounded-lg">
                            <span className="text-slate-400 block text-[10px]">This Week</span>
                            <span className="font-mono text-slate-200 font-semibold">
                              {progress.weeklyCompleted} / {progress.weeklyScheduled} days
                            </span>
                          </div>
                          <div className="bg-navy-900/60 p-2 rounded-lg">
                            <span className="text-slate-400 block text-[10px]">This Month</span>
                            <span className="font-mono text-slate-200 font-semibold">
                              {progress.monthlyCompleted} / {progress.monthlyScheduled} days
                            </span>
                          </div>
                        </div>

                        {progress.lastCompletedDate && (
                          <p className="text-[10px] text-slate-500 font-mono">
                            Last read: {progress.lastCompletedTitle} ({new Date(progress.lastCompletedDate).toLocaleDateString()})
                          </p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                        <div className="flex items-center space-x-1.5">
                          {plan.status === 'active' ? (
                            <button
                              data-testid="pause-plan-btn"
                              onClick={() => personalLibraryService.updatePlanStatus(plan.id, 'paused')}
                              className="px-2 py-1 rounded bg-navy-900 hover:bg-slate-800 text-amber-300 border border-slate-700 text-xs flex items-center space-x-1"
                              title="Pause Plan"
                            >
                              <PauseCircle className="w-3.5 h-3.5" />
                              <span>Pause</span>
                            </button>
                          ) : (
                            <button
                              data-testid="resume-plan-btn"
                              onClick={() => personalLibraryService.updatePlanStatus(plan.id, 'active')}
                              className="px-2 py-1 rounded bg-navy-900 hover:bg-slate-800 text-emerald-300 border border-slate-700 text-xs flex items-center space-x-1"
                              title="Resume Plan"
                            >
                              <Play className="w-3.5 h-3.5" />
                              <span>Resume</span>
                            </button>
                          )}

                          <button
                            data-testid="restart-plan-btn"
                            onClick={() => personalLibraryService.restartPlan(plan.id)}
                            className="p-1 rounded bg-navy-900 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-700"
                            title="Restart Plan from Day 1"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          data-testid="delete-plan-btn"
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to delete the plan "${plan.name}"?`)) {
                              personalLibraryService.deletePlan(plan.id);
                            }
                          }}
                          className="p-1 rounded bg-navy-900 hover:bg-rose-950 text-slate-500 hover:text-rose-400 border border-slate-800 transition"
                          title="Delete Plan"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SUBTAB 3: CREATE NEW PLAN (TEMPLATES + CUSTOM BUILDER) */}
        {subTab === 'create' && (
          <div className="space-y-6">
            {/* Section A: Curated Quick-Start Templates */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-gold-400" />
                <h3 className="font-serif text-sm sm:text-base font-bold text-slate-100">
                  Curated Religious Reading Templates
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Adopt a verified canonical routine with one click. Fully customizable, non-punitive, and local-first.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {CURATED_PLAN_TEMPLATES.map((tmpl, idx) => (
                  <div
                    key={idx}
                    data-testid="curated-template-card"
                    className="p-3.5 rounded-xl bg-navy-950/80 border border-slate-800 hover:border-gold-500/40 transition flex flex-col justify-between space-y-2.5"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-wrap gap-1">
                          {tmpl.religions.map((r) => (
                            <span
                              key={r}
                              className={`text-[9px] uppercase font-mono px-1.5 py-0.5 rounded font-semibold border ${getReligionBadgeColor(
                                r
                              )}`}
                            >
                              {r}
                            </span>
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">
                          {tmpl.items.length} Daily Sessions
                        </span>
                      </div>

                      <h4 className="font-serif text-sm font-bold text-slate-100">{tmpl.name}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{tmpl.description}</p>
                    </div>

                    <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                      <span className="text-[11px] text-slate-500 font-mono flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Daily @ {tmpl.preferredTime}</span>
                      </span>

                      <button
                        data-testid="adopt-template-btn"
                        onClick={() => handleAdoptTemplate(tmpl)}
                        className="px-3 py-1.5 rounded-lg bg-gold-500/20 hover:bg-gold-500 text-gold-300 hover:text-navy-950 border border-gold-500/40 text-xs font-semibold transition flex items-center space-x-1"
                      >
                        <span>Adopt Routine</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Section B: Custom Plan Builder */}
            <div className="p-4 rounded-xl bg-navy-950/90 border border-gold-500/30 space-y-4">
              <div className="flex items-center space-x-2">
                <PlusCircle className="w-4 h-4 text-gold-400" />
                <h3 className="font-serif text-sm sm:text-base font-bold text-slate-100">
                  Custom Reading Routine Builder
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Design your own reading plan across any single tradition or combine multiple world traditions into one routine.
              </p>

              <form onSubmit={handleCreateCustomPlan} className="space-y-4 text-xs">
                {/* Plan Name */}
                <div className="space-y-1">
                  <label className="text-slate-300 font-semibold block">Plan Title</label>
                  <input
                    data-testid="plan-name-input"
                    type="text"
                    required
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    placeholder="e.g., Morning Meditation & Scripture Reflections"
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-gold-500 text-xs"
                  />
                </div>

                {/* Religion Selection Checkboxes */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold block">
                    Include Religious Traditions ({customReligions.length} selected)
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {ALL_RELIGION_IDS.map((relId) => {
                      const relMeta = RELIGIONS_REGISTRY[relId];
                      const selected = customReligions.includes(relId);
                      return (
                        <button
                          key={relId}
                          type="button"
                          data-testid={`religion-pill-${relId}`}
                          onClick={() => handleToggleReligion(relId)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition ${
                            selected
                              ? 'bg-gold-500 text-navy-950 font-bold border-gold-400'
                              : 'bg-navy-900 text-slate-400 border-slate-700 hover:text-slate-200'
                          }`}
                        >
                          {relMeta?.name || relId}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Target Type & Value */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Target Cadence</label>
                    <select
                      data-testid="cadence-select"
                      value={customTargetType}
                      onChange={(e) => setCustomTargetType(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-gold-500 text-xs"
                    >
                      <option value="chapter">Chapter-based (1 Chapter per session)</option>
                      <option value="passage">Passage-based (1 Passage per session)</option>
                      <option value="time">Time-based (Target minutes per day)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Daily Target Amount</label>
                    <input
                      type="number"
                      min={1}
                      max={120}
                      value={customTargetValue}
                      onChange={(e) => setCustomTargetValue(Number(e.target.value) || 1)}
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-gold-500 text-xs font-mono"
                    />
                  </div>
                </div>

                {/* Weekdays Selector */}
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-semibold block">Active Days of Week</label>
                  <div className="flex flex-wrap gap-1">
                    {weekdayNames.map((name, idx) => {
                      const selected = customWeekdays.includes(idx);
                      return (
                        <button
                          key={name}
                          type="button"
                          onClick={() => handleToggleWeekday(idx)}
                          className={`w-9 h-8 rounded-lg text-xs font-mono font-semibold transition ${
                            selected
                              ? 'bg-gold-500 text-navy-950 font-bold'
                              : 'bg-navy-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          {name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Preferred Time & Reminders */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
                  <div className="space-y-1">
                    <label className="text-slate-300 font-semibold block">Preferred Reading Time</label>
                    <input
                      type="time"
                      value={customTime}
                      onChange={(e) => setCustomTime(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-slate-700 text-slate-100 focus:outline-none focus:border-gold-500 text-xs font-mono"
                    />
                  </div>

                  <div className="pt-4 sm:pt-6 flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="custom-reminder-chk"
                      checked={customReminder}
                      onChange={(e) => setCustomReminder(e.target.checked)}
                      className="rounded border-slate-700 bg-navy-900 text-gold-500 focus:ring-0"
                    />
                    <label htmlFor="custom-reminder-chk" className="text-slate-300 cursor-pointer">
                      Enable schedule reminders at this time
                    </label>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    data-testid="create-plan-submit-btn"
                    type="submit"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs transition shadow-gold-sm flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Create & Activate Routine</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Technical Limitation Disclaimer Note */}
            <div className="p-3.5 rounded-xl bg-navy-950/50 border border-slate-800 text-slate-400 text-xs flex items-start space-x-2.5">
              <Info className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-semibold text-slate-300">Technical Note on Browser Reminders:</span>
                <p className="text-[11px] leading-relaxed">
                  Browser notification reminders trigger while the web application tab is active or open in the background. In accordance with milestone privacy standards, zero external cloud servers or push notification gateways are employed, meaning guaranteed notifications when the browser application is completely terminated cannot be assured.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
