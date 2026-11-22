// ==============================================================================
// Prayer Notification & Azaan Controls Component (Command 4 Implementation)
// Pure separate component mounted in Islamic Tools Container.
// STRICT PRESERVATION: Does NOT modify existing PrayerTimesView or calculation code.
// Jafri Religious Books & Audio Platform
// ==============================================================================

import React, { useState, useEffect } from 'react';
import {
  Bell,
  BellOff,
  Volume2,
  VolumeX,
  Play,
  Square,
  Sparkles,
  Info,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import {
  prayerNotificationService,
  PrayerNotificationSettings,
} from '../../services/islamic/prayerNotificationService';

export const PrayerNotificationPanel: React.FC = () => {
  const [settings, setSettings] = useState<PrayerNotificationSettings>(
    prayerNotificationService.getSettings()
  );
  const [permission, setPermission] = useState<NotificationPermission>(
    prayerNotificationService.getNotificationPermission()
  );
  const [isPlayingAzaan, setIsPlayingAzaan] = useState<boolean>(
    prayerNotificationService.isFullAzaanPlaying()
  );
  const [activeAzaanName, setActiveAzaanName] = useState<string | null>(
    prayerNotificationService.getActiveAzaanPrayer()
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPlayingAzaan(prayerNotificationService.isFullAzaanPlaying());
      setActiveAzaanName(prayerNotificationService.getActiveAzaanPrayer());
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const updateSetting = <K extends keyof PrayerNotificationSettings>(
    key: K,
    val: PrayerNotificationSettings[K]
  ) => {
    const next = { ...settings, [key]: val };
    setSettings(next);
    prayerNotificationService.saveSettings(next);
  };

  const handleRequestPermission = async () => {
    const result = await prayerNotificationService.requestNotificationPermission();
    setPermission(result);
  };

  const handleTestChime = () => {
    prayerNotificationService.playNotificationChime();
  };

  const handlePlayAzaan = (type: 'Fajr' | 'Standard') => {
    if (isPlayingAzaan && activeAzaanName === type) {
      prayerNotificationService.stopFullAzaan();
      setIsPlayingAzaan(false);
      setActiveAzaanName(null);
    } else {
      prayerNotificationService.playFullAzaan(type);
      setIsPlayingAzaan(true);
      setActiveAzaanName(type);
    }
  };

  const handleStopAzaan = () => {
    prayerNotificationService.stopFullAzaan();
    setIsPlayingAzaan(false);
    setActiveAzaanName(null);
  };

  const prayers = [
    { key: 'fajr' as const, label: 'Fajr', arabic: 'الفجر', note: 'Includes As-Salatu Khayrum Minan-Nawm' },
    { key: 'dhuhr' as const, label: 'Dhuhr', arabic: 'الظهر', note: 'Midday Prayer' },
    { key: 'asr' as const, label: 'Asr', arabic: 'العصر', note: 'Afternoon Prayer' },
    { key: 'maghrib' as const, label: 'Maghrib', arabic: 'المغرب', note: 'Sunset Prayer' },
    { key: 'isha' as const, label: 'Isha', arabic: 'العشاء', note: 'Night Prayer' },
  ];

  return (
    <div
      data-testid="prayer-notification-panel"
      className="p-5 sm:p-6 rounded-3xl bg-navy-900 border border-gold-500/30 shadow-2xl space-y-6 text-slate-100"
    >
      {/* Header & Permission Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-navy-800">
        <div>
          <div className="flex items-center space-x-2 text-gold-400 text-xs font-serif font-bold uppercase tracking-wider">
            <Bell className="w-4 h-4" />
            <span>Prayer Notification & Azaan Engine</span>
          </div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-slate-100 mt-1">
            Prayer Timings Alerts & Manual Azaan
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Astronomically synchronized chime notification with authentic human Azaan recitations.
          </p>
        </div>

        {/* Browser Permission Badge / Button */}
        <div>
          {permission === 'granted' ? (
            <div
              data-testid="notification-permission-granted"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-semibold"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Browser Alerts: Granted</span>
            </div>
          ) : permission === 'denied' ? (
            <div
              data-testid="notification-permission-denied"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs font-semibold"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Alerts Blocked in Browser</span>
            </div>
          ) : (
            <button
              onClick={handleRequestPermission}
              data-testid="request-notification-btn"
              className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-xl bg-gold-500 text-navy-950 text-xs font-bold shadow hover:bg-gold-400 transition"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>Enable Browser Alerts</span>
            </button>
          )}
        </div>
      </div>

      {/* Master Toggle & Chime Test */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Master Enabled Card */}
        <div className="p-4 rounded-2xl bg-navy-950/80 border border-gold-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${settings.masterEnabled ? 'bg-gold-500 text-navy-950' : 'bg-slate-800 text-slate-400'}`}>
              {settings.masterEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Active Prayer Alerts</div>
              <div className="text-[11px] text-slate-400">Trigger notifications on prayer entry</div>
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={settings.masterEnabled}
              onChange={(e) => updateSetting('masterEnabled', e.target.checked)}
              data-testid="prayer-notification-master-toggle"
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gold-500"></div>
          </label>
        </div>

        {/* Short Chime Sound Card */}
        <div className="p-4 rounded-2xl bg-navy-950/80 border border-gold-500/20 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${settings.playShortChime ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'}`}>
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200">Short Notification Chime</div>
              <div className="text-[11px] text-slate-400">Gentle tone when prayer time starts</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleTestChime}
              data-testid="test-chime-btn"
              className="px-2.5 py-1 rounded-lg bg-navy-850 hover:bg-navy-800 border border-gold-500/30 text-[11px] text-gold-300 transition"
            >
              Test Chime
            </button>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.playShortChime}
                onChange={(e) => updateSetting('playShortChime', e.target.checked)}
                data-testid="prayer-notification-chime-toggle"
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Individual Prayer Notification Toggles */}
      <div>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Individual Prayer Alert Toggles
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
          {prayers.map((p) => {
            const isChecked = settings[p.key];
            return (
              <button
                key={p.key}
                type="button"
                onClick={() => updateSetting(p.key, !isChecked)}
                data-testid={`prayer-toggle-${p.key}`}
                className={`p-3 rounded-2xl border text-left transition-all ${
                  isChecked
                    ? 'bg-gold-500/15 border-gold-500/40 text-gold-300 shadow-sm'
                    : 'bg-navy-950/60 border-slate-800 text-slate-500 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-serif font-bold text-sm text-slate-200">{p.label}</span>
                  <span className="text-[10px] text-slate-400 font-serif">{p.arabic}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-[10px]">
                  <span className={isChecked ? 'text-gold-400 font-semibold' : 'text-slate-500'}>
                    {isChecked ? 'Enabled' : 'Muted'}
                  </span>
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isChecked ? 'bg-gold-400 animate-pulse' : 'bg-slate-700'
                    }`}
                  />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Authentic Human Azaan Playback Section */}
      <div className="p-4 sm:p-5 rounded-2xl bg-navy-950/90 border border-gold-500/30 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-gold-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Authentic Human Azaan (Manual Listening)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Studio recordings by prominent reciters. Azaan is strictly played on manual demand.
            </p>
          </div>

          {/* Volume Control */}
          <div className="flex items-center space-x-2 text-xs">
            {settings.fullAzaanVolume === 0 ? (
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-gold-400" />
            )}
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.fullAzaanVolume}
              onChange={(e) => {
                const vol = parseFloat(e.target.value);
                prayerNotificationService.setFullAzaanVolume(vol);
                setSettings({ ...settings, fullAzaanVolume: vol });
              }}
              data-testid="azaan-volume-slider"
              className="w-20 accent-gold-500 cursor-pointer"
            />
            <span className="font-mono text-[10px] text-slate-400 w-8">
              {Math.round(settings.fullAzaanVolume * 100)}%
            </span>
          </div>
        </div>

        {/* Azaan Playback Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Fajr Azaan Button */}
          <div className="p-3 rounded-xl bg-navy-900 border border-gold-500/20 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-200">Fajr Azaan (Sheikh Mishary Alafasy)</div>
              <div className="text-[10px] text-slate-400">Features "الصلاة خير من النوم"</div>
            </div>
            <button
              onClick={() => handlePlayAzaan('Fajr')}
              data-testid="play-fajr-azaan-btn"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                isPlayingAzaan && activeAzaanName === 'Fajr'
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40'
              }`}
            >
              {isPlayingAzaan && activeAzaanName === 'Fajr' ? (
                <>
                  <Square className="w-3 h-3 fill-current" />
                  <span>Stop Azaan</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>Play Fajr Azaan</span>
                </>
              )}
            </button>
          </div>

          {/* Standard Azaan Button */}
          <div className="p-3 rounded-xl bg-navy-900 border border-gold-500/20 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-200">Standard Azaan (Sheikh Nasser Al-Qatami)</div>
              <div className="text-[10px] text-slate-400">For Dhuhr, Asr, Maghrib & Isha</div>
            </div>
            <button
              onClick={() => handlePlayAzaan('Standard')}
              data-testid="play-standard-azaan-btn"
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition ${
                isPlayingAzaan && activeAzaanName === 'Standard'
                  ? 'bg-rose-600 text-white shadow'
                  : 'bg-gold-500/20 hover:bg-gold-500/30 text-gold-300 border border-gold-500/40'
              }`}
            >
              {isPlayingAzaan && activeAzaanName === 'Standard' ? (
                <>
                  <Square className="w-3 h-3 fill-current" />
                  <span>Stop Azaan</span>
                </>
              ) : (
                <>
                  <Play className="w-3 h-3 fill-current" />
                  <span>Play Standard Azaan</span>
                </>
              )}
            </button>
          </div>
        </div>

        {isPlayingAzaan && (
          <div className="p-2.5 rounded-xl bg-gold-500/15 border border-gold-500/40 text-gold-300 text-xs flex items-center justify-between">
            <span className="flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
              <span>Playing {activeAzaanName} Azaan...</span>
            </span>
            <button
              onClick={handleStopAzaan}
              data-testid="stop-active-azaan-btn"
              className="text-[11px] underline hover:text-white"
            >
              Stop Playback
            </button>
          </div>
        )}
      </div>

      {/* Mandatory Closed-Browser Limitation & Technical Notice */}
      <div
        data-testid="prayer-notification-limitations-notice"
        className="p-3.5 rounded-2xl bg-navy-950/60 border border-slate-800 text-[11px] text-slate-400 space-y-1.5 leading-relaxed"
      >
        <div className="flex items-center space-x-2 text-slate-300 font-semibold">
          <Info className="w-3.5 h-3.5 text-gold-400" />
          <span>Browser Notification Architecture & Limitations</span>
        </div>
        <p>
          • <strong>Active/Background Tab:</strong> Notifications and short chime audio will trigger reliably while this tab remains open or minimized in your desktop or mobile browser.
        </p>
        <p>
          • <strong>Closed Browser Limitation:</strong> In accordance with W3C web standards, web applications cannot wake up a completely closed browser or mobile device without a registered Web Push service worker and server infrastructure.
        </p>
        <p>
          • <strong>Zero Autoplay Rule:</strong> In compliance with browser sound policies and Islamic reverence guidelines, the full Azaan will never autoplay without explicit user initiation.
        </p>
      </div>
    </div>
  );
};
