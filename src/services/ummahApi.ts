// ==============================================================================
// UmmahAPI Client Service (Primary Islamic Provider)
// Base URL: https://ummahapi.com/api
// Zero-Key Anonymous Quota: 5,000 req / 15 min; 300 calculations / min
// ==============================================================================

import { ArabicScriptType, SurahMeta } from '../types/quran';
import {
  PrayerTimesApiResponse,
  QiblaInfo,
  ZakatNisabApiResponse,
  AsmaUlHusnaItem,
  DuaCategory,
} from '../types/islamicServices';
import { cacheService } from './cacheService';

const BASE_URL = 'https://ummahapi.com/api';

export interface UmmahZakatCalculationRequest {
  cash?: number;
  gold_grams?: number;
  silver_grams?: number;
  stocks?: number;
  business_goods?: number;
  liabilities?: number; // Exactly 'liabilities', NOT 'debts'
  nisab_standard?: 'silver' | 'gold';
  currency?: string;
}

export interface UmmahZakatCalculationResponse {
  zakat_due: number;
  zakat_due_formatted: string;
  above_nisab: boolean;
  nisab_standard: 'silver' | 'gold';
  nisab_value: number;
  rate: string;
  breakdown: {
    cash: number;
    gold_value: number;
    silver_value: number;
    stocks: number;
    business_goods: number;
    liabilities: number;
    gross_wealth: number;
    net_zakatable_wealth: number;
  };
  prices_used: {
    gold_price_per_gram: number;
    silver_price_per_gram: number;
    source: string;
    as_of: string;
  };
  note?: string;
}

export interface UmmahWordToken {
  position: number;
  arabic: string;
  transliteration?: { text: string };
  translation: string;
  type: string;
}

export interface UmmahHadithItem {
  id: string;
  collection: string;
  collection_name: string;
  hadithnumber: number;
  arabic: string;
  english: string;
  grade?: string;
}

export class UmmahApiService {
  /**
   * Health Check
   */
  async getHealth(): Promise<{ status: string; uptime: number; version: string } | null> {
    try {
      const res = await fetch(`${BASE_URL}/health`);
      if (!res.ok) return null;
      return await res.json();
    } catch {
      return null;
    }
  }

  /**
   * 114 Surahs Directory
   */
  async getSurahs(): Promise<SurahMeta[]> {
    const cacheKey = 'ummah_surahs_list_v1';
    const cached = cacheService.get<SurahMeta[]>(cacheKey);
    if (cached) return cached;

    const res = await fetch(`${BASE_URL}/quran/surahs`);
    if (!res.ok) throw new Error(`UmmahAPI error: ${res.statusText}`);
    const json = await res.json();

    const mapped: SurahMeta[] = json.data.surahs.map((s: any) => ({
      number: s.number,
      name: s.name_arabic || s.name,
      nameArabic: s.name_arabic,
      englishName: s.name_english || s.english_name,
      englishNameTranslation: s.name_translation || s.english_name_translation,
      numberOfAyahs: s.verses_count || s.numberOfAyahs,
      revelationType: s.revelation_place === 'makkah' || s.revelation_place === 'Meccan' ? 'Meccan' : 'Medinan',
    }));

    cacheService.set(cacheKey, mapped, 7 * 24 * 3600 * 1000);
    return mapped;
  }

  /**
   * Full Surah with requested script and translation
   */
  async getSurah(
    surahNumber: number,
    script: ArabicScriptType = 'uthmani',
    translation = 'sahih_international'
  ): Promise<any> {
    const cacheKey = `ummah_surah_${surahNumber}_${script}_${translation}`;
    const cached = await cacheService.getIndexedDB<any>(cacheKey);
    if (cached) return cached;

    const query = new URLSearchParams();
    if (script) query.set('script', script);
    if (translation) query.set('translation', translation);

    const url = `${BASE_URL}/quran/surah/${surahNumber}?${query.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch Surah ${surahNumber} from UmmahAPI: ${res.status}`);

    const json = await res.json();
    const data = json.data;

