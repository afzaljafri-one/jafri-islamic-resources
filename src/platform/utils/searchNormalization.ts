// ==============================================================================
// Search Normalization & Reference Parsing Utilities
// Multilingual Unicode-Aware Search for 7 Religious Traditions
// Jafri Religious Resources — Phase 6.3
// ==============================================================================

import { ParsedReference } from '../types/search';

/**
 * Normalizes Arabic script:
 * - Strips tashkeel (fatha, damma, kasra, sukun, shadda, tanween, dagger alif, Quranic signs)
 * - Normalizes Alif variants (إ, أ, آ) to bare Alif (ا)
 * - Normalizes Yaa and Alif Maqsurah (ى) to ي
 * - Normalizes Taa Marbutah (ة) to ه
 * - Strips tatweel (ـ) and Quranic verse end symbols
 */
export function normalizeArabic(text: string): string {
  if (!text) return '';
  return text
    // Remove Quranic and standard Arabic harakat / diacritics
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    // Remove Tatweel (kashida)
    .replace(/\u0640/g, '')
    // Normalize Alif forms
    .replace(/[إأآء]/g, 'ا')
    // Normalize Yaa / Alif Maqsurah
    .replace(/[ىي]/g, 'ي')
    // Normalize Taa Marbuta
    .replace(/ة/g, 'ه')
    // Strip Quranic verse markers and parentheses
    .replace(/[\u06DD\uFD3E\uFD3F\(\)\[\]،؛؟.\-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

/**
 * Normalizes Devanagari script:
 * - Strips nukta (\u093C)
 * - Strips Vedic accents (\u0951, \u0952, etc.)
 * - Strips danda (।) and double danda (॥)
 * - Normalizes anusvara / chandrabindu
 */
export function normalizeDevanagari(text: string): string {
  if (!text) return '';
  return text
    .replace(/\u093C/g, '') // Nukta
    .replace(/[\u0951\u0952\u0953\u0954]/g, '') // Vedic accents
    .replace(/[।॥|]/g, ' ') // Dandas
    .replace(/[\(\)\[\],.;:?\-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalizes Hebrew script:
 * - Strips Niqqud (vowels) and cantillation marks (\u0591-\u05BD, \u05BF-\u05C5, \u05C7)
 */
export function normalizeHebrew(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u0591-\u05BD\u05BF-\u05C5\u05C7]/g, '')
    .replace(/[\(\)\[\],.;:?\-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalizes Gurmukhi script:
 * - Strips bindi (\u0A02), tippi (\u0A70), addak (\u0A71)
 */
export function normalizeGurmukhi(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u0A02\u0A70\u0A71]/g, '')
    .replace(/[।॥|]/g, ' ')
    .replace(/[\(\)\[\],.;:?\-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalizes Latin-script and IAST / Pali / Romanized transliterations:
 * - Decomposes diacritics (NFD)
 * - Converts ā->a, ī->i, ū->u, ṛ->r, ṝ->r, ḷ->l, ṅ->n, ñ->n, ṭ->t, ḍ->d, ṇ->n, ś->s, ṣ->s, ḥ->h, ṃ->m, etc.
 * - Strips punctuation, dashes, quotes
 */
export function normalizeLatinAndTransliteration(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    // Explicit IAST mappings before generic strip
    .replace(/ā/g, 'a')
    .replace(/ī/g, 'i')
    .replace(/ū/g, 'u')
    .replace(/ṛ/g, 'r')
    .replace(/ṝ/g, 'r')
    .replace(/ḷ/g, 'l')
    .replace(/ḹ/g, 'l')
    .replace(/ṅ/g, 'n')
    .replace(/ñ/g, 'n')
    .replace(/ṭ/g, 't')
    .replace(/ḍ/g, 'd')
    .replace(/ṇ/g, 'n')
    .replace(/ś/g, 's')
    .replace(/ṣ/g, 's')
    .replace(/ḥ/g, 'h')
    .replace(/ṃ/g, 'm')
    .replace(/ṁ/g, 'm')
    // Remove remaining combining diacritical marks
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Normalize apostrophes & quotes
    .replace(/[''""`ʻʾʿ]/g, '')
    // Replace non-alphanumeric with spaces (excluding numbers)
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Unified search token normalizer
 */
export function normalizeForSearch(text: string): string {
  if (!text) return '';
  const arabicNorm = normalizeArabic(text);
  const devanagariNorm = normalizeDevanagari(arabicNorm);
  const hebrewNorm = normalizeHebrew(devanagariNorm);
  const gurmukhiNorm = normalizeGurmukhi(hebrewNorm);
  return normalizeLatinAndTransliteration(gurmukhiNorm);
}

/**
 * Identifies if a user query is an exact canonical scripture citation
 * Examples:
 * - "John 3:16", "Genesis 1:1", "Psalm 23", "Matthew 5:3"
 * - "Quran 2:255", "Surah 2:255", "2:255", "Ayat al-Kursi", "Al-Baqarah 255"
 * - "Bhagavad Gita 2:47", "Gita 2:47", "BG 2:47", "Gita 1:1"
 * - "Bereshit 1:1", "Shemot 20:1", "Tehillim 23", "Psalm 23"
 * - "Japji Sahib", "Ang 1", "SGGS 1", "Ang 5"
 * - "Mangala Sutta", "Dhammapada 1", "Metta Sutta"
 * - "Namokar Mantra", "Tattvartha Sutra 1:1", "Bhaktamara 1"
 */
export function parseScriptureReference(query: string): ParsedReference | null {
  if (!query || !query.trim()) return null;
  const q = query.trim();
  const lower = q.toLowerCase();

  // 1. ISLAM: Surah / Ayah patterns
  // E.g. "quran 2:255", "surah 2:255", "2:255", "quran 112:1", "surah 1:1", "ayat al-kursi"
  if (lower.includes('kursi') || lower === 'ayat al kursi' || lower === 'ayat al-kursi') {
    return {
      religion: 'islam',
      collectionId: 'quran',
      bookOrSurah: 2,
      chapterNumber: 2,
      verseNumber: 255,
      rawQuery: q,
      isExactCitation: true,
    };
  }

  const quranMatch = lower.match(/(?:quran|qur'an|surah|surat)?\s*([0-9]{1,3})[:\s]([0-9]{1,3})/);
  if (quranMatch && (lower.includes('quran') || lower.includes('surah') || q.includes(':'))) {
    const surahNum = parseInt(quranMatch[1], 10);
    const ayahNum = parseInt(quranMatch[2], 10);
    if (surahNum >= 1 && surahNum <= 114 && ayahNum >= 1 && ayahNum <= 286) {
      return {
        religion: 'islam',
        collectionId: 'quran',
        bookOrSurah: surahNum,
        chapterNumber: surahNum,
        verseNumber: ayahNum,
        rawQuery: q,
        isExactCitation: true,
      };
    }
  }

  // 2. HINDUISM: Bhagavad Gita patterns
  // E.g. "gita 2:47", "bhagavad gita 2:47", "bg 2:47", "gita 1:1", "gita chapter 1"
  const gitaMatch = lower.match(/(?:bhagavad\s*gita|gita|bg)\s*(?:chapter\s*)?([0-9]{1,2})(?:[:\s]([0-9]{1,2}))?/);
  if (gitaMatch) {
    const ch = parseInt(gitaMatch[1], 10);
    const v = gitaMatch[2] ? parseInt(gitaMatch[2], 10) : 1;
    if (ch >= 1 && ch <= 18) {
      return {
        religion: 'hinduism',
        collectionId: 'gita',
        bookOrSurah: 'Bhagavad Gita',
        chapterNumber: ch,
        verseNumber: v,
        rawQuery: q,
        isExactCitation: true,
      };
    }
  }

  // 3. CHRISTIANITY: Bible Books & Verses
  // E.g. "John 3:16", "Genesis 1:1", "Psalm 23", "Matthew 5:3", "1 Corinthians 13:4"
  const bibleRegex = /(?:([1-3]\s*)?([a-zA-Z]+))\s*([0-9]{1,3})(?:[:\s]([0-9]{1,3}))?/;
  const bibleMatch = lower.match(bibleRegex);
  if (bibleMatch) {
    const prefix = bibleMatch[1] ? bibleMatch[1].trim() + ' ' : '';
    const bookNamePart = (prefix + bibleMatch[2]).trim();
    const ch = parseInt(bibleMatch[3], 10);
    const v = bibleMatch[4] ? parseInt(bibleMatch[4], 10) : 1;

    // Check against canonical Bible books
    const BIBLE_BOOK_MAP: Record<string, { id: number; name: string }> = {
      genesis: { id: 1, name: 'Genesis' },
      exodus: { id: 2, name: 'Exodus' },
      psalms: { id: 19, name: 'Psalms' },
      psalm: { id: 19, name: 'Psalms' },
      proverbs: { id: 20, name: 'Proverbs' },
      matthew: { id: 40, name: 'Matthew' },
      mark: { id: 41, name: 'Mark' },
      luke: { id: 42, name: 'Luke' },
      john: { id: 43, name: 'John' },
      acts: { id: 44, name: 'Acts' },
      romans: { id: 45, name: 'Romans' },
      '1 corinthians': { id: 46, name: '1 Corinthians' },
      '2 corinthians': { id: 47, name: '2 Corinthians' },
      revelation: { id: 66, name: 'Revelation' },
    };

    const bookEntry = BIBLE_BOOK_MAP[bookNamePart];
    if (bookEntry) {
      return {
        religion: 'christianity',
        collectionId: 'bible-kjv',
        bookOrSurah: bookEntry.id,
        chapterNumber: ch,
        verseNumber: v,
        rawQuery: q,
        isExactCitation: true,
      };
    }
  }

  // 4. JUDAISM: Tanakh / Torah / Tehillim
  // E.g. "bereshit 1:1", "shemot 20:1", "tehillim 23", "tehillim 1"
  if (lower.includes('bereshit') || lower.includes('genesis')) {
    const m = lower.match(/(?:bereshit|genesis)\s*([0-9]{1,3})(?:[:\s]([0-9]{1,3}))?/);
    if (m) {
      return {
        religion: 'judaism',
        collectionId: 'torah',
        bookOrSurah: 'genesis',
        chapterNumber: parseInt(m[1], 10) || 1,
        verseNumber: m[2] ? parseInt(m[2], 10) : 1,
        rawQuery: q,
        isExactCitation: true,
      };
    }
  }
  if (lower.includes('tehillim') || (lower.includes('psalm') && !lower.includes('bible'))) {
    const m = lower.match(/(?:tehillim|psalm|psalms)\s*([0-9]{1,3})(?:[:\s]([0-9]{1,3}))?/);
    if (m) {
      return {
        religion: 'judaism',
        collectionId: 'ketuvim',
        bookOrSurah: 'psalms',
        chapterNumber: parseInt(m[1], 10) || 1,
        verseNumber: m[2] ? parseInt(m[2], 10) : 1,
        rawQuery: q,
        isExactCitation: true,
      };
    }
  }

  // 5. SIKHISM: Sri Guru Granth Sahib Ji & Nitnem
  // E.g. "japji sahib", "ang 1", "sggs 1", "ang 5", "anand sahib", "rehras"
  if (lower.includes('japji') || lower === 'japji sahib') {
    return {
      religion: 'sikhism',
      collectionId: 'sggs',
      bookOrSurah: 'Japji Sahib',
      chapterNumber: 1,
      verseNumber: 1,
      rawQuery: q,
      isExactCitation: true,
    };
  }
  const angMatch = lower.match(/(?:ang|sggs|page)\s*([0-9]{1,4})/);
  if (angMatch) {
    const ang = parseInt(angMatch[1], 10);
    if (ang >= 1 && ang <= 1430) {
      return {
        religion: 'sikhism',
        collectionId: 'sggs',
        bookOrSurah: 'SGGS',
        chapterNumber: ang,
        verseNumber: 1,
        rawQuery: q,
        isExactCitation: true,
      };
    }
  }

  // 6. BUDDHISM: Pali Suttas & Dhammapada
  // E.g. "mangala sutta", "dhammacakkappavattana", "metta sutta", "dhammapada 1"
  if (lower.includes('mangala') || lower.includes('maha-mangala')) {
    return {
      religion: 'buddhism',
      collectionId: 'khuddaka',
      bookOrSurah: 'Sutta Nipata 2.4',
      chapterNumber: 'mangala',
      verseNumber: 1,
      rawQuery: q,
      isExactCitation: true,
    };
  }
  if (lower.includes('dhammacakka') || lower.includes('turning the wheel')) {
    return {
      religion: 'buddhism',
      collectionId: 'samyutta',
      bookOrSurah: 'SN 56.11',
      chapterNumber: 'dhammacakka',
      verseNumber: 1,
      rawQuery: q,
      isExactCitation: true,
    };
  }
  if (lower.includes('metta') || lower.includes('karaniya')) {
    return {
      religion: 'buddhism',
      collectionId: 'khuddaka',
      bookOrSurah: 'Sutta Nipata 1.8',
      chapterNumber: 'metta',
      verseNumber: 1,
      rawQuery: q,
      isExactCitation: true,
    };
  }

  // 7. JAINISM: Namokar Mantra, Bhaktamara, Tattvartha
  // E.g. "namokar mantra", "navkar mantra", "bhaktamara", "tattvartha sutra 1"
  if (lower.includes('namokar') || lower.includes('navkar')) {
    return {
      religion: 'jainism',
      collectionId: 'navkar',
      bookOrSurah: 'Canonical Liturgy',
      chapterNumber: 'navkar',
      verseNumber: 1,
      rawQuery: q,
      isExactCitation: true,
    };
  }
  if (lower.includes('bhaktamara') || lower.includes('bhaktamar')) {
    return {
      religion: 'jainism',
      collectionId: 'bhaktamara',
      bookOrSurah: 'Bhaktamara Stotra',
      chapterNumber: 1,
      verseNumber: 1,
      rawQuery: q,
      isExactCitation: true,
    };
  }
  if (lower.includes('tattvartha')) {
    const tm = lower.match(/tattvartha(?:\s*sutra)?\s*([0-9]{1,2})/);
    const ch = tm ? parseInt(tm[1], 10) : 1;
    return {
      religion: 'jainism',
      collectionId: 'tattvartha',
      bookOrSurah: 'Tattvartha Sutra',
      chapterNumber: ch,
      verseNumber: 1,
      rawQuery: q,
      isExactCitation: true,
    };
  }

  return null;
}
