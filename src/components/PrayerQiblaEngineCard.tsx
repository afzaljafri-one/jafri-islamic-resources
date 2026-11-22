import React, { useState, useEffect } from 'react';
import { ummahApi } from '../services/ummahApi';
import { calculateOfflinePrayerTimes } from '../services/offlinePrayerCalc';
import { PrayerTimesApiResponse } from '../types/islamicServices';
import { CALCULATION_METHODS, ASR_SCHOOLS, DEFAULT_PREFERENCES } from '../types/settings';
import {
  ShieldCheck,
  Compass,
  Clock,
  AlertTriangle,
  CheckCircle,
  Zap,
} from 'lucide-react';

export const PrayerQiblaEngineCard: React.FC = () => {
  const [methodId, setMethodId] = useState<number>(DEFAULT_PREFERENCES.method); // Default 1 (Karachi)
  const [schoolId, setSchoolId] = useState<number>(DEFAULT_PREFERENCES.school); // Default 2 (Hanafi)
  const [prayerData, setPrayerData] = useState<PrayerTimesApiResponse | null>(null);
  const [, setLoading] = useState<boolean>(true);
  const [providerSource, setProviderSource] = useState<'ummahapi' | 'offline'>('ummahapi');
  const [qiblaDegrees, setQiblaDegrees] = useState<number>(266.6);

  const loadPrayerTimes = async () => {
    setLoading(true);
    const selectedMethod = CALCULATION_METHODS.find((m) => m.id === methodId);
    const selectedSchool = ASR_SCHOOLS.find((s) => s.id === schoolId);

    const methodKey = selectedMethod?.key || 'Karachi';
    const schoolKey = selectedSchool?.key || 'Hanafi';

    try {
      // Primary: UmmahAPI (Zero-Key Public Endpoint)
      const liveData = await ummahApi.getPrayerTimes(
        DEFAULT_PREFERENCES.latitude,
        DEFAULT_PREFERENCES.longitude,
        'Asia/Kolkata',
        methodKey,
        schoolKey
      );

      // Fetch Qibla from UmmahAPI
      try {
        const qibla = await ummahApi.getQibla(DEFAULT_PREFERENCES.latitude, DEFAULT_PREFERENCES.longitude);
        setQiblaDegrees(qibla.direction.degrees);
      } catch {
        setQiblaDegrees(266.6);
      }

      setPrayerData(liveData);
      setProviderSource('ummahapi');
    } catch {
      // Offline Astronomical Engine Fallback (Adhan-JS)
      const offlineData = calculateOfflinePrayerTimes(
        DEFAULT_PREFERENCES.latitude,
        DEFAULT_PREFERENCES.longitude,
        methodId,
        schoolId
      );
      setPrayerData(offlineData);
      setProviderSource('offline');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrayerTimes();
  }, [methodId, schoolId]);

  return (
    <div className="rounded-2xl bg-navy-900 border border-gold-500/30 p-5 lg:p-6 shadow-xl space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-navy-800 gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-serif font-bold text-slate-100 flex items-center gap-2">
              Prayer Timings & Qibla Engine
              <span
                className={`text-[11px] font-sans font-semibold px-2 py-0.5 rounded-full border ${
                  providerSource === 'ummahapi'
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                    : 'bg-amber-950 text-amber-400 border-amber-500/40'
                }`}
              >
                {providerSource === 'ummahapi' ? 'UmmahAPI (Primary Live)' : 'Adhan-JS (Offline Fallback)'}
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Zero-key public API • Karachi & Jafari calculation standards • Adhan-JS astronomical offline fallback
            </p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center space-x-2">
          <span className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-xs font-semibold">
            <Zap className="w-3.5 h-3.5" />
            <span>UmmahAPI Zero-Key Live</span>
          </span>
        </div>
      </div>

      {/* Migration Notice */}
      <div className="p-3.5 rounded-xl bg-navy-950/90 border border-gold-500/30 text-xs text-slate-300 space-y-1">
        <div className="flex items-center space-x-2 font-bold text-gold-400">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>Architecture Upgrade: UmmahAPI Adopted as Primary Provider</span>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed">
          UmmahAPI provides direct unauthenticated access (5,000 requests / 15 min) for prayer calculations. The previous IslamicAPI proxy requirement has been retired in favor of this direct, reliable architecture, with Adhan-JS retained as the zero-network astronomical fallback.
        </p>
      </div>

      {/* Settings Selector */}
      <div className="p-4 rounded-xl bg-navy-950/60 border border-gold-500/20 space-y-3">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
              Calculation Settings (India Defaults)
            </span>
            <p className="text-[11px] text-slate-400">
              Method 1 (Karachi) & School 2 (Hanafi) defaulted. Jafari (Method 0) and Shafi (School 1) switchable anytime.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Method Selector */}
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-slate-400">Method:</span>
              <select
                value={methodId}
                onChange={(e) => setMethodId(Number(e.target.value))}
                className="bg-navy-900 border border-gold-500/40 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-gold-400"
              >
                {CALCULATION_METHODS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name} {m.id === 1 ? '(India Default)' : m.id === 0 ? '(Jafari)' : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Asr School Selector */}
            <div className="flex items-center space-x-1.5 text-xs">
              <span className="text-slate-400">Asr School:</span>
              <select
                value={schoolId}
                onChange={(e) => setSchoolId(Number(e.target.value))}
                className="bg-navy-900 border border-gold-500/40 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-gold-400"
              >
                {ASR_SCHOOLS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} {s.id === 2 ? '(India Default: 2x shadow)' : '(1x shadow)'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Prayer Times Grid */}
      {prayerData && (
        <div className="space-y-4">
          {/* Offline Disclaimer (if offline engine active) */}
          {providerSource === 'offline' && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 flex items-start space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Offline Astronomical Fallback Active:</strong> Calculated locally via astronomical formulas. Actual timings may vary by ±2-3 minutes due to terrain or local mosque conventions.
              </span>
            </div>
          )}

          {/* Timings Display Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {[
              { name: 'Fajr', time: prayerData.data.times.Fajr, desc: 'Dawn / Subh Sadiq' },
              { name: 'Sunrise', time: prayerData.data.times.Sunrise, desc: 'Ishraq begins' },
              { name: 'Dhuhr', time: prayerData.data.times.Dhuhr, desc: 'Solar noon' },
              {
                name: 'Asr',
                time: prayerData.data.times.Asr,
                desc: schoolId === 2 ? 'Hanafi (2x shadow)' : 'Shafi (1x shadow)',
              },
              { name: 'Sunset', time: prayerData.data.times.Sunset, desc: 'Maghrib starts' },
              {
                name: 'Maghrib',
                time: prayerData.data.times.Maghrib,
                desc: methodId === 0 ? 'Jafari twilight' : 'Post-sunset',
              },
              { name: 'Isha', time: prayerData.data.times.Isha, desc: 'Night prayer' },
            ].map((p) => (
              <div
                key={p.name}
                className="p-3 rounded-xl bg-navy-950/70 border border-gold-500/20 text-center hover:border-gold-500/40 transition-colors"
              >
                <span className="text-[11px] font-bold text-gold-400 uppercase tracking-wider">{p.name}</span>
                <div className="text-lg font-mono font-bold text-slate-100 my-1">{p.time}</div>
                <span className="text-[10px] text-slate-400 leading-tight block">{p.desc}</span>
              </div>
            ))}
          </div>

          {/* Qibla Direction & Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-navy-950/50 border border-gold-500/15 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200">Qibla Direction (from Delhi)</span>
                  <p className="text-[11px] text-slate-400">Bearing clockwise from True North</p>
                </div>
              </div>
              <div className="text-right">
                <span className="text-base font-mono font-bold text-gold-400">{qiblaDegrees}°</span>
                <span className="text-[10px] text-slate-400 block">West-Southwest</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-navy-950/50 border border-gold-500/15 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-navy-800 border border-gold-500/30 flex items-center justify-center text-gold-400">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-200">Active Calculation Method</span>
                  <p className="text-[11px] text-slate-400">
                    {CALCULATION_METHODS.find((m) => m.id === methodId)?.name}
                  </p>
                </div>
              </div>
              <div className="text-right text-[11px] font-mono text-slate-300">
                <div>Imsak: {prayerData.data.times.Imsak || '05:13'}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export const IslamicApiSecurityCard = PrayerQiblaEngineCard;
