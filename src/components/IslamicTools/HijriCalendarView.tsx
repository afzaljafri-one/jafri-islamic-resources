import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import {
  getHijriDate,
  getMonthlyCalendarGrid,
  MAJOR_ISLAMIC_EVENTS,
  generateRamadanSchedule,
  findFirstOfRamadan,
} from '../../services/islamic/hijriCalendarService';
import { LOCATION_PRESETS, DEFAULT_LOCATION } from '../../services/islamic/locationPresets';
import { CALCULATION_METHODS, ASR_SCHOOLS } from '../../types/settings';

export const HijriCalendarView: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [adjustmentOffset, setAdjustmentOffset] = useState<number>(0); // -2 to +2 days
  const [activeTab, setActiveTab] = useState<'month' | 'ramadan' | 'events' | 'converter'>('month');

  // Ramadan location and calculation method selection
  const [selectedLocationId, setSelectedLocationId] = useState<string>(DEFAULT_LOCATION.id);
  const [selectedMethodId, setSelectedMethodId] = useState<number>(1); // Karachi by default
  const [selectedSchoolId, setSelectedSchoolId] = useState<number>(2); // Hanafi by default

  const selectedLocation = useMemo(() => {
    return LOCATION_PRESETS.find((l) => l.id === selectedLocationId) || DEFAULT_LOCATION;
  }, [selectedLocationId]);

  // Converter state
  const [convertYear, setConvertYear] = useState<number>(new Date().getFullYear());
  const [convertMonth, setConvertMonth] = useState<number>(new Date().getMonth() + 1);
  const [convertDay, setConvertDay] = useState<number>(new Date().getDate());

  // Current Hijri date object
  const todayHijri = useMemo(() => {
    return getHijriDate(new Date(), adjustmentOffset);
  }, [adjustmentOffset]);

  // Selected month calendar grid
  const calendarGrid = useMemo(() => {
    return getMonthlyCalendarGrid(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      adjustmentOffset
    );
  }, [currentDate, adjustmentOffset]);

  // Dynamically determine 1 Ramadan of the active Hijri year
  const ramadanStartDate = useMemo(() => {
    return findFirstOfRamadan(todayHijri.year, adjustmentOffset);
  }, [todayHijri.year, adjustmentOffset]);

  // Ramadan 30-day schedule dynamically calculated from selected location & calculation settings
  const ramadanSchedule = useMemo(() => {
    return generateRamadanSchedule(
      selectedLocation.latitude,
      selectedLocation.longitude,
      selectedMethodId,
      selectedSchoolId,
      ramadanStartDate,
      selectedLocation.timezone,
      `${selectedLocation.name}, ${selectedLocation.country}`
    );
  }, [selectedLocation, selectedMethodId, selectedSchoolId, ramadanStartDate]);

  // Converted result
  const convertedHijri = useMemo(() => {
    const target = new Date(convertYear, convertMonth - 1, convertDay);
    return getHijriDate(target, adjustmentOffset);
  }, [convertYear, convertMonth, convertDay, adjustmentOffset]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  return (
    <div className="space-y-6" data-testid="hijri-calendar-view">
      {/* Top Banner: Today's Date in Dual Formats */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-gold-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gold-400 text-xs font-serif font-bold uppercase tracking-wider">
            <Moon className="w-4 h-4" />
            <span>Islamic Hijri Calendar (التقويم الهجري)</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-normal" data-testid="hijri-calendar-mode-label">
              {adjustmentOffset === 0
                ? 'Astronomical Umm al-Qura Calculation'
                : `Locally Adjusted Moon Sighting (${adjustmentOffset > 0 ? `+${adjustmentOffset}` : adjustmentOffset}d)`}
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-gold-300 mt-1" data-testid="today-hijri-date">
            {todayHijri.formattedEn}
          </h2>
          <div className="font-quran text-xl text-slate-200 mt-1">
            {todayHijri.formattedAr}
          </div>
          <p className="text-xs text-slate-400 mt-1" data-testid="today-gregorian-date">
            Gregorian: {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        {/* Local Moon Sighting Adjustment Offset Selector */}
        <div className="px-4 py-3 rounded-2xl bg-gold-500/10 border border-gold-500/40 text-xs space-y-1.5 shadow-gold-sm">
          <div className="font-serif font-bold text-slate-200 flex items-center justify-between gap-2">
            <span>Local Moon Sighting Adjustment:</span>
            <span className="font-mono text-gold-400 font-bold">
              {adjustmentOffset > 0 ? `+${adjustmentOffset}` : adjustmentOffset} Day(s)
            </span>
          </div>
          <p className="text-[10px] text-slate-400">
            Adjust to match your local Hilal committee announcements.
          </p>
          <div className="flex items-center justify-center gap-1.5 pt-1">
            {[-2, -1, 0, 1, 2].map((offset) => (
              <button
                key={offset}
                onClick={() => setAdjustmentOffset(offset)}
                data-testid={`offset-btn-${offset}`}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  adjustmentOffset === offset
                    ? 'bg-gold-500 text-navy-950 shadow-gold-sm'
                    : 'bg-navy-950 text-slate-300 hover:text-gold-300 border border-gold-500/20'
                }`}
              >
                {offset > 0 ? `+${offset}` : offset}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-navy-800 pb-3">
        <button
          onClick={() => setActiveTab('month')}
          data-testid="tab-monthly-calendar"
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'month'
              ? 'bg-gold-500 text-navy-950 shadow-gold-sm'
              : 'bg-navy-900 text-slate-300 hover:text-gold-300 border border-gold-500/20'
          }`}
        >
          <CalendarIcon className="w-3.5 h-3.5" />
          <span>Monthly Calendar</span>
        </button>
        <button
          onClick={() => setActiveTab('ramadan')}
          data-testid="tab-ramadan-schedule"
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'ramadan'
              ? 'bg-gold-500 text-navy-950 shadow-gold-sm'
              : 'bg-navy-900 text-slate-300 hover:text-gold-300 border border-gold-500/20'
          }`}
        >
          <Moon className="w-3.5 h-3.5" />
          <span>Ramadan Fasting Timetable</span>
        </button>
        <button
          onClick={() => setActiveTab('events')}
          data-testid="tab-islamic-events"
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'events'
              ? 'bg-gold-500 text-navy-950 shadow-gold-sm'
              : 'bg-navy-900 text-slate-300 hover:text-gold-300 border border-gold-500/20'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Major Islamic Events</span>
        </button>
        <button
          onClick={() => setActiveTab('converter')}
          data-testid="tab-date-converter"
          className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'converter'
              ? 'bg-gold-500 text-navy-950 shadow-gold-sm'
              : 'bg-navy-900 text-slate-300 hover:text-gold-300 border border-gold-500/20'
          }`}
        >
          <Sun className="w-3.5 h-3.5" />
          <span>Date Converter</span>
        </button>
      </div>

      {/* Tab 1: Monthly Dual-Calendar Grid */}
      {activeTab === 'month' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-navy-900 border border-gold-500/30 shadow-xl space-y-4">
          {/* Month Selector Bar */}
          <div className="flex items-center justify-between pb-3 border-b border-navy-800">
            <button
              onClick={handlePrevMonth}
              title="Previous Month"
              className="p-2 rounded-xl bg-navy-950 border border-gold-500/30 text-slate-300 hover:text-gold-400 hover:border-gold-400 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="font-serif text-lg font-bold text-slate-100">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
            <button
              onClick={handleNextMonth}
              title="Next Month"
              className="p-2 rounded-xl bg-navy-950 border border-gold-500/30 text-slate-300 hover:text-gold-400 hover:border-gold-400 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center font-serif text-xs font-bold text-gold-400 py-1">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 text-xs">
            {/* Empty offset placeholders */}
            {Array.from({ length: calendarGrid.startingDayOfWeek }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-16 sm:h-20 rounded-xl bg-navy-950/40 opacity-20" />
            ))}

            {/* Days Cells */}
            {calendarGrid.days.map((d) => (
              <div
                key={d.gregorianDay}
                data-testid={`calendar-day-${d.gregorianDay}`}
                className={`h-16 sm:h-20 p-1.5 sm:p-2 rounded-xl border flex flex-col justify-between transition-all ${
                  d.isToday
                    ? 'bg-navy-800 border-gold-400 shadow-gold-sm ring-1 ring-gold-400/50'
                    : 'bg-navy-950/80 border-navy-800 hover:border-gold-500/40'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono font-bold text-xs sm:text-sm ${
                      d.isToday ? 'text-gold-300' : 'text-slate-200'
                    }`}
                  >
                    {d.gregorianDay}
                  </span>
                  {d.isToday && (
                    <span className="text-[9px] px-1 rounded bg-gold-500/20 text-gold-400 font-bold hidden sm:inline">
                      Today
                    </span>
                  )}
                </div>

                {/* Hijri Day & Month */}
                <div className="text-right">
                  <div className="font-mono text-xs font-bold text-gold-400">
                    {d.hijri.day}
                  </div>
                  <div className="text-[10px] text-slate-400 truncate">
                    {d.hijri.monthNameEn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Ramadan 30-Day Schedule */}
      {activeTab === 'ramadan' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-navy-900 border border-gold-500/30 shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 border-b border-navy-800 gap-4">
            <div>
              <h3 className="font-serif text-lg font-bold text-slate-100 flex items-center gap-2">
                <Moon className="w-5 h-5 text-gold-400" />
                <span>Holy Month of Ramadan Fasting Timetable — {todayHijri.year} AH</span>
              </h3>
              {ramadanStartDate ? (
                <>
                  <div className="flex flex-wrap items-center gap-2 mt-1 mb-1">
                    <span
                      data-testid="ramadan-date-type-badge"
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold ${
                        adjustmentOffset === 0
                          ? 'bg-blue-900/60 text-blue-200 border border-blue-500/30'
                          : 'bg-gold-500/20 text-gold-300 border border-gold-500/40'
                      }`}
                    >
                      {adjustmentOffset === 0
                        ? 'Astronomical / Umm al-Qura Baseline'
                        : `Locally Adjusted Moon Sighting (${adjustmentOffset > 0 ? `+${adjustmentOffset}` : adjustmentOffset} Day)`}
                    </span>
                    <span className="text-xs text-slate-400">
                      Umm al-Qura Baseline: <strong className="text-slate-300">Mon, Feb 8, 2027</strong>
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    1 Ramadan {todayHijri.year} AH begins {adjustmentOffset === 0 ? 'on' : 'locally adjusted to'}{' '}
                    <strong className="text-gold-300">
                      {ramadanStartDate.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </strong>{' '}
                    for <strong>{selectedLocation.name}, {selectedLocation.country}</strong> ({selectedLocation.timezone})
                  </p>
                </>
              ) : (
                <div
                  data-testid="ramadan-unavailable-state"
                  className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-xs text-red-300"
                >
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span>Astronomical Umm al-Qura lunar baseline unavailable for Hijri year {todayHijri.year} AH</span>
                </div>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                data-testid="ramadan-location-select"
                aria-label="Ramadan calculation city"
                className="bg-navy-950 border border-gold-500/30 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                {LOCATION_PRESETS.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}, {loc.country}
                  </option>
                ))}
              </select>

              <select
                value={selectedMethodId}
                onChange={(e) => setSelectedMethodId(Number(e.target.value))}
                data-testid="ramadan-method-select"
                aria-label="Ramadan prayer calculation method"
                className="bg-navy-950 border border-gold-500/30 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                {CALCULATION_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>

              <select
                value={selectedSchoolId}
                onChange={(e) => setSelectedSchoolId(Number(e.target.value))}
                data-testid="ramadan-school-select"
                aria-label="Ramadan Asr juristic school"
                className="bg-navy-950 border border-gold-500/30 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
              >
                {ASR_SCHOOLS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {ramadanStartDate ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-navy-950 text-gold-400 font-serif border-b border-navy-800">
                  <tr>
                    <th className="py-2.5 px-3">Ramadan</th>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Day</th>
                    <th className="py-2.5 px-3">Suhoor Ends (Imsak)</th>
                    <th className="py-2.5 px-3">Fajr</th>
                    <th className="py-2.5 px-3">Iftar (Maghrib)</th>
                    <th className="py-2.5 px-3">Fast Duration</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-855">
                  {ramadanSchedule.map((row) => (
                    <tr
                      key={row.ramadanDay}
                      data-testid={`ramadan-day-${row.ramadanDay}`}
                      className="hover:bg-navy-850/60 transition-colors"
                    >
                      <td className="py-2 px-3 font-bold text-gold-300 font-mono">Day {row.ramadanDay}</td>
                      <td className="py-2 px-3 text-slate-300">{row.gregorianDate}</td>
                      <td className="py-2 px-3 text-slate-400">{row.weekday}</td>
                      <td className="py-2 px-3 font-mono text-gold-400 font-semibold">{row.suhoorEnd}</td>
                      <td className="py-2 px-3 font-mono text-slate-200">{row.fajr}</td>
                      <td className="py-2 px-3 font-mono text-gold-400 font-semibold">{row.iftar}</td>
                      <td className="py-2 px-3 font-mono text-slate-300">{row.fastDuration}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-8 text-center space-y-2 bg-navy-955 rounded-2xl border border-red-500/20">
              <AlertCircle className="w-8 h-8 text-red-400 mx-auto" />
              <h4 className="text-sm font-bold text-slate-200">Ramadan Fasting Timetable Unavailable</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Astronomical lunar tables could not verify 1 Ramadan for {todayHijri.year} AH. A calculated timetable cannot be displayed without verified astronomical dates.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Major Islamic Events */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MAJOR_ISLAMIC_EVENTS.map((event) => (
            <div
              key={event.title}
              data-testid={`event-card-${event.title.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              className="p-5 rounded-2xl bg-navy-900 border border-gold-500/20 hover:border-gold-500/40 transition-all space-y-2 shadow-lg"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="font-serif font-bold text-slate-100 text-sm">{event.title}</h4>
                  <div className="font-quran text-gold-400 text-base">{event.arabicTitle}</div>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-gold-500/20 text-gold-300 border border-gold-500/30 whitespace-nowrap">
                  {event.hijriDate}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">{event.description}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab 4: Date Converter */}
      {activeTab === 'converter' && (
        <div className="p-5 sm:p-6 rounded-3xl bg-navy-900 border border-gold-500/30 shadow-xl space-y-6 max-w-2xl mx-auto">
          <div>
            <h3 className="font-serif text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sun className="w-5 h-5 text-gold-400" />
              <span>Gregorian to Islamic (Hijri) Date Converter</span>
            </h3>
            <p className="text-xs text-slate-400">
              Convert any historical or future Gregorian calendar date to its corresponding Islamic date.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Day:</label>
              <input
                type="number"
                min="1"
                max="31"
                value={convertDay}
                onChange={(e) => setConvertDay(parseInt(e.target.value, 10) || 1)}
                className="w-full bg-navy-950 border border-gold-500/30 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Month:</label>
              <select
                value={convertMonth}
                onChange={(e) => setConvertMonth(parseInt(e.target.value, 10))}
                className="w-full bg-navy-950 border border-gold-500/30 rounded-xl px-3 py-2 text-slate-200 focus:outline-none"
              >
                {monthNames.map((m, idx) => (
                  <option key={m} value={idx + 1}>
                    {m}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Year:</label>
              <input
                type="number"
                min="1900"
                max="2100"
                value={convertYear}
                onChange={(e) => setConvertYear(parseInt(e.target.value, 10) || 2026)}
                className="w-full bg-navy-950 border border-gold-500/30 rounded-xl px-3 py-2 text-slate-200 font-mono focus:outline-none"
              />
            </div>
          </div>

          {/* Converted Output Display */}
          <div className="p-4 rounded-2xl bg-gold-500/10 border border-gold-500/30 text-center space-y-1">
            <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Corresponding Islamic Date
            </div>
            <div className="text-2xl font-serif font-bold text-gold-300">
              {convertedHijri.formattedEn}
            </div>
            <div className="font-quran text-lg text-slate-200">
              {convertedHijri.formattedAr}
            </div>
            <div className="text-[11px] text-slate-400">
              Day of week: {convertedHijri.dayNameEn} ({convertedHijri.dayNameAr})
            </div>
          </div>
        </div>
      )}

      {/* Astronomical Moon Sighting Disclaimer */}
      <div
        data-testid="calendar-disclaimer-banner"
        className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-start space-x-3 leading-relaxed"
      >
        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300">Moon Sighting & Calendar Notice:</strong> Islamic months and religious observances (specifically Ramadan, Eid al-Fitr, and Eid al-Adha) are traditionally verified by physical moon sighting (Ru'yat al-Hilal). Astronomical calculations provide highly accurate predictive baselines, but do not replace or override officially declared sightings by your local Hilal committee.
        </div>
      </div>
    </div>
  );
};
