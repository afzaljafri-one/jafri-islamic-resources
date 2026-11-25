/**
 * Phase 6.3.5.2 Comprehensive Production Asset Rights Scanner
 * Recursively scans all distributed assets in dist/ (JS bundles, JSON files, HTML, text)
 * Strictly verifies zero restricted translations (Sahih International, Allama Jawadi,
 * Swami Sivananda, Swami Gambhirananda, Shri Purohit Swami, Swami Ramsukhdas,
 * and modern Shankara commentary translations).
 * Validates the structure and withholding state of every dist/data/gita/chapter_*.json asset.
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const distDir = path.join(repoRoot, 'dist');

if (!fs.existsSync(distDir)) {
  console.error('[ERROR] dist directory not found. Run "npx vite build" first.');
  process.exit(1);
}

const GITA_CHAPTER_VERSE_COUNTS = {
  1: 47, 2: 72, 3: 43, 4: 42, 5: 29, 6: 47,
  7: 30, 8: 28, 9: 34, 10: 42, 11: 55, 12: 20,
  13: 35, 14: 27, 15: 20, 16: 24, 17: 28, 18: 78
};

const FORBIDDEN_RESTRICTED_SNIPPETS = [
  // 1. Sahih International Qur'an Translation (Ayah 2:255 & foundational)
  'the Ever-Living, the Self-Sustaining of all existence',
  'Neither drowsiness overtakes Him nor sleep',
  'and they encompass not a thing of His knowledge except for what He wills',
  'His Kursi extends over the heavens and the earth',

  // 2. Allama Syed Zeeshan Haider Jawadi Urdu Translation (Foundational Ayahs)
  'سب تعریفیں اللہ کے لیے ہیں جو تمام جہانوں کا رب ہے',
  'اے ایمان والو! صبر اور نماز سے مدد لو',
  'جو لوگ اپنا مال اللہ کی راہ میں خرچ کرتے ہیں ان کی مثال اس دانے جیسی ہے',
  'وہ جسے چاہے حکمت عطا کرتا ہے، اور جسے حکمت مل گئی',
  'جو خوشحالی اور تنگ دستی میں خرچ کرتے ہیں اور غصہ پینے والے',
  'اور جب تمہارے رب نے آگاہ کر دیا کہ اگر تم شکر کرو گے تو میں تمہیں اور زیادہ دوں گا',
  'اور ہم نے آپ کو تمام جہانوں کے لیے رحمت بنا کر بھیجا ہے',
  'اور رحمان کے بندے وہ ہیں جو زمین پر عاجزی سے چلتے ہیں',
  'کہہ دیجیے کہ وہ اللہ ایک ہے',

  // 3. Swami Sivananda Modern Commentary & Translation
  'What did my people and the sons of Pandu do when they had assembled',
  'The Blessed Lord said: Time I am, the great destroyer of the worlds',
  'Duryodhana then approached his teacher (Drona)',
  'Behold, O Teacher! this mighty army of the sons of Pandu',

  // 4. Swami Gambhirananda Modern Translation
  "what did my sons (and others) and Pandu's sons (and others) actually do",
  'Kuruksetra (Field of the Kurus)',
  'seeing the army of the Pandavas in battle array, King Duryodhana approached',

  // 5. Shri Purohit Swami Modern Translation
  'What happened on the sacred battlefield of Kurukshetra, when my people gathered',
  'The Prince Duryodhana, when he saw the army of the Pandavas paraded',
  'Revered Father! Behold this mighty host of the Pandavas',

  // 6. Swami Ramsukhdas Modern Hindi Commentary / Translation
  'धर्मभूमि कुरुक्षेत्र में युद्ध की इच्छा से इकट्ठे हुए मेरेे और पाण्डु के पुत्रों ने भी क्या किया',
  'वज्रव्यूह-से खड़ी हुई पाण्डव-सेना को देखकर राजा दुर्योधन',

  // 7. Unverified Modern English Shankara Bhashya Translations
  'Sri Sankaracharya did not comment on this sloka',
];

// Helper: collect files recursively
function getAllFiles(dir, exts = ['.js', '.json', '.html', '.txt', '.map']) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, exts));
    } else {
      const ext = path.extname(file).toLowerCase();
      if (exts.includes(ext)) {
        results.push(fullPath);
      }
    }
  }
  return results;
}

console.log('================================================================================');
console.log('PHASE 6.3.5.2 RECURSIVE PRODUCTION ASSET RIGHTS SCANNER');
console.log(`Scan Target: ${distDir}`);
console.log('================================================================================\n');

const allDistFiles = getAllFiles(distDir);
console.log(`Found ${allDistFiles.length} distributed files to inspect across dist/.\n`);

let totalViolations = 0;
const scannedStats = {
  jsFiles: 0,
  jsonFiles: 0,
  htmlFiles: 0,
  otherFiles: 0,
  totalBytes: 0,
};

// 1. Recursive string scanner across every text / code / data file
for (const filePath of allDistFiles) {
  const relPath = path.relative(distDir, filePath);
  const ext = path.extname(filePath).toLowerCase();
  const content = fs.readFileSync(filePath, 'utf8');
  scannedStats.totalBytes += content.length;

  if (ext === '.js') scannedStats.jsFiles++;
  else if (ext === '.json') scannedStats.jsonFiles++;
  else if (ext === '.html') scannedStats.htmlFiles++;
  else scannedStats.otherFiles++;

  for (const snippet of FORBIDDEN_RESTRICTED_SNIPPETS) {
    if (content.includes(snippet)) {
      console.error(`[FAIL] File dist/${relPath} contains restricted snippet: "${snippet.slice(0, 50)}..."`);
      totalViolations++;
    }
  }
}

console.log(`[SCAN SUMMARY] Inspected:`);
console.log(`  - JavaScript Bundles: ${scannedStats.jsFiles}`);
console.log(`  - JSON Data Assets:   ${scannedStats.jsonFiles}`);
console.log(`  - HTML Files:         ${scannedStats.htmlFiles}`);
console.log(`  - Other Assets:       ${scannedStats.otherFiles}`);
console.log(`  - Total Data Scanned: ${(scannedStats.totalBytes / (1024 * 1024)).toFixed(2)} MB`);
console.log(`  - String Violations:  ${totalViolations}\n`);

// 2. Validate dist/data/gita/chapter_*.json structure and withholding markers
console.log('Validating dist/data/gita/chapter_*.json structure and withholding status...');
const distGitaDir = path.join(distDir, 'data/gita');
let gitaStructureErrors = 0;

if (!fs.existsSync(distGitaDir)) {
  console.error('[FAIL] dist/data/gita directory missing from build output.');
  gitaStructureErrors++;
} else {
  let totalDistGitaVerses = 0;
  for (let ch = 1; ch <= 18; ch++) {
    const chFile = path.join(distGitaDir, `chapter_${ch}.json`);
    if (!fs.existsSync(chFile)) {
      console.error(`[FAIL] Missing dist/data/gita/chapter_${ch}.json`);
      gitaStructureErrors++;
      continue;
    }

    try {
      const data = JSON.parse(fs.readFileSync(chFile, 'utf8'));
      const expectedVerses = GITA_CHAPTER_VERSE_COUNTS[ch];
      if (!Array.isArray(data) || data.length !== expectedVerses) {
        console.error(`[FAIL] Chapter ${ch} verse count mismatch: expected ${expectedVerses}, got ${data?.length}`);
        gitaStructureErrors++;
        continue;
      }
      totalDistGitaVerses += data.length;

      // Validate every verse in this chapter
      for (const v of data) {
        if (!v.chapter || !v.verse || typeof v.slok !== 'string' || typeof v.transliteration !== 'string') {
          console.error(`[FAIL] Invalid verse structure in Chapter ${ch}:${v.verse}`);
          gitaStructureErrors++;
          break;
        }

        // Must have valid withholding notice markers
        const hasWithheldSiva = typeof v.sivanandaEn === 'string' && v.sivanandaEn.includes('withheld');
        const hasWithheldGambir = typeof v.gambhiranandaEn === 'string' && v.gambhiranandaEn.includes('withheld');
        const hasWithheldPurohit = typeof v.purohitEn === 'string' && v.purohitEn.includes('withheld');
        const hasWithheldRams = typeof v.ramsukhdasHi === 'string' && v.ramsukhdasHi.includes('स्थगित');

        if (!hasWithheldSiva || !hasWithheldGambir || !hasWithheldPurohit || !hasWithheldRams) {
          console.error(`[FAIL] Missing required withholding notice markers in Chapter ${ch}:${v.verse}`);
          gitaStructureErrors++;
          break;
        }
      }
    } catch (e) {
      console.error(`[FAIL] Error parsing JSON for Chapter ${ch}:`, e.message);
      gitaStructureErrors++;
    }
  }
  console.log(`  ✓ Verified 18 chapters and ${totalDistGitaVerses} verses in dist/data/gita/.\n`);
}

// 3. Ensure required rights notice markers are present in the JS bundle
console.log('Checking required UI rights markers in JS bundle...');
const distAssetsDir = path.join(distDir, 'assets');
const jsBundleFile = fs.readdirSync(distAssetsDir).find(f => f.startsWith('index-') && f.endsWith('.js'));
const bundleContent = fs.readFileSync(path.join(distAssetsDir, jsBundleFile), 'utf8');

const REQUIRED_UI_MARKERS = [
  'secondary-translation-withheld-notice',
  'secondary-rights-badge',
  'gita-translation-withheld-notice',
  'canonicalTextRights',
  'primaryTranslationRights',
  'secondaryTranslationRights',
];

let missingMarkers = 0;
for (const marker of REQUIRED_UI_MARKERS) {
  if (!bundleContent.includes(marker)) {
    console.error(`[FAIL] Production bundle is missing required marker: "${marker}"`);
    missingMarkers++;
  }
}

if (totalViolations > 0 || gitaStructureErrors > 0 || missingMarkers > 0) {
  console.error(`\nProduction Asset Rights Scan FAILED:`);
  console.error(`  - Snippet Violations: ${totalViolations}`);
  console.error(`  - Gita Structure Errors: ${gitaStructureErrors}`);
  console.error(`  - Missing UI Markers: ${missingMarkers}\n`);
  process.exit(1);
} else {
  console.log('Production Asset Rights Scan PASSED: Zero restricted strings found, all assets verified.\n');
  process.exit(0);
}
