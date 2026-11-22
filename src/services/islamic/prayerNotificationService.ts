// ==============================================================================
// Prayer Notification & Azaan Service (Command 4 Implementation)
// Pure separate service managing verified prayer notifications and authentic Azaan audio.
// STRICT PRESERVATION: Does NOT modify prayer calculation logic or Islamic storage keys.
// Jafri Religious Books & Audio Platform
// ==============================================================================

export interface PrayerNotificationSettings {
  masterEnabled: boolean;
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
  playShortChime: boolean;
  fullAzaanVolume: number; // 0.0 to 1.0
  lastNotified: Record<string, string>; // e.g. { "Fajr": "2026-11-17" }
}

const STORAGE_KEY = 'jafri_platform_prayer_notifications_v1';

const DEFAULT_SETTINGS: PrayerNotificationSettings = {
  masterEnabled: true,
  fajr: true,
  dhuhr: true,
  asr: true,
  maghrib: true,
  isha: true,
  playShortChime: true,
  fullAzaanVolume: 0.8,
  lastNotified: {},
};

export const AZAAN_AUDIO_URLS = {
  fajr: 'https://archive.org/download/adhan.notifications/Mishary_Rashid_al_Afasy_Fajr_Adhan.mp3',
  standard: 'https://archive.org/download/adhan.notifications/Nasser_al_Qatami_Adhan.mp3',
};

