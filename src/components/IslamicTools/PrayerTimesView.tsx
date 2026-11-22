import React, { useState, useMemo } from 'react';
import {
  Clock,
  MapPin,
  AlertCircle,
  Calendar,
  Settings2,
} from 'lucide-react';
import { calculatePrayerTimes } from '../../services/islamic/prayerService';
import { LOCATION_PRESETS, DEFAULT_LOCATION } from '../../services/islamic/locationPresets';
import { CALCULATION_METHODS, ASR_SCHOOLS } from '../../types/settings';

export const PrayerTimesView: React.FC = () => {
  const [selectedLocationId, setSelectedLocationId] = useState<string>(DEFAULT_LOCATION.id);
  const [customLat, setCustomLat] = useState<number>(DEFAULT_LOCATION.latitude);
  const [customLng, setCustomLng] = useState<number>(DEFAULT_LOCATION.longitude);
  const [customTimezone, setCustomTimezone] = useState<string>(
    Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata'
  );
  const [isCustomCoords, setIsCustomCoords] = useState<boolean>(false);
  const [methodId, setMethodId] = useState<number>(1); // Karachi Default (India / Pakistan)
  const [schoolId, setSchoolId] = useState<number>(2); // Hanafi Default (2x shadow)

  // Current selected location object
  const location = useMemo(() => {
    if (isCustomCoords) {
      return {
        id: 'custom',
        name: `Custom (${customLat.toFixed(2)}°, ${customLng.toFixed(2)}°)`,
        country: 'Custom Coordinates',
        latitude: customLat,
        longitude: customLng,
        timezone: customTimezone,
      };
    }
    return (
      LOCATION_PRESETS.find((l) => l.id === selectedLocationId) || DEFAULT_LOCATION
    );
  }, [selectedLocationId, isCustomCoords, customLat, customLng, customTimezone]);

  // Calculated prayer times
  const prayerData = useMemo(() => {
    return calculatePrayerTimes(
      location.latitude,
      location.longitude,
      methodId,
      schoolId,
      new Date(),
      `${location.name}, ${location.country}`,
      location.timezone
    );
  }, [location, methodId, schoolId]);

  const prayers = [
    { name: 'Fajr', ar: 'الفجر', time: prayerData.fajr, desc: 'Dawn until sunrise' },
    { name: 'Sunrise', ar: 'الشروق', time: prayerData.sunrise, desc: 'Prohibited for prayer' },
    { name: 'Dhuhr', ar: 'الظهر', time: prayerData.dhuhr, desc: 'After zenith until shadow equals object' },
    { name: 'Asr', ar: 'العصر', time: prayerData.asr, desc: schoolId === 2 ? 'Hanafi (2x shadow)' : 'Shafi/Standard (1x shadow)' },
    { name: 'Sunset', ar: 'الغروب', time: prayerData.sunset, desc: 'Solar disk disappears' },
    { name: 'Maghrib', ar: 'المغرب', time: prayerData.maghrib, desc: 'Dusk until twilight fades' },
    { name: 'Isha', ar: 'العشاء', time: prayerData.isha, desc: 'Night until Islamic midnight' },
  ];

  return (
    <div className="space-y-6" data-testid="prayer-times-view">
      {/* Top Banner: Location & Date Overview */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 border border-gold-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-gold-400 text-xs font-serif font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4" />
            <span>Islamic Prayer Timings</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-300 font-normal">{prayerData.hijriDateReadable}</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-slate-100 mt-1">
            {location.name}, <span className="text-gold-400">{location.country}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{prayerData.dateReadable}</p>
        </div>

        {/* Next Prayer Countdown Pill */}
        {prayerData.nextPrayer && (
          <div
            data-testid="next-prayer-badge"
            className="px-4 py-2.5 rounded-2xl bg-gold-500/10 border border-gold-500/40 flex items-center space-x-3 text-xs shadow-gold-sm"
          >
            <div className="w-8 h-8 rounded-xl bg-gold-500 text-navy-950 flex items-center justify-center font-bold font-mono">
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                Next Prayer
              </div>
              <div className="text-sm font-bold text-gold-300 font-serif">
                {prayerData.nextPrayer.name} at {prayerData.nextPrayer.time}
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                in {prayerData.nextPrayer.timeRemainingFormatted}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Main Grid: Prayers Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3">
        {prayers.map((p) => {
          const isNext = prayerData.nextPrayer?.name.includes(p.name);
          return (
            <div
              key={p.name}
              data-testid={`prayer-card-${p.name.toLowerCase()}`}
              className={`p-4 rounded-2xl border transition-all ${
                isNext
                  ? 'bg-navy-800 border-gold-400 shadow-gold-sm ring-1 ring-gold-400/50'
                  : 'bg-navy-900/90 border-gold-500/20 hover:border-gold-500/40'
              }`}
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold text-slate-200">{p.name}</span>
                <span className="font-quran text-gold-400 text-sm">{p.ar}</span>
              </div>
              <div
                className="text-2xl font-bold font-mono text-slate-100 mt-2 tracking-tight"
                data-testid={`prayer-time-${p.name.toLowerCase()}`}
              >
                {p.time}
              </div>
              <div className="text-[10px] text-slate-400 mt-1 truncate" title={p.desc}>
                {p.desc}
              </div>
            </div>
          );
        })}
      </div>

      {/* Secondary Times & Prohibited Periods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Imsak & Midnight */}
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold-500/20 text-xs space-y-2">
          <div className="font-serif font-bold text-slate-200 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gold-400" />
            <span>Fasting & Tahajjud Reference</span>
          </div>
          <div className="flex justify-between border-b border-navy-800 pb-1.5 text-slate-300">
            <span>Imsak (Stop Suhoor):</span>
            <span className="font-mono font-bold text-gold-400">{prayerData.imsak}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Islamic Midnight:</span>
            <span className="font-mono font-bold text-gold-400">{prayerData.midnight}</span>
          </div>
        </div>

        {/* Calculation Settings Display */}
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold-500/20 text-xs space-y-2">
          <div className="font-serif font-bold text-slate-200 flex items-center gap-1.5">
            <Settings2 className="w-3.5 h-3.5 text-gold-400" />
            <span>Active Calculation Convention</span>
          </div>
          <div className="flex justify-between border-b border-navy-800 pb-1.5 text-slate-300">
            <span>Method:</span>
            <span className="text-gold-300 font-medium truncate max-w-[180px]">{prayerData.methodName}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Asr School:</span>
            <span className="text-gold-300 font-medium">{prayerData.schoolName}</span>
          </div>
        </div>

        {/* Coordinates Info */}
        <div className="p-4 rounded-2xl bg-navy-900/80 border border-gold-500/20 text-xs space-y-2">
          <div className="font-serif font-bold text-slate-200 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-gold-400" />
            <span>Geographic Position</span>
          </div>
          <div className="flex justify-between border-b border-navy-800 pb-1.5 text-slate-300">
            <span>Latitude / Longitude:</span>
            <span className="font-mono text-slate-200">{location.latitude.toFixed(4)}°, {location.longitude.toFixed(4)}°</span>
          </div>
          {/* Timezone Info */}
          <div className="flex justify-between text-slate-300">
            <span>Timezone:</span>
            <span className="font-mono text-slate-200" data-testid="prayer-timezone-display">{location.timezone}</span>
          </div>
        </div>
      </div>

      {/* Interactive Controls Bar: Manual Location & Method Selection */}
      <div className="p-5 rounded-2xl bg-navy-900 border border-gold-500/30 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-navy-800 text-xs">
          <span className="font-serif font-bold text-slate-100 flex items-center gap-2">
            <Settings2 className="w-4 h-4 text-gold-400" />
            <span>Adjust Location & Calculation Parameters</span>
          </span>
          <span className="text-[11px] text-slate-400">Manual Selection (Zero Tracking)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Preset Location Dropdown */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Select City Preset:</label>
            <select
              value={isCustomCoords ? 'custom' : selectedLocationId}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setIsCustomCoords(true);
                } else {
                  setIsCustomCoords(false);
                  setSelectedLocationId(e.target.value);
                }
              }}
              data-testid="location-preset-select"
              className="w-full bg-navy-950 border border-gold-500/30 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-400"
            >
              {LOCATION_PRESETS.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}, {loc.country}
                </option>
              ))}
              <option value="custom">-- Enter Custom Coordinates --</option>
            </select>
          </div>

          {/* Calculation Method */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Calculation Method:</label>
            <select
              value={methodId}
              onChange={(e) => setMethodId(Number(e.target.value))}
              data-testid="calculation-method-select"
              className="w-full bg-navy-950 border border-gold-500/30 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-400 truncate"
            >
              {CALCULATION_METHODS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>

          {/* Asr Jurisprudence */}
          <div>
            <label className="block text-slate-400 mb-1 font-medium">Asr Jurisprudence (Madhab):</label>
            <select
              value={schoolId}
              onChange={(e) => setSchoolId(Number(e.target.value))}
              data-testid="asr-school-select"
              className="w-full bg-navy-950 border border-gold-500/30 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-gold-400"
            >
              {ASR_SCHOOLS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.id === 2 ? '2x shadow' : '1x shadow'})
                </option>
              ))}
            </select>
          </div>

          {/* Active Timezone Badge in standard controls */}
          <div className="flex flex-col justify-end">
            <span className="text-slate-400 mb-1 font-medium">Target Timezone:</span>
            <div className="w-full bg-navy-950 border border-gold-500/30 rounded-xl px-3 py-2 text-gold-300 font-mono text-xs truncate">
              {location.timezone}
            </div>
          </div>
        </div>

        {/* Custom Coordinates & Timezone Inputs */}
        {isCustomCoords && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-navy-800 text-xs">
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Custom Latitude:</label>
              <input
                type="number"
                step="0.0001"
                value={customLat}
                onChange={(e) => setCustomLat(parseFloat(e.target.value) || 0)}
                data-testid="custom-lat-input"
                className="w-full bg-navy-950 border border-gold-500/30 rounded-xl px-2.5 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-gold-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Custom Longitude:</label>
              <input
                type="number"
                step="0.0001"
                value={customLng}
                onChange={(e) => setCustomLng(parseFloat(e.target.value) || 0)}
                data-testid="custom-lng-input"
                className="w-full bg-navy-950 border border-gold-500/30 rounded-xl px-2.5 py-2 text-slate-200 font-mono text-xs focus:outline-none focus:border-gold-400"
              />
            </div>
            <div>
              <label className="block text-slate-400 mb-1 font-medium">Target Timezone (IANA):</label>
              <select
                value={customTimezone}
                onChange={(e) => setCustomTimezone(e.target.value)}
                data-testid="custom-timezone-select"
                className="w-full bg-navy-950 border border-gold-500/30 rounded-xl px-2.5 py-2 text-slate-200 text-xs focus:outline-none focus:border-gold-400"
              >
                <option value="Asia/Kolkata">Asia/Kolkata (IST, UTC+5:30)</option>
                <option value="Asia/Karachi">Asia/Karachi (PKT, UTC+5:00)</option>
                <option value="Asia/Dhaka">Asia/Dhaka (BST, UTC+6:00)</option>
                <option value="Asia/Riyadh">Asia/Riyadh (AST, UTC+3:00)</option>
                <option value="Asia/Dubai">Asia/Dubai (GST, UTC+4:00)</option>
                <option value="Asia/Tehran">Asia/Tehran (IRST, UTC+3:30)</option>
                <option value="Europe/London">Europe/London (GMT/BST)</option>
                <option value="Europe/Paris">Europe/Paris (CET, UTC+1:00)</option>
                <option value="Europe/Istanbul">Europe/Istanbul (TRT, UTC+3:00)</option>
                <option value="America/New_York">America/New_York (EST/EDT)</option>
                <option value="America/Chicago">America/Chicago (CST/CDT)</option>
                <option value="America/Los_Angeles">America/Los_Angeles (PST/PDT)</option>
                <option value="America/Toronto">America/Toronto (EST/EDT)</option>
                <option value="Asia/Kuala_Lumpur">Asia/Kuala_Lumpur (MYT, UTC+8:00)</option>
                <option value="Asia/Jakarta">Asia/Jakarta (WIB, UTC+7:00)</option>
                <option value="Australia/Sydney">Australia/Sydney (AEST/AEDT)</option>
                <option value="UTC">UTC (Universal Coordinated Time)</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Mandatory Astronomical Disclaimer */}
      <div
        data-testid="prayer-disclaimer-banner"
        className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/30 text-amber-200 text-xs flex items-start space-x-3 leading-relaxed"
      >
        <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300">Astronomical Calculation Notice:</strong> {prayerData.disclaimer}
        </div>
      </div>
    </div>
  );
};
