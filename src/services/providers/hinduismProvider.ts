// ==============================================================================
// Hinduism Scripture Provider (Phase 1 Content Expansion)
// Bhagavad Gita, Ramayana, Upanishads, Vedas, Puranas, Chalisas, Aartis,
// Bhajans, Mantras, Stotras, Puja Procedures, Festival Prayers
// Sanskrit Devanagari, IAST Transliteration, Multi-Commentary English & Hindi
// Jafri Religious Books & Audio Platform
// ==============================================================================

import { SearchResultMatch } from '../../platform/types';
import {
  HINDUISM_COLLECTIONS,
  HinduismCollectionMeta,
} from './hinduism/hinduismCollections';
import {
  HINDUISM_TEXT_DATA,
  HinduismVerseUnit,
} from './hinduism/hinduismTextData';

export { HINDUISM_COLLECTIONS, HINDUISM_TEXT_DATA };
export type { HinduismCollectionMeta, HinduismVerseUnit };

export interface GitaChapterMeta {
  chapter_number: number;
  verses_count: number;
  name: string; // Sanskrit Devanagari
  translation: string; // English
  transliteration: string; // IAST
  meaningEn: string;
}

export interface GitaVerseData {
  chapter: number;
  verse: number;
  slok: string; // Sanskrit Devanagari
  transliteration: string; // IAST
  sivanandaEn: string; // Swami Sivananda English
  gambhiranandaEn: string; // Swami Gambhirananda English
  purohitEn: string; // Shri Purohit Swami English
  ramsukhdasHi: string; // Swami Ramsukhdas Hindi
  shankaraBhashya?: string; // Adi Shankaracharya commentary
}

