// ==============================================================================
// Universal Multi-Religion Scripture Search Engine
// High-Performance Multilingual Search Service across 7 World Religions
// Jafri Religious Resources — Phase 6.3
// ==============================================================================

import { ReligionId } from '../types/religion';
import {
  SearchMatchType,
  UniversalSearchResult,
  SearchFilterOptions,
  SearchHistoryItem,
  ThematicSubjectDefinition,
} from '../types/search';
import {
  normalizeForSearch,
  parseScriptureReference,
} from '../utils/searchNormalization';

// Import Bundled Authentic Datasets
import { CANONICAL_SURAHS, CanonicalSurahMeta } from '../../services/audio/surahMetadata';
import {
  GITA_CHAPTERS,
  FOUNDATIONAL_GITA_VERSES,
  GitaVerseData,
} from '../../services/providers/hinduismProvider';
import { GITA_CHAPTER_1_OFFLINE } from '../../services/providers/hinduism/gitaChapter1Data';
import { HINDUISM_COLLECTIONS } from '../../services/providers/hinduism/hinduismCollections';
import { HINDUISM_TEXT_DATA, HinduismVerseUnit } from '../../services/providers/hinduism/hinduismTextData';
import { CANONICAL_BIBLE_BOOKS } from '../../services/providers/christianityProvider';
import { OFFLINE_BIBLE_CHAPTERS } from '../../services/providers/christianityOfflineData';
import { OFFLINE_ANGS_1_TO_13 } from '../../services/providers/sikhismOfflineAngs';
import { BUDDHISM_COLLECTIONS } from '../../services/providers/buddhism/buddhismCollections';
import { BUDDHISM_TEXT_DATA, BuddhismVerseUnit } from '../../services/providers/buddhism/buddhismTextData';
import { JAINISM_COLLECTIONS } from '../../services/providers/jainism/jainismCollections';
import { JAINISM_TEXT_DATA, JainVerseUnit } from '../../services/providers/jainism/jainismTextData';

const RECENT_SEARCHES_STORAGE_KEY = 'jafri_recent_searches_v1';
const MAX_RECENT_SEARCHES = 10;

