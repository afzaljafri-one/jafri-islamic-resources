// ==============================================================================
// Buddhism Scripture Provider (Phase 1 Content Expansion)
// Tripitaka, Dhammapada, Suttas & Sutras (First Sermon, Heart Sutra),
// Karaniya Metta Sutta, Maha Mangala Sutta, Chants & Parittas,
// Meditation Instructions (Anapanasati), Guided Contemplations, Festival Liturgy
// Full Distinction of Theravada, Mahayana, and Vajrayana
// SuttaCentral Bilara CC0 Public Domain & Classical Translations
// Jafri Religious Books & Audio Platform
// ==============================================================================

import { SearchResultMatch } from '../../platform/types';
import {
  BUDDHISM_COLLECTIONS,
  BuddhismCollectionMeta,
} from './buddhism/buddhismCollections';
import {
  BUDDHISM_TEXT_DATA,
  BuddhismVerseUnit,
  AudioProvenanceInfo,
} from './buddhism/buddhismTextData';

export { BUDDHISM_COLLECTIONS, BUDDHISM_TEXT_DATA };
export type { BuddhismCollectionMeta, BuddhismVerseUnit, AudioProvenanceInfo };

// Backward-compatible alias interfaces
export interface SuttaMeta extends BuddhismCollectionMeta {
  uid: string;
  titlePali: string;
  titleEn: string;
  pitaka: any;
  nikaya: any;
}

export interface SuttaSegment {
  segmentId: string;
  paliText: string;
  englishText: string;
  comment?: string;
  audio?: AudioProvenanceInfo;
}

export const CANONICAL_SUTTAS: SuttaMeta[] = BUDDHISM_COLLECTIONS.map((c) => ({
  ...c,
  uid: c.id,
  titlePali: c.nativeTitle,
  titleEn: c.title,
  pitaka: 'Sutta Pitaka' as const,
  nikaya: 'Khuddaka' as const,
}));

class BuddhismProvider {
  private suttaCache: Record<string, SuttaSegment[]> = {};

  getCollections(): BuddhismCollectionMeta[] {
    return BUDDHISM_COLLECTIONS;
  }

  getCollection(id: string): BuddhismCollectionMeta | undefined {
    return BUDDHISM_COLLECTIONS.find((c) => c.id === id);
  }

  getCollectionUnits(collectionId: string): BuddhismVerseUnit[] {
    return BUDDHISM_TEXT_DATA[collectionId] || [];
  }

  getSuttas(): SuttaMeta[] {
    return CANONICAL_SUTTAS;
  }

  getSutta(uid: string): SuttaMeta | undefined {
    return CANONICAL_SUTTAS.find((s) => s.uid === uid);
  }

  async getSuttaSegments(uid: string): Promise<SuttaSegment[]> {
    if (this.suttaCache[uid]) {
      return this.suttaCache[uid];
    }

    // 1. Check local authentic corpus first
    const localUnits = BUDDHISM_TEXT_DATA[uid];
    if (localUnits && localUnits.length > 0) {
      const segs: SuttaSegment[] = localUnits.map((u) => ({
        segmentId: String(u.unitNumber),
        paliText: u.originalText,
        englishText: u.translationEn,
        comment: u.sectionTitle,
        audio: u.audio,
      }));
      this.suttaCache[uid] = segs;
      return segs;
    }

    // 2. Try fetching from SuttaCentral Bilara API if UID matches SuttaCentral pattern
    if (uid.includes('sn') || uid.includes('mn') || uid.includes('dn') || uid.includes('dhp')) {
      try {
        const [rootRes, transRes] = await Promise.all([
          fetch(`https://suttacentral.net/api/bilarasuttas/${uid}/sujato?lang=pli`),
          fetch(`https://suttacentral.net/api/bilarasuttas/${uid}/sujato?lang=en`),
        ]);

        if (rootRes.ok && transRes.ok) {
          const rootData = await rootRes.json();
          const transData = await transRes.json();

          const rootMap: Record<string, string> = rootData.root_text || {};
          const transMap: Record<string, string> = transData.translation_text || {};

          const segments: SuttaSegment[] = [];
          for (const key of Object.keys(rootMap)) {
            if (rootMap[key] || transMap[key]) {
              segments.push({
                segmentId: key,
                paliText: rootMap[key] || '',
                englishText: transMap[key] || '',
              });
            }
          }

          if (segments.length > 0) {
            this.suttaCache[uid] = segments;
            return segments;
          }
        }
      } catch (err) {
        console.warn(`SuttaCentral API fetch failed for ${uid}, using fallback corpus:`, err);
      }
    }

    // 3. Fallback to first available collection
    const defaultCol = BUDDHISM_TEXT_DATA['suttas_sutras'] || [];
    return defaultCol.map((u) => ({
      segmentId: String(u.unitNumber),
      paliText: u.originalText,
      englishText: u.translationEn,
    }));
  }

  async search(query: string): Promise<SearchResultMatch[]> {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const matches: SearchResultMatch[] = [];

    for (const col of BUDDHISM_COLLECTIONS) {
      if (
        col.title.toLowerCase().includes(q) ||
        col.nativeTitle.includes(q) ||
        col.summary.toLowerCase().includes(q) ||
        col.tradition.toLowerCase().includes(q) ||
        col.category.toLowerCase().includes(q)
      ) {
        matches.push({
          unitId: `buddhism:${col.id}`,
          address: {
            religionId: 'buddhism',
            collectionId: col.id,
            path: [{ levelName: 'Collection', identifier: col.id, label: col.title }],
            unitIdentifier: 1,
          },
          displayTitle: `${col.title} (${col.nativeTitle})`,
          matchedField: 'translation',
          matchedSnippet: col.summary,
        });
      }

      const units = BUDDHISM_TEXT_DATA[col.id] || [];
      for (const u of units) {
        if (
          u.originalText.includes(q) ||
          u.translationEn.toLowerCase().includes(q) ||
          (u.translationHi && u.translationHi.includes(q))
        ) {
          matches.push({
            unitId: `buddhism:${col.id}:${u.id}`,
            address: {
              religionId: 'buddhism',
              collectionId: col.id,
              path: [{ levelName: 'Collection', identifier: col.id, label: col.title }],
              unitIdentifier: u.unitNumber,
            },
            displayTitle: `${col.title} — ${u.unitNumber}`,
            matchedField: u.originalText.includes(q) ? 'root' : 'translation',
            matchedSnippet: u.translationEn.slice(0, 140) + '...',
          });
        }
      }
    }

    return matches;
  }
}

export const buddhismProvider = new BuddhismProvider();
