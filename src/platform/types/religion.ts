// ==============================================================================
// Common Platform Religion Metadata Types
// Jafri Religious Books & Audio Platform — Phase 0
// ==============================================================================

export type ReligionId =
  | 'islam'
  | 'hinduism'
  | 'christianity'
  | 'judaism'
  | 'sikhism'
  | 'buddhism'
  | 'jainism';

export type TextDirection = 'ltr' | 'rtl';

export interface ReligionThemeConfig {
  primaryColor: string; // Tailwind color class or hex, e.g. 'emerald-600'
  accentColor: string; // e.g. 'gold-400'
  cardBg: string; // e.g. 'bg-navy-900/90'
  borderHover: string;
  badgeBg: string;
  badgeText: string;
}

export interface ReligionMetadata {
  id: ReligionId;
  name: string;
  nativeName: string;
  scriptCode: string; // ISO 15924: 'Arab', 'Deva', 'Hebr', 'Guru', 'Latn'
  scriptName: string; // e.g., 'Arabic', 'Devanagari', 'Hebrew', 'Gurmukhi'
  textDirection: TextDirection;
  shortDescription: string;
  historicalEra: string;
  foundationalLanguage: string;
  traditions: string[];
  theme: ReligionThemeConfig;
  status: 'production-ready' | 'in-development' | 'planned';
}
