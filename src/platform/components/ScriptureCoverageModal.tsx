// ==============================================================================
// Scripture Coverage & Content Transparency Modal
// Jafri Religious Books & Audio Platform
// Transparent breakdown of canonical metadata, text corpus, curated selections,
// dynamic API dependencies, offline availability, and excluded collections.
// ==============================================================================

import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Layers,
  Wifi,
  Database,
  CheckCircle2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { ReligionId } from '../types/religion';
import { ALL_RELIGION_IDS, RELIGIONS_REGISTRY } from '../config/religionsRegistry';

export interface TraditionCoverageDetails {
  religionId: ReligionId;
  name: string;
  nativeName: string;
  canonicalMetadata: {
    status: 'COMPLETE' | 'PARTIAL';
    summary: string;
    details: string;
  };
  textCorpus: {
    status: 'COMPLETE' | 'CURATED_SELECTIONS' | 'API_DYNAMIC' | 'NONE';
    summary: string;
    details: string;
  };
  curatedLiturgicalSelections: {
    count: number;
    summary: string;
    items: string[];
  };
  networkDependentContent: {
    hasApiDependency: boolean;
    provider: string;
    endpoints: string[];
    details: string;
  };
  offlineAvailability: {
    status: 'FULL_OFFLINE' | 'PARTIAL_OFFLINE' | 'ZERO_OFFLINE';
    summary: string;
    details: string;
  };
  missingOrExcluded: {
    summary: string;
    items: string[];
  };
}

