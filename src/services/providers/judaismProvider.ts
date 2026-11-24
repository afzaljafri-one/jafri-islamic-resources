// ==============================================================================
// Judaism Scripture Provider (Sefaria API v3 & Mechon Mamre Integration)
// Tanakh: Torah, Nevi'im, Ketuvim (Masoretic Hebrew Text & English)
// Jafri Religious Books & Audio Platform
// ==============================================================================

import { SearchResultMatch } from '../../platform/types';
import { cacheService } from '../cacheService';

export interface TanakhBookMeta {
  id: string; // e.g. 'Genesis'
  heTitle: string; // e.g. 'בְּרֵאשִׁית'
  enTitle: string;
  category: 'Torah' | 'Nevi\'im' | 'Ketuvim';
  chapters: number;
  mechonMamreCode: string; // e.g. '01' for Genesis (producing t0101.mp3)
}

export interface TanakhVerseData {
  verseNumber: number;
  hebrewText: string;
  englishText: string;
}

export const TANAKH_BOOKS: TanakhBookMeta[] = [
  // Torah (Law / Pentateuch)
  { id: 'Genesis', enTitle: 'Genesis (Bereshit)', heTitle: 'בְּרֵאשִׁית', category: 'Torah', chapters: 50, mechonMamreCode: '01' },
  { id: 'Exodus', enTitle: 'Exodus (Shemot)', heTitle: 'שְׁמוֹת', category: 'Torah', chapters: 40, mechonMamreCode: '02' },
  { id: 'Leviticus', enTitle: 'Leviticus (Vayikra)', heTitle: 'וַיִּקְרָא', category: 'Torah', chapters: 27, mechonMamreCode: '03' },
  { id: 'Numbers', enTitle: 'Numbers (Bamidbar)', heTitle: 'בְּמִדְבַּר', category: 'Torah', chapters: 36, mechonMamreCode: '04' },
  { id: 'Deuteronomy', enTitle: 'Deuteronomy (Devarim)', heTitle: 'דְּבָרִים', category: 'Torah', chapters: 34, mechonMamreCode: '05' },

  // Nevi'im (Prophets)
  { id: 'Joshua', enTitle: 'Joshua (Yehoshua)', heTitle: 'יְהוֹשֻׁעַ', category: 'Nevi\'im', chapters: 24, mechonMamreCode: '06' },
  { id: 'Judges', enTitle: 'Judges (Shoftim)', heTitle: 'שֹׁפְטִים', category: 'Nevi\'im', chapters: 21, mechonMamreCode: '07' },
  { id: 'I_Samuel', enTitle: 'I Samuel (Shmuel I)', heTitle: 'שְׁמוּאֵל א', category: 'Nevi\'im', chapters: 31, mechonMamreCode: '08a' },
  { id: 'Isaiah', enTitle: 'Isaiah (Yeshayahu)', heTitle: 'יְשַׁעְיָהוּ', category: 'Nevi\'im', chapters: 66, mechonMamreCode: '10' },

  // Ketuvim (Writings)
  { id: 'Psalms', enTitle: 'Psalms (Tehillim)', heTitle: 'תְּהִלִּים', category: 'Ketuvim', chapters: 150, mechonMamreCode: '26' },
  { id: 'Proverbs', enTitle: 'Proverbs (Mishlei)', heTitle: 'מִשְׁלֵי', category: 'Ketuvim', chapters: 31, mechonMamreCode: '28' },
];

export function cleanHebrewHtml(raw: string): string {
  if (!raw) return '';
  return raw.replace(/<[^>]+>/g, '').trim();
}

class JudaismProvider {
  private chapterCache: Record<string, TanakhVerseData[]> = {};

  async getChapter(bookId: string, chapter: number): Promise<TanakhVerseData[]> {
    const cacheKey = `${bookId}:${chapter}`;
    if (this.chapterCache[cacheKey]) {
      return this.chapterCache[cacheKey];
    }

    try {
      const cached = await cacheService.getIndexedDB<TanakhVerseData[]>(`tanakh_${cacheKey}`);
      if (cached && Array.isArray(cached) && cached.length > 0) {
        this.chapterCache[cacheKey] = cached;
        return cached;
      }
    } catch {
      // Continue to API fetch
    }

    try {
      const res = await fetch(
        `https://www.sefaria.org/api/v3/texts/${bookId}.${chapter}?version=hebrew&version=english`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      const versions: any[] = data.versions || [];
      const hebrewVersion = versions.find((v) => v.language === 'he');
      const englishVersion = versions.find((v) => v.language === 'en');

      const hebrewTexts: string[] = hebrewVersion?.text || [];
      const englishTexts: string[] = englishVersion?.text || [];

      const count = Math.max(hebrewTexts.length, englishTexts.length);
      const verses: TanakhVerseData[] = [];

      for (let i = 0; i < count; i++) {
        verses.push({
          verseNumber: i + 1,
          hebrewText: cleanHebrewHtml(hebrewTexts[i] || ''),
          englishText: cleanHebrewHtml(englishTexts[i] || ''),
        });
      }

      this.chapterCache[cacheKey] = verses;
      await cacheService.setIndexedDB(`tanakh_${cacheKey}`, verses);
      return verses;
    } catch {
      // Fallback offline verses for Genesis 1
      if (bookId === 'Genesis' && chapter === 1) {
        return [
          {
            verseNumber: 1,
            hebrewText: 'בְּרֵאשִׁ֖ית בָּרָ֣א אֱלֹהִ֑ים אֵ֥ת הַשָּׁמַ֖יִם וְאֵ֥ת הָאָֽרֶץ׃',
            englishText: 'In the beginning God created the heaven and the earth.',
          },
          {
            verseNumber: 2,
            hebrewText: 'וְהָאָ֗רֶץ הָיְתָ֥ה תֹ֙הוּ֙ וָבֹ֔הוּ וְחֹ֖שֶׁךְ עַל־פְּנֵ֣י תְה֑וֹם וְר֣וּחַ אֱלֹהִ֔ים מְרַחֶ֖פֶת עַל־פְּנֵ֥י הַמָּֽיִם׃',
            englishText: 'And the earth was unformed and void, and darkness was upon the face of the deep; and the spirit of God hovered over the face of the waters.',
          },
        ];
      }
      return [];
    }
  }

  getAudioUrl(book: TanakhBookMeta, chapter: number): string | null {
    if (!book.mechonMamreCode) return null;
    const chStr = chapter < 10 ? `0${chapter}` : `${chapter}`;
    return `https://www.mechon-mamre.org/mp3/t${book.mechonMamreCode}${chStr}.mp3`;
  }

  async search(query: string): Promise<SearchResultMatch[]> {
    if (!query.trim()) return [];
    try {
      const res = await fetch(
        `https://www.sefaria.org/api/search-wrapper?q=${encodeURIComponent(
          query.trim()
        )}&type=text`
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      return (data.hits?.hits || []).slice(0, 25).map((hit: any) => ({
        unitId: `judaism:${hit._id}`,
        address: {
          religionId: 'judaism',
          collectionId: 'tanakh',
          path: [
            { levelName: 'Book', identifier: hit._source?.book || 'Torah' },
            { levelName: 'Chapter', identifier: 1 },
          ],
          unitIdentifier: 1,
        },
        displayTitle: hit._source?.ref || 'Tanakh Ref',
        matchedField: 'translation',
        matchedSnippet: cleanHebrewHtml(hit.highlight?.text?.[0] || hit._source?.text || ''),
      }));
    } catch {
      return [];
    }
  }
}

export const judaismProvider = new JudaismProvider();
