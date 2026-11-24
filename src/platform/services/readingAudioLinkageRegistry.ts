/**
 * ============================================================================
 * JAFRI RELIGIOUS RESOURCES — READING TO AUDIO LINKAGE REGISTRY
 * Authoritative Declarative Mapping between Scripture Readings and
 * Canonical Master Catalogue Audio Recordings across All Seven World Traditions
 * ============================================================================
 */

import type { TraditionId, SacredAudioRequirement } from '../types/sacredAudio';
import type { MatchScopeLevel, CanonicalReadingContext } from '../types/readingContext';
import {
  SACRED_AUDIO_MASTER_CATALOGUE,
  isApprovedPublicYouTubeId,
  isApprovedLocalAudioId
} from '../data/sacredAudioMasterCatalogue';

export interface AudioReadingLinkage {
  requirementId: string;
  tradition: TraditionId;
  targetScriptureId?: string;
  targetCollectionId?: string;
  targetReadingId?: string;
  targetBookId?: string | number;
  targetChapterId?: number;
  targetChapterRange?: [number, number];
  targetSectionId?: string;
  matchScope: MatchScopeLevel;
  canonicalLabel: string;
  notes?: string;
}

export const READING_AUDIO_LINKAGES: readonly AudioReadingLinkage[] = [
  {
    "requirementId": "REQ-ISL-001",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 1,
    "targetReadingId": "surah-1",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 1: Al-Fatihah (\u0627\u0644\u0641\u0627\u062a\u062d\u0629)"
  },
  {
    "requirementId": "REQ-ISL-013",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 13,
    "targetReadingId": "surah-13",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 13: Ar-Ra'd (\u0627\u0644\u0631\u0639\u062f)"
  },
  {
    "requirementId": "REQ-ISL-017",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 17,
    "targetReadingId": "surah-17",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 17: Al-Isra (\u0627\u0644\u0625\u0633\u0631\u0627\u0621)"
  },
  {
    "requirementId": "REQ-ISL-021",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 21,
    "targetReadingId": "surah-21",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 21: Al-Anbiya (\u0627\u0644\u0623\u0646\u0628\u064a\u0627\u0621)"
  },
  {
    "requirementId": "REQ-ISL-031",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 31,
    "targetReadingId": "surah-31",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 31: Luqman (\u0644\u0642\u0645\u0627\u0646)"
  },
  {
    "requirementId": "REQ-ISL-037",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 37,
    "targetReadingId": "surah-37",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 37: As-Saffat (\u0627\u0644\u0635\u0627\u0641\u0627\u062a)"
  },
  {
    "requirementId": "REQ-ISL-046",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 46,
    "targetReadingId": "surah-46",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 46: Al-Ahqaf (\u0627\u0644\u0623\u062d\u0642\u0627\u0641)"
  },
  {
    "requirementId": "REQ-ISL-052",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 52,
    "targetReadingId": "surah-52",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 52: At-Tur (\u0627\u0644\u0637\u0648\u0631)"
  },
  {
    "requirementId": "REQ-ISL-057",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 57,
    "targetReadingId": "surah-57",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 57: Al-Hadid (\u0627\u0644\u062d\u062f\u064a\u062f)"
  },
  {
    "requirementId": "REQ-ISL-058",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 58,
    "targetReadingId": "surah-58",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 58: Al-Mujadila (\u0627\u0644\u0645\u062c\u0627\u062f\u0644\u0629)"
  },
  {
    "requirementId": "REQ-ISL-063",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 63,
    "targetReadingId": "surah-63",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 63: Al-Munafiqun (\u0627\u0644\u0645\u0646\u0627\u0641\u0642\u0648\u0646)"
  },
  {
    "requirementId": "REQ-ISL-067",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 67,
    "targetReadingId": "surah-67",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 67: Al-Mulk (\u0627\u0644\u0645\u0644\u0643)"
  },
  {
    "requirementId": "REQ-ISL-071",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 71,
    "targetReadingId": "surah-71",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 71: Nuh (\u0646\u0648\u062d)"
  },
  {
    "requirementId": "REQ-ISL-082",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 82,
    "targetReadingId": "surah-82",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 82: Al-Infitar (\u0627\u0644\u0627\u0646\u0641\u0637\u0627\u0631)"
  },
  {
    "requirementId": "REQ-ISL-085",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 85,
    "targetReadingId": "surah-85",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 85: Al-Buruj (\u0627\u0644\u0628\u0631\u0648\u062c)"
  },
  {
    "requirementId": "REQ-ISL-087",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 87,
    "targetReadingId": "surah-87",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 87: Al-A'la (\u0627\u0644\u0623\u0639\u0644\u0649)"
  },
  {
    "requirementId": "REQ-ISL-091",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 91,
    "targetReadingId": "surah-91",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 91: Ash-Shams (\u0627\u0644\u0634\u0645\u0633)"
  },
  {
    "requirementId": "REQ-ISL-099",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 99,
    "targetReadingId": "surah-99",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 99: Az-Zalzalah (\u0627\u0644\u0632\u0644\u0632\u0644\u0629)"
  },
  {
    "requirementId": "REQ-ISL-100",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 100,
    "targetReadingId": "surah-100",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 100: Al-'Adiyat (\u0627\u0644\u0639\u0627\u062f\u064a\u0627\u062a)"
  },
  {
    "requirementId": "REQ-ISL-101",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 101,
    "targetReadingId": "surah-101",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 101: Al-Qari'ah (\u0627\u0644\u0642\u0627\u0631\u0639\u0629)"
  },
  {
    "requirementId": "REQ-ISL-107",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 107,
    "targetReadingId": "surah-107",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 107: Al-Ma'un (\u0627\u0644\u0645\u0627\u0639\u0648\u0646)"
  },
  {
    "requirementId": "REQ-ISL-109",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 109,
    "targetReadingId": "surah-109",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 109: Al-Kafirun (\u0627\u0644\u0643\u0627\u0641\u0631\u0648\u0646)"
  },
  {
    "requirementId": "REQ-ISL-112",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 112,
    "targetReadingId": "surah-112",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 112: Al-Ikhlas (\u0627\u0644\u0625\u062e\u0644\u0627\u0635)"
  },
  {
    "requirementId": "REQ-ISL-113",
    "tradition": "islam",
    "targetScriptureId": "quran",
    "targetCollectionId": "quran_surahs_arabic",
    "targetChapterId": 113,
    "targetReadingId": "surah-113",
    "matchScope": "EXACT",
    "canonicalLabel": "Surah 113: Al-Falaq (\u0627\u0644\u0641\u0644\u0642)"
  },
  {
    "requirementId": "REQ-ISL-365",
    "tradition": "islam",
    "targetScriptureId": "islamic_prayers",
    "targetCollectionId": "adhan_call_to_prayer",
    "targetReadingId": "adhan",
    "matchScope": "EXACT",
    "canonicalLabel": "Adhan (Call to Prayer)"
  },
  {
    "requirementId": "REQ-HIN-001",
    "tradition": "hinduism",
    "targetScriptureId": "gita",
    "targetCollectionId": "gita",
    "targetChapterId": 1,
    "targetReadingId": "gita-ch-1",
    "matchScope": "EXACT",
    "canonicalLabel": "Bhagavad Gita \u2014 Chapter 1"
  },
  {
    "requirementId": "REQ-HIN-002",
    "tradition": "hinduism",
    "targetScriptureId": "gita",
    "targetCollectionId": "gita",
    "targetChapterId": 2,
    "targetReadingId": "gita-ch-2",
    "matchScope": "EXACT",
    "canonicalLabel": "Bhagavad Gita \u2014 Chapter 2"
  },
  {
    "requirementId": "REQ-HIN-003",
    "tradition": "hinduism",
    "targetScriptureId": "gita",
    "targetCollectionId": "gita",
    "targetChapterId": 3,
    "targetReadingId": "gita-ch-3",
    "matchScope": "EXACT",
    "canonicalLabel": "Bhagavad Gita \u2014 Chapter 3"
  },
  {
    "requirementId": "REQ-HIN-004",
    "tradition": "hinduism",
    "targetScriptureId": "gita",
    "targetCollectionId": "gita",
    "targetChapterId": 4,
    "targetReadingId": "gita-ch-4",
    "matchScope": "EXACT",
    "canonicalLabel": "Bhagavad Gita \u2014 Chapter 4"
  },
  {
    "requirementId": "REQ-HIN-005",
    "tradition": "hinduism",
    "targetScriptureId": "gita",
    "targetCollectionId": "gita",
    "targetChapterId": 5,
    "targetReadingId": "gita-ch-5",
    "matchScope": "EXACT",
    "canonicalLabel": "Bhagavad Gita \u2014 Chapter 5"
  },
  {
    "requirementId": "REQ-HIN-006",
    "tradition": "hinduism",
    "targetScriptureId": "gita",
    "targetCollectionId": "gita",
    "targetChapterId": 6,
    "targetReadingId": "gita-ch-6",
    "matchScope": "EXACT",
    "canonicalLabel": "Bhagavad Gita \u2014 Chapter 6"
  },
  {
    "requirementId": "REQ-HIN-007",
    "tradition": "hinduism",
    "targetScriptureId": "gita",
    "targetCollectionId": "gita",
    "targetChapterId": 7,
    "targetReadingId": "gita-ch-7",
    "matchScope": "EXACT",
    "canonicalLabel": "Bhagavad Gita \u2014 Chapter 7"
  },
  {
    "requirementId": "REQ-HIN-008",
    "tradition": "hinduism",
    "targetScriptureId": "gita",
    "targetCollectionId": "gita",
    "targetChapterId": 8,
    "targetReadingId": "gita-ch-8",
    "matchScope": "EXACT",
    "canonicalLabel": "Bhagavad Gita \u2014 Chapter 8"
  },
  {
    "requirementId": "REQ-HIN-009",
    "tradition": "hinduism",
    "targetScriptureId": "gita",
    "targetCollectionId": "gita",
    "targetChapterId": 9,
    "targetReadingId": "gita-ch-9",
    "matchScope": "EXACT",
    "canonicalLabel": "Bhagavad Gita \u2014 Chapter 9"
  },
  {
    "requirementId": "REQ-HIN-010",
    "tradition": "hinduism",
    "targetScriptureId": "gita",
    "targetCollectionId": "gita",
    "targetChapterId": 10,
    "targetReadingId": "gita-ch-10",
    "matchScope": "EXACT",
    "canonicalLabel": "Bhagavad Gita \u2014 Chapter 10"
  },
  {
    "requirementId": "REQ-HIN-011",
    "tradition": "hinduism",
    "targetScriptureId": "gita",
    "targetCollectionId": "gita",
    "targetChapterId": 11,
    "targetReadingId": "gita-ch-11",
    "matchScope": "EXACT",
    "canonicalLabel": "Bhagavad Gita \u2014 Chapter 11"
  },
  {
    "requirementId": "REQ-HIN-012",
    "tradition": "hinduism",
    "targetScriptureId": "gita",
    "targetCollectionId": "gita",
    "targetChapterId": 12,
    "targetReadingId": "gita-ch-12",
    "matchScope": "EXACT",
    "canonicalLabel": "Bhagavad Gita \u2014 Chapter 12"
  },
  {
    "requirementId": "REQ-HIN-013",
    "tradition": "hinduism",
    "targetScriptureId": "gita",
    "targetCollectionId": "gita",
    "targetChapterId": 13,
    "targetReadingId": "gita-ch-13",
    "matchScope": "EXACT",
    "canonicalLabel": "Bhagavad Gita \u2014 Chapter 13"
  },
  {
    "requirementId": "REQ-HIN-014",
    "tradition": "hinduism",
    "targetScriptureId": "gita",
    "targetCollectionId": "gita",
    "targetChapterId": 14,
    "targetReadingId": "gita-ch-14",
    "matchScope": "EXACT",
    "canonicalLabel": "Bhagavad Gita \u2014 Chapter 14"
  },
  {
    "requirementId": "REQ-HIN-015",
    "tradition": "hinduism",
    "targetScriptureId": "gita",
    "targetCollectionId": "gita",
    "targetChapterId": 15,
    "targetReadingId": "gita-ch-15",
    "matchScope": "EXACT",
    "canonicalLabel": "Bhagavad Gita \u2014 Chapter 15"
  },
  {
    "requirementId": "REQ-HIN-016",
    "tradition": "hinduism",
    "targetScriptureId": "gita",
    "targetCollectionId": "gita",
    "targetChapterId": 16,
    "targetReadingId": "gita-ch-16",
    "matchScope": "EXACT",
    "canonicalLabel": "Bhagavad Gita \u2014 Chapter 16"
  },
  {
    "requirementId": "REQ-HIN-017",
    "tradition": "hinduism",
    "targetScriptureId": "gita",
    "targetCollectionId": "gita",
    "targetChapterId": 17,
    "targetReadingId": "gita-ch-17",
    "matchScope": "EXACT",
    "canonicalLabel": "Bhagavad Gita \u2014 Chapter 17"
  },
  {
    "requirementId": "REQ-HIN-018",
    "tradition": "hinduism",
    "targetScriptureId": "gita",
    "targetCollectionId": "gita",
    "targetChapterId": 18,
    "targetReadingId": "gita-ch-18",
    "matchScope": "EXACT",
    "canonicalLabel": "Bhagavad Gita \u2014 Chapter 18"
  },
  {
    "requirementId": "REQ-HIN-020",
    "tradition": "hinduism",
    "targetScriptureId": "ramayana",
    "targetCollectionId": "valmiki_ramayana",
    "targetReadingId": "aditya-hridaya-stotram",
    "matchScope": "EXACT",
    "canonicalLabel": "Valmiki Ramayana (Yuddha Kanda 105)"
  },
  {
    "requirementId": "REQ-HIN-027",
    "tradition": "hinduism",
    "targetScriptureId": "ramcharitmanas",
    "targetCollectionId": "ramcharitmanas",
    "targetReadingId": "ramachandra-kripalu",
    "matchScope": "EXACT",
    "canonicalLabel": "Ramcharitmanas \u2014 Shri Ramachandra Kripalu"
  },
  {
    "requirementId": "REQ-HIN-028",
    "tradition": "hinduism",
    "targetScriptureId": "principal_upanishads",
    "targetCollectionId": "principal_upanishads",
    "targetReadingId": "principal_upanishads-REQ-HIN-028",
    "matchScope": "EXACT",
    "canonicalLabel": "Isha Upanishad"
  },
  {
    "requirementId": "REQ-HIN-029",
    "tradition": "hinduism",
    "targetScriptureId": "principal_upanishads",
    "targetCollectionId": "principal_upanishads",
    "targetReadingId": "principal_upanishads-REQ-HIN-029",
    "matchScope": "EXACT",
    "canonicalLabel": "Isha Upanishad"
  },
  {
    "requirementId": "REQ-HIN-032",
    "tradition": "hinduism",
    "targetScriptureId": "principal_upanishads",
    "targetCollectionId": "principal_upanishads",
    "targetReadingId": "principal_upanishads-REQ-HIN-032",
    "matchScope": "EXACT",
    "canonicalLabel": "Mandukya Upanishad"
  },
  {
    "requirementId": "REQ-HIN-036",
    "tradition": "hinduism",
    "targetScriptureId": "vedas",
    "targetCollectionId": "vedas",
    "targetReadingId": "vedas-REQ-HIN-036",
    "matchScope": "EXACT",
    "canonicalLabel": "Rigveda 10.90"
  },
  {
    "requirementId": "REQ-HIN-037",
    "tradition": "hinduism",
    "targetScriptureId": "vedas",
    "targetCollectionId": "vedas",
    "targetReadingId": "vedas-REQ-HIN-037",
    "matchScope": "EXACT",
    "canonicalLabel": "Rigveda Khilani"
  },
  {
    "requirementId": "REQ-HIN-038",
    "tradition": "hinduism",
    "targetScriptureId": "vedas",
    "targetCollectionId": "vedas",
    "targetReadingId": "vedas-REQ-HIN-038",
    "matchScope": "EXACT",
    "canonicalLabel": "Rigveda 2.23.1"
  },
  {
    "requirementId": "REQ-HIN-042",
    "tradition": "hinduism",
    "targetScriptureId": "hanuman_chalisas",
    "targetCollectionId": "hanuman_chalisas",
    "targetReadingId": "hanuman_chalisas-REQ-HIN-042",
    "matchScope": "EXACT",
    "canonicalLabel": "Sri Hanuman Chalisa"
  },
  {
    "requirementId": "REQ-HIN-043",
    "tradition": "hinduism",
    "targetScriptureId": "hanuman_chalisas",
    "targetCollectionId": "hanuman_chalisas",
    "targetReadingId": "hanuman_chalisas-REQ-HIN-043",
    "matchScope": "EXACT",
    "canonicalLabel": "Sri Hanuman Chalisa"
  },
  {
    "requirementId": "REQ-HIN-044",
    "tradition": "hinduism",
    "targetScriptureId": "hanuman_chalisas",
    "targetCollectionId": "hanuman_chalisas",
    "targetReadingId": "hanuman_chalisas-REQ-HIN-044",
    "matchScope": "EXACT",
    "canonicalLabel": "Sri Hanuman Chalisa"
  },
  {
    "requirementId": "REQ-HIN-045",
    "tradition": "hinduism",
    "targetScriptureId": "hanuman_chalisas",
    "targetCollectionId": "hanuman_chalisas",
    "targetReadingId": "hanuman_chalisas-REQ-HIN-045",
    "matchScope": "EXACT",
    "canonicalLabel": "Sri Hanuman Chalisa"
  },
  {
    "requirementId": "REQ-HIN-046",
    "tradition": "hinduism",
    "targetScriptureId": "hanuman_chalisas",
    "targetCollectionId": "hanuman_chalisas",
    "targetReadingId": "hanuman_chalisas-REQ-HIN-046",
    "matchScope": "EXACT",
    "canonicalLabel": "Sri Hanuman Chalisa"
  },
  {
    "requirementId": "REQ-HIN-047",
    "tradition": "hinduism",
    "targetScriptureId": "hanuman_chalisas",
    "targetCollectionId": "hanuman_chalisas",
    "targetReadingId": "hanuman_chalisas-REQ-HIN-047",
    "matchScope": "EXACT",
    "canonicalLabel": "Sri Hanuman Chalisa"
  },
  {
    "requirementId": "REQ-HIN-048",
    "tradition": "hinduism",
    "targetScriptureId": "hanuman_chalisas",
    "targetCollectionId": "hanuman_chalisas",
    "targetReadingId": "hanuman_chalisas-REQ-HIN-048",
    "matchScope": "EXACT",
    "canonicalLabel": "Sri Hanuman Chalisa"
  },
  {
    "requirementId": "REQ-HIN-049",
    "tradition": "hinduism",
    "targetScriptureId": "hanuman_chalisas",
    "targetCollectionId": "hanuman_chalisas",
    "targetReadingId": "hanuman_chalisas-REQ-HIN-049",
    "matchScope": "EXACT",
    "canonicalLabel": "Sri Hanuman Chalisa"
  },
  {
    "requirementId": "REQ-HIN-050",
    "tradition": "hinduism",
    "targetScriptureId": "aartis",
    "targetCollectionId": "aartis",
    "targetReadingId": "aartis-REQ-HIN-050",
    "matchScope": "EXACT",
    "canonicalLabel": "Om Jai Jagdish Hare (Shraddha Ram Phillauri, 1870)"
  },
  {
    "requirementId": "REQ-HIN-051",
    "tradition": "hinduism",
    "targetScriptureId": "aartis",
    "targetCollectionId": "aartis",
    "targetReadingId": "aartis-REQ-HIN-051",
    "matchScope": "EXACT",
    "canonicalLabel": "Om Jai Jagdish Hare"
  },
  {
    "requirementId": "REQ-HIN-052",
    "tradition": "hinduism",
    "targetScriptureId": "aartis",
    "targetCollectionId": "aartis",
    "targetReadingId": "aartis-REQ-HIN-052",
    "matchScope": "EXACT",
    "canonicalLabel": "Aarti Kunj Bihari Ki (Sri Krishna Aarti)"
  },
  {
    "requirementId": "REQ-HIN-053",
    "tradition": "hinduism",
    "targetScriptureId": "aartis",
    "targetCollectionId": "aartis",
    "targetReadingId": "aartis-REQ-HIN-053",
    "matchScope": "EXACT",
    "canonicalLabel": "Jai Ganesh Deva (Ganesh Aarti)"
  },
  {
    "requirementId": "REQ-HIN-055",
    "tradition": "hinduism",
    "targetScriptureId": "aartis",
    "targetCollectionId": "aartis",
    "targetReadingId": "aartis-REQ-HIN-055",
    "matchScope": "EXACT",
    "canonicalLabel": "Shri Ramachandra Ji Ki Aarti (Aarti Kije Ramchandra Ki)"
  },
  {
    "requirementId": "REQ-HIN-056",
    "tradition": "hinduism",
    "targetScriptureId": "aartis",
    "targetCollectionId": "aartis",
    "targetReadingId": "aartis-REQ-HIN-056",
    "matchScope": "EXACT",
    "canonicalLabel": "Shri Hanuman Ji Ki Aarti (Aarti Kije Hanuman Lala Ki)"
  },
  {
    "requirementId": "REQ-HIN-057",
    "tradition": "hinduism",
    "targetScriptureId": "aartis",
    "targetCollectionId": "aartis",
    "targetReadingId": "aartis-REQ-HIN-057",
    "matchScope": "EXACT",
    "canonicalLabel": "Shri Shiv Ji Ki Aarti (Om Jai Shiva Omkara)"
  },
  {
    "requirementId": "REQ-HIN-058",
    "tradition": "hinduism",
    "targetScriptureId": "aartis",
    "targetCollectionId": "aartis",
    "targetReadingId": "aartis-REQ-HIN-058",
    "matchScope": "EXACT",
    "canonicalLabel": "Shri Lakshmi Ji Ki Aarti (Om Jai Lakshmi Mata)"
  },
  {
    "requirementId": "REQ-HIN-059",
    "tradition": "hinduism",
    "targetScriptureId": "aartis",
    "targetCollectionId": "aartis",
    "targetReadingId": "aartis-REQ-HIN-059",
    "matchScope": "EXACT",
    "canonicalLabel": "Shri Ambe Gauri Aarti (Jai Ambe Gauri)"
  },
  {
    "requirementId": "REQ-HIN-060",
    "tradition": "hinduism",
    "targetScriptureId": "bhajans",
    "targetCollectionId": "bhajans",
    "targetReadingId": "bhajans-REQ-HIN-060",
    "matchScope": "EXACT",
    "canonicalLabel": "Mirabai"
  },
  {
    "requirementId": "REQ-HIN-061",
    "tradition": "hinduism",
    "targetScriptureId": "bhajans",
    "targetCollectionId": "bhajans",
    "targetReadingId": "bhajans-REQ-HIN-061",
    "matchScope": "EXACT",
    "canonicalLabel": "Narsinh Mehta"
  },
  {
    "requirementId": "REQ-HIN-062",
    "tradition": "hinduism",
    "targetScriptureId": "bhajans",
    "targetCollectionId": "bhajans",
    "targetReadingId": "bhajans-REQ-HIN-062",
    "matchScope": "EXACT",
    "canonicalLabel": "Sant Kabir"
  },
  {
    "requirementId": "REQ-HIN-065",
    "tradition": "hinduism",
    "targetScriptureId": "bhajans",
    "targetCollectionId": "bhajans",
    "targetReadingId": "bhajans-REQ-HIN-065",
    "matchScope": "EXACT",
    "canonicalLabel": "Goswami Tulsidas"
  },
  {
    "requirementId": "REQ-HIN-066",
    "tradition": "hinduism",
    "targetScriptureId": "bhajans",
    "targetCollectionId": "bhajans",
    "targetReadingId": "bhajans-REQ-HIN-066",
    "matchScope": "EXACT",
    "canonicalLabel": "Surdas"
  },
  {
    "requirementId": "REQ-HIN-067",
    "tradition": "hinduism",
    "targetScriptureId": "mantras",
    "targetCollectionId": "mantras",
    "targetReadingId": "mantras-REQ-HIN-067",
    "matchScope": "EXACT",
    "canonicalLabel": "Gayatri Maha Mantra (Rigveda 3.62.10)"
  },
  {
    "requirementId": "REQ-HIN-068",
    "tradition": "hinduism",
    "targetScriptureId": "mantras",
    "targetCollectionId": "mantras",
    "targetReadingId": "mantras-REQ-HIN-068",
    "matchScope": "EXACT",
    "canonicalLabel": "Maha Mrityunjaya Mantra (Rigveda 7.59.12)"
  },
  {
    "requirementId": "REQ-HIN-069",
    "tradition": "hinduism",
    "targetScriptureId": "mantras",
    "targetCollectionId": "mantras",
    "targetReadingId": "mantras-REQ-HIN-069",
    "matchScope": "EXACT",
    "canonicalLabel": "Taittiriya Upanishad Shanti Mantra (Om Saha Navavatu)"
  },
  {
    "requirementId": "REQ-HIN-070",
    "tradition": "hinduism",
    "targetScriptureId": "mantras",
    "targetCollectionId": "mantras",
    "targetReadingId": "mantras-REQ-HIN-070",
    "matchScope": "EXACT",
    "canonicalLabel": "Brihadaranyaka Upanishad 1.3.28"
  },
  {
    "requirementId": "REQ-HIN-071",
    "tradition": "hinduism",
    "targetScriptureId": "mantras",
    "targetCollectionId": "mantras",
    "targetReadingId": "mantras-REQ-HIN-071",
    "matchScope": "EXACT",
    "canonicalLabel": "Shiva Panchakshari Moola Mantra (Om Namah Shivaya)"
  },
  {
    "requirementId": "REQ-HIN-072",
    "tradition": "hinduism",
    "targetScriptureId": "mantras",
    "targetCollectionId": "mantras",
    "targetReadingId": "mantras-REQ-HIN-072",
    "matchScope": "EXACT",
    "canonicalLabel": "Kali Santarana Upanishad"
  },
  {
    "requirementId": "REQ-HIN-073",
    "tradition": "hinduism",
    "targetScriptureId": "mantras",
    "targetCollectionId": "mantras",
    "targetReadingId": "mantras-REQ-HIN-073",
    "matchScope": "EXACT",
    "canonicalLabel": "Surya Gayatri Mantra (Om Bhaskaraya Vidmahe)"
  },
  {
    "requirementId": "REQ-HIN-074",
    "tradition": "hinduism",
    "targetScriptureId": "mantras",
    "targetCollectionId": "mantras",
    "targetReadingId": "mantras-REQ-HIN-074",
    "matchScope": "EXACT",
    "canonicalLabel": "Ganesh Moola Mantra (Om Gam Ganapataye Namaha)"
  },
  {
    "requirementId": "REQ-HIN-075",
    "tradition": "hinduism",
    "targetScriptureId": "stotras",
    "targetCollectionId": "stotras",
    "targetReadingId": "stotras-REQ-HIN-075",
    "matchScope": "EXACT",
    "canonicalLabel": "Shiva Tandava Stotram"
  },
  {
    "requirementId": "REQ-HIN-076",
    "tradition": "hinduism",
    "targetScriptureId": "stotras",
    "targetCollectionId": "stotras",
    "targetReadingId": "stotras-REQ-HIN-076",
    "matchScope": "EXACT",
    "canonicalLabel": "Shiva Tandava Stotram"
  },
  {
    "requirementId": "REQ-HIN-077",
    "tradition": "hinduism",
    "targetScriptureId": "stotras",
    "targetCollectionId": "stotras",
    "targetReadingId": "stotras-REQ-HIN-077",
    "matchScope": "EXACT",
    "canonicalLabel": "Mahishasuramardini Stotram (Ayi Giri Nandini"
  },
  {
    "requirementId": "REQ-HIN-078",
    "tradition": "hinduism",
    "targetScriptureId": "stotras",
    "targetCollectionId": "stotras",
    "targetReadingId": "stotras-REQ-HIN-078",
    "matchScope": "EXACT",
    "canonicalLabel": "Vishnu Sahasranama Stotram"
  },
  {
    "requirementId": "REQ-HIN-079",
    "tradition": "hinduism",
    "targetScriptureId": "stotras",
    "targetCollectionId": "stotras",
    "targetReadingId": "stotras-REQ-HIN-079",
    "matchScope": "EXACT",
    "canonicalLabel": "Sri Guru Stotram (Guru Gita"
  },
  {
    "requirementId": "REQ-HIN-080",
    "tradition": "hinduism",
    "targetScriptureId": "stotras",
    "targetCollectionId": "stotras",
    "targetReadingId": "stotras-REQ-HIN-080",
    "matchScope": "EXACT",
    "canonicalLabel": "Rigveda 10.125"
  },
  {
    "requirementId": "REQ-HIN-081",
    "tradition": "hinduism",
    "targetScriptureId": "stotras",
    "targetCollectionId": "stotras",
    "targetReadingId": "stotras-REQ-HIN-081",
    "matchScope": "EXACT",
    "canonicalLabel": "Kanakadhara Stotram (Adi Shankaracharya)"
  },
  {
    "requirementId": "REQ-HIN-082",
    "tradition": "hinduism",
    "targetScriptureId": "stotras",
    "targetCollectionId": "stotras",
    "targetReadingId": "stotras-REQ-HIN-082",
    "matchScope": "EXACT",
    "canonicalLabel": "Sri Venkateshwara Suprabhatam (Kausalya Supraja Rama)"
  },
  {
    "requirementId": "REQ-HIN-083",
    "tradition": "hinduism",
    "targetScriptureId": "stotras",
    "targetCollectionId": "stotras",
    "targetReadingId": "stotras-REQ-HIN-083",
    "matchScope": "EXACT",
    "canonicalLabel": "Madhurashtakam (Vallabhacharya"
  },
  {
    "requirementId": "REQ-HIN-084",
    "tradition": "hinduism",
    "targetScriptureId": "puja_festivals",
    "targetCollectionId": "puja_festivals",
    "targetReadingId": "puja_festivals-REQ-HIN-084",
    "matchScope": "EXACT",
    "canonicalLabel": "Nitya Puja"
  },
  {
    "requirementId": "REQ-HIN-089",
    "tradition": "hinduism",
    "targetScriptureId": "puja_festivals",
    "targetCollectionId": "puja_festivals",
    "targetReadingId": "puja_festivals-REQ-HIN-089",
    "matchScope": "EXACT",
    "canonicalLabel": "Deepavali Lakshmi Puja Prayers (Om Mahalakshmyai Cha Vidmahe)"
  },
  {
    "requirementId": "REQ-BUD-001",
    "tradition": "buddhism",
    "targetScriptureId": "tipitaka",
    "targetCollectionId": "tipitaka_overview",
    "targetReadingId": "tipitaka_overview",
    "matchScope": "COLLECTION",
    "canonicalLabel": "The Pali Tipitaka Structure (Patimokkha Recitation)"
  },
  {
    "requirementId": "REQ-BUD-008",
    "tradition": "buddhism",
    "targetScriptureId": "tipitaka",
    "targetCollectionId": "suttas_sutras",
    "targetReadingId": "sn56.11",
    "matchScope": "EXACT",
    "canonicalLabel": "SN 56.11 \u2014 Dhammacakkappavattana Sutta"
  },
  {
    "requirementId": "REQ-BUD-010",
    "tradition": "buddhism",
    "targetScriptureId": "prajnaparamita",
    "targetCollectionId": "suttas_sutras",
    "targetReadingId": "heart-sutra",
    "matchScope": "EXACT",
    "canonicalLabel": "Heart Sutra (Prajnaparamita Hrdaya)"
  },
  {
    "requirementId": "REQ-BUD-011",
    "tradition": "buddhism",
    "targetScriptureId": "prajnaparamita",
    "targetCollectionId": "suttas_sutras",
    "targetReadingId": "diamond-sutra",
    "matchScope": "EXACT",
    "canonicalLabel": "Diamond Sutra (Vajracchedika)"
  },
  {
    "requirementId": "REQ-BUD-016",
    "tradition": "buddhism",
    "targetScriptureId": "tipitaka",
    "targetCollectionId": "metta_sutta",
    "targetReadingId": "metta_sutta",
    "matchScope": "EXACT",
    "canonicalLabel": "Karaniya Metta Sutta"
  },
  {
    "requirementId": "REQ-BUD-019",
    "tradition": "buddhism",
    "targetScriptureId": "tipitaka",
    "targetCollectionId": "mangala_sutta",
    "targetReadingId": "mangala_sutta",
    "matchScope": "EXACT",
    "canonicalLabel": "Maha Mangala Sutta"
  },
  {
    "requirementId": "REQ-BUD-020",
    "tradition": "buddhism",
    "targetScriptureId": "chants_parittas",
    "targetCollectionId": "chants_parittas",
    "targetReadingId": "chants_parittas-REQ-BUD-020",
    "matchScope": "EXACT",
    "canonicalLabel": "The Three Sacred Refuges (Ti-sarana / Buddham Saranam Gacchami)"
  },
  {
    "requirementId": "REQ-BUD-021",
    "tradition": "buddhism",
    "targetScriptureId": "chants_parittas",
    "targetCollectionId": "chants_parittas",
    "targetReadingId": "chants_parittas-REQ-BUD-021",
    "matchScope": "EXACT",
    "canonicalLabel": "The Five Moral Precepts (Panca-sila / Panatipata Veramani)"
  },
  {
    "requirementId": "REQ-BUD-022",
    "tradition": "buddhism",
    "targetScriptureId": "chants_parittas",
    "targetCollectionId": "chants_parittas",
    "targetReadingId": "chants_parittas-REQ-BUD-022",
    "matchScope": "EXACT",
    "canonicalLabel": "Buddhavandana (Homage to the Blessed One"
  },
  {
    "requirementId": "REQ-BUD-023",
    "tradition": "buddhism",
    "targetScriptureId": "chants_parittas",
    "targetCollectionId": "chants_parittas",
    "targetReadingId": "chants_parittas-REQ-BUD-023",
    "matchScope": "EXACT",
    "canonicalLabel": "Dhammavandana (Homage to the Teaching"
  },
  {
    "requirementId": "REQ-BUD-024",
    "tradition": "buddhism",
    "targetScriptureId": "chants_parittas",
    "targetCollectionId": "chants_parittas",
    "targetReadingId": "chants_parittas-REQ-BUD-024",
    "matchScope": "EXACT",
    "canonicalLabel": "Sanghavandana (Homage to the Noble Community"
  },
  {
    "requirementId": "REQ-BUD-025",
    "tradition": "buddhism",
    "targetScriptureId": "chants_parittas",
    "targetCollectionId": "chants_parittas",
    "targetReadingId": "chants_parittas-REQ-BUD-025",
    "matchScope": "EXACT",
    "canonicalLabel": "Ratana Sutta (The Jewel Discourse"
  },
  {
    "requirementId": "REQ-BUD-032",
    "tradition": "buddhism",
    "targetScriptureId": "prayers_festivals",
    "targetCollectionId": "prayers_festivals",
    "targetReadingId": "prayers_festivals-REQ-BUD-032",
    "matchScope": "EXACT",
    "canonicalLabel": "Vesak (Buddha Purnima) Triple Celebration Commemoration Liturgy"
  },
  {
    "requirementId": "REQ-BUD-034",
    "tradition": "buddhism",
    "targetScriptureId": "prayers_festivals",
    "targetCollectionId": "prayers_festivals",
    "targetReadingId": "prayers_festivals-REQ-BUD-034",
    "matchScope": "EXACT",
    "canonicalLabel": "Avalokiteshvara Maha Mantra (Om Mani Padme Hum"
  },
  {
    "requirementId": "REQ-BUD-035",
    "tradition": "buddhism",
    "targetScriptureId": "prayers_festivals",
    "targetCollectionId": "prayers_festivals",
    "targetReadingId": "prayers_festivals-REQ-BUD-035",
    "matchScope": "EXACT",
    "canonicalLabel": "Green Tara Mantra (Om Tare Tuttare Ture Soha)"
  },
  {
    "requirementId": "REQ-BUD-036",
    "tradition": "buddhism",
    "targetScriptureId": "prayers_festivals",
    "targetCollectionId": "prayers_festivals",
    "targetReadingId": "prayers_festivals-REQ-BUD-036",
    "matchScope": "EXACT",
    "canonicalLabel": "Medicine Buddha Mantra (Tayata Om Bekanze Bekanze Maha Bekanze)"
  },
  {
    "requirementId": "REQ-JAI-001",
    "tradition": "jainism",
    "targetScriptureId": "navkar",
    "targetCollectionId": "navkar",
    "targetReadingId": "navkar-line-001",
    "matchScope": "EXACT",
    "canonicalLabel": "\u1e46am\u014dk\u0101ra Mah\u0101mantra"
  },
  {
    "requirementId": "REQ-JAI-002",
    "tradition": "jainism",
    "targetScriptureId": "navkar",
    "targetCollectionId": "navkar",
    "targetReadingId": "navkar-line-002",
    "matchScope": "EXACT",
    "canonicalLabel": "\u1e46am\u014dk\u0101ra Mah\u0101mantra"
  },
  {
    "requirementId": "REQ-JAI-003",
    "tradition": "jainism",
    "targetScriptureId": "navkar",
    "targetCollectionId": "navkar",
    "targetReadingId": "navkar-line-003",
    "matchScope": "EXACT",
    "canonicalLabel": "\u1e46am\u014dk\u0101ra Mah\u0101mantra"
  },
  {
    "requirementId": "REQ-JAI-004",
    "tradition": "jainism",
    "targetScriptureId": "navkar",
    "targetCollectionId": "navkar",
    "targetReadingId": "navkar-line-004",
    "matchScope": "EXACT",
    "canonicalLabel": "\u1e46am\u014dk\u0101ra Mah\u0101mantra"
  },
  {
    "requirementId": "REQ-JAI-005",
    "tradition": "jainism",
    "targetScriptureId": "navkar",
    "targetCollectionId": "navkar",
    "targetReadingId": "navkar-line-005",
    "matchScope": "EXACT",
    "canonicalLabel": "\u1e46am\u014dk\u0101ra Mah\u0101mantra"
  },
  {
    "requirementId": "REQ-JAI-006",
    "tradition": "jainism",
    "targetScriptureId": "navkar",
    "targetCollectionId": "navkar",
    "targetReadingId": "navkar-line-006",
    "matchScope": "EXACT",
    "canonicalLabel": "\u1e46am\u014dk\u0101ra Mah\u0101mantra"
  },
  {
    "requirementId": "REQ-JAI-007",
    "tradition": "jainism",
    "targetScriptureId": "navkar",
    "targetCollectionId": "navkar",
    "targetReadingId": "navkar",
    "matchScope": "COLLECTION",
    "canonicalLabel": "\u1e46am\u014dk\u0101ra Mah\u0101mantra"
  },
  {
    "requirementId": "REQ-JAI-009",
    "tradition": "jainism",
    "targetScriptureId": "bhaktamar",
    "targetCollectionId": "bhaktamar",
    "targetReadingId": "bhaktamar-shloka-009",
    "matchScope": "EXACT",
    "canonicalLabel": "Bhakt\u0101mara St\u014dtra"
  },
  {
    "requirementId": "REQ-JAI-010",
    "tradition": "jainism",
    "targetScriptureId": "bhaktamar",
    "targetCollectionId": "bhaktamar",
    "targetReadingId": "bhaktamar-shloka-010",
    "matchScope": "EXACT",
    "canonicalLabel": "Bhakt\u0101mara St\u014dtra"
  },
  {
    "requirementId": "REQ-JAI-011",
    "tradition": "jainism",
    "targetScriptureId": "bhaktamar",
    "targetCollectionId": "bhaktamar",
    "targetReadingId": "bhaktamar-shloka-011",
    "matchScope": "EXACT",
    "canonicalLabel": "Bhakt\u0101mara St\u014dtra"
  },
  {
    "requirementId": "REQ-JAI-012",
    "tradition": "jainism",
    "targetScriptureId": "bhaktamar",
    "targetCollectionId": "bhaktamar",
    "targetReadingId": "bhaktamar",
    "matchScope": "COLLECTION",
    "canonicalLabel": "Bhakt\u0101mara St\u014dtra"
  },
  {
    "requirementId": "REQ-JAI-013",
    "tradition": "jainism",
    "targetScriptureId": "bhaktamar",
    "targetCollectionId": "bhaktamar",
    "targetReadingId": "bhaktamar",
    "matchScope": "COLLECTION",
    "canonicalLabel": "Bhakt\u0101mara St\u014dtra"
  },
  {
    "requirementId": "REQ-JAI-023",
    "tradition": "jainism",
    "targetScriptureId": "pratikraman",
    "targetCollectionId": "pratikraman",
    "targetReadingId": "pratikraman",
    "matchScope": "EXACT",
    "canonicalLabel": "Pratikramana \u2014 Universal Forgiveness"
  },
  {
    "requirementId": "REQ-JAI-028",
    "tradition": "jainism",
    "targetScriptureId": "samayik",
    "targetCollectionId": "samayik",
    "targetReadingId": "samayik-REQ-JAI-028",
    "matchScope": "EXACT",
    "canonicalLabel": "Logassa Sutra / Namutthunam (Namaskara to the 24 Tirthankaras)"
  },
  {
    "requirementId": "REQ-JAI-029",
    "tradition": "jainism",
    "targetScriptureId": "samayik",
    "targetCollectionId": "samayik",
    "targetReadingId": "samayik-REQ-JAI-029",
    "matchScope": "EXACT",
    "canonicalLabel": "Uvasaggaharam Stotra (Acharya Bhadrabahu"
  },
  {
    "requirementId": "REQ-JAI-030",
    "tradition": "jainism",
    "targetScriptureId": "jain_hymns",
    "targetCollectionId": "jain_hymns",
    "targetReadingId": "meri-bhavana-030",
    "matchScope": "EXACT",
    "canonicalLabel": "Meri Bhavana Stanza 1 (Jisne Raga Dvesha Jite"
  },
  {
    "requirementId": "REQ-JAI-031",
    "tradition": "jainism",
    "targetScriptureId": "jain_hymns",
    "targetCollectionId": "jain_hymns",
    "targetReadingId": "meri-bhavana-031",
    "matchScope": "EXACT",
    "canonicalLabel": "Meri Bhavana Stanza 2 (Rahe Sadbhavana Man Mein)"
  },
  {
    "requirementId": "REQ-JAI-032",
    "tradition": "jainism",
    "targetScriptureId": "jain_hymns",
    "targetCollectionId": "jain_hymns",
    "targetReadingId": "meri-bhavana-032",
    "matchScope": "EXACT",
    "canonicalLabel": "Meri Bhavana Stanza 3 (Maitri Bhava Jagat Mein Mera)"
  },
  {
    "requirementId": "REQ-JAI-033",
    "tradition": "jainism",
    "targetScriptureId": "jain_hymns",
    "targetCollectionId": "jain_hymns",
    "targetReadingId": "jain_hymns",
    "matchScope": "COLLECTION",
    "canonicalLabel": "Meri Bhavana Complete 12-Stanza Devotional Hymn"
  },
  {
    "requirementId": "REQ-SIK-001",
    "tradition": "sikhism",
    "targetScriptureId": "sggs",
    "targetCollectionId": "sggs",
    "targetChapterId": 1,
    "targetReadingId": "ang-1",
    "matchScope": "EXACT",
    "canonicalLabel": "Sri Guru Granth Sahib Ji \u2014 Ang 1 (Mool Mantar)"
  },
  {
    "requirementId": "REQ-SIK-002",
    "tradition": "sikhism",
    "targetScriptureId": "sggs",
    "targetCollectionId": "sggs",
    "targetChapterRange": [
      1,
      8
    ],
    "targetReadingId": "japji-sahib",
    "matchScope": "CHAPTER",
    "canonicalLabel": "Sri Guru Granth Sahib Ji \u2014 Angs 1\u20138 (Japji Sahib)"
  },
  {
    "requirementId": "REQ-SIK-003",
    "tradition": "sikhism",
    "targetScriptureId": "sggs",
    "targetCollectionId": "sggs",
    "targetChapterRange": [
      8,
      10
    ],
    "targetReadingId": "rehras-sahib",
    "matchScope": "CHAPTER",
    "canonicalLabel": "Sri Guru Granth Sahib Ji \u2014 Angs 8\u201310 (Rehras Sahib)"
  },
  {
    "requirementId": "REQ-SIK-004",
    "tradition": "sikhism",
    "targetScriptureId": "sggs",
    "targetCollectionId": "sggs",
    "targetChapterRange": [
      12,
      13
    ],
    "targetReadingId": "kirtan-sohila",
    "matchScope": "CHAPTER",
    "canonicalLabel": "Sri Guru Granth Sahib Ji \u2014 Angs 12\u201313 (Kirtan Sohila)"
  },
  {
    "requirementId": "REQ-SIK-005",
    "tradition": "sikhism",
    "targetScriptureId": "sggs",
    "targetCollectionId": "sggs",
    "targetChapterRange": [
      14,
      346
    ],
    "matchScope": "CHAPTER",
    "canonicalLabel": "Sri Guru Granth Sahib Ji \u2014 Angs 14\u2013346 (Sukhmani Sahib)"
  },
  {
    "requirementId": "REQ-SIK-006",
    "tradition": "sikhism",
    "targetScriptureId": "sggs",
    "targetCollectionId": "sggs",
    "targetChapterRange": [
      347,
      494
    ],
    "matchScope": "CHAPTER",
    "canonicalLabel": "Sri Guru Granth Sahib Ji \u2014 Angs 347\u2013494 (Aasa Di Vaar)"
  },
  {
    "requirementId": "REQ-SIK-007",
    "tradition": "sikhism",
    "targetScriptureId": "sggs",
    "targetCollectionId": "sggs",
    "targetChapterRange": [
      495,
      720
    ],
    "matchScope": "CHAPTER",
    "canonicalLabel": "Sri Guru Granth Sahib Ji \u2014 Angs 495\u2013720"
  },
  {
    "requirementId": "REQ-SIK-008",
    "tradition": "sikhism",
    "targetScriptureId": "sggs",
    "targetCollectionId": "sggs",
    "targetChapterRange": [
      721,
      974
    ],
    "matchScope": "CHAPTER",
    "canonicalLabel": "Sri Guru Granth Sahib Ji \u2014 Angs 721\u2013974"
  },
  {
    "requirementId": "REQ-SIK-009",
    "tradition": "sikhism",
    "targetScriptureId": "sggs",
    "targetCollectionId": "sggs",
    "targetChapterRange": [
      975,
      1167
    ],
    "matchScope": "CHAPTER",
    "canonicalLabel": "Sri Guru Granth Sahib Ji \u2014 Angs 975\u20131167 (Anand Sahib)"
  },
  {
    "requirementId": "REQ-SIK-010",
    "tradition": "sikhism",
    "targetScriptureId": "sggs",
    "targetCollectionId": "sggs",
    "targetChapterRange": [
      1168,
      1352
    ],
    "matchScope": "CHAPTER",
    "canonicalLabel": "Sri Guru Granth Sahib Ji \u2014 Angs 1168\u20131352"
  },
  {
    "requirementId": "REQ-SIK-011",
    "tradition": "sikhism",
    "targetScriptureId": "sggs",
    "targetCollectionId": "sggs",
    "targetChapterRange": [
      1353,
      1430
    ],
    "matchScope": "CHAPTER",
    "canonicalLabel": "Sri Guru Granth Sahib Ji \u2014 Angs 1353\u20131430 (Salok Mahala 9)"
  },
  {
    "requirementId": "REQ-SIK-012",
    "tradition": "sikhism",
    "targetScriptureId": "sggs",
    "targetCollectionId": "sggs",
    "matchScope": "COLLECTION",
    "canonicalLabel": "Sri Guru Granth Sahib Ji \u2014 Complete 1,430 Angs (Akhand Paath)"
  },
  {
    "requirementId": "REQ-SIK-013",
    "tradition": "sikhism",
    "targetScriptureId": "nitnem_prayers",
    "targetCollectionId": "nitnem_prayers",
    "targetReadingId": "nitnem-REQ-SIK-013",
    "matchScope": "EXACT",
    "canonicalLabel": "Jaap Sahib (Guru Gobind Singh Ji"
  },
  {
    "requirementId": "REQ-SIK-014",
    "tradition": "sikhism",
    "targetScriptureId": "nitnem_prayers",
    "targetCollectionId": "nitnem_prayers",
    "targetReadingId": "nitnem-REQ-SIK-014",
    "matchScope": "EXACT",
    "canonicalLabel": "Tav-Prasad Savaiye (Sravag Sudh Samuha Sidhan Ke)"
  },
  {
    "requirementId": "REQ-SIK-015",
    "tradition": "sikhism",
    "targetScriptureId": "nitnem_prayers",
    "targetCollectionId": "nitnem_prayers",
    "targetReadingId": "nitnem-REQ-SIK-015",
    "matchScope": "EXACT",
    "canonicalLabel": "Benti Chaupai Sahib (Hamri Karo Hath Dai Rachha)"
  },
  {
    "requirementId": "REQ-SIK-016",
    "tradition": "sikhism",
    "targetScriptureId": "nitnem_prayers",
    "targetCollectionId": "nitnem_prayers",
    "targetReadingId": "nitnem-REQ-SIK-016",
    "matchScope": "EXACT",
    "canonicalLabel": "Anand Sahib (Complete 40 Pauris"
  },
  {
    "requirementId": "REQ-SIK-017",
    "tradition": "sikhism",
    "targetScriptureId": "nitnem_prayers",
    "targetCollectionId": "nitnem_prayers",
    "targetReadingId": "nitnem-REQ-SIK-017",
    "matchScope": "EXACT",
    "canonicalLabel": "Ardas (The Formal Supplication of the Khalsa Panth)"
  },
  {
    "requirementId": "REQ-CHR-067",
    "tradition": "christianity",
    "targetScriptureId": "bible",
    "targetBookId": 40,
    "targetChapterId": 6,
    "targetReadingId": "matthew-6",
    "matchScope": "EXACT",
    "canonicalLabel": "Matthew 6:9\u201313 (The Lord's Prayer)"
  },
  {
    "requirementId": "REQ-CHR-068",
    "tradition": "christianity",
    "targetScriptureId": "bible",
    "targetBookId": 40,
    "targetChapterId": 5,
    "targetReadingId": "matthew-5",
    "matchScope": "EXACT",
    "canonicalLabel": "Matthew 5:3\u201312 (The Beatitudes)"
  },
  {
    "requirementId": "REQ-CHR-069",
    "tradition": "christianity",
    "targetScriptureId": "bible",
    "targetBookId": 19,
    "targetChapterId": 23,
    "targetReadingId": "psalms-23",
    "matchScope": "EXACT",
    "canonicalLabel": "Psalm 23 (The Lord is My Shepherd)"
  },
  {
    "requirementId": "REQ-CHR-070",
    "tradition": "christianity",
    "targetScriptureId": "bible",
    "targetBookId": 46,
    "targetChapterId": 13,
    "targetReadingId": "1corinthians-13",
    "matchScope": "EXACT",
    "canonicalLabel": "1 Corinthians 13 (Hymn of Love)"
  },
  {
    "requirementId": "REQ-CHR-071",
    "tradition": "christianity",
    "targetScriptureId": "bible",
    "targetBookId": 42,
    "targetChapterId": 1,
    "targetReadingId": "luke-1",
    "matchScope": "EXACT",
    "canonicalLabel": "Luke 1:46\u201355 (The Magnificat)"
  },
  {
    "requirementId": "REQ-CHR-072",
    "tradition": "christianity",
    "targetScriptureId": "creeds",
    "targetCollectionId": "creeds",
    "targetReadingId": "nicene-creed",
    "matchScope": "EXACT",
    "canonicalLabel": "The Nicene-Constantinopolitan Creed"
  },
  {
    "requirementId": "REQ-CHR-073",
    "tradition": "christianity",
    "targetScriptureId": "creeds",
    "targetCollectionId": "creeds",
    "targetReadingId": "nicene-creed",
    "matchScope": "EXACT",
    "canonicalLabel": "The Nicene-Constantinopolitan Creed"
  },
  {
    "requirementId": "REQ-JUD-001",
    "tradition": "judaism",
    "targetScriptureId": "tanakh",
    "targetCollectionId": "tanakh",
    "targetBookId": "Genesis",
    "targetChapterId": 1,
    "targetReadingId": "genesis-1",
    "matchScope": "EXACT",
    "canonicalLabel": "Genesis Chapter 1 (Bereshit 1:1\u20132:3)"
  },
  {
    "requirementId": "REQ-JUD-006",
    "tradition": "judaism",
    "targetScriptureId": "tanakh",
    "targetCollectionId": "tanakh",
    "targetBookId": "Joshua",
    "targetChapterId": 1,
    "targetReadingId": "joshua-1",
    "matchScope": "EXACT",
    "canonicalLabel": "Joshua Chapter 1 (Yehoshua 1:1\u20139)"
  },
  {
    "requirementId": "REQ-JUD-020",
    "tradition": "judaism",
    "targetScriptureId": "tanakh",
    "targetCollectionId": "tanakh",
    "targetBookId": "Deuteronomy",
    "targetChapterId": 6,
    "targetReadingId": "deuteronomy-6",
    "matchScope": "EXACT",
    "canonicalLabel": "Shema Yisrael (Deuteronomy 6:4)"
  }
];

