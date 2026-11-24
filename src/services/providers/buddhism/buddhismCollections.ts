// ==============================================================================
// Buddhism Canonical & Liturgical Collections Catalogue (Phase 1 Content Expansion)
// Clear Distinction of Theravada, Mahayana, and Vajrayana Traditions
// SuttaCentral Bilara CC0 Public Domain & Classical Translations (Max Müller, Rhys Davids)
// Jafri Religious Books & Audio Platform
// ==============================================================================

export interface BuddhismCollectionMeta {
  id: string;
  title: string;
  nativeTitle: string; // Pali / Sanskrit / Sino-Tibetan
  category:
    | 'Canonical Corpus'
    | 'Dhammapada'
    | 'Suttas & Sutras'
    | 'Paritta / Protective Chant'
    | 'Daily Chants & Refuges'
    | 'Bhavana / Meditation'
    | 'Contemplative Practice'
    | 'Festival Liturgy & Vows';
  tradition:
    | 'Theravada (Pali Canon)'
    | 'Mahayana (Sanskrit & East Asian)'
    | 'Vajrayana (Tibetan Tradition)'
    | 'Universal Buddhism (All Vehicles)';
  originalLanguage: string;
  authorOrCompiler: string;
  translatorOrCommentator?: string;
  sourceEdition: string;
  sourceUrl: string;
  copyrightStatus: string;
  licensingStatus:
    | 'Creative Commons Zero (CC0)'
    | 'Public Domain'
    | 'Open Religious Preservation'
    | 'Pending Rights Clearance';
  availableFormats: Array<
    'original_text' | 'translation' | 'human_recording' | 'tts_reading'
  >;
  contentStatus: 'verified_available' | 'pending_verification';
  summary: string;
  traditionNote?: string;
}