export const GITA_CHAPTERS: GitaChapterMeta[] = [
  { chapter_number: 1, verses_count: 47, name: 'अर्जुनविषादयोग', translation: 'Arjuna Visada Yoga', transliteration: 'Arjuna Viṣāda Yoga', meaningEn: 'Observing the Armies on the Battlefield of Kurukshetra; Arjuna\'s Despondency.' },
  { chapter_number: 2, verses_count: 72, name: 'सांख्ययोग', translation: 'Sankhya Yoga', transliteration: 'Sāṅkhya Yoga', meaningEn: 'Transcendental Knowledge; The Yoga of Wisdom and the Nature of the Immortal Atman.' },
  { chapter_number: 3, verses_count: 43, name: 'कर्मयोग', translation: 'Karma Yoga', transliteration: 'Karma Yoga', meaningEn: 'The Yoga of Dedicated Action without Selfish Attachment.' },
  { chapter_number: 4, verses_count: 42, name: 'ज्ञानकर्मसंन्यासयोग', translation: 'Jnana Karma Sanyasa Yoga', transliteration: 'Jñāna Karma Sannyāsa Yoga', meaningEn: 'The Yoga of Knowledge, Action, and Renunciation; Divine Descent (Avatara).' },
  { chapter_number: 5, verses_count: 29, name: 'कर्मसंन्यासयोग', translation: 'Karma Sanyasa Yoga', transliteration: 'Karma Sannyāsa Yoga', meaningEn: 'The Yoga of Renunciation of Action; Inner Peace in the Divine.' },
  { chapter_number: 6, verses_count: 47, name: 'आत्मसंयमयोग', translation: 'Dhyana / Atmasamyama Yoga', transliteration: 'Dhyāna / Ātmasaṁyama Yoga', meaningEn: 'The Yoga of Meditation, Mind Mastery, and Self-Control.' },
  { chapter_number: 7, verses_count: 30, name: 'ज्ञानविज्ञानयोग', translation: 'Jnana Vijnana Yoga', transliteration: 'Jñāna Vijñāna Yoga', meaningEn: 'The Yoga of Knowledge and Discernment; The Manifest and Unmanifest.' },
  { chapter_number: 8, verses_count: 28, name: 'अक्षरब्रह्मयोग', translation: 'Aksara Brahma Yoga', transliteration: 'Akṣara Brahma Yoga', meaningEn: 'The Yoga of the Imperishable Absolute Brahman; Attaining the Supreme.' },
  { chapter_number: 9, verses_count: 34, name: 'राजविद्याराजगुह्ययोग', translation: 'Raja Vidya Raja Guhya Yoga', transliteration: 'Rāja Vidyā Rāja Guhya Yoga', meaningEn: 'The Sovereign Science and the Supreme Secret; Pure Unwavering Devotion.' },
  { chapter_number: 10, verses_count: 42, name: 'विभूतियोग', translation: 'Vibhuti Yoga', transliteration: 'Vibhūti Yoga', meaningEn: 'The Divine Glories and Infinite Manifestations of God throughout Creation.' },
  { chapter_number: 11, verses_count: 55, name: 'विश्वरूपदर्शनयोग', translation: 'Visvarupa Darsana Yoga', transliteration: 'Viśvarūpa Darśana Yoga', meaningEn: 'The Cosmic Vision; Arjuna Beholds the Universal Divine Form.' },
  { chapter_number: 12, verses_count: 20, name: 'भक्तियोग', translation: 'Bhakti Yoga', transliteration: 'Bhakti Yoga', meaningEn: 'The Path of Divine Love and Devotional Surrender.' },
  { chapter_number: 13, verses_count: 35, name: 'क्षेत्रक्षेत्रज्ञविभागयोग', translation: 'Ksetra Ksetrajna Vibhaga Yoga', transliteration: 'Kṣetra Kṣetrajña Vibhāga Yoga', meaningEn: 'The Field (the Body) and the Knower of the Field (the Consciousness).' },
  { chapter_number: 14, verses_count: 27, name: 'गुणत्रयविभागयोग', translation: 'Gunatraya Vibhaga Yoga', transliteration: 'Guṇatraya Vibhāga Yoga', meaningEn: 'The Three Modes of Material Nature (Sattva, Rajas, and Tamas).' },
  { chapter_number: 15, verses_count: 20, name: 'पुरुषोत्तमयोग', translation: 'Purusottama Yoga', transliteration: 'Puruṣottama Yoga', meaningEn: 'The Yoga of the Supreme Person; The Cosmic Ashvattha Tree.' },
  { chapter_number: 16, verses_count: 24, name: 'दैवासुरसम्पद्विभागयोग', translation: 'Daivasura Sampad Vibhaga Yoga', transliteration: 'Daivāsura Sampad Vibhāga Yoga', meaningEn: 'The Divine and Demonic Natures; Qualities Leading to Liberation or Bondage.' },
  { chapter_number: 17, verses_count: 28, name: 'श्रद्धात्रयविभागयोग', translation: 'Sraddhatraya Vibhaga Yoga', transliteration: 'Śraddhātraya Vibhāga Yoga', meaningEn: 'The Threefold Divisions of Faith, Food, Sacrifice, and Austerity.' },
  { chapter_number: 18, verses_count: 78, name: 'मोक्षसंन्यासयोग', translation: 'Moksha Sanyasa Yoga', transliteration: 'Mokṣa Sannyāsa Yoga', meaningEn: 'Liberation through Total Renunciation and Complete Surrender to the Divine.' },
];

class HinduismProvider {
  private verseCache: Record<string, GitaVerseData> = {};
  private chapterCache: Record<number, GitaVerseData[]> = {};

  getCollections(): HinduismCollectionMeta[] {
    return HINDUISM_COLLECTIONS;
  }

  getCollection(id: string): HinduismCollectionMeta | undefined {
    return HINDUISM_COLLECTIONS.find((c) => c.id === id);
  }

  getCollectionUnits(collectionId: string): HinduismVerseUnit[] {
    return HINDUISM_TEXT_DATA[collectionId] || [];
  }

