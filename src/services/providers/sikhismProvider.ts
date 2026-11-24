// ==============================================================================
// Sikhism Scripture Provider (BaniDB & GurbaniNow Integration)
// Sri Guru Granth Sahib Ji — 1,430 Angs
// Jafri Religious Books & Audio Platform
// ==============================================================================

import { SearchResultMatch } from '../../platform/types';
import { cacheService } from '../cacheService';
import { OFFLINE_ANGS_1_TO_13 } from './sikhismOfflineAngs';

export interface GurbaniLine {
  verseId: number;
  shabadId: number;
  lineNo: number;
  pageNo: number;
  gurmukhi: string;
  larivaar: string;
  transliteration: string;
  translationEn: string;
  translationMs?: string;
  translationPu?: string;
  writer: string;
  raag: string;
}

export interface AngData {
  pageNo: number;
  raag: string;
  writer: string;
  lines: GurbaniLine[];
}

class SikhismProvider {
  private angCache: Record<number, AngData> = {
    ...OFFLINE_ANGS_1_TO_13,
  };

  async getAng(pageNumber: number): Promise<AngData> {
    const pageNo = Math.max(1, Math.min(1430, Math.floor(pageNumber)));
    if (this.angCache[pageNo]) {
      return this.angCache[pageNo];
    }

    // Tier 2: Persistent IndexedDB cache
    try {
      const cached = await cacheService.getIndexedDB<AngData>(`sikh_ang_${pageNo}`);
      if (cached && cached.lines && cached.lines.length > 0) {
        this.angCache[pageNo] = cached;
        return cached;
      }
    } catch {
      // Continue to API fetch
    }

    try {
      const res = await fetch(`https://api.banidb.com/v2/angs/${pageNo}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const lines: GurbaniLine[] = (data.page || []).map((item: any) => ({
        verseId: item.verseId || 0,
        shabadId: item.shabadId || 0,
        lineNo: item.lineNo || 1,
        pageNo: item.pageNo || pageNo,
        gurmukhi: item.verse?.unicode || item.verse?.gurmukhi || '',
        larivaar: item.larivaar?.unicode || item.larivaar?.gurmukhi || '',
        transliteration:
          item.transliteration?.english || item.transliteration?.en || '',
        translationEn:
          item.translation?.en?.ssk || item.translation?.en?.bdb || '',
        translationMs: item.translation?.en?.ms || '',
        translationPu: item.translation?.pu?.ss?.unicode || '',
        writer: item.writer?.english || 'Sikh Gurus & Bhagats',
        raag: item.raag?.english || 'Sri Guru Granth Sahib Ji',
      }));

      const angData: AngData = {
        pageNo,
        raag: lines[0]?.raag || 'Gurbani',
        writer: lines[0]?.writer || 'Sikh Gurus & Bhagats',
        lines,
      };

      this.angCache[pageNo] = angData;
      await cacheService.setIndexedDB(`sikh_ang_${pageNo}`, angData);
      return angData;
    } catch {
      // Fallback to GurbaniNow API
      try {
        const res2 = await fetch(`https://api.gurbaninow.com/v2/ang/${pageNo}`);
        if (!res2.ok) throw new Error(`HTTP ${res2.status}`);
        const data2 = await res2.json();

        const lines: GurbaniLine[] = (data2.page || []).map((item: any) => ({
          verseId: item.verse?.id || 0,
          shabadId: item.shabad_id || 0,
          lineNo: item.line_number || 1,
          pageNo: pageNo,
          gurmukhi: item.verse?.unicode || '',
          larivaar: item.larivaar?.unicode || '',
          transliteration: item.transliteration?.english || '',
          translationEn: item.translation?.en?.bdb || '',
          writer: item.writer?.english || '',
          raag: item.raag?.english || '',
        }));

        const angData: AngData = {
          pageNo,
          raag: lines[0]?.raag || 'Gurbani',
          writer: lines[0]?.writer || 'Sikh Gurus & Bhagats',
          lines,
        };

        this.angCache[pageNo] = angData;
        await cacheService.setIndexedDB(`sikh_ang_${pageNo}`, angData);
        return angData;
      } catch {
        // Return structured offline corpus for Angs 1 to 13 if network is offline
        if (OFFLINE_ANGS_1_TO_13[pageNo]) {
          return OFFLINE_ANGS_1_TO_13[pageNo];
        }
        return { pageNo, raag: 'Gurbani', writer: 'Sikh Gurus', lines: [] };
      }
    }
  }

  async search(query: string): Promise<SearchResultMatch[]> {
    if (!query.trim()) return [];
    try {
      const res = await fetch(
        `https://api.banidb.com/v2/search/${encodeURIComponent(
          query.trim()
        )}?searchtype=1`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      return (data.verses || []).slice(0, 25).map((v: any) => ({
        unitId: `sikhism:sggs:${v.verseId}`,
        address: {
          religionId: 'sikhism',
          collectionId: 'sggs',
          path: [
            { levelName: 'Raag', identifier: v.raag?.raagId || 1, label: v.raag?.english },
            { levelName: 'Ang', identifier: v.pageNo, label: `Ang ${v.pageNo}` },
          ],
          unitIdentifier: v.lineNo,
        },
        displayTitle: `Ang ${v.pageNo} • ${v.raag?.english || 'SGGS'} (Line ${v.lineNo})`,
        matchedField: 'translation',
        matchedSnippet:
          v.translation?.en?.ssk || v.verse?.unicode || 'Gurbani Shabad',
      }));
    } catch {
      return [];
    }
  }
}

export const sikhismProvider = new SikhismProvider();
