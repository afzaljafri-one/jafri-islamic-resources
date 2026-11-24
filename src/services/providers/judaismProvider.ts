// ==============================================================================
// Judaism Scripture Provider (Sefaria API v3 & Mechon Mamre Integration)
// Complete 24-Book Jewish Tanakh (39 Physical Scrolls / 929 Chapters)
// Torah (5), Nevi'im (8 canonical / 21 scrolls), Ketuvim (11 canonical / 13 scrolls)
// Masoretic Hebrew Text with Niqqud & JPS 1917 English Translation
// Jafri Sacred Library — Religious Readings & Sacred Audio
// ==============================================================================

import { SearchResultMatch } from '../../platform/types';
import { cacheService } from '../cacheService';

export interface TanakhBookMeta {
  id: string; // Sefaria book slug e.g. 'Genesis', 'I_Samuel', 'Song_of_Songs'
  heTitle: string; // Vocalized Hebrew title e.g. 'בְּרֵאשִׁית'
  enTitle: string; // e.g. 'Genesis (Bereshit)'
  category: 'Torah' | 'Nevi\'im' | 'Ketuvim';
  canonicalBookNumber: number; // 1 to 24 in traditional Hebrew canon
  canonicalBookName: string; // Traditional grouping name
  chapters: number; // Total chapters
  mechonMamreCode: string; // Mechon Mamre recording code
}

export interface TanakhVerseData {
  verseNumber: number;
  hebrewText: string;
  englishText: string;
}

