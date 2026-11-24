// ==============================================================================
// Christianity Scripture Provider (Bolls Life API Integration)
// Public Domain Bibles: KJV, WEB, ASV, YLT
// Jafri Religious Books & Audio Platform
// ==============================================================================

import {
  SearchResultMatch,
} from '../../platform/types';
import { cacheService } from '../cacheService';
import { OFFLINE_BIBLE_CHAPTERS } from './christianityOfflineData';

export interface BibleBookMeta {
  bookid: number;
  name: string;
  chronorder: number;
  chapters: number;
}

export const CANONICAL_BIBLE_BOOKS: BibleBookMeta[] = [
  { bookid: 1, name: 'Genesis', chronorder: 1, chapters: 50 },
  { bookid: 2, name: 'Exodus', chronorder: 2, chapters: 40 },
  { bookid: 3, name: 'Leviticus', chronorder: 3, chapters: 27 },
  { bookid: 4, name: 'Numbers', chronorder: 4, chapters: 36 },
  { bookid: 5, name: 'Deuteronomy', chronorder: 5, chapters: 34 },
  { bookid: 6, name: 'Joshua', chronorder: 6, chapters: 24 },
  { bookid: 7, name: 'Judges', chronorder: 7, chapters: 21 },
  { bookid: 8, name: 'Ruth', chronorder: 8, chapters: 4 },
  { bookid: 9, name: '1 Samuel', chronorder: 9, chapters: 31 },
  { bookid: 10, name: '2 Samuel', chronorder: 10, chapters: 24 },
  { bookid: 11, name: '1 Kings', chronorder: 11, chapters: 22 },
  { bookid: 12, name: '2 Kings', chronorder: 12, chapters: 25 },
  { bookid: 13, name: '1 Chronicles', chronorder: 13, chapters: 29 },
  { bookid: 14, name: '2 Chronicles', chronorder: 14, chapters: 36 },
  { bookid: 15, name: 'Ezra', chronorder: 15, chapters: 10 },
  { bookid: 16, name: 'Nehemiah', chronorder: 16, chapters: 13 },
  { bookid: 17, name: 'Esther', chronorder: 17, chapters: 10 },
  { bookid: 18, name: 'Job', chronorder: 18, chapters: 42 },
  { bookid: 19, name: 'Psalms', chronorder: 19, chapters: 150 },
  { bookid: 20, name: 'Proverbs', chronorder: 20, chapters: 31 },
  { bookid: 21, name: 'Ecclesiastes', chronorder: 21, chapters: 12 },
  { bookid: 22, name: 'Song of Solomon', chronorder: 22, chapters: 8 },
  { bookid: 23, name: 'Isaiah', chronorder: 23, chapters: 66 },
  { bookid: 24, name: 'Jeremiah', chronorder: 24, chapters: 52 },
  { bookid: 25, name: 'Lamentations', chronorder: 25, chapters: 5 },
  { bookid: 26, name: 'Ezekiel', chronorder: 26, chapters: 48 },
  { bookid: 27, name: 'Daniel', chronorder: 27, chapters: 12 },
  { bookid: 28, name: 'Hosea', chronorder: 28, chapters: 14 },
  { bookid: 29, name: 'Joel', chronorder: 29, chapters: 3 },
  { bookid: 30, name: 'Amos', chronorder: 30, chapters: 9 },
  { bookid: 31, name: 'Obadiah', chronorder: 31, chapters: 1 },
  { bookid: 32, name: 'Jonah', chronorder: 32, chapters: 4 },
  { bookid: 33, name: 'Micah', chronorder: 33, chapters: 7 },
  { bookid: 34, name: 'Nahum', chronorder: 34, chapters: 3 },
  { bookid: 35, name: 'Habakkuk', chronorder: 35, chapters: 3 },
  { bookid: 36, name: 'Zephaniah', chronorder: 36, chapters: 3 },
  { bookid: 37, name: 'Haggai', chronorder: 37, chapters: 2 },
  { bookid: 38, name: 'Zechariah', chronorder: 38, chapters: 14 },
  { bookid: 39, name: 'Malachi', chronorder: 39, chapters: 4 },
  { bookid: 40, name: 'Matthew', chronorder: 40, chapters: 28 },
  { bookid: 41, name: 'Mark', chronorder: 41, chapters: 16 },
  { bookid: 42, name: 'Luke', chronorder: 42, chapters: 24 },
  { bookid: 43, name: 'John', chronorder: 43, chapters: 21 },
  { bookid: 44, name: 'Acts', chronorder: 44, chapters: 28 },
  { bookid: 45, name: 'Romans', chronorder: 45, chapters: 16 },
  { bookid: 46, name: '1 Corinthians', chronorder: 46, chapters: 16 },
  { bookid: 47, name: '2 Corinthians', chronorder: 47, chapters: 13 },
  { bookid: 48, name: 'Galatians', chronorder: 48, chapters: 6 },
  { bookid: 49, name: 'Ephesians', chronorder: 49, chapters: 6 },
  { bookid: 50, name: 'Philippians', chronorder: 50, chapters: 4 },
  { bookid: 51, name: 'Colossians', chronorder: 51, chapters: 4 },
  { bookid: 52, name: '1 Thessalonians', chronorder: 52, chapters: 5 },
  { bookid: 53, name: '2 Thessalonians', chronorder: 53, chapters: 3 },
  { bookid: 54, name: '1 Timothy', chronorder: 54, chapters: 6 },
  { bookid: 55, name: '2 Timothy', chronorder: 55, chapters: 4 },
  { bookid: 56, name: 'Titus', chronorder: 56, chapters: 3 },
  { bookid: 57, name: 'Philemon', chronorder: 57, chapters: 1 },
  { bookid: 58, name: 'Hebrews', chronorder: 58, chapters: 13 },
  { bookid: 59, name: 'James', chronorder: 59, chapters: 5 },
  { bookid: 60, name: '1 Peter', chronorder: 60, chapters: 5 },
  { bookid: 61, name: '2 Peter', chronorder: 61, chapters: 3 },
  { bookid: 62, name: '1 John', chronorder: 62, chapters: 5 },
  { bookid: 63, name: '2 John', chronorder: 63, chapters: 1 },
  { bookid: 64, name: '3 John', chronorder: 64, chapters: 1 },
  { bookid: 65, name: 'Jude', chronorder: 65, chapters: 1 },
  { bookid: 66, name: 'Revelation', chronorder: 66, chapters: 22 },
];

