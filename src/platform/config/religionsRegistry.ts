// ==============================================================================
// Common Platform Religions Registry
// Canonical metadata for all seven world religions
// Jafri Religious Books & Audio Platform — Phase 0
// ==============================================================================

import { ReligionId, ReligionMetadata } from '../types/religion';

export const RELIGIONS_REGISTRY: Record<ReligionId, ReligionMetadata> = {
  islam: {
    id: 'islam',
    name: 'Islam',
    nativeName: 'الإسلام',
    scriptCode: 'Arab',
    scriptName: 'Arabic',
    textDirection: 'rtl',
    shortDescription:
      'Divine revelation revealed to Prophet Muhammad ﷺ, featuring the Holy Quran, verified recitations, and classical scholarly commentaries.',
    historicalEra: '7th Century CE',
    foundationalLanguage: 'Classical Quranic Arabic',
    traditions: ['Hanafi', 'Jafari', 'Shafi', 'Maliki', 'Hanbali'],
    theme: {
      primaryColor: 'emerald-600',
      accentColor: 'gold-400',
      cardBg: 'bg-navy-900/95',
      borderHover: 'hover:border-gold-500/50',
      badgeBg: 'bg-emerald-500/10',
      badgeText: 'text-emerald-400',
    },
    status: 'production-ready',
  },

  hinduism: {
    id: 'hinduism',
    name: 'Hinduism',
    nativeName: 'सनातन धर्म',
    scriptCode: 'Deva',
    scriptName: 'Devanagari',
    textDirection: 'ltr',
    shortDescription:
      'Timeless wisdom of the Sanatana tradition, encompassing the Shrimad Bhagavad Gita, the Principal Upanishads, the Vedas, and sacred epics.',
    historicalEra: 'Ancient Antiquity',
    foundationalLanguage: 'Vedic & Classical Sanskrit',
    traditions: ['Vedanta', 'Vaishnavism', 'Shaivism', 'Shaktism', 'Smarta'],
    theme: {
      primaryColor: 'amber-600',
      accentColor: 'amber-400',
      cardBg: 'bg-stone-900/95',
      borderHover: 'hover:border-amber-500/50',
      badgeBg: 'bg-amber-500/10',
      badgeText: 'text-amber-400',
    },
    status: 'production-ready',
  },

  christianity: {
    id: 'christianity',
    name: 'Christianity',
    nativeName: 'Christianity',
    scriptCode: 'Latn',
    scriptName: 'Latin / Greek / Hebrew',
    textDirection: 'ltr',
    shortDescription:
      'The Holy Bible spanning the Old and New Testaments, featuring classical and modern public domain translations with synchronized chapter audio.',
    historicalEra: '1st Century CE',
    foundationalLanguage: 'Biblical Hebrew, Aramaic, & Koine Greek',
    traditions: ['Catholic', 'Eastern Orthodox', 'Protestant', 'Oriental Orthodox'],
    theme: {
      primaryColor: 'blue-600',
      accentColor: 'rose-400',
      cardBg: 'bg-slate-900/95',
      borderHover: 'hover:border-blue-500/50',
      badgeBg: 'bg-blue-500/10',
      badgeText: 'text-blue-400',
    },
    status: 'production-ready',
  },

  judaism: {
    id: 'judaism',
    name: 'Judaism',
    nativeName: 'יהדות',
    scriptCode: 'Hebr',
    scriptName: 'Biblical Hebrew',
    textDirection: 'rtl',
    shortDescription:
      'The sacred Tanakh (Torah, Nevi\'im, Ketuvim) and the rabbinic oral tradition of the Mishnah and Talmud with vocalized Hebrew text.',
    historicalEra: '2nd Millennium BCE',
    foundationalLanguage: 'Biblical Hebrew & Talmudic Aramaic',
    traditions: ['Orthodox', 'Conservative', 'Reform', 'Hasidic'],
    theme: {
      primaryColor: 'indigo-600',
      accentColor: 'sky-400',
      cardBg: 'bg-slate-900/95',
      borderHover: 'hover:border-indigo-500/50',
      badgeBg: 'bg-indigo-500/10',
      badgeText: 'text-indigo-400',
    },
    status: 'production-ready',
  },

  sikhism: {
    id: 'sikhism',
    name: 'Sikhism',
    nativeName: 'ਸਿੱਖੀ',
    scriptCode: 'Guru',
    scriptName: 'Gurmukhi',
    textDirection: 'ltr',
    shortDescription:
      'The eternal living Guru, Sri Guru Granth Sahib Ji, spanning 1,430 canonical Angs with Gurmukhi script, English translations, and Raag recitation.',
    historicalEra: '15th Century CE',
    foundationalLanguage: 'Sant Bhasha / Gurmukhi Punjabi',
    traditions: ['Gurmat', 'Khalsa Panth', 'Nirmala', 'Udasi'],
    theme: {
      primaryColor: 'amber-500',
      accentColor: 'orange-400',
      cardBg: 'bg-zinc-900/95',
      borderHover: 'hover:border-orange-500/50',
      badgeBg: 'bg-orange-500/10',
      badgeText: 'text-orange-400',
    },
    status: 'production-ready',
  },

  buddhism: {
    id: 'buddhism',
    name: 'Buddhism',
    nativeName: 'धर्म / ధమ్మ',
    scriptCode: 'Latn',
    scriptName: 'Romanized Pali / Devanagari',
    textDirection: 'ltr',
    shortDescription:
      'The Words of the Buddha preserved in the Pali Canon (Tipitaka: Vinaya, Sutta, Abhidhamma) and Mahayana sutras with sentence-by-sentence alignment.',
    historicalEra: '6th–5th Century BCE',
    foundationalLanguage: 'Pali & Sanskrit',
    traditions: ['Theravada', 'Mahayana', 'Vajrayana / Tibetan'],
    theme: {
      primaryColor: 'yellow-600',
      accentColor: 'amber-300',
      cardBg: 'bg-stone-900/95',
      borderHover: 'hover:border-yellow-500/50',
      badgeBg: 'bg-yellow-500/10',
      badgeText: 'text-yellow-400',
    },
    status: 'production-ready',
  },

  jainism: {
    id: 'jainism',
    name: 'Jainism',
    nativeName: 'जैन धर्म',
    scriptCode: 'Deva',
    scriptName: 'Devanagari (Ardhamagadhi / Sauraseni)',
    textDirection: 'ltr',
    shortDescription:
      'The sacred Agamas and classical treatises (Tattvartha Sutra, Samayasara) upholding Ahimsa, Anekantavada, and Aparigraha.',
    historicalEra: 'Ancient Antiquity (6th Century BCE Tirthankara Mahavira)',
    foundationalLanguage: 'Ardhamagadhi Prakrit & Sanskrit',
    traditions: ['Shvetambara (Murtipujaka, Sthanakvasi, Terapanthi)', 'Digambara (Bispanthi, Terapanthi)'],
    theme: {
      primaryColor: 'rose-600',
      accentColor: 'rose-400',
      cardBg: 'bg-neutral-900/95',
      borderHover: 'hover:border-rose-500/50',
      badgeBg: 'bg-rose-500/10',
      badgeText: 'text-rose-400',
    },
    status: 'production-ready',
  },
};

export const ALL_RELIGION_IDS: ReligionId[] = [
  'islam',
  'hinduism',
  'christianity',
  'judaism',
  'sikhism',
  'buddhism',
  'jainism',
];
