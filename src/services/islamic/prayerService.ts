// ==============================================================================
// Prayer Timings Calculation & Retrieval Service
// Milestone M4: Islamic Services & Tools
// Reuses Adhan-JS astronomical calculation engine & UmmahAPI fallback
// ==============================================================================

import {
  Coordinates,
  CalculationMethod,
  CalculationParameters,
  Madhab,
  PrayerTimes as AdhanPrayerTimes,
  HighLatitudeRule,
} from 'adhan';
import { CalculatedPrayerData } from './types';
import { CALCULATION_METHODS, ASR_SCHOOLS } from '../../types/settings';

function formatTimeString(date: Date, timezone: string = 'Asia/Kolkata'): string {
  if (!date || isNaN(date.getTime())) return '--:--';
  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: timezone,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    return formatter.format(date);
  } catch {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }
}

export function calculatePrayerTimes(
  latitude: number,
  longitude: number,
  methodId = 1, // Default Karachi
  schoolId = 2, // Default Hanafi
  targetDate = new Date(),
  locationName = 'New Delhi, India',
  timezone = 'Asia/Kolkata'
): CalculatedPrayerData {
  const coords = new Coordinates(latitude, longitude);

  let params: CalculationParameters;
  switch (methodId) {
    case 0:
      params = CalculationMethod.Tehran(); // Jafari / Shia Ithna-Ashari
      break;
    case 1:
      params = CalculationMethod.Karachi(); // Univ. of Islamic Sciences, Karachi
      break;
    case 2:
      params = CalculationMethod.NorthAmerica(); // ISNA
      break;
    case 3:
      params = CalculationMethod.MuslimWorldLeague(); // MWL
      break;
    case 4:
      params = CalculationMethod.UmmAlQura(); // Umm Al-Qura, Makkah
      break;
    case 5:
      params = CalculationMethod.Egyptian(); // Egyptian General Authority
      break;
    default:
      params = CalculationMethod.Karachi();
  }

  // Set Asr Jurisprudential convention
  params.madhab = schoolId === 2 ? Madhab.Hanafi : Madhab.Shafi;
  params.highLatitudeRule = HighLatitudeRule.MiddleOfTheNight;

  const pt = new AdhanPrayerTimes(coords, targetDate, params);

  const fajrStr = formatTimeString(pt.fajr, timezone);
  const sunriseStr = formatTimeString(pt.sunrise, timezone);
  const dhuhrStr = formatTimeString(pt.dhuhr, timezone);
  const asrStr = formatTimeString(pt.asr, timezone);
  const sunsetStr = formatTimeString(pt.sunset || pt.maghrib, timezone);
  const maghribStr = formatTimeString(pt.maghrib, timezone);
  const ishaStr = formatTimeString(pt.isha, timezone);

  const imsakDate = new Date(pt.fajr.getTime() - 10 * 60 * 1000);
  const imsakStr = formatTimeString(imsakDate, timezone);

  const midnightDate = new Date(
    pt.sunset.getTime() + (pt.fajr.getTime() - pt.sunset.getTime()) / 2
  );
  const midnightStr = formatTimeString(midnightDate, timezone);

  // Compute Next Prayer
  const now = new Date();
  const prayerList = [
    { name: 'Fajr', date: pt.fajr, timeStr: fajrStr },
    { name: 'Sunrise', date: pt.sunrise, timeStr: sunriseStr },
    { name: 'Dhuhr', date: pt.dhuhr, timeStr: dhuhrStr },
    { name: 'Asr', date: pt.asr, timeStr: asrStr },
    { name: 'Maghrib', date: pt.maghrib, timeStr: maghribStr },
    { name: 'Isha', date: pt.isha, timeStr: ishaStr },
  ];

  let nextPrayerInfo: { name: string; time: string; timeRemainingFormatted: string } | undefined;
  for (const p of prayerList) {
    if (p.date > now) {
      const diffMs = p.date.getTime() - now.getTime();
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      nextPrayerInfo = {
        name: p.name,
        time: p.timeStr,
        timeRemainingFormatted: `${diffHours > 0 ? `${diffHours}h ` : ''}${diffMins}m`,
      };
      break;
    }
  }

  // If all prayers passed today, next is Fajr tomorrow
  if (!nextPrayerInfo) {
    const tomorrow = new Date(targetDate);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowPt = new AdhanPrayerTimes(coords, tomorrow, params);
    const diffMs = tomorrowPt.fajr.getTime() - now.getTime();
    const diffHours = Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
    const diffMins = Math.max(0, Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)));
    nextPrayerInfo = {
      name: 'Fajr (Tomorrow)',
      time: formatTimeString(tomorrowPt.fajr, timezone),
      timeRemainingFormatted: `${diffHours > 0 ? `${diffHours}h ` : ''}${diffMins}m`,
    };
  }

  const methodName =
    CALCULATION_METHODS.find((m) => m.id === methodId)?.name || 'Karachi (Hanafi Default)';
  const schoolName = ASR_SCHOOLS.find((s) => s.id === schoolId)?.name || 'Hanafi';

  const dateReadable = targetDate.toLocaleDateString('en-US', {
    timeZone: timezone,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Basic Hijri format
  let hijriDateReadable = 'Islamic Date';
  try {
    const hijriFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      timeZone: timezone,
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    hijriDateReadable = hijriFormatter.format(targetDate);
  } catch {
    // Fallback
  }

  return {
    fajr: fajrStr,
    sunrise: sunriseStr,
    dhuhr: dhuhrStr,
    asr: asrStr,
    sunset: sunsetStr,
    maghrib: maghribStr,
    isha: ishaStr,
    imsak: imsakStr,
    midnight: midnightStr,
    nextPrayer: nextPrayerInfo,
    methodName,
    schoolName,
    locationName,
    timezone,
    dateReadable,
    hijriDateReadable,
    disclaimer:
      'ESTIMATED CALCULATION: These prayer times are calculated mathematically using astronomical formulas (Adhan-JS). Actual mosque congregation (Iqamah) times and physical sunset/dawn visibility may vary due to terrain, local elevation, atmospheric refraction, or local mosque committee conventions. Never treat as official mosque announcements.',
  };
}
