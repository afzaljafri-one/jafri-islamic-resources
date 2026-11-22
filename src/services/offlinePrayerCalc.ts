// ==============================================================================
// Offline Mathematical Prayer Calculation Engine (Adhan-JS Fallback)
// ==============================================================================
//
// Calculation Assumptions & Scientific Methodology:
// 1. Solar Angles:
//    - Karachi Method (Method 1 - India Default): Fajr 18.0°, Isha 18.0°
//    - Shia Ithna-Ashari / Jafari (Method 0): Fajr 17.7° (Institute of Geophysics, Tehran),
//      Maghrib twilight angle 4.5° (disappearance of eastern redness), Isha 14.0°
//    - ISNA (Method 2): Fajr 15.0°, Isha 15.0°
//    - Muslim World League (Method 3): Fajr 18.0°, Isha 17.0°
//    - Umm Al-Qura (Method 4): Fajr 18.5°, Isha 90 minutes after Maghrib (120 min during Ramadan)
// 2. Asr Jurisprudence (Madhab):
//    - Hanafi (School 2 - India Default): Shadow length = 2x object height + noon shadow
//    - Shafi / Maliki / Hanbali / Jafari (School 1): Shadow length = 1x object height + noon shadow
// 3. High-Latitude Handling:
//    - Uses 'MiddleOfTheNight' rule for latitudes above 48° where twilight may not disappear.
// 4. Timezone Behaviour:
//    - Timings are calculated against the user's browser local system clock and timezone.
// ==============================================================================

import {
  Coordinates,
  CalculationMethod,
  CalculationParameters,
  Madhab,
  PrayerTimes as AdhanPrayerTimes,
  Qibla as AdhanQibla,
  HighLatitudeRule,
} from 'adhan';
import { PrayerTimesApiResponse } from '../types/islamicServices';
import { CALCULATION_METHODS, ASR_SCHOOLS } from '../types/settings';

function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

export function calculateOfflinePrayerTimes(
  latitude: number,
  longitude: number,
  method = 1,
  school = 2,
  targetDate = new Date()
): PrayerTimesApiResponse {
  const coords = new Coordinates(latitude, longitude);

  // Map method ID to Adhan calculation parameters
  let params: CalculationParameters;
  switch (method) {
    case 0:
      params = CalculationMethod.Tehran(); // Jafari / Shia Ithna-Ashari
      break;
    case 1:
      params = CalculationMethod.Karachi(); // Univ. of Islamic Sciences, Karachi (India Default)
      break;
    case 2:
      params = CalculationMethod.NorthAmerica(); // ISNA
      break;
    case 3:
      params = CalculationMethod.MuslimWorldLeague(); // MWL
      break;
    case 4:
      params = CalculationMethod.UmmAlQura(); // Makkah
      break;
    case 5:
      params = CalculationMethod.Egyptian(); // Egypt
      break;
    default:
      params = CalculationMethod.Karachi();
  }

  // Set Asr Jurisprudential convention
  params.madhab = school === 2 ? Madhab.Hanafi : Madhab.Shafi;

  // High-latitude rule (e.g. Scandinavia, Northern UK)
  params.highLatitudeRule = HighLatitudeRule.MiddleOfTheNight;

  const pt = new AdhanPrayerTimes(coords, targetDate, params);
  const qiblaBearing = AdhanQibla(coords);

  const methodName = CALCULATION_METHODS.find((m) => m.id === method)?.name || 'Standard Calculation';
  const schoolName = ASR_SCHOOLS.find((s) => s.id === school)?.name || 'Hanafi';

  // Format readable Gregorian date
  const readableDate = targetDate.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Calculate approximate Hijri year/month using Intl API
  let hijriYear = '1448';
  let hijriDay = '1';
  let hijriMonthEn = 'Islamic Month';
  try {
    const islamicFormatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    const parts = islamicFormatter.formatToParts(targetDate);
    parts.forEach((p) => {
      if (p.type === 'year') hijriYear = p.value;
      if (p.type === 'day') hijriDay = p.value;
      if (p.type === 'month') hijriMonthEn = p.value;
    });
  } catch {
    // Fallback if islamic calendar Intl is unsupported
  }

  return {
    code: 200,
    status: 'success',
    isOfflineEstimate: true,
    calculationMethodName: methodName,
    schoolName: schoolName,
    disclaimer:
      'OFFLINE MATHEMATICAL ESTIMATE: Calculated locally via astronomical formulas. Actual timings may vary by ±2-3 minutes due to local elevation, terrain, atmospheric refraction, or local mosque committee conventions. Never treat as live API data.',
    qibla: {
      direction: {
        degrees: parseFloat(qiblaBearing.toFixed(2)),
        from: 'North',
        clockwise: true,
      },
      distance: {
        value: 0,
        unit: 'km',
      },
    },
    timezone: {
      name: Intl.DateTimeFormat().resolvedOptions().timeZone || 'Local',
      utc_offset: `${-new Date().getTimezoneOffset() / 60}h`,
      abbreviation: '',
    },
    data: {
      times: {
        Fajr: formatTime(pt.fajr),
        Sunrise: formatTime(pt.sunrise),
        Dhuhr: formatTime(pt.dhuhr),
        Asr: formatTime(pt.asr),
        Sunset: formatTime(pt.sunset || pt.maghrib),
        Maghrib: formatTime(pt.maghrib),
        Isha: formatTime(pt.isha),
        Imsak: formatTime(new Date(pt.fajr.getTime() - 10 * 60 * 1000)), // 10 mins before Fajr
        Midnight: formatTime(
          new Date(pt.sunset.getTime() + (pt.fajr.getTime() - pt.sunset.getTime()) / 2)
        ),
      },
      prohibited_times: {
        sunrise: `${formatTime(pt.sunrise)} - ${formatTime(new Date(pt.sunrise.getTime() + 15 * 60 * 1000))}`,
        zawal: `${formatTime(new Date(pt.dhuhr.getTime() - 10 * 60 * 1000))} - ${formatTime(pt.dhuhr)}`,
        sunset: `${formatTime(new Date(pt.maghrib.getTime() - 15 * 60 * 1000))} - ${formatTime(pt.maghrib)}`,
      },
      date: {
        readable: readableDate,
        hijri: {
          day: hijriDay,
          year: hijriYear,
          month: {
            en: hijriMonthEn,
            ar: '',
          },
        },
      },
    },
  };
}
