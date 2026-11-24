// ==============================================================================
// Hinduism Scripture & Liturgical Collections Catalogue (Phase 1 Content Expansion)
// Full Scholarly Provenance, Traditions, Categories & Zero-AI Public Domain Sources
// Jafri Religious Books & Audio Platform
// ==============================================================================

export interface HinduismCollectionMeta {
  id: string;
  title: string;
  nativeTitle: string;
  category:
    | 'Itihasa / Epics'
    | 'Upanishads'
    | 'Shruti / Vedas'
    | 'Puranas'
    | 'Chalisas'
    | 'Aartis'
    | 'Bhajans'
    | 'Mantras'
    | 'Stotras'
    | 'Puja Vidhi'
    | 'Festival Prayers';
  tradition: string;
  originalLanguage: string;
  authorOrCompiler: string;
  translatorOrCommentator?: string;
  sourceEdition: string;
  sourceUrl: string;
  copyrightStatus: string;
  licensingStatus:
    | 'Public Domain'
    | 'Creative Commons (CC-BY / CC0)'
    | 'Open Religious Preservation'
    | 'Pending Rights Clearance';
  availableFormats: Array<
    'original_text' | 'translation' | 'human_recording' | 'tts_reading'
  >;
  contentStatus: 'verified_available' | 'pending_verification';
  summary: string;
  versesCount?: number;
}

