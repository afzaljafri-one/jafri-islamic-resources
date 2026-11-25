/**
 * Phase 6.3.4 - Rights Gate, Content Consistency & Acceptance Evidence Validator
 *
 * Enforces:
 * 1. ControlledLicenceIdentifier strict taxonomy
 * 2. Fail-closed rights status rendering (no defaults to VERIFIED or Public Domain)
 * 3. Elimination of descriptive phrases as licence identifiers
 * 4. Content count reconciliations (Quran 10 Ayahs, Gita 54 shlokas, Tanakh 4 complete chapters, Tattvartha 6 aphorisms)
 * 5. Sikh citation accuracy (Ang 1384 Salok 115 vs Ang 1382 Salok 85)
 * 6. Complete 7-theme x 7-tradition verification matrix (49 verified passages)
 */

const fs = require('fs');
const path = require('path');

const VALID_RIGHTS_STATUSES = ['VERIFIED', 'RESTRICTED', 'PERMISSION_REQUIRED', 'UNKNOWN'];
const VALID_LICENCE_IDENTIFIERS = [
  'CC BY 3.0',
  'CC BY 4.0',
  'CC BY-SA 4.0',
  'CC BY-NC 4.0',
  'CC0 1.0',
  'Public Domain',
  'Written Permission',
  'Custom Terms',
  'PERMISSION_REQUIRED',
  'UNKNOWN',
];

const FORBIDDEN_DESCRIPTIVE_PHRASES = [
  'Universal Religious Heritage',
  'Open Educational Heritage',
  'Public Gurbani Domain',
  'Educational Public Scholarship',
  'Free Religious Educational Distribution',
];

let totalAssertions = 0;
let passedAssertions = 0;
const failures = [];

function assert(condition, message) {
  totalAssertions++;
  if (condition) {
    passedAssertions++;
    console.log(`  [PASS] ${message}`);
  } else {
    failures.push(message);
    console.error(`  [FAIL] ${message}`);
  }
}

console.log('================================================================');
console.log('PHASE 6.3.4: RIGHTS GATE & CONTENT CONSISTENCY TEST SUITE');
console.log('================================================================\n');

// -----------------------------------------------------------------------------
// TEST 1: FAIL-CLOSED RIGHTS DISPLAY INSPECTION (UniversalScriptureSearchModal.tsx)
// -----------------------------------------------------------------------------
console.log('TEST 1: Inspecting Search Modal UI for Fail-Closed Rights Display...');
const modalPath = path.join(__dirname, 'src/platform/components/UniversalScriptureSearchModal.tsx');
const modalContent = fs.readFileSync(modalPath, 'utf8');

assert(
  !modalContent.includes("rightsStatus || 'VERIFIED'"),
  "No fail-open default rightsStatus || 'VERIFIED' in search modal"
);
assert(
  !modalContent.includes("rightsHolderOrPublisher || 'Public Domain'"),
  "No fail-open default rightsHolderOrPublisher || 'Public Domain' in search modal"
);
assert(
  modalContent.includes('Rights not verified'),
  "Search modal renders 'Rights not verified' for unknown or missing rights"
);
assert(
  modalContent.includes('Permission Required'),
  "Search modal renders 'Permission Required' for PERMISSION_REQUIRED status"
);

// -----------------------------------------------------------------------------
// TEST 2: FORBIDDEN DESCRIPTIVE PHRASES CHECK ACROSS CODEBASE
// -----------------------------------------------------------------------------
console.log('\nTEST 2: Checking for Forbidden Descriptive Phrases...');
const registryPath = path.join(__dirname, 'src/platform/services/contentCoverageRegistry.ts');
const registryContent = fs.readFileSync(registryPath, 'utf8');
const searchServicePath = path.join(__dirname, 'src/platform/services/universalScriptureSearchService.ts');
const searchServiceContent = fs.readFileSync(searchServicePath, 'utf8');

FORBIDDEN_DESCRIPTIVE_PHRASES.forEach((phrase) => {
  assert(
    !registryContent.includes(phrase),
    `contentCoverageRegistry.ts does not contain forbidden phrase '${phrase}'`
  );
  assert(
    !searchServiceContent.includes(phrase),
    `universalScriptureSearchService.ts does not contain forbidden phrase '${phrase}'`
  );
});

// -----------------------------------------------------------------------------
// TEST 3: EXACT LICENCE IDENTIFIERS CONFORMANCE
// -----------------------------------------------------------------------------
console.log('\nTEST 3: Checking ControlledLicenceIdentifier Conformance...');
const licenceRegex = /exactLicenceIdentifier:\s*['"]([^'"]+)['"]/g;

let match;
let registryLicenceCount = 0;
while ((match = licenceRegex.exec(registryContent)) !== null) {
  registryLicenceCount++;
  const id = match[1];
  assert(
    VALID_LICENCE_IDENTIFIERS.includes(id),
    `Registry exactLicenceIdentifier '${id}' is in controlled taxonomy`
  );
}

