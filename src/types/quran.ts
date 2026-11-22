// ==============================================================================
// Quran Domain Types (Multi-Provider Support)
// ==============================================================================

export type RevelationType = 'Meccan' | 'Medinan';
export type ArabicScriptType = 'uthmani' | 'indopak' | 'tajweed';

export interface SurahMeta {
  number: number;
  name: string;
  nameArabic?: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: RevelationType;
}

export interface AyahRaw {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean | { id: number; recommended: boolean; obligatory: boolean };
  audio?: string;
  audioSecondary?: string[];
}

export interface EditionMeta {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: 'text' | 'audio';
  type: 'quran' | 'translation' | 'tafsir' | 'versebyverse';
  direction?: 'rtl' | 'ltr' | null;
}

export interface SurahEditionResponse {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: RevelationType;
  numberOfAyahs: number;
  ayahs: AyahRaw[];
  edition: EditionMeta;
}

export interface WordToken {
  position: number;
  arabic: string;
  transliteration?: string;
  translation: string;
  type?: string;
}

/**
 * Unified Ayah structure supporting multi-script rendering and multiple translations
 */
export interface UnifiedAyah {
  number: number;
  numberInSurah: number;
  juz: number;
  page: number;
  arabicText: string;
  arabicScript: ArabicScriptType;
  translations: Record<string, string>; // identifier -> translated text
  audioUrl?: string;
  audioUrlFallback?: string;
  sajda: boolean;
  words?: WordToken[];
  provider: 'ummahapi' | 'alquran_cloud' | 'hybrid';
}

export interface QuranSearchResultMatch {
  number: number;
  text: string;
  numberInSurah: number;
  surah: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: RevelationType;
  };
  edition: EditionMeta;
}

export interface TranslationOption {
  id: string; // e.g. 'en.sahih', 'ur.jawadi', 'ur.jalandhry'
  name: string;
  translator: string;
  language: 'en' | 'ur' | 'ar';
  provider: 'alquran_cloud' | 'ummahapi' | 'both';
  tradition: 'General' | 'Shia Classical' | 'Sunni Classical';
}

export const SUPPORTED_TRANSLATIONS: TranslationOption[] = [
  {
    id: 'en.sahih',
    name: 'Saheeh International',
    translator: 'Emily Assami, Mary Kennedy, Amatullah Bantley (Abul-Qasim)',
    language: 'en',
    provider: 'both',
    tradition: 'General',
  },
  {
    id: 'ur.jawadi',
    name: 'Allama Syed Zeeshan Haider Jawadi',
    translator: 'Allama Syed Zeeshan Haider Jawadi (Al-Quran al-Mubeen)',
    language: 'ur',
    provider: 'alquran_cloud',
    tradition: 'Shia Classical',
  },
  {
    id: 'ur.jalandhry',
    name: 'Fateh Muhammad Jalandhry',
    translator: 'Fateh Muhammad Jalandhry',
    language: 'ur',
    provider: 'both',
    tradition: 'Sunni Classical',
  },
  {
    id: 'en.yusufali',
    name: 'Abdullah Yusuf Ali',
    translator: 'Abdullah Yusuf Ali',
    language: 'en',
    provider: 'both',
    tradition: 'General',
  },
  {
    id: 'en.pickthall',
    name: 'Marmaduke Pickthall',
    translator: 'Mohammed Marmaduke William Pickthall',
    language: 'en',
    provider: 'both',
    tradition: 'General',
  },
];

export interface BookmarkItem {
  id: string; // e.g. "1:1"
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  surahEnglishName: string;
  arabicSnippet: string;
  translationSnippet?: string;
  timestamp: number;
}

export interface LastReadPosition {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  surahEnglishName: string;
  timestamp: number;
}

export interface ReciterOption {
  id: string;
  name: string;
  nameArabic: string;
  style: 'Murattal' | 'Mujawwad';
}

export const SUPPORTED_RECITERS: ReciterOption[] = [
  {
    id: 'alafasy',
    name: 'Mishary Rashid Alafasy',
    nameArabic: 'مشاري راشد العفاسي',
    style: 'Murattal',
  },
  {
    id: 'abdulbasit-murattal',
    name: 'Abdul Basit Abdul Samad (Murattal)',
    nameArabic: 'عبدالباسط عبدالصمد',
    style: 'Murattal',
  },
  {
    id: 'abdulbasit-mujawwad',
    name: 'Abdul Basit Abdul Samad (Mujawwad)',
    nameArabic: 'عبدالباسط عبدالصمد - مجود',
    style: 'Mujawwad',
  },
];

export interface JuzMeta {
  juzNumber: number;
  startSurah: number;
  startAyah: number;
  nameArabic: string;
  nameEnglish: string;
}