    await cacheService.setIndexedDB(cacheKey, data);
    return data;
  }

  /**
   * Word-by-Word Quran breakdown for a verse
   */
  async getWords(surah: number, ayah: number): Promise<UmmahWordToken[]> {
    const cacheKey = `ummah_words_${surah}_${ayah}`;
    const cached = cacheService.get<UmmahWordToken[]>(cacheKey);
    if (cached) return cached;

    const res = await fetch(`${BASE_URL}/quran/words/${surah}/${ayah}`);
    if (!res.ok) return [];

    const json = await res.json();
    const words: UmmahWordToken[] = json.data?.words || [];
    if (words.length > 0) {
      cacheService.set(cacheKey, words, 30 * 24 * 3600 * 1000); // 30d TTL
    }
    return words;
  }

  /**
   * 15-Line Traditional Mushaf Page
   */
  async getMushafPage(pageNumber: number): Promise<any> {
    const cacheKey = `ummah_mushaf_page_${pageNumber}`;
    const cached = await cacheService.getIndexedDB<any>(cacheKey);
    if (cached) return cached;

    const res = await fetch(`${BASE_URL}/quran/page/${pageNumber}`);
    if (!res.ok) throw new Error(`Failed to fetch page ${pageNumber}`);

    const json = await res.json();
    const data = json.data;
    await cacheService.setIndexedDB(cacheKey, data);
    return data;
  }

  /**
   * Quran Search
   */
  async search(query: string, translation = 'sahih_international'): Promise<any[]> {
    if (!query || !query.trim()) return [];
    const url = `${BASE_URL}/quran/search?q=${encodeURIComponent(query.trim())}&translation=${translation}`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data?.results || [];
  }

  /**
   * Prayer Times (Uses lng, not lon; method: Karachi, Jafari, etc.; madhab: Hanafi, Shafi)
   */
  async getPrayerTimes(
    lat: number,
    lng: number,
    timezone = 'Asia/Kolkata',
    method = 'Karachi',
    madhab = 'Hanafi',
    dateStr?: string
  ): Promise<PrayerTimesApiResponse> {
    const dateKey = dateStr || new Date().toISOString().split('T')[0];
    const cacheKey = `ummah_pt_${lat.toFixed(2)}_${lng.toFixed(2)}_${method}_${madhab}_${dateKey}`;
    const cached = cacheService.get<PrayerTimesApiResponse>(cacheKey);
    if (cached) return cached;

    const query = new URLSearchParams({
      lat: lat.toString(),
      lng: lng.toString(), // Important: UmmahAPI expects lng
      timezone: timezone,
      method: method,
      madhab: madhab,
    });
    if (dateStr) query.set('date', dateStr);

    const res = await fetch(`${BASE_URL}/prayer-times?${query.toString()}`);
    if (!res.ok) throw new Error(`UmmahAPI prayer times error: ${res.status}`);

    const json = await res.json();
    const d = json.data;

    // Normalize to platform's PrayerTimesApiResponse interface
    const response: PrayerTimesApiResponse = {
      code: 200,
      status: 'success',
      isOfflineEstimate: false,
      calculationMethodName: d.calculation_method,
      schoolName: d.madhab,
      timezone: {
        name: d.timezone,
        utc_offset: '',
        abbreviation: '',
      },
      data: {
        times: {
          Fajr: d.prayer_times.fajr,
          Sunrise: d.prayer_times.sunrise,
          Dhuhr: d.prayer_times.dhuhr,
          Asr: d.prayer_times.asr,
          Sunset: d.prayer_times.maghrib,
          Maghrib: d.prayer_times.maghrib,
          Isha: d.prayer_times.isha,
          Imsak: d.prayer_times.imsak,
        },
        date: {
          readable: d.date,
          hijri: {
            day: '',
            year: '',
            month: { en: '', ar: '' },
          },
        },
      },
    };

    cacheService.set(cacheKey, response, 12 * 3600 * 1000); // 12-hour TTL
    return response;
  }

  /**
   * Qibla Direction & Bearing
   */
  async getQibla(lat: number, lng: number): Promise<QiblaInfo> {
    const cacheKey = `ummah_qibla_${lat.toFixed(2)}_${lng.toFixed(2)}`;
    const cached = cacheService.get<QiblaInfo>(cacheKey);
    if (cached) return cached;

    const res = await fetch(`${BASE_URL}/qibla?lat=${lat}&lng=${lng}`);
    if (!res.ok) throw new Error(`Qibla fetch failed: ${res.status}`);

    const json = await res.json();
    const d = json.data;

    const qibla: QiblaInfo = {
      direction: {
        degrees: d.qibla_direction,
        from: 'North',
        clockwise: true,
      },
      distance: {
        value: d.distance_km,
        unit: 'km',
      },
    };

    cacheService.set(cacheKey, qibla, 30 * 24 * 3600 * 1000);
    return qibla;
  }

  /**
   * Live Zakat Nisab & Spot Prices from gold-api.com
   */
  async getZakatNisab(currency = 'USD'): Promise<ZakatNisabApiResponse> {
    const cacheKey = `ummah_zakat_nisab_${currency.toUpperCase()}`;
    const cached = cacheService.get<ZakatNisabApiResponse>(cacheKey);
    if (cached) return cached;

    const res = await fetch(`${BASE_URL}/zakat/nisab?currency=${currency}`);
    if (!res.ok) throw new Error(`Zakat Nisab failed: ${res.status}`);

    const json = await res.json();
    const d = json.data;

    const normalized: ZakatNisabApiResponse = {
      code: 200,
      status: 'success',
      calculation_standard: 'classical',
      currency: d.currency,
      weight_unit: 'gram',
      updated_at: d.prices_used?.as_of || new Date().toISOString(),
      isEstimate: false,
      data: {
        nisab_thresholds: {
          gold: {
            weight: d.gold.threshold_grams, // 85g
            unit_price: d.gold.price_per_gram,
            nisab_amount: d.gold.monetary_value,
          },
          silver: {
            weight: d.silver.threshold_grams, // 595g
            unit_price: d.silver.price_per_gram,
            nisab_amount: d.silver.monetary_value,
          },
        },
        zakat_rate: '2.5%',
        notes: `Live spot feed from ${d.prices_used?.source || 'gold-api.com'}. ${d.note || ''}`,
      },
    };

    cacheService.set(cacheKey, normalized, 15 * 60 * 1000); // 15-minute spot cache
    return normalized;
  }

  /**
   * Accurate Multi-Asset Zakat Calculation via POST /api/zakat/calculate
   * Fixes parameter discrepancy by explicitly mapping 'liabilities' and 'nisab_standard'.
   */
  async calculateZakat(req: UmmahZakatCalculationRequest): Promise<UmmahZakatCalculationResponse> {
    const payload = {
      cash: req.cash || 0,
      gold_grams: req.gold_grams || 0,
      silver_grams: req.silver_grams || 0,
      stocks: req.stocks || 0,
      business_goods: req.business_goods || 0,
      liabilities: req.liabilities || 0, // Explicitly 'liabilities'
      nisab_standard: req.nisab_standard || 'silver',
      currency: req.currency || 'USD',
    };

    const res = await fetch(`${BASE_URL}/zakat/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      throw new Error(`Zakat calculation API returned: ${res.status}`);
    }

    const json = await res.json();
    return json.data;
  }

  /**
   * Hadith Collections & Specific Hadith
   */
  async getHadith(collection: string, number: number): Promise<UmmahHadithItem | null> {
    const cacheKey = `ummah_hadith_${collection}_${number}`;
    const cached = cacheService.get<UmmahHadithItem>(cacheKey);
    if (cached) return cached;

    try {
      const res = await fetch(`${BASE_URL}/hadith/${collection}/${number}`);
      if (!res.ok) return null;
      const json = await res.json();
      const item: UmmahHadithItem = json.data;
      cacheService.set(cacheKey, item, 30 * 24 * 3600 * 1000);
      return item;
    } catch {
      return null;
    }
  }

  /**
   * Duas Categories & Items
   */
  async getDuasCategories(): Promise<DuaCategory[]> {
    const cacheKey = 'ummah_duas_categories';
    const cached = cacheService.get<DuaCategory[]>(cacheKey);
    if (cached) return cached;

    const res = await fetch(`${BASE_URL}/duas/categories`);
    if (!res.ok) return [];

    const json = await res.json();
    const categories: DuaCategory[] = (json.data?.categories || []).map((c: any) => ({
      name: c.name,
      url: c.id,
      meta: `${c.count} supplications`,
    }));

    cacheService.set(cacheKey, categories, 7 * 24 * 3600 * 1000);
    return categories;
  }

  /**
   * 99 Names of Allah
   */
  async getAsmaUlHusna(): Promise<AsmaUlHusnaItem[]> {
    const cacheKey = 'ummah_asma_ul_husna_all';
    const cached = cacheService.get<AsmaUlHusnaItem[]>(cacheKey);
    if (cached) return cached;

    const res = await fetch(`${BASE_URL}/asma-ul-husna`);
    if (!res.ok) return [];

    const json = await res.json();
    const names: AsmaUlHusnaItem[] = (json.data?.names || []).map((n: any) => ({
      number: n.number,
      name: n.arabic,
      transliteration: n.transliteration,
      translation: n.english,
      meaning: n.meaning,
    }));

    cacheService.set(cacheKey, names, 30 * 24 * 3600 * 1000);
    return names;
  }

  /**
   * Moon Sighting & Lunar Calendar
   */
  async getMoonSighting(): Promise<any> {
    const res = await fetch(`${BASE_URL}/moon`);
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  }
}

export const ummahApi = new UmmahApiService();
