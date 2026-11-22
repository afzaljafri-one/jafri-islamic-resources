// ==============================================================================
// User Preferences & Settings Types
// ==============================================================================

import { ArabicScriptType } from './quran';

export interface CalculationMethodOption {
  id: number;
  name: string;
  key: string;
  description: string;
}

export const CALCULATION_METHODS: CalculationMethodOption[] = [
  { id: 1, key: 'Karachi', name: 'Univ. of Islamic Sciences, Karachi', description: 'Standard for Pakistan, India, Bangladesh, Afghanistan (Fajr 18°, Isha 18°)' },
  { id: 0, key: 'Jafari', name: 'Shia Ithna-Ashari / Jafari', description: 'Leva Institute Qum / Tehran Geophysics (Fajr 16°, Maghrib 4°, Isha 14°)' },
  { id: 2, key: 'ISNA', name: 'Islamic Society of North America (ISNA)', description: 'North America standard (Fajr 15°, Isha 15°)' },
  { id: 3, key: 'MuslimWorldLeague', name: 'Muslim World League (MWL)', description: 'Standard for Europe, Far East, parts of America (Fajr 18°, Isha 17°)' },
  { id: 4, key: 'UmmAlQura', name: 'Umm Al-Qura University, Makkah', description: 'Saudi Arabia & Gulf region (Fajr 18.5°, Isha 90 min after Maghrib)' },
  { id: 5, key: 'Egyptian', name: 'Egyptian General Authority of Survey', description: 'Egypt, parts of Middle East & Africa (Fajr 19.5°, Isha 17.5°)' },
];

export interface SchoolOption {
  id: number;
  key: string;
  name: string;
  description: string;
}

export const ASR_SCHOOLS: SchoolOption[] = [
  { id: 2, key: 'Hanafi', name: 'Hanafi', description: 'Shadow length equals twice the object height plus shadow at noon (2x)' },
  { id: 1, key: 'Shafi', name: 'Shafi / Maliki / Hanbali / Jafari', description: 'Shadow length equals object height plus shadow at noon (1x)' },
];

export interface UserPreferences {
  // Location & Calculation Defaults for India
  method: number; // 1 = Karachi default
  school: number; // 2 = Hanafi default
  shifting: number; // -2 to +2 days for moon sighting adjustment
  city: string;
  country: string;
  latitude: number;
  longitude: number;

  // Reader Preferences
  arabicFontSize: number;
  translationFontSize: number;
  scriptType: ArabicScriptType; // 'uthmani' | 'indopak' | 'tajweed'
  primaryTranslation: string; // e.g. 'en.sahih'
  secondaryTranslation: string; // e.g. 'ur.jawadi'
  activeReciter: string; // e.g. '1' (Mishary Alafasy) or 'ar.alafasy'

  // Zakat Calculator Defaults
  nisabStandard: 'silver' | 'gold';
}

export const DEFAULT_PREFERENCES: UserPreferences = {
  // India Defaults (Method: Karachi 1, Asr: Hanafi 2)
  method: 1,
  school: 2,
  shifting: 0,
  city: 'New Delhi',
  country: 'India',
  latitude: 28.6139,
  longitude: 77.2090,

  // Reader Defaults
  arabicFontSize: 32,
  translationFontSize: 16,
  scriptType: 'uthmani',
  primaryTranslation: 'en.sahih',
  secondaryTranslation: 'ur.jawadi',
  activeReciter: '1',

  // Zakat Standard Default (Silver is classical majority for currency/liquid wealth)
  nisabStandard: 'silver',
};