/**
 * Checks whether a requirement is currently approved and playable.
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
 * Normalizes input string for reliable comparison
 */
function normalize(str: string | number | undefined | null): string {
  if (str === undefined || str === null) return '';
  return String(str).toLowerCase().replace(/['"’‘\-–—\s]+/g, ' ').trim();
}

/**
 * Result structure returned by the Universal Synchronization Engine
 */
export interface UniversalMatchResult {
  matchLevel: MatchScopeLevel;
  primaryMatches: SacredAudioRequirement[];
  relatedTraditionRecordings: SacredAudioRequirement[];
  scopeLabel: string;
  hasDirectMatch: boolean;
  message?: string;
  activeReadingTitle: string;
  totalTraditionCount: number;
}

/**
 * UNIVERSAL RECORDING MATCHING ENGINE
 * Evaluates the CanonicalReadingContext against the authoritative declarative linkage registry.
 * Enforces the strict 5-level matching hierarchy:
 *   Level 1: EXACT READING MATCH
 *   Level 2: CHAPTER / SECTION MATCH
 *   Level 3: COLLECTION MATCH
 *   Level 4: RELATED TRADITION RECORDINGS
 *   Level 5: NO APPROVED MATCH
 */
export function resolveReadingAudioMatches(
  context: CanonicalReadingContext
): UniversalMatchResult {
  const normTrad = normalize(context.religionId);

  // Retrieve all approved playable recordings in master catalogue for this tradition
  const allTraditionRecordings = SACRED_AUDIO_MASTER_CATALOGUE.filter(
    (req) => normalize(req.tradition) === normTrad && isRequirementPlayable(req)
  );
  const totalTraditionCount = allTraditionRecordings.length;

  // Active reading title for display
  const activeReadingTitle =
    context.canonicalTitle ||
    context.title ||
    (context.bookName && context.chapterId ? `${context.bookName} ${context.chapterId}` : '') ||
    context.bookName ||
    'Sacred Scripture';

  if (!normTrad || allTraditionRecordings.length === 0) {
    return {
      matchLevel: 'NONE',
      primaryMatches: [],
      relatedTraditionRecordings: [],
      scopeLabel: activeReadingTitle,
      hasDirectMatch: false,
      message: `No approved recording currently available for this reading: ${activeReadingTitle}.`,
      activeReadingTitle,
      totalTraditionCount: 0,
    };
  }

  // Pre-parse numeric coordinates
  let chapterNum: number | undefined = undefined;
  let hasChapterNum = false;
  if (context.chapterId !== undefined && context.chapterId !== null && String(context.chapterId).trim() !== '') {
    const parsed = parseInt(String(context.chapterId), 10);
    if (!isNaN(parsed)) {
      chapterNum = parsed;
      hasChapterNum = true;
    }
  }

  const normBookId = normalize(context.bookId);
  const normBookName = normalize(context.bookName);
  const normCollectionId = normalize(context.collectionId);
  const normReadingId = normalize(context.readingId);
  const normSectionId = normalize(context.sectionId);
  const normTitle = normalize(context.canonicalTitle || context.title);

  // Explicit requirement IDs if provided
  const supportedIds = new Set(
    (context.supportedAudioRequirementIdentifiers || []).map((id) => normalize(id))
  );

  // Relevant linkages for this tradition
  const traditionLinkages = READING_AUDIO_LINKAGES.filter(
    (l) => normalize(l.tradition) === normTrad
  );

  let exactMatches: { linkage: AudioReadingLinkage; req: SacredAudioRequirement }[] = [];
  let chapterMatches: { linkage: AudioReadingLinkage; req: SacredAudioRequirement }[] = [];
  let collectionMatches: { linkage: AudioReadingLinkage; req: SacredAudioRequirement }[] = [];

  for (const link of traditionLinkages) {
    const req = allTraditionRecordings.find((r) => r.id === link.requirementId);
    if (!req) continue;

    const linkReadingId = normalize(link.targetReadingId);
    const linkSectionId = normalize(link.targetSectionId);
    const linkCollectionId = normalize(link.targetCollectionId);
    const linkBookId = normalize(link.targetBookId);
    const linkLabel = normalize(link.canonicalLabel);
    const linkScope = link.matchScope;
    const linkChId = link.targetChapterId;

    // Check if explicitly supported by caller
    if (supportedIds.has(normalize(link.requirementId))) {
      exactMatches.push({ linkage: link, req });
      continue;
    }

    // 1. Check EXACT match (Strict identifier equality, no loose substrings)
    let isExact = false;
    if (normReadingId && linkReadingId && (normReadingId === linkReadingId || normReadingId.endsWith(linkReadingId) || linkReadingId.endsWith(normReadingId))) {
      isExact = true;
    } else if (normSectionId && linkSectionId && normSectionId === linkSectionId) {
      isExact = true;
    } else if (
      (normSectionId === 'aarti:kunj_bihari' || normReadingId === 'aarti:kunj_bihari' || (normTitle && normTitle.includes('kunj bihari'))) &&
      link.requirementId === 'REQ-HIN-052'
    ) {
      isExact = true;
    } else if (
      (normSectionId.includes('om_jai_jagdish') || normReadingId.includes('om_jai_jagdish') || (normTitle && normTitle.includes('om jai jagdish'))) &&
      (link.requirementId === 'REQ-HIN-050' || link.requirementId === 'REQ-HIN-051')
    ) {
      isExact = true;
    } else if (
      (normSectionId === 'aarti:ganesh' || normReadingId === 'aarti:ganesh' || (normTitle && normTitle.includes('jai ganesh'))) &&
      link.requirementId === 'REQ-HIN-053'
    ) {
      isExact = true;
    } else if (
      (normSectionId.includes('yuddha_kanda') || normReadingId.includes('yuddha_kanda') || normReadingId.includes('aditya') || (normTitle && normTitle.includes('aditya hridaya'))) &&
      link.requirementId === 'REQ-HIN-020'
    ) {
      isExact = true;
    } else if (
      (normSectionId.includes('isha') || normReadingId.includes('isha') || (normTitle && normTitle.includes('isha'))) &&
      (link.requirementId === 'REQ-HIN-028' || link.requirementId === 'REQ-HIN-029')
    ) {
      isExact = true;
    } else if (
      (normSectionId.includes('mandukya') || normReadingId.includes('mandukya') || (normTitle && normTitle.includes('mandukya'))) &&
      link.requirementId === 'REQ-HIN-032'
    ) {
      isExact = true;
    } else if (
      (normSectionId.includes('purusha_sukta') || normReadingId.includes('purusha_sukta') || (normTitle && normTitle.includes('purusha'))) &&
      link.requirementId === 'REQ-HIN-036'
    ) {
      isExact = true;
    } else if (
      (normSectionId.includes('sri_suktam') || normReadingId.includes('sri_suktam') || (normTitle && normTitle.includes('sri sukta'))) &&
      link.requirementId === 'REQ-HIN-037'
    ) {
      isExact = true;
    } else if (
      (normSectionId.includes('ganapati_suktam') || normReadingId.includes('ganapati_suktam') || (normTitle && normTitle.includes('ganapati sukta'))) &&
      link.requirementId === 'REQ-HIN-038'
    ) {
      isExact = true;
    } else if (
      (normCollectionId === 'suttas_sutras' || normReadingId === 'suttas_sutras' || normReadingId.includes('sn56.11') || (normTitle && normTitle.includes('dhammacakka'))) &&
      link.requirementId === 'REQ-BUD-008'
    ) {
      isExact = true;
    } else if (
      (normCollectionId === 'suttas_sutras' || normReadingId.includes('heart') || (normTitle && normTitle.includes('heart sutra'))) &&
      link.requirementId === 'REQ-BUD-010'
    ) {
      isExact = true;
    } else if (
      (normCollectionId === 'suttas_sutras' || normReadingId.includes('diamond') || (normTitle && normTitle.includes('diamond sutra'))) &&
      link.requirementId === 'REQ-BUD-011'
    ) {
      isExact = true;
    } else if (
      (normCollectionId === 'metta_sutta' || normReadingId === 'metta_sutta' || (normTitle && normTitle.includes('metta'))) &&
      link.requirementId === 'REQ-BUD-016'
    ) {
      isExact = true;
    } else if (
      (normCollectionId === 'mangala_sutta' || normReadingId === 'mangala_sutta' || (normTitle && normTitle.includes('mangala'))) &&
      link.requirementId === 'REQ-BUD-019'
    ) {
      isExact = true;
    } else if (
      (normCollectionId === 'chants_parittas' || normReadingId.includes('ti_sarana') || (normTitle && (normTitle.includes('refuge') || normTitle.includes('ti sarana')))) &&
      link.requirementId === 'REQ-BUD-020'
    ) {
      isExact = true;
    } else if (
      (normCollectionId === 'chants_parittas' || normReadingId.includes('ratana') || (normTitle && normTitle.includes('ratana'))) &&
      link.requirementId === 'REQ-BUD-025'
    ) {
      isExact = true;
    } else if (
      (normCollectionId === 'navkar' || normReadingId.includes('navkar') || (normTitle && normTitle.includes('navkar'))) &&
      link.requirementId === 'REQ-JAI-007'
    ) {
      isExact = true;
    } else if (
      (normCollectionId === 'bhaktamar' || normReadingId.includes('bhaktamar') || (normTitle && normTitle.includes('bhaktamar'))) &&
      link.requirementId === 'REQ-JAI-012'
    ) {
      isExact = true;
    } else if (
      (normCollectionId === 'pratikraman' || normReadingId.includes('pratikraman') || (normTitle && normTitle.includes('pratikraman'))) &&
      link.requirementId === 'REQ-JAI-023'
    ) {
      isExact = true;
    } else if (
      (normCollectionId === 'samayik' || normReadingId.includes('samayik') || (normTitle && normTitle.includes('samayik'))) &&
      link.requirementId === 'REQ-JAI-028'
    ) {
      isExact = true;
    } else if (
      (normCollectionId === 'jain_hymns' || normReadingId.includes('meri_bhavana') || (normTitle && normTitle.includes('meri bhavana'))) &&
      link.requirementId === 'REQ-JAI-033'
    ) {
      isExact = true;
    }

    // Helper to verify if linkage book or collection matches context
    const matchesBookOrCollection = (): boolean => {
      if (linkBookId) {
        return (
          normBookId === linkBookId ||
          normBookName === linkBookId ||
          normBookName.includes(linkBookId) ||
          linkBookId.includes(normBookName)
        );
      }
      if (linkCollectionId) {
        return normCollectionId === linkCollectionId;
      }
      return false;
    };

    if (isExact) {
      exactMatches.push({ linkage: link, req });
      continue;
    } else if (linkScope === 'EXACT') {
      if (linkChId !== undefined) {
        if (matchesBookOrCollection() && hasChapterNum && chapterNum === linkChId) {
          isExact = true;
        }
      } else if (linkReadingId) {
        // If link defines a specific targetReadingId, require exact title match if normReadingId is not passed
        if (normTitle && (normTitle === linkLabel || normTitle === normalize(req.requirementTitle))) {
          isExact = true;
        }
      } else if (linkCollectionId && normCollectionId === linkCollectionId && !hasChapterNum) {
        isExact = true;
      }
    }

    if (isExact) {
      exactMatches.push({ linkage: link, req });
      continue;
    }

    // 2. Check CHAPTER / SECTION match
    let isChapter = false;
    if (hasChapterNum && (linkScope === 'CHAPTER' || (linkScope === 'EXACT' && linkChId !== undefined))) {
      if (matchesBookOrCollection()) {
        if (link.targetChapterRange) {
          const [start, end] = link.targetChapterRange;
          if (chapterNum! >= start && chapterNum! <= end) {
            isChapter = true;
          }
        } else if (linkChId !== undefined && chapterNum === linkChId) {
          isChapter = true;
        }
      }
    }

    if (isChapter) {
      chapterMatches.push({ linkage: link, req });
      continue;
    }

    // 3. Check COLLECTION match
    // Only match at collection level if the user is NOT on an unmatched chapter reading!
    if (!hasChapterNum && linkCollectionId && normCollectionId === linkCollectionId) {
      collectionMatches.push({ linkage: link, req });
    }
  }

  // Resolve hierarchy: Level 1 -> Level 2 -> Level 3 -> Level 5
  if (exactMatches.length > 0) {
    const primaryReqs = exactMatches.map((m) => m.req);
    const primaryIds = new Set(primaryReqs.map((r) => r.id));
    const related = allTraditionRecordings.filter((r) => !primaryIds.has(r.id));
    return {
      matchLevel: 'EXACT',
      primaryMatches: primaryReqs,
      relatedTraditionRecordings: related,
      scopeLabel: exactMatches[0].linkage.canonicalLabel,
      hasDirectMatch: true,
      activeReadingTitle,
      totalTraditionCount,
    };
  }

  if (chapterMatches.length > 0) {
    const primaryReqs = chapterMatches.map((m) => m.req);
    const primaryIds = new Set(primaryReqs.map((r) => r.id));
    const related = allTraditionRecordings.filter((r) => !primaryIds.has(r.id));
    return {
      matchLevel: 'CHAPTER',
      primaryMatches: primaryReqs,
      relatedTraditionRecordings: related,
      scopeLabel: chapterMatches[0].linkage.canonicalLabel,
      hasDirectMatch: true,
      activeReadingTitle,
      totalTraditionCount,
    };
  }

  if (collectionMatches.length > 0) {
    const primaryReqs = collectionMatches.map((m) => m.req);
    const primaryIds = new Set(primaryReqs.map((r) => r.id));
    const related = allTraditionRecordings.filter((r) => !primaryIds.has(r.id));
    return {
      matchLevel: 'COLLECTION',
      primaryMatches: primaryReqs,
      relatedTraditionRecordings: related,
      scopeLabel: collectionMatches[0].linkage.canonicalLabel,
      hasDirectMatch: true,
      activeReadingTitle,
      totalTraditionCount,
    };
  }

  // LEVEL 5 — NO APPROVED MATCH
  return {
    matchLevel: 'NONE',
    primaryMatches: [],
    relatedTraditionRecordings: allTraditionRecordings,
    scopeLabel: activeReadingTitle,
    hasDirectMatch: false,
    message: `No approved recording currently available for this reading: ${activeReadingTitle}.`,
    activeReadingTitle,
    totalTraditionCount,
  };
}