// Curated Foundation Passages for Islam
const ISLAM_FOUNDATIONAL_PASSAGES: Array<{
  surah: number;
  ayah: number;
  title: string;
  originalText: string;
  transliteration: string;
  translationEn: string;
  translationUr?: string;
  theme?: string;
}> = [
  {
    surah: 1,
    ayah: 1,
    title: 'Surah Al-Faatiha — Ayah 1 (Bismillah)',
    originalText: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
    transliteration: 'Bismillāhir-Raḥmānir-Raḥīm',
    translationEn: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.',
    translationUr: 'اللہ کے نام سے جو رحمان و رحیم ہے۔',
    theme: 'Compassion',
  },
  {
    surah: 1,
    ayah: 2,
    title: 'Surah Al-Faatiha — Ayah 2 (Al-Hamd)',
    originalText: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
    transliteration: 'Al-ḥamdu lillāhi Rabbil-‘ālamīn',
    translationEn: '[All] praise is [due] to Allah, Lord of the worlds.',
    translationUr: 'سب تعریفیں اللہ کے لیے ہیں جو تمام جہانوں کا رب ہے۔',
    theme: 'Gratitude',
  },
  {
    surah: 2,
    ayah: 153,
    title: 'Surah Al-Baqarah — Ayah 153 (Patience & Prayer)',
    originalText: 'يَا أَيُّهَا الَّذِينَ آمَنُوا اسْتَعِينُوا بِالصَّبْرِ وَالصَّلَاةِ ۚ إِنَّ اللَّهَ مَعَ الصَّابِرِينَ',
    transliteration: 'Yā ayyuhalladhīna āmanūsta‘īnū biṣ-ṣabri waṣ-ṣalāh; innallāha ma‘aṣ-ṣābirīn',
    translationEn: 'O you who have believed, seek help through patience and prayer. Indeed, Allah is with the patient.',
    translationUr: 'اے ایمان والو! صبر اور نماز سے مدد لو، بے شک اللہ صبر کرنے والوں کے ساتھ ہے۔',
    theme: 'Patience',
  },
  {
    surah: 2,
    ayah: 255,
    title: 'Ayat al-Kursi (The Throne Verse) — Surah Al-Baqarah 2:255',
    originalText: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَّهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ',
    transliteration: 'Allāhu lā ilāha illā huwal-Ḥayyul-Qayyūm; lā ta’khudhuhū sinatuw-wa lā nawm; lahū mā fis-samāwāti wa mā fil-arḍ',
    translationEn: 'Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence. Neither drowsiness overtakes Him nor sleep. To Him belongs whatever is in the heavens and whatever is on the earth.',
    translationUr: 'اللہ! اس کے سوا کوئی معبود نہیں، وہ زندہ ہے سب کا تھامنے والا، اسے نہ اونگھ آتی ہے نہ نیند۔',
    theme: 'Wisdom',
  },
  {
    surah: 2,
    ayah: 261,
    title: 'Surah Al-Baqarah — Ayah 261 (Charity & Generosity)',
    originalText: 'مَّثَلُ الَّذِينَ يُنفِقُونَ أَمْوَالَهُمْ فِي سَبِيلِ اللَّهِ كَمَثَلِ حَبَّةٍ أَنبَتَتْ سَبْعَ سَنَابِلَ فِي كُلِّ سُنبُلَةٍ مِّائَةُ حَبَّةٍ',
    transliteration: 'Mathalulladhīna yunfiqūna amwālahum fī sabīlillāhi kamathali ḥabbatin ambatat sab‘a sanābila fī kulli sumbulatim mi’atu ḥabbah',
    translationEn: 'The example of those who spend their wealth in the way of Allah is like a seed [of grain] which grows seven spikes; in each spike is a hundred grains.',
    translationUr: 'جو لوگ اپنا مال اللہ کی راہ میں خرچ کرتے ہیں ان کی مثال اس دانے جیسی ہے جس سے سات بالیں اگیں۔',
    theme: 'Charity',
  },
  {
    surah: 2,
    ayah: 269,
    title: 'Surah Al-Baqarah — Ayah 269 (Gift of Wisdom)',
    originalText: 'يُؤْتِي الْحِكْمَةَ مَن يَشَاءُ ۚ وَمَن يُؤْتَ الْحِكْمَةَ فَقَدْ أُوتِيَ خَيْرًا كَثِيرًا',
    transliteration: 'Yu’til-ḥikmata may-yashā’; wa may-yu’tal-ḥikmata faqad ūtiya khayran kathīrā',
    translationEn: 'He gives wisdom to whom He wills, and whoever has been given wisdom has certainly been given much good.',
    translationUr: 'وہ جسے چاہے حکمت عطا کرتا ہے، اور جسے حکمت مل گئی اسے بڑی دولت مل گئی۔',
    theme: 'Wisdom',
  },
  {
    surah: 3,
    ayah: 134,
    title: 'Surah Ali ‘Imran — Ayah 134 (Forgiveness & Restraint)',
    originalText: 'الَّذِينَ يُنفِقُونَ فِي السَّرَّاءِ وَالضَّرَّاءِ وَالْكَاظِمِينَ الْغَيْظَ وَالْعَافِينَ عَنِ النَّاسِ ۗ وَاللَّهُ يُحِبُّ الْمُحْسِنِينَ',
    transliteration: 'Alladhīna yunfiqūna fis-sarrā’i waḍ-ḍarrā’i wal-kāẓimīnal-ghayẓa wal-‘āfīna ‘anin-nās; wallāhu yuḥibbul-muḥsinīn',
    translationEn: 'Who spend [in the cause of Allah] during ease and hardship and who restrain anger and who pardon the people - and Allah loves the doers of good.',
    translationUr: 'جو خوشحالی اور تنگ دستی میں خرچ کرتے ہیں اور غصہ پینے والے اور لوگوں کو معاف کرنے والے ہیں، اور اللہ نیکی کرنے والوں سے محبت کرتا ہے۔',
    theme: 'Forgiveness',
  },
  {
    surah: 14,
    ayah: 7,
    title: 'Surah Ibrahim — Ayah 7 (Promise of Gratitude)',
    originalText: 'وَإِذْ تَأَذَّنَ رَبُّكُمْ لَئِن شَكَرْتُمْ لَأَزِيدَنَّكُمْ',
    transliteration: 'Wa idh ta’adhdhana Rabbukum la’in shakartum la’azīdannakum',
    translationEn: 'And [remember] when your Lord proclaimed, "If you are grateful, I will surely increase you [in favor]."',
    translationUr: 'اور جب تمہارے رب نے آگاہ کر دیا کہ اگر تم شکر کرو گے تو میں تمہیں اور زیادہ دوں گا۔',
    theme: 'Gratitude',
  },
  {
    surah: 25,
    ayah: 63,
    title: 'Surah Al-Furqan — Ayah 63 (Servants of the Merciful & Peace)',
    originalText: 'وَعِبَادُ الرَّحْمَٰنِ الَّذِينَ يَمْشُونَ عَلَى الْأَرْضِ هَوْنًا وَإِذَا خَاطَبَهُمُ الْجَاهِلُونَ قَالُوا سَلَامًا',
    transliteration: 'Wa ‘ibādur-Raḥmānilladhīna yamshūna ‘alal-arḍi hawnaw-wa idhā khāṭabahumul-jāhilūna qālū salāmā',
    translationEn: 'And the servants of the Most Merciful are those who walk upon the earth easily, and when the ignorant address them [harshly], they say [words of] peace.',
    translationUr: 'اور رحمان کے بندے وہ ہیں جو زمین پر عاجزی سے چلتے ہیں اور جب جاہل ان سے بات کرتے ہیں تو کہتے ہیں سلام ہے۔',
    theme: 'Peace',
  },
  {
    surah: 112,
    ayah: 1,
    title: 'Surah Al-Ikhlas — Ayah 1 (The Purity of Faith)',
    originalText: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
    transliteration: 'Qul huwal-Lāhu Aḥad',
    translationEn: 'Say, "He is Allah, [who is] One."',
    translationUr: 'کہہ دیجیے کہ وہ اللہ ایک ہے۔',
  },
];

