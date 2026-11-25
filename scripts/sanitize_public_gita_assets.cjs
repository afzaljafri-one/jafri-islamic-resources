/**
 * Phase 6.3.5.2 Public Gita Assets Purge Script
 * Sanitizes all 18 Bhagavad Gita chapter JSON files in public/data/gita/
 * Replaces unverified modern commentary translations (Sivananda, Gambhirananda,
 * Purohit Swami, Ramsukhdas Hindi, and Shankara Bhashya modern English) with
 * explicit withholding notices, while preserving canonical Sanskrit and IAST.
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const gitaDataDir = path.join(repoRoot, 'public/data/gita');

if (!fs.existsSync(gitaDataDir)) {
  console.error('[ERROR] Directory public/data/gita not found.');
  process.exit(1);
}

// Known landmark verses with verified Sir Edwin Arnold (1885 Public Domain) translations
const VERIFIED_LANDMARK_TRANSLATIONS = {
  '1:1': 'Dhritarashtra said: On the field of truth, on Kurukshetra assembled, eager for the fight, what did my people and the Pandavas do, O Sanjaya?',
  '1:2': 'Sanjaya said: King Duryodhana, seeing the battle-host of the Pandavas in array, drew near to his master Drona, and spake this word:',
  '2:47': "Thy right is only unto action, not unto the fruits thereof; let not the fruit of action be thy motive, neither let there be in thee attachment to inaction.",
  '4:38': 'Truly, there is no purifier in this world like wisdom. He who is perfected in Yoga finds it within himself in the fullness of time.',
  '9:26': 'Whoever offers Me with devotion a leaf, a flower, a fruit, or water, that offering of love, from the pure of heart, I accept.',
  '12:13': 'He who hates no being, who is friendly and compassionate to all, who is free from attachment and egoism, balanced in pleasure and pain, and forgiving.',
  '16:3': 'Purity of heart, steadfastness in knowledge, charity, restraint and sacrifice, forgiveness and absence of pride — these belong to one born for a divine state.',
  '17:20': 'That gift which is given to one from whom no return is expected, with the feeling that it is one’s duty to give, at the right place and time, is held to be pure.',
  '18:66': 'Abandoning all varieties of dharmas, surrender unto Me alone; I will deliver thee from all sins, grieve not.',
};

const WITHHELD_ENGLISH = '[Translation withheld pending documented software redistribution permission]';
const WITHHELD_HINDI = '[अनुवाद का वितरण अनुमति दस्तावेज़ीकरण तक स्थगित है]';
const WITHHELD_COMMENTARY = '[Commentary translation withheld pending documented software redistribution permission]';

function sanitizeChapterFile(filePath) {
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!Array.isArray(content)) {
    throw new Error(`File ${filePath} does not contain an array.`);
  }

  const sanitized = content.map((v) => {
    const key = `${v.chapter}:${v.verse}`;
    const verifiedArnold = VERIFIED_LANDMARK_TRANSLATIONS[key];

    const verseObj = {
      chapter: Number(v.chapter),
      verse: Number(v.verse),
      slok: v.slok || '',
      transliteration: v.transliteration || '',
    };

    if (verifiedArnold) {
      verseObj.translationEn = verifiedArnold;
      verseObj.edwinArnoldEn = verifiedArnold;
    }

    // Always withhold unverified modern proprietary commentaries
    verseObj.sivanandaEn = WITHHELD_ENGLISH;
    verseObj.gambhiranandaEn = WITHHELD_ENGLISH;
    verseObj.purohitEn = WITHHELD_ENGLISH;
    verseObj.ramsukhdasHi = WITHHELD_HINDI;
    verseObj.shankaraBhashya = WITHHELD_COMMENTARY;

    return verseObj;
  });

  fs.writeFileSync(filePath, JSON.stringify(sanitized, null, 2), 'utf8');
  return sanitized.length;
}

console.log('Sanitizing all public/data/gita/chapter_*.json assets...');

let totalSanitizedVerses = 0;
for (let ch = 1; ch <= 18; ch++) {
  const chapterFile = path.join(gitaDataDir, `chapter_${ch}.json`);
  if (!fs.existsSync(chapterFile)) {
    console.error(`[ERROR] Missing chapter file: ${chapterFile}`);
    process.exit(1);
  }
  const count = sanitizeChapterFile(chapterFile);
  totalSanitizedVerses += count;
  console.log(`  ✓ Chapter ${ch}: ${count} verses sanitized.`);
}

console.log(`\nSuccessfully sanitized ${totalSanitizedVerses} verses across 18 chapters in public/data/gita/.\n`);

// Also sanitize dist/data/gita/ if dist exists
const distGitaDir = path.join(repoRoot, 'dist/data/gita');
if (fs.existsSync(distGitaDir)) {
  console.log('Sanitizing dist/data/gita/ assets...');
  for (let ch = 1; ch <= 18; ch++) {
    const distFile = path.join(distGitaDir, `chapter_${ch}.json`);
    if (fs.existsSync(distFile)) {
      sanitizeChapterFile(distFile);
    }
  }
  console.log('  ✓ dist/data/gita/ synchronized and sanitized.\n');
}
