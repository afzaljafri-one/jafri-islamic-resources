// ==============================================================================
// Christianity Scripture Provider (Bolls Life API Integration)
// Public Domain Bibles: KJV, WEB, ASV, YLT
// Jafri Religious Books & Audio Platform
// ==============================================================================

import {
  SearchResultMatch,
} from '../../platform/types';

export interface BibleBookMeta {
  bookid: number;
  name: string;
  chronorder: number;
  chapters: number;
}

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
      // Fallback foundational books list if network is offline
      return [
        { bookid: 1, name: 'Genesis', chronorder: 1, chapters: 50 },
        { bookid: 2, name: 'Exodus', chronorder: 2, chapters: 40 },
        { bookid: 19, name: 'Psalms', chronorder: 19, chapters: 150 },
        { bookid: 40, name: 'Matthew', chronorder: 40, chapters: 28 },
        { bookid: 43, name: 'John', chronorder: 43, chapters: 21 },
        { bookid: 45, name: 'Romans', chronorder: 45, chapters: 16 },
        { bookid: 48, name: 'Galatians', chronorder: 48, chapters: 6 },
        { bookid: 49, name: 'Ephesians', chronorder: 49, chapters: 6 },
        { bookid: 66, name: 'Revelation', chronorder: 66, chapters: 22 },
      ];
    }
  }

  async getChapterVerses(
    bookId: number,
    chapter: number,
    translationId: string = 'KJV'
  ): Promise<BollsVerseRaw[]> {
    const cacheKey = `${translationId}:${bookId}:${chapter}`;
    if (this.chaptersCache[cacheKey]) {
      return this.chaptersCache[cacheKey];
    }

    try {
      const res = await fetch(
        `https://bolls.life/get-text/${translationId}/${bookId}/${chapter}/`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: BollsVerseRaw[] = await res.json();
      this.chaptersCache[cacheKey] = data;
      return data;
    } catch {
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
