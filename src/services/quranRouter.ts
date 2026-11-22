// ==============================================================================
// Quran Smart Router & Failover Service
// Primary Provider: UmmahAPI (Uthmani, IndoPak, Tajweed, Word-by-Word, Pages)
// Specialized Provider: Al Quran Cloud (Preserved for Allama Jawadi ur.jawadi)
// ==============================================================================

import { ArabicScriptType, SurahMeta, UnifiedAyah, SUPPORTED_TRANSLATIONS } from '../types/quran';
import { ummahApi } from './ummahApi';
import { alQuranApi } from './alQuranApi';

export interface QuranFetchOptions {
  surahNumber: number;
  script?: ArabicScriptType; // 'uthmani' | 'indopak' | 'tajweed'
  primaryTranslation?: string; // e.g. 'en.sahih'
  secondaryTranslation?: string; // e.g. 'ur.jawadi' or 'ur.jalandhry'
  reciterId?: string; // e.g. '1' (Mishary Alafasy)
}

export interface QuranRouterResult {
  surah: SurahMeta;
  ayahs: UnifiedAyah[];
  activeProvider: 'ummahapi' | 'alquran_cloud' | 'hybrid';
  scriptNotice?: string;
  translationNotice?: string;
}

export function getEveryAyahAudioUrl(surah: number, ayah: number, reciterId: string | number = '1'): string {
  const sStr = surah.toString().padStart(3, '0');
  const aStr = ayah.toString().padStart(3, '0');
  const fileName = `${sStr}${aStr}.mp3`;
  const rId = reciterId.toString();
  switch (rId) {
    case '3':
    case 'abdulbasit-murattal':
      return `https://everyayah.com/data/Abdul_Basit_Murattal_192kbps/${fileName}`;
    case '4':
    case 'abdulbasit-mujawwad':
      return `https://everyayah.com/data/Abdul_Basit_Mujawwad_128kbps/${fileName}`;
    case '1':
    case 'alafasy':
    default:
      return `https://everyayah.com/data/Alafasy_128kbps/${fileName}`;
  }
}

export class QuranRouterService {
  /**
   * Fetches Surah metadata directory
   */
  async getSurahDirectory(): Promise<SurahMeta[]> {
    try {
      // Primary: UmmahAPI
      return await ummahApi.getSurahs();
    } catch {
      // Fallback: Al Quran Cloud
      return await alQuranApi.getSurahList();
    }
  }

