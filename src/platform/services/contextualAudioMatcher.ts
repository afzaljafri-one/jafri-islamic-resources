/**
 * ============================================================================
 * ZODIACBEE / JAFRI SACRED AUDIO LIBRARY — CONTEXTUAL AUDIO MATCHER
 * Authoritative Contextual Linkage between Scripture Readings and
 * Canonical Master Catalogue Audio Recordings across All Seven World Traditions
 * ============================================================================
 */

import {
  SACRED_AUDIO_MASTER_CATALOGUE,
  isApprovedPublicYouTubeId,
  isApprovedLocalAudioId,
} from '../data/sacredAudioMasterCatalogue';
import type { SacredAudioRequirement, TraditionId } from '../types/sacredAudio';

export interface ReadingContext {
  religionId: TraditionId | string;
  categoryId?: string;
  collectionId?: string;
  bookId?: string | number;
  bookName?: string;
  chapterId?: string | number;
  sectionId?: string;
  title?: string;
}

export interface ContextualAudioResult {
  scopeLabel: string;
  primaryMatches: SacredAudioRequirement[];
  additionalRecordings: SacredAudioRequirement[];
  totalAvailableForTradition: number;
  hasDirectMatch: boolean;
  message?: string;
}

/**
 * Checks whether a requirement is currently approved and playable.
 * Reuses the authoritative catalogue eligibility and rights checks.
 */
export function isRequirementPlayable(req: SacredAudioRequirement): boolean {
  if (req.playbackProvider === 'LOCAL_HTML5') {
    return (
      req.availability === 'AVAILABLE_VERIFIED' &&
      req.isPlayable === true &&
      isApprovedLocalAudioId(req.id)
    );
  }
  if (req.playbackProvider === 'YOUTUBE_EMBED') {
    return isApprovedPublicYouTubeId(req.id);
  }
  return false;
}

/**
 * Normalizes strings for robust matching
 */
