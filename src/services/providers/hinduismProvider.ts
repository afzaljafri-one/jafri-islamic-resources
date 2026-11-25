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
import { GITA_CHAPTER_1_OFFLINE } from './hinduism/gitaChapter1Data';
import { cacheService } from '../cacheService';
import {
  EDWIN_ARNOLD_ALLOWLIST,
  EdwinArnoldAllowlistEntry,
  WITHHELD_GITA_COMMENTARY_EN,
  WITHHELD_GITA_COMMENTARY_HI,
  WITHHELD_GITA_BHASHYA,
} from './hinduism/edwinArnoldAllowlist';

export {
  HINDUISM_COLLECTIONS,
  HINDUISM_TEXT_DATA,
  EDWIN_ARNOLD_ALLOWLIST,
  WITHHELD_GITA_COMMENTARY_EN,
  WITHHELD_GITA_COMMENTARY_HI,
  WITHHELD_GITA_BHASHYA,
};
export type { HinduismCollectionMeta, HinduismVerseUnit, EdwinArnoldAllowlistEntry };

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
  translationEn?: string; // Verified Public Domain translation
  edwinArnoldEn?: string; // Sir Edwin Arnold (1885, Public Domain)
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

export const FOUNDATIONAL_GITA_VERSES: Record<string, GitaVerseData> = {
  '1:1': {
    chapter: 1,
    verse: 1,
    slok: 'धृतराष्ट्र उवाच |\nधर्मक्षेत्रे कुरुक्षेत्रे समवेता युयुत्सवः |\nमामकाः पाण्डवाश्चैव किमकुर्वत सञ्जय || १ ||',
    transliteration: 'dhṛtarāṣṭra uvāca |\ndharmakṣetre kurukṣetre samavetā yuyutsavaḥ |\nmāmakāḥ pāṇḍavāścaiva kimakurvata sañjaya || 1 ||',
    translationEn: EDWIN_ARNOLD_ALLOWLIST['1:1'] ? EDWIN_ARNOLD_ALLOWLIST['1:1'].text : WITHHELD_GITA_COMMENTARY_EN,
    edwinArnoldEn: EDWIN_ARNOLD_ALLOWLIST['1:1'] ? EDWIN_ARNOLD_ALLOWLIST['1:1'].text : WITHHELD_GITA_COMMENTARY_EN,
    sivanandaEn: '[Translation withheld pending documented software redistribution permission]',
    gambhiranandaEn: '[Translation withheld pending documented software redistribution permission]',
    purohitEn: '[Translation withheld pending documented software redistribution permission]',
    ramsukhdasHi: '[अनुवाद का वितरण अनुमति दस्तावेज़ीकरण तक स्थगित है]',
  },
  '1:2': {
    chapter: 1,
    verse: 2,
    slok: 'सञ्जय उवाच |\nदृष्ट्वा तु पाण्डवानीकं व्यूढं दुर्योधनस्तदा |\nआचार्यमुपसङ्गम्य राजा वचनमब्रवीत् || २ ||',
    transliteration: 'sañjaya uvāca |\ndṛṣṭvā tu pāṇḍavānīkaṁ vyūḍhaṁ duryodhanastadā |\nācāryamupasaṅgamya rājā vacanamabravīt || 2 ||',
    translationEn: WITHHELD_GITA_COMMENTARY_EN,
    edwinArnoldEn: WITHHELD_GITA_COMMENTARY_EN,
    sivanandaEn: '[Translation withheld pending documented software redistribution permission]',
    gambhiranandaEn: '[Translation withheld pending documented software redistribution permission]',
    purohitEn: '[Translation withheld pending documented software redistribution permission]',
    ramsukhdasHi: '[अनुवाद का वितरण अनुमति दस्तावेज़ीकरण तक स्थगित है]',
  },
  '2:47': {
    chapter: 2,
    verse: 47,
    slok: 'कर्मण्येवाधिकारस्ते मा फलेषु कदाचन |\nमा कर्मफलहेतुर्भूर्मा ते सङ्गोऽस्त्वकर्मणि ||',
    transliteration: 'karmaṇyevādhikāraste mā phaleṣu kadācana |\nmā karmaphalaheturbhūrmā te saṅgo\'stvakarmaṇi ||',
    translationEn: WITHHELD_GITA_COMMENTARY_EN,
    edwinArnoldEn: WITHHELD_GITA_COMMENTARY_EN,
    sivanandaEn: '[Translation withheld pending documented software redistribution permission]',
    gambhiranandaEn: '[Translation withheld pending documented software redistribution permission]',
    purohitEn: '[Translation withheld pending documented software redistribution permission]',
    ramsukhdasHi: '[अनुवाद का वितरण अनुमति दस्तावेज़ीकरण तक स्थगित है]',
  },
  '4:38': {
    chapter: 4,
    verse: 38,
    slok: 'न हि ज्ञानेन सदृशं पवित्रमिह विद्यते |\nतत्स्वयं योगसंसिद्धः कालेनात्मनि विन्दति ||',
    transliteration: 'na hi jñānena sadṛśaṁ pavitramiha vidyate |\ntatsvayaṁ yogasaṁsiddhaḥ kālenātmani vindati ||',
    translationEn: EDWIN_ARNOLD_ALLOWLIST['4:38'] ? EDWIN_ARNOLD_ALLOWLIST['4:38'].text : WITHHELD_GITA_COMMENTARY_EN,
    edwinArnoldEn: EDWIN_ARNOLD_ALLOWLIST['4:38'] ? EDWIN_ARNOLD_ALLOWLIST['4:38'].text : WITHHELD_GITA_COMMENTARY_EN,
    sivanandaEn: '[Translation withheld pending documented software redistribution permission]',
    gambhiranandaEn: '[Translation withheld pending documented software redistribution permission]',
    purohitEn: '[Translation withheld pending documented software redistribution permission]',
    ramsukhdasHi: '[अनुवाद का वितरण अनुमति दस्तावेज़ीकरण तक स्थगित है]',
  },
  '9:26': {
    chapter: 9,
    verse: 26,
    slok: 'पत्रं पुष्पं फलं तोयं यो मे भक्त्या प्रयच्छति |\nतदहं भक्त्युपहृतमश्नामि प्रयतात्मनः ||',
    transliteration: 'patraṁ puṣpaṁ phalaṁ toyaṁ yo me bhaktyā prayacchati |\ntadahaṁ bhaktyupahṛtamaśnāmi prayatātmanaḥ ||',
    translationEn: EDWIN_ARNOLD_ALLOWLIST['9:26'] ? EDWIN_ARNOLD_ALLOWLIST['9:26'].text : WITHHELD_GITA_COMMENTARY_EN,
    edwinArnoldEn: EDWIN_ARNOLD_ALLOWLIST['9:26'] ? EDWIN_ARNOLD_ALLOWLIST['9:26'].text : WITHHELD_GITA_COMMENTARY_EN,
    sivanandaEn: '[Translation withheld pending documented software redistribution permission]',
    gambhiranandaEn: '[Translation withheld pending documented software redistribution permission]',
    purohitEn: '[Translation withheld pending documented software redistribution permission]',
    ramsukhdasHi: '[अनुवाद का वितरण अनुमति दस्तावेज़ीकरण तक स्थगित है]',
  },
  '12:13': {
    chapter: 12,
    verse: 13,
    slok: 'अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च |\nनिर्ममो निरहङ्कारः समदुःखसुखः क्षमी ||',
    transliteration: 'adveṣṭā sarvabhūtānāṁ maitraḥ karuṇa eva ca |\nnirmamo nirahaṅkāraḥ samaduḥkhasukhaḥ kṣamī ||',
    translationEn: WITHHELD_GITA_COMMENTARY_EN,
    edwinArnoldEn: WITHHELD_GITA_COMMENTARY_EN,
    sivanandaEn: '[Translation withheld pending documented software redistribution permission]',
    gambhiranandaEn: '[Translation withheld pending documented software redistribution permission]',
    purohitEn: '[Translation withheld pending documented software redistribution permission]',
    ramsukhdasHi: '[अनुवाद का वितरण अनुमति दस्तावेज़ीकरण तक स्थगित है]',
  },
  '16:3': {
    chapter: 16,
    verse: 3,
    slok: 'तेजः क्षमा धृतिः शौचमद्रोहो नातिमानिता |\nभवन्ति सम्पदं दैवीमभिजातस्य भारत ||',
    transliteration: 'tejaḥ kṣamā dhṛtiḥ śaucamadroho nātimānitā |\nbhavanti sampadaṁ daivīmabhijātasya bhārata ||',
    translationEn: WITHHELD_GITA_COMMENTARY_EN,
    edwinArnoldEn: WITHHELD_GITA_COMMENTARY_EN,
    sivanandaEn: '[Translation withheld pending documented software redistribution permission]',
    gambhiranandaEn: '[Translation withheld pending documented software redistribution permission]',
    purohitEn: '[Translation withheld pending documented software redistribution permission]',
    ramsukhdasHi: '[अनुवाद का वितरण अनुमति दस्तावेज़ीकरण तक स्थगित है]',
  },
  '17:20': {
    chapter: 17,
    verse: 20,
    slok: 'दातव्यमिति यद्दानं दीयतेऽनुپकारिणे |\nदेशे काले च पात्रे च तद्दानं सात्त्विकं स्मृतम् ||',
    transliteration: 'dātavyamiti yaddānaṁ dīyate’nupakāriṇe |\ndeśe kāle ca pātre ca taddānaṁ sāttvikaṁ smṛtam ||',
    translationEn: EDWIN_ARNOLD_ALLOWLIST['17:20'] ? EDWIN_ARNOLD_ALLOWLIST['17:20'].text : WITHHELD_GITA_COMMENTARY_EN,
    edwinArnoldEn: EDWIN_ARNOLD_ALLOWLIST['17:20'] ? EDWIN_ARNOLD_ALLOWLIST['17:20'].text : WITHHELD_GITA_COMMENTARY_EN,
    sivanandaEn: '[Translation withheld pending documented software redistribution permission]',
    gambhiranandaEn: '[Translation withheld pending documented software redistribution permission]',
    purohitEn: '[Translation withheld pending documented software redistribution permission]',
    ramsukhdasHi: '[अनुवाद का वितरण अनुमति दस्तावेज़ीकरण तक स्थगित है]',
  },
  '18:66': {
    chapter: 18,
    verse: 66,
    slok: 'सर्वधर्मान्परित्यज्य मामेकं शरणं व्रज |\nअहं त्वा सर्वपापेभ्यो मोक्षयिष्यामि मा शुचः ||',
    transliteration: 'sarvadharmānparityajya māmekaṁ śaraṇaṁ vraja |\nahaṁ tvā sarvapāpebhyo mokṣayiṣyāmi mā śucaḥ ||',
    translationEn: EDWIN_ARNOLD_ALLOWLIST['18:66'] ? EDWIN_ARNOLD_ALLOWLIST['18:66'].text : WITHHELD_GITA_COMMENTARY_EN,
    edwinArnoldEn: EDWIN_ARNOLD_ALLOWLIST['18:66'] ? EDWIN_ARNOLD_ALLOWLIST['18:66'].text : WITHHELD_GITA_COMMENTARY_EN,
    sivanandaEn: '[Translation withheld pending documented software redistribution permission]',
    gambhiranandaEn: '[Translation withheld pending documented software redistribution permission]',
    purohitEn: '[Translation withheld pending documented software redistribution permission]',
    ramsukhdasHi: '[अनुवाद का वितरण अनुमति दस्तावेज़ीकरण तक स्थगित है]',
  },
};

