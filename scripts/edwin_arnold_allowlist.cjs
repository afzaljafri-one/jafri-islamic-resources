/**
 * Phase 6.3.5.5 Strict Edwin Arnold Translation Whitelist (CommonJS)
 * Coordinate-specific allowlist of independently verified Edwin Arnold translations from:
 * "The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata)"
 * Translated by Sir Edwin Arnold, M.A., K.C.I.E., C.S.I. (1832–1904)
 * First edition: London: Trübner & Co., Ludgate Hill, June 1885 / Boston: Roberts Brothers, 1885.
 *
 * JURISDICTIONAL RIGHTS BASIS:
 * - United States: Public Domain (published prior to January 1, 1929; 17 U.S.C. § 304(b)).
 * - United Kingdom & European Union: Public Domain (author died March 24, 1904; life + 70 calendar years
 *   expired January 1, 1975 under UK CDPA 1988 s.12 and EU Directive 2006/116/EC).
 * - India: Public Domain (author died March 24, 1904; life + 60 calendar years expired January 1, 1965
 *   under Indian Copyright Act, 1957 Section 22).
 * - Other Jurisdictions: Unresolved / Subject to local national copyright terms (designated UNKNOWN / PERMISSION_REQUIRED).
 *
 * HISTORICAL SOURCE AUDIT (Phase 6.3.5.5):
 * Verified against 1885 Trübner & Co. first edition (Harvard scan: songcelestialor01arnogoog).
 * Arnold translated into 5-beat unrhymed blank verse (poetry), not prose.
 *
 * 1. CHAPTER READER ALLOWLIST (EDWIN_ARNOLD_ALLOWLIST):
 * Exactly 5 coordinates (1:1, 4:38, 9:26, 17:20, 18:66) with exact 1:1 verse correspondence.
 * All other 696 verses are strictly WITHHELD.
 *
 * 2. THEMATIC PASSAGE ALLOWLIST (EDWIN_ARNOLD_THEMATIC_ALLOWLIST):
 * Explicit thematic passages with verified full coordinates/ranges and Sanskrit text:
 * - '12:13-14': Compassion (Book XII, p. 121)
 * - '16:1-3': Forgiveness (Book XVI, p. 144)
 * - '2:14': Patience (Book II, p. 12)
 * - '9:27': Gratitude (Book IX, p. 80)
 * - '17:20': Charity (Book XVII, p. 155, reuses allowlist 17:20)
 * - '4:38': Wisdom (Book IV, p. 41, reuses allowlist 4:38)
 */