// Curated Foundation Passages for Judaism
const JUDAISM_FOUNDATIONAL_PASSAGES: Array<{
  id: string;
  collectionId: string;
  chapter: number | string;
  verse: number | string;
  displayCoordinates: string;
  title: string;
  originalText: string;
  translationEn: string;
  theme?: string;
}> = [
  {
    id: 'jud_gen_1_1',
    collectionId: 'torah',
    chapter: 1,
    verse: 1,
    displayCoordinates: 'Bereshit (Genesis) 1:1',
    title: 'Bereshit 1:1 — The Creation of Heavens and Earth',
    originalText: 'בְּרֵאשִׁית בָּרָא אֱלֹהִים אֵת הַשָּׁמַיִם וְאֵת הָאָרֶץ׃',
    translationEn: 'In the beginning God created the heaven and the earth.',
  },
  {
    id: 'jud_shema',
    collectionId: 'torah',
    chapter: 6,
    verse: 4,
    displayCoordinates: 'Devarim (Deuteronomy) 6:4',
    title: 'The Shema Yisrael — Proclamation of Divine Unity',
    originalText: 'שְׁמַע יִשְׂרָאֵל יְהוָה אֱלֹהֵינוּ יְהוָה אֶחָד׃',
    translationEn: 'Hear, O Israel: The LORD our God is one LORD.',
    theme: 'Wisdom',
  },
  {
    id: 'jud_psalm_23_1',
    collectionId: 'ketuvim',
    chapter: 23,
    verse: 1,
    displayCoordinates: 'Mizmor LeDavid (Psalm) 23:1',
    title: 'Psalm 23:1 — The LORD is My Shepherd',
    originalText: 'מִזְמוֹר לְדָוִד יְהוָה רֹעִי לֹא אֶחְסָר׃',
    translationEn: 'A Psalm of David. The LORD is my shepherd; I shall not want.',
    theme: 'Peace',
  },
  {
    id: 'jud_psalm_145_9',
    collectionId: 'ketuvim',
    chapter: 145,
    verse: 9,
    displayCoordinates: 'Tehillim (Psalm) 145:9',
    title: 'Psalm 145:9 — Compassion over All Creation',
    originalText: 'טוֹב־יְהוָה לַכֹּל וְרַחֲמָיו עַל־כָּל־מַעֲשָׂיו׃',
    translationEn: 'The LORD is good to all: and His tender mercies are over all His works.',
    theme: 'Compassion',
  },
  {
    id: 'jud_exodus_20_1',
    collectionId: 'torah',
    chapter: 20,
    verse: 1,
    displayCoordinates: 'Shemot (Exodus) 20:1-2',
    title: 'The Decalogue (Ten Commandments)',
    originalText: 'וַיְדַבֵּר אֱלֹהִים אֵת כָּל־הַדְּבָרִים הָאֵלֶּה לֵאמֹר׃ אָנֹכִי יְהוָה אֱלֹהֶיךָ',
    translationEn: 'And God spoke all these words, saying: I am the LORD your God, who brought you out of the land of Egypt.',
    theme: 'Wisdom',
  },
  {
    id: 'jud_prov_19_17',
    collectionId: 'ketuvim',
    chapter: 19,
    verse: 17,
    displayCoordinates: 'Mishlei (Proverbs) 19:17',
    title: 'Proverbs 19:17 — Charity as Kindness to the Divine',
    originalText: 'מַלְוֵה יְהוָה חוֹנֵן דָּל וּגְמֻלוֹ יְשַׁלֶּם־לוֹ׃',
    translationEn: 'He that hath pity upon the poor lendeth unto the LORD; and that which he hath given will He pay him again.',
    theme: 'Charity',
  },
  {
    id: 'jud_psalm_103_3',
    collectionId: 'ketuvim',
    chapter: 103,
    verse: 3,
    displayCoordinates: 'Tehillim (Psalm) 103:3',
    title: 'Psalm 103:3 — Divine Pardon and Healing',
    originalText: 'הַסֹּלֵחַ לְכָל־עֲו‍ֹנֵכִי הָרֹפֵא לְכָל־תַּחֲלֻאָיְכִי׃',
    translationEn: 'Who forgiveth all thine iniquities; who healeth all thy diseases.',
    theme: 'Forgiveness',
  },
];

export class UniversalScriptureSearchService {
  private static instance: UniversalScriptureSearchService;
  private corpusIndex: UniversalSearchResult[] = [];
  private indexed = false;

  private constructor() {
    this.buildStaticCorpusIndex();
  }

  public static getInstance(): UniversalScriptureSearchService {
    if (!UniversalScriptureSearchService.instance) {
      UniversalScriptureSearchService.instance = new UniversalScriptureSearchService();
    }
    return UniversalScriptureSearchService.instance;
  }

