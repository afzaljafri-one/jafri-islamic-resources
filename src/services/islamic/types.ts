// ==============================================================================
// Milestone M4: Islamic Services & Tools — Domain Types
// ==============================================================================

export interface LocationPreset {
  id: string;
  name: string;
  country: string;
  latitude: number;
  longitude: number;
  timezone: string;
}

export interface PrayerTimeItem {
  name: string;
  arabicName: string;
  time: string;
  isNext?: boolean;
}

export interface CalculatedPrayerData {
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  sunset: string;
  maghrib: string;
  isha: string;
  imsak: string;
  midnight: string;
  nextPrayer?: {
    name: string;
    time: string;
    timeRemainingFormatted: string;
  };
  methodName: string;
  schoolName: string;
  locationName: string;
  timezone: string;
  dateReadable: string;
  hijriDateReadable: string;
  disclaimer: string;
}

export interface QiblaResult {
  bearingDegrees: number; // clockwise from true North (0-360)
  distanceKm: number;
  directionCompass: string;
  isCompassSupported: boolean;
}

export interface HijriDateModel {
  day: number;
  month: number;
  monthNameEn: string;
  monthNameAr: string;
  year: number;
  dayNameEn: string;
  dayNameAr: string;
  formattedEn: string;
  formattedAr: string;
  isCalculated: boolean;
  adjustmentOffset: number;
}

export interface IslamicEvent {
  title: string;
  arabicTitle: string;
  hijriDate: string; // e.g. "1 Ramadan", "1 Shawwal"
  gregorianDateEstimated: string;
  description: string;
  type: 'major' | 'fasting' | 'celebration' | 'observance';
}

export interface RamadanDaySchedule {
  ramadanDay: number;
  gregorianDate: string;
  weekday: string;
  suhoorEnd: string; // Imsak / Fajr start
  fajr: string;
  iftar: string; // Maghrib start
  fastDuration: string;
}

export interface SixKalimaItem {
  id: number;
  title: string;
  arabicTitle: string;
  arabicText: string;
  transliteration: string;
  englishTranslation: string;
  urduTranslation: string;
  audioUrl?: string;
}

export interface DailyDuaItem {
  id: string;
  category: string;
  categoryArabic: string;
  title: string;
  arabicTitle: string;
  arabicText: string;
  transliteration: string;
  englishTranslation: string;
  urduTranslation: string;
  context: string;
  reference: string;
  audioUrl?: string;
}

export interface AsmaUlHusnaName {
  number: number;
  arabic: string;
  transliteration: string;
  englishMeaning: string;
  urduMeaning: string;
  explanation: string;
  audioUrl?: string;
}

export interface HadithBook {
  bookNumber: number;
  name: string;
  arabicName: string;
  hadithCount: number;
}

export interface HadithCollection {
  id: string;
  name: string;
  arabicName: string;
  scholar: string;
  deathYearHijri: number;
  totalHadiths: number;
  description: string;
  books: HadithBook[];
}

export interface HadithItemModel {
  id: string;
  collectionId: string;
  collectionName: string;
  bookNumber: number;
  bookName: string;
  hadithNumber: number;
  narrator: string;
  arabicText: string;
  englishText: string;
  urduText?: string;
  grade?: string; // e.g., Sahih, Hasan, Da'if
  gradedBy?: string;
  referenceString: string;
}

export interface ZakatAssetsInput {
  cashInHand: number;
  bankBalances: number;
  goldGrams: number;
  goldKarat: 24 | 22 | 18;
  silverGrams: number;
  investmentsValue: number;
  businessGoodsValue: number;
  otherEligibleAssets: number;
  shortTermLiabilities: number; // debts due
  nisabStandard: 'silver' | 'gold';
  customGoldPricePerGram?: number;
  customSilverPricePerGram?: number;
}

export interface ZakatCalculationOutput {
  grossWealth: number;
  totalLiabilities: number;
  netZakatableWealth: number;
  goldValuation: number;
  silverValuation: number;
  nisabStandard: 'silver' | 'gold';
  nisabThresholdValue: number;
  isEligibleForZakat: boolean;
  zakatDue: number; // 2.5% of net if above nisab
  zakatRate: string;
  spotPricesUsed: {
    goldPerGram: number;
    silverPerGram: number;
    currency: string;
    source: string;
  };
  disclaimer: string;
}
