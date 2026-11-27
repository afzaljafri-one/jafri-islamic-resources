// ==============================================================================
// Jafri Sacred Audio Library — Recording Title Presentation Registry
// Phase 6.5.1: Presentation-Only Display Title Standardization
//
// Keeps canonical `requirementTitle`, `id`, `playbackProvider`, `rightsClassification`,
// and source URLs completely unchanged while providing verified English or
// conventional romanized primary display titles alongside canonical secondary titles.
// ==============================================================================

import type { SacredAudioRequirement } from '../types/sacredAudio';

export interface RecordingTitlePresentation {
  /** Verified English title or established conventional romanized title shown first */
  displayTitle: string;
  /** True only when `displayTitle` is an English title/rendering; false for romanized forms */
  isEnglishTitle: boolean;
  /** Optional explicit language/script label; defaults to `req.language` */
  languageLabel?: string;
}

export interface ResolvedRecordingTitle {
  /** Primary heading displayed first */
  primaryTitle: string;
  /** Original canonical `requirementTitle` shown as secondary line when it differs */
  secondaryCanonicalTitle: string | null;
  /** Language / script label for provenance clarity */
  languageLabel: string;
  /** Whether a verified presentation entry exists for this requirement */
  hasOverride: boolean;
}

export const RECORDING_TITLE_PRESENTATION_REGISTRY: Record<string, RecordingTitlePresentation> = {
  // --------------------------------------------------------------------------
  // ISLAM — Quran Surahs & Adhan
  // --------------------------------------------------------------------------
  'REQ-ISL-001': { displayTitle: 'Surah Al-Fatihah (The Opening)', isEnglishTitle: true },
  'REQ-ISL-002': { displayTitle: 'Surah Al-Baqarah (The Cow)', isEnglishTitle: true },
  'REQ-ISL-003': { displayTitle: "Surah Ali 'Imran (The Family of Imran)", isEnglishTitle: true },
  'REQ-ISL-013': { displayTitle: "Surah Ar-Ra'd (The Thunder)", isEnglishTitle: true },
  'REQ-ISL-017': { displayTitle: 'Surah Al-Isra (The Night Journey)', isEnglishTitle: true },
  'REQ-ISL-018': { displayTitle: 'Surah Al-Kahf (The Cave)', isEnglishTitle: true },
  'REQ-ISL-021': { displayTitle: 'Surah Al-Anbiya (The Prophets)', isEnglishTitle: true },
  'REQ-ISL-031': { displayTitle: 'Surah Luqman', isEnglishTitle: false },
  'REQ-ISL-036': { displayTitle: 'Surah Ya-Sin', isEnglishTitle: false },
  'REQ-ISL-037': { displayTitle: 'Surah As-Saffat (Those Who Set the Ranks)', isEnglishTitle: true },
  'REQ-ISL-046': { displayTitle: 'Surah Al-Ahqaf (The Wind-Curved Sandhills)', isEnglishTitle: true },
  'REQ-ISL-052': { displayTitle: 'Surah At-Tur (The Mount)', isEnglishTitle: true },
  'REQ-ISL-055': { displayTitle: 'Surah Ar-Rahman (The Most Merciful)', isEnglishTitle: true },
  'REQ-ISL-056': { displayTitle: "Surah Al-Waqi'ah (The Inevitable)", isEnglishTitle: true },
  'REQ-ISL-057': { displayTitle: 'Surah Al-Hadid (The Iron)', isEnglishTitle: true },
  'REQ-ISL-058': { displayTitle: 'Surah Al-Mujadila (The Pleading Woman)', isEnglishTitle: true },
  'REQ-ISL-063': { displayTitle: 'Surah Al-Munafiqun (The Hypocrites)', isEnglishTitle: true },
  'REQ-ISL-067': { displayTitle: 'Surah Al-Mulk (The Sovereignty)', isEnglishTitle: true },
  'REQ-ISL-071': { displayTitle: 'Surah Nuh (Noah)', isEnglishTitle: true },
  'REQ-ISL-082': { displayTitle: 'Surah Al-Infitar (The Cleaving)', isEnglishTitle: true },
  'REQ-ISL-085': { displayTitle: 'Surah Al-Buruj (The Mansions of the Stars)', isEnglishTitle: true },
  'REQ-ISL-087': { displayTitle: "Surah Al-A'la (The Most High)", isEnglishTitle: true },
  'REQ-ISL-091': { displayTitle: 'Surah Ash-Shams (The Sun)', isEnglishTitle: true },
  'REQ-ISL-099': { displayTitle: 'Surah Az-Zalzalah (The Earthquake)', isEnglishTitle: true },
  'REQ-ISL-100': { displayTitle: "Surah Al-'Adiyat (The Courser)", isEnglishTitle: true },
  'REQ-ISL-101': { displayTitle: "Surah Al-Qari'ah (The Calamity)", isEnglishTitle: true },
  'REQ-ISL-107': { displayTitle: "Surah Al-Ma'un (Small Kindnesses)", isEnglishTitle: true },
  'REQ-ISL-109': { displayTitle: 'Surah Al-Kafirun (The Disbelievers)', isEnglishTitle: true },
  'REQ-ISL-112': { displayTitle: 'Surah Al-Ikhlas (The Sincerity)', isEnglishTitle: true },
  'REQ-ISL-113': { displayTitle: 'Surah Al-Falaq (The Daybreak)', isEnglishTitle: true },
  'REQ-ISL-114': { displayTitle: 'Surah An-Nas (Mankind)', isEnglishTitle: true },
  'REQ-ISL-365': { displayTitle: 'Adhan — Call to Prayer', isEnglishTitle: true },

  // --------------------------------------------------------------------------
  // HINDUISM — Bhagavad Gita, Vedas, Upanishads, Mantras, Stotras & Bhajans
  // --------------------------------------------------------------------------
  'REQ-HIN-001': { displayTitle: 'Bhagavad Gita — Chapter 1: Arjuna Vishada Yoga', isEnglishTitle: false },
  'REQ-HIN-002': { displayTitle: 'Bhagavad Gita — Chapter 2: Sankhya Yoga', isEnglishTitle: false },
  'REQ-HIN-003': { displayTitle: 'Bhagavad Gita — Chapter 3: Karma Yoga', isEnglishTitle: false },
  'REQ-HIN-004': { displayTitle: 'Bhagavad Gita — Chapter 4: Jnana Karma Sanyasa Yoga', isEnglishTitle: false },
  'REQ-HIN-005': { displayTitle: 'Bhagavad Gita — Chapter 5: Karma Sanyasa Yoga', isEnglishTitle: false },
  'REQ-HIN-006': { displayTitle: 'Bhagavad Gita — Chapter 6: Dhyana Yoga', isEnglishTitle: false },
  'REQ-HIN-007': { displayTitle: 'Bhagavad Gita — Chapter 7: Jnana Vijnana Yoga', isEnglishTitle: false },
  'REQ-HIN-008': { displayTitle: 'Bhagavad Gita — Chapter 8: Akshara Brahma Yoga', isEnglishTitle: false },
  'REQ-HIN-009': { displayTitle: 'Bhagavad Gita — Chapter 9: Raja Vidya Raja Guhya Yoga', isEnglishTitle: false },
  'REQ-HIN-010': { displayTitle: 'Bhagavad Gita — Chapter 10: Vibhuti Yoga', isEnglishTitle: false },
  'REQ-HIN-011': { displayTitle: 'Bhagavad Gita — Chapter 11: Vishwaroopa Darshana Yoga', isEnglishTitle: false },
  'REQ-HIN-012': { displayTitle: 'Bhagavad Gita — Chapter 12: Bhakti Yoga', isEnglishTitle: false },
  'REQ-HIN-013': { displayTitle: 'Bhagavad Gita — Chapter 13: Kshetra Kshetrajna Vibhaga Yoga', isEnglishTitle: false },
  'REQ-HIN-014': { displayTitle: 'Bhagavad Gita — Chapter 14: Gunatraya Vibhaga Yoga', isEnglishTitle: false },
  'REQ-HIN-015': { displayTitle: 'Bhagavad Gita — Chapter 15: Purushottama Yoga', isEnglishTitle: false },
  'REQ-HIN-016': { displayTitle: 'Bhagavad Gita — Chapter 16: Daivasura Sampad Vibhaga Yoga', isEnglishTitle: false },
  'REQ-HIN-017': { displayTitle: 'Bhagavad Gita — Chapter 17: Shraddhatraya Vibhaga Yoga', isEnglishTitle: false },
  'REQ-HIN-018': { displayTitle: 'Bhagavad Gita — Chapter 18: Moksha Sanyasa Yoga', isEnglishTitle: false },
  'REQ-HIN-020': { displayTitle: 'Valmiki Ramayana — Aditya Hridaya Stotram (Yuddha Kanda 105)', isEnglishTitle: false },
  'REQ-HIN-027': { displayTitle: 'Ramcharitmanas — Sri Ramachandra Kripalu Bhajuman', isEnglishTitle: false },
  'REQ-HIN-028': { displayTitle: 'Isha Upanishad — Peace Invocation (Purnamadah Purnamidam)', isEnglishTitle: true },
  'REQ-HIN-029': { displayTitle: 'Isha Upanishad — Mantra 1 (Isha Vasyam Idam Sarvam)', isEnglishTitle: false },
  'REQ-HIN-032': { displayTitle: 'Mandukya Upanishad — Verse 1 (Om Ityetad Aksharam)', isEnglishTitle: true },
  'REQ-HIN-036': { displayTitle: 'Rigveda 10.90 — Hymn of the Cosmic Being (Purusha Suktam)', isEnglishTitle: true },
  'REQ-HIN-037': { displayTitle: 'Rigveda Khilani — Hymn to Goddess Lakshmi (Sri Suktam)', isEnglishTitle: true },
  'REQ-HIN-038': { displayTitle: 'Rigveda 2.23.1 — Hymn to Ganesha (Ganapati Suktam)', isEnglishTitle: true },
  'REQ-HIN-042': { displayTitle: 'Hanuman Chalisa — Opening Doha 1', isEnglishTitle: false },
  'REQ-HIN-043': { displayTitle: 'Hanuman Chalisa — Opening Doha 2', isEnglishTitle: false },
  'REQ-HIN-044': { displayTitle: 'Hanuman Chalisa — Verse 1', isEnglishTitle: true },
  'REQ-HIN-045': { displayTitle: 'Hanuman Chalisa — Verse 2', isEnglishTitle: true },
  'REQ-HIN-046': { displayTitle: 'Hanuman Chalisa — Verse 20', isEnglishTitle: true },
  'REQ-HIN-047': { displayTitle: 'Hanuman Chalisa — Verse 36', isEnglishTitle: true },
  'REQ-HIN-048': { displayTitle: 'Hanuman Chalisa — Concluding Doha', isEnglishTitle: false },
  'REQ-HIN-049': { displayTitle: 'Hanuman Chalisa — Complete Recitation', isEnglishTitle: true },
  'REQ-HIN-050': { displayTitle: 'Om Jai Jagdish Hare — Stanza 1', isEnglishTitle: false },
  'REQ-HIN-051': { displayTitle: 'Om Jai Jagdish Hare — Stanza 2', isEnglishTitle: false },
  'REQ-HIN-052': { displayTitle: 'Aarti Kunj Bihari Ki (Sri Krishna Aarti)', isEnglishTitle: false },
  'REQ-HIN-053': { displayTitle: 'Jai Ganesh Deva (Ganesh Aarti)', isEnglishTitle: false },
  'REQ-HIN-055': { displayTitle: 'Shri Ramachandra Ji Ki Aarti', isEnglishTitle: false },
  'REQ-HIN-056': { displayTitle: 'Shri Hanuman Ji Ki Aarti', isEnglishTitle: false },
  'REQ-HIN-057': { displayTitle: 'Shri Shiv Ji Ki Aarti (Om Jai Shiva Omkara)', isEnglishTitle: false },
  'REQ-HIN-058': { displayTitle: 'Shri Lakshmi Ji Ki Aarti (Om Jai Lakshmi Mata)', isEnglishTitle: false },
  'REQ-HIN-059': { displayTitle: 'Shri Ambe Gauri Aarti', isEnglishTitle: false },
  'REQ-HIN-060': { displayTitle: 'Payoji Maine Ram Ratan Dhan Payo — Mirabai', isEnglishTitle: false },
  'REQ-HIN-061': { displayTitle: 'Vaishnava Jana To — Narsinh Mehta', isEnglishTitle: false },
  'REQ-HIN-062': { displayTitle: 'Chadariya Jhini Re Jhini — Sant Kabir', isEnglishTitle: false },
  'REQ-HIN-065': { displayTitle: 'Thumak Chalat Ram Chandra — Tulsidas', isEnglishTitle: false },
  'REQ-HIN-066': { displayTitle: 'Maiya Mori Main Nahin Makhan Khayo — Surdas', isEnglishTitle: false },
  'REQ-HIN-067': { displayTitle: 'Gayatri Mantra (Rigveda 3.62.10)', isEnglishTitle: false },
  'REQ-HIN-068': { displayTitle: 'Maha Mrityunjaya Mantra (Rigveda 7.59.12)', isEnglishTitle: false },
  'REQ-HIN-069': { displayTitle: 'Taittiriya Upanishad — Peace Invocation', isEnglishTitle: true },
  'REQ-HIN-070': { displayTitle: 'Brihadaranyaka Upanishad 1.3.28 — Asato Ma Sadgamaya', isEnglishTitle: false },
  'REQ-HIN-071': { displayTitle: 'Shiva Panchakshari Mantra (Om Namah Shivaya)', isEnglishTitle: false },
  'REQ-HIN-072': { displayTitle: 'Hare Krishna Maha Mantra (Kali Santarana Upanishad)', isEnglishTitle: false },
  'REQ-HIN-073': { displayTitle: 'Surya Gayatri Mantra', isEnglishTitle: false },
  'REQ-HIN-074': { displayTitle: 'Ganesh Moola Mantra', isEnglishTitle: false },
  'REQ-HIN-075': { displayTitle: 'Shiva Tandava Stotram — Stanza 1', isEnglishTitle: false },
  'REQ-HIN-076': { displayTitle: 'Shiva Tandava Stotram — Stanza 2', isEnglishTitle: false },
  'REQ-HIN-077': { displayTitle: 'Mahishasuramardini Stotram — Adi Shankaracharya', isEnglishTitle: false },
  'REQ-HIN-078': { displayTitle: 'Vishnu Sahasranama Stotram — Invocation Verse', isEnglishTitle: true },
  'REQ-HIN-079': { displayTitle: 'Sri Guru Stotram (Guru Gita)', isEnglishTitle: false },
  'REQ-HIN-080': { displayTitle: 'Rigveda 10.125 — Hymn to Vak (Devi Suktam)', isEnglishTitle: true },
  'REQ-HIN-081': { displayTitle: 'Kanakadhara Stotram — Adi Shankaracharya', isEnglishTitle: false },
  'REQ-HIN-082': { displayTitle: 'Sri Venkateshwara Suprabhatam', isEnglishTitle: false },
  'REQ-HIN-083': { displayTitle: 'Madhurashtakam — Vallabhacharya', isEnglishTitle: false },
  'REQ-HIN-084': { displayTitle: 'Daily Lamp-Lighting Prayer (Deepa Jyoti)', isEnglishTitle: true },
  'REQ-HIN-089': { displayTitle: 'Deepavali Lakshmi Puja Prayers', isEnglishTitle: false },

  // --------------------------------------------------------------------------
  // CHRISTIANITY — Prayers, Psalms, Canticles & Creeds
  // --------------------------------------------------------------------------
  'REQ-CHR-067': { displayTitle: "The Lord's Prayer (Matthew 6:9–13)", isEnglishTitle: true },
  'REQ-CHR-068': { displayTitle: 'The Beatitudes (Matthew 5:3–12)', isEnglishTitle: true },
  'REQ-CHR-069': { displayTitle: 'Psalm 23 — The Lord Is My Shepherd', isEnglishTitle: true },
  'REQ-CHR-070': { displayTitle: '1 Corinthians 13 — Hymn of Love', isEnglishTitle: true },
  'REQ-CHR-071': { displayTitle: 'The Magnificat — Song of Mary (Luke 1:46–55)', isEnglishTitle: true },
  'REQ-CHR-072': { displayTitle: 'The Nicene-Constantinopolitan Creed', isEnglishTitle: true },
  'REQ-CHR-073': { displayTitle: 'The Nicene-Constantinopolitan Creed (Latin / English, 381 AD)', isEnglishTitle: true },

  // --------------------------------------------------------------------------
  // BUDDHISM — Tipitaka, Sutras, Parittas & Mantras
  // --------------------------------------------------------------------------
  'REQ-BUD-001': { displayTitle: 'The Pali Tipitaka Structure', isEnglishTitle: true },
  'REQ-BUD-008': { displayTitle: 'Setting in Motion the Wheel of Dhamma (SN 56.11)', isEnglishTitle: true },
  'REQ-BUD-010': { displayTitle: 'Heart Sutra (Prajnaparamita Hrdaya)', isEnglishTitle: true },
  'REQ-BUD-011': { displayTitle: 'Diamond Sutra (Vajracchedika Prajnaparamita)', isEnglishTitle: true },
  'REQ-BUD-016': { displayTitle: 'Hymn of Loving-Kindness (Karaniya Metta Sutta)', isEnglishTitle: true },
  'REQ-BUD-019': { displayTitle: 'Discourse on Blessings (Maha Mangala Sutta)', isEnglishTitle: true },
  'REQ-BUD-020': { displayTitle: 'The Three Sacred Refuges (Ti-sarana)', isEnglishTitle: true },
  'REQ-BUD-021': { displayTitle: 'The Five Moral Precepts (Panca-sila)', isEnglishTitle: true },
  'REQ-BUD-022': { displayTitle: 'Homage to the Buddha (Buddhavandana)', isEnglishTitle: true },
  'REQ-BUD-023': { displayTitle: 'Homage to the Dhamma (Dhammavandana)', isEnglishTitle: true },
  'REQ-BUD-024': { displayTitle: 'Homage to the Sangha (Sanghavandana)', isEnglishTitle: true },
  'REQ-BUD-025': { displayTitle: 'The Jewel Discourse (Ratana Sutta)', isEnglishTitle: true },
  'REQ-BUD-032': { displayTitle: 'Vesak Triple Celebration Liturgy', isEnglishTitle: true },
  'REQ-BUD-034': { displayTitle: 'Avalokiteshvara Compassion Mantra (Om Mani Padme Hum)', isEnglishTitle: true },
  'REQ-BUD-035': { displayTitle: 'Green Tara Mantra (Om Tare Tuttare Ture Soha)', isEnglishTitle: false },
  'REQ-BUD-036': { displayTitle: 'Medicine Buddha Mantra', isEnglishTitle: true },

  // --------------------------------------------------------------------------
  // JAINISM — Namokara Mahamantra, Bhaktamara Stotra & Devotional Sutras
  // --------------------------------------------------------------------------
  'REQ-JAI-001': { displayTitle: 'Namokara Mahamantra — Line 1: Salutation to the Arihantas', isEnglishTitle: true },
  'REQ-JAI-002': { displayTitle: 'Namokara Mahamantra — Line 2: Salutation to the Siddhas', isEnglishTitle: true },
  'REQ-JAI-003': { displayTitle: 'Namokara Mahamantra — Line 3: Salutation to the Acharyas', isEnglishTitle: true },
  'REQ-JAI-004': { displayTitle: 'Namokara Mahamantra — Line 4: Salutation to the Upadhyayas', isEnglishTitle: true },
  'REQ-JAI-005': { displayTitle: 'Namokara Mahamantra — Line 5: Salutation to All Ascetics', isEnglishTitle: true },
  'REQ-JAI-006': { displayTitle: 'Namokara Mahamantra — Lines 6–7: Concluding Benediction', isEnglishTitle: true },
  'REQ-JAI-007': { displayTitle: 'Namokara Mahamantra — Complete 108 Repetitions', isEnglishTitle: true },
  'REQ-JAI-009': { displayTitle: 'Bhaktamara Stotra — Shloka 1', isEnglishTitle: false },
  'REQ-JAI-010': { displayTitle: 'Bhaktamara Stotra — Shloka 2', isEnglishTitle: false },
  'REQ-JAI-011': { displayTitle: 'Bhaktamara Stotra — Concluding Shloka 44/48', isEnglishTitle: false },
  'REQ-JAI-012': { displayTitle: 'Bhaktamara Stotra — Complete Recitation (Shvetambara, 44 Shlokas)', isEnglishTitle: false },
  'REQ-JAI-013': { displayTitle: 'Bhaktamara Stotra — Complete Recitation (Digambara, 48 Shlokas)', isEnglishTitle: false },
  'REQ-JAI-023': { displayTitle: 'Universal Forgiveness Prayer (Khamemi Savve Jive)', isEnglishTitle: true },
  'REQ-JAI-028': { displayTitle: 'Hymn to the 24 Tirthankaras (Logassa Sutra)', isEnglishTitle: true },
  'REQ-JAI-029': { displayTitle: 'Hymn to Lord Parshvanatha (Uvasaggaharam Stotra)', isEnglishTitle: true },
  'REQ-JAI-030': { displayTitle: 'Meri Bhavana — Stanza 1', isEnglishTitle: false },
  'REQ-JAI-031': { displayTitle: 'Meri Bhavana — Stanza 2', isEnglishTitle: false },
  'REQ-JAI-032': { displayTitle: 'Meri Bhavana — Stanza 3', isEnglishTitle: false },
  'REQ-JAI-033': { displayTitle: 'Meri Bhavana — Complete 12-Stanza Devotional Hymn', isEnglishTitle: false },

  // --------------------------------------------------------------------------
  // SIKHISM — Sri Guru Granth Sahib Ji & Nitnem Banis
  // --------------------------------------------------------------------------
  'REQ-SIK-001': { displayTitle: 'Mool Mantar (Guru Granth Sahib Ji — Ang 1)', isEnglishTitle: false },
  'REQ-SIK-002': { displayTitle: 'Japji Sahib Complete (Angs 1–8)', isEnglishTitle: false },
  'REQ-SIK-003': { displayTitle: 'Rehras Sahib Complete (Angs 8–10)', isEnglishTitle: false },
  'REQ-SIK-004': { displayTitle: 'Kirtan Sohila Complete (Angs 12–13)', isEnglishTitle: false },
  'REQ-SIK-005': { displayTitle: 'Guru Granth Sahib Ji — Angs 14–346 (Sukhmani Sahib & Early Raags)', isEnglishTitle: false },
  'REQ-SIK-006': { displayTitle: 'Guru Granth Sahib Ji — Angs 347–494 (Raag Aasa / Aasa Di Vaar)', isEnglishTitle: false },
  'REQ-SIK-007': { displayTitle: 'Guru Granth Sahib Ji — Angs 495–720 (Raags Gujri to Sorath)', isEnglishTitle: false },
  'REQ-SIK-008': { displayTitle: 'Guru Granth Sahib Ji — Angs 721–974 (Raags Dhanasri to Gaund)', isEnglishTitle: false },
  'REQ-SIK-009': { displayTitle: 'Guru Granth Sahib Ji — Angs 975–1167 (Anand Sahib & Raags)', isEnglishTitle: false },
  'REQ-SIK-010': { displayTitle: 'Guru Granth Sahib Ji — Angs 1168–1352 (Barah Maha & Raags)', isEnglishTitle: false },
  'REQ-SIK-011': { displayTitle: 'Guru Granth Sahib Ji — Angs 1353–1430 (Bhagat Bani & Ragamala)', isEnglishTitle: false },
  'REQ-SIK-012': { displayTitle: 'Guru Granth Sahib Ji — Complete 1,430 Angs (Akhand Paath)', isEnglishTitle: false },
  'REQ-SIK-013': { displayTitle: 'Jaap Sahib (Sri Dasam Granth)', isEnglishTitle: false },
  'REQ-SIK-014': { displayTitle: 'Tav-Prasad Savaiye', isEnglishTitle: false },
  'REQ-SIK-015': { displayTitle: 'Benti Chaupai Sahib', isEnglishTitle: false },
  'REQ-SIK-016': { displayTitle: 'Anand Sahib Complete (40 Pauris)', isEnglishTitle: false },
  'REQ-SIK-017': { displayTitle: 'Ardas — Formal Sikh Supplication', isEnglishTitle: true },

  // --------------------------------------------------------------------------
  // JUDAISM — Tanakh Cantillation & Shema Yisrael
  // --------------------------------------------------------------------------
  'REQ-JUD-001': { displayTitle: 'Torah: Book of Genesis (Bereshit)', isEnglishTitle: true },
  'REQ-JUD-006': { displayTitle: "Nevi'im: Book of Joshua (Yehoshua)", isEnglishTitle: true },
  'REQ-JUD-020': { displayTitle: 'Shema Yisrael — Hear, O Israel (Deuteronomy 6:4)', isEnglishTitle: true },
};

/**
 * Resolves consistent primary and secondary recording titles for UI presentation
 * without mutating the canonical `SacredAudioRequirement` record.
 */
export function getRecordingTitlePresentation(
  req: Pick<SacredAudioRequirement, 'id' | 'requirementTitle' | 'language'>
): ResolvedRecordingTitle {
  const entry = RECORDING_TITLE_PRESENTATION_REGISTRY[req.id];
  const languageLabel = entry?.languageLabel || req.language || 'Original';

  if (!entry) {
    return {
      primaryTitle: req.requirementTitle,
      secondaryCanonicalTitle: null,
      languageLabel,
      hasOverride: false,
    };
  }

  const primaryTitle = entry.displayTitle.trim() || req.requirementTitle;
  const secondaryCanonicalTitle =
    primaryTitle !== req.requirementTitle ? req.requirementTitle : null;

  return {
    primaryTitle,
    secondaryCanonicalTitle,
    languageLabel,
    hasOverride: true,
  };
}
