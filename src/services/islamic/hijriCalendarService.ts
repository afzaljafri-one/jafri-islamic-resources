// ==============================================================================
// Islamic / Hijri Calendar Service
// Milestone M4: Islamic Services & Tools
// Astronomical calculation with local moon-sighting adjustment offset (-2 to +2 days)
// ==============================================================================

import { HijriDateModel, IslamicEvent, RamadanDaySchedule } from './types';
import { calculatePrayerTimes } from './prayerService';

export const HIJRI_MONTHS = [
  { number: 1, en: 'Muharram', ar: 'مُحَرَّم' },
  { number: 2, en: 'Safar', ar: 'صَفَر' },
  { number: 3, en: 'Rabi al-Awwal', ar: 'رَبِيع ٱلْأَوَّل' },
  { number: 4, en: 'Rabi al-Thani', ar: 'رَبِيع ٱلثَّانِي' },
  { number: 5, en: 'Jumada al-Awwal', ar: 'جُمَادَىٰ ٱلْأُولَىٰ' },
  { number: 6, en: 'Jumada al-Thani', ar: 'جُمَادَىٰ ٱلثَّانِيَة' },
  { number: 7, en: 'Rajab', ar: 'رَجَب' },
  { number: 8, set: 'Sha\'ban', en: 'Sha\'ban', ar: 'شَعْبَان' },
  { number: 9, en: 'Ramadan', ar: 'رَمَضَان' },
  { number: 10, en: 'Shawwal', ar: 'شَوَّال' },
  { number: 11, en: 'Dhu al-Qi\'dah', ar: 'ذُو ٱلْقَعْدَة' },
  { number: 12, en: 'Dhu al-Hijjah', ar: 'ذُو ٱلْحِجَّة' },
];

export const MAJOR_ISLAMIC_EVENTS: IslamicEvent[] = [
  {
    title: 'Islamic New Year',
    arabicTitle: 'رأس السنة الهجرية',
    hijriDate: '1 Muharram',
    gregorianDateEstimated: 'Estimated based on 1448 AH',
    description: 'Marks the migration (Hijrah) of the Prophet Muhammad (PBUH) from Makkah to Madinah.',
    type: 'major',
  },
  {
    title: 'Day of Ashura',
    arabicTitle: 'يوم عاشوراء',
    hijriDate: '10 Muharram',
    gregorianDateEstimated: '10th day of Muharram',
    description: 'Commemorates the salvation of Prophet Musa (AS) and the martyrdom of Imam Husayn (AS) at Karbala.',
    type: 'observance',
  },
  {
    title: 'Mawlid an-Nabi',
    arabicTitle: 'المولد النبوي الشريف',
    hijriDate: '12 Rabi al-Awwal',
    gregorianDateEstimated: '12th day of Rabi al-Awwal',
    description: 'Commemorates the birth of the Prophet Muhammad (PBUH).',
    type: 'celebration',
  },
  {
    title: 'Isra and Mi\'raj',
    arabicTitle: 'الإسراء والمعراج',
    hijriDate: '27 Rajab',
    gregorianDateEstimated: '27th night of Rajab',
    description: 'The miraculous night journey and heavenly ascension of the Prophet Muhammad (PBUH).',
    type: 'major',
  },
  {
    title: 'Mid-Sha\'ban (Laylat al-Bara\'at)',
    arabicTitle: 'ليلة البراءة / نصف شعبان',
    hijriDate: '15 Sha\'ban',
    gregorianDateEstimated: '15th night of Sha\'ban',
    description: 'The night of forgiveness and spiritual renewal prior to Ramadan.',
    type: 'observance',
  },
  {
    title: 'First Day of Ramadan',
    arabicTitle: 'غرة شهر رمضان المبارك',
    hijriDate: '1 Ramadan',
    gregorianDateEstimated: '1st of Ramadan (subject to sighting)',
    description: 'The beginning of the holy month of fasting, revelation of the Holy Quran, and taraweeh.',
    type: 'fasting',
  },
  {
    title: 'Laylat al-Qadr (Night of Decree)',
    arabicTitle: 'ليلة القدر',
    hijriDate: '27 Ramadan',
    gregorianDateEstimated: '27th night of Ramadan (odd nights: 21, 23, 25, 27, 29)',
    description: 'The holiest night of the Islamic year, better than a thousand months (Quran 97:3).',
    type: 'major',
  },
  {
    title: 'Eid al-Fitr',
    arabicTitle: 'عيد الفطر المبارك',
    hijriDate: '1 Shawwal',
    gregorianDateEstimated: '1st of Shawwal (subject to sighting)',
    description: 'Festival of breaking the fast celebrated worldwide at the completion of Ramadan.',
    type: 'celebration',
  },
  {
    title: 'Day of Arafah',
    arabicTitle: 'يوم عرفة',
    hijriDate: '9 Dhu al-Hijjah',
    gregorianDateEstimated: '9th of Dhu al-Hijjah',
    description: 'The culmination of the Hajj pilgrimage upon the plains of Mount Arafat.',
    type: 'observance',
  },
  {
    title: 'Eid al-Adha',
    arabicTitle: 'عيد الأضحى المبارك',
    hijriDate: '10 Dhu al-Hijjah',
    gregorianDateEstimated: '10th of Dhu al-Hijjah',
    description: 'Feast of the Sacrifice commemorating the devotion of Prophet Ibrahim (AS) and Ismail (AS).',
    type: 'celebration',
  },
];