export const TRADITIONS_COVERAGE: Record<ReligionId, TraditionCoverageDetails> = {
  islam: {
    religionId: 'islam',
    name: 'Islam',
    nativeName: 'الإسلام',
    canonicalMetadata: {
      status: 'COMPLETE',
      summary: 'All 114 Surahs & 30 Juz',
      details: 'Comprehensive canonical metadata for all 114 Surahs: Arabic titles, transliterated English titles, ayah counts (6,236 total), Juz mapping, revelation location (Makkah/Madinah).',
    },
    textCorpus: {
      status: 'COMPLETE',
      summary: 'Complete Dual-Mushaf Facsimile Reproductions',
      details: 'Complete photographic reproductions of the Holy Quran: 15-line Madinah Mushaf (Pages 1–612) and 13-line Indo-Pak Mushaf (Pages 1–849) in high-resolution WebP format.',
    },
    curatedLiturgicalSelections: {
      count: 6,
      summary: '4 Vector PDFs & Liturgical Compilations',
      items: [
        'Surah 018 Al-Kahf (High-Resolution Vector PDF)',
        'Surah 036 Ya-Sin (High-Resolution Vector PDF)',
        'Surah 056 Al-Waqi\'ah (High-Resolution Vector PDF)',
        'Surah 067 Al-Mulk (High-Resolution Vector PDF)',
        'Asma-ul-Husna (99 Divine Names) & Daily Duas',
        'Six Kalimas with Transliteration and Translations',
      ],
    },
    networkDependentContent: {
      hasApiDependency: true,
      provider: 'UmmahAPI, AlQuranCloud, EveryAyah CDN',
      endpoints: ['https://ummahapi.com', 'https://api.alquran.cloud/v1', 'https://everyayah.com/data'],
      details: 'Dynamic verse-by-verse digital text mode and streaming recitations by Mishary Rashid Alafasy and Abdul Basit require internet access.',
    },
    offlineAvailability: {
      status: 'FULL_OFFLINE',
      summary: '100% Offline Mushaf Images, PDFs & Prayer Engine',
      details: 'All 1,461 Mushaf page plates, 4 vector PDFs, Adhan-JS offline prayer calculator, and Hijri calendar operate completely offline without internet.',
    },
    missingOrExcluded: {
      summary: 'Theological Governance Restrictions',
      items: [
        'Synthetic AI-generated recitations of the Holy Quran are strictly prohibited and quarantined.',
        'Translations without scholarly provenance are excluded.',
      ],
    },
  },

  hinduism: {
    religionId: 'hinduism',
    name: 'Hinduism',
    nativeName: 'सनातन धर्म',
    canonicalMetadata: {
      status: 'COMPLETE',
      summary: '18 Bhagavad Gita Adhyayas & 11 Canonical Collections',
      details: 'Complete 18 Adhyayas (701 Shlokas) metadata of the Bhagavad Gita with Sanskrit titles, IAST transliteration, and thematic summaries. 11 extended canonical collections metadata covering the Four Vedas, Ten Principal Upanishads with Four Mahavakyas, Valmiki Ramayana (all Seven Kandas), Eighteen Mahapuranas Matrix, Chalisas, Aartis, and Stotras.',
    },
    textCorpus: {
      status: 'CURATED_SELECTIONS',
      summary: 'Curated Vedic & Epic Corpus + Dynamic Gita Verses',
      details: 'Comprehensive canonical excerpts and foundational suktas across the Four Vedas, Seven Kandas Ramayana, Ten Principal Upanishads, and Eighteen Mahapuranas matrix (75+ offline curated units) plus dynamic multi-commentary retrieval for the Bhagavad Gita.',
    },
    curatedLiturgicalSelections: {
      count: 75,
      summary: '75+ Foundational Scriptural & Liturgical Units (100% Bundled Offline)',
      items: [
        'Four Vedas: Rigveda (Agni, Gayatri, Nasadiya), Samaveda Saman, Shukla Yajurveda (Shiva Sankalpa, Shanti), Atharvaveda (Bhumi, Skambha)',
        'Principal Upanishads (All 10 Mukhya Upanishads & 4 Mahavakyas: Isha, Kena, Katha, Prashna, Mundaka, Mandukya, Taittiriya, Aitareya, Chandogya, Brihadaranyaka)',
        'Valmiki Ramayana: Complete Seven Kandas (Bala, Ayodhya, Aranya, Kishkindha, Sundara, Yuddha Aditya Hridaya, Uttara)',
        'Eighteen Mahapuranas: Guna Matrix (Sattva, Rajas, Tamas) + Shrimad Bhagavata Gopi Gita, Vishnu Purana, Devi Mahatmya, Shiva Purana',
        'Vedic Chanting Audio Units: Purusha Suktam (Rigveda 10.90), Sri Suktam (Khilani), Ganapati Suktam (2.23.1)',
        'Classical Liturgy: Hanuman Chalisa complete, Aartis (Om Jai Jagdish Hare, Kunj Bihari Ki), and Stotras (Mahishasura Mardini, Shiva Tandava)',
      ],
    },
    networkDependentContent: {
      hasApiDependency: true,
      provider: 'Multi-Tier: Bundled Assets + IndexedDB Cache + VedicScriptures Fallback',
      endpoints: ['data/gita/chapter_{chapter}.json', 'https://vedicscriptures.github.io/slok/{chapter}/{verse}/'],
      details: 'Chapter 1 (all 47 Shlokas) is bundled in-bundle offline. Chapters 1–18 (all 701 Shlokas) are distributed via verified static JSON assets with automatic IndexedDB caching and VedicScriptures upstream fallback.',
    },
    offlineAvailability: {
      status: 'FULL_OFFLINE',
      summary: 'Chapter 1 Bundled Offline + Chapters 1–18 Static & Cached Locally',
      details: 'Full Chapter 1 (47 Shlokas) and all 75+ scriptural units are embedded offline in the app bundle. All 18 chapters (701 Shlokas) are served from verified static dataset assets and permanently stored in IndexedDB upon retrieval.',
    },
    missingOrExcluded: {
      summary: 'Excluded or Unavailable Material',
      items: [
        'Complete Sanskrit text of 18 Mahapuranas (400,000 verses), 4 complete Vedic Samhitas, and unabridged Valmiki Ramayana (24,000 verses).',
        'Audio recitations for Gita verses are quarantined pending commercial-use clearance.',
      ],
    },
  },

  christianity: {
    religionId: 'christianity',
    name: 'Christianity',
    nativeName: 'Christianity',
    canonicalMetadata: {
      status: 'COMPLETE',
      summary: '66 Canonical Books (Protestant Canon)',
      details: 'Complete Protestant Canon metadata: 39 Old Testament books (Genesis–Malachi) and 27 New Testament books (Matthew–Revelation) with chronological ordering and chapter counts.',
    },
    textCorpus: {
      status: 'API_DYNAMIC',
      summary: '4 Public Domain Translations via Dynamic API',
      details: 'King James Version (KJV 1611/1769), World English Bible (WEB / CC0), American Standard Version (ASV 1901), and Young\'s Literal Translation (YLT 1898).',
    },
    curatedLiturgicalSelections: {
      count: 0,
      summary: 'No Static Liturgical Units Bundled',
      items: [
        'All biblical text is accessed via the chapter reader.',
        'Pater Noster (The Lord\'s Prayer, Matthew 6:9–13) has Latin choral audio.',
      ],
    },
    networkDependentContent: {
      hasApiDependency: true,
      provider: 'Bolls Life API (bolls.life)',
      endpoints: ['https://bolls.life/get-books/{translation}/', 'https://bolls.life/get-text/{translation}/{book}/{chapter}/'],
      details: 'All 31,102 verses across all 66 books are loaded dynamically on demand. If offline or if the API endpoint is unreachable, chapter text cannot be displayed.',
    },
    offlineAvailability: {
      status: 'ZERO_OFFLINE',
      summary: 'Zero Offline Verses (API Dependent)',
      details: 'The Christian Bible reader has no bundled offline verse cache. An informative offline state with retry options is displayed when network retrieval fails.',
    },
    missingOrExcluded: {
      summary: 'Excluded or Unavailable Material',
      items: [
        'Deuterocanonical books / Apocrypha (Tobit, Judith, 1 & 2 Maccabees, Sirach, Wisdom, Baruch) accepted in Roman Catholic and Eastern Orthodox canons.',
        'Offline local verse cache.',
        'Spoken audio Bible playback (Bible Brain DBP v4 integration pending free institutional API registration).',
      ],
    },
  },

  judaism: {
    religionId: 'judaism',
    name: 'Judaism',
    nativeName: 'יהדות',
    canonicalMetadata: {
      status: 'COMPLETE',
      summary: 'All 24 Canonical Tanakh Books (39 Scrolls & 929 Chapters)',
      details: 'Complete 24-book Jewish Tanakh across all three divisions: Torah (5 books, 187 chapters), Nevi\'im (8 canonical books / 21 scrolls, 373 chapters), and Ketuvim (11 canonical books / 13 scrolls, 369 chapters). Totaling 24 canonical books, 39 physical book divisions, and 929 chapters.',
    },
    textCorpus: {
      status: 'API_DYNAMIC',
      summary: 'Bilingual Hebrew & English via Sefaria API v3 with IndexedDB Persistence',
      details: 'All 39 books and 929 chapters are retrieved dynamically from Sefaria API v3, presenting vocalized Hebrew Masoretic Text with Niqqud diacritics side-by-side with JPS 1917 English translation. Retrieved chapters are persistently cached in IndexedDB for offline reading.',
    },
    curatedLiturgicalSelections: {
      count: 1,
      summary: 'Shema Yisrael Liturgical Reading',
      items: [
        'Shema Yisrael (Deuteronomy 6:4) liturgical reading text card',
        'Genesis 1:1–2 offline foundational fallback verses',
      ],
    },
    networkDependentContent: {
      hasApiDependency: true,
      provider: 'Sefaria API v3 (sefaria.org)',
      endpoints: ['https://www.sefaria.org/api/v3/texts/{book}.{chapter}'],
      details: 'All 39 books and 929 chapters stream dynamically from Sefaria API v3 with automatic local IndexedDB caching upon access.',
    },
    offlineAvailability: {
      status: 'PARTIAL_OFFLINE',
      summary: 'Genesis 1:1–2 Bundled Offline + IndexedDB Caching for All 39 Books',
      details: 'Genesis 1:1–2 is bundled directly in the app bundle as offline baseline. All chapters accessed online are automatically persisted to IndexedDB for continuous offline reading.',
    },
    missingOrExcluded: {
      summary: 'Excluded or Quarantined Material',
      items: [
        'Mechon Mamre spoken Hebrew audio recordings (Cantor Shmuel Ofen) are quarantined pending formal institutional streaming permissions.',
        'Mishnah, Talmud (Bavli & Yerushalmi), and Midrash rabbinic literature are excluded from the Tanakh scripture reader.',
      ],
    },
  },

  sikhism: {
    religionId: 'sikhism',
    name: 'Sikhism',
    nativeName: 'ਸਿੱਖੀ',
    canonicalMetadata: {
      status: 'COMPLETE',
      summary: '1,430 Ang Navigation Range (SGGS)',
      details: 'Full 1,430 Ang canonical navigation framework of Sri Guru Granth Sahib Ji with strict input boundary clamping (1 to 1430) and Raag categorization.',
    },
    textCorpus: {
      status: 'API_DYNAMIC',
      summary: 'Gurmukhi Unicode, Larivaar & English via BaniDB',
      details: 'Dynamically fetches authentic Gurmukhi Unicode, Larivaar continuous script representation, Roman transliteration, and Sant Singh Khalsa / Manmohan Singh English translations.',
    },
    curatedLiturgicalSelections: {
      count: 1,
      summary: 'Ang 1 Jap Ji Sahib / Mool Mantar (Offline)',
      items: [
        'Ang 1 Mool Mantar & Jap Ji Sahib (Gurmukhi, Larivaar, IAST, English)',
        'Larivaar continuous script presentation toggle',
      ],
    },
    networkDependentContent: {
      hasApiDependency: true,
      provider: 'BaniDB API v2 with GurbaniNow API v2 Fallback',
      endpoints: ['https://api.banidb.com/v2/angs/{ang}', 'https://api.gurbaninow.com/v2/ang/{ang}'],
      details: 'Angs 2 through 1,430 are streamed dynamically from BaniDB. Requires network connectivity to read beyond Ang 1.',
    },
    offlineAvailability: {
      status: 'PARTIAL_OFFLINE',
      summary: 'Ang 1 Bundled Locally Offline',
      details: 'Ang 1 is 100% stored offline. If offline, navigating to Angs 2–1,430 displays an informative outage banner with a direct link to return to Ang 1.',
    },
    missingOrExcluded: {
      summary: 'Excluded or Unavailable Material',
      items: [
        'Offline text for Angs 2 through 1,430 (requires active network).',
        'Dasam Granth and Bhai Gurdas Vaaran collections are not included in the primary SGGS reader.',
        'Live Damdami Taksal audio streams are unavailable without server-side CORS proxying.',
      ],
    },
  },

  buddhism: {
    religionId: 'buddhism',
    name: 'Buddhism',
    nativeName: 'धर्म / बुद्ध सासन',
    canonicalMetadata: {
      status: 'COMPLETE',
      summary: '9 Canonical Collections & Pali Tipitaka Framework',
      details: '9 collections covering the complete Three Baskets of the Pali Tipitaka (Vinaya Pitaka, Sutta Pitaka across all 5 Nikayas, and Abhidhamma Pitaka 7 Treatises), Dhammapada, Core Suttas & Mahayana Sutras (First Sermon, Anattalakkhana, Maha-satipatthana, Kalama, Heart, Diamond, and Lotus Sutras), Parittas, and Meditation Manuals across Theravada, Mahayana, and Vajrayana perspectives.',
    },
    textCorpus: {
      status: 'CURATED_SELECTIONS',
      summary: '36+ Curated Sutta Units with Pali Diacritics & SuttaCentral Bilara CC0',
      details: 'Curated liturgical, doctrinal, and meditative selections with authentic Pali diacritical marks, Devanagari, and verified Bhikkhu Sujato SuttaCentral Bilara CC0 and F. Max Müller public domain English translations.',
    },
    curatedLiturgicalSelections: {
      count: 36,
      summary: '36+ Foundational Canonical & Liturgical Units (100% Offline)',
      items: [
        'Tipitaka Three Baskets Framework: Vinaya Pitaka (Patimokkha), Sutta Pitaka (5 Nikayas: Digha, Majjhima, Samyutta, Anguttara, Khuddaka), and Abhidhamma Pitaka (7 Treatises)',
        'Core Discourses: Dhammacakkappavattana Sutta (SN 56.11), Anattalakkhana Sutta (SN 22.59), Maha-satipatthana Sutta (DN 22 / MN 10), Kalama Sutta (AN 3.65)',
        'Mahayana Sutras: Prajnaparamita Hrdaya (Heart Sutra), Vajracchedika (Diamond Sutra Ch 32 Gatha), Saddharmapundarika (Lotus Sutra Ch 25 Avalokiteshvara)',
        'Dhammapada: Yamakavagga (vv 1–2, 5), Appamadavagga (v 21), Cittavagga (v 33), Sukhavagga (v 197), Maggavagga (v 277 Sabbe Sankhara Anicca)',
        'Parittas & Daily Chants: Ti-sarana (Three Refuges), Panca-sila (Five Precepts), Buddhavandana, Karaniya Metta Sutta, Maha Mangala Sutta, Ratana Sutta',
        'Bhavana Meditation: Anapanasati Sutta (MN 118 First & Fourth Tetrads), Five-Stage Metta Bhavana, Four Immeasurables (Brahmaviharas)',
      ],
    },
    networkDependentContent: {
      hasApiDependency: true,
      provider: 'SuttaCentral Bilara API (suttacentral.net)',
      endpoints: ['https://suttacentral.net/api/bilarasuttas/{sutta_uid}/sujato'],
      details: 'Dynamic lookup for additional Suttas by UID via SuttaCentral Bilara API with automatic local caching.',
    },
    offlineAvailability: {
      status: 'FULL_OFFLINE',
      summary: 'All 36+ Curated Sutta Units Bundled 100% Offline',
      details: 'All 36+ foundational canonical text units across all 9 collections are stored locally offline in the application bundle.',
    },
    missingOrExcluded: {
      summary: 'Excluded or Unavailable Material',
      items: [
        'Full textual corpus of the complete Pali Tipitaka (tens of thousands of suttas across 5 Nikayas, Vinaya, and Abhidhamma).',
        'Complete Chinese Agamas and Tibetan Kangyur canons.',
      ],
    },
  },

  jainism: {
    religionId: 'jainism',
    name: 'Jainism',
    nativeName: 'जैन धर्म',
    canonicalMetadata: {
      status: 'COMPLETE',
      summary: '9 Canonical Collections Metadata',
      details: '9 collections spanning Navkar Mantra, Bhaktamar Stotra, Classical Agamas (Acaranga, Sutrakritanga), Uttaradhyayana Sutra, Kalpa Sutra, Samayik, and Tattvartha Sutra.',
    },
    textCorpus: {
      status: 'CURATED_SELECTIONS',
      summary: '29 Curated Canonical Texts (Zero AI)',
      details: 'Curated canonical passages in Ardhamagadhi Prakrit / Sanskrit with Hermann Jacobi\'s public domain translations (Sacred Books of the East Vols. 22 & 45). Zero AI-generated translations.',
    },
    curatedLiturgicalSelections: {
      count: 29,
      summary: '29 Foundational Text Units (100% Bundled Offline)',
      items: [
        'Navkar Mantra (Complete 9 Lines with Prakrit & English Translation)',
        'Acaranga Sutra (Book 1, Lecture 1, Lesson 1 — Ahimsa Foundation)',
        'Sutrakritanga Sutra & Uttaradhyayana Sutra (Chapter 10 Leaf of the Tree)',
        'Kalpa Sutra (Lives of the Tirthankaras — Bhagavan Mahavira)',
        'Bhaktamar Stotra (Stanzas 1, 2, 48 by Acharya Manatunga)',
        'Tattvartha Sutra (Chapter 1: Parasparopagraho Jivanam)',
      ],
    },
    networkDependentContent: {
      hasApiDependency: false,
      provider: 'None (Completely Self-Contained)',
      endpoints: [],
      details: 'The Jainism module has zero external API dependencies. All text, transliteration, and commentary render entirely locally.',
    },
    offlineAvailability: {
      status: 'FULL_OFFLINE',
      summary: '100% Offline (Self-Contained)',
      details: 'All 29 curated text units across all 9 collections are 100% available offline with zero network connectivity.',
    },
    missingOrExcluded: {
      summary: 'Excluded or Unavailable Material',
      items: [
        'Full textual corpus of all 45 Agamas (Angas, Upangas, Prakirnakas, Chedasutras, Mulasutras).',
        'Spoken audio recitations for Agamas are currently unmapped (pending discovery).',
      ],
    },
  },
};