  /**
   * Compiles and indexes authentic bundled scripture texts across all 7 traditions
   */
  private buildStaticCorpusIndex(): void {
    if (this.indexed) return;
    const index: UniversalSearchResult[] = [];

    // =========================================================================
    // 1. ISLAM CORPUS INDEXING
    // =========================================================================
    // A. All 114 Surahs
    Object.values(CANONICAL_SURAHS).forEach((meta: CanonicalSurahMeta) => {
      index.push({
        id: `islam_surah_${meta.number}`,
        religion: 'islam',
        collectionId: 'quran',
        collectionTitle: 'The Holy Qur’an',
        chapterNumber: meta.number,
        verseNumber: 1,
        displayCoordinates: `Surah ${meta.number} (${meta.englishName})`,
        displayTitle: `Surah ${meta.englishName} (${meta.arabicName})`,
        originalText: meta.arabicName,
        translationText: `Surah ${meta.englishName} contains ${meta.totalAyahs} verses in the Holy Qur’an.`,
        transliterationText: meta.englishName,
        languageCode: 'ar',
        sourceAttribution: 'The Holy Qur’an • Universal Hafs Recitation',
        matchType: 'exact_reference',
        isOfflineAvailable: true,
        score: 100,
      });
    });

    // B. Prominent Canonical Ayahs
    ISLAM_FOUNDATIONAL_PASSAGES.forEach((item) => {
      index.push({
        id: `islam_ayah_${item.surah}_${item.ayah}`,
        religion: 'islam',
        collectionId: 'quran',
        collectionTitle: 'The Holy Qur’an',
        chapterNumber: item.surah,
        verseNumber: item.ayah,
        displayCoordinates: `Quran ${item.surah}:${item.ayah}`,
        displayTitle: item.title,
        originalText: item.originalText,
        translationText: item.translationEn,
        secondaryTranslationText: item.translationUr,
        transliterationText: item.transliteration,
        languageCode: 'ar',
        sourceAttribution: 'Sahih International & Allama Jawadi Translation',
        matchType: 'exact_reference',
        thematicKeyword: item.theme,
        isOfflineAvailable: true,
        score: 95,
      });
    });

    // =========================================================================
    // 2. HINDUISM CORPUS INDEXING
    // =========================================================================
    // A. Bhagavad Gita 18 Chapters
    GITA_CHAPTERS.forEach((ch) => {
      index.push({
        id: `hinduism_gita_ch_${ch.chapter_number}`,
        religion: 'hinduism',
        collectionId: 'gita',
        collectionTitle: 'Shrimad Bhagavad Gita',
        chapterNumber: ch.chapter_number,
        verseNumber: 1,
        displayCoordinates: `Bhagavad Gita Chapter ${ch.chapter_number}`,
        displayTitle: `Gita Chapter ${ch.chapter_number}: ${ch.translation} (${ch.name})`,
        originalText: ch.name,
        translationText: ch.meaningEn,
        transliterationText: ch.transliteration,
        languageCode: 'sa',
        sourceAttribution: 'Shrimad Bhagavad Gita • Swami Sivananda Commentary',
        matchType: 'exact_reference',
        isOfflineAvailable: true,
        score: 95,
      });
    });

    // B. Foundational Shlokas (Gita 1:1, 2:47, etc.)
    (Object.entries(FOUNDATIONAL_GITA_VERSES) as [string, GitaVerseData][]).forEach(([key, verse]) => {
      const [ch, v] = key.split(':').map(Number);
      index.push({
        id: `hinduism_gita_shloka_${ch}_${v}`,
        religion: 'hinduism',
        collectionId: 'gita',
        collectionTitle: 'Shrimad Bhagavad Gita',
        chapterNumber: ch,
        verseNumber: v,
        displayCoordinates: `Bhagavad Gita ${ch}:${v}`,
        displayTitle: `Gita ${ch}:${v} — ${ch === 2 && v === 47 ? 'Karmanye Vadhikaraste (Yoga of Action)' : 'Universal Gita Shloka'}`,
        originalText: verse.slok,
        translationText: verse.sivanandaEn || verse.gambhiranandaEn || verse.purohitEn,
        secondaryTranslationText: verse.ramsukhdasHi,
        transliterationText: verse.transliteration,
        languageCode: 'sa',
        sourceAttribution: 'Swami Sivananda (Divine Life Society) & Swami Gambhirananda',
        matchType: 'exact_reference',
        thematicKeyword: ch === 2 && v === 47 ? 'Wisdom' : ch === 12 && v === 13 ? 'Compassion' : undefined,
        isOfflineAvailable: true,
        score: 95,
      });
    });

    // C. Gita Chapter 1 Complete 47 Shlokas
    GITA_CHAPTER_1_OFFLINE.forEach((shloka) => {
      index.push({
        id: `hinduism_gita_1_${shloka.verse}`,
        religion: 'hinduism',
        collectionId: 'gita',
        collectionTitle: 'Shrimad Bhagavad Gita',
        chapterNumber: 1,
        verseNumber: shloka.verse,
        displayCoordinates: `Bhagavad Gita 1:${shloka.verse}`,
        displayTitle: `Gita 1:${shloka.verse} — Arjuna Visada Yoga`,
        originalText: shloka.slok,
        translationText: shloka.sivanandaEn,
        secondaryTranslationText: shloka.ramsukhdasHi,
        transliterationText: shloka.transliteration,
        languageCode: 'sa',
        sourceAttribution: 'Swami Sivananda & Shri Purohit Swami',
        matchType: 'word_match',
        isOfflineAvailable: true,
        score: 85,
      });
    });

    // D. Expanded Hinduism Collections & Verses (Vedas, Upanishads, Mantras)
    HINDUISM_COLLECTIONS.forEach((col) => {
      const units = HINDUISM_TEXT_DATA[col.id] || [];
      units.forEach((u: HinduismVerseUnit) => {
        index.push({
          id: `hinduism_${u.id}`,
          religion: 'hinduism',
          collectionId: col.id,
          collectionTitle: col.title,
          readingId: col.id,
          chapterNumber: 1,
          verseNumber: typeof u.unitNumber === 'number' ? u.unitNumber : 1,
          displayCoordinates: `${col.title} ${u.unitNumber}`,
          displayTitle: `${col.title} (${col.nativeTitle}) — ${u.sectionTitle || col.title}`,
          originalText: u.originalText,
          translationText: u.translationEn,
          secondaryTranslationText: u.translationHi,
          transliterationText: u.transliteration,
          languageCode: 'sa',
          sourceAttribution: `${col.title} • Authorized Traditional Edition`,
          matchType: 'word_match',
          isOfflineAvailable: true,
          score: 85,
        });
      });
    });

    // =========================================================================
    // 3. CHRISTIANITY CORPUS INDEXING
    // =========================================================================
    // A. All 66 Canonical Bible Books
    CANONICAL_BIBLE_BOOKS.forEach((b) => {
      index.push({
        id: `christianity_book_${b.bookid}`,
        religion: 'christianity',
        collectionId: 'bible-kjv',
        collectionTitle: 'The Holy Bible (King James Version)',
        readingId: String(b.bookid),
        chapterNumber: 1,
        verseNumber: 1,
        displayCoordinates: `The Book of ${b.name}`,
        displayTitle: `${b.name} (${b.chapters} Chapters)`,
        originalText: b.name,
        translationText: `The Book of ${b.name} contains ${b.chapters} chapters in the canonical Old/New Testament.`,
        languageCode: 'en',
        sourceAttribution: 'King James Version (KJV) • Public Domain',
        matchType: 'exact_reference',
        isOfflineAvailable: true,
        score: 95,
      });
    });

    // B. Foundational Chapters (Genesis 1, Psalm 23, Psalm 91, Matthew 5, John 1, 1 Cor 13, Rev 21)
    const BIBLE_REF_LABELS: Record<string, { bookId: number; bookName: string; chapter: number; title: string }> = {
      '1:1': { bookId: 1, bookName: 'Genesis', chapter: 1, title: 'Genesis 1 — The Creation of the Universe' },
      '19:23': { bookId: 19, bookName: 'Psalms', chapter: 23, title: 'Psalm 23 — The Shepherd Psalm' },
      '19:91': { bookId: 19, bookName: 'Psalms', chapter: 91, title: 'Psalm 91 — Divine Protection & Fortress' },
      '40:5': { bookId: 40, bookName: 'Matthew', chapter: 5, title: 'Matthew 5 — The Sermon on the Mount & The Beatitudes' },
      '43:1': { bookId: 43, bookName: 'John', chapter: 1, title: 'John 1 — The Prologue: The Word Made Flesh' },
      '46:13': { bookId: 46, bookName: '1 Corinthians', chapter: 13, title: '1 Corinthians 13 — The Hymn to Love and Charity' },
      '66:21': { bookId: 66, bookName: 'Revelation', chapter: 21, title: 'Revelation 21 — The New Heaven and New Earth' },
    };

    Object.entries(OFFLINE_BIBLE_CHAPTERS).forEach(([refKey, verses]) => {
      const meta = BIBLE_REF_LABELS[refKey];
      if (!meta) return;

      verses.forEach((v) => {
        index.push({
          id: `christianity_verse_${meta.bookId}_${meta.chapter}_${v.verse}`,
          religion: 'christianity',
          collectionId: 'bible-kjv',
          collectionTitle: 'The Holy Bible (King James Version)',
          readingId: String(meta.bookId),
          chapterNumber: meta.chapter,
          verseNumber: v.verse,
          displayCoordinates: `${meta.bookName} ${meta.chapter}:${v.verse}`,
          displayTitle: `${meta.bookName} ${meta.chapter}:${v.verse} — ${meta.title}`,
          originalText: v.text,
          translationText: v.text,
          languageCode: 'en',
          sourceAttribution: 'King James Version (1611) • Public Domain',
          matchType: 'exact_reference',
          thematicKeyword:
            refKey === '46:13'
              ? 'Charity'
              : refKey === '40:5'
              ? 'Compassion'
              : refKey === '19:23'
              ? 'Peace'
              : undefined,
          isOfflineAvailable: true,
          score: 95,
        });
      });
    });

    // Add John 3:16 specifically for canonical reference
    index.push({
      id: 'christianity_john_3_16',
      religion: 'christianity',
      collectionId: 'bible-kjv',
      collectionTitle: 'The Holy Bible (King James Version)',
      readingId: '43',
      chapterNumber: 3,
      verseNumber: 16,
      displayCoordinates: 'John 3:16',
      displayTitle: 'John 3:16 — For God So Loved the World',
      originalText: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
      translationText: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.',
      languageCode: 'en',
      sourceAttribution: 'King James Version (KJV) • Public Domain',
      matchType: 'exact_reference',
      thematicKeyword: 'Compassion',
      isOfflineAvailable: true,
      score: 100,
    });

    // =========================================================================
    // 4. JUDAISM CORPUS INDEXING
    // =========================================================================
    JUDAISM_FOUNDATIONAL_PASSAGES.forEach((item) => {
      index.push({
        id: item.id,
        religion: 'judaism',
        collectionId: item.collectionId,
        collectionTitle: 'The Tanakh (Hebrew Bible)',
        chapterNumber: item.chapter,
        verseNumber: item.verse,
        displayCoordinates: item.displayCoordinates,
        displayTitle: item.title,
        originalText: item.originalText,
        translationText: item.translationEn,
        languageCode: 'he',
        sourceAttribution: 'Jewish Publication Society (JPS 1917) & Sefaria Public Domain',
        matchType: 'exact_reference',
        thematicKeyword: item.theme,
        isOfflineAvailable: true,
        score: 95,
      });
    });

    // =========================================================================
    // 5. SIKHISM CORPUS INDEXING
    // =========================================================================
    // SGGS Japji Sahib Angs 1 to 13
    Object.values(OFFLINE_ANGS_1_TO_13).forEach((ang) => {
      ang.lines.forEach((v) => {
        index.push({
          id: `sikhism_ang_${ang.pageNo}_v_${v.lineNo}`,
          religion: 'sikhism',
          collectionId: 'sggs',
          collectionTitle: 'Sri Guru Granth Sahib Ji',
          chapterNumber: ang.pageNo,
          verseNumber: v.lineNo,
          displayCoordinates: `SGGS Ang ${ang.pageNo}`,
          displayTitle: `Sri Guru Granth Sahib Ji — Ang ${ang.pageNo} (${ang.raag})`,
          originalText: v.gurmukhi,
          translationText: v.translationEn,
          transliterationText: v.transliteration,
          languageCode: 'pa',
          sourceAttribution: 'Sri Guru Granth Sahib Ji • Sant Singh Khalsa Translation',
          matchType: 'exact_reference',
          thematicKeyword: ang.pageNo === 1 ? 'Wisdom' : ang.pageNo === 3 ? 'Compassion' : undefined,
          isOfflineAvailable: true,
          score: 95,
        });
      });
    });

    // =========================================================================
    // 6. BUDDHISM CORPUS INDEXING
    // =========================================================================
    BUDDHISM_COLLECTIONS.forEach((col) => {
      const texts = BUDDHISM_TEXT_DATA[col.id] || [];
      texts.forEach((t: BuddhismVerseUnit) => {
        index.push({
          id: `buddhism_${t.id}`,
          religion: 'buddhism',
          collectionId: col.id,
          collectionTitle: `Pali Canon Tipitaka — ${col.title}`,
          readingId: t.id,
          chapterNumber: t.id,
          verseNumber: 1,
          displayCoordinates: `${col.title} • ${t.sectionTitle || col.title}`,
          displayTitle: `${col.title} (${col.nativeTitle}) — ${t.sectionTitle || t.id}`,
          originalText: t.originalText,
          translationText: t.translationEn,
          transliterationText: t.transliteration,
          languageCode: 'pi',
          sourceAttribution: `${col.title} • Bhikkhu Sujato Translation (CC0)`,
          matchType: 'exact_reference',
          thematicKeyword:
            col.id === 'sutta_khuddaka'
              ? 'Compassion'
              : col.id === 'dhammapada'
              ? 'Wisdom'
              : undefined,
          isOfflineAvailable: true,
          score: 95,
        });
      });
    });

    // =========================================================================
    // 7. JAINISM CORPUS INDEXING
    // =========================================================================
    JAINISM_COLLECTIONS.forEach((col) => {
      const items = JAINISM_TEXT_DATA[col.id] || [];
      items.forEach((item: JainVerseUnit) => {
        index.push({
          id: `jainism_${item.id}`,
          religion: 'jainism',
          collectionId: col.id,
          collectionTitle: col.title,
          readingId: col.id,
          chapterNumber: 1,
          verseNumber: typeof item.unitNumber === 'number' ? item.unitNumber : 1,
          displayCoordinates: `${col.title} ${item.unitNumber}`,
          displayTitle: `${col.title} (${col.nativeTitle}) — ${item.sectionTitle || col.title}`,
          originalText: item.originalText,
          translationText: item.translationEn,
          secondaryTranslationText: item.translationHi,
          transliterationText: item.transliteration,
          languageCode: 'pka',
          sourceAttribution: `${col.title} • Canonical Shvetambara/Digambara Liturgy`,
          matchType: 'exact_reference',
          thematicKeyword:
            col.id === 'navkar'
              ? 'Peace'
              : col.id === 'bhaktamara'
              ? 'Gratitude'
              : col.id === 'tattvartha'
              ? 'Wisdom'
              : undefined,
          isOfflineAvailable: true,
          score: 95,
        });
      });
    });

    this.corpusIndex = index;
    this.indexed = true;
  }