export interface BollsVerseRaw {
  pk: number;
  verse: number;
  text: string;
}

export const BIBLE_TRANSLATIONS = [
  {
    id: 'KJV',
    name: 'King James Version (1611/1769)',
    language: 'English',
    license: 'Public Domain',
    attribution: 'Standard Authorised Version, Crown copyright expired worldwide.',
  },
  {
    id: 'WEB',
    name: 'World English Bible',
    language: 'English',
    license: 'Creative Commons Zero (CC0)',
    attribution: 'Modern English translation explicitly dedicated to the public domain.',
  },
  {
    id: 'ASV',
    name: 'American Standard Version (1901)',
    language: 'English',
    license: 'Public Domain',
    attribution: 'American Standard Revised Version, Public Domain.',
  },
  {
    id: 'YLT',
    name: 'Young\'s Literal Translation (1898)',
    language: 'English',
    license: 'Public Domain',
    attribution: 'Robert Young strict word-for-word translation, Public Domain.',
  },
];

// Clean Strong's concordance tags like <S>7225</S> from text
export function cleanBibleText(raw: string): string {
  if (!raw) return '';
  return raw
    .replace(/<S>\d+<\/S>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

class ChristianityProvider {
  private booksCache: Record<string, BibleBookMeta[]> = {};
  private chaptersCache: Record<string, BollsVerseRaw[]> = {};

  async getBooks(translationId: string = 'KJV'): Promise<BibleBookMeta[]> {
    if (this.booksCache[translationId]) {
      return this.booksCache[translationId];
    }

    try {
      const res = await fetch(`https://bolls.life/get-books/${translationId}/`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: BibleBookMeta[] = await res.json();
      this.booksCache[translationId] = data;
      return data;
    } catch {
      // Complete 66-book Protestant Canon fallback if network is offline
      this.booksCache[translationId] = CANONICAL_BIBLE_BOOKS;
      return CANONICAL_BIBLE_BOOKS;
    }
  }

  async getChapterVerses(
    bookId: number,
    chapter: number,
    translationId: string = 'KJV'
  ): Promise<BollsVerseRaw[]> {
    const cacheKey = `${translationId}:${bookId}:${chapter}`;

    // Tier 1: In-memory cache
    if (this.chaptersCache[cacheKey]) {
      return this.chaptersCache[cacheKey];
    }

    // Tier 2: Persistent IndexedDB cache
    try {
      const cached = await cacheService.getIndexedDB<BollsVerseRaw[]>(`bible_${cacheKey}`);
      if (cached && Array.isArray(cached) && cached.length > 0) {
        this.chaptersCache[cacheKey] = cached;
        return cached;
      }
    } catch {
      // Continue to API fetch
    }

    // Tier 3: Live Bolls Life API
    try {
      const res = await fetch(
        `https://bolls.life/get-text/${translationId}/${bookId}/${chapter}/`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: BollsVerseRaw[] = await res.json();
      this.chaptersCache[cacheKey] = data;
      await cacheService.setIndexedDB(`bible_${cacheKey}`, data);
      return data;
    } catch {
      // Tier 4: Foundational canonical offline fallback (Genesis 1, Psalms 23 & 91, Matthew 5, John 1, etc.)
      const offlineKey = `${bookId}:${chapter}`;
      if (OFFLINE_BIBLE_CHAPTERS[offlineKey]) {
        return OFFLINE_BIBLE_CHAPTERS[offlineKey];
      }
      return [];
    }
  }

  async search(
    query: string,
    translationId: string = 'KJV'
  ): Promise<SearchResultMatch[]> {
    if (!query.trim()) return [];

    try {
      const res = await fetch(
        `https://bolls.life/v2/find/${translationId}?search=${encodeURIComponent(
          query.trim()
        )}&match_case=false&match_whole=false`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const rawData = await res.json();
      const results: Array<{
        pk: number;
        verse: number;
        book: number;
        chapter: number;
        text: string;
      }> = Array.isArray(rawData) ? rawData : rawData.results || [];

      const books = await this.getBooks(translationId);
      const bookMap = new Map(books.map((b) => [b.bookid, b.name]));

      return results.slice(0, 30).map((r) => {
        const bookName = bookMap.get(r.book) || `Book ${r.book}`;
        return {
          unitId: `christianity:${translationId}:${r.book}:${r.chapter}:${r.verse}`,
          address: {
            religionId: 'christianity',
            collectionId: `bible-${translationId.toLowerCase()}`,
            path: [
              { levelName: 'Book', identifier: r.book, label: bookName },
              { levelName: 'Chapter', identifier: r.chapter, label: `Chapter ${r.chapter}` },
            ],
            unitIdentifier: r.verse,
          },
          displayTitle: `${bookName} ${r.chapter}:${r.verse}`,
          matchedField: 'translation',
          matchedSnippet: cleanBibleText(r.text),
        };
      });
    } catch {
      return [];
    }
  }
}

export const christianityProvider = new ChristianityProvider();
