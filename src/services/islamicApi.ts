// ==============================================================================
// @deprecated IslamicAPI Client Service (RETIRED)
// This service has been retired in favor of UmmahAPI (src/services/ummahApi.ts)
// and Adhan-JS (src/services/offlinePrayerCalc.ts).
// Retained only for historical reference; not used in active application flows.
// ==============================================================================

import {
  PrayerTimesApiResponse,
  FastingApiResponse,
  ZakatNisabApiResponse,
  AsmaUlHusnaItem,
  DuaCategory,
} from '../types/islamicServices';
import { calculateOfflinePrayerTimes } from './offlinePrayerCalc';
import { cacheService } from './cacheService';

const PROXY_BASE = '/api/islamicapi';

export interface ProxyAuthStatus {
  isConfigured: boolean;
  message?: string;
}

export class IslamicApiService {
  /**
   * Checks whether the secure backend proxy has ISLAMIC_API_KEY configured.
   */
  async checkAuthStatus(): Promise<ProxyAuthStatus> {
    try {
      const res = await fetch(`${PROXY_BASE}/prayer-time/?lat=0&lon=0`, {
        method: 'HEAD',
      });
      const authHeader = res.headers.get('X-Islamic-Auth-Status');
      if (res.status === 401 && authHeader === 'UNCONFIGURED') {
        return {
          isConfigured: false,
          message: 'IslamicAPI key is not configured in .env.local',
        };
      }
      return { isConfigured: true };
    } catch {
      return {
        isConfigured: false,
        message: 'Could not connect to IslamicAPI proxy',
      };
    }
  }

  /**
   * Fetches prayer times from IslamicAPI via secure proxy.
   * If credentials are unconfigured or upstream fails, seamlessly falls back to
   * the local offline astronomical engine and labels output accordingly.
   */
  async getPrayerTimes(
    latitude: number,
    longitude: number,
    method = 1, // Default Karachi
    school = 2, // Default Hanafi
    dateStr?: string,
    shifting = 0
  ): Promise<PrayerTimesApiResponse> {
    const todayKey = dateStr || new Date().toISOString().split('T')[0];
    const cacheKey = `prayer_${latitude.toFixed(2)}_${longitude.toFixed(2)}_${method}_${school}_${todayKey}_${shifting}`;

    // Check cached data (expires daily)
    const cached = cacheService.get<PrayerTimesApiResponse>(cacheKey);
    if (cached) return cached;

    try {
      const queryParams = new URLSearchParams({
        lat: latitude.toString(),
        lon: longitude.toString(),
        method: method.toString(),
        school: school.toString(),
      });
      if (dateStr) queryParams.set('date', dateStr);
      if (shifting !== 0) queryParams.set('shifting', shifting.toString());

      const response = await fetch(`${PROXY_BASE}/prayer-time/?${queryParams.toString()}`);

      // Check if proxy returned the 401 unconfigured state
      if (response.status === 401) {
        const errJson = await response.json();
        if (errJson.status === 'API_KEY_NOT_CONFIGURED') {
          // Switch to offline calculation engine
          const offlineData = calculateOfflinePrayerTimes(latitude, longitude, method, school);
          cacheService.set(cacheKey, offlineData, 12 * 3600 * 1000); // 12-hour TTL
          return offlineData;
        }
      }

      if (!response.ok) {
        throw new Error(`IslamicAPI upstream status: ${response.status}`);
      }

      const json = await response.json();
      const liveData: PrayerTimesApiResponse = {
        ...json,
        isOfflineEstimate: false,
      };

      cacheService.set(cacheKey, liveData, 12 * 3600 * 1000);
      return liveData;
    } catch {
      // Fallback to offline astronomical engine on any network or upstream failure
      const fallbackData = calculateOfflinePrayerTimes(latitude, longitude, method, school);
      return fallbackData;
    }
  }

  /**
   * Fetches Zakat Nisab threshold.
   * If unconfigured, returns transparent educational baseline thresholds with clear labeling.
   */
  async getZakatNisab(currency = 'usd'): Promise<ZakatNisabApiResponse> {
    const cacheKey = `zakat_nisab_${currency.toLowerCase()}`;
    const cached = cacheService.get<ZakatNisabApiResponse>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${PROXY_BASE}/zakat-nisab/?standard=classical&currency=${currency}&unit=gram`);
      if (response.status === 401 || !response.ok) {
        throw new Error('Nisab API key missing or unavailable');
      }

      const json = await response.json();
      const liveResult: ZakatNisabApiResponse = {
        ...json,
        isEstimate: false,
      };
      cacheService.set(cacheKey, liveResult, 6 * 3600 * 1000); // 6-hour TTL
      return liveResult;
    } catch {
      // Educational baseline thresholds (Gold ~87.48g @ $85/g, Silver ~612.36g @ $1.05/g)
      const educationalEstimate: ZakatNisabApiResponse = {
        code: 200,
        status: 'success',
        calculation_standard: 'classical',
        currency: currency.toUpperCase(),
        weight_unit: 'gram',
        updated_at: new Date().toISOString(),
        isEstimate: true,
        data: {
          nisab_thresholds: {
            gold: {
              weight: 87.48, // 7.5 tola / 20 mithqal
              unit_price: 85.5,
              nisab_amount: 7479.54,
            },
            silver: {
              weight: 612.36, // 52.5 tola / 200 dirham
              unit_price: 1.05,
              nisab_amount: 642.98,
            },
          },
          zakat_rate: '2.5%',
          notes:
            'EDUCATIONAL BASELINE ESTIMATE: Live spot price feed is unavailable. Consult current market rates and qualified scholars for exact personal obligations.',
        },
      };
      return educationalEstimate;
    }
  }

  /**
   * Fetches Fasting and Ramadan times (Suhoor, Iftar, White Days)
   */
  async getFasting(latitude: number, longitude: number): Promise<FastingApiResponse | null> {
    try {
      const response = await fetch(`${PROXY_BASE}/fasting/?lat=${latitude}&lon=${longitude}`);
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    }
  }

  /**
   * Fetches Asma-ul-Husna (99 Divine Names)
   */
  async getAsmaUlHusna(language = 'en'): Promise<AsmaUlHusnaItem[]> {
    const cacheKey = `asma_ul_husna_${language}`;
    const cached = cacheService.get<AsmaUlHusnaItem[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${PROXY_BASE}/asma-ul-husna/?language=${language}`);
      if (!response.ok) return [];
      const json = await response.json();
      const names: AsmaUlHusnaItem[] = json.data?.names || [];
      if (names.length > 0) {
        cacheService.set(cacheKey, names, 30 * 24 * 3600 * 1000); // 30-day TTL
      }
      return names;
    } catch {
      return [];
    }
  }

  /**
   * Fetches Dua Categories
   */
  async getDuaCategories(language = 'en'): Promise<DuaCategory[]> {
    const cacheKey = `dua_categories_${language}`;
    const cached = cacheService.get<DuaCategory[]>(cacheKey);
    if (cached) return cached;

    try {
      const response = await fetch(`${PROXY_BASE}/dua/?type=category&lang=${language}`);
      if (!response.ok) return [];
      const json = await response.json();
      const categories: DuaCategory[] = json.data || [];
      if (categories.length > 0) {
        cacheService.set(cacheKey, categories, 7 * 24 * 3600 * 1000);
      }
      return categories;
    } catch {
      return [];
    }
  }
}

export const islamicApi = new IslamicApiService();