  /**
   * Curated Seven Spiritual Themes Definitions
   */
  public getThematicDefinitions(): ThematicSubjectDefinition[] {
    const subjects: Array<{
      id: string;
      name: string;
      description: string;
      terms: Record<ReligionId, string>;
    }> = [
      {
        id: 'compassion',
        name: 'Compassion',
        description: 'Universal love, mercy, empathy, and harmlessness towards all sentient life.',
        terms: {
          islam: 'Rahmah (رحمة)',
          hinduism: 'Karuna (करुणा) & Daya',
          christianity: 'Mercy & Compassion',
          judaism: 'Rahamim (רחמים)',
          sikhism: 'Daya (ਦਇਆ)',
          buddhism: 'Karuna & Metta (Loving-kindness)',
          jainism: 'Ahimsa (अहिंसा) & Jiva-Daya',
        },
      },
      {
        id: 'forgiveness',
        name: 'Forgiveness',
        description: 'Pardon, letting go of rancor, forbearance, and reconciliation.',
        terms: {
          islam: 'Maghfirah & ‘Afw (عفو)',
          hinduism: 'Kshama (क्षमा)',
          christianity: 'Forgiveness & Grace',
          judaism: 'Selichah (סליחה) & Mechilah',
          sikhism: 'Khima (ਖਿਮਾ)',
          buddhism: 'Khama & Non-hatred',
          jainism: 'Kshamavani & Michhami Dukkadam',
        },
      },
      {
        id: 'peace',
        name: 'Peace',
        description: 'Inner tranquility, serenity, non-conflict, and universal harmony.',
        terms: {
          islam: 'Salam (سلام) & Dar as-Salam',
          hinduism: 'Shanti (शान्तिः)',
          christianity: 'Peace (Shalom of God)',
          judaism: 'Shalom (שלום)',
          sikhism: 'Shant & Sahaj (ਸਹਜ)',
          buddhism: 'Santi & Nibbana',
          jainism: 'Prasham & Samayika',
        },
      },
      {
        id: 'patience',
        name: 'Patience',
        description: 'Perseverance, spiritual endurance, equanimity, and steadfastness.',
        terms: {
          islam: 'Sabr (صبر)',
          hinduism: 'Dhriti (धृति) & Titiksha',
          christianity: 'Patience & Long-suffering',
          judaism: 'Savlanut (סבלנות)',
          sikhism: 'Dhiraj & Santokh (ਸੰਤੋਖ)',
          buddhism: 'Khanti (Patient endurance)',
          jainism: 'Titiksha & Sahansheelta',
        },
      },
      {
        id: 'gratitude',
        name: 'Gratitude',
        description: 'Thanksgiving, appreciation for divine favor, and humble joy.',
        terms: {
          islam: 'Shukr (شكر) & Al-Hamd',
          hinduism: 'Kritajnata (कृतज्ञता)',
          christianity: 'Thanksgiving & Praise',
          judaism: 'Hoda’ah (הודאה)',
          sikhism: 'Shukrana (ਸ਼ੁਕਰਾਨਾ)',
          buddhism: 'Katannuta (Gratitude)',
          jainism: 'Kritajnata & Bhavana',
        },
      },
      {
        id: 'charity',
        name: 'Charity',
        description: 'Almsgiving, sharing wealth with the vulnerable, and selfless service.',
        terms: {
          islam: 'Zakat (زكاة) & Sadaqah',
          hinduism: 'Dana (दान) & Seva',
          christianity: 'Charity & Alms',
          judaism: 'Tzedakah (צדקה)',
          sikhism: 'Vand Chhako (ਵੰਡ ਛਕੋ)',
          buddhism: 'Dana (Generosity)',
          jainism: 'Abhayadana & Supatradana',
        },
      },
      {
        id: 'wisdom',
        name: 'Wisdom',
        description: 'Spiritual insight, discernment, experiential truth, and divine enlightenment.',
        terms: {
          islam: 'Hikmah (حكمة) & ‘Ilm',
          hinduism: 'Jnana (ज्ञान) & Prajna',
          christianity: 'Wisdom & Understanding',
          judaism: 'Chochmah (חכמה)',
          sikhism: 'Gyan (ਗਿਆਨ)',
          buddhism: 'Panna (Wisdom) & Bodhi',
          jainism: 'Samyak Jnana (सम्यक ज्ञान)',
        },
      },
    ];

    return subjects.map((sub) => {
      // Find all indexed passages mapped to this theme
      const passages = this.corpusIndex.filter(
        (p) => p.thematicKeyword?.toLowerCase() === sub.name.toLowerCase()
      );
      return {
        id: sub.id,
        name: sub.name,
        description: sub.description,
        traditionTerms: sub.terms,
        passages: passages.map((p) => ({
          ...p,
          matchType: 'thematic_result' as SearchMatchType,
          thematicKeyword: sub.name,
        })),
      };
    });
  }