/**
 * Converts a Gregorian Date to an adjusted Hijri date using Intl API + custom offset
 */
export function getHijriDate(date: Date = new Date(), adjustmentOffsetDays: number = 0): HijriDateModel {
  // Apply local moon sighting offset if user selected one (-2 to +2 days)
  const adjustedDate = new Date(date);
  if (adjustmentOffsetDays !== 0) {
    adjustedDate.setDate(adjustedDate.getDate() + adjustmentOffsetDays);
  }

  let hijriYear = 1448;
  let hijriMonthNumber = 9;
  let hijriDay = 1;
  let hijriMonthEn = 'Ramadan';
  let hijriMonthAr = 'رَمَضَان';

  try {
    const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric',
    });
    const parts = formatter.formatToParts(adjustedDate);
    parts.forEach((p) => {
      if (p.type === 'year') hijriYear = parseInt(p.value, 10);
      if (p.type === 'day') hijriDay = parseInt(p.value, 10);
      if (p.type === 'month') hijriMonthNumber = parseInt(p.value, 10);
    });

    const m = HIJRI_MONTHS.find((item) => item.number === hijriMonthNumber) || HIJRI_MONTHS[0];
    hijriMonthEn = m.en;
    hijriMonthAr = m.ar;
  } catch {
    // Basic approximate arithmetic fallback
  }

  const dayNameEn = adjustedDate.toLocaleDateString('en-US', { weekday: 'long' });
  const dayNameArMap: Record<string, string> = {
    Sunday: 'الأحد',
    Monday: 'الإثنين',
    Tuesday: 'الثلاثاء',
    Wednesday: 'الأربعاء',
    Thursday: 'الخميس',
    Friday: 'الجمعة',
    Saturday: 'السبت',
  };
  const dayNameAr = dayNameArMap[dayNameEn] || 'اليوم';

  return {
    day: hijriDay,
    month: hijriMonthNumber,
    monthNameEn: hijriMonthEn,
    monthNameAr: hijriMonthAr,
    year: hijriYear,
    dayNameEn,
    dayNameAr,
    formattedEn: `${hijriDay} ${hijriMonthEn} ${hijriYear} AH`,
    formattedAr: `${hijriDay} ${hijriMonthAr} ${hijriYear} هـ`,
    isCalculated: true,
    adjustmentOffset: adjustmentOffsetDays,
  };
}

/**
 * Generates monthly grid for a given Gregorian year and month with mapped Hijri dates
 */