/**
 * Phase 6.3.5.3 Central Gita Verse Sanitizer & Fail-Closed Translation Whitelist
 * Every Gita verse from every retrieval or caching path (offline bundle, memory cache,
 * static JSON, remote API, IndexedDB reads and writes) must pass through this boundary.
 * Strictly guarantees that unverified modern commentaries are suppressed and that only
 * verified public domain translations from EDWIN_ARNOLD_ALLOWLIST are exposed.
 * All non-allowlist coordinates return an explicit translation-withheld notice.
 */
export function sanitizeGitaVerse(rawVerse: any): GitaVerseData {
  if (!rawVerse) {
    throw new Error('sanitizeGitaVerse called with null/undefined verse');
  }
  const chapter = Number(rawVerse.chapter);
  const verse = Number(rawVerse.verse);
  const key = `${chapter}:${verse}`;
  const foundational = FOUNDATIONAL_GITA_VERSES[key];
  const approvedEntry = EDWIN_ARNOLD_ALLOWLIST[key];

  // Phase 6.3.5.3 Fail-Closed Coordinate Whitelist:
  // English translation is ONLY populated when the coordinate is strictly present in EDWIN_ARNOLD_ALLOWLIST.
  // Permissive fallback checks on rawVerse strings are completely forbidden.
  // Non-allowlist coordinates return an explicit translation-withheld notice.
  const verifiedTranslation = approvedEntry ? approvedEntry.text : WITHHELD_GITA_COMMENTARY_EN;

  return {
    chapter,
    verse,
    slok: rawVerse.slok || foundational?.slok || '',
    transliteration: rawVerse.transliteration || foundational?.transliteration || '',
    translationEn: verifiedTranslation,
    edwinArnoldEn: verifiedTranslation,
    sivanandaEn: WITHHELD_GITA_COMMENTARY_EN,
    gambhiranandaEn: WITHHELD_GITA_COMMENTARY_EN,
    purohitEn: WITHHELD_GITA_COMMENTARY_EN,
    ramsukhdasHi: WITHHELD_GITA_COMMENTARY_HI,
    shankaraBhashya: WITHHELD_GITA_BHASHYA,
  };
}