  /**
   * Main Search Query Method across All 7 Traditions
   */
  public async search(
    query: string,
    options: SearchFilterOptions = {}
  ): Promise<UniversalSearchResult[]> {
    const rawQuery = (query || '').trim();
    if (!rawQuery) return [];

    const normalizedQuery = normalizeForSearch(rawQuery);
    const results: UniversalSearchResult[] = [];
    const seenIds = new Set<string>();

    const addResult = (res: UniversalSearchResult) => {
      if (!seenIds.has(res.id)) {
        seenIds.add(res.id);
        results.push(res);
      }
    };

    // ------------------------------------------------------------------------
    // STAGE 1: Exact Reference Citation Matching
    // ------------------------------------------------------------------------
    const parsedRef = parseScriptureReference(rawQuery);
    if (parsedRef && parsedRef.isExactCitation) {
      this.corpusIndex.forEach((item) => {
        if (parsedRef.religion && item.religion !== parsedRef.religion) return;

        let matchesCitation = false;
        if (item.religion === 'islam') {
          if (
            parsedRef.chapterNumber &&
            Number(item.chapterNumber) === Number(parsedRef.chapterNumber)
          ) {
            if (
              !parsedRef.verseNumber ||
              Number(item.verseNumber) === Number(parsedRef.verseNumber)
            ) {
              matchesCitation = true;
            }
          }
        } else if (item.religion === 'hinduism') {
          if (
            parsedRef.chapterNumber &&
            Number(item.chapterNumber) === Number(parsedRef.chapterNumber)
          ) {
            if (
              !parsedRef.verseNumber ||
              Number(item.verseNumber) === Number(parsedRef.verseNumber)
            ) {
              matchesCitation = true;
            }
          }
        } else if (item.religion === 'christianity') {
          if (
            parsedRef.bookOrSurah &&
            String(item.readingId) === String(parsedRef.bookOrSurah)
          ) {
            if (
              parsedRef.chapterNumber &&
              Number(item.chapterNumber) === Number(parsedRef.chapterNumber)
            ) {
              if (
                !parsedRef.verseNumber ||
                Number(item.verseNumber) === Number(parsedRef.verseNumber)
              ) {
                matchesCitation = true;
              }
            }
          }
        } else if (item.religion === 'judaism') {
          if (
            parsedRef.chapterNumber &&
            Number(item.chapterNumber) === Number(parsedRef.chapterNumber)
          ) {
            if (
              !parsedRef.verseNumber ||
              Number(item.verseNumber) === Number(parsedRef.verseNumber)
            ) {
              matchesCitation = true;
            }
          }
        } else if (item.religion === 'sikhism') {
          if (
            parsedRef.chapterNumber &&
            Number(item.chapterNumber) === Number(parsedRef.chapterNumber)
          ) {
            matchesCitation = true;
          }
        } else if (item.religion === 'buddhism') {
          if (
            parsedRef.chapterNumber &&
            String(item.readingId) === String(parsedRef.chapterNumber)
          ) {
            matchesCitation = true;
          }
        } else if (item.religion === 'jainism') {
          if (
            parsedRef.collectionId &&
            item.collectionId.includes(parsedRef.collectionId)
          ) {
            matchesCitation = true;
          }
        }

        if (matchesCitation) {
          addResult({
            ...item,
            matchType: 'exact_reference',
            matchedSnippet: `${item.displayCoordinates} • ${item.displayTitle}`,
            score: 100,
          });
        }
      });
    }

    // ------------------------------------------------------------------------
    // STAGE 2: Exact Phrase Matching (Original Text & Translations)
    // ------------------------------------------------------------------------
    this.corpusIndex.forEach((item) => {
      if (seenIds.has(item.id)) return;

      const normOriginal = normalizeForSearch(item.originalText);
      const normTranslation = normalizeForSearch(item.translationText);
      const normTranslit = item.transliterationText ? normalizeForSearch(item.transliterationText) : '';
      const normCoords = normalizeForSearch(item.displayCoordinates);
      const normTitle = normalizeForSearch(item.displayTitle);

      const isOriginalMatch = normOriginal.includes(normalizedQuery);
      const isTranslationMatch = normTranslation.includes(normalizedQuery);
      const isTranslitMatch = normTranslit.includes(normalizedQuery);
      const isCoordsMatch = normCoords.includes(normalizedQuery) || normTitle.includes(normalizedQuery);

      if (isCoordsMatch) {
        addResult({
          ...item,
          matchType: 'exact_reference',
          matchedSnippet: item.displayCoordinates,
          score: 95,
        });
      } else if (isOriginalMatch || isTranslationMatch || isTranslitMatch) {
        addResult({
          ...item,
          matchType: 'exact_phrase',
          matchedSnippet: isTranslationMatch
            ? item.translationText
            : isOriginalMatch
            ? item.originalText
            : item.transliterationText || '',
          score: 90,
        });
      }
    });

    // ------------------------------------------------------------------------
    // STAGE 3: Full-Text Word Match
    // ------------------------------------------------------------------------
    const queryTokens = normalizedQuery.split(' ').filter((t) => t.length > 2);
    if (queryTokens.length > 0) {
      this.corpusIndex.forEach((item) => {
        if (seenIds.has(item.id)) return;

        const combinedText = normalizeForSearch(
          `${item.displayCoordinates} ${item.displayTitle} ${item.originalText} ${item.translationText} ${item.transliterationText || ''}`
        );

        // Check how many tokens match
        const matchingTokens = queryTokens.filter((token) => combinedText.includes(token));
        if (matchingTokens.length === queryTokens.length) {
          addResult({
            ...item,
            matchType: 'word_match',
            matchedSnippet: item.translationText,
            score: 75,
          });
        } else if (matchingTokens.length > 0 && queryTokens.length > 1) {
          addResult({
            ...item,
            matchType: 'word_match',
            matchedSnippet: item.translationText,
            score: 50 + (matchingTokens.length / queryTokens.length) * 20,
          });
        }
      });
    }

    // ------------------------------------------------------------------------
    // STAGE 4: Thematic Subject Discovery
    // ------------------------------------------------------------------------
    const thematicDefs = this.getThematicDefinitions();
    thematicDefs.forEach((theme) => {
      const themeMatches =
        normalizedQuery.includes(theme.id) ||
        theme.id.includes(normalizedQuery) ||
        Object.values(theme.traditionTerms).some((term) =>
          normalizeForSearch(term).includes(normalizedQuery)
        );

      if (themeMatches) {
        theme.passages.forEach((p) => {
          if (!seenIds.has(p.id)) {
            addResult({
              ...p,
              matchType: 'thematic_result',
              thematicKeyword: theme.name,
              matchedSnippet: `Thematic discovery on ${theme.name}: ${theme.description}`,
              score: 60,
            });
          }
        });
      }
    });

    // ------------------------------------------------------------------------
    // STAGE 5: Apply User Filters (Religion, MatchType, Offline)
    // ------------------------------------------------------------------------
    let filtered = results;

    if (options.religion && options.religion !== 'all') {
      filtered = filtered.filter((r) => r.religion === options.religion);
    }

    if (options.matchType && options.matchType !== 'all') {
      filtered = filtered.filter((r) => r.matchType === options.matchType);
    }

    if (options.offlineOnly) {
      filtered = filtered.filter((r) => r.isOfflineAvailable);
    }

    // Sort by score descending
    filtered.sort((a, b) => b.score - a.score);

    // Save query to recent searches
    this.saveRecentSearch(rawQuery, options.religion !== 'all' ? options.religion : undefined, filtered.length);

    if (options.limit) {
      const offset = options.offset || 0;
      return filtered.slice(offset, offset + options.limit);
    }

    return filtered;
  }