function normalize(str: string | number | undefined | null): string {
  if (str === undefined || str === null) return '';
  return String(str).toLowerCase().replace(/['"’‘\-–—\s]+/g, ' ').trim();
}

/**
 * Retrieves all approved playable recordings for a given religion/tradition.
 */
export function getApprovedRecordingsForTradition(
  traditionId: TraditionId | string
): SacredAudioRequirement[] {
  const normTrad = normalize(traditionId);
  return SACRED_AUDIO_MASTER_CATALOGUE.filter((req) => {
    return normalize(req.tradition) === normTrad && isRequirementPlayable(req);
  });
}

/**
 * Contextual Audio Matching Engine
 * Matches scripture reading context (Religion -> Scripture/Book/Collection -> Chapter/Section)
 * to authentic liturgical recordings in Sacred Audio Library.
 */
export function matchContextualAudio(context: ReadingContext): ContextualAudioResult {
  const traditionId = (context.religionId || '').toLowerCase() as TraditionId;
  const allTraditionRecordings = getApprovedRecordingsForTradition(traditionId);
  const totalAvailableForTradition = allTraditionRecordings.length;

  const categoryId = normalize(context.categoryId);
  const collectionId = normalize(context.collectionId);
  const bookName = normalize(context.bookName);
  const chapterNum =
    typeof context.chapterId === 'number'
      ? context.chapterId
      : parseInt(String(context.chapterId || ''), 10);
  const chapterStr = isNaN(chapterNum) ? String(context.chapterId || '') : String(chapterNum);
  const sectionId = normalize(context.sectionId);
  const title = normalize(context.title);

  let primaryMatches: SacredAudioRequirement[] = [];
  let scopeLabel = '';

  switch (traditionId) {
    // ------------------------------------------------------------------------
    // 1. ISLAM (Quran Surahs by Number and Name)
    // ------------------------------------------------------------------------
    case 'islam': {
      if (!isNaN(chapterNum) && chapterNum >= 1 && chapterNum <= 114) {
        scopeLabel = `Surah ${chapterNum}${context.bookName ? ` (${context.bookName})` : ''}`;
        const prefix = `surah ${chapterNum}:`;
        primaryMatches = allTraditionRecordings.filter((req) => {
          const t = normalize(req.requirementTitle);
          return t.startsWith(prefix) || t.includes(`surah ${chapterNum} `);
        });
      } else if (bookName || title) {
        const query = bookName || title;
        scopeLabel = `Surah ${context.bookName || context.title || ''}`;
        primaryMatches = allTraditionRecordings.filter((req) => {
          const t = normalize(req.requirementTitle);
          return t.includes(query);
        });
      }
      break;
    }

    // ------------------------------------------------------------------------
    // 2. HINDUISM (12 Collections across All 10 Categories)
    // ------------------------------------------------------------------------
    case 'hinduism': {
      const isGita =
        collectionId === 'gita' ||
        collectionId.includes('gita') ||
        bookName.includes('bhagavad gita') ||
        title.includes('bhagavad gita');

      const isPuranas =
        collectionId === 'puranas' ||
        categoryId.includes('purana') ||
        title.includes('mahapurana') ||
        title.includes('puranas');

      if (isPuranas) {
        scopeLabel = 'The 18 Mahapuranas';
        primaryMatches = allTraditionRecordings.filter(
          (req) => req.collectionId === 'puranas'
        );
      } else if (isGita && !isNaN(chapterNum) && chapterNum >= 1 && chapterNum <= 18) {
        scopeLabel = `Bhagavad Gita — Chapter ${chapterNum}`;
        const chPattern = `chapter ${chapterNum}:`;
        primaryMatches = allTraditionRecordings.filter((req) => {
          const t = normalize(req.requirementTitle);
          return (
            (t.includes('bhagavad gita') || req.collectionId === 'gita') &&
            t.includes(chPattern)
          );
        });
      } else if (isGita) {
        scopeLabel = 'Bhagavad Gita';
        primaryMatches = allTraditionRecordings.filter(
          (req) => req.collectionId === 'gita'
        );
      } else if (
        collectionId === 'bhajans' ||
        collectionId.includes('bhajan') ||
        categoryId.includes('bhajan') ||
        title.includes('bhajan') ||
        title.includes('mirabai') ||
        title.includes('surdas') ||
        title.includes('kabir')
      ) {
        scopeLabel = 'Devotional Bhajans';
        primaryMatches = allTraditionRecordings.filter(
          (req) =>
            req.collectionId === 'bhajans' ||
            normalize(req.requirementTitle).includes('bhajan') ||
            normalize(req.requirementTitle).includes('payoji') ||
            normalize(req.requirementTitle).includes('vaishnava jana') ||
            normalize(req.requirementTitle).includes('chadariya')
        );
      } else if (
        collectionId === 'hanuman_chalisas' ||
        collectionId.includes('chalisa') ||
        categoryId.includes('chalisa') ||
        title.includes('chalisa') ||
        title.includes('hanuman')
      ) {
        scopeLabel = 'Sri Hanuman Chalisa & Chalisas';
        primaryMatches = allTraditionRecordings.filter(
          (req) =>
            req.collectionId === 'hanuman_chalisas' ||
            normalize(req.requirementTitle).includes('chalisa') ||
            normalize(req.requirementTitle).includes('hanuman')
        );
      } else if (
        collectionId === 'mantras' ||
        collectionId.includes('mantra') ||
        categoryId.includes('mantra') ||
        title.includes('gayatri')
      ) {
        scopeLabel = 'Sacred Mantras';
        primaryMatches = allTraditionRecordings.filter(
          (req) => req.collectionId === 'mantras'
        );
      } else if (
        collectionId === 'vedas' ||
        collectionId.includes('veda') ||
        categoryId.includes('veda') ||
        categoryId.includes('shruti') ||
        title.includes('suktam') ||
        title.includes('purusha') ||
        title.includes('sri suktam')
      ) {
        scopeLabel = 'The Vedas & Vedic Suktams';
        primaryMatches = allTraditionRecordings.filter(
          (req) =>
            req.collectionId === 'vedas' ||
            normalize(req.requirementTitle).includes('suktam')
        );
      } else if (
        collectionId === 'aartis' ||
        collectionId.includes('aarti') ||
        categoryId.includes('aarti') ||
        title.includes('aarti')
      ) {
        scopeLabel = 'Traditional Aartis';
        primaryMatches = allTraditionRecordings.filter(
          (req) =>
            req.collectionId === 'aartis' ||
            normalize(req.requirementTitle).includes('aarti')
        );
      } else if (
        collectionId === 'stotras' ||
        collectionId.includes('stotra') ||
        categoryId.includes('stotra')
      ) {
        scopeLabel = 'Sacred Stotras & Chants';
        primaryMatches = allTraditionRecordings.filter(
          (req) => req.collectionId === 'stotras'
        );
      } else if (
        collectionId === 'principal_upanishads' ||
        collectionId.includes('upanishad') ||
        categoryId.includes('upanishad') ||
        title.includes('upanishad')
      ) {
        scopeLabel = 'Principal Upanishads';
        primaryMatches = allTraditionRecordings.filter(
          (req) =>
            req.collectionId === 'principal_upanishads' ||
            req.collectionId === 'upanishads' ||
            normalize(req.requirementTitle).includes('upanishad')
        );
      } else if (
        collectionId === 'valmiki_ramayana' ||
        collectionId.includes('valmiki') ||
        (collectionId.includes('ramayan') && !collectionId.includes('ramcharit')) ||
        title.includes('aditya hridaya')
      ) {
        scopeLabel = 'Valmiki Ramayana';
        primaryMatches = allTraditionRecordings.filter(
          (req) =>
            req.collectionId === 'valmiki_ramayana' ||
            req.id === 'REQ-HIN-020'
        );
      } else if (
        collectionId === 'ramcharitmanas' ||
        collectionId.includes('ramcharit') ||
        title.includes('ramcharitmanas') ||
        title.includes('kripalu')
      ) {
        scopeLabel = 'Ramcharitmanas';
        primaryMatches = allTraditionRecordings.filter(
          (req) =>
            req.collectionId === 'ramcharitmanas' ||
            req.id === 'REQ-HIN-027'
        );
      } else if (
        collectionId === 'puja_festivals' ||
        collectionId.includes('puja') ||
        categoryId.includes('puja') ||
        title.includes('puja') ||
        title.includes('deepa') ||
        title.includes('lakshmi')
      ) {
        scopeLabel = 'Puja Procedures & Festival Prayers';
        primaryMatches = allTraditionRecordings.filter(
          (req) =>
            req.collectionId === 'puja_festivals' ||
            req.id === 'REQ-HIN-084' ||
            req.id === 'REQ-HIN-089'
        );
      } else {
        scopeLabel = context.title || context.bookName || 'Sacred Scripture';
      }
      break;
    }

    // ------------------------------------------------------------------------
    // 3. CHRISTIANITY (Holy Bible Books & Chapters: Matthew, Psalms, 1 Cor, Luke, Creeds)
    // ------------------------------------------------------------------------
    case 'christianity': {
      const isMatthew = bookName.includes('matthew') || normalize(context.bookId) === '40';
      const isPsalms = bookName.includes('psalm') || normalize(context.bookId) === '19';
      const isCorinthians = bookName.includes('corinthians') || normalize(context.bookId) === '46';
      const isLuke = bookName.includes('luke') || normalize(context.bookId) === '42';

      if (isMatthew && chapterNum === 6) {
        scopeLabel = "Matthew 6 (The Lord's Prayer)";
        primaryMatches = allTraditionRecordings.filter((req) =>
          normalize(req.requirementTitle).includes("lord's prayer") ||
          normalize(req.requirementTitle).includes('pater noster')
        );
      } else if (isMatthew && chapterNum === 5) {
        scopeLabel = 'Matthew 5 (The Beatitudes)';
        primaryMatches = allTraditionRecordings.filter((req) =>
          normalize(req.requirementTitle).includes('beatitudes')
        );
      } else if (isPsalms && chapterNum === 23) {
        scopeLabel = 'Psalm 23 (The Lord is My Shepherd)';
        primaryMatches = allTraditionRecordings.filter((req) =>
          normalize(req.requirementTitle).includes('psalm 23')
        );
      } else if (isCorinthians && chapterNum === 13) {
        scopeLabel = '1 Corinthians 13 (Hymn of Love)';
        primaryMatches = allTraditionRecordings.filter((req) =>
          normalize(req.requirementTitle).includes('1 corinthians 13')
        );
      } else if (isLuke && chapterNum === 1) {
        scopeLabel = 'Luke 1 (The Magnificat)';
        primaryMatches = allTraditionRecordings.filter((req) =>
          normalize(req.requirementTitle).includes('magnificat')
        );
      } else if (title.includes('creed') || bookName.includes('creed')) {
        scopeLabel = 'Nicene Creed';
        primaryMatches = allTraditionRecordings.filter((req) =>
          normalize(req.requirementTitle).includes('creed')
        );
      } else {
        scopeLabel = context.bookName
          ? `${context.bookName} ${chapterStr}`.trim()
          : 'Holy Bible';
      }
      break;
    }

    // ------------------------------------------------------------------------
    // 4. BUDDHISM (Pali Canon Tipitaka: Vinaya/Patimokkha, Suttas, Prajnaparamita, Chants)
    // ------------------------------------------------------------------------
    case 'buddhism': {
      const isPatimokkha =
        collectionId.includes('vinaya') ||
        title.includes('patimokkha') ||
        sectionId.includes('patimokkha');
      const isHeartSutra =
        collectionId.includes('heart') ||
        title.includes('heart') ||
        title.includes('prajnaparamita');
      const isRefuge =
        collectionId.includes('refuge') ||
        title.includes('buddham') ||
        title.includes('saranam');
      const isMangala = title.includes('mangala');
      const isMetta = title.includes('metta') || title.includes('karaniya');
      const isRatana = title.includes('ratana');
      const isDhammapada = collectionId.includes('dhammapada') || title.includes('dhammapada');
      const isDhammacakka = title.includes('dhammacakka');

      if (isPatimokkha) {
        scopeLabel = 'Tipitaka: Patimokkha';
        primaryMatches = allTraditionRecordings.filter((req) =>
          req.id === 'REQ-BUD-001' || normalize(req.requirementTitle).includes('patimokkha')
        );
      } else if (isHeartSutra) {
        scopeLabel = 'Heart Sutra (Prajnaparamita)';
        primaryMatches = allTraditionRecordings.filter((req) =>
          req.id === 'REQ-BUD-010' || normalize(req.requirementTitle).includes('heart sutra')
        );
      } else if (isRefuge) {
        scopeLabel = 'Refuge Chants (Ti-Sarana)';
        primaryMatches = allTraditionRecordings.filter((req) =>
          req.id === 'REQ-BUD-020' ||
          normalize(req.requirementTitle).includes('buddham saranam') ||
          normalize(req.requirementTitle).includes('ti-sarana')
        );
      } else if (isMangala) {
        scopeLabel = 'Maha Mangala Sutta';
        primaryMatches = allTraditionRecordings.filter((req) =>
          normalize(req.requirementTitle).includes('mangala')
        );
      } else if (isMetta) {
        scopeLabel = 'Karaniya Metta Sutta';
        primaryMatches = allTraditionRecordings.filter((req) =>
          normalize(req.requirementTitle).includes('metta')
        );
      } else if (isRatana) {
        scopeLabel = 'Ratana Sutta';
        primaryMatches = allTraditionRecordings.filter((req) =>
          normalize(req.requirementTitle).includes('ratana')
        );
      } else if (isDhammacakka) {
        scopeLabel = 'Dhammacakkappavattana Sutta';
        primaryMatches = allTraditionRecordings.filter((req) =>
          normalize(req.requirementTitle).includes('dhammacakka')
        );
      } else if (isDhammapada) {
        scopeLabel = 'Dhammapada Verses';
        primaryMatches = allTraditionRecordings.filter((req) =>
          normalize(req.requirementTitle).includes('dhammapada')
        );
      } else {
        scopeLabel = context.title || 'Early Buddhist Texts';
      }
      break;
    }

    // ------------------------------------------------------------------------
    // 5. SIKHISM (Sri Guru Granth Sahib Ji — 1,430 Angs & Nitnem Prayers)
    // ------------------------------------------------------------------------
    case 'sikhism': {
      const ang = chapterNum;

      if (!isNaN(ang) && ang >= 1 && ang <= 1430) {
        scopeLabel = `Sri Guru Granth Sahib Ji — Ang ${ang}`;
        if (ang === 1) {
          primaryMatches = allTraditionRecordings.filter(
            (req) => req.id === 'REQ-SIK-001' || req.id === 'REQ-SIK-002'
          );
        } else if (ang <= 8) {
          primaryMatches = allTraditionRecordings.filter(
            (req) => req.id === 'REQ-SIK-002'
          );
        } else if (ang <= 10) {
          primaryMatches = allTraditionRecordings.filter(
            (req) => req.id === 'REQ-SIK-003'
          );
        } else if (ang <= 13) {
          primaryMatches = allTraditionRecordings.filter(
            (req) => req.id === 'REQ-SIK-004'
          );
        } else if (ang <= 346) {
          primaryMatches = allTraditionRecordings.filter(
            (req) => req.id === 'REQ-SIK-005'
          );
        } else if (ang <= 494) {
          primaryMatches = allTraditionRecordings.filter(
            (req) => req.id === 'REQ-SIK-006'
          );
        } else if (ang <= 720) {
          primaryMatches = allTraditionRecordings.filter(
            (req) => req.id === 'REQ-SIK-007'
          );
        } else if (ang <= 974) {
          primaryMatches = allTraditionRecordings.filter(
            (req) => req.id === 'REQ-SIK-008'
          );
        } else if (ang <= 1167) {
          primaryMatches = allTraditionRecordings.filter(
            (req) => req.id === 'REQ-SIK-009'
          );
        } else if (ang <= 1352) {
          primaryMatches = allTraditionRecordings.filter(
            (req) => req.id === 'REQ-SIK-010'
          );
        } else {
          primaryMatches = allTraditionRecordings.filter(
            (req) => req.id === 'REQ-SIK-011'
          );
        }
      } else if (title.includes('jaap') || sectionId.includes('jaap')) {
        scopeLabel = 'Jaap Sahib';
        primaryMatches = allTraditionRecordings.filter(
          (req) => req.id === 'REQ-SIK-013'
        );
      } else if (title.includes('savaiye') || sectionId.includes('savaiye')) {
        scopeLabel = 'Tav-Prasad Savaiye';
        primaryMatches = allTraditionRecordings.filter(
          (req) => req.id === 'REQ-SIK-014'
        );
      } else if (title.includes('chaupai') || sectionId.includes('chaupai')) {
        scopeLabel = 'Benti Chaupai Sahib';
        primaryMatches = allTraditionRecordings.filter(
          (req) => req.id === 'REQ-SIK-015'
        );
      } else if (title.includes('anand') || sectionId.includes('anand')) {
        scopeLabel = 'Anand Sahib';
        primaryMatches = allTraditionRecordings.filter(
          (req) => req.id === 'REQ-SIK-016'
        );
      } else if (title.includes('ardas') || sectionId.includes('ardas')) {
        scopeLabel = 'Ardas';
        primaryMatches = allTraditionRecordings.filter(
          (req) => req.id === 'REQ-SIK-017'
        );
      } else {
        scopeLabel = 'Sri Guru Granth Sahib Ji';
      }
      break;
    }

    // ------------------------------------------------------------------------
    // 6. JAINISM (Navkar Mantra, Bhaktamara Stotra, Samayika, Pratikraman, Hymns)
    // ------------------------------------------------------------------------
    case 'jainism': {
      const isNavkar =
        collectionId.includes('navkar') ||
        title.includes('navkar') ||
        title.includes('namokar');
      const isBhaktamar =
        collectionId.includes('bhaktamar') || title.includes('bhaktamar');
      const isSamayik =
        collectionId.includes('samayik') ||
        title.includes('logassa') ||
        title.includes('uvasaggaharam');
      const isPratikraman =
        collectionId.includes('pratikraman') || title.includes('khamemi');
      const isMeriBhavana =
        collectionId.includes('bhavana') || title.includes('meri bhavana');

      if (isNavkar) {
        scopeLabel = 'Ṇamōkāra Mahāmantra';
        primaryMatches = allTraditionRecordings.filter(
          (req) => req.collectionId === 'navkar'
        );
      } else if (isBhaktamar) {
        scopeLabel = 'Bhaktāmara Stōtra';
        primaryMatches = allTraditionRecordings.filter(
          (req) => req.collectionId === 'bhaktamar'
        );
      } else if (isSamayik) {
        scopeLabel = 'Samāyika & Sūtras';
        primaryMatches = allTraditionRecordings.filter(
          (req) => req.collectionId === 'samayik'
        );
      } else if (isPratikraman) {
        scopeLabel = 'Pratikramana (Universal Forgiveness)';
        primaryMatches = allTraditionRecordings.filter(
          (req) => req.collectionId === 'pratikraman'
        );
      } else if (isMeriBhavana) {
        scopeLabel = 'Meri Bhavana Hymns';
        primaryMatches = allTraditionRecordings.filter(
          (req) => req.collectionId === 'jain_hymns'
        );
      } else {
        scopeLabel = context.title || 'Classical Jain Agamas';
      }
      break;
    }

    // ------------------------------------------------------------------------
    // 7. JUDAISM / OTHERS (Tanakh: Genesis, Joshua, Shema Yisrael)
    // ------------------------------------------------------------------------
    case 'judaism': {
      const isGenesis = bookName.includes('genesis') || bookName.includes('bereshit');
      const isJoshua = bookName.includes('joshua') || bookName.includes('yehoshua');
      const isDeuteronomy = bookName.includes('deuteronomy') || bookName.includes('devarim');
      const isShema = title.includes('shema') || (isDeuteronomy && chapterNum === 6);

      if (isGenesis) {
        scopeLabel = 'Torah: Book of Genesis (Bereshit)';
        primaryMatches = allTraditionRecordings.filter(
          (req) => req.id === 'REQ-JUD-001'
        );
      } else if (isJoshua) {
        scopeLabel = "Nevi'im: Book of Joshua (Yehoshua)";
        primaryMatches = allTraditionRecordings.filter(
          (req) => req.id === 'REQ-JUD-006'
        );
      } else if (isShema) {
        scopeLabel = 'Shema Yisrael (Deuteronomy 6:4)';
        primaryMatches = allTraditionRecordings.filter(
          (req) => req.id === 'REQ-JUD-020'
        );
      } else {
        scopeLabel = context.bookName
          ? `Tanakh: ${context.bookName} ${chapterStr}`.trim()
          : 'The Tanakh';
      }
      break;
    }

    default:
      scopeLabel = 'Sacred Scripture';
      break;
  }

  // Deduplicate and filter primary matches to ensure validity
  const primaryIds = new Set(primaryMatches.map((r) => r.id));
  const additionalRecordings = allTraditionRecordings.filter(
    (r) => !primaryIds.has(r.id)
  );

  const hasDirectMatch = primaryMatches.length > 0;
  const message = hasDirectMatch
    ? undefined
    : 'No approved recording currently available for this reading.';

  return {
    scopeLabel: scopeLabel || 'Sacred Scripture',
    primaryMatches,
    additionalRecordings,
    totalAvailableForTradition,
    hasDirectMatch,
    message,
  };
}