interface ScriptureCoverageModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialReligionId?: ReligionId;
}

export const ScriptureCoverageModal: React.FC<ScriptureCoverageModalProps> = ({
  isOpen,
  onClose,
  initialReligionId = 'islam',
}) => {
  const [activeTab, setActiveTab] = useState<ReligionId>(initialReligionId);

  if (!isOpen) return null;

  const coverage = TRADITIONS_COVERAGE[activeTab];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-navy-950/80 backdrop-blur-md animate-in fade-in-50 duration-150">
      <div
        className="relative w-full max-w-4xl max-h-[90vh] bg-navy-900 border border-gold-500/30 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        role="dialog"
        aria-modal="true"
        aria-labelledby="coverage-modal-title"
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-6 border-b border-slate-800 flex items-center justify-between bg-navy-950/70">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-gold-500/10 border border-gold-500/20 text-gold-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 id="coverage-modal-title" className="font-serif text-lg sm:text-xl font-bold text-slate-100">
                Scripture Content Coverage & Availability Disclosure
              </h2>
              <p className="text-xs text-slate-400">
                Truth-in-labeling: distinguishing canonical metadata, curated selections, dynamic API content, and offline limits.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition"
            aria-label="Close disclosure"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tradition Navigation Tabs */}
        <div className="flex items-center space-x-1.5 p-3 px-4 sm:px-6 bg-navy-950/40 border-b border-slate-800 overflow-x-auto text-xs">
          {ALL_RELIGION_IDS.map((rId) => {
            const rel = RELIGIONS_REGISTRY[rId];
            const isSelected = activeTab === rId;
            return (
              <button
                key={rId}
                onClick={() => setActiveTab(rId)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap transition flex items-center space-x-1.5 ${
                  isSelected
                    ? 'bg-gold-500 text-navy-950 shadow-gold-sm'
                    : 'bg-navy-900/60 border border-slate-800 text-slate-300 hover:text-gold-400 hover:bg-navy-800'
                }`}
              >
                <span>{rel.name}</span>
                <span className="text-[10px] opacity-75">({rel.nativeName})</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 text-xs sm:text-sm">
          {/* Header Summary Card */}
          <div className="p-4 rounded-2xl bg-navy-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-bold text-gold-400 uppercase tracking-wider">
                Audited Tradition
              </div>
              <div className="font-serif text-xl font-bold text-slate-100 flex items-center space-x-2">
                <span>{coverage.name}</span>
                <span className="text-gold-400/80 font-normal">({coverage.nativeName})</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  coverage.offlineAvailability.status === 'FULL_OFFLINE'
                    ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                    : coverage.offlineAvailability.status === 'PARTIAL_OFFLINE'
                    ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                    : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
                }`}
              >
                {coverage.offlineAvailability.status === 'FULL_OFFLINE'
                  ? '100% Offline Ready'
                  : coverage.offlineAvailability.status === 'PARTIAL_OFFLINE'
                  ? 'Partial Offline Fallback'
                  : 'Zero Offline Verses (API Only)'}
              </span>
            </div>
          </div>

          {/* 6-Dimension Coverage Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 1. Canonical Metadata */}
            <div className="p-4 rounded-2xl bg-navy-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Layers className="w-4 h-4 text-sky-400" />
                  <span>Canonical Metadata</span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    coverage.canonicalMetadata.status === 'COMPLETE'
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {coverage.canonicalMetadata.status}
                </span>
              </div>
              <div className="font-semibold text-slate-200">
                {coverage.canonicalMetadata.summary}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {coverage.canonicalMetadata.details}
              </p>
            </div>

            {/* 2. Text Corpus Scope */}
            <div className="p-4 rounded-2xl bg-navy-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <BookOpen className="w-4 h-4 text-gold-400" />
                  <span>Text Corpus Scope</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-navy-900 text-gold-300 border border-gold-500/30">
                  {coverage.textCorpus.status.replace('_', ' ')}
                </span>
              </div>
              <div className="font-semibold text-slate-200">
                {coverage.textCorpus.summary}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {coverage.textCorpus.details}
              </p>
            </div>

            {/* 3. Curated Liturgical Selections */}
            <div className="p-4 rounded-2xl bg-navy-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Curated Selections</span>
                </span>
                <span className="font-mono text-xs font-bold text-slate-300">
                  {coverage.curatedLiturgicalSelections.count} Units
                </span>
              </div>
              <div className="font-semibold text-slate-200">
                {coverage.curatedLiturgicalSelections.summary}
              </div>
              <ul className="space-y-1 text-xs text-slate-400">
                {coverage.curatedLiturgicalSelections.items.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-gold-400">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 4. Network-Dependent Content */}
            <div className="p-4 rounded-2xl bg-navy-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Wifi className="w-4 h-4 text-amber-400" />
                  <span>External API Dependencies</span>
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    coverage.networkDependentContent.hasApiDependency
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                      : 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  }`}
                >
                  {coverage.networkDependentContent.hasApiDependency ? 'API DEPENDENT' : 'ZERO API (LOCAL)'}
                </span>
              </div>
              <div className="font-semibold text-slate-200">
                {coverage.networkDependentContent.provider}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {coverage.networkDependentContent.details}
              </p>
              {coverage.networkDependentContent.endpoints.length > 0 && (
                <div className="pt-1 text-[11px] font-mono text-slate-500 space-y-0.5">
                  {coverage.networkDependentContent.endpoints.map((ep, i) => (
                    <div key={i} className="truncate">
                      {ep}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 5. Offline Availability Details */}
            <div className="p-4 rounded-2xl bg-navy-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <Database className="w-4 h-4 text-purple-400" />
                  <span>Offline Availability</span>
                </span>
              </div>
              <div className="font-semibold text-slate-200">
                {coverage.offlineAvailability.summary}
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {coverage.offlineAvailability.details}
              </p>
            </div>

            {/* 6. Excluded or Unavailable Collections */}
            <div className="p-4 rounded-2xl bg-navy-950/70 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Missing or Excluded Material</span>
                </span>
              </div>
              <div className="font-semibold text-slate-200">
                {coverage.missingOrExcluded.summary}
              </div>
              <ul className="space-y-1 text-xs text-slate-400">
                {coverage.missingOrExcluded.items.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-1.5">
                    <span className="text-rose-400/80">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-800 bg-navy-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center space-x-2">
            <Info className="w-4 h-4 text-gold-400 flex-shrink-0" />
            <span>
              All content is independently audited under Project Theological Governance & Licensing policies.
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold transition flex-shrink-0 ml-2"
          >
            Acknowledge & Close
          </button>
        </div>
      </div>
    </div>
  );
};