export const JUZ_LIST: JuzMeta[] = [
  { juzNumber: 1, startSurah: 1, startAyah: 1, nameArabic: 'الم', nameEnglish: 'Alif Lam Meem' },
  { juzNumber: 2, startSurah: 2, startAyah: 142, nameArabic: 'سيقول', nameEnglish: 'Sayaqool' },
  { juzNumber: 3, startSurah: 2, startAyah: 253, nameArabic: 'تلك الرسل', nameEnglish: 'Tilkal Rusul' },
  { juzNumber: 4, startSurah: 3, startAyah: 93, nameArabic: 'لن تنالوا', nameEnglish: 'Lan Tanaloo' },
  { juzNumber: 5, startSurah: 4, startAyah: 24, nameArabic: 'والمحصنات', nameEnglish: 'Wal Mohsanat' },
  { juzNumber: 6, startSurah: 4, startAyah: 148, nameArabic: 'لا يحب الله', nameEnglish: 'La Yuhibbullah' },
  { juzNumber: 7, startSurah: 5, startAyah: 82, nameArabic: 'وإذا سمعوا', nameEnglish: 'Wa Iza Sami\'oo' },
  { juzNumber: 8, startSurah: 6, startAyah: 111, nameArabic: 'ولو أننا', nameEnglish: 'Wa Lau Annana' },
  { juzNumber: 9, startSurah: 7, startAyah: 88, nameArabic: 'قال الملأ', nameEnglish: 'Qal Al-Mala\'o' },
  { juzNumber: 10, startSurah: 8, startAyah: 41, nameArabic: 'واعلموا', nameEnglish: 'Wa\'lamoo' },
  { juzNumber: 11, startSurah: 9, startAyah: 93, nameArabic: 'يعتذرون', nameEnglish: 'Ya\'taziroona' },
  { juzNumber: 12, startSurah: 11, startAyah: 6, nameArabic: 'وما من دابة', nameEnglish: 'Wa Ma Min Da\'abbah' },
  { juzNumber: 13, startSurah: 12, startAyah: 53, nameArabic: 'وما أبرئ', nameEnglish: 'Wa Ma Ubarri\'u' },
  { juzNumber: 14, startSurah: 15, startAyah: 1, nameArabic: 'ربما', nameEnglish: 'Rubama' },
  { juzNumber: 15, startSurah: 17, startAyah: 1, nameArabic: 'سبحان الذي', nameEnglish: 'Subhanallazi' },
  { juzNumber: 16, startSurah: 18, startAyah: 75, nameArabic: 'قال ألم', nameEnglish: 'Qala Alam' },
  { juzNumber: 17, startSurah: 21, startAyah: 1, nameArabic: 'اقترب', nameEnglish: 'Iqtaraba' },
  { juzNumber: 18, startSurah: 23, startAyah: 1, nameArabic: 'قد أفلح', nameEnglish: 'Qad Aflaha' },
  { juzNumber: 19, startSurah: 25, startAyah: 21, nameArabic: 'وقال الذين', nameEnglish: 'Wa Qalallazina' },
  { juzNumber: 20, startSurah: 27, startAyah: 56, nameArabic: 'أمن خلق', nameEnglish: 'Amman Khalaqa' },
  { juzNumber: 21, startSurah: 29, startAyah: 46, nameArabic: 'اتل ما أوحي', nameEnglish: 'Utlu Ma Oohiya' },
  { juzNumber: 22, startSurah: 33, startAyah: 31, nameArabic: 'ومن يقنت', nameEnglish: 'Wa Man Yaqnut' },
  { juzNumber: 23, startSurah: 36, startAyah: 28, nameArabic: 'وما أنزلنا', nameEnglish: 'Wa Maliya' },
  { juzNumber: 24, startSurah: 39, startAyah: 32, nameArabic: 'فمن أظلم', nameEnglish: 'Faman Azlamu' },
  { juzNumber: 25, startSurah: 41, startAyah: 47, nameArabic: 'إليه يرد', nameEnglish: 'Ilayhi Yuraddu' },
  { juzNumber: 26, startSurah: 46, startAyah: 1, nameArabic: 'حم', nameEnglish: 'Ha\'a Meem' },
  { juzNumber: 27, startSurah: 51, startAyah: 31, nameArabic: 'قال فما خطبكم', nameEnglish: 'Qala Fama Khatbukum' },
  { juzNumber: 28, startSurah: 58, startAyah: 1, nameArabic: 'قد سمع', nameEnglish: 'Qad Sami\'a' },
  { juzNumber: 29, startSurah: 67, startAyah: 1, nameArabic: 'تبارك الذي', nameEnglish: 'Tabarakallazi' },
  { juzNumber: 30, startSurah: 78, startAyah: 1, nameArabic: 'عم', nameEnglish: '\'Amma' },
];

export interface MushafIndexEntry {
  surah_number: number;
  name_english: string;
  name_arabic: string;
  ayah_count: number;
  revelation_type: string;
  start_pdf_page: number;
  end_pdf_page: number;
  start_printed_page: number;
  end_printed_page: number;
  spanned_pages: number;
  shared_start: boolean;
  shared_end: boolean;
  status: string;
}

export type MushafEditionType = '13-line' | '15-line';