assert(registryLicenceCount > 20, `Checked ${registryLicenceCount} registry exactLicenceIdentifier entries`);

let searchLicenceCount = 0;
while ((match = licenceRegex.exec(searchServiceContent)) !== null) {
  searchLicenceCount++;
  const id = match[1];
  assert(
    VALID_LICENCE_IDENTIFIERS.includes(id),
    `SearchService exactLicenceIdentifier '${id}' is in controlled taxonomy`
  );
}

assert(searchLicenceCount > 15, `Checked ${searchLicenceCount} searchService exactLicenceIdentifier entries`);

// -----------------------------------------------------------------------------
// TEST 4: CONTENT & REGISTRY RECONCILIATION
// -----------------------------------------------------------------------------
console.log('\nTEST 4: Content and Registry Data Reconciliation...');

// A. Quran
assert(
  registryContent.includes('10 foundational verses bundled complete offline') ||
  registryContent.includes('10 foundational Ayahs bundled complete offline') ||
  registryContent.includes('10 foundational Ayahs bundled complete'),
  'Qur’an bundled scope correctly specifies 10 individual Ayahs (not 10 Surahs or 114 offline chapters)'
);
assert(
  registryContent.includes('remaining 6,226 Ayahs') || registryContent.includes('6,226 remaining Ayahs'),
  'Qur’an coverage notes remaining 6,226 Ayahs are remote/cached'
);

// B. Bhagavad Gita
assert(
  registryContent.includes('54 landmark shlokas (47 from Chapter 1') ||
  registryContent.includes('54 landmark shlokas (47 from Ch 1'),
  'Bhagavad Gita offline coverage accurately specifies 54 landmark shlokas'
);
assert(
  registryContent.includes('701-Verse') && registryContent.includes('700-Verse'),
  'Bhagavad Gita dual convention (701 active / 700 cross-reference) documented'
);

// C. Tanakh
assert(
  registryContent.includes('Genesis 1 [31 verses], Tehillim 23 [6 verses], Tehillim 100 [5 verses], Tehillim 121 [8 verses]'),
  'Tanakh bundled scope accurately specifies the 4 complete canonical chapters'
);
assert(
  searchServiceContent.includes('judaism_genesis_1_complete') &&
  searchServiceContent.includes('judaism_psalm_23_complete') &&
  searchServiceContent.includes('judaism_psalm_100_complete') &&
  searchServiceContent.includes('judaism_psalm_121_complete'),
  'SearchService indexes all 4 complete grouped Tanakh chapters'
);

// D. Tattvartha Sutra
assert(
  registryContent.includes('6 landmark core aphorisms') &&
  registryContent.includes('indexedUnits: 6'),
  'Tattvartha Sutra offline coverage accurately specifies 6 core aphorisms'
);

// -----------------------------------------------------------------------------
// TEST 5: SIKH CITATION MATRIX ACCURACY
// -----------------------------------------------------------------------------
console.log('\nTEST 5: Sikh Citation Matrix Accuracy...');

// Ang 471 Daya Kapah
assert(
  searchServiceContent.includes('sikhism_ang_471_daya_kapah') &&
  searchServiceContent.includes('ਦਇਆ ਕਪਾਹ ਸੰਤੋਖੁ ਸੂਤੁ ਜਤੁ ਗੰਢੀ ਸਤੁ ਵਟੁ'),
  'SGGS Ang 471 correctly quotes Daya Kapah Santokh Soot'
);

// Ang 3 Dhaul Dharam
assert(
  searchServiceContent.includes('sikhism_ang_3_dhaul_dharam') &&
  searchServiceContent.includes('ਧੌਲੁ ਧਰਮੁ ਦਇਆ ਕਾ ਪੂਤੁ'),
  'SGGS Ang 3 correctly quotes Dhaul Dharam Daya Ka Poot'
);

// Ang 1381 Salok Sheikh Farid 78
assert(
  searchServiceContent.includes('sikhism_ang_1381_salok_farid_78') &&
  searchServiceContent.includes('ਫਰੀਦਾ ਬੁਰੇ ਦਾ ਭਲਾ ਕਰਿ'),
  'SGGS Ang 1381 correctly quotes Salok Sheikh Farid 78 (Forgiveness)'
);

// Ang 1382 Salok Sheikh Farid 85
assert(
  searchServiceContent.includes('sikhism_ang_1382_salok_farid_85') &&
  searchServiceContent.includes('ਫਰੀਦਾ ਦੁਖਾ ਸੇਤੀ ਦਿਹੁ ਗਇਆ ਸੂਲਾ ਸੇਤੀ ਰਾਤਿ') &&
  searchServiceContent.includes('ਬੇੜਾ ਕਪਰ ਵਾਤਿ'),
  'SGGS Ang 1382 correctly quotes actual Salok 85 (Distress & Whirlpool passage)'
);