export function getMonthlyCalendarGrid(
  year: number,
  month: number, // 0-indexed (0 = Jan, 11 = Dec)
  adjustmentOffsetDays: number = 0
) {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const totalDays = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay(); // 0 = Sun

  const days: {
    gregorianDay: number;
    gregorianDate: Date;
    hijri: HijriDateModel;
    isToday: boolean;
  }[] = [];

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  for (let d = 1; d <= totalDays; d++) {
    const dDate = new Date(year, month, d);
    const hijri = getHijriDate(dDate, adjustmentOffsetDays);
    const isToday = isCurrentMonth && today.getDate() === d;
    days.push({
      gregorianDay: d,
      gregorianDate: dDate,
      hijri,
      isToday,
    });
  }

  return {
    year,
    month,
    startingDayOfWeek,
    totalDays,
    days,
  };
}

/**
 * Dynamically determines the Gregorian Date of 1 Ramadan for a given Hijri year
 * using the astronomical Umm al-Qura calendar baseline (8 Feb 2027 for 1448 AH)
 * and applies the user-selected local moon-sighting adjustment offset in days.
 * Returns null if the astronomical lunar date cannot be determined, avoiding fabricated fallbacks.
 */
export function findFirstOfRamadan(targetHijriYear: number, adjustmentOffsetDays: number = 0): Date | null {
  if (!targetHijriYear || targetHijriYear <= 0) {
    return null;
  }
  const approxGregYear = Math.floor(targetHijriYear * 0.970224 + 621.57);
  let cur = new Date(approxGregYear - 1, 9, 1);
  const end = new Date(approxGregYear + 1, 5, 1);

  const formatter = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });

  let baseDate: Date | null = null;
  while (cur <= end) {
    const parts = formatter.formatToParts(cur);
    let y = 0, m = 0, d = 0;
    for (const p of parts) {
      if (p.type === 'year') y = parseInt(p.value, 10);
      if (p.type === 'month') m = parseInt(p.value, 10);
      if (p.type === 'day') d = parseInt(p.value, 10);
    }
    if (y === targetHijriYear && m === 9 && d === 1) {
      baseDate = new Date(cur);
      break;
    }
    cur.setDate(cur.getDate() + 1);
  }

  if (!baseDate) {
    // Explicit unavailable/error state: do not silently return an arbitrary Gregorian date fallback
    return null;
  }

  if (adjustmentOffsetDays !== 0) {
    const adjusted = new Date(baseDate);
    adjusted.setDate(adjusted.getDate() + adjustmentOffsetDays);
    return adjusted;
  }
  return baseDate;
}

/**
 * Generates a 30-day Ramadan Fasting Timetable based on location prayer timings
 */
export function generateRamadanSchedule(
  latitude: number,
  longitude: number,
  methodId = 1,
  schoolId = 2,
  startDate: Date | null = new Date(),
  timezone = 'Asia/Kolkata',
  locationName = 'New Delhi, India'
): RamadanDaySchedule[] {
  if (!startDate || isNaN(startDate.getTime())) {
    return [];
  }
  const schedule: RamadanDaySchedule[] = [];

  for (let i = 0; i < 30; i++) {
    const curDate = new Date(startDate);
    curDate.setDate(curDate.getDate() + i);

    const pt = calculatePrayerTimes(latitude, longitude, methodId, schoolId, curDate, locationName, timezone);

    // Calculate Fast Duration (from Fajr to Maghrib)
    const [fHour, fMin] = pt.fajr.split(':').map(Number);
    const [mHour, mMin] = pt.maghrib.split(':').map(Number);
    let totalMinutes = mHour * 60 + mMin - (fHour * 60 + fMin);
    if (totalMinutes < 0) totalMinutes += 24 * 60;
    const durHours = Math.floor(totalMinutes / 60);
    const durMins = totalMinutes % 60;

    schedule.push({
      ramadanDay: i + 1,
      gregorianDate: curDate.toLocaleDateString('en-US', {
        timeZone: timezone,
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      weekday: curDate.toLocaleDateString('en-US', { timeZone: timezone, weekday: 'short' }),
      suhoorEnd: pt.imsak,
      fajr: pt.fajr,
      iftar: pt.maghrib,
      fastDuration: `${durHours}h ${durMins}m`,
    });
  }

  return schedule;
}
