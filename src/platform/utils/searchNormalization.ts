// ==============================================================================
// Search Normalization & Reference Parsing Utilities
// Multilingual Unicode-Aware Search for 7 Religious Traditions
// Jafri Religious Resources — Phase 6.3.1 (Integrity & Hardening)
// ==============================================================================

import { ParsedReference } from '../types/search';

/**
 * Normalizes Arabic script:
 * - Strips tashkeel (fatha, damma, kasra, sukun, shadda, tanween, dagger alif, Quranic signs)
 * - Normalizes Alif variants (إ, أ, آ) to bare Alif (ا)
 * - Normalizes Yaa and Alif Maqsurah (ى) to ي
 * - Normalizes Taa Marbutah (ة) to ه
 * - Strips tatweel (ـ) and Quranic verse end symbols
 * - Preserves Arabic letters and roots
 */
export function normalizeArabic(text: string): string {
  if (!text) return '';
  return text
    // Remove Quranic and standard Arabic harakat / diacritics
    .replace(/[\u064B-\u065F\u0670\u06D6-\u06ED]/g, '')
    // Remove Tatweel (kashida)
    .replace(/\u0640/g, '')
    // Normalize Alif forms
    .replace(/[إأآ]/g, 'ا')
    // Normalize Yaa / Alif Maqsurah
    .replace(/[ى]/g, 'ي')
    // Normalize Taa Marbuta
    .replace(/ة/g, 'ه')
    // Strip Quranic verse markers and brackets
    .replace(/[\u06DD\uFD3E\uFD3F\(\)\[\]،؛؟.\-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalizes Devanagari script:
 * - Strips Vedic accents (\u0951, \u0952, \u0953, \u0954)
 * - Strips danda (।) and double danda (॥)
 * - Preserves consonants, conjuncts (virama), and matras (\p{M})
 */
export function normalizeDevanagari(text: string): string {
  if (!text) return '';
  return text
    .replace(/[\u0951\u0952\u0953\u0954]/g, '') // Vedic svara accents
    .replace(/[।॥|]/g, ' ') // Dandas
    .replace(/[\(\)\[\],.;:?\-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalizes Hebrew script:
 * - Strips Niqqud (vowels) and cantillation marks (\u0591-\u05BD, \u05BF-\u05C5, \u05C7)
 * - Preserves Hebrew square letters (Alef through Tav)
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
 * - Strips dandas, brackets, and non-letter punctuation
 * - Preserves consonants, vowel signs, and root letters
 */
export function normalizeGurmukhi(text: string): string {
  if (!text) return '';
  return text
    .replace(/[।॥|]/g, ' ')
    .replace(/[\(\)\[\],.;:?\-–—]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Normalizes Latin-script and IAST / Pali / Romanized transliterations:
 * - Decomposes and replaces IAST / Pali accented vowels & consonants (ā->a, ī->i, ū->u, ṛ->r, ś->s, ṣ->s, etc.)
 * - Strips punctuation, dashes, quotes
 * - PRESERVES Unicode letters (\p{L}), marks (\p{M}), and numbers (\p{N}) across all 7 script systems!
 */
export function normalizeLatinAndTransliteration(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    // Explicit IAST & Pali mappings
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
    // Normalize quotes & apostrophes
    .replace(/[''""`ʻʾʿ]/g, '')
    // Replace punctuation symbols with spaces, while strictly retaining \p{L} (letters), \p{M} (combining marks/matras), and \p{N} (numbers)
    .replace(/[^\p{L}\p{M}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Unified search token normalizer:
 * Safely normalizes across all 7 world traditions without destroying non-Latin characters.
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
 * - "Namokar Mantra", "Tattvartha Sutra 1:1", "Bhaktamara"
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
      citationType: 'verse',
    };
  }

  const hasQuranKeyword = lower.includes('quran') || lower.includes("qur'an") || lower.includes('surah') || lower.includes('surat');
  const isPureNumericCitation = /^\s*([0-9]{1,3})[:\s]([0-9]{1,3})\s*$/.test(lower);

  if (hasQuranKeyword || isPureNumericCitation) {
    const quranMatch = isPureNumericCitation
      ? lower.match(/^\s*([0-9]{1,3})[:\s]([0-9]{1,3})\s*$/)
      : lower.match(/(?:quran|qur'an|surah|surat)\s*([0-9]{1,3})(?:[:\s]([0-9]{1,3}))?/);

    if (quranMatch) {
      const surahNum = parseInt(quranMatch[1], 10);
      const ayahNum = quranMatch[2] ? parseInt(quranMatch[2], 10) : undefined;
      if (surahNum >= 1 && surahNum <= 114) {
        return {
          religion: 'islam',
          collectionId: 'quran',
          bookOrSurah: surahNum,
          chapterNumber: surahNum,
          verseNumber: ayahNum,
          rawQuery: q,
          isExactCitation: true,
          citationType: ayahNum ? 'verse' : 'chapter',
        };
      }
    }
  }

  // 2. HINDUISM: Bhagavad Gita patterns
  // E.g. "gita 2:47", "bhagavad gita 2:47", "bg 2:47", "gita 1:1", "gita chapter 1"
  const gitaMatch = lower.match(/(?:bhagavad\s*gita|gita|bg)\s*(?:chapter\s*)?([0-9]{1,2})(?:[:\s]([0-9]{1,2}))?/);
  if (gitaMatch) {
    const ch = parseInt(gitaMatch[1], 10);
    const v = gitaMatch[2] ? parseInt(gitaMatch[2], 10) : undefined;
    if (ch >= 1 && ch <= 18) {
      return {
        religion: 'hinduism',
        collectionId: 'gita',
        bookOrSurah: 'Bhagavad Gita',
        chapterNumber: ch,
        verseNumber: v,
        rawQuery: q,
        isExactCitation: true,
        citationType: v ? 'verse' : 'chapter',
      };
    }
  }

  // 3. CHRISTIANITY & CROSS-TRADITION PSALMS
  // E.g. "John 3:16", "Genesis 1:1", "Psalm 23", "Matthew 5:3", "1 Corinthians 13:4"
  const bibleRegex = /(?:([1-3]\s*)?([a-zA-Z]+))\s*([0-9]{1,3})(?:[:\s]([0-9]{1,3}))?/;
  const bibleMatch = lower.match(bibleRegex);
  if (bibleMatch) {
    const prefix = bibleMatch[1] ? bibleMatch[1].trim() + ' ' : '';
    const bookNamePart = (prefix + bibleMatch[2]).trim();
    const ch = parseInt(bibleMatch[3], 10);
    const v = bibleMatch[4] ? parseInt(bibleMatch[4], 10) : undefined;

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
      // Special cross-tradition handling for Psalm / Psalms:
      // Psalm queries relate to BOTH Judaism (Tehillim) and Christianity (Psalms)
      const isPsalmQuery = bookNamePart === 'psalm' || bookNamePart === 'psalms';
      return {
        religion: isPsalmQuery ? undefined : 'christianity',
        collectionId: isPsalmQuery ? 'psalms' : 'bible-kjv',
        bookOrSurah: bookEntry.id,
        chapterNumber: ch,
        verseNumber: v,
        rawQuery: q,
        isExactCitation: true,
        citationType: v ? 'verse' : 'chapter',
      };
    }
  }

  // 4. JUDAISM: Tanakh / Torah / Tehillim
  // E.g. "bereshit 1:1", "shemot 20:1", "tehillim 23", "tehillim 1"
  if (lower.includes('bereshit') || lower.includes('shemot') || lower.includes('devarim')) {
    const m = lower.match(/(?:bereshit|shemot|devarim)\s*([0-9]{1,3})(?:[:\s]([0-9]{1,3}))?/);
    if (m) {
      return {
        religion: 'judaism',
        collectionId: 'tanakh',
        bookOrSurah: lower.includes('bereshit') ? 'genesis' : lower.includes('shemot') ? 'exodus' : 'deuteronomy',
        chapterNumber: parseInt(m[1], 10) || 1,
        verseNumber: m[2] ? parseInt(m[2], 10) : undefined,
        rawQuery: q,
        isExactCitation: true,
        citationType: m[2] ? 'verse' : 'chapter',
      };
    }
  }
  if (lower.includes('tehillim')) {
    const m = lower.match(/tehillim\s*([0-9]{1,3})(?:[:\s]([0-9]{1,3}))?/);
    if (m) {
      return {
        religion: 'judaism',
        collectionId: 'tanakh',
        bookOrSurah: 'psalms',
        chapterNumber: parseInt(m[1], 10) || 1,
        verseNumber: m[2] ? parseInt(m[2], 10) : undefined,
        rawQuery: q,
        isExactCitation: true,
        citationType: m[2] ? 'verse' : 'chapter',
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
      rawQuery: q,
      isExactCitation: true,
      citationType: 'composition',
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
        citationType: 'verse',
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
      rawQuery: q,
      isExactCitation: true,
      citationType: 'composition',
    };
  }
  if (lower.includes('dhammacakka') || lower.includes('turning the wheel')) {
    return {
      religion: 'buddhism',
      collectionId: 'samyutta',
      bookOrSurah: 'SN 56.11',
      chapterNumber: 'dhammacakka',
      rawQuery: q,
      isExactCitation: true,
      citationType: 'composition',
    };
  }
  if (lower.includes('metta') || lower.includes('karaniya')) {
    return {
      religion: 'buddhism',
      collectionId: 'khuddaka',
      bookOrSurah: 'Sutta Nipata 1.8',
      chapterNumber: 'metta',
      rawQuery: q,
      isExactCitation: true,
      citationType: 'composition',
    };
  }

  // 7. JAINISM: Namokar Mantra, Bhaktamara, Tattvartha
  // E.g. "namokar mantra", "navkar mantra", "bhaktamara", "tattvartha sutra 1"
  if (lower.includes('namokar') || lower.includes('navkar')) {
    return {
      religion: 'jainism',
      collectionId: 'navkar',
      bookOrSurah: 'Ṇamōkāra Mahā Mantra',
      chapterNumber: 'navkar',
      rawQuery: q,
      isExactCitation: true,
      citationType: 'composition',
    };
  }
  if (lower.includes('bhaktamara') || lower.includes('bhaktamar')) {
    return {
      religion: 'jainism',
      collectionId: 'bhaktamara',
      bookOrSurah: 'Bhaktamara Stotra',
      chapterNumber: 1,
      rawQuery: q,
      isExactCitation: true,
      citationType: 'composition',
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
      citationType: 'chapter',
    };
  }

  return null;
}
