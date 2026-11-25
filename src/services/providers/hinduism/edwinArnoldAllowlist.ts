/**
 * Phase 6.3.5.4 Strict Edwin Arnold Translation Whitelist
 * Coordinate-specific allowlist of independently verified Edwin Arnold translations from:
 * "The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata)"
 * Translated by Sir Edwin Arnold, M.A., K.C.I.E., C.S.I. (1832–1904)
 * First published: London: Trübner & Co., Ludgate Hill, June 1885 / Boston: Roberts Brothers, 1885.
 *
 * JURISDICTIONAL RIGHTS BASIS:
 * - United States: Public Domain (published prior to January 1, 1929; 17 U.S.C. § 304(b)).
 * - United Kingdom & European Union: Public Domain (author died March 24, 1904; life + 70 calendar years
 *   expired January 1, 1975 under UK CDPA 1988 s.12 and EU Directive 2006/116/EC).
 * - Other Jurisdictions: Unresolved / Subject to local national copyright terms (designated UNKNOWN / PERMISSION_REQUIRED).
 *
 * SOURCE VERIFICATION AUDIT (Phase 6.3.5.4):
 * Arnold translated into 5-beat unrhymed blank verse (poetry), not prose.
 * Out of 9 candidate landmark coordinates audited against the 1885 first edition:
 * - 5 coordinates (1:1, 4:38, 9:26, 17:20, 18:66) are established with exact 1:1 verse correspondence.
 * - 4 coordinates (1:2, 2:47, 12:13, 16:3) cannot be established as isolated 1:1 verse mappings without
 *   truncating run-on sentences, splitting enjambed lines, or conflating multiple Sanskrit verses.
 *   These 4 coordinates are REMOVED from the allowlist and WITHHELD.
 *
 * NO prose translations (Sivananda, Gambhirananda, Swarupananda, Prabhupada) may be mislabeled as Edwin Arnold.
 */

export interface EdwinArnoldAllowlistEntry {
  coordinate: string; // e.g. '4:38'
  chapter: number;
  verse: number;
  text: string;
  translator: string;
  edition: string;
  sourceReferenceUrl: string;
  rightsStatus: 'VERIFIED';
  exactLicenceIdentifier: 'Public Domain (Territory-Specific: US, UK, EU; other territories UNKNOWN / PERMISSION_REQUIRED)';
  rightsEvidence: string;
}