export const TANAKH_BOOKS: TanakhBookMeta[] = [
  // ============================================================================
  // TORAH (The Law / Pentateuch) — 5 Books, 187 Chapters
  // ============================================================================
  {
    id: 'Genesis',
    enTitle: 'Genesis (Bereshit)',
    heTitle: 'בְּרֵאשִׁית',
    category: 'Torah',
    canonicalBookNumber: 1,
    canonicalBookName: 'Genesis',
    chapters: 50,
    mechonMamreCode: '01',
  },
  {
    id: 'Exodus',
    enTitle: 'Exodus (Shemot)',
    heTitle: 'שְׁמוֹת',
    category: 'Torah',
    canonicalBookNumber: 2,
    canonicalBookName: 'Exodus',
    chapters: 40,
    mechonMamreCode: '02',
  },
  {
    id: 'Leviticus',
    enTitle: 'Leviticus (Vayikra)',
    heTitle: 'וַיִּקְרָא',
    category: 'Torah',
    canonicalBookNumber: 3,
    canonicalBookName: 'Leviticus',
    chapters: 27,
    mechonMamreCode: '03',
  },
  {
    id: 'Numbers',
    enTitle: 'Numbers (Bamidbar)',
    heTitle: 'בְּמִדְבַּר',
    category: 'Torah',
    canonicalBookNumber: 4,
    canonicalBookName: 'Numbers',
    chapters: 36,
    mechonMamreCode: '04',
  },
  {
    id: 'Deuteronomy',
    enTitle: 'Deuteronomy (Devarim)',
    heTitle: 'דְּבָרִים',
    category: 'Torah',
    canonicalBookNumber: 5,
    canonicalBookName: 'Deuteronomy',
    chapters: 34,
    mechonMamreCode: '05',
  },

  // ============================================================================
  // NEVI'IM (The Prophets) — 8 Canonical Books / 21 Scrolls, 373 Chapters
  // ============================================================================
  // Former Prophets (Nevi'im Rishonim)
  {
    id: 'Joshua',
    enTitle: 'Joshua (Yehoshua)',
    heTitle: 'יְהוֹשֻׁעַ',
    category: 'Nevi\'im',
    canonicalBookNumber: 6,
    canonicalBookName: 'Joshua',
    chapters: 24,
    mechonMamreCode: '06',
  },
  {
    id: 'Judges',
    enTitle: 'Judges (Shoftim)',
    heTitle: 'שֹׁפְטִים',
    category: 'Nevi\'im',
    canonicalBookNumber: 7,
    canonicalBookName: 'Judges',
    chapters: 21,
    mechonMamreCode: '07',
  },
  {
    id: 'I_Samuel',
    enTitle: 'I Samuel (Shmuel I)',
    heTitle: 'שְׁמוּאֵל א',
    category: 'Nevi\'im',
    canonicalBookNumber: 8,
    canonicalBookName: 'Samuel',
    chapters: 31,
    mechonMamreCode: '08a',
  },
  {
    id: 'II_Samuel',
    enTitle: 'II Samuel (Shmuel II)',
    heTitle: 'שְׁמוּאֵל ב',
    category: 'Nevi\'im',
    canonicalBookNumber: 8,
    canonicalBookName: 'Samuel',
    chapters: 24,
    mechonMamreCode: '08b',
  },
  {
    id: 'I_Kings',
    enTitle: 'I Kings (Melakhim I)',
    heTitle: 'מְלָכִים א',
    category: 'Nevi\'im',
    canonicalBookNumber: 9,
    canonicalBookName: 'Kings',
    chapters: 22,
    mechonMamreCode: '09a',
  },
  {
    id: 'II_Kings',
    enTitle: 'II Kings (Melakhim II)',
    heTitle: 'מְלָכִים ב',
    category: 'Nevi\'im',
    canonicalBookNumber: 9,
    canonicalBookName: 'Kings',
    chapters: 25,
    mechonMamreCode: '09b',
  },

  // Latter Prophets (Nevi'im Acharonim) — Major Prophets
  {
    id: 'Isaiah',
    enTitle: 'Isaiah (Yeshayahu)',
    heTitle: 'יְשַׁעְיָהוּ',
    category: 'Nevi\'im',
    canonicalBookNumber: 10,
    canonicalBookName: 'Isaiah',
    chapters: 66,
    mechonMamreCode: '10',
  },
  {
    id: 'Jeremiah',
    enTitle: 'Jeremiah (Yirmeyahu)',
    heTitle: 'יִרְמְיָהוּ',
    category: 'Nevi\'im',
    canonicalBookNumber: 11,
    canonicalBookName: 'Jeremiah',
    chapters: 52,
    mechonMamreCode: '11',
  },
  {
    id: 'Ezekiel',
    enTitle: 'Ezekiel (Yechezkel)',
    heTitle: 'יְחֶזְקֵאל',
    category: 'Nevi\'im',
    canonicalBookNumber: 12,
    canonicalBookName: 'Ezekiel',
    chapters: 48,
    mechonMamreCode: '12',
  },

  // Latter Prophets — The Twelve Minor Prophets (Trei Asar)
  {
    id: 'Hosea',
    enTitle: 'Hosea (Hoshea)',
    heTitle: 'הוֹשֵׁעַ',
    category: 'Nevi\'im',
    canonicalBookNumber: 13,
    canonicalBookName: 'The Twelve (Trei Asar)',
    chapters: 14,
    mechonMamreCode: '13',
  },
  {
    id: 'Joel',
    enTitle: 'Joel (Yoel)',
    heTitle: 'יוֹאֵל',
    category: 'Nevi\'im',
    canonicalBookNumber: 13,
    canonicalBookName: 'The Twelve (Trei Asar)',
    chapters: 4,
    mechonMamreCode: '14',
  },
  {
    id: 'Amos',
    enTitle: 'Amos',
    heTitle: 'עָמוֹס',
    category: 'Nevi\'im',
    canonicalBookNumber: 13,
    canonicalBookName: 'The Twelve (Trei Asar)',
    chapters: 9,
    mechonMamreCode: '15',
  },
  {
    id: 'Obadiah',
    enTitle: 'Obadiah (Ovadiah)',
    heTitle: 'עֹבַדְיָה',
    category: 'Nevi\'im',
    canonicalBookNumber: 13,
    canonicalBookName: 'The Twelve (Trei Asar)',
    chapters: 1,
    mechonMamreCode: '16',
  },
  {
    id: 'Jonah',
    enTitle: 'Jonah (Yonah)',
    heTitle: 'יוֹנָה',
    category: 'Nevi\'im',
    canonicalBookNumber: 13,
    canonicalBookName: 'The Twelve (Trei Asar)',
    chapters: 4,
    mechonMamreCode: '17',
  },
  {
    id: 'Micah',
    enTitle: 'Micah (Mikhah)',
    heTitle: 'מִיכָה',
    category: 'Nevi\'im',
    canonicalBookNumber: 13,
    canonicalBookName: 'The Twelve (Trei Asar)',
    chapters: 7,
    mechonMamreCode: '18',
  },
  {
    id: 'Nahum',
    enTitle: 'Nahum (Nachum)',
    heTitle: 'נַחוּם',
    category: 'Nevi\'im',
    canonicalBookNumber: 13,
    canonicalBookName: 'The Twelve (Trei Asar)',
    chapters: 3,
    mechonMamreCode: '19',
  },
  {
    id: 'Habakkuk',
    enTitle: 'Habakkuk (Chavakuk)',
    heTitle: 'חֲבַקּוּק',
    category: 'Nevi\'im',
    canonicalBookNumber: 13,
    canonicalBookName: 'The Twelve (Trei Asar)',
    chapters: 3,
    mechonMamreCode: '20',
  },
  {
    id: 'Zephaniah',
    enTitle: 'Zephaniah (Tzefanyah)',
    heTitle: 'צְפַנְיָה',
    category: 'Nevi\'im',
    canonicalBookNumber: 13,
    canonicalBookName: 'The Twelve (Trei Asar)',
    chapters: 3,
    mechonMamreCode: '21',
  },
  {
    id: 'Haggai',
    enTitle: 'Haggai (Chaggai)',
    heTitle: 'חַגַּי',
    category: 'Nevi\'im',
    canonicalBookNumber: 13,
    canonicalBookName: 'The Twelve (Trei Asar)',
    chapters: 2,
    mechonMamreCode: '22',
  },
  {
    id: 'Zechariah',
    enTitle: 'Zechariah (Zekharyah)',
    heTitle: 'זְכַרְיָה',
    category: 'Nevi\'im',
    canonicalBookNumber: 13,
    canonicalBookName: 'The Twelve (Trei Asar)',
    chapters: 14,
    mechonMamreCode: '23',
  },
  {
    id: 'Malachi',
    enTitle: 'Malachi (Malakhi)',
    heTitle: 'מַלְאָכִי',
    category: 'Nevi\'im',
    canonicalBookNumber: 13,
    canonicalBookName: 'The Twelve (Trei Asar)',
    chapters: 3,
    mechonMamreCode: '24',
  },

  // ============================================================================
  // KETUVIM (The Writings) — 11 Canonical Books / 13 Scrolls, 369 Chapters
  // ============================================================================
  // Three Poetic Books (Sifrei Emet)
  {
    id: 'Psalms',
    enTitle: 'Psalms (Tehillim)',
    heTitle: 'תְּהִלִּים',
    category: 'Ketuvim',
    canonicalBookNumber: 14,
    canonicalBookName: 'Psalms',
    chapters: 150,
    mechonMamreCode: '26',
  },
  {
    id: 'Proverbs',
    enTitle: 'Proverbs (Mishlei)',
    heTitle: 'מִשְׁלֵי',
    category: 'Ketuvim',
    canonicalBookNumber: 15,
    canonicalBookName: 'Proverbs',
    chapters: 31,
    mechonMamreCode: '28',
  },
  {
    id: 'Job',
    enTitle: 'Job (Iyov)',
    heTitle: 'אִיּוֹב',
    category: 'Ketuvim',
    canonicalBookNumber: 16,
    canonicalBookName: 'Job',
    chapters: 42,
    mechonMamreCode: '27',
  },

  // Five Scrolls (Hamesh Megillot)
  {
    id: 'Song_of_Songs',
    enTitle: 'Song of Songs (Shir HaShirim)',
    heTitle: 'שִׁיר הַשִּׁירִים',
    category: 'Ketuvim',
    canonicalBookNumber: 17,
    canonicalBookName: 'Song of Songs',
    chapters: 8,
    mechonMamreCode: '30',
  },
  {
    id: 'Ruth',
    enTitle: 'Ruth (Rut)',
    heTitle: 'רוּת',
    category: 'Ketuvim',
    canonicalBookNumber: 18,
    canonicalBookName: 'Ruth',
    chapters: 4,
    mechonMamreCode: '29',
  },
  {
    id: 'Lamentations',
    enTitle: 'Lamentations (Eikhah)',
    heTitle: 'אֵיכָה',
    category: 'Ketuvim',
    canonicalBookNumber: 19,
    canonicalBookName: 'Lamentations',
    chapters: 5,
    mechonMamreCode: '31',
  },
  {
    id: 'Ecclesiastes',
    enTitle: 'Ecclesiastes (Kohelet)',
    heTitle: 'קֹהֶלֶת',
    category: 'Ketuvim',
    canonicalBookNumber: 20,
    canonicalBookName: 'Ecclesiastes',
    chapters: 12,
    mechonMamreCode: '32',
  },
  {
    id: 'Esther',
    enTitle: 'Esther',
    heTitle: 'אֶסְתֵּר',
    category: 'Ketuvim',
    canonicalBookNumber: 21,
    canonicalBookName: 'Esther',
    chapters: 10,
    mechonMamreCode: '33',
  },

  // Other Writings
  {
    id: 'Daniel',
    enTitle: 'Daniel',
    heTitle: 'דָּנִיֵּאל',
    category: 'Ketuvim',
    canonicalBookNumber: 22,
    canonicalBookName: 'Daniel',
    chapters: 12,
    mechonMamreCode: '34',
  },
  {
    id: 'Ezra',
    enTitle: 'Ezra',
    heTitle: 'עֶזְרָא',
    category: 'Ketuvim',
    canonicalBookNumber: 23,
    canonicalBookName: 'Ezra–Nehemiah',
    chapters: 10,
    mechonMamreCode: '35a',
  },
  {
    id: 'Nehemiah',
    enTitle: 'Nehemiah (Nechemyah)',
    heTitle: 'נְחֶמְיָה',
    category: 'Ketuvim',
    canonicalBookNumber: 23,
    canonicalBookName: 'Ezra–Nehemiah',
    chapters: 13,
    mechonMamreCode: '35b',
  },
  {
    id: 'I_Chronicles',
    enTitle: 'I Chronicles (Divrei HaYamim I)',
    heTitle: 'דִּבְרֵי הַיָּמִים א',
    category: 'Ketuvim',
    canonicalBookNumber: 24,
    canonicalBookName: 'Chronicles',
    chapters: 29,
    mechonMamreCode: '25a',
  },
  {
    id: 'II_Chronicles',
    enTitle: 'II Chronicles (Divrei HaYamim II)',
    heTitle: 'דִּבְרֵי הַיָּמִים ב',
    category: 'Ketuvim',
    canonicalBookNumber: 24,
    canonicalBookName: 'Chronicles',
    chapters: 36,
    mechonMamreCode: '25b',
  },
];

export function cleanHebrewHtml(raw: any): string {
  if (!raw) return '';
  if (Array.isArray(raw)) {
    return raw.map(cleanHebrewHtml).join(' ');
  }
  return String(raw).replace(/<[^>]+>/g, '').trim();
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

      const hebrewTexts: any[] = hebrewVersion?.text || [];
      const englishTexts: any[] = englishVersion?.text || [];

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
