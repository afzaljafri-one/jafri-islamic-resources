// ==============================================================================
// Authoritative Content Coverage Registry
// Cross-Tradition Corpus Transparency for All 7 World Traditions
// Jafri Religious Resources — Phase 6.3.1
// ==============================================================================

import { ReligionId } from '../types/religion';
import { CollectionCoverageRecord } from '../types/coverage';

/**
 * Master Registry of all authentic searchable & readable collections across 7 traditions.
 * Explicitly records actual indexed units, authoritative denominators, availability status,
 * storage boundaries, and source provenance.
 */
export const AUTHORITATIVE_COVERAGE_REGISTRY: CollectionCoverageRecord[] = [
  // ===========================================================================
  // 1. ISLAM
  // ===========================================================================
  {
    id: 'cov_isl_quran',
    religion: 'islam',
    collectionId: 'quran',
    canonicalTitle: 'The Holy Qur’an (Al-Qur’an al-Kareem)',
    nativeTitle: 'القرآن الكريم',
    sourceEdition: 'Hafs an Asim (King Fahd Complex / Tanzil Project) • Sahih International & Allama Jawadi Translation',
    language: 'Arabic (ar) / English (en) / Urdu (ur)',
    script: 'Arabic (Hafs Uthmani)',
    indexedUnits: 124, // 114 Surah directory entries + 10 foundational Ayahs
    totalKnownUnits: 6236,
    unitType: 'Ayahs (114 Surahs)',
    availabilityStatus: 'PARTIAL',
    storageType: 'BUNDLED_OFFLINE',
    provenance: 'Universal Hafs Recitation; Tanzil Project & UmmahAPI; Public Religious Heritage',
    lastVerified: '2026-11-25',
    scopeNotes: 'All 114 Surahs indexed by chapter metadata; 10 foundational Ayahs (Fatiha, Kursi, Nur, etc.) bundled offline with full Arabic/English/Urdu text. Complete 6,236 Ayahs stream dynamically via UmmahAPI.',
  },
  {
    id: 'cov_isl_hadith',
    religion: 'islam',
    collectionId: 'hadith',
    canonicalTitle: 'Canonical Hadith & Prophetic Narrations',
    nativeTitle: 'الحديث الشريف',
    sourceEdition: 'Hadith al-Kisa, Hadith al-Thaqalayn, Ghadir Khumm, Sahih selections',
    language: 'Arabic (ar) / English (en)',
    script: 'Arabic',
    indexedUnits: 15,
    totalKnownUnits: 15,
    unitType: 'Narrations',
    availabilityStatus: 'FULL',
    storageType: 'BUNDLED_OFFLINE',
    provenance: 'Traditional Islamic Chains of Transmission; Open Scholarly Datasets',
    lastVerified: '2026-11-25',
    scopeNotes: 'Curated canonical selection of 15 pivotal foundational narrations bundled complete with original Arabic and English translation.',
  },
  {
    id: 'cov_isl_duas',
    religion: 'islam',
    collectionId: 'duas',
    canonicalTitle: 'Sacred Islamic Supplications (Liturgical Prayers)',
    nativeTitle: 'الأدعية المأثورة',
    sourceEdition: 'Dua Kumayl, Jawshan al-Kabir, Dua Iftitah, Sahifa Sajjadiyya selections',
    language: 'Arabic (ar) / English (en) / Urdu (ur)',
    script: 'Arabic',
    indexedUnits: 8,
    totalKnownUnits: 8,
    unitType: 'Complete Liturgies',
    availabilityStatus: 'FULL',
    storageType: 'BUNDLED_OFFLINE',
    provenance: 'Mafatih al-Jinan & Sahifa al-Sajjadiyya (Imam Zayn al-Abidin)',
    lastVerified: '2026-11-25',
    scopeNotes: 'All 8 major canonical supplications bundled offline with verse-level Arabic, English translation, transliteration, and Urdu translation.',
  },

  // ===========================================================================
  // 2. CHRISTIANITY
  // ===========================================================================
  {
    id: 'cov_chr_bible_kjv',
    religion: 'christianity',
    collectionId: 'bible-kjv',
    canonicalTitle: 'The Holy Bible (King James Version 1611)',
    nativeTitle: 'The Holy Bible',
    sourceEdition: 'King James Version (Authorized Version 1611 / Pure Cambridge Edition)',
    language: 'English (en)',
    script: 'Latin',
    indexedUnits: 188, // 66 Books metadata + 7 Complete Chapters (187 verses) + John 3:16
    totalKnownUnits: 31102,
    unitType: 'Verses (1,189 Chapters in 66 Books)',
    availabilityStatus: 'PARTIAL',
    storageType: 'BUNDLED_OFFLINE',
    provenance: 'Public Domain (Crown Copyright expired outside UK / Pure Cambridge Text)',
    lastVerified: '2026-11-25',
    scopeNotes: 'All 66 canonical Old and New Testament books indexed by catalog metadata; 7 landmark chapters (Genesis 1, Psalm 23, Psalm 91, Matthew 5, John 1, 1 Cor 13, Rev 21: 187 verses total) plus John 3:16 bundled offline. Remaining chapters loaded dynamically.',
  },

  // ===========================================================================
  // 3. HINDUISM
  // ===========================================================================
  {
    id: 'cov_hin_gita',
    religion: 'hinduism',
    collectionId: 'gita',
    canonicalTitle: 'Shrimad Bhagavad Gita',
    nativeTitle: 'श्रीमद्भगवद्गीता',
    sourceEdition: 'Swami Sivananda (Divine Life Society), Swami Gambhirananda (Advaita Ashrama), Shri Purohit Swami',
    language: 'Sanskrit (sa) / English (en) / Hindi (hi)',
    script: 'Devanagari & IAST Latin',
    indexedUnits: 72, // 18 chapters + Chapter 1 (47 shlokas) + 7 foundational shlokas
    totalKnownUnits: 700,
    unitType: 'Shlokas (18 Adhyayas)',
    availabilityStatus: 'PARTIAL',
    storageType: 'BUNDLED_OFFLINE',
    provenance: 'Mahabharata (Bhishma Parva, Adhyayas 23–40); Divine Life Society & Advaita Ashrama',
    lastVerified: '2026-11-25',
    scopeNotes: 'All 18 chapters indexed by philosophical summary; Chapter 1 (Arjuna Visada Yoga) bundled complete (47 shlokas) offline with dual English and Hindi translations. Core shlokas (2:47, etc.) bundled complete offline. Remaining chapters accessible via dynamic provider.',
  },
  {
    id: 'cov_hin_upanishads',
    religion: 'hinduism',
    collectionId: 'principal_upanishads',
    canonicalTitle: 'Principal Upanishads (10 Mukhya Upanishads)',
    nativeTitle: 'मुख्या उपनिषदः',
    sourceEdition: 'Isha, Kena, Katha, Prashna, Mundaka, Mandukya selections (Swami Nikhilananda / Traditional)',
    language: 'Sanskrit (sa) / English (en)',
    script: 'Devanagari',
    indexedUnits: 10,
    totalKnownUnits: 10,
    unitType: 'Core Contemplative Units',
    availabilityStatus: 'PARTIAL',
    storageType: 'BUNDLED_OFFLINE',
    provenance: 'Vedanta Shruti Literature; Advaita Ashrama & Ramakrishna Math',
    lastVerified: '2026-11-25',
    scopeNotes: 'Curated selection of foundational aphorisms and Mahavakyas from the 10 Principal Upanishads bundled offline.',
  },
  {
    id: 'cov_hin_vedas',
    religion: 'hinduism',
    collectionId: 'vedas',
    canonicalTitle: 'The Four Vedas (Rigveda, Samaveda, Yajurveda, Atharvaveda)',
    nativeTitle: 'चत्वारो वेदाः',
    sourceEdition: 'Nasadiya Sukta, Purusha Sukta, Gayatri Mantra, Shanti Mantras',
    language: 'Vedic Sanskrit (sa) / English (en)',
    script: 'Devanagari',
    indexedUnits: 8,
    totalKnownUnits: 4,
    unitType: 'Vedic Samhita Selections',
    availabilityStatus: 'PARTIAL',
    storageType: 'BUNDLED_OFFLINE',
    provenance: 'Shruti Literature; Traditional Shakhas (Shakalya, Madhyandina)',
    lastVerified: '2026-11-25',
    scopeNotes: 'Overview of all 4 Vedas plus 8 core landmark suktas and peace invocations bundled complete with Devanagari text and English translation.',
  },
  {
    id: 'cov_hin_stotras_mantras',
    religion: 'hinduism',
    collectionId: 'mantras',
    canonicalTitle: 'Vedic Mantras, Sanskrit Stotras & Sacred Chalisas',
    nativeTitle: 'मन्त्राणि स्तोत्राणि च',
    sourceEdition: 'Mahamrityunjaya, Gayatri, Shiva Tandava, Hanuman Chalisa, Aditya Hridaya',
    language: 'Sanskrit (sa) / Awadhi (hi) / English (en)',
    script: 'Devanagari',
    indexedUnits: 14,
    totalKnownUnits: 14,
    unitType: 'Complete Liturgies & Hymns',
    availabilityStatus: 'FULL',
    storageType: 'BUNDLED_OFFLINE',
    provenance: 'Traditional Sanskrit Liturgical Heritage; Goswami Tulsidas (Hanuman Chalisa)',
    lastVerified: '2026-11-25',
    scopeNotes: 'All 14 prominent devotional stotras, chalisas, and mantras bundled complete offline with verse-by-verse original text and translation.',
  },

  // ===========================================================================
  // 4. JUDAISM
  // ===========================================================================
  {
    id: 'cov_jud_tanakh',
    religion: 'judaism',
    collectionId: 'tanakh',
    canonicalTitle: 'The Tanakh (Torah, Nevi’im, Ketuvim)',
    nativeTitle: 'תנ״ך (תורה, נביאים, כתובים)',
    sourceEdition: 'Westminster Leningrad Codex (Hebrew) & Jewish Publication Society (JPS 1917) / Mechon Mamre',
    language: 'Hebrew (he) / English (en)',
    script: 'Hebrew Square Script',
    indexedUnits: 31, // 24 Books metadata + 7 complete landmark passages (49 verses total)
    totalKnownUnits: 24,
    unitType: 'Books of the Hebrew Bible',
    availabilityStatus: 'PARTIAL',
    storageType: 'BUNDLED_OFFLINE',
    provenance: 'Public Domain Masoretic Hebrew Text (Mechon Mamre) & JPS 1917 Translation',
    lastVerified: '2026-11-25',
    scopeNotes: 'All 24 books of the Hebrew Bible indexed by canonical catalog metadata; 7 landmark liturgical passages (Bereshit 1:1-5, Shemot 20:1-17, Tehillim 23:1-6, Tehillim 121:1-8, Devarim 6:4-9 Shema, Mishlei 3:1-6, Yeshayahu 40:28-31) bundled offline complete with untouched Hebrew and English translation.',
  },

  // ===========================================================================
  // 5. SIKHISM
  // ===========================================================================
  {
    id: 'cov_sik_sggs',
    religion: 'sikhism',
    collectionId: 'sggs',
    canonicalTitle: 'Sri Guru Granth Sahib Ji (Damdami Bir Standard)',
    nativeTitle: 'ਸ੍ਰੀ ਗੁਰੂ ਗ੍ਰੰਥ ਸਾਹਿਬ ਜੀ',
    sourceEdition: 'Shiromani Gurdwara Parbandhak Committee (SGPC) Standard Text • Sant Singh Khalsa Translation',
    language: 'Gurbani / Punjabi (pa) / English (en)',
    script: 'Gurmukhi',
    indexedUnits: 51, // Shlokas & Pauris across Angs 1 to 13
    totalKnownUnits: 1430,
    unitType: 'Angs',
    availabilityStatus: 'PARTIAL',
    storageType: 'BUNDLED_OFFLINE',
    provenance: 'SGPC Amritsar Official Standard; OpenGurbani & BaniDB Public Datasets',
    lastVerified: '2026-11-25',
    scopeNotes: 'All 1,430 Angs cataloged; Angs 1 to 13 (containing complete Japji Sahib, Sodar Rehras, and Kirtan Sohila) bundled complete offline with untouched Gurmukhi script and English translation. Remaining Angs accessible via BaniDB provider.',
  },

  // ===========================================================================
  // 6. BUDDHISM
  // ===========================================================================
  {
    id: 'cov_bud_tipitaka',
    religion: 'buddhism',
    collectionId: 'tipitaka',
    canonicalTitle: 'The Pali Tipitaka (Vinaya, Sutta, Abhidhamma) & Dhammapada',
    nativeTitle: 'पिटकत्तय / তিপিটক',
    sourceEdition: 'Pali Text Society (PTS) & Chaṭṭha Saṅgāyana Tipitaka (CST4) • Thanissaro Bhikkhu & Acharya Buddharakkhita',
    language: 'Pali (pi) / English (en)',
    script: 'Romanized Pali & Devanagari',
    indexedUnits: 35, // Discourse sections across Mangala Sutta, Metta Sutta, Dhammacakkappavattana, Dhammapada
    totalKnownUnits: 423,
    unitType: 'Discourses & Stanzas',
    availabilityStatus: 'PARTIAL',
    storageType: 'BUNDLED_OFFLINE',
    provenance: 'Access to Insight / SuttaCentral (Public Domain & Creative Commons)',
    lastVerified: '2026-11-25',
    scopeNotes: 'Overview of the Three Baskets; complete discourses for Maha Mangala Sutta (12 blessings) and Karaniya Metta Sutta, plus Dhammacakkappavattana Sutta and core Dhammapada stanzas bundled offline with Pali text and English translation.',
  },

  // ===========================================================================
  // 7. JAINISM
  // ===========================================================================
  {
    id: 'cov_jai_agamas',
    religion: 'jainism',
    collectionId: 'agamas_liturgy',
    canonicalTitle: 'The Jain Agamas, Canonical Liturgy & Tattvartha Sutra',
    nativeTitle: 'जैन आगम एवं पवित्र आराधना',
    sourceEdition: 'Agamodaya Samiti, Shri Jain Sahitya Sansthan, JAINA Education Committee',
    language: 'Prakrit / Ardhamagadhi (pra) / Sanskrit (sa) / English (en)',
    script: 'Devanagari',
    indexedUnits: 28, // Complete Namokar Mantra lines (9), Bhaktamara core stotras, Tattvartha core sutras
    totalKnownUnits: 45,
    unitType: 'Agamas & Liturgical Compositions',
    availabilityStatus: 'PARTIAL',
    storageType: 'BUNDLED_OFFLINE',
    provenance: 'Traditional Shvetambara & Digambara Liturgical Heritage; JAINA Public Education',
    lastVerified: '2026-11-25',
    scopeNotes: 'Overview of the 45 Canonical Agamas; complete sacred liturgies for Ṇamōkāra Mahā Mantra (5 Parameshti + 4 Chulika verses) and Bhaktamara Stotra, plus Samayik, Iryavahi, and Tattvartha Sutra core aphorisms bundled offline with untouched original text and translation.',
  },
];