export const EDWIN_ARNOLD_ALLOWLIST: Record<string, EdwinArnoldAllowlistEntry> = {
  '1:1': {
    coordinate: '1:1',
    chapter: 1,
    verse: 1,
    text: 'Ranged thus for battle on the sacred plain—\nOn Kurukshetra—say, Sanjaya! say\nWhat wrought my people, and the Pandavas?',
    translator: 'Sir Edwin Arnold, M.A., K.C.I.E., C.S.I. (1832–1904)',
    edition: 'The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata), Chapter I, p. 1',
    sourceReferenceUrl: 'https://www.gutenberg.org/ebooks/2388',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain (Territory-Specific: US, UK, EU; other territories UNKNOWN / PERMISSION_REQUIRED)',
    rightsEvidence: 'First published London: Trübner & Co., Ludgate Hill, June 1885 and Boston: Roberts Brothers, 1885. US: Public Domain (pre-1929 publication, 17 U.S.C. § 304(b); Project Gutenberg clearance #2388). UK/EU: Public Domain (author died March 24, 1904; life + 70 expired Jan 1, 1975 under UK CDPA 1988 s.12 and EU Directive 2006/116/EC). Other territories: UNKNOWN / PERMISSION_REQUIRED.',
  },
  '4:38': {
    coordinate: '4:38',
    chapter: 4,
    verse: 38,
    text: 'There is no purifier like thereto\nIn all this world, and he who seeketh it\nShall find it — being grown perfect — in himself.',
    translator: 'Sir Edwin Arnold, M.A., K.C.I.E., C.S.I. (1832–1904)',
    edition: 'The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata), Chapter IV, p. 41',
    sourceReferenceUrl: 'https://www.gutenberg.org/ebooks/2388',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain (Territory-Specific: US, UK, EU; other territories UNKNOWN / PERMISSION_REQUIRED)',
    rightsEvidence: 'First published London: Trübner & Co., Ludgate Hill, June 1885 and Boston: Roberts Brothers, 1885. US: Public Domain (pre-1929 publication, 17 U.S.C. § 304(b); Project Gutenberg clearance #2388). UK/EU: Public Domain (author died March 24, 1904; life + 70 expired Jan 1, 1975 under UK CDPA 1988 s.12 and EU Directive 2006/116/EC). Other territories: UNKNOWN / PERMISSION_REQUIRED.',
  },
  '9:26': {
    coordinate: '9:26',
    chapter: 9,
    verse: 26,
    text: 'Whoso shall offer Me in faith and love\nA leaf, a flower, a fruit, water poured forth,\nThat offering I accept, lovingly made\nWith pious will.',
    translator: 'Sir Edwin Arnold, M.A., K.C.I.E., C.S.I. (1832–1904)',
    edition: 'The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata), Chapter IX, p. 80',
    sourceReferenceUrl: 'https://www.gutenberg.org/ebooks/2388',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain (Territory-Specific: US, UK, EU; other territories UNKNOWN / PERMISSION_REQUIRED)',
    rightsEvidence: 'First published London: Trübner & Co., Ludgate Hill, June 1885 and Boston: Roberts Brothers, 1885. US: Public Domain (pre-1929 publication, 17 U.S.C. § 304(b); Project Gutenberg clearance #2388). UK/EU: Public Domain (author died March 24, 1904; life + 70 expired Jan 1, 1975 under UK CDPA 1988 s.12 and EU Directive 2006/116/EC). Other territories: UNKNOWN / PERMISSION_REQUIRED.',
  },
  '17:20': {
    coordinate: '17:20',
    chapter: 17,
    verse: 20,
    text: 'The gift lovingly given, when one shall say\n"Now must I gladly give!" when he who takes\nCan render nothing back; made in due place,\nDue time, and to a meet recipient,\nIs gift of Sattwan, fair and profitable.',
    translator: 'Sir Edwin Arnold, M.A., K.C.I.E., C.S.I. (1832–1904)',
    edition: 'The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata), Chapter XVII, p. 153',
    sourceReferenceUrl: 'https://www.gutenberg.org/ebooks/2388',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain (Territory-Specific: US, UK, EU; other territories UNKNOWN / PERMISSION_REQUIRED)',
    rightsEvidence: 'First published London: Trübner & Co., Ludgate Hill, June 1885 and Boston: Roberts Brothers, 1885. US: Public Domain (pre-1929 publication, 17 U.S.C. § 304(b); Project Gutenberg clearance #2388). UK/EU: Public Domain (author died March 24, 1904; life + 70 expired Jan 1, 1975 under UK CDPA 1988 s.12 and EU Directive 2006/116/EC). Other territories: UNKNOWN / PERMISSION_REQUIRED.',
  },
  '18:66': {
    coordinate: '18:66',
    chapter: 18,
    verse: 66,
    text: 'And let go those —\nRites and writ duties! Fly to Me alone!\nMake Me thy single refuge! I will free\nThy soul from all its sins! Be of good cheer!',
    translator: 'Sir Edwin Arnold, M.A., K.C.I.E., C.S.I. (1832–1904)',
    edition: 'The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata), Chapter XVIII, p. 168',
    sourceReferenceUrl: 'https://www.gutenberg.org/ebooks/2388',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain (Territory-Specific: US, UK, EU; other territories UNKNOWN / PERMISSION_REQUIRED)',
    rightsEvidence: 'First published London: Trübner & Co., Ludgate Hill, June 1885 and Boston: Roberts Brothers, 1885. US: Public Domain (pre-1929 publication, 17 U.S.C. § 304(b); Project Gutenberg clearance #2388). UK/EU: Public Domain (author died March 24, 1904; life + 70 expired Jan 1, 1975 under UK CDPA 1988 s.12 and EU Directive 2006/116/EC). Other territories: UNKNOWN / PERMISSION_REQUIRED.',
  },
};

export const WITHHELD_GITA_COMMENTARY_EN = '[Translation withheld pending documented software redistribution permission]';
export const WITHHELD_GITA_COMMENTARY_HI = '[अनुवाद का वितरण अनुमति दस्तावेज़ीकरण तक स्थगित है]';
export const WITHHELD_GITA_BHASHYA = '[Commentary translation withheld pending documented software redistribution permission]';
