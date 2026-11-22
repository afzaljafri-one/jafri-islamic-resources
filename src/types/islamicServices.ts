// ==============================================================================
// IslamicAPI & Complementary Services Type Definitions
// ==============================================================================

export interface QiblaInfo {
  direction: {
    degrees: number;
    from: string;
    clockwise: boolean;
  };
  distance: {
    value: number;
    unit: string;
  };
}

export interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Sunset: string;
  Maghrib: string;
  Isha: string;
  Imsak?: string;
  Midnight?: string;
  Firstthird?: string;
  Lastthird?: string;
}

export interface ProhibitedPrayerTimes {
  sunrise?: string;
  zawal?: string;
  sunset?: string;
}

export interface HijriDateInfo {
  day: string;
  date?: string;
  format?: string;
  month: {
    number?: number;
    en: string;
    ar: string;
  };
  year: string;
  weekday?: {
    en: string;
    ar: string;
  };
}

export interface PrayerTimeData {
  times: PrayerTimes;
  prohibited_times?: ProhibitedPrayerTimes;
  date: {
    readable: string;
    timestamp?: string;
    hijri: HijriDateInfo;
  };
}

export interface PrayerTimesApiResponse {
  code: number;
  status: string;
  qibla?: QiblaInfo;
  timezone?: {
    name: string;
    utc_offset: string;
    abbreviation: string;
  };
  data: PrayerTimeData;
  isOfflineEstimate?: boolean;
  calculationMethodName?: string;
  schoolName?: string;
  disclaimer?: string;
}

export interface FastingDay {
  date: string;
  hijri: string;
  hijri_readable: string;
  time: {
    sahur: string;
    iftar: string;
    duration: string;
  };
}

export interface FastingApiResponse {
  code: number;
  status: string;
  range?: string;
  data: {
    fasting: FastingDay[];
    white_days?: {
      status: string;
      days: {
        '13th'?: string;
        '14th'?: string;
        '15th'?: string;
      };
    };
  };
}

export interface NisabThresholds {
  gold: {
    weight: number;
    unit_price: number;
    nisab_amount: number;
  };
  silver: {
    weight: number;
    unit_price: number;
    nisab_amount: number;
  };
}

export interface ZakatNisabApiResponse {
  code: number;
  status: string;
  calculation_standard: string;
  currency: string;
  weight_unit: string;
  updated_at: string;
  data: {
    nisab_thresholds: NisabThresholds;
    zakat_rate: string;
    notes?: string;
  };
  isEstimate?: boolean;
}

export interface AsmaUlHusnaItem {
  number: number;
  name: string;
  transliteration: string;
  translation: string;
  meaning: string;
  audio?: string;
}

export interface DuaCategory {
  name: string;
  url: string;
  icon?: string;
  meta?: string;
}

export interface DuaItem {
  dua_id: number;
  title: string;
  arabic: string;
  transliteration?: string;
  translation: string;
  reference?: string;
  benefits?: string;
}