export function sanitizeGitaChapter(verses: any[]): GitaVerseData[] {
  if (!Array.isArray(verses)) return [];
  return verses.map(sanitizeGitaVerse);
}

class HinduismProvider {
  private verseCache: Record<string, GitaVerseData> = {};
  private chapterCache: Record<number, GitaVerseData[]> = {
    1: sanitizeGitaChapter(GITA_CHAPTER_1_OFFLINE),
  };

  constructor() {
    // Seed Chapter 1 offline verses into cache, merging known foundational translations
    for (const v of GITA_CHAPTER_1_OFFLINE) {
      const key = `1:${v.verse}`;
      const found = FOUNDATIONAL_GITA_VERSES[key];
      const merged = found ? { ...v, ...found } : v;
      this.verseCache[key] = sanitizeGitaVerse(merged);
    }
    // Seed foundational verses
    for (const [key, val] of Object.entries(FOUNDATIONAL_GITA_VERSES)) {
      if (!this.verseCache[key]) {
        this.verseCache[key] = sanitizeGitaVerse(val);
      } else {
        this.verseCache[key] = sanitizeGitaVerse({ ...this.verseCache[key], ...val });
      }
    }
    // Also update chapter 1 cache with sanitized merged verses
    this.chapterCache[1] = sanitizeGitaChapter(
      GITA_CHAPTER_1_OFFLINE.map((v) => {
        const found = FOUNDATIONAL_GITA_VERSES[`1:${v.verse}`];
        return found ? { ...v, ...found } : v;
      })
    );
  }

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
      return sanitizeGitaVerse(this.verseCache[key]);
    }

    // Tier 1: Check Chapter 1 offline bundle
    if (chapter === 1) {
      const offlineV = GITA_CHAPTER_1_OFFLINE.find((v) => v.verse === verse);
      if (offlineV) {
        const sanitized = sanitizeGitaVerse(offlineV);
        this.verseCache[key] = sanitized;
        return sanitized;
      }
    }

    // Tier 2: Check if entire chapter is already cached
    if (this.chapterCache[chapter]) {
      const found = this.chapterCache[chapter].find((v) => v.verse === verse);
      if (found) {
        const sanitized = sanitizeGitaVerse(found);
        this.verseCache[key] = sanitized;
        return sanitized;
      }
    }

    // Tier 3: Fetch from local static JSON asset
    try {
      const baseUrl: string = (import.meta as any).env?.BASE_URL || '/';
      const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      const staticUrl = `${cleanBase}data/gita/chapter_${chapter}.json`;
      const res = await fetch(staticUrl);
      if (res.ok) {
        const data: any[] = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const sanitizedChapter = sanitizeGitaChapter(data);
          this.chapterCache[chapter] = sanitizedChapter;
          sanitizedChapter.forEach((v) => {
            this.verseCache[`${chapter}:${v.verse}`] = v;
          });
          const match = sanitizedChapter.find((v) => v.verse === verse);
          if (match) return match;
        }
      }
    } catch {
      // Local static fetch unavailable, continue
    }

    // Tier 4: Fetch from live VedicScriptures API (with trailing slash!)
    try {
      const res = await fetch(`https://vedicscriptures.github.io/slok/${chapter}/${verse}/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      // Strictly strip and withhold proprietary/restricted modern translations
      // (Swami Sivananda, Swami Gambhirananda, Shri Purohit Swami, Swami Ramsukhdas)
      // Remote fields (data.siva?.et, data.gambir?.et, data.purohit?.et, data.rams?.ht)
      // are never allowed into memory cache, IndexedDB cache, or reader output!
      const known = FOUNDATIONAL_GITA_VERSES[key];
      const rawObj = {
        chapter,
        verse,
        slok: data.slok || known?.slok || '',
        transliteration: data.transliteration || known?.transliteration || '',
        translationEn: known?.translationEn || known?.edwinArnoldEn,
        edwinArnoldEn: known?.edwinArnoldEn,
      };

      const sanitized = sanitizeGitaVerse(rawObj);
      this.verseCache[key] = sanitized;
      return sanitized;
    } catch {
      if (FOUNDATIONAL_GITA_VERSES[key]) {
        return sanitizeGitaVerse(FOUNDATIONAL_GITA_VERSES[key]);
      }
      return null;
    }
  }

  async getChapterVerses(chapter: number): Promise<GitaVerseData[]> {
    const meta = GITA_CHAPTERS.find((c) => c.chapter_number === chapter) || GITA_CHAPTERS[0];
    const expectedCount = meta.verses_count;

    // Tier 1: In-Memory Chapter Cache (must have full verse count)
    if (this.chapterCache[chapter] && this.chapterCache[chapter].length === expectedCount) {
      return sanitizeGitaChapter(this.chapterCache[chapter]);
    }

    // Tier 2: Bundled Offline Chapter 1
    if (chapter === 1 && GITA_CHAPTER_1_OFFLINE.length === expectedCount) {
      const sanitizedCh1 = sanitizeGitaChapter(GITA_CHAPTER_1_OFFLINE);
      this.chapterCache[1] = sanitizedCh1;
      return sanitizedCh1;
    }

    // Tier 3: Multi-Tier Persistent Cache (IndexedDB) with Automatic Sanitization & Migration
    try {
      const cached = await cacheService.getIndexedDB<GitaVerseData[]>(`gita_chapter_${chapter}`);
      if (cached && Array.isArray(cached) && cached.length === expectedCount) {
        // Enforce central sanitization on all IndexedDB reads
        const sanitized = sanitizeGitaChapter(cached);

        // Detect if old cache contained unsanitized proprietary commentary text or unapproved translations
        const getStr = (c: any): string => {
          if (!c) return '';
          if (typeof c === 'string') return c;
          return c.translation || c.et || '';
        };

        const hadUnsafeData = cached.some((v: any) => {
          const key = `${chapter}:${v.verse}`;
          const approved = EDWIN_ARNOLD_ALLOWLIST[key];
          const s = getStr(v.sivanandaEn);
          const g = getStr(v.gambhiranandaEn);
          const p = getStr(v.purohitEn);
          const r = getStr(v.ramsukhdasHi);
          const sh = getStr(v.shankaraBhashya);
          const t = getStr(v.translationEn);
          const ea = getStr(v.edwinArnoldEn);

          const hasUnsafeCommentary =
            (s && !s.includes('withheld')) ||
            (g && !g.includes('withheld')) ||
            (p && !p.includes('withheld')) ||
            (r && !r.includes('स्थगित') && !r.includes('withheld')) ||
            (sh && !sh.includes('withheld'));

          const hasUnsafeTranslation = approved
            ? (t && t !== approved.text && !t.includes('withheld')) ||
              (ea && ea !== approved.text && !ea.includes('withheld'))
            : (t && !t.includes('withheld')) || (ea && !ea.includes('withheld'));

          return hasUnsafeCommentary || hasUnsafeTranslation;
        });

        if (hadUnsafeData) {
          // Immediately purge old unsafe data by overwriting IndexedDB with sanitized records
          await cacheService.setIndexedDB(`gita_chapter_${chapter}`, sanitized);
        }

        this.chapterCache[chapter] = sanitized;
        sanitized.forEach((v) => {
          this.verseCache[`${chapter}:${v.verse}`] = v;
        });
        return sanitized;
      }
    } catch {
      // Continue to local static tier
    }

    // Tier 4: Local Static JSON Bundle (/data/gita/chapter_${chapter}.json)
    try {
      const baseUrl: string = (import.meta as any).env?.BASE_URL || '/';
      const cleanBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
      const staticUrl = `${cleanBase}data/gita/chapter_${chapter}.json`;
      const res = await fetch(staticUrl);
      if (res.ok) {
        const data: any[] = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          // Enforce central sanitization on static JSON assets
          const sanitized = sanitizeGitaChapter(data);
          this.chapterCache[chapter] = sanitized;
          sanitized.forEach((v) => {
            this.verseCache[`${chapter}:${v.verse}`] = v;
          });
          // Write only sanitized records to IndexedDB
          await cacheService.setIndexedDB(`gita_chapter_${chapter}`, sanitized);
          return sanitized;
        }
      }
    } catch {
      // Static fetch failed, fallback to upstream API
    }

    // Tier 5: Live Upstream VedicScriptures API (with trailing slash)
    try {
      const promises: Promise<GitaVerseData | null>[] = [];
      for (let v = 1; v <= expectedCount; v++) {
        promises.push(this.getVerse(chapter, v));
      }
      const results = await Promise.all(promises);
      const verses = results.filter((v): v is GitaVerseData => v !== null);
      if (verses.length > 0) {
        const sanitized = sanitizeGitaChapter(verses);
        this.chapterCache[chapter] = sanitized;
        if (sanitized.length === expectedCount) {
          // Write only sanitized records to IndexedDB
          await cacheService.setIndexedDB(`gita_chapter_${chapter}`, sanitized);
        }
        return sanitized;
      }
    } catch {
      // Upstream failed
    }

    // Tier 6: Return any available foundational or cached verses
    const partialVerses: GitaVerseData[] = [];
    for (let v = 1; v <= expectedCount; v++) {
      const cached = this.verseCache[`${chapter}:${v}`] || FOUNDATIONAL_GITA_VERSES[`${chapter}:${v}`];
      if (cached) {
        partialVerses.push(sanitizeGitaVerse(cached));
      }
    }
    return partialVerses;
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