/**
 * Singleton Content Coverage Service
 */
export class ContentCoverageRegistry {
  private static instance: ContentCoverageRegistry;
  private registry: CollectionCoverageRecord[] = AUTHORITATIVE_COVERAGE_REGISTRY;

  private constructor() {}

  public static getInstance(): ContentCoverageRegistry {
    if (!ContentCoverageRegistry.instance) {
      ContentCoverageRegistry.instance = new ContentCoverageRegistry();
    }
    return ContentCoverageRegistry.instance;
  }

  /**
   * Retrieves all coverage records across all 7 traditions
   */
  public getAllRecords(): CollectionCoverageRecord[] {
    return [...this.registry];
  }

  /**
   * Retrieves coverage records filtered by religion
   */
  public getRecordsByReligion(religion: ReligionId): CollectionCoverageRecord[] {
    return this.registry.filter((r) => r.religion === religion);
  }

  /**
   * Finds coverage record by collectionId
   */
  public getRecordByCollectionId(collectionId: string): CollectionCoverageRecord | undefined {
    return this.registry.find(
      (r) =>
        r.collectionId.toLowerCase() === collectionId.toLowerCase() ||
        collectionId.toLowerCase().includes(r.collectionId.toLowerCase())
    );
  }
}

export const contentCoverageRegistry = ContentCoverageRegistry.getInstance();