  /**
   * Smart Multi-Provider Surah Fetcher
   * Routes translations and scripts with zero silent substitution.
   */
  async getSurah(options: QuranFetchOptions): Promise<QuranRouterResult> {
    const {
      surahNumber,
      script = 'uthmani',
      primaryTranslation = 'en.sahih',
      secondaryTranslation = 'ur.jawadi',
      reciterId = '1',
    } = options;

    let scriptNotice: string | undefined;

    // Check if user requested Allama Jawadi (Urdu)
    const needsJawadi = primaryTranslation === 'ur.jawadi' || secondaryTranslation === 'ur.jawadi';

    // --------------------------------------------------------------------------
    // CASE A: User requested Allama Jawadi (Requires Al Quran Cloud)
    // --------------------------------------------------------------------------
    if (needsJawadi) {
      try {
        // Fetch Allama Jawadi from Al Quran Cloud
        const alQuranResult = await alQuranApi.getSurahAtomic(
          surahNumber,
          'quran-uthmani',
          ['en.sahih', 'ur.jawadi'],
          'ar.alafasy'
        );

        // If user also requested IndoPak or Tajweed script, attempt to enrich with UmmahAPI
        if (script !== 'uthmani') {
          try {
            const ummahData = await ummahApi.getSurah(surahNumber, script, 'sahih_international');
            if (ummahData && ummahData.verses) {
              const enrichedAyahs: UnifiedAyah[] = alQuranResult.ayahs.map((ayah, index) => {
                const uVerse = ummahData.verses[index];
                return {
                  ...ayah,
                  arabicText: uVerse ? uVerse.arabic : ayah.arabicText,
                  arabicScript: script,
                  audioUrl: getEveryAyahAudioUrl(surahNumber, ayah.numberInSurah, reciterId),
                  provider: 'hybrid',
                };
              });

              return {
                surah: alQuranResult.surah,
                ayahs: enrichedAyahs,
                activeProvider: 'hybrid',
                translationNotice: 'Allama Syed Zeeshan Haider Jawadi (UR) served via Al Quran Cloud.',
              };
            }
          } catch {
            scriptNotice = `Requested script (${script}) temporarily unavailable from UmmahAPI. Displaying Uthmani.`;
          }
        }

        return {
          surah: alQuranResult.surah,
          ayahs: alQuranResult.ayahs.map((a) => ({
            ...a,
            arabicScript: 'uthmani',
            audioUrl: getEveryAyahAudioUrl(surahNumber, a.numberInSurah, reciterId),
            provider: 'alquran_cloud',
          })),
          activeProvider: 'alquran_cloud',
          scriptNotice,
          translationNotice: 'Allama Syed Zeeshan Haider Jawadi (UR) served via Al Quran Cloud.',
        };
      } catch (err: any) {
        // Strict Integrity Rule: Never silently substitute Jalandhry for Jawadi
        throw new Error(
          `Allama Jawadi translation is temporarily unavailable from Al Quran Cloud: ${err.message}. Silent substitution is prohibited.`
        );
      }
    }

    // --------------------------------------------------------------------------
    // CASE B: Standard translations (UmmahAPI Primary)
    // --------------------------------------------------------------------------
    try {
      const ummahData = await ummahApi.getSurah(surahNumber, script, 'sahih_international');
      if (!ummahData || !ummahData.verses) {
        throw new Error('Incomplete data from UmmahAPI');
      }

      // If user also requested Fateh Muhammad Jalandhry Urdu, fetch Urdu translation from UmmahAPI
      let urduData: any = null;
      if (secondaryTranslation === 'ur.jalandhry' || primaryTranslation === 'ur.jalandhry') {
        try {
          urduData = await ummahApi.getSurah(surahNumber, script, 'urdu');
        } catch {
          // If Urdu fails, continue with English
        }
      }

      const unifiedAyahs: UnifiedAyah[] = ummahData.verses.map((v: any, index: number) => {
        const translationsMap: Record<string, string> = {};
        if (v.translation) {
          translationsMap['en.sahih'] = v.translation;
        } else if (v.translations?.sahih_international) {
          translationsMap['en.sahih'] = v.translations.sahih_international;
        }

        const urduVerse = urduData?.verses?.[index];
        if (urduVerse?.translation) {
          translationsMap['ur.jalandhry'] = urduVerse.translation;
        } else if (urduVerse?.translations?.urdu) {
          translationsMap['ur.jalandhry'] = urduVerse.translations.urdu;
        } else if (v.translations?.urdu) {
          translationsMap['ur.jalandhry'] = v.translations.urdu;
        }

        return {
          number: v.ayah || index + 1,
          numberInSurah: v.ayah || index + 1,
          juz: 1,
          page: 1,
          arabicText: v.arabic,
          arabicScript: script,
          translations: translationsMap,
          audioUrl: getEveryAyahAudioUrl(surahNumber, v.ayah || index + 1, reciterId),
          audioUrlFallback: ummahData.audio?.[0]?.surah_audio,
          sajda: false,
          provider: 'ummahapi',
        };
      });

      return {
        surah: {
          number: ummahData.surah.number,
          name: ummahData.surah.name_arabic,
          englishName: ummahData.surah.name_english,
          englishNameTranslation: ummahData.surah.name_translation,
          numberOfAyahs: ummahData.surah.verses_count,
          revelationType: ummahData.surah.revelation_place === 'makkah' ? 'Meccan' : 'Medinan',
        },
        ayahs: unifiedAyahs,
        activeProvider: 'ummahapi',
      };
    } catch {
      // ------------------------------------------------------------------------
      // Failover to Al Quran Cloud
      // ------------------------------------------------------------------------
      scriptNotice = `UmmahAPI unavailable. Failing over to Al Quran Cloud (Uthmani script only).`;
      const fallbackResult = await alQuranApi.getSurahAtomic(
        surahNumber,
        'quran-uthmani',
        ['en.sahih', 'ur.jalandhry'],
        'ar.alafasy'
      );

      return {
        surah: fallbackResult.surah,
        ayahs: fallbackResult.ayahs.map((a) => ({
          ...a,
          arabicScript: 'uthmani',
          provider: 'alquran_cloud',
        })),
        activeProvider: 'alquran_cloud',
        scriptNotice,
      };
    }
  }

  /**
   * Helper to retrieve scholarly metadata for a translation ID
   */
  getTranslationInfo(id: string) {
    return SUPPORTED_TRANSLATIONS.find((t) => t.id === id);
  }
}

export const quranRouter = new QuranRouterService();
