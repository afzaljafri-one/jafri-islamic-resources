// ==============================================================================
// Al Quran Cloud API Service (Primary Provider — Direct HTTPS)
// ==============================================================================

import {
  SurahMeta,
  SurahEditionResponse,
  UnifiedAyah,
  QuranSearchResultMatch,
} from '../types/quran';
import { cacheService } from './cacheService';

const ALQURAN_CLOUD_BASE = 'https://api.alquran.cloud/v1';

export class AlQuranApiService {
  /**
   * Fetches metadata for all 114 Surahs
   */
  async getSurahList(): Promise<SurahMeta[]> {
    const cacheKey = 'alquran_surah_list_v1';
    const cached = cacheService.get<SurahMeta[]>(cacheKey);
    if (cached) return cached;

    const response = await fetch(`${ALQURAN_CLOUD_BASE}/surah`);
    if (!response.ok) {
      throw new Error(`Al Quran Cloud error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    const data: SurahMeta[] = json.data;
    cacheService.set(cacheKey, data, 7 * 24 * 3600 * 1000); // 7-day TTL
    return data;
  }

  /**
   * High-Performance Atomic Multi-Edition Fetch
   * Retrieves Arabic Uthmani text, translations, and audio URLs in a SINGLE atomic HTTP request.
   */
  async getSurahAtomic(
    surahNumber: number,
    arabicEdition = 'quran-uthmani',
    translationEditions: string[] = ['en.sahih', 'ur.jawadi'],
    audioEdition = 'ar.alafasy'
  ): Promise<{ surah: SurahMeta; ayahs: UnifiedAyah[] }> {
    const editionsList = [arabicEdition, ...translationEditions, audioEdition].filter(Boolean);
    const editionsParam = editionsList.join(',');
    const cacheKey = `alquran_surah_${surahNumber}_${editionsParam}`;

    const cached = await cacheService.getIndexedDB<{ surah: SurahMeta; ayahs: UnifiedAyah[] }>(cacheKey);
    if (cached) return cached;

    const url = `${ALQURAN_CLOUD_BASE}/surah/${surahNumber}/editions/${editionsParam}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch atomic surah ${surahNumber}: ${response.statusText}`);
    }

    const json = await response.json();
    const editionResults: SurahEditionResponse[] = json.data;

    if (!editionResults || editionResults.length === 0) {
      throw new Error('No data received from Al Quran Cloud');
    }

    const arabicData = editionResults.find((e) => e.edition.identifier === arabicEdition) || editionResults[0];
    const audioData = editionResults.find((e) => e.edition.identifier === audioEdition);
    const translationDataList = editionResults.filter(
      (e) => e.edition.type === 'translation' || translationEditions.includes(e.edition.identifier)
    );

    const ayahsCount = arabicData.ayahs.length;
    const unifiedAyahs: UnifiedAyah[] = [];

    for (let i = 0; i < ayahsCount; i++) {
      const arAyah = arabicData.ayahs[i];
      const audioAyah = audioData ? audioData.ayahs[i] : undefined;

      const translationsMap: Record<string, string> = {};
      translationDataList.forEach((t) => {
        if (t.ayahs[i]) {
          translationsMap[t.edition.identifier] = t.ayahs[i].text;
        }
      });

      unifiedAyahs.push({
        number: arAyah.number,
        numberInSurah: arAyah.numberInSurah,
        juz: arAyah.juz,
        page: arAyah.page,
        arabicText: arAyah.text,
        arabicScript: 'uthmani',
        translations: translationsMap,
        audioUrl: audioAyah?.audio,
        audioUrlFallback: audioAyah?.audioSecondary?.[0],
        sajda: Boolean(arAyah.sajda),
        provider: 'alquran_cloud',
      });
    }

    const result = {
      surah: {
        number: arabicData.number,
        name: arabicData.name,
        englishName: arabicData.englishName,
        englishNameTranslation: arabicData.englishNameTranslation,
        numberOfAyahs: arabicData.numberOfAyahs,
        revelationType: arabicData.revelationType,
      },
      ayahs: unifiedAyahs,
    };

    // Cache permanently in IndexedDB (Quran text is immutable)
    await cacheService.setIndexedDB(cacheKey, result);
    return result;
  }

  /**
   * Search across the Quran with graceful 404 normalization
   */
  async search(query: string, surah = 'all', edition = 'en.sahih'): Promise<QuranSearchResultMatch[]> {
    if (!query || query.trim().length === 0) return [];

    const url = `${ALQURAN_CLOUD_BASE}/search/${encodeURIComponent(query.trim())}/${surah}/${edition}`;
    const response = await fetch(url);

    // Al Quran Cloud quirk: 404 means no matches found
    if (response.status === 404) {
      return [];
    }

    if (!response.ok) {
      throw new Error(`Search error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();
    return json.data?.matches || [];
  }
}

export const alQuranApi = new AlQuranApiService();