  async getVerse(chapter: number, verse: number): Promise<GitaVerseData | null> {
    const key = `${chapter}:${verse}`;
    if (this.verseCache[key]) {
      return this.verseCache[key];
    }

    try {
      const res = await fetch(`https://vedicscriptures.github.io/slok/${chapter}/${verse}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const vData: GitaVerseData = {
        chapter,
        verse,
        slok: data.slok || '',
        transliteration: data.transliteration || '',
        sivanandaEn: data.siva?.et || '',
        gambhiranandaEn: data.gambir?.et || '',
        purohitEn: data.purohit?.et || '',
        ramsukhdasHi: data.rams?.ht || '',
        shankaraBhashya: data.sankar?.et || data.sankar?.ht || '',
      };

      this.verseCache[key] = vData;
      return vData;
    } catch {
      // Fallback offline verse for Gita 2:47
      if (chapter === 2 && verse === 47) {
        return {
          chapter: 2,
          verse: 47,
          slok: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन |\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ||',
          transliteration: 'karmaṇyevādhikāraste mā phaleṣu kadācana |\nmā karmaphalaheturbhūrmā te saṅgo\'stvakarmaṇi ||',
          sivanandaEn: 'Thy right is to work only, but never to its fruits; let not the fruit of action be thy motive, nor let thy attachment be to inaction.',
          gambhiranandaEn: 'You have a right to work alone, never to its fruits. Let not the fruits of action be your motive, nor let your inclination be to inaction.',
          purohitEn: 'You have the right to work, but for the work\'s sake only. You have no right to the fruits of work. Desire for the fruits of work must never be your motive in working. Never give way to laziness, either.',
          ramsukhdasHi: 'तेरा कर्म करनेमें ही अधिकार है, उसके फलोंमें कभी नहीं। इसलिये तू कर्मोंके फलका हेतु मत बन और तेरी कर्म न करनेमें भी आसक्ति न हो।',
        };
      }
      return null;
    }
  }

  async getChapterVerses(chapter: number): Promise<GitaVerseData[]> {
    if (this.chapterCache[chapter]) {
      return this.chapterCache[chapter];
    }

    const meta = GITA_CHAPTERS.find((c) => c.chapter_number === chapter) || GITA_CHAPTERS[0];
    const promises: Promise<GitaVerseData | null>[] = [];

    // Fetch complete canonical verses of the Adhyaya
    const count = meta.verses_count;
    for (let v = 1; v <= count; v++) {
      promises.push(this.getVerse(chapter, v));
    }

    const results = await Promise.all(promises);
    const verses = results.filter((v): v is GitaVerseData => v !== null);
    if (verses.length > 0) {
      this.chapterCache[chapter] = verses;
    }
    return verses;
  }

  async search(query: string): Promise<SearchResultMatch[]> {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    const matches: SearchResultMatch[] = [];

    // 1. Search against Gita chapters
    for (const ch of GITA_CHAPTERS) {
      if (
        ch.name.toLowerCase().includes(q) ||
        ch.translation.toLowerCase().includes(q) ||
        ch.meaningEn.toLowerCase().includes(q)
      ) {
        matches.push({
          unitId: `hinduism:gita:${ch.chapter_number}:1`,
          address: {
            religionId: 'hinduism',
            collectionId: 'gita',
            path: [
              { levelName: 'Chapter', identifier: ch.chapter_number, label: ch.translation },
            ],
            unitIdentifier: 1,
          },
          displayTitle: `Gita Chapter ${ch.chapter_number}: ${ch.translation} (${ch.name})`,
          matchedField: 'translation',
          matchedSnippet: ch.meaningEn,
        });
      }
    }

    // 2. Search against Expanded Collections & Text Units
    for (const col of HINDUISM_COLLECTIONS) {
      if (
        col.title.toLowerCase().includes(q) ||
        col.nativeTitle.includes(q) ||
        col.summary.toLowerCase().includes(q) ||
        col.category.toLowerCase().includes(q)
      ) {
        matches.push({
          unitId: `hinduism:${col.id}`,
          address: {
            religionId: 'hinduism',
            collectionId: col.id,
            path: [{ levelName: 'Collection', identifier: col.id, label: col.title }],
            unitIdentifier: 1,
          },
          displayTitle: `${col.title} (${col.nativeTitle})`,
          matchedField: 'translation',
          matchedSnippet: col.summary,
        });
      }

      // Check inner verse units
      const units = HINDUISM_TEXT_DATA[col.id] || [];
      for (const u of units) {
        if (
          u.originalText.includes(q) ||
          u.translationEn.toLowerCase().includes(q) ||
          (u.translationHi && u.translationHi.includes(q))
        ) {
          matches.push({
            unitId: `hinduism:${col.id}:${u.id}`,
            address: {
              religionId: 'hinduism',
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

export const hinduismProvider = new HinduismProvider();
