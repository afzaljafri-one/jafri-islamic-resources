// ==============================================================================
// Quran Translation Audio Service (Command 4 Implementation)
// Pure separate service managing Quran translation audio sources & editions.
// DOES NOT MODIFY OR REPLACE the frozen QuranAudioService or Mushaf boundaries.
// Jafri Religious Books & Audio Platform
// ==============================================================================

export interface QuranAudioEdition {
  id: string;
  name: string;
  language: string;
  languageName: string;
  reciterOrNarrator: string;
  translatorOrSource: string;
  isTranslation: boolean;
  isSynthesizedNarration: boolean;
  provider: 'EveryAyah' | 'QuranEnc' | 'WebSpeech';
  format: 'mp3' | 'speech_synthesis';
  baseUrl?: string;
  license: string;
  nonCommercialOnly: boolean;
  attributionRequired: boolean;
  attributionText: string;
  coverage: string;
  notes: string;
}

export const QURAN_AUDIO_EDITIONS: QuranAudioEdition[] = [
  // --- Arabic Recitations ---
  {
    id: 'arabic_alafasy',
    name: 'Sheikh Mishary Rashid Alafasy (Arabic Recitation)',
    language: 'ar',
    languageName: 'Arabic (العربية)',
    reciterOrNarrator: 'Sheikh Mishary Rashid Alafasy',
    translatorOrSource: 'Original Quranic Arabic (Hafs an Asim)',
    isTranslation: false,
    isSynthesizedNarration: false,
    provider: 'EveryAyah',
    format: 'mp3',
    baseUrl: 'https://everyayah.com/data/Alafasy_128kbps/',
    license: 'Public Domain / Free for Non-Commercial Religious Listening',
    nonCommercialOnly: false,
    attributionRequired: true,
    attributionText: 'Recitation by Sheikh Mishary Rashid Alafasy via EveryAyah.com CDN',
    coverage: 'Complete 114 Surahs (6,236 Ayahs)',
    notes: 'Studio high-clarity 128kbps Murattal recitation.',
  },
  {
    id: 'arabic_sudais',
    name: 'Sheikh Abdur-Rahman As-Sudais (Arabic Recitation)',
    language: 'ar',
    languageName: 'Arabic (العربية)',
    reciterOrNarrator: 'Sheikh Abdur-Rahman As-Sudais',
    translatorOrSource: 'Original Quranic Arabic (Hafs an Asim)',
    isTranslation: false,
    isSynthesizedNarration: false,
    provider: 'EveryAyah',
    format: 'mp3',
    baseUrl: 'https://everyayah.com/data/Abdurrahmaan_As-Sudais_192kbps/',
    license: 'Public Domain / Free for Non-Commercial Religious Listening',
    nonCommercialOnly: false,
    attributionRequired: true,
    attributionText: 'Recitation by Sheikh Abdur-Rahman As-Sudais via EveryAyah.com CDN',
    coverage: 'Complete 114 Surahs (6,236 Ayahs)',
    notes: 'Imam of the Grand Mosque in Makkah (192kbps).',
  },

  // --- English Translations ---
  {
    id: 'english_ibrahim_walk',
    name: 'Sahih International — Ibrahim Walk (English)',
    language: 'en',
    languageName: 'English',
    reciterOrNarrator: 'Ibrahim Walk',
    translatorOrSource: 'Sahih International',
    isTranslation: true,
    isSynthesizedNarration: false,
    provider: 'EveryAyah',
    format: 'mp3',
    baseUrl: 'https://everyayah.com/data/English/Sahih_Intnl_Ibrahim_Walk_192kbps/',
    license: 'Open Access Islamic Educational Use',
    nonCommercialOnly: true,
    attributionRequired: true,
    attributionText: 'Narration by Ibrahim Walk, Sahih International translation via EveryAyah.com',
    coverage: 'Complete 114 Surahs (6,236 Ayahs)',
    notes: 'Clear human voice narration in modern British-American English (192kbps).',
  },
  {
    id: 'english_rowwad',
    name: 'Rowwad Translation Center — English Narration',
    language: 'en',
    languageName: 'English',
    reciterOrNarrator: 'Rowwad Center Narrator',
    translatorOrSource: 'Rowwad Translation Center (IslamHouse / Rabwah)',
    isTranslation: true,
    isSynthesizedNarration: false,
    provider: 'QuranEnc',
    format: 'mp3',
    baseUrl: 'https://d.quranenc.com/data/audio/english_rwwad/',
    license: 'Free Non-Commercial Dawah Distribution',
    nonCommercialOnly: true,
    attributionRequired: true,
    attributionText: 'Rowwad Translation Center via QuranEnc.com API CDN',
    coverage: 'Complete 114 Surahs (6,236 Ayahs)',
    notes: 'Studio recording provided by QuranEnc / Rowwad Translation Center.',
  },

  // --- Urdu Translations ---
  {
    id: 'urdu_shamshad',
    name: 'Maulana Junagarhi — Shamshad Ali Khan (Urdu)',
    language: 'ur',
    languageName: 'Urdu (اردو)',
    reciterOrNarrator: 'Shamshad Ali Khan',
    translatorOrSource: 'Maulana Muhammad Junagarhi',
    isTranslation: true,
    isSynthesizedNarration: false,
    provider: 'EveryAyah',
    format: 'mp3',
    baseUrl: 'https://everyayah.com/data/translations/urdu_shamshad_ali_khan_46kbps/',
    license: 'Public Domain / Free Islamic Dawah Listening',
    nonCommercialOnly: true,
    attributionRequired: true,
    attributionText: 'Recitation by Shamshad Ali Khan, translation by Maulana Muhammad Junagarhi via EveryAyah.com',
    coverage: 'Complete 114 Surahs (6,236 Ayahs)',
    notes: 'Classical Urdu translation audio with studio voiceover.',
  },
  {
    id: 'urdu_farhat_hashmi',
    name: 'Dr. Farhat Hashmi — Urdu Translation & Explanation',
    language: 'ur',
    languageName: 'Urdu (اردو)',
    reciterOrNarrator: 'Dr. Farhat Hashmi',
    translatorOrSource: 'Al-Huda International',
    isTranslation: true,
    isSynthesizedNarration: false,
    provider: 'EveryAyah',
    format: 'mp3',
    baseUrl: 'https://everyayah.com/data/translations/urdu_farhat_hashmi/',
    license: 'Al-Huda Educational Non-Commercial Use',
    nonCommercialOnly: true,
    attributionRequired: true,
    attributionText: 'Word-by-word explanation by Dr. Farhat Hashmi via EveryAyah.com',
    coverage: 'Complete 114 Surahs',
    notes: 'Educational word-by-word Urdu translation commentary.',
  },

  // --- Hindi Translation Narration ---
  {
    id: 'hindi_omari_narration',
    name: 'Azizul Haq Al-Omari — Hindi Approved Narration [TTS]',
    language: 'hi',
    languageName: 'Hindi (हिन्दी)',
    reciterOrNarrator: 'Browser Speech Synthesis (Narration Voice)',
    translatorOrSource: 'Maulana Azizul Haq Al-Omari (King Fahd Complex / QuranEnc)',
    isTranslation: true,
    isSynthesizedNarration: true,
    provider: 'WebSpeech',
    format: 'speech_synthesis',
    license: 'Text: King Fahd Complex (Open Dawah). Audio: Local Client Speech Narration',
    nonCommercialOnly: false,
    attributionRequired: true,
    attributionText: 'Verbatim text by Maulana Azizul Haq Al-Omari. Client-side narration labeled as synthetic voice.',
    coverage: 'Complete 114 Surahs (Verbatim approved text reading)',
    notes: 'SEPARATELY LABELED SYNTHETIC NARRATION. Reads approved translation text verbatim. Never presented as authentic recitation.',
  },

  // --- French Translation ---
  {
    id: 'french_rashid',
    name: 'Rachid Maach — French Narration',
    language: 'fr',
    languageName: 'French (Français)',
    reciterOrNarrator: 'Rachid Maach Narrator',
    translatorOrSource: 'Rachid Maach (QuranEnc)',
    isTranslation: true,
    isSynthesizedNarration: false,
    provider: 'QuranEnc',
    format: 'mp3',
    baseUrl: 'https://d.quranenc.com/data/audio/french_rashid/',
    license: 'Non-Commercial Educational Distribution',
    nonCommercialOnly: true,
    attributionRequired: true,
    attributionText: 'Translation by Rachid Maach via QuranEnc.com CDN',
    coverage: 'Complete 114 Surahs (6,236 Ayahs)',
    notes: 'Studio French narration served by QuranEnc.',
  },

  // --- Chinese Translation ---
  {
    id: 'chinese_suliman',
    name: 'Suliman — Chinese Narration',
    language: 'zh',
    languageName: 'Chinese (中文)',
    reciterOrNarrator: 'Suliman',
    translatorOrSource: 'Muhammad Makin / Suliman (QuranEnc)',
    isTranslation: true,
    isSynthesizedNarration: false,
    provider: 'QuranEnc',
    format: 'mp3',
    baseUrl: 'https://d.quranenc.com/data/audio/chinese_suliman/',
    license: 'Non-Commercial Dawah Distribution',
    nonCommercialOnly: true,
    attributionRequired: true,
    attributionText: 'Chinese translation audio via QuranEnc.com CDN',
    coverage: 'Complete 114 Surahs (6,236 Ayahs)',
    notes: 'Studio Mandarin Chinese recitation served by QuranEnc.',
  },
];

