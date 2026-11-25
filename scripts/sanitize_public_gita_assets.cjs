/**
 * Phase 6.3.5.3 Public Gita Assets Purge Script
 * Sanitizes all 18 Bhagavad Gita chapter JSON files in public/data/gita/
 * Replaces unverified modern commentary translations (Sivananda, Gambhirananda,
 * Purohit Swami, Ramsukhdas Hindi, and Shankara Bhashya modern English) with
 * explicit withholding notices, while preserving canonical Sanskrit and IAST.
 * English translations are strictly gated by the coordinate-specific EDWIN_ARNOLD_ALLOWLIST.
 */

const fs = require('fs');
const path = require('path');
const {
  EDWIN_ARNOLD_ALLOWLIST,
  WITHHELD_GITA_COMMENTARY_EN,
  WITHHELD_GITA_COMMENTARY_HI,
  WITHHELD_GITA_BHASHYA,
} = require('./edwin_arnold_allowlist.cjs');

const repoRoot = path.resolve(__dirname, '..');
const gitaDataDir = path.join(repoRoot, 'public/data/gita');

if (!fs.existsSync(gitaDataDir)) {
  console.error('[ERROR] Directory public/data/gita not found.');
  process.exit(1);
}

function sanitizeChapterFile(filePath) {
  const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  if (!Array.isArray(content)) {
    throw new Error(`File ${filePath} does not contain an array.`);
  }

  const sanitized = content.map((v) => {
    const key = `${v.chapter}:${v.verse}`;
    const approved = EDWIN_ARNOLD_ALLOWLIST[key];

    const verseObj = {
      chapter: Number(v.chapter),
      verse: Number(v.verse),
      slok: v.slok || '',
      transliteration: v.transliteration || '',
    };

    if (approved) {
      verseObj.translationEn = approved.text;
      verseObj.edwinArnoldEn = approved.text;
    }

    // Always withhold unverified modern proprietary commentaries
    verseObj.sivanandaEn = WITHHELD_GITA_COMMENTARY_EN;
    verseObj.gambhiranandaEn = WITHHELD_GITA_COMMENTARY_EN;
    verseObj.purohitEn = WITHHELD_GITA_COMMENTARY_EN;
    verseObj.ramsukhdasHi = WITHHELD_GITA_COMMENTARY_HI;
    verseObj.shankaraBhashya = WITHHELD_GITA_BHASHYA;

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
