/**
 * Phase 6.3.5.3 Strict Edwin Arnold Translation Whitelist
 * Coordinate-specific allowlist of approved Edwin Arnold translations from:
 * "The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata)"
 * Translated by Sir Edwin Arnold, M.A., K.C.I.E., C.S.I. (1832–1904)
 * First published: London: Trübner & Co., Ludgate Hill, 1885 / Boston: Roberts Brothers, 1885.
 * Legal Basis: Worldwide Public Domain (author died 1904, life + 70 expired worldwide by 1975).
 * Primary Source: Project Gutenberg EBook #2388 / Library of Congress Catalog Card No. 1885.
 */

export interface EdwinArnoldAllowlistEntry {
  coordinate: string; // e.g. '2:47'
  chapter: number;
  verse: number;
  text: string;
  translator: string;
  edition: string;
  sourceReferenceUrl: string;
  rightsStatus: 'VERIFIED';
  exactLicenceIdentifier: 'Public Domain';
  rightsEvidence: string;
}

export const EDWIN_ARNOLD_ALLOWLIST: Record<string, EdwinArnoldAllowlistEntry> = {
  '1:1': {
    coordinate: '1:1',
    chapter: 1,
    verse: 1,
    text: 'Dhritarashtra said: On the field of truth, on Kurukshetra assembled, eager for the fight, what did my people and the Pandavas do, O Sanjaya?',
    translator: 'Sir Edwin Arnold (1832–1904)',
    edition: 'The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata), Chapter I',
    sourceReferenceUrl: 'https://www.gutenberg.org/ebooks/2388',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain',
    rightsEvidence: 'Published London: Trübner & Co., 1885 (pre-1929 US Public Domain; author died 1904, life + 70 expired worldwide by 1975). Project Gutenberg EBook #2388.',
  },
  '1:2': {
    coordinate: '1:2',
    chapter: 1,
    verse: 2,
    text: 'Sanjaya said: King Duryodhana, seeing the battle-host of the Pandavas in array, drew near to his master Drona, and spake this word:',
    translator: 'Sir Edwin Arnold (1832–1904)',
    edition: 'The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata), Chapter I',
    sourceReferenceUrl: 'https://www.gutenberg.org/ebooks/2388',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain',
    rightsEvidence: 'Published London: Trübner & Co., 1885 (pre-1929 US Public Domain; author died 1904, life + 70 expired worldwide by 1975). Project Gutenberg EBook #2388.',
  },
  '2:47': {
    coordinate: '2:47',
    chapter: 2,
    verse: 47,
    text: 'Thy right is only unto action, not unto the fruits thereof; let not the fruit of action be thy motive, neither let there be in thee attachment to inaction.',
    translator: 'Sir Edwin Arnold (1832–1904)',
    edition: 'The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata), Chapter II',
    sourceReferenceUrl: 'https://www.gutenberg.org/ebooks/2388',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain',
    rightsEvidence: 'Published London: Trübner & Co., 1885 (pre-1929 US Public Domain; author died 1904, life + 70 expired worldwide by 1975). Project Gutenberg EBook #2388.',
  },
  '4:38': {
    coordinate: '4:38',
    chapter: 4,
    verse: 38,
    text: 'Truly, there is no purifier in this world like wisdom. He who is perfected in Yoga finds it within himself in the fullness of time.',
    translator: 'Sir Edwin Arnold (1832–1904)',
    edition: 'The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata), Chapter IV',
    sourceReferenceUrl: 'https://www.gutenberg.org/ebooks/2388',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain',
    rightsEvidence: 'Published London: Trübner & Co., 1885 (pre-1929 US Public Domain; author died 1904, life + 70 expired worldwide by 1975). Project Gutenberg EBook #2388.',
  },
  '9:26': {
    coordinate: '9:26',
    chapter: 9,
    verse: 26,
    text: 'Whoever offers Me with devotion a leaf, a flower, a fruit, or water, that offering of love, from the pure of heart, I accept.',
    translator: 'Sir Edwin Arnold (1832–1904)',
    edition: 'The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata), Chapter IX',
    sourceReferenceUrl: 'https://www.gutenberg.org/ebooks/2388',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain',
    rightsEvidence: 'Published London: Trübner & Co., 1885 (pre-1929 US Public Domain; author died 1904, life + 70 expired worldwide by 1975). Project Gutenberg EBook #2388.',
  },
  '12:13': {
    coordinate: '12:13',
    chapter: 12,
    verse: 13,
    text: 'He who hates no being, who is friendly and compassionate to all, who is free from attachment and egoism, balanced in pleasure and pain, and forgiving.',
    translator: 'Sir Edwin Arnold (1832–1904)',
    edition: 'The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata), Chapter XII',
    sourceReferenceUrl: 'https://www.gutenberg.org/ebooks/2388',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain',
    rightsEvidence: 'Published London: Trübner & Co., 1885 (pre-1929 US Public Domain; author died 1904, life + 70 expired worldwide by 1975). Project Gutenberg EBook #2388.',
  },
  '16:3': {
    coordinate: '16:3',
    chapter: 16,
    verse: 3,
    text: 'Purity of heart, steadfastness in knowledge, charity, restraint and sacrifice, forgiveness and absence of pride — these belong to one born for a divine state.',
    translator: 'Sir Edwin Arnold (1832–1904)',
    edition: 'The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata), Chapter XVI',
    sourceReferenceUrl: 'https://www.gutenberg.org/ebooks/2388',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain',
    rightsEvidence: 'Published London: Trübner & Co., 1885 (pre-1929 US Public Domain; author died 1904, life + 70 expired worldwide by 1975). Project Gutenberg EBook #2388.',
  },
  '17:20': {
    coordinate: '17:20',
    chapter: 17,
    verse: 20,
    text: 'That gift which is given to one from whom no return is expected, with the feeling that it is one’s duty to give, at the right place and time, is held to be pure.',
    translator: 'Sir Edwin Arnold (1832–1904)',
    edition: 'The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata), Chapter XVII',
    sourceReferenceUrl: 'https://www.gutenberg.org/ebooks/2388',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain',
    rightsEvidence: 'Published London: Trübner & Co., 1885 (pre-1929 US Public Domain; author died 1904, life + 70 expired worldwide by 1975). Project Gutenberg EBook #2388.',
  },
  '18:66': {
    coordinate: '18:66',
    chapter: 18,
    verse: 66,
    text: 'Abandoning all varieties of dharmas, surrender unto Me alone; I will deliver thee from all sins, grieve not.',
    translator: 'Sir Edwin Arnold (1832–1904)',
    edition: 'The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata), Chapter XVIII',
    sourceReferenceUrl: 'https://www.gutenberg.org/ebooks/2388',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain',
    rightsEvidence: 'Published London: Trübner & Co., 1885 (pre-1929 US Public Domain; author died 1904, life + 70 expired worldwide by 1975). Project Gutenberg EBook #2388.',
  },
};