class PrayerNotificationService {
  private fullAzaanAudio: HTMLAudioElement | null = null;
  private isAzaanActive: boolean = false;
  private activePrayerAzaan: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.fullAzaanAudio = new Audio();
      this.fullAzaanAudio.addEventListener('ended', () => {
        this.isAzaanActive = false;
        this.activePrayerAzaan = null;
      });
      this.fullAzaanAudio.addEventListener('pause', () => {
        this.isAzaanActive = false;
      });
    }
  }

  public getSettings(): PrayerNotificationSettings {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        this.saveSettings(DEFAULT_SETTINGS);
        return DEFAULT_SETTINGS;
      }
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  }

  public saveSettings(settings: PrayerNotificationSettings): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch (err) {
      console.warn('Failed to save prayer notification settings:', err);
    }
  }

  public async requestNotificationPermission(): Promise<NotificationPermission> {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    try {
      return await Notification.requestPermission();
    } catch {
      return 'denied';
    }
  }

  public getNotificationPermission(): NotificationPermission {
    if (typeof window === 'undefined' || !('Notification' in window)) {
      return 'denied';
    }
    return Notification.permission;
  }

  /**
   * Plays a gentle, two-tone notification chime via Web Audio API.
   * Completely local, zero network latency, non-intrusive.
   */
  public playNotificationChime(): void {
    if (typeof window === 'undefined') return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();

      const playTone = (freq: number, start: number, dur: number) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);

        gain.gain.setValueAtTime(0.01, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + dur);
      };

      // Play C5 (523Hz) then E5 (659Hz)
      playTone(523.25, 0, 0.4);
      playTone(659.25, 0.3, 0.5);
    } catch (e) {
      console.warn('Web Audio chime could not play:', e);
    }
  }

  /**
   * Manual action to play authentic full Azaan recording.
   * NEVER triggered automatically without user consent.
   */
  public playFullAzaan(prayerName: string): void {
    if (!this.fullAzaanAudio) return;
    const settings = this.getSettings();
    const isFajr = prayerName.toLowerCase().includes('fajr');
    const url = isFajr ? AZAAN_AUDIO_URLS.fajr : AZAAN_AUDIO_URLS.standard;

    this.fullAzaanAudio.src = url;
    this.fullAzaanAudio.volume = settings.fullAzaanVolume;
    this.fullAzaanAudio
      .play()
      .then(() => {
        this.isAzaanActive = true;
        this.activePrayerAzaan = prayerName;
      })
      .catch((err) => {
        console.warn('Full Azaan playback prevented:', err);
      });
  }

  public stopFullAzaan(): void {
    if (this.fullAzaanAudio) {
      this.fullAzaanAudio.pause();
      this.fullAzaanAudio.currentTime = 0;
      this.isAzaanActive = false;
      this.activePrayerAzaan = null;
    }
  }

  public setFullAzaanVolume(volume: number): void {
    const settings = this.getSettings();
    settings.fullAzaanVolume = Math.max(0, Math.min(1, volume));
    this.saveSettings(settings);
    if (this.fullAzaanAudio) {
      this.fullAzaanAudio.volume = settings.fullAzaanVolume;
    }
  }

  public isFullAzaanPlaying(): boolean {
    return this.isAzaanActive;
  }

  public getActiveAzaanPrayer(): string | null {
    return this.activePrayerAzaan;
  }

  /**
   * Checks current clock time against calculated prayer times.
   * Handles timezone conversion, notification dispatch, and duplicate prevention.
   */
  public checkPrayerTime(
    prayerTimes: {
      fajr: string;
      dhuhr: string;
      asr: string;
      maghrib: string;
      isha: string;
    },
    timezone: string,
    onPrayerDue?: (prayerName: string, time: string) => void
  ): string | null {
    const settings = this.getSettings();
    if (!settings.masterEnabled) return null;

    // Get current time formatted in target timezone HH:mm
    const now = new Date();
    const targetDateStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(now); // e.g. "2026-11-17"

    const targetTimeStr = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(now); // e.g. "05:12" or "12:30"

    const prayerSchedule: Array<{ name: string; key: keyof PrayerNotificationSettings; time: string }> = [
      { name: 'Fajr', key: 'fajr', time: prayerTimes.fajr },
      { name: 'Dhuhr', key: 'dhuhr', time: prayerTimes.dhuhr },
      { name: 'Asr', key: 'asr', time: prayerTimes.asr },
      { name: 'Maghrib', key: 'maghrib', time: prayerTimes.maghrib },
      { name: 'Isha', key: 'isha', time: prayerTimes.isha },
    ];

    for (const prayer of prayerSchedule) {
      // Check if user has enabled this prayer
      if (!settings[prayer.key]) continue;

      // Extract 24h format from prayer time string (e.g., "05:15 AM" -> "05:15", "05:15" -> "05:15")
      const normalizedPrayerTime = this.normalizeTime(prayer.time);
      if (normalizedPrayerTime === targetTimeStr) {
        const lastNotifiedDate = settings.lastNotified[prayer.name];
        if (lastNotifiedDate !== targetDateStr) {
          // Mark notified to prevent duplicate triggering
          settings.lastNotified[prayer.name] = targetDateStr;
          this.saveSettings(settings);

          // Play short chime tone if enabled
          if (settings.playShortChime) {
            this.playNotificationChime();
          }

          // Dispatch native browser notification if granted
          if (this.getNotificationPermission() === 'granted') {
            try {
              const rawBase = (typeof import.meta !== 'undefined' && (import.meta as any).env?.BASE_URL) || '/';
              const baseUrl = rawBase === '/' ? '' : rawBase.replace(/\/$/, '');
              new Notification(`🕌 Time for ${prayer.name} Prayer`, {
                body: `It is now time for ${prayer.name} (${prayer.time}) in ${timezone}.`,
                icon: `${baseUrl}/favicon.svg`,
              });
            } catch (err) {
              console.warn('Browser notification error:', err);
            }
          }

          if (onPrayerDue) {
            onPrayerDue(prayer.name, prayer.time);
          }
          return prayer.name;
        }
      }
    }

    return null;
  }

  private normalizeTime(timeStr: string): string {
    if (!timeStr) return '';
    const parts = timeStr.trim().split(' ');
    const [hh, mm] = parts[0].split(':');
    let hours = parseInt(hh, 10);
    const minutes = mm || '00';

    if (parts.length > 1) {
      const meridiem = parts[1].toUpperCase();
      if (meridiem === 'PM' && hours < 12) hours += 12;
      if (meridiem === 'AM' && hours === 12) hours = 0;
    }
    return `${String(hours).padStart(2, '0')}:${minutes}`;
  }
}

export const prayerNotificationService = new PrayerNotificationService();
