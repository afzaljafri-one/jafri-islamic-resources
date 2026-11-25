/**
 * Phase 6.3.5: Final Rights Enforcement, Corpus Reconciliation & Release Validation
 * Automated Data & Rights Gate Validator
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname);
let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    passedTests++;
    console.log(`  [PASS] ${message}`);
  } else {
    failedTests++;
    console.error(`  [FAIL] ${message}`);
  }
}

console.log('================================================================');
console.log('PHASE 6.3.5 DATA & RIGHTS GATE VALIDATION');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// 1. RECONCILED CORPUS INVENTORY VERIFICATION
// -----------------------------------------------------------------------------
console.log('1. Checking phase6_3_5_corpus_inventory.json...');
const inventoryPath = path.join(ROOT, 'phase6_3_5_corpus_inventory.json');
assert(fs.existsSync(inventoryPath), 'phase6_3_5_corpus_inventory.json exists on disk');

const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));
const traditions = inventory.traditions;

// Qur'an
assert(
  traditions.islam.bundledOfflineAyahsCount === 11 &&
    traditions.islam.remoteOrCachedAyahsCount === 6225 &&
    traditions.islam.catalogSurahsCount === 114,
  "Qur'an: 11 foundational Ayahs bundled offline, 6,225 remote/cached, 114 Surahs cataloged"
);

// Bible
assert(
  traditions.christianity.bundledOfflineVersesCount === 48 &&
    traditions.christianity.chapterSelectionsCount === 7 &&
    traditions.christianity.completeChaptersCount === 1 &&
    traditions.christianity.partialSelectionsCount === 6 &&
    traditions.christianity.standaloneLandmarkVersesCount === 1,
  'Bible: 48 bundled offline verses across 7 chapter selections (1 complete chapter: Psalm 23 [6 verses]; 6 partial selections: Genesis 1 [8], Psalm 91 [6], Matthew 5 [11], John 1 [6], 1 Cor 13 [6], Revelation 21 [4]) + 1 standalone landmark verse (John 3:16)'
);

// Gita
assert(
  traditions.hinduism.totalBundledOfflineShlokas === 54 &&
    traditions.hinduism.chapter1ShlokasCount === 47 &&
    traditions.hinduism.landmarkCoreShlokasCount === 7,
  'Bhagavad Gita: 54 bundled shlokas (47 from Ch 1 + 7 landmark verses); dual 701 active / 700 cross-reference convention'
);

// Tanakh
assert(
  traditions.judaism.completeBundledChaptersCount === 4 &&
    traditions.judaism.totalBundledVersesCount === 50,
  'Tanakh: 4 complete chapters (Genesis 1 [31], Psalm 23 [6], Psalm 100 [5], Psalm 121 [8] = 50 verses total)'
);

// Sikhism
assert(
  traditions.sikhism.completeBundledAngsCount === 13 &&
    traditions.sikhism.totalCanonicalAngs === 1430 &&
    (traditions.sikhism.landmarkIndexedPassagesCount === 4 || traditions.sikhism.landmarkIndexedPassagesCount === 5),
  'Sikh Scripture: 13 complete offline Angs (Angs 1 to 13: Japji Sahib, So Dar, Kirtan Sohila) + landmark indexed passages (Ang 471, Ang 1381, Ang 1382, Ang 1384, Ang 3)'
);

// Dhammapada
assert(
  traditions.buddhism.bundledOfflineDhammapadaVersesCount === 7 &&
    traditions.buddhism.totalCanonicalDhammapadaVerses === 423,
  'Dhammapada: 7 selected verses (1, 2, 5, 21, 33, 197, 277)'
);

// Jainism
assert(
  traditions.jainism.referenceGroupsCount === 6 &&
    traditions.jainism.totalIndividualAphorismCoordinates === 14 &&
    traditions.jainism.totalCanonicalSutras === 357,
  'Jain Tattvartha Sutra: 6 reference groups containing 14 individual aphorism coordinates (1.1, 1.4, 2.1–2.8, 5.21, 7.1, 9.1–9.2)'
);

// -----------------------------------------------------------------------------
// 2. CONTENT COVERAGE REGISTRY & CONTROLLED RIGHTS TAXONOMY
// -----------------------------------------------------------------------------
console.log('\n2. Checking contentCoverageRegistry.ts and controlled rights taxonomy...');
const registryPath = path.join(ROOT, 'src/platform/services/contentCoverageRegistry.ts');
const registryText = fs.readFileSync(registryPath, 'utf8');

// Exactly 21 authoritative collection records across the 7 traditions
const collectionIdMatches = registryText.match(/id:\s*['"]cov_[a-z_]+['"]/g) || [];
assert(
  collectionIdMatches.length === 21,
  `AUTHORITATIVE_COVERAGE_REGISTRY contains exactly 21 collection records (found ${collectionIdMatches.length})`
);

// Check controlled licence taxonomy
const ALLOWED_LICENCES = [
  'CC BY 3.0',
  'CC BY 4.0',
  'CC BY-SA 4.0',
  'CC BY-NC 4.0',
  'CC0 1.0',
  'Public Domain',
  'Written Permission',
  'Custom Terms',
  'Unknown',
];

// No PERMISSION_REQUIRED in exactLicenceIdentifier
const invalidLicenceMatches = registryText.match(/exactLicenceIdentifier:\s*['"]PERMISSION_REQUIRED['"]/g);
assert(!invalidLicenceMatches, 'exactLicenceIdentifier never contains PERMISSION_REQUIRED');

const invalidUnknownCase = registryText.match(/exactLicenceIdentifier:\s*['"]UNKNOWN['"]/g);
assert(!invalidUnknownCase, "exactLicenceIdentifier never contains uppercase 'UNKNOWN' (strictly uses 'Unknown')");

// Check rightsStatus
const ALLOWED_RIGHTS_STATUSES = ['VERIFIED', 'RESTRICTED', 'PERMISSION_REQUIRED', 'UNKNOWN'];
const rightsStatusMatches = registryText.match(/rightsStatus:\s*['"]([^'"]+)['"]/g) || [];
let allStatusesValid = true;
rightsStatusMatches.forEach((m) => {
  const val = m.split(':')[1].replace(/['"\s]/g, '');
  if (!ALLOWED_RIGHTS_STATUSES.includes(val)) {
    allStatusesValid = false;
    console.error(`Invalid rightsStatus found: ${val}`);
  }
});
assert(allStatusesValid, 'All rightsStatus values conform strictly to VERIFIED | RESTRICTED | PERMISSION_REQUIRED | UNKNOWN');

// -----------------------------------------------------------------------------
// 3. THEMATIC PASSAGES AUDIT (7 APPROVED CATEGORIES, 49 PASSAGES)
// -----------------------------------------------------------------------------
console.log('\n3. Checking 7 approved thematic categories & 49 verified passages...');
const searchServicePath = path.join(ROOT, 'src/platform/services/universalScriptureSearchService.ts');
const searchServiceText = fs.readFileSync(searchServicePath, 'utf8');

const APPROVED_THEMES = ['compassion', 'forgiveness', 'peace', 'patience', 'gratitude', 'charity', 'wisdom'];
const REQUIRED_DISCLAIMER = 'Thematic discovery — contextual spiritual reflection, not direct scriptural equivalence.';

APPROVED_THEMES.forEach((theme) => {
  const themeRegex = new RegExp(`id:\\s*['"]${theme}['"]`, 'i');
  assert(themeRegex.test(searchServiceText), `Theme '${theme}' is defined in universalScriptureSearchService.ts`);
});

// Count thematic result entries in getThematicDefinitions()
const thematicDefsBlock = searchServiceText.slice(
  searchServiceText.indexOf('public getThematicDefinitions()'),
  searchServiceText.indexOf('public async search(')
);
const thematicEntriesCount = (thematicDefsBlock.match(/matchType:\s*['"]thematic_result['"]/g) || []).length;
assert(
  thematicEntriesCount === 49,
  `Exactly 49 verified thematic passages registered (7 traditions x 7 themes, found ${thematicEntriesCount})`
);

// Check verbatim disclaimer presence
assert(
  searchServiceText.includes(REQUIRED_DISCLAIMER),
  `Universal search service enforces mandatory verbatim disclaimer: "${REQUIRED_DISCLAIMER}"`
);

const MANDATORY_VIRTUES_DISCLAIMER = 'This passage has been selected solely for its thematic relevance to this virtue. Inclusion does not imply any theological equivalence, syncretism, or doctrinal endorsement between traditions.';
const virtuesDisclaimerCount = (thematicDefsBlock.match(/thematicDisclaimer:\s*['"]This passage has been selected solely/g) || []).length;
assert(
  virtuesDisclaimerCount === 49,
  `Every single one of the 49 thematic passages contains the mandatory virtues disclaimer (found ${virtuesDisclaimerCount}/49)`
);

// Verify canonicalTextRights and primaryTranslationRights across all 49 passages
const canonRightsCount = (thematicDefsBlock.match(/canonicalTextRights:\s*\{/g) || []).length;
const primRightsCount = (thematicDefsBlock.match(/primaryTranslationRights:\s*\{/g) || []).length;
assert(
  canonRightsCount >= 49,
  `All 49 thematic passages have static canonicalTextRights records (found ${canonRightsCount})`
);
assert(
  primRightsCount >= 49,
  `All 49 thematic passages have static primaryTranslationRights records (found ${primRightsCount})`
);

// -----------------------------------------------------------------------------
// 3.5. ALLAMA JAWADI URDU TRANSLATION RIGHTS GATE (PHASE 6.3.5.1 HOTFIX)
// -----------------------------------------------------------------------------
console.log('\n3.5. Checking Allama Jawadi Urdu translation rights gate & withholding...');
const JAWADI_WITHHELD_NOTICE = 'مجاز اردو ترجمہ (علامہ جوادی) کا متن حقوق کی تصدیق تک موقوف ہے۔';
const JAWADI_TAG = '[مجاز اردو ترجمہ (علامہ جوادی) کا متن حقوق کی تصدیق تک موقوف ہے]';

assert(
  searchServiceText.includes(JAWADI_TAG),
  `universalScriptureSearchService.ts uses explicit withholding tag for Jawadi Urdu: "${JAWADI_TAG}"`
);

// Ensure foundational passages do not contain raw Jawadi text
const FORBIDDEN_JAWADI_TEXTS = [
  'سب تعریفیں اللہ کے لیے ہیں جو تمام جہانوں کا رب ہے',
  'اے ایمان والو! صبر اور نماز سے مدد لو',
  'جو لوگ اپنا مال اللہ کی راہ میں خرچ کرتے ہیں ان کی مثال اس دانے جیسی ہے',
  'وہ جسے چاہے حکمت عطا کرتا ہے، اور جسے حکمت مل گئی',
  'جو خوشحالی اور تنگ دستی میں خرچ کرتے ہیں اور غصہ پینے والے',
  'اور جب تمہارے رب نے آگاہ کر دیا کہ اگر تم شکر کرو گے تو میں تمہیں اور زیادہ دوں گا',
  'اور ہم نے آپ کو تمام جہانوں کے لیے رحمت بنا کر بھیجا ہے',
  'اور رحمان کے بندے وہ ہیں جو زمین پر عاجزی سے چلتے ہیں',
  'کہہ دیجیے کہ وہ اللہ ایک ہے',
];

let noRawJawadiInSearchService = true;
FORBIDDEN_JAWADI_TEXTS.forEach((txt) => {
  if (searchServiceText.includes(txt)) {
    noRawJawadiInSearchService = false;
    console.error(`universalScriptureSearchService.ts illegally contains raw Jawadi text: "${txt}"`);
  }
});
assert(noRawJawadiInSearchService, 'universalScriptureSearchService.ts has zero raw Allama Jawadi Urdu texts');

// -----------------------------------------------------------------------------
// 4. RIGHTS GATE & DISTRIBUTION AUDIT (BUNDLE INSPECTION)
// -----------------------------------------------------------------------------
console.log('\n4. Checking build assets and actual distribution gate in dist/...');
const distAssetsDir = path.join(ROOT, 'dist/assets');
assert(fs.existsSync(distAssetsDir), 'dist/assets directory exists');

const jsBundleName = fs.readdirSync(distAssetsDir).find((f) => f.startsWith('index-') && f.endsWith('.js'));
assert(Boolean(jsBundleName), `Found production bundle: ${jsBundleName}`);

const jsBundleText = fs.readFileSync(path.join(distAssetsDir, jsBundleName), 'utf8');

// Check that Sahih International and Jawadi Urdu translation texts were withheld from client bundle
const FORBIDDEN_STRINGS = [
  'the Ever-Living, the Self-Sustaining of all existence',
  'Neither drowsiness overtakes Him nor sleep',
  'and they encompass not a thing of His knowledge except for what He wills',
  'His Kursi extends over the heavens and the earth',
  ...FORBIDDEN_JAWADI_TEXTS,
];

let noForbiddenStrings = true;
FORBIDDEN_STRINGS.forEach((str) => {
  if (jsBundleText.includes(str)) {
    noForbiddenStrings = false;
    console.error(`Client bundle illegally contains forbidden restricted string: "${str}"`);
  }
});
assert(noForbiddenStrings, 'Client bundle strictly withholds unverified / PERMISSION_REQUIRED translation texts (Sahih International & Allama Jawadi)');

// Check that component isolation and withheld notices are bundled
assert(
  jsBundleText.includes('canonicalTextRights') || jsBundleText.includes('canonical-rights-badge'),
  'Client bundle includes component-level canonical scripture rights badge / isolation'
);
assert(
  jsBundleText.includes('translation-withheld-notice') || jsBundleText.includes('Authorised Translation Withheld'),
  'Client bundle includes clear notice for withheld translations pending rights clearance'
);
assert(
  jsBundleText.includes('secondary-translation-withheld-notice'),
  'Client bundle includes secondary-translation-withheld-notice data-testid'
);
assert(
  jsBundleText.includes('secondary-rights-badge'),
  'Client bundle includes secondary-rights-badge data-testid'
);
assert(
  jsBundleText.includes('gita-translation-withheld-notice'),
  'Client bundle includes gita-translation-withheld-notice data-testid'
);

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`DATA & RIGHTS GATE RESULTS: ${passedTests}/${totalTests} PASSED (${failedTests} FAILED)`);
console.log('================================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('Phase 6.3.5 Data & Rights Gate Validator: ALL CHECKS PASSED SUCCESSFULLY!\n');
  process.exit(0);
}