export const BUDDHISM_COLLECTIONS: BuddhismCollectionMeta[] = [
  {
    id: 'tipitaka_overview',
    title: 'The Pali Tipitaka / Tripitaka (The Three Baskets)',
    nativeTitle: 'तिपिटक (विनयपिटक, सुत्तपिटक, अभिधम्मपिटक)',
    category: 'Canonical Corpus',
    tradition: 'Universal Buddhism (All Vehicles)',
    originalLanguage: 'Pali & Buddhist Hybrid Sanskrit',
    authorOrCompiler:
      'The First Buddhist Council at Rajagaha (recited by Ananda, Upali, Mahakassapa, 5th c. BCE)',
    translatorOrCommentator:
      'Bhikkhu Sujato (SuttaCentral CC0) / T.W. Rhys Davids / I.B. Horner',
    sourceEdition:
      'SuttaCentral Bilara Corpus / Pali Text Society Critical Editions',
    sourceUrl: 'https://suttacentral.net',
    copyrightStatus: 'Creative Commons Zero (CC0 Public Domain Dedication)',
    licensingStatus: 'Creative Commons Zero (CC0)',
    availableFormats: ['original_text', 'translation'],
    contentStatus: 'verified_available',
    summary:
      'The complete three-part canonical repository of the Buddha\'s teachings: 1. Vinaya Pitaka (Monastic discipline), 2. Sutta Pitaka (The discourses in five Nikayas: Digha, Majjhima, Samyutta, Anguttara, Khuddaka), and 3. Abhidhamma Pitaka (The analytical psychology of ultimate realities: Citta, Cetasika, Rupa, Nibbana).',
    traditionNote:
      'Theravada preserves the complete canon in Pali. Mahayana and Vajrayana preserve parallel Agamas in Chinese and Tibetan (Kangyur/Tengyur) alongside the Mahayana Sutras.',
  },
  {
    id: 'dhammapada',
    title: 'The Dhammapada (The Path of Dhamma)',
    nativeTitle: 'धम्मपद (खुद्दकनिकाय — यमकवग्ग, अप्पमादवग्ग, चित्तवग्ग, सुखवग्ग)',
    category: 'Dhammapada',
    tradition: 'Universal Buddhism (All Vehicles)',
    originalLanguage: 'Pali',
    authorOrCompiler: 'The Buddha (Gautama Buddha / Shakyamuni)',
    translatorOrCommentator:
      'F. Max Müller (Sacred Books of the East Vol. 10, 1881) / Bhikkhu Sujato (CC0)',
    sourceEdition: 'Sacred Books of the East Vol. 10 / SuttaCentral dhp',
    sourceUrl: 'https://suttacentral.net/dhp',
    copyrightStatus: 'CC0 Public Domain / Public Domain (Max Müller 1881)',
    licensingStatus: 'Creative Commons Zero (CC0)',
    availableFormats: ['original_text', 'translation'],
    contentStatus: 'verified_available',
    summary:
      'The celebrated 423 verses of the Khuddaka Nikaya summarizing Buddhist ethics, mind training, and liberation. Features the Yamakavagga (The Pairs 1–20), Appamadavagga (Heedfulness 21–32), Cittavagga (The Mind 33–43), and Sukhavagga (True Happiness).',
    traditionNote:
      'Revered across all Buddhist schools (Pali Dhammapada in Theravada, Sanskrit Udanavarga in Sarvastivada and Tibetan, and Chinese Fa Ju Jing in Mahayana).',
  },
  {
    id: 'suttas_sutras',
    title: 'Core Suttas & Mahayana Sutras (Pali Nikayas, Heart & Diamond Sutras)',
    nativeTitle: 'मूल सुत्त एवं महायान सूत्र (धम्मचक्कप्पवत्तन, अनत्तलक्खण, सतिपट्ठान, प्रज्ञापारमिता)',
    category: 'Suttas & Sutras',
    tradition: 'Universal Buddhism (All Vehicles)',
    originalLanguage: 'Pali & Classical Sanskrit',
    authorOrCompiler:
      'Shakyamuni Buddha / Prajnaparamita Transmissions (Bodhisattva Avalokiteshvara & Shariputra)',
    translatorOrCommentator:
      'Bhikkhu Sujato (SuttaCentral Bilara CC0) / Edward Conze (1958) / Max Müller (1884)',
    sourceEdition: 'SuttaCentral Bilara Corpus / Sacred Books of the East',
    sourceUrl: 'https://suttacentral.net/sn56.11',
    copyrightStatus: 'CC0 / Public Domain',
    licensingStatus: 'Creative Commons Zero (CC0)',
    availableFormats: ['original_text', 'translation'],
    contentStatus: 'verified_available',
    summary:
      'The central doctrinal discourses of both vehicles: The Dhammacakkappavattana Sutta (SN 56.11 on the Four Noble Truths), Anattalakkhana Sutta (SN 22.59 on Non-Self), Maha-satipatthana Sutta (DN 22 / MN 10 on the Four Foundations of Mindfulness), Kalama Sutta (AN 3.65 on Free Inquiry), Prajnaparamita Hridaya (Heart Sutra on Emptiness), Vajracchedika (Diamond Sutra on Conditioned Phenomena), and Saddharmapundarika (Lotus Sutra Ch 25 on Avalokiteshvara).',
    traditionNote:
      'Pali Nikayas form the foundation of Theravada; the Heart, Diamond, and Lotus Sutras are foundational to Chan, Zen, Pure Land, and Vajrayana.',
  },
  {
    id: 'metta_sutta',
    title: 'Karaniya Metta Sutta (The Discourse on Loving-Kindness)',
    nativeTitle: 'करणीय मेत्त सुत्त (सुत्तनिपात १.८ / खुद्दकपाठ ९)',
    category: 'Paritta / Protective Chant',
    tradition: 'Theravada (Pali Canon)',
    originalLanguage: 'Pali',
    authorOrCompiler: 'The Buddha (imparted to forest-dwelling bhikkhus)',
    translatorOrCommentator:
      'Bhikkhu Sujato (SuttaCentral CC0) / Piyadassi Thera (1966)',
    sourceEdition: 'Khuddakapatha 9 / Sutta Nipata 1.8 (SuttaCentral kp9)',
    sourceUrl: 'https://suttacentral.net/kp9',
    copyrightStatus: 'Creative Commons Zero (CC0)',
    licensingStatus: 'Creative Commons Zero (CC0)',
    availableFormats: ['original_text', 'translation'],
    contentStatus: 'verified_available',
    summary:
      'The supreme discourse on unconditional loving-kindness (Metta/Maitri). Instructs that just as a mother would protect her only child with her life, so one should cultivate a boundless, unhindered heart towards all living beings in all directions.',
    traditionNote:
      'Recited daily in Theravada monasteries and lay homes as a protective paritta, dispelling fear and cultivating supreme goodwill.',
  },
  {
    id: 'mangala_sutta',
    title: 'Maha Mangala Sutta (The Discourse on Highest Blessings)',
    nativeTitle: 'महामङ्गल सुत्त (सुत्तनिपात २.४ / खुद्दकपाठ ५)',
    category: 'Paritta / Protective Chant',
    tradition: 'Theravada (Pali Canon)',
    originalLanguage: 'Pali',
    authorOrCompiler: 'The Buddha (spoken to a celestial deity at Jetavana)',
    translatorOrCommentator:
      'Bhikkhu Sujato (SuttaCentral CC0) / Narada Thera (1985)',
    sourceEdition: 'Khuddakapatha 5 / Sutta Nipata 2.4 (SuttaCentral kp5)',
    sourceUrl: 'https://suttacentral.net/kp5',
    copyrightStatus: 'Creative Commons Zero (CC0)',
    licensingStatus: 'Creative Commons Zero (CC0)',
    availableFormats: ['original_text', 'translation'],
    contentStatus: 'verified_available',
    summary:
      'The thirty-eight supreme blessings (Mangalas) of life, ranging from foundational ethical conduct (not associating with fools, honoring the worthy, caring for parents and family) to ultimate spiritual liberation (a mind untouched and unshaken by the vicissitudes of the world).',
    traditionNote:
      'Chanted at every auspicious Buddhist occasion, house-warming, and monastic ceremony across Sri Lanka, Myanmar, Thailand, Cambodia, and Laos.',
  },
  {
    id: 'chants_parittas',
    title: 'Buddhist Chants, Refuges & Parittas (Ti-sarana, Panca-sila, Ratana)',
    nativeTitle: 'बौद्ध वन्दना, पञ्चशील एवं परित्त संग्रह (ति-सरण, रतन सुत्त)',
    category: 'Daily Chants & Refuges',
    tradition: 'Universal Buddhism (All Vehicles)',
    originalLanguage: 'Pali',
    authorOrCompiler: 'Early Buddhist Sangha Heritage',
    translatorOrCommentator:
      'Pali Text Society / Bhikkhu Bodhi / Piyadassi Thera',
    sourceEdition: 'Book of Protection (Paritta) / SuttaCentral',
    sourceUrl: 'https://suttacentral.net/kp6',
    copyrightStatus: 'Public Domain / CC0',
    licensingStatus: 'Creative Commons Zero (CC0)',
    availableFormats: ['original_text', 'translation'],
    contentStatus: 'verified_available',
    summary:
      'The foundational liturgy of Buddhist practice. Features the Ti-sarana (Going for Refuge to the Buddha, Dhamma, and Sangha), the Panca-sila (Five Moral Precepts of non-harming, non-stealing, truthful speech, sexual propriety, and non-intoxication), Buddhavandana (Namo Tassa), and the protective Ratana Sutta.',
    traditionNote:
      'The Three Refuges and Five Precepts are universal to Theravada, Mahayana, and Vajrayana traditions alike.',
  },
  {
    id: 'meditation_instructions',
    title: 'Canonical Meditation Instructions (Anapanasati & Satipatthana)',
    nativeTitle: 'भावना एवं ध्यान निर्देश (आनापानसति सुत्त म.नि. ११८, सतिपट्ठान)',
    category: 'Bhavana / Meditation',
    tradition: 'Theravada (Pali Canon)',
    originalLanguage: 'Pali',
    authorOrCompiler: 'The Buddha (Majjhima Nikaya 118 & 10)',
    translatorOrCommentator:
      'Bhikkhu Sujato (SuttaCentral CC0) / Bhikkhu Nanamoli (1995)',
    sourceEdition: 'Majjhima Nikaya 118 (SuttaCentral mn118)',
    sourceUrl: 'https://suttacentral.net/mn118',
    copyrightStatus: 'Creative Commons Zero (CC0)',
    licensingStatus: 'Creative Commons Zero (CC0)',
    availableFormats: ['original_text', 'translation'],
    contentStatus: 'verified_available',
    summary:
      'The Buddha\'s definitive, step-by-step masterclass on mindfulness of breathing (Anapanasati). Details the sixteen stages across four tetrads: experiencing the breath, calming bodily fabrications, illuminating mental factors, and culminating in full insight into impermanence (Anicca) and liberation (Nibbana).',
    traditionNote:
      'Forms the foundational manual of contemporary Vipassana, Thai Forest Tradition, and modern Western mindfulness movements.',
  },
  {
    id: 'guided_meditation',
    title: 'Guided Contemplation Scripts (Metta Bhavana & Kayagatasati)',
    nativeTitle: 'निर्देशित ध्यान अभ्यास (मैत्री भावना एवं कायानुपस्सना अभ्यास)',
    category: 'Contemplative Practice',
    tradition: 'Universal Buddhism (All Vehicles)',
    originalLanguage: 'Pali & English',
    authorOrCompiler: 'Classical Buddhist Meditation Lineages (Visuddhimagga)',
    translatorOrCommentator:
      'Bhikkhu Nanamoli (The Path of Purification, 1956) / Traditional Monastic',
    sourceEdition: 'Visuddhimagga Chapter 9 (Brahmavihara-niddesa)',
    sourceUrl: 'https://accesstoinsight.org/lib/authors/nanamoli/pathofpurification.html',
    copyrightStatus: 'Public Domain / Open Religious Instruction',
    licensingStatus: 'Public Domain',
    availableFormats: ['original_text', 'translation'],
    contentStatus: 'verified_available',
    summary:
      'Structured contemplative scripts for practical meditation: The five-stage development of Loving-Kindness (radiating Metta to self, benefactor, friend, neutral person, difficult person, and all beings in the ten directions); and Kayagatasati (contemplating the impermanent, dynamic elements of the physical body).',
    traditionNote:
      'Practiced across Theravada monasteries, Chan/Zen temples, and Tibetan Lojong (mind-training) traditions.',
  },
  {
    id: 'prayers_festivals',
    title: 'Buddhist Festival Readings & Prayers (Vesak, Bodhisattva Vows, Chenrezig)',
    nativeTitle: 'बौद्ध पर्व पाठ एवं महायान प्रार्थना (वैशाख पूर्णिमा, बोधिसत्त्व प्रणिधान)',
    category: 'Festival Liturgy & Vows',
    tradition: 'Universal Buddhism (All Vehicles)',
    originalLanguage: 'Pali, Sanskrit, and Sino-Tibetan',
    authorOrCompiler: 'Classical Liturgical Tradition / Shantideva (Bodhicaryavatara)',
    translatorOrCommentator:
      'Marion L. Matics (1970) / Traditional Buddhist Council',
    sourceEdition: 'Bodhicaryavatara Chapter 3 / Vesak Liturgical Manual',
    sourceUrl: 'https://archive.org/details/enteringpathofen00shanuoft',
    copyrightStatus: 'Public Domain',
    licensingStatus: 'Public Domain',
    availableFormats: ['original_text', 'translation'],
    contentStatus: 'verified_available',
    summary:
      'Liturgical prayers and sacred readings for holy observances: Vesak (Buddha Purnima, celebrating the Triple Event of the Buddha’s Birth, Enlightenment under the Bodhi Tree, and Mahaparinibbana); Shantideva’s Mahayana Bodhisattva Vows dedicating life to the liberation of all beings; and the six-syllable Avalokiteshvara mantra Om Mani Padme Hum.',
    traditionNote:
      'Vesak is the universal pan-Buddhist holiday recognized by the United Nations. The Bodhisattva Vows are central to Mahayana; the Chenrezig/Mani mantra is central to Vajrayana.',
  },
];