const EDWIN_ARNOLD_ALLOWLIST = {
  '1:1': {
    coordinate: '1:1',
    chapter: 1,
    verse: 1,
    text: 'Ranged thus for battle on the sacred plain—\nOn Kurukshetra—say, Sanjaya! say\nWhat wrought my people, and the Pandavas?',
    translator: 'Sir Edwin Arnold, M.A., K.C.I.E., C.S.I. (1832–1904)',
    edition: 'The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata), Chapter I, p. 1 (London: Trübner & Co., June 1885)',
    sourceReferenceUrl: 'https://archive.org/details/songcelestialor01arnogoog',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain',
    rightsEvidence: 'First published London: Trübner & Co., June 1885 / Boston: Roberts Brothers, 1885. US: Public Domain (pre-1929 publication, 17 U.S.C. § 304(b)). UK/EU: Public Domain (author died March 24, 1904; life + 70 expired Jan 1, 1975 under UK CDPA 1988 s.12 and EU Directive 2006/116/EC). India: Public Domain (author died 1904; life + 60 expired Jan 1, 1965 under Indian Copyright Act 1957 Section 22). Other territories: UNKNOWN / PERMISSION_REQUIRED.',
  },
  '4:38': {
    coordinate: '4:38',
    chapter: 4,
    verse: 38,
    text: 'There is no purifier like thereto\nIn all this world, and he who seeketh it\nShall find it — being grown perfect — in himself.',
    translator: 'Sir Edwin Arnold, M.A., K.C.I.E., C.S.I. (1832–1904)',
    edition: 'The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata), Chapter IV, p. 41 (London: Trübner & Co., June 1885)',
    sourceReferenceUrl: 'https://archive.org/details/songcelestialor01arnogoog',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain',
    rightsEvidence: 'First published London: Trübner & Co., June 1885 / Boston: Roberts Brothers, 1885. US: Public Domain (pre-1929 publication, 17 U.S.C. § 304(b)). UK/EU: Public Domain (author died March 24, 1904; life + 70 expired Jan 1, 1975 under UK CDPA 1988 s.12 and EU Directive 2006/116/EC). India: Public Domain (author died 1904; life + 60 expired Jan 1, 1965 under Indian Copyright Act 1957 Section 22). Other territories: UNKNOWN / PERMISSION_REQUIRED.',
  },
  '9:26': {
    coordinate: '9:26',
    chapter: 9,
    verse: 26,
    text: 'Whoso shall offer Me in faith and love\nA leaf, a flower, a fruit, water poured forth,\nThat offering I accept, lovingly made\nWith pious will.',
    translator: 'Sir Edwin Arnold, M.A., K.C.I.E., C.S.I. (1832–1904)',
    edition: 'The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata), Chapter IX, p. 80 (London: Trübner & Co., June 1885)',
    sourceReferenceUrl: 'https://archive.org/details/songcelestialor01arnogoog',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain',
    rightsEvidence: 'First published London: Trübner & Co., June 1885 / Boston: Roberts Brothers, 1885. US: Public Domain (pre-1929 publication, 17 U.S.C. § 304(b)). UK/EU: Public Domain (author died March 24, 1904; life + 70 expired Jan 1, 1975 under UK CDPA 1988 s.12 and EU Directive 2006/116/EC). India: Public Domain (author died 1904; life + 60 expired Jan 1, 1965 under Indian Copyright Act 1957 Section 22). Other territories: UNKNOWN / PERMISSION_REQUIRED.',
  },
  '17:20': {
    coordinate: '17:20',
    chapter: 17,
    verse: 20,
    text: 'The gift lovingly given, when one shall say\n"Now must I gladly give!" when he who takes\nCan render nothing back; made in due place,\nDue time, and to a meet recipient,\nIs gift of Sattwan, fair and profitable.',
    translator: 'Sir Edwin Arnold, M.A., K.C.I.E., C.S.I. (1832–1904)',
    edition: 'The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata), Chapter XVII, p. 155 (London: Trübner & Co., June 1885)',
    sourceReferenceUrl: 'https://archive.org/details/songcelestialor01arnogoog',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain',
    rightsEvidence: 'First published London: Trübner & Co., June 1885 / Boston: Roberts Brothers, 1885. US: Public Domain (pre-1929 publication, 17 U.S.C. § 304(b)). UK/EU: Public Domain (author died March 24, 1904; life + 70 expired Jan 1, 1975 under UK CDPA 1988 s.12 and EU Directive 2006/116/EC). India: Public Domain (author died 1904; life + 60 expired Jan 1, 1965 under Indian Copyright Act 1957 Section 22). Other territories: UNKNOWN / PERMISSION_REQUIRED.',
  },
  '18:66': {
    coordinate: '18:66',
    chapter: 18,
    verse: 66,
    text: 'And let go those —\nRites and writ duties! Fly to Me alone!\nMake Me thy single refuge! I will free\nThy soul from all its sins! Be of good cheer!',
    translator: 'Sir Edwin Arnold, M.A., K.C.I.E., C.S.I. (1832–1904)',
    edition: 'The Song Celestial; or, Bhagavad-Gîtâ (from the Mahâbhârata), Chapter XVIII, p. 170 (London: Trübner & Co., June 1885)',
    sourceReferenceUrl: 'https://archive.org/details/songcelestialor01arnogoog',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain',
    rightsEvidence: 'First published London: Trübner & Co., June 1885 / Boston: Roberts Brothers, 1885. US: Public Domain (pre-1929 publication, 17 U.S.C. § 304(b)). UK/EU: Public Domain (author died March 24, 1904; life + 70 expired Jan 1, 1975 under UK CDPA 1988 s.12 and EU Directive 2006/116/EC). India: Public Domain (author died 1904; life + 60 expired Jan 1, 1965 under Indian Copyright Act 1957 Section 22). Other territories: UNKNOWN / PERMISSION_REQUIRED.',
  },
};

