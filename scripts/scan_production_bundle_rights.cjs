/**
 * Phase 6.3.5.1 Production Bundle Rights Scanner
 * Strictly verifies that dist/assets/index-*.js contains zero proprietary or restricted translations.
 */

const fs = require('fs');
const path = require('path');

const repoRoot = path.resolve(__dirname, '..');
const distAssetsDir = path.join(repoRoot, 'dist/assets');

if (!fs.existsSync(distAssetsDir)) {
  console.error('[ERROR] dist/assets directory not found. Run "npx vite build" first.');
  process.exit(1);
}

const jsBundleFile = fs.readdirSync(distAssetsDir).find(f => f.startsWith('index-') && f.endsWith('.js'));
if (!jsBundleFile) {
  console.error('[ERROR] Production JavaScript bundle index-*.js not found in dist/assets.');
  process.exit(1);
}

const bundlePath = path.join(distAssetsDir, jsBundleFile);
const bundleText = fs.readFileSync(bundlePath, 'utf8');

console.log(`Scanning bundle ${jsBundleFile} (${(bundleText.length / 1024).toFixed(2)} KB)...`);

const FORBIDDEN_RESTRICTED_SNIPPETS = [
  // Sahih International Qur'an Translation (Ayah 2:255)
  'the Ever-Living, the Self-Sustaining of all existence',
  'Neither drowsiness overtakes Him nor sleep',
  'and they encompass not a thing of His knowledge except for what He wills',
  'His Kursi extends over the heavens and the earth',

  // Allama Syed Zeeshan Haider Jawadi Urdu Translation (Foundational Ayahs)
  'سب تعریفیں اللہ کے لیے ہیں جو تمام جہانوں کا رب ہے',
  'اے ایمان والو! صبر اور نماز سے مدد لو',
  'جو لوگ اپنا مال اللہ کی راہ میں خرچ کرتے ہیں ان کی مثال اس دانے جیسی ہے',
  'وہ جسے چاہے حکمت عطا کرتا ہے، اور جسے حکمت مل گئی',
  'جو خوشحالی اور تنگ دستی میں خرچ کرتے ہیں اور غصہ پینے والے',
  'اور جب تمہارے رب نے آگاہ کر دیا کہ اگر تم شکر کرو گے تو میں تمہیں اور زیادہ دوں گا',
  'اور ہم نے آپ کو تمام جہانوں کے لیے رحمت بنا کر بھیجا ہے',
  'اور رحمان کے بندے وہ ہیں جو زمین پر عاجزی سے چلتے ہیں',
  'کہہ دیجیے کہ وہ اللہ ایک ہے',

  // Modern Gita Proprietary Translations / Commentaries (Sivananda, Gambhirananda, Purohit, Ramsukhdas)
  'The Blessed Lord said: Time I am, the great destroyer of the worlds',
];

let violations = 0;
for (const snippet of FORBIDDEN_RESTRICTED_SNIPPETS) {
  if (bundleText.includes(snippet)) {
    console.error(`[FAIL] Production bundle illegally contains restricted text snippet: "${snippet}"`);
    violations++;
  }
}

// Ensure required notice markers are present
const REQUIRED_MARKERS = [
  'secondary-translation-withheld-notice',
  'translation-withheld-notice',
  'canonicalTextRights',
  'primaryTranslationRights',
  'secondaryTranslationRights',
];

let missingMarkers = 0;
for (const marker of REQUIRED_MARKERS) {
  if (!bundleText.includes(marker)) {
    console.error(`[FAIL] Production bundle is missing required rights enforcement marker: "${marker}"`);
    missingMarkers++;
  }
}

if (violations > 0 || missingMarkers > 0) {
  console.error(`\nProduction Bundle Rights Scan FAILED (${violations} violations, ${missingMarkers} missing markers).`);
  process.exit(1);
} else {
  console.log('Production Bundle Rights Scan PASSED: Zero restricted strings found, all rights gates present.\n');
  process.exit(0);
}