  /**
   * Recent Searches Management (LocalStorage)
   */
  public getRecentSearches(): SearchHistoryItem[] {
    if (typeof window === 'undefined' || !window.localStorage) return [];
    try {
      const raw = localStorage.getItem(RECENT_SEARCHES_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  public saveRecentSearch(query: string, religion?: ReligionId, resultCount?: number): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    const cleanQuery = (query || '').trim();
    if (!cleanQuery || cleanQuery.length < 2) return;

    try {
      const current = this.getRecentSearches();
      const filtered = current.filter((item) => item.query.toLowerCase() !== cleanQuery.toLowerCase());
      const updated: SearchHistoryItem[] = [
        {
          id: `hist_${Date.now()}`,
          query: cleanQuery,
          timestamp: new Date().toISOString(),
          religion,
          resultCount,
        },
        ...filtered,
      ].slice(0, MAX_RECENT_SEARCHES);

      localStorage.setItem(RECENT_SEARCHES_STORAGE_KEY, JSON.stringify(updated));
    } catch (_) {}
  }

  public clearRecentSearches(): void {
    if (typeof window === 'undefined' || !window.localStorage) return;
    try {
      localStorage.removeItem(RECENT_SEARCHES_STORAGE_KEY);
    } catch (_) {}
  }

  /**
   * Quick Suggested Searches across Traditions
   */
  public getQuickSuggestions(): Array<{ query: string; label: string; religion?: ReligionId }> {
    return [
      { query: 'John 3:16', label: 'John 3:16 (Love)', religion: 'christianity' },
      { query: 'Quran 2:255', label: 'Ayat al-Kursi (2:255)', religion: 'islam' },
      { query: 'Gita 2:47', label: 'Bhagavad Gita 2:47', religion: 'hinduism' },
      { query: 'Psalm 23', label: 'Psalm 23 (The Shepherd Psalm)', religion: 'christianity' },
      { query: 'Japji Sahib', label: 'Japji Sahib (Ang 1)', religion: 'sikhism' },
      { query: 'Compassion', label: 'Theme: Compassion (All Traditions)' },
      { query: 'Peace', label: 'Theme: Peace (Shalom / Salam / Shanti)' },
      { query: 'Wisdom', label: 'Theme: Wisdom & Knowledge' },
      { query: 'Namokar Mantra', label: 'Namokar Mantra', religion: 'jainism' },
      { query: 'Mangala Sutta', label: 'Mangala Sutta (Blessings)', religion: 'buddhism' },
    ];
  }
}

export const universalScriptureSearchService = UniversalScriptureSearchService.getInstance();