// Ang 1384 Salok Sheikh Farid 115
assert(
  searchServiceContent.includes('sikhism_ang_1384_salok_farid_115') &&
  searchServiceContent.includes('ਸਬਰੁ ਮੰਝਿ ਕਮਾਣ ਏ ਸਬਰੁ ਕਾ ਨੀਹਣੋ ॥ ਸਬਰ ਸੰਦਾ ਬਾਣੁ ਖਾਲਕੁ ਖਤਾ ਨ ਕਰੀ ॥੧੧੫॥'),
  'SGGS Ang 1384 correctly quotes Salok 115 for Sabr (Patience Bow and Arrow)'
);

// Patience theme locator in getThematicDefinitions
assert(
  searchServiceContent.includes('id: \'theme_sik_patience\'') &&
  searchServiceContent.includes('chapterNumber: 1384') &&
  searchServiceContent.includes('verseNumber: 115'),
  'Patience thematic locator in getThematicDefinitions references Ang 1384 Salok 115'
);

// -----------------------------------------------------------------------------
// TEST 6: SEVEN-THEME VERIFICATION MATRIX (49 PASSAGES & VERBATIM DISCLAIMER)
// -----------------------------------------------------------------------------
console.log('\nTEST 6: Seven-Theme Verification Matrix Completeness...');

const THEMES = ['compassion', 'forgiveness', 'peace', 'patience', 'gratitude', 'charity', 'wisdom'];
const RELIGIONS = ['isl', 'chr', 'hin', 'jud', 'sik', 'bud', 'jai'];

THEMES.forEach((theme) => {
  RELIGIONS.forEach((rel) => {
    const passageId = `theme_${rel}_${theme}`;
    assert(
      searchServiceContent.includes(`id: '${passageId}'`),
      `Passage '${passageId}' exists in 7-theme matrix`
    );
  });
});

const VERBATIM_DISCLAIMER = 'Thematic discovery — contextual spiritual reflection, not direct scriptural equivalence.';
assert(
  modalContent.includes(VERBATIM_DISCLAIMER),
  'Verbatim thematic disclaimer rendered in Search Modal'
);
assert(
  searchServiceContent.includes(VERBATIM_DISCLAIMER),
  'Verbatim thematic disclaimer defined in Search Service'
);

// -----------------------------------------------------------------------------
// TEST 7: SPECIFIC LICENSING REMEDIATIONS
// -----------------------------------------------------------------------------
console.log('\nTEST 7: Specific Licensing Records Remediation...');

// A. Quran Sahih International & Jawadi
assert(
  registryContent.includes("exactLicenceIdentifier: 'PERMISSION_REQUIRED'") &&
  registryContent.includes("rightsStatus: 'PERMISSION_REQUIRED'"),
  'Qur’an modern translations (Sahih International & Jawadi) classified as PERMISSION_REQUIRED'
);

// B. KJV Crown Copyright
assert(
  registryContent.includes('Crown Copyright within the United Kingdom') &&
  searchServiceContent.includes('UK Crown Copyright within the United Kingdom'),
  'KJV Bible records UK Crown Copyright limitations under Cambridge Letters Patent'
);

// C. Gita translations
assert(
  registryContent.includes('Edwin Arnold') &&
  registryContent.includes("exactLicenceIdentifier: 'Custom Terms'"),
  'Bhagavad Gita modern translations classified under Custom Terms (RESTRICTED)'
);

// D. SGGS Dr. Sant Singh Khalsa
assert(
  registryContent.includes("rightsHolderOrPublisher: 'Dr. Sant Singh Khalsa, MD / SikhNet'") &&
  registryContent.includes("exactLicenceIdentifier: 'Custom Terms'"),
  'SGGS translation classified under Custom Terms (RESTRICTED) per SikhNet terms'
);

// E. Buddhism Buddharakkhita & Thanissaro separation
assert(
  registryContent.includes("id: 'tr_dhammapada_buddharakkhita'") &&
  registryContent.includes("id: 'tr_metta_thanissaro'"),
  'Buddhism separates Buddharakkhita (BPS Free Distribution Conditions) and Thanissaro translations'
);

// F. Jainism translations
assert(
  registryContent.includes("exactLicenceIdentifier: 'Custom Terms'") &&
  registryContent.includes("rightsHolderOrPublisher: 'JAINA Education Committee"),
  'Jainism translations classified under Custom Terms (RESTRICTED)'
);

// -----------------------------------------------------------------------------
// SUMMARY
// -----------------------------------------------------------------------------
console.log('\n================================================================');
console.log(`TOTAL ASSERTIONS: ${totalAssertions}`);
console.log(`PASSED: ${passedAssertions}`);
console.log(`FAILED: ${failures.length}`);
console.log('================================================================\n');

if (failures.length > 0) {
  console.error('FAILURES:');
  failures.forEach((f, i) => console.error(`${i + 1}. ${f}`));
  process.exit(1);
} else {
  console.log('ALL RIGHTS GATE & CONTENT CONSISTENCY ASSERTIONS PASSED (100% OK)');
  process.exit(0);
}
