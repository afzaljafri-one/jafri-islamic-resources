// ==============================================================================
// Jainism Scripture Provider (Phase 1 Content Expansion)
// Namokar Mantra, Bhaktamar Stotra (Shvetambara & Digambara Recensions),
// Jain Agamas, Uttaradhyayana Sutra, Kalpa Sutra, Pratikraman, Samayik,
// Devotional Hymns (Meri Bhavana), Tirthankar Teachings
// Hermann Jacobi Translations (SBE Vols. 22 & 45 — Public Domain)
// Zero AI-Generated Translations
// Jafri Religious Books & Audio Platform
// ==============================================================================

import { SearchResultMatch } from '../../platform/types';
import {
  JAINISM_COLLECTIONS,
  JainCollectionMeta,
} from './jainism/jainismCollections';
import {
  JAINISM_TEXT_DATA,
  JainVerseUnit,
} from './jainism/jainismTextData';

export { JAINISM_COLLECTIONS, JAINISM_TEXT_DATA };
export type { JainCollectionMeta, JainVerseUnit };

// Backward-compatible alias interfaces
export interface JainTextMeta extends JainCollectionMeta {
  titlePrakrit: string;
  titleEn: string;
}

export interface JainSutraUnit {
  unitId: string;
  prakritText: string;
  transliteration?: string;
  englishText: string;
  hindiText?: string;
  chapterTitle?: string;
}

export const JAIN_CANONICAL_TEXTS: JainTextMeta[] = JAINISM_COLLECTIONS.map(
  (c) => ({
    ...c,
    titlePrakrit: c.nativeTitle,
    titleEn: c.title,
  })
);

class JainismProvider {
  getCollections(): JainCollectionMeta[] {
    return JAINISM_COLLECTIONS;
  }

  getCollection(id: string): JainCollectionMeta | undefined {
    return JAINISM_COLLECTIONS.find((c) => c.id === id);
  }

  getCollectionUnits(collectionId: string): JainVerseUnit[] {
    return JAINISM_TEXT_DATA[collectionId] || [];
  }

  getTexts(): JainTextMeta[] {
    return JAIN_CANONICAL_TEXTS;
  }

  getText(id: string): JainTextMeta | undefined {
    return JAIN_CANONICAL_TEXTS.find((t) => t.id === id);
  }

  getUnits(textId: string): JainSutraUnit[] {
    const raw = JAINISM_TEXT_DATA[textId] || [];
    return raw.map((r) => ({
      unitId: String(r.unitNumber),
      prakritText: r.originalText,
      transliteration: r.transliteration,
      englishText: r.translationEn,
      hindiText: r.translationHi,
      chapterTitle: r.sectionTitle,
    }));
  }

  async search(query: string): Promise<SearchResultMatch[]> {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const matches: SearchResultMatch[] = [];

    for (const col of JAINISM_COLLECTIONS) {
      if (
        col.title.toLowerCase().includes(q) ||
        col.nativeTitle.includes(q) ||
        col.summary.toLowerCase().includes(q) ||
        col.category.toLowerCase().includes(q)
      ) {
        matches.push({
          unitId: `jainism:${col.id}`,
          address: {
            religionId: 'jainism',
            collectionId: col.id,
            path: [{ levelName: 'Collection', identifier: col.id, label: col.title }],
            unitIdentifier: 1,
          },
          displayTitle: `${col.title} (${col.nativeTitle})`,
          matchedField: 'translation',
          matchedSnippet: col.summary,
        });
      }

      const units = JAINISM_TEXT_DATA[col.id] || [];
      for (const u of units) {
        if (
          u.originalText.includes(q) ||
          u.translationEn.toLowerCase().includes(q) ||
          (u.translationHi && u.translationHi.includes(q))
        ) {
          matches.push({
            unitId: `jainism:${col.id}:${u.id}`,
            address: {
              religionId: 'jainism',
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

export const jainismProvider = new JainismProvider();