export const HINDUISM_COLLECTIONS: HinduismCollectionMeta[] = [
  {
    id: 'gita',
    title: 'Shrimad Bhagavad Gita',
    nativeTitle: 'श्रीमद्भगवद्गीता (महाभारत भीष्मपर्व)',
    category: 'Itihasa / Epics',
    tradition: 'Universal Sanatana Dharma (Vedanta / Bhakti / Karma Yoga)',
    originalLanguage: 'Classical Sanskrit',
    authorOrCompiler: 'Maharshi Veda Vyasa (Krishna Dvaipayana)',
    translatorOrCommentator:
      'Swami Sivananda (1942), Swami Gambhirananda, Shri Purohit Swami (1935), Swami Ramsukhdas (Gita Press)',
    sourceEdition: 'Gita Press Gorakhpur / VedicScriptures Critical Corpus',
    sourceUrl: 'https://vedicscriptures.github.io',
    copyrightStatus: 'Public Domain (pre-1923 base texts) / Open Educational Archive',
    licensingStatus: 'Public Domain',
    availableFormats: ['original_text', 'translation', 'human_recording'],
    contentStatus: 'verified_available',
    summary:
      'The 700-verse philosophical crown of the Mahabharata (Bhishma Parva 23–40), where Lord Krishna instructs Arjuna on the battlefield of Kurukshetra regarding the nature of the self (Atman), selfless duty (Karma Yoga), divine knowledge (Jnana Yoga), and supreme devotion (Bhakti Yoga).',
    versesCount: 700,
  },
  {
    id: 'valmiki_ramayana',
    title: 'Valmiki Ramayana (All Seven Kandas & Aditya Hridaya)',
    nativeTitle: 'वाल्मीकि रामायण (सप्तकाण्ड संग्रह एवं आदित्यहृदय स्तोत्रम्)',
    category: 'Itihasa / Epics',
    tradition: 'Classical Sanskrit Itihasa (Adi Kavya)',
    originalLanguage: 'Classical Sanskrit',
    authorOrCompiler: 'Maharshi Valmiki (The Adi Kavi)',
    translatorOrCommentator:
      'Ralph T.H. Griffith (1870–1874) / Hari Prasad Shastri (1952)',
    sourceEdition:
      'Baroda Oriental Institute Critical Edition / Sacred Texts Archive',
    sourceUrl: 'https://www.sacred-texts.com/hin/rama/index.htm',
    copyrightStatus: 'Public Domain (English translations published 1870–1874)',
    licensingStatus: 'Public Domain',
    availableFormats: ['original_text', 'translation'],
    contentStatus: 'verified_available',
    summary:
      'The ancient Sanskrit epic narrating the life and virtues of Sri Rama across all seven canonical Kandas (Bala, Ayodhya, Aranya, Kishkindha, Sundara, Yuddha, Uttara). Features foundational verses from each Kanda and the complete authentic text of the Aditya Hridaya Stotram (Yuddha Kanda 105).',
    versesCount: 31,
  },
  {
    id: 'ramcharitmanas',
    title: 'Ramcharitmanas (Goswami Tulsidas)',
    nativeTitle: 'श्रीरामचरितमानस (गोस्वामी तुलसीदास)',
    category: 'Itihasa / Epics',
    tradition: 'Bhakti Movement / Ramanandi Vaishnavism',
    originalLanguage: 'Awadhi (Eastern Hindi dialect in Devanagari script)',
    authorOrCompiler: 'Goswami Tulsidas (1532–1623 CE)',
    translatorOrCommentator:
      'Frederic Salmon Growse (1883, Allahabad Government Press) / Gita Press',
    sourceEdition:
      'Gita Press Gorakhpur (Code 1 / Edition 2018) / British Library Digital Archive',
    sourceUrl: 'https://archive.org/details/ramayanofgrowse00tulsrich',
    copyrightStatus: 'Public Domain (Awadhi text 16th c.; Growse translation 1883)',
    licensingStatus: 'Public Domain',
    availableFormats: ['original_text', 'translation'],
    contentStatus: 'verified_available',
    summary:
      'The celebrated 16th-century vernacular retelling of Rama\'s divine lila in melodious Chaupai, Doha, Soratha, and Chhand meters across seven Kands. Renowned for its opening Mangalacharana invocations and Sri Ramachandra Kripalu Bhajuman stuti.',
    versesCount: 16,
  },
  {
    id: 'principal_upanishads',
    title: 'Principal Upanishads (10 Mukhya Upanishads & Mahavakyas)',
    nativeTitle: 'दश मुख्योपनिषदः (ईश, केन, कठ, प्रश्न, मुण्डक, माण्डूक्य, तैत्तिरीय, ऐतरेय, छान्दोग्य, बृहदारण्यक)',
    category: 'Upanishads',
    tradition: 'Shruti / Vedanta (Jnana Kanda)',
    originalLanguage: 'Vedic & Classical Sanskrit',
    authorOrCompiler:
      'Vedic Sages (Yajnavalkya, Pippalada, Angiras, Nachiketa, Uddalaka)',
    translatorOrCommentator:
      'F. Max Müller (Sacred Books of the East Vols. 1 & 15, Oxford Clarendon Press, 1879–1884)',
    sourceEdition: 'Sacred Books of the East / Advaita Ashrama Publications',
    sourceUrl: 'https://www.sacred-texts.com/hin/sbe01/index.htm',
    copyrightStatus: 'Public Domain (Oxford Clarendon Press 1879–1884)',
    licensingStatus: 'Public Domain',
    availableFormats: ['original_text', 'translation'],
    contentStatus: 'verified_available',
    summary:
      'The philosophical culmination (Vedanta) of Vedic revelation across all 10 Mukhya Upanishads and the Four Great Mahavakyas: Isha (Purnamadah), Kena, Katha (Atman & Chariot), Prashna (Prana & Rayi), Mundaka (Two Birds & Satyameva Jayate), Mandukya (Ayam Atma Brahma), Taittiriya (Satyam Vada), Aitareya (Prajnanam Brahma), Chandogya (Tat Tvam Asi), and Brihadaranyaka (Aham Brahmasmi & Neti Neti).',
    versesCount: 35,
  },
  {
    id: 'vedas',
    title: 'The Four Vedas (Rigveda, Samaveda, Yajurveda, Atharvaveda)',
    nativeTitle: 'चत्वारो वेदाः (ऋग्वेद, सामवेद, यजुर्वेद, अथर्ववेद संहिता एवं सूक्तानि)',
    category: 'Shruti / Vedas',
    tradition: 'Shruti (Apaurusheya Sanatana Revelation)',
    originalLanguage: 'Archaic Vedic Sanskrit (with Svara notation)',
    authorOrCompiler: 'Vedic Rishis (Veda Vyasa organized the Samhitas)',
    translatorOrCommentator:
      'Ralph T.H. Griffith (The Hymns of the Rigveda, 1896; The Texts of the White Yajurveda, 1899)',
    sourceEdition: 'E.J. Lazarus & Co., Benares (1896) / Harvard Oriental Series',
    sourceUrl: 'https://www.sacred-texts.com/hin/rigveda/index.htm',
    copyrightStatus: 'Public Domain (published prior to 1900)',
    licensingStatus: 'Public Domain',
    availableFormats: ['original_text', 'translation'],
    contentStatus: 'verified_available',
    summary:
      'The primordial scripture of Hinduism, containing hymns to cosmic powers (Devas) and profound cosmological philosophy across all Four Vedas: Rigveda (Agni Suktam 1.1, Gayatri 3.62.10, Nasadiya Suktam 10.129, Purusha Suktam 10.90, Ganapati Suktam 2.23.1), Samaveda (Agne Ayahi Vitaye 1.1.1), Shukla Yajurveda (Shiva Sankalpa & Shanti Suktam), and Atharvaveda (Bhumi Suktam 12.1 & Skambha Suktam 10.7).',
    versesCount: 25,
  },
  {
    id: 'puranas',
    title: 'The 18 Mahapuranas (Matrix, Bhagavata, Vishnu, Devi Mahatmya, Shiva Purana)',
    nativeTitle: 'अष्टादश महापुराणानि (त्रिविध गुण वर्गीकरण, गोपीगीतम्, विष्णु, देवी माहात्म्य एवं शिवपुराण)',
    category: 'Puranas',
    tradition: 'Smriti / Purana-Itihasa',
    originalLanguage: 'Classical Sanskrit',
    authorOrCompiler: 'Maharshi Veda Vyasa',
    translatorOrCommentator:
      'Horace Hayman Wilson (Vishnu Purana, 1840) / J.M. Sanyal (Bhagavata Purana, 1929)',
    sourceEdition: 'Asiatic Society of Bengal / Oriental Translation Fund',
    sourceUrl: 'https://www.sacred-texts.com/hin/vp/index.htm',
    copyrightStatus: 'Public Domain',
    licensingStatus: 'Public Domain',
    availableFormats: ['original_text', 'translation'],
    contentStatus: 'verified_available',
    summary:
      'The encyclopedic post-Vedic narratives expounding cosmology, theology, genealogy, and dharma across 18 Mahapuranas categorized by the three Gunas (Sattva, Rajas, Tamas). Features the canonical matrix and selected classical excerpts: Shrimad Bhagavata Purana Gopi Gita (10.31), Vishnu Purana Dhruva Stuti (1.12), Markandeya Purana Devi Mahatmya / Chandi Path (81), and Shiva Purana Rudra Samhita invocation (1.1).',
    versesCount: 25,
  },
  {
    id: 'hanuman_chalisas',
    title: 'Hanuman Chalisa & Sacred Chalisas',
    nativeTitle: 'श्री हनुमान चालीसा एवं प्रसिद्ध चालीसा संग्रह',
    category: 'Chalisas',
    tradition: 'Bhakti / Saguna Upasana (Devotional Tradition)',
    originalLanguage: 'Awadhi & Hindi (Devanagari script)',
    authorOrCompiler: 'Goswami Tulsidas (Hanuman Chalisa)',
    translatorOrCommentator: 'Gita Press Gorakhpur / Pandit Devendra Sharma',
    sourceEdition: 'Gita Press Gorakhpur (Stotra Ratnavali / Sundarkand Edition)',
    sourceUrl: 'https://gitapress.org',
    copyrightStatus: 'Public Domain (Tulsidas 16th century composition)',
    licensingStatus: 'Public Domain',
    availableFormats: ['original_text', 'translation'],
    contentStatus: 'verified_available',
    summary:
      'The complete 40 Chaupais, opening two Dohas, and concluding Doha of the Sri Hanuman Chalisa composed by Goswami Tulsidas. Also includes the Shiv Chalisa and Durga Chalisa with verse-by-verse English translations honoring devotion and courage.',
    versesCount: 43,
  },
  {
    id: 'aartis',
    title: 'Traditional Hindu Aartis (Om Jai Jagdish Hare & Deva Aartis)',
    nativeTitle: 'प्रमुख हिन्दू आरती संग्रह (ॐ जय जगदीश हरे, कुंजबिहारी, गणेश)',
    category: 'Aartis',
    tradition: 'Nitya Upasana / Bhakti Sangita',
    originalLanguage: 'Hindi, Braj Bhasha, and Sanskrit',
    authorOrCompiler:
      'Pt. Shraddha Ram Phillauri (1870, Om Jai Jagdish Hare) / Traditional Sages',
    translatorOrCommentator: 'Traditional temple liturgy translated into English',
    sourceEdition: 'Kalyana Mandir / Gita Press Aarti Sangrah',
    sourceUrl: 'https://gitapress.org',
    copyrightStatus: 'Public Domain (19th century compositions and traditional folk liturgy)',
    licensingStatus: 'Public Domain',
    availableFormats: ['original_text', 'translation'],
    contentStatus: 'verified_available',
    summary:
      'The sacred lamp-offering hymns chanted across Hindu households and temples. Features the complete Om Jai Jagdish Hare (universal Vishnu/Hari aarti), Aarti Kunj Bihari Ki (Sri Krishna), Jai Ganesh Deva (Ganesha aarti), and Om Jai Shiv Omkara (Mahadeva aarti).',
    versesCount: 28,
  },
  {
    id: 'bhajans',
    title: 'Devotional Bhajans & Mystical Hymns (Mirabai, Surdas, Kabir, Tulsidas)',
    nativeTitle: 'प्रसिद्ध भजन एवं पद संग्रह (मीराबाई, सूरदास, कबीर, तुलसीदास)',
    category: 'Bhajans',
    tradition: 'Bhakti Movement (Saguna & Nirguna Saints)',
    originalLanguage: 'Braj Bhasha, Rajasthani, Awadhi, and Gujarati',
    authorOrCompiler:
      'Mirabai, Surdas, Sant Kabir, Goswami Tulsidas, Narsinh Mehta',
    translatorOrCommentator: 'Rabindranath Tagore (Kabir, 1915) / Scholarly Trans.',
    sourceEdition: 'Kashi Nagari Pracharini Sabha / Macmillan & Co.',
    sourceUrl: 'https://archive.org/details/onehundredpoemso00kabi',
    copyrightStatus: 'Public Domain (Tagore 1915 translation; saint-poets 15th–16th c.)',
    licensingStatus: 'Public Domain',
    availableFormats: ['original_text', 'translation'],
    contentStatus: 'verified_available',
    summary:
      'Timeless poetic outpourings of love and divine longing from India\'s greatest saint-poets. Features Mirabai\'s "Payoji Maine Ram Ratan Dhan Payo", Narsinh Mehta\'s "Vaishnava Jana To", Tulsidas\'s "Sri Ramachandra Kripalu Bhajuman", and Kabir\'s mystical Nirguna verses.',
    versesCount: 20,
  },
  {
    id: 'mantras',
    title: 'Vedic & Tantric Moola Mantras (Gayatri, Mahamrityunjaya, Shanti Mantras)',
    nativeTitle: 'वैदिक एवं मूल मन्त्र संग्रह (गायत्री, महामृत्युंजय, शान्ति मन्त्राः)',
    category: 'Mantras',
    tradition: 'Vedic & Classical Mantrashastra',
    originalLanguage: 'Vedic & Classical Sanskrit',
    authorOrCompiler:
      'Brahmarshi Vishvamitra (Gayatri), Maharshi Markandeya / Vashistha (Mrityunjaya)',
    translatorOrCommentator: 'Traditional Vedic Sampradaya translation',
    sourceEdition: 'Rigveda Samhita / Taittiriya Aranyaka / Shukla Yajurveda',
    sourceUrl: 'https://www.sacred-texts.com/hin/rigveda/rv03062.htm',
    copyrightStatus: 'Public Domain (Ancient Vedic scriptures)',
    licensingStatus: 'Public Domain',
    availableFormats: ['original_text', 'translation'],
    contentStatus: 'verified_available',
    summary:
      'The foundational sound-vibrations of Hindu contemplation. Features the sacred Gayatri Mantra (Rigveda 3.62.10) with the seven Vyahritis, the life-preserving Maha Mrityunjaya Mantra (Rigveda 7.59.12), the universal Shanti Mantras (Om Sahana Vavatu, Asato Ma Sadgamaya, Purnamadah), and primordial Moola Mantras.',
    versesCount: 16,
  },
  {
    id: 'stotras',
    title: 'Sacred Sanskrit Stotras (Shiva Tandava, Mahishasuramardini, Aditya Hridaya)',
    nativeTitle: 'स्तोत्र रत्न संग्रह (शिवताण्डव, महिषासुरमर्दिनी, आदित्यहृदय, विष्णुसहस्रनाम)',
    category: 'Stotras',
    tradition: 'Classical Sanskrit Hymnology (Shaiva, Vaishnava, Shakta, Saurya)',
    originalLanguage: 'Classical Sanskrit',
    authorOrCompiler:
      'Ravana (Shiva Tandava), Adi Shankaracharya (Mahishasuramardini, Kanakadhara), Agastya Muni (Aditya Hridaya), Bhishma (Vishnu Sahasranama)',
    translatorOrCommentator: 'Advaita Ashrama / Sri Ramakrishna Math',
    sourceEdition: 'Stotra Ratnavali (Gita Press) / Ramakrishna Math Publications',
    sourceUrl: 'https://gitapress.org',
    copyrightStatus: 'Public Domain',
    licensingStatus: 'Public Domain',
    availableFormats: ['original_text', 'translation'],
    contentStatus: 'verified_available',
    summary:
      'Grand poetic hymns celebrating the majesty and compassion of the Divine. Includes Ravana\'s thunderous Shiva Tandava Stotram in Panchachamara meter, Adi Shankaracharya\'s rhythmic Mahishasuramardini Stotram (Aigiri Nandini), the solar Aditya Hridaya Stotram, and opening Dhyanam of the Vishnu Sahasranama.',
    versesCount: 35,
  },
  {
    id: 'puja_festivals',
    title: 'Puja Procedures & Festival Readings (Nitya Vidhi & Parva Stutis)',
    nativeTitle: 'नित्य पूजा पद्धति एवं प्रमुख पर्व स्तुति संग्रह (दीपावली, शिवरात्रि, रामनवमी)',
    category: 'Puja Vidhi',
    tradition: 'Smarta Tradition (Panchopachara & Shodashopachara Vidhi)',
    originalLanguage: 'Classical Sanskrit & Hindi',
    authorOrCompiler: 'Vedic & Puranic Ritual Tradition',
    translatorOrCommentator: 'Nitya Karma Puja Prakash / Traditional Sampradaya',
    sourceEdition: 'Gita Press Gorakhpur (Code 501 / Nitya Karma)',
    sourceUrl: 'https://gitapress.org',
    copyrightStatus: 'Public Domain',
    licensingStatus: 'Public Domain',
    availableFormats: ['original_text', 'translation'],
    contentStatus: 'verified_available',
    summary:
      'The practical liturgy and devotional rituals of Hindu daily and seasonal worship. Features the Deepa Jyoti Prarthana (lamp prayer), Bhojana Samarpanam (Brahmarpanam - Gita 4.24), Shodashopachara 16-step offering guide, Deepavali Lakshmi-Ganesha Stuti, Maha Shivaratri Bilvashtakam, and Ramanavami Bhay Praghat Kripala.',
    versesCount: 24,
  },
];