const EDWIN_ARNOLD_THEMATIC_ALLOWLIST = {
  '12:13-14': {
    passageId: 'theme_hin_compassion',
    coordinateRange: '12:13-14',
    displayCoordinates: 'Bhagavad Gita 12:13–14',
    chapter: 12,
    verseStart: 13,
    verseEnd: 14,
    sanskritPassage: 'अद्वेष्टा सर्वभूतानां मैत्रः करुण एव च । निर्ममो निरहङ्कारः समदुःखसुखः क्षमी ॥ सन्तुष्टः सततं योगी यतात्मा दृढनिश्चयः । मय्यर्पितमनोबुद्धिर्यो मद्भक्तः स मे प्रियः ॥',
    text: 'Who hateth nought of all which lives, living himself benign, compassionate, from arrogance exempt, exempt from love of self, unchangeable by good or ill; patient, contented, firm in faith, mastering himself, true to his word, seeking Me, heart and soul; vowed unto Me, — that man I love!',
    translator: 'Sir Edwin Arnold, M.A., K.C.I.E., C.S.I. (1832–1904)',
    edition: 'The Song Celestial (London: Trübner & Co., 1885), Book the Twelfth, p. 121',
    sourceReferenceUrl: 'https://archive.org/details/songcelestialor01arnogoog',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain',
    rightsEvidence: 'First published London: Trübner & Co., June 1885. US: Public Domain (17 U.S.C. § 304(b)). UK/EU: Public Domain (author died 1904; life + 70 expired 1975). India: Public Domain (Indian Copyright Act 1957 s.22, life + 60 expired 1965). Other territories: UNKNOWN / PERMISSION_REQUIRED.',
  },
  '16:1-3': {
    passageId: 'theme_hin_forgiveness',
    coordinateRange: '16:1-3',
    displayCoordinates: 'Bhagavad Gita 16:1–3',
    chapter: 16,
    verseStart: 1,
    verseEnd: 3,
    sanskritPassage: 'अभयं सत्त्वसंशुद्धिर्ज्ञानयोगव्यवस्थितिः । दानं दमश्च यज्ञश्च स्वाध्यायस्तप आर्जवम् ॥ अहिंसा सत्यमक्रोधस्त्यागः शान्तिरपैशुनम् । दया भूतेष्वलोलुप्त्वं मार्दवं ह्रीरचापलम् ॥ तेजः क्षमा धृतिः शौचमद्रोहो नातिमानिता । भवन्ति सम्पदं दैवीमभिजातस्य भारत ॥',
    text: 'Fearlessness, singleness of soul, the will always to strive for wisdom; opened hand and governed appetites; and piety, and love of lonely study; humbleness, uprightness, heed to injure nought which lives, truthfulness, slowness unto wrath, a mind that lightly letteth go what others prize; and equanimity, and charity which spieth no man\'s faults; and tenderness towards all that suffer; a contented heart, fluttered by no desires; a bearing mild, modest, and grave, with manhood nobly mixed, with patience, fortitude, and purity; an unrevengeful spirit, never given to rate itself too high; — such be the signs, O Indian Prince! of him whose feet are set on that fair path which leads to heavenly birth!',
    translator: 'Sir Edwin Arnold, M.A., K.C.I.E., C.S.I. (1832–1904)',
    edition: 'The Song Celestial (London: Trübner & Co., 1885), Book the Sixteenth, p. 144',
    sourceReferenceUrl: 'https://archive.org/details/songcelestialor01arnogoog',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain',
    rightsEvidence: 'First published London: Trübner & Co., June 1885. US: Public Domain (17 U.S.C. § 304(b)). UK/EU: Public Domain (author died 1904; life + 70 expired 1975). India: Public Domain (Indian Copyright Act 1957 s.22, life + 60 expired 1965). Other territories: UNKNOWN / PERMISSION_REQUIRED.',
  },
  '2:14': {
    passageId: 'theme_hin_patience',
    coordinateRange: '2:14',
    displayCoordinates: 'Bhagavad Gita 2:14',
    chapter: 2,
    verseStart: 14,
    verseEnd: 14,
    sanskritPassage: 'मात्रास्पर्शास्तु कौन्तेय शीतोष्णसुखदुःखदाः । आगमापायिनोऽनित्यास्तांस्तितिक्षस्व भारत ॥',
    text: 'This that irks — thy sense-life, thrilling to the elements — bringing thee heat and cold, sorrows and joys, \'tis brief and mutable! Bear with it, Prince! As the wise bear.',
    translator: 'Sir Edwin Arnold, M.A., K.C.I.E., C.S.I. (1832–1904)',
    edition: 'The Song Celestial (London: Trübner & Co., 1885), Book the Second, p. 12',
    sourceReferenceUrl: 'https://archive.org/details/songcelestialor01arnogoog',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain',
    rightsEvidence: 'First published London: Trübner & Co., June 1885. US: Public Domain (17 U.S.C. § 304(b)). UK/EU: Public Domain (author died 1904; life + 70 expired 1975). India: Public Domain (Indian Copyright Act 1957 s.22, life + 60 expired 1965). Other territories: UNKNOWN / PERMISSION_REQUIRED.',
  },
  '9:27': {
    passageId: 'theme_hin_gratitude',
    coordinateRange: '9:27',
    displayCoordinates: 'Bhagavad Gita 9:27',
    chapter: 9,
    verseStart: 27,
    verseEnd: 27,
    sanskritPassage: 'यत्करोषि यदश्नासि यज्जुहोषि ददासि यत् । यत्तपस्यसि कौन्तेय तत्कुरुष्व मदर्पणम् ॥',
    text: 'Whate\'er thou doest, Prince! Eating or sacrificing, giving gifts, praying or fasting, let it all be done for Me, as Mine.',
    translator: 'Sir Edwin Arnold, M.A., K.C.I.E., C.S.I. (1832–1904)',
    edition: 'The Song Celestial (London: Trübner & Co., 1885), Book the Ninth, p. 80',
    sourceReferenceUrl: 'https://archive.org/details/songcelestialor01arnogoog',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain',
    rightsEvidence: 'First published London: Trübner & Co., June 1885. US: Public Domain (17 U.S.C. § 304(b)). UK/EU: Public Domain (author died 1904; life + 70 expired 1975). India: Public Domain (Indian Copyright Act 1957 s.22, life + 60 expired 1965). Other territories: UNKNOWN / PERMISSION_REQUIRED.',
  },
  '17:20': {
    passageId: 'theme_hin_charity',
    coordinateRange: '17:20',
    displayCoordinates: 'Bhagavad Gita 17:20',
    chapter: 17,
    verseStart: 20,
    verseEnd: 20,
    sanskritPassage: 'दातव्यमिति यद्दानं दीयतेऽनुपकारिणे । देशे काले च पात्रे च तद्दानं सात्त्विकं स्मृतम् ॥',
    text: 'The gift lovingly given, when one shall say "Now must I gladly give!" when he who takes can render nothing back; made in due place, due time, and to a meet recipient, is gift of Sattwan, fair and profitable.',
    translator: 'Sir Edwin Arnold, M.A., K.C.I.E., C.S.I. (1832–1904)',
    edition: 'The Song Celestial (London: Trübner & Co., 1885), Book the Seventeenth, p. 155',
    sourceReferenceUrl: 'https://archive.org/details/songcelestialor01arnogoog',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain',
    rightsEvidence: 'First published London: Trübner & Co., June 1885. US: Public Domain (17 U.S.C. § 304(b)). UK/EU: Public Domain (author died 1904; life + 70 expired 1975). India: Public Domain (Indian Copyright Act 1957 s.22, life + 60 expired 1965). Other territories: UNKNOWN / PERMISSION_REQUIRED.',
  },
  '4:38': {
    passageId: 'theme_hin_wisdom',
    coordinateRange: '4:38',
    displayCoordinates: 'Bhagavad Gita 4:38',
    chapter: 4,
    verseStart: 38,
    verseEnd: 38,
    sanskritPassage: 'न हि ज्ञानेन सदृशं पवित्रमिह विद्यते । तत्स्वयं योगसंसिद्धः कालेनात्मनि विन्दति ॥',
    text: 'There is no purifier like thereto in all this world, and he who seeketh it shall find it — being grown perfect — in himself.',
    translator: 'Sir Edwin Arnold, M.A., K.C.I.E., C.S.I. (1832–1904)',
    edition: 'The Song Celestial (London: Trübner & Co., 1885), Book the Fourth, p. 41',
    sourceReferenceUrl: 'https://archive.org/details/songcelestialor01arnogoog',
    rightsStatus: 'VERIFIED',
    exactLicenceIdentifier: 'Public Domain',
    rightsEvidence: 'First published London: Trübner & Co., June 1885. US: Public Domain (17 U.S.C. § 304(b)). UK/EU: Public Domain (author died 1904; life + 70 expired 1975). India: Public Domain (Indian Copyright Act 1957 s.22, life + 60 expired 1965). Other territories: UNKNOWN / PERMISSION_REQUIRED.',
  },
};

const WITHHELD_GITA_COMMENTARY_EN = '[Translation withheld pending documented software redistribution permission]';
const WITHHELD_GITA_COMMENTARY_HI = '[अनुवाद का वितरण अनुमति दस्तावेज़ीकरण तक स्थगित है]';
const WITHHELD_GITA_BHASHYA = '[Commentary translation withheld pending documented software redistribution permission]';

module.exports = {
  EDWIN_ARNOLD_ALLOWLIST,
  EDWIN_ARNOLD_THEMATIC_ALLOWLIST,
  WITHHELD_GITA_COMMENTARY_EN,
  WITHHELD_GITA_COMMENTARY_HI,
  WITHHELD_GITA_BHASHYA,
};