export class TranslationAudioService {
  /**
   * Generates a 6-digit zero-padded Surah/Ayah token: e.g. Surah 1 Ayah 1 -> "001001"
   */
  public static formatAyahToken(surahNumber: number, ayahNumber: number): string {
    const s = String(surahNumber).padStart(3, '0');
    const a = String(ayahNumber).padStart(3, '0');
    return `${s}${a}`;
  }

  /**
   * Returns the direct MP3 URL for a given edition, Surah, and Ayah.
   */
  public static getAudioUrl(
    editionId: string,
    surahNumber: number,
    ayahNumber: number
  ): string | null {
    const edition = QURAN_AUDIO_EDITIONS.find((e) => e.id === editionId);
    if (!edition || edition.format !== 'mp3' || !edition.baseUrl) {
      return null;
    }
    const token = this.formatAyahToken(surahNumber, ayahNumber);
    return `${edition.baseUrl}${token}.mp3`;
  }

  /**
   * Checks whether an audio file is accessible via HEAD request.
   */
  public static async verifyAyahAudio(
    editionId: string,
    surahNumber: number,
    ayahNumber: number
  ): Promise<{ available: boolean; url: string | null; status: number }> {
    const url = this.getAudioUrl(editionId, surahNumber, ayahNumber);
    if (!url) {
      return { available: false, url: null, status: 0 };
    }
    try {
      const response = await fetch(url, { method: 'HEAD' });
      return {
        available: response.ok,
        url,
        status: response.status,
      };
    } catch {
      return { available: false, url, status: 0 };
    }
  }

  /**
   * Retrieves an edition by ID.
   */
  public static getEdition(id: string): QuranAudioEdition | undefined {
    return QURAN_AUDIO_EDITIONS.find((e) => e.id === id);
  }

  /**
   * Retrieves all available translation editions.
   */
  public static getTranslationEditions(): QuranAudioEdition[] {
    return QURAN_AUDIO_EDITIONS.filter((e) => e.isTranslation);
  }

  /**
   * Retrieves all available original Arabic reciter editions.
   */
  public static getArabicEditions(): QuranAudioEdition[] {
    return QURAN_AUDIO_EDITIONS.filter((e) => !e.isTranslation);
  }
}
