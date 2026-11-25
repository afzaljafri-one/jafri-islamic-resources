/**
 * Phase 6.3.5.3 Complete Production Asset Rights Scanner
 * Recursively enumerates EVERY file in dist/ without exception.
 * Classifies all files by extension (text-bearing vs recognized binary).
 * Fails the release gate immediately if any unclassified/unknown file type is encountered.
 * Inspects all text-bearing assets for forbidden proprietary translations.
 * Performs deep schema and coordinate-specific allowlist validation on all 18 Gita chapter JSON files (701 total verses).
 * Validates production JS bundle for mandatory UI rights markers.
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
  'Truly, there is no purifier in this world like wisdom',

  // 3b. A.C. Bhaktivedanta Swami Prabhupada (1972 ISKCON)
  'Abandoning all varieties of dharmas',
  'Abandon all varieties of religion and just surrender unto Me',

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

// Recognized extensions classification
const TEXT_EXTENSIONS = new Set(['.js', '.json', '.html', '.css', '.svg', '.txt', '.xml', '.webmanifest', '.map']);
const BINARY_EXTENSIONS = new Set(['.png', '.jpg', '.jpeg', '.gif', '.webp', '.ico', '.woff', '.woff2', '.ttf', '.eot', '.oga', '.ogg', '.mp3', '.pdf']);

// Recursively enumerate ALL files
function enumerateAllFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(enumerateAllFiles(fullPath));
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

console.log('================================================================================');
console.log('PHASE 6.3.5.3 COMPLETE PRODUCTION ASSET RIGHTS SCANNER');
console.log(`Scan Target: ${distDir}`);
console.log('================================================================================\n');

const allDistFiles = enumerateAllFiles(distDir);
console.log(`Found ${allDistFiles.length} total files in dist/ to classify and inspect.\n`);

let totalViolations = 0;
const scannedStats = {
  byType: {},
  totalBytes: 0,
  textFilesCount: 0,
  binaryFilesCount: 0,
};

const unclassifiedFiles = [];

// 1. Classification and Text-Asset Inspection
for (const filePath of allDistFiles) {
  const relPath = path.relative(distDir, filePath);
  const ext = path.extname(filePath).toLowerCase();

  scannedStats.byType[ext] = (scannedStats.byType[ext] || 0) + 1;

  if (TEXT_EXTENSIONS.has(ext)) {
    scannedStats.textFilesCount++;
    const content = fs.readFileSync(filePath, 'utf8');
    scannedStats.totalBytes += content.length;

    for (const snippet of FORBIDDEN_RESTRICTED_SNIPPETS) {
      if (content.includes(snippet)) {
        console.error(`[FAIL] File dist/${relPath} contains restricted snippet: "${snippet.slice(0, 50)}..."`);
        totalViolations++;
      }
    }
  } else if (BINARY_EXTENSIONS.has(ext)) {
    scannedStats.binaryFilesCount++;
  } else {
    unclassifiedFiles.push(relPath);
  }
}

console.log('[FILE CLASSIFICATION & SCAN SUMMARY]');
console.log(`  - Total Files Scanned:   ${allDistFiles.length}`);
console.log(`  - Text-Bearing Assets:   ${scannedStats.textFilesCount}`);
console.log(`  - Recognized Binaries:   ${scannedStats.binaryFilesCount}`);
console.log(`  - Total Data Inspected:  ${(scannedStats.totalBytes / (1024 * 1024)).toFixed(2)} MB`);
console.log('  - Breakdown by Extension:');
for (const [ext, count] of Object.entries(scannedStats.byType).sort()) {
  const kind = TEXT_EXTENSIONS.has(ext) ? 'TEXT' : BINARY_EXTENSIONS.has(ext) ? 'BINARY' : 'UNCLASSIFIED';
  console.log(`      * ${ext || '(no ext)'}: ${count} files [${kind}]`);
}
console.log(`  - Snippet Violations:    ${totalViolations}\n`);

if (unclassifiedFiles.length > 0) {
  console.error(`[FAIL] Found ${unclassifiedFiles.length} unclassified file(s) in dist/:`);
  unclassifiedFiles.forEach((f) => console.error(`    - ${f}`));
  console.error('All files in dist/ must belong to a known text or binary classification.\n');
  totalViolations++;
}

// 2. Deep Schema and Allowlist Validation on all 18 Gita Chapter Assets
console.log('Performing deep schema and allowlist validation on all 18 Gita chapter JSON files...');
const distGitaDir = path.join(distDir, 'data/gita');
let gitaStructureErrors = 0;
let totalDistGitaVerses = 0;

if (!fs.existsSync(distGitaDir)) {
  console.error('[FAIL] dist/data/gita directory missing from build output.');
  gitaStructureErrors++;
} else {
  const ALLOWED_VERSE_KEYS = new Set([
    'chapter',
    'verse',
    'slok',
    'transliteration',
    'translationEn',
    'edwinArnoldEn',
    'sivanandaEn',
    'gambhiranandaEn',
    'purohitEn',
    'ramsukhdasHi',
    'shankaraBhashya',
  ]);

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

      const seenCoordinates = new Set();

      for (let vIdx = 0; vIdx < data.length; vIdx++) {
        const v = data[vIdx];
        const coord = `${v.chapter}:${v.verse}`;

        // Validate coordinate integrity
        if (v.chapter !== ch || v.verse !== vIdx + 1) {
          console.error(`[FAIL] Invalid coordinate sequence in Chapter ${ch}: expected ${ch}:${vIdx + 1}, got ${coord}`);
          gitaStructureErrors++;
          break;
        }

        if (seenCoordinates.has(coord)) {
          console.error(`[FAIL] Duplicate coordinate ${coord} in Chapter ${ch}`);
          gitaStructureErrors++;
          break;
        }
        seenCoordinates.add(coord);

        // Validate Sanskrit Devanagari and Roman IAST
        if (typeof v.slok !== 'string' || v.slok.trim().length === 0) {
          console.error(`[FAIL] Empty or invalid Sanskrit slok in Chapter ${coord}`);
          gitaStructureErrors++;
          break;
        }
        if (typeof v.transliteration !== 'string' || v.transliteration.trim().length === 0) {
          console.error(`[FAIL] Empty or invalid IAST transliteration in Chapter ${coord}`);
          gitaStructureErrors++;
          break;
        }

        // Validate Modern Commentary Withholding Notices
        if (v.sivanandaEn !== WITHHELD_GITA_COMMENTARY_EN) {
          console.error(`[FAIL] Sivananda commentary not withheld in ${coord}`);
          gitaStructureErrors++;
          break;
        }
        if (v.gambhiranandaEn !== WITHHELD_GITA_COMMENTARY_EN) {
          console.error(`[FAIL] Gambhirananda commentary not withheld in ${coord}`);
          gitaStructureErrors++;
          break;
        }
        if (v.purohitEn !== WITHHELD_GITA_COMMENTARY_EN) {
          console.error(`[FAIL] Purohit commentary not withheld in ${coord}`);
          gitaStructureErrors++;
          break;
        }
        if (v.ramsukhdasHi !== WITHHELD_GITA_COMMENTARY_HI) {
          console.error(`[FAIL] Ramsukhdas Hindi commentary not withheld in ${coord}`);
          gitaStructureErrors++;
          break;
        }
        if (v.shankaraBhashya !== WITHHELD_GITA_BHASHYA) {
          console.error(`[FAIL] Shankara Bhashya not withheld in ${coord}`);
          gitaStructureErrors++;
          break;
        }

        // Validate English Translation Whitelist
        const approved = EDWIN_ARNOLD_ALLOWLIST[coord];
        if (approved) {
          // Landmark verse: must match approved allowlist string
          if (v.translationEn !== approved.text || v.edwinArnoldEn !== approved.text) {
            console.error(`[FAIL] Approved landmark verse ${coord} does not match allowlist text`);
            gitaStructureErrors++;
            break;
          }
        } else {
          // Non-landmark verse: translationEn and edwinArnoldEn must either be absent or withheld
          const hasUnapprovedTrans = v.translationEn && v.translationEn !== WITHHELD_GITA_COMMENTARY_EN;
          const hasUnapprovedArnold = v.edwinArnoldEn && v.edwinArnoldEn !== WITHHELD_GITA_COMMENTARY_EN;
          if (hasUnapprovedTrans || hasUnapprovedArnold) {
            console.error(`[FAIL] Non-allowlist verse ${coord} contains unapproved translation text`);
            gitaStructureErrors++;
            break;
          }
        }

        // Reject unrecognized / proprietary commentary fields
        for (const k of Object.keys(v)) {
          if (!ALLOWED_VERSE_KEYS.has(k)) {
            console.error(`[FAIL] Unrecognized field "${k}" in Chapter ${coord}`);
            gitaStructureErrors++;
            break;
          }
        }
      }
    } catch (e) {
      console.error(`[FAIL] Error parsing JSON for Chapter ${ch}:`, e.message);
      gitaStructureErrors++;
    }
  }

  if (totalDistGitaVerses === 701 && gitaStructureErrors === 0) {
    console.log(`  ✓ All 18 chapters and exactly 701 verses verified with zero schema or allowlist defects.\n`);
  } else {
    console.error(`[FAIL] Expected 701 verses across 18 chapters, verified ${totalDistGitaVerses} with ${gitaStructureErrors} errors.\n`);
  }
}

// 3. Ensure required rights notice markers are present in the JS bundle
console.log('Checking required UI rights markers in JS bundle...');
const distAssetsDir = path.join(distDir, 'assets');
const jsBundleFile = fs.readdirSync(distAssetsDir).find((f) => f.startsWith('index-') && f.endsWith('.js'));
let missingMarkers = 0;

if (!jsBundleFile) {
  console.error('[FAIL] No index-*.js bundle found in dist/assets/');
  missingMarkers++;
} else {
  const bundleContent = fs.readFileSync(path.join(distAssetsDir, jsBundleFile), 'utf8');

  const REQUIRED_UI_MARKERS = [
    'secondary-translation-withheld-notice',
    'secondary-rights-badge',
    'gita-translation-withheld-notice',
    'canonicalTextRights',
    'primaryTranslationRights',
    'secondaryTranslationRights',
  ];

  for (const marker of REQUIRED_UI_MARKERS) {
    if (!bundleContent.includes(marker)) {
      console.error(`[FAIL] Production bundle is missing required marker: "${marker}"`);
      missingMarkers++;
    }
  }
}

if (totalViolations > 0 || gitaStructureErrors > 0 || missingMarkers > 0) {
  console.error(`\nProduction Asset Rights Scan FAILED:`);
  console.error(`  - Snippet / File Violations: ${totalViolations}`);
  console.error(`  - Gita Structure Errors:     ${gitaStructureErrors}`);
  console.error(`  - Missing UI Markers:        ${missingMarkers}\n`);
  process.exit(1);
} else {
  console.log('Production Asset Rights Scan PASSED: All files categorized, zero violations, 701 verses validated.\n');
  process.exit(0);
}
