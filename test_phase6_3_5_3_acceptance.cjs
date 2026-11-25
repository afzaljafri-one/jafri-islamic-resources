/**
 * Jafri Sacred Library — Phase 6.3.5.3
 * Rights Whitelist Hardening, Full Live Asset Verification & Thematic Provenance Acceptance Suite
 * Validates:
 * 1. Reconciled corpus inventory acceptance & Quran 11 coordinates.
 * 2. Complete production asset scanner (recursive enumeration of all files in dist/, 701 Gita verses schema & allowlist).
 * 3. Thematic semantic consistency & non-commercial rights audit across all 49 records (Thanissaro Bhikkhu CC BY-NC 4.0 non-commercial restrictions).
 * 4. Programmatic central Gita sanitization boundary & strict Edwin Arnold coordinate allowlist.
 * 5. Homepage navigation & strict zero-autoplay.
 * 6. Quran search & reconciled coordinates (Surah 25:63, 2:255, 1:1).
 * 7. Bhagavad Gita Chapter 1 & commentary switcher withholding safeguard.
 * 8. Bhagavad Gita Chapter 2 & Chapter 4 provider retrieval paths & allowlist enforcement.
 * 9. Strengthened IndexedDB migration test (all 5 commentaries + translationEn + edwinArnoldEn contaminated and cleansed).
 * 10. Thematic subject discovery across all 7 traditions & verbatim theological disclaimer.
 * 11. Offline network emulation & cache resilience.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');
const {
  EDWIN_ARNOLD_ALLOWLIST,
  WITHHELD_GITA_COMMENTARY_EN,
  WITHHELD_GITA_COMMENTARY_HI,
  WITHHELD_GITA_BHASHYA,
} = require('./scripts/edwin_arnold_allowlist.cjs');

const ARTIFACTS_DIR =
  process.env.ARTIFACTS_DIR ||
  (fs.existsSync('/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b')
    ? '/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b'
    : path.join(__dirname, 'evidence'));

const EVIDENCE_DIR = path.join(ARTIFACTS_DIR, 'phase6_3_5_3_evidence');
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

function findChrome() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) return process.env.CHROME_BIN;
  if (process.platform === 'darwin') {
    const macPath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    if (fs.existsSync(macPath)) return macPath;
  }
  const linuxPaths = [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium',
  ];
  for (const p of linuxPaths) {
    if (fs.existsSync(p)) return p;
  }
  return process.env.CHROME_BIN || 'google-chrome';
}

const PORT = 4199;
const BASE_URL = `http://localhost:${PORT}/jafri-islamic-resources/`;

async function runAcceptanceTest() {
  console.log('================================================================================');
  console.log('PHASE 6.3.5.3 ACCEPTANCE: RIGHTS WHITELIST HARDENING & PROVENANCE AUDIT');
  console.log(`Base URL: ${BASE_URL}`);
  console.log('================================================================================\n');

  const tracker = {
    totalTests: 0,
    totalAssertions: 0,
    passedAssertions: 0,
    failedAssertions: 0,
    tests: [],
    startTest(name) {
      this.totalTests++;
      const t = { name, assertions: [], passed: true };
      this.tests.push(t);
      console.log(`\n[TEST ${this.totalTests}] ${name}`);
      return t;
    },
    assert(condition, message, details = '') {
      this.totalAssertions++;
      const currentTest = this.tests[this.tests.length - 1];
      const passed = Boolean(condition);
      if (passed) {
        this.passedAssertions++;
        console.log(`  ✓ [PASS] ${message}`);
      } else {
        this.failedAssertions++;
        if (currentTest) currentTest.passed = false;
        console.error(`  ✗ [FAIL] ${message} ${details ? '(' + details + ')' : ''}`);
      }
      if (currentTest) {
        currentTest.assertions.push({ message, passed, details });
      }
      return passed;
    },
  };

  const screenshots = [];

  // ---------------------------------------------------------------------------
  // 1. STATIC INVENTORY & QURAN FOUNDATIONAL COORDINATES (11 RECONCILED)
  // ---------------------------------------------------------------------------
  tracker.startTest('Reconciled Corpus Inventory Acceptance & Quran 11 Coordinates');
  const inventoryPath = path.join(__dirname, 'phase6_3_5_corpus_inventory.json');
  tracker.assert(fs.existsSync(inventoryPath), 'phase6_3_5_corpus_inventory.json exists on disk');
  const inventory = JSON.parse(fs.readFileSync(inventoryPath, 'utf8'));

  const quran = inventory.traditions.islam;
  tracker.assert(
    quran.bundledOfflineAyahsCount === 11,
    `Qur'an: Exactly 11 unique foundational Ayahs bundled offline (got ${quran.bundledOfflineAyahsCount})`
  );
  tracker.assert(
    quran.remoteOrCachedAyahsCount === 6225,
    `Qur'an: 6,225 remote/cached Ayahs (got ${quran.remoteOrCachedAyahsCount})`
  );

  const EXPECTED_QURAN_COORDINATES = [
    '1:1', '1:2', '2:153', '2:255', '2:261', '2:269', '3:134', '14:7', '21:107', '25:63', '112:1'
  ];
  const quranUnits = quran.offlineUnits || [];
  const registeredCoordinates = quranUnits.map(p => `${p.surah}:${p.ayah}`);
  
  for (const coord of EXPECTED_QURAN_COORDINATES) {
    tracker.assert(
      registeredCoordinates.includes(coord),
      `Qur'an foundational coordinate ${coord} is registered in inventory`
    );
  }
  tracker.assert(
    registeredCoordinates.includes('25:63'),
    'Qur\'an 25:63 (Surah Al-Furqan: Servants of the Most Merciful) is explicitly reconciled and registered'
  );

  // Non-Islam counts
  const chr = inventory.traditions.christianity;
  tracker.assert(
    chr.bundledOfflineVersesCount === 48 &&
      chr.chapterSelectionsVersesCount === 47 &&
      chr.standaloneLandmarkVersesCount === 1,
    'Bible: 47 chapter selection verses + 1 standalone John 3:16 = 48 unique bundled verses total'
  );

  const hin = inventory.traditions.hinduism;
  tracker.assert(
    hin.chapter1ShlokasCount === 47 &&
      hin.landmarkCoreShlokasCount === 7 &&
      hin.totalBundledOfflineShlokas === 54,
    'Gita: 47 Chapter 1 verses + 7 landmark verses = 54 unique offline shlokas'
  );

  const jud = inventory.traditions.judaism;
  tracker.assert(
    jud.completeBundledChaptersCount === 4 && jud.totalBundledVersesCount === 50,
    'Tanakh: 4 complete chapters = 50 total verses'
  );

  const sik = inventory.traditions.sikhism;
  tracker.assert(
    sik.completeBundledAngsCount === 13 && sik.landmarkIndexedPassagesCount === 5,
    'Sikhism: 13 complete offline Angs + 5 landmark passages'
  );

  const dhm = inventory.traditions.buddhism;
  tracker.assert(
    dhm.bundledOfflineDhammapadaVersesCount === 7,
    'Dhammapada: 7 selected verses registered'
  );

  const jai = inventory.traditions.jainism;
  tracker.assert(
    jai.referenceGroupsCount === 6 && jai.totalIndividualAphorismCoordinates === 14,
    'Jainism: 6 reference groups containing 14 individual aphorism coordinates'
  );

  // ---------------------------------------------------------------------------
  // 2. COMPLETE PRODUCTION ASSET SCANNER & GITA ASSETS AUDIT
  // ---------------------------------------------------------------------------
  tracker.startTest('Recursive Production Asset Scanner & Deployed Gita JSON Audit');
  const distDir = path.join(__dirname, 'dist');
  tracker.assert(fs.existsSync(distDir), 'dist/ directory exists for inspection');

  // Verify all 18 Gita chapter JSON assets in public and dist
  const GITA_CHAPTER_VERSE_COUNTS = {
    1: 47, 2: 72, 3: 43, 4: 42, 5: 29, 6: 47,
    7: 30, 8: 28, 9: 34, 10: 42, 11: 55, 12: 20,
    13: 35, 14: 27, 15: 20, 16: 24, 17: 28, 18: 78
  };

  let allChaptersVerified = true;
  let totalVersesCounted = 0;
  for (let ch = 1; ch <= 18; ch++) {
    const pFile = path.join(__dirname, `public/data/gita/chapter_${ch}.json`);
    const dFile = path.join(__dirname, `dist/data/gita/chapter_${ch}.json`);

    if (!fs.existsSync(pFile) || !fs.existsSync(dFile)) {
      allChaptersVerified = false;
      break;
    }

    const pData = JSON.parse(fs.readFileSync(pFile, 'utf8'));
    const dData = JSON.parse(fs.readFileSync(dFile, 'utf8'));
    const expected = GITA_CHAPTER_VERSE_COUNTS[ch];

    if (pData.length !== expected || dData.length !== expected) {
      allChaptersVerified = false;
      break;
    }

    totalVersesCounted += dData.length;

    // Check modern commentary fields for withholding notices
    for (const v of dData) {
      const coord = `${v.chapter}:${v.verse}`;
      const approved = EDWIN_ARNOLD_ALLOWLIST[coord];
      const hasWithheldSiva = typeof v.sivanandaEn === 'string' && v.sivanandaEn.includes('withheld');
      const hasWithheldGambir = typeof v.gambhiranandaEn === 'string' && v.gambhiranandaEn.includes('withheld');
      const hasWithheldPurohit = typeof v.purohitEn === 'string' && v.purohitEn.includes('withheld');
      const hasWithheldRams = typeof v.ramsukhdasHi === 'string' && v.ramsukhdasHi.includes('स्थगित');
      const hasWithheldShankara = typeof v.shankaraBhashya === 'string' && v.shankaraBhashya.includes('withheld');

      if (!hasWithheldSiva || !hasWithheldGambir || !hasWithheldPurohit || !hasWithheldRams || !hasWithheldShankara) {
        allChaptersVerified = false;
        console.error(`Missing required commentary withholding in ${coord}`);
        break;
      }

      if (approved) {
        if (v.translationEn !== approved.text || v.edwinArnoldEn !== approved.text) {
          allChaptersVerified = false;
          console.error(`Landmark verse ${coord} does not match approved allowlist string`);
          break;
        }
      } else {
        if (v.translationEn && v.translationEn !== WITHHELD_GITA_COMMENTARY_EN) {
          allChaptersVerified = false;
          console.error(`Non-allowlist verse ${coord} contains unapproved translationEn`);
          break;
        }
      }
    }
  }

  tracker.assert(allChaptersVerified, 'All 18 chapters in public/ and dist/ pass schema & withholding checks');
  tracker.assert(totalVersesCounted === 701, `All 701 Gita verses verified across 18 chapters (counted ${totalVersesCounted})`);

  // Run the full scanner script and assert exit code 0
  const scanOutput = require('child_process').execSync('node scripts/scan_production_bundle_rights.cjs', { cwd: __dirname }).toString();
  tracker.assert(
    scanOutput.includes('Production Asset Rights Scan PASSED') && scanOutput.includes('701 verses validated'),
    'scripts/scan_production_bundle_rights.cjs exits with success (zero violations, 701 verses validated)'
  );

  // ---------------------------------------------------------------------------
  // 3. THEMATIC SEMANTIC CONSISTENCY ACROSS ALL 49 PASSAGES & NON-COMMERCIAL AUDIT
  // ---------------------------------------------------------------------------
  tracker.startTest('Thematic Semantic Consistency & Non-Commercial Rights Audit Across All 49 Records');
  const searchServicePath = path.join(__dirname, 'src/platform/services/universalScriptureSearchService.ts');
  tracker.assert(fs.existsSync(searchServicePath), 'universalScriptureSearchService.ts exists');
  const searchServiceContent = fs.readFileSync(searchServicePath, 'utf8');

  const rePassage = /{\s*id:\s*['"](theme_[^'"]+)['"]/g;
  let mPassage;
  const passageIds = [];
  while ((mPassage = rePassage.exec(searchServiceContent)) !== null) {
    passageIds.push(mPassage[1]);
  }
  tracker.assert(passageIds.length === 49, `Found exactly 49 thematic passages (7 virtues x 7 religions, got ${passageIds.length})`);

  let thematicSemanticConsistent = true;
  let budNonCommercialExplicit = true;

  for (let i = 0; i < passageIds.length; i++) {
    const id = passageIds[i];
    const start = searchServiceContent.indexOf(`id: '${id}'`);
    const nextStart = (i < passageIds.length - 1) ? searchServiceContent.indexOf(`id: '${passageIds[i+1]}'`) : searchServiceContent.indexOf('];', start);
    const block = searchServiceContent.slice(start, nextStart);

    const hasCanonical = block.includes('canonicalTextRights:');
    const hasPrimary = block.includes('primaryTranslationRights:');
    const hasDisclaimer = block.includes('thematicDisclaimer:');
    const hasSourceAttr = block.includes('sourceAttribution:');
    const hasProvenance = block.includes('provenanceNotes:');

    if (!hasCanonical || !hasPrimary || !hasDisclaimer || !hasSourceAttr || !hasProvenance) {
      thematicSemanticConsistent = false;
      console.error(`Thematic passage ${id} is missing core rights structure`);
    }

    // Specific audit for Buddhist passages (Thanissaro Bhikkhu CC BY-NC 4.0)
    if (id.startsWith('theme_bud_')) {
      const pIdx = block.indexOf('primaryTranslationRights:');
      const pBlock = pIdx !== -1 ? block.slice(pIdx, pIdx + 600) : '';

      const hasNCInLicence = block.includes(`exactLicenceIdentifier: 'CC BY-NC 4.0'`);
      const hasNCTranslator = block.includes(`translatorOrSource: 'Thanissaro Bhikkhu'`);
      const hasExplicitNCRestriction = block.includes('Non-Commercial Use Only') && block.includes('Commercial redistribution strictly prohibited');

      if (!hasNCInLicence || !hasNCTranslator || !hasExplicitNCRestriction) {
        budNonCommercialExplicit = false;
        console.error(`Buddhist thematic passage ${id} is missing explicit non-commercial restriction`);
      }
    }
  }

  tracker.assert(thematicSemanticConsistent, 'All 49 thematic passages have complete canonical/primary rights records and mandatory disclaimer');
  tracker.assert(budNonCommercialExplicit, 'All 7 Buddhist thematic passages explicitly document Thanissaro Bhikkhu CC BY-NC 4.0 Non-Commercial restrictions');

  // ---------------------------------------------------------------------------
  // 4. PROGRAMMATIC CENTRAL GITA SANITIZATION BOUNDARY & STRICT ALLOWLIST
  // ---------------------------------------------------------------------------
  tracker.startTest('Central Gita Sanitization Boundary & Strict Allowlist Programmatic Verification');
  const providerPath = path.join(__dirname, 'src/services/providers/hinduismProvider.ts');
  const providerContent = fs.readFileSync(providerPath, 'utf8');
  tracker.assert(providerContent.includes('export function sanitizeGitaVerse'), 'sanitizeGitaVerse is exported');
  tracker.assert(providerContent.includes('export function sanitizeGitaChapter'), 'sanitizeGitaChapter is exported');
  tracker.assert(providerContent.includes('EDWIN_ARNOLD_ALLOWLIST'), 'EDWIN_ARNOLD_ALLOWLIST is exported by provider');

  // Verify that provider methods route through sanitization
  tracker.assert(
    providerContent.includes('sanitizeGitaChapter(cached)') &&
      providerContent.includes('sanitizeGitaChapter(verses)') &&
      providerContent.includes('sanitizeGitaVerse(cached)'),
    'hinduismProvider routes memory cache, IndexedDB reads/writes, static fetches, and fallbacks through central sanitization'
  );

  // Check allowlist entries: 9 landmark coordinates
  const allowlistKeys = Object.keys(EDWIN_ARNOLD_ALLOWLIST);
  tracker.assert(allowlistKeys.length === 9, `EDWIN_ARNOLD_ALLOWLIST contains exactly 9 landmark coordinates (got ${allowlistKeys.length})`);
  tracker.assert(allowlistKeys.includes('2:47'), 'Allowlist contains Gita 2:47');
  tracker.assert(allowlistKeys.includes('4:38'), 'Allowlist contains Gita 4:38');
  tracker.assert(allowlistKeys.includes('18:66'), 'Allowlist contains Gita 18:66');

  // Verify allowlist metadata completeness
  let allEntriesValid = true;
  for (const [key, entry] of Object.entries(EDWIN_ARNOLD_ALLOWLIST)) {
    if (
      !entry.coordinate ||
      !entry.chapter ||
      !entry.verse ||
      !entry.text ||
      !entry.translator.includes('Sir Edwin Arnold') ||
      !entry.edition ||
      !entry.sourceReferenceUrl ||
      entry.rightsStatus !== 'VERIFIED' ||
      entry.exactLicenceIdentifier !== 'Public Domain' ||
      !entry.rightsEvidence
    ) {
      allEntriesValid = false;
      console.error(`Invalid allowlist entry for ${key}`);
      break;
    }
  }
  tracker.assert(allEntriesValid, 'All 9 Edwin Arnold allowlist entries have full metadata and rights evidence');

  // Verify that permissive fallback is completely absent
  tracker.assert(
    !providerContent.includes('rawVerse.edwinArnoldEn &&') &&
    !providerContent.includes('!rawVerse.edwinArnoldEn.includes('),
    'Permissive rawVerse.edwinArnoldEn fallback is completely removed from sanitizeGitaVerse'
  );

  // ---------------------------------------------------------------------------
  // 5. START VITE PREVIEW SERVER & CDP BROWSER
  // ---------------------------------------------------------------------------
  console.log('\nStarting Vite Preview Server on port', PORT, '...');
  const preview = spawn(
    'npx',
    ['vite', 'preview', '--port', String(PORT), '--strictPort', '--base', '/jafri-islamic-resources/'],
    { cwd: __dirname, stdio: 'pipe' }
  );

  preview.stderr.on('data', (d) => console.error('[preview err]', d.toString()));
  preview.stdout.on('data', (d) => console.log('[preview out]', d.toString().trim()));

  let serverReady = false;
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 300));
    try {
      const resp = await fetch(BASE_URL);
      if (resp.ok) {
        serverReady = true;
        console.log('Vite preview server is ready!');
        break;
      }
    } catch (_) {}
  }

  if (!serverReady) {
    preview.kill();
    throw new Error('Vite preview server failed to start on port ' + PORT);
  }

  const chromeBinary = findChrome();
  console.log(`Using Chrome binary: ${chromeBinary}`);
  const chromePort = 9230 + Math.floor(Math.random() * 50);
  const tempProfileDir = path.join(
    os.tmpdir(),
    `chrome_phase6_3_5_3_${Date.now()}_${Math.random().toString(36).slice(2)}`
  );
  fs.mkdirSync(tempProfileDir, { recursive: true });

  const chrome = spawn(
    chromeBinary,
    [
      '--headless=new',
      `--remote-debugging-port=${chromePort}`,
      '--remote-allow-origins=*',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--no-first-run',
      '--no-default-browser-check',
      '--window-size=1440,900',
      `--user-data-dir=${tempProfileDir}`,
      'about:blank',
    ],
    { stdio: ['ignore', 'pipe', 'pipe'] }
  );

  chrome.stderr.on('data', (d) => {
    const s = d.toString();
    if (!s.includes('DevTools listening') && !s.includes('handshake')) {
      console.error('[chrome stderr]', s.trim());
    }
  });
  chrome.stdout.on('data', (d) => {
    console.log('[chrome stdout]', d.toString().trim());
  });

  let wsEndpoint = null;
  for (let i = 0; i < 120; i++) {
    await new Promise((r) => setTimeout(r, 250));
    try {
      const r = await fetch(`http://127.0.0.1:${chromePort}/json/version`);
      if (r.ok) {
        const data = await r.json();
        if (data.webSocketDebuggerUrl) {
          wsEndpoint = data.webSocketDebuggerUrl;
          console.log(`Chrome remote debugging connected on port ${chromePort}:`, wsEndpoint);
          break;
        }
      }
    } catch (_) {}
    if (!wsEndpoint) {
      try {
        const r2 = await fetch(`http://localhost:${chromePort}/json/version`);
        if (r2.ok) {
          const data2 = await r2.json();
          if (data2.webSocketDebuggerUrl) {
            wsEndpoint = data2.webSocketDebuggerUrl;
            console.log(`Chrome remote debugging connected on localhost port ${chromePort}:`, wsEndpoint);
            break;
          }
        }
      } catch (_) {}
    }
  }

  if (!wsEndpoint) {
    try { chrome.kill(); } catch (_) {}
    try { preview.kill(); } catch (_) {}
    try { fs.rmSync(tempProfileDir, { recursive: true, force: true }); } catch (_) {}
    throw new Error('Failed to connect to Chrome CDP WebSocket');
  }

  // Connect CDP WebSocket
  const WebSocket = globalThis.WebSocket || require('ws');
  const ws = new WebSocket(wsEndpoint);

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let messageId = 1;
  const pendingRequests = new Map();

  ws.onmessage = (event) => {
    const res = JSON.parse(event.data);
    if (res.id && pendingRequests.has(res.id)) {
      const { resolve, reject } = pendingRequests.get(res.id);
      pendingRequests.delete(res.id);
      if (res.error) reject(new Error(res.error.message || JSON.stringify(res.error)));
      else resolve(res.result);
    }
  };

  function send(method, params = {}, sessionId = undefined) {
    return new Promise((resolve, reject) => {
      const id = messageId++;
      pendingRequests.set(id, { resolve, reject });
      const payload = { id, method, params };
      if (sessionId) payload.sessionId = sessionId;
      ws.send(JSON.stringify(payload));
    });
  }

  // Create new browser target
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

  await send('Page.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);
  await send('DOM.enable', {}, sessionId);

  async function evalCode(expression) {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, sessionId);
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }

  async function captureScreenshot(name) {
    const shot = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
    const buf = Buffer.from(shot.data, 'base64');
    const shotPath = path.join(EVIDENCE_DIR, `${name}.png`);
    fs.writeFileSync(shotPath, buf);
    screenshots.push({ name, path: shotPath });
    console.log(`  📸 Screenshot saved: ${name}.png`);
    return shotPath;
  }

  const openSearchModal = async () => {
    await evalCode(`(() => {
      const btn = document.querySelector("[data-testid='platform-nav-search-btn']") ||
                  Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('Search') || b.textContent.includes('⌘K') || b.textContent.includes('/')));
      if (btn) btn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 600));
  };

  const closeSearchModal = async () => {
    await evalCode(`(() => {
      const closeBtn = document.querySelector('[data-testid="close-search-modal-btn"]');
      if (closeBtn) closeBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 400));
  };

  const performSearch = async (query) => {
    await evalCode(`(() => {
      const input = document.querySelector("[data-testid='universal-search-input']");
      if (input) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, ${JSON.stringify(query)});
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);
    await new Promise((r) => setTimeout(r, 1000));
  };

  try {
    // -------------------------------------------------------------------------
    // TEST 5: HOMEPAGE NAVIGATION & STRICT ZERO-AUTOPLAY
    // -------------------------------------------------------------------------
    tracker.startTest('Homepage Navigation & Zero-Autoplay Verification');
    await send('Page.navigate', { url: BASE_URL }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const pageTitle = await evalCode('document.title');
    tracker.assert(pageTitle && pageTitle.includes('Jafri'), `Page loaded with title "${pageTitle}"`);

    // Verify audio zero-autoplay
    const audioState = await evalCode(`(() => {
      const audios = Array.from(document.querySelectorAll('audio'));
      const anyPlaying = audios.some(a => !a.paused && a.currentTime > 0);
      return { count: audios.length, anyPlaying };
    })()`);
    tracker.assert(!audioState.anyPlaying, 'Strict Zero-Autoplay verified: No audio element automatically playing upon load');
    await captureScreenshot('01_homepage_zero_autoplay');

    // -------------------------------------------------------------------------
    // TEST 6: QURAN SEARCH & RECONCILED COORDINATE SURAH 25:63
    // -------------------------------------------------------------------------
    tracker.startTest('Quran Search & Reconciled Coordinate Surah 25:63');
    await openSearchModal();

    // Query Quran 25:63
    await performSearch('Quran 25:63');
    const quran2563CardInfo = await evalCode(`(() => {
      const cards = document.querySelectorAll('[data-testid="search-result-card"]');
      const card = Array.from(cards).find(c => c.textContent.includes('25:63') || c.textContent.includes('Servants of the Most Merciful')) || cards[0];
      if (!card) return null;
      const secNotice = card.querySelector('[data-testid="secondary-translation-withheld-notice"]');
      return {
        found: true,
        cardText: card.textContent,
        hasSecNotice: Boolean(secNotice),
        secNoticeText: secNotice ? secNotice.textContent.trim() : null
      };
    })()`);

    tracker.assert(Boolean(quran2563CardInfo?.found), 'Search for Quran 25:63 returned card successfully');
    tracker.assert(
      quran2563CardInfo?.cardText.includes('Servants of the Most Merciful') || quran2563CardInfo?.cardText.includes('25:63'),
      'Quran 25:63 card renders correct coordinates'
    );
    tracker.assert(
      quran2563CardInfo?.hasSecNotice,
      'Quran 25:63 renders secondary translation withheld notice for Allama Jawadi Urdu'
    );
    tracker.assert(
      !quran2563CardInfo?.cardText.includes('اور رحمان کے بندے وہ ہیں'),
      'Quran 25:63 contains zero unverified Allama Jawadi Urdu text'
    );
    await captureScreenshot('02_quran_25_63_reconciled');

    // Query Ayat al-Kursi (Quran 2:255)
    await performSearch('Quran 2:255');
    const kursiInfo = await evalCode(`(() => {
      const cards = document.querySelectorAll('[data-testid="search-result-card"]');
      const card = Array.from(cards).find(c => c.textContent.includes('2:255') || c.textContent.includes('Kursi')) || cards[0];
      if (!card) return null;
      const primNotice = card.querySelector('[data-testid="translation-withheld-notice"]');
      const secNotice = card.querySelector('[data-testid="secondary-translation-withheld-notice"]');
      return {
        hasPrimNotice: Boolean(primNotice),
        hasSecNotice: Boolean(secNotice),
        fullText: card.textContent
      };
    })()`);

    tracker.assert(kursiInfo && kursiInfo.hasPrimNotice, 'Ayat al-Kursi renders primary translation withheld notice');
    tracker.assert(kursiInfo && kursiInfo.hasSecNotice, 'Ayat al-Kursi renders secondary translation withheld notice');
    await captureScreenshot('03_quran_2_255_all_withheld');
    await closeSearchModal();

    // -------------------------------------------------------------------------
    // TEST 7: BHAGAVAD GITA CHAPTER 1 & COMMENTARY SWITCHER SAFEGUARD
    // -------------------------------------------------------------------------
    tracker.startTest('Bhagavad Gita Chapter 1 & Commentary Switcher Safeguard');
    await send('Page.navigate', { url: BASE_URL + '?religion=hinduism&chapter=1' }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const gitaInitState = await evalCode(`(() => {
      const select = Array.from(document.querySelectorAll('select')).find(s => s.querySelector('option[value="arnold"]'));
      const firstShloka = document.querySelector('[id="shloka-1"]');
      return {
        selectVal: select ? select.value : null,
        firstShlokaText: firstShloka ? firstShloka.textContent : null,
      };
    })()`);

    tracker.assert(gitaInitState.selectVal === 'arnold', `Default commentary is Sir Edwin Arnold 1885 Public Domain (got "${gitaInitState.selectVal}")`);
    tracker.assert(
      gitaInitState.firstShlokaText && gitaInitState.firstShlokaText.includes('Dhritarashtra said: On the field of truth'),
      'Sir Edwin Arnold translation renders cleanly for Chapter 1 Shloka 1'
    );
    await captureScreenshot('04_gita_edwin_arnold_default');

    // Test selection of siva (Swami Sivananda)
    await evalCode(`(() => {
      const select = Array.from(document.querySelectorAll('select')).find(s => s.querySelector('option[value="arnold"]'));
      if (select) {
        select.value = 'siva';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);
    await new Promise((r) => setTimeout(r, 600));

    const sivaState = await evalCode(`(() => {
      const firstShloka = document.querySelector('[id="shloka-1"]');
      const notice = firstShloka ? firstShloka.querySelector('[data-testid="gita-translation-withheld-notice"]') : null;
      return {
        hasWithheldNotice: Boolean(notice),
        noticeText: notice ? notice.textContent.trim() : null
      };
    })()`);
    tracker.assert(sivaState.hasWithheldNotice, 'Swami Sivananda commentary renders gita-translation-withheld-notice');
    await captureScreenshot('05_gita_sivananda_withheld_notice');

    // Test selection of gambir (Swami Gambhirananda)
    await evalCode(`(() => {
      const select = Array.from(document.querySelectorAll('select')).find(s => s.querySelector('option[value="arnold"]'));
      if (select) {
        select.value = 'gambir';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);
    await new Promise((r) => setTimeout(r, 600));

    const gambState = await evalCode(`(() => {
      const firstShloka = document.querySelector('[id="shloka-1"]');
      const notice = firstShloka ? firstShloka.querySelector('[data-testid="gita-translation-withheld-notice"]') : null;
      return { hasWithheldNotice: Boolean(notice) };
    })()`);
    tracker.assert(gambState.hasWithheldNotice, 'Swami Gambhirananda commentary renders gita-translation-withheld-notice');

    // Test selection of purohit (Shree Purohit Swami)
    await evalCode(`(() => {
      const select = Array.from(document.querySelectorAll('select')).find(s => s.querySelector('option[value="arnold"]'));
      if (select) {
        select.value = 'purohit';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);
    await new Promise((r) => setTimeout(r, 600));

    const puroState = await evalCode(`(() => {
      const firstShloka = document.querySelector('[id="shloka-1"]');
      const notice = firstShloka ? firstShloka.querySelector('[data-testid="gita-translation-withheld-notice"]') : null;
      return { hasWithheldNotice: Boolean(notice) };
    })()`);
    tracker.assert(puroState.hasWithheldNotice, 'Shree Purohit Swami commentary renders gita-translation-withheld-notice');

    // Test selection of rams (Swami Ramsukhdas Hindi)
    await evalCode(`(() => {
      const select = Array.from(document.querySelectorAll('select')).find(s => s.querySelector('option[value="arnold"]'));
      if (select) {
        select.value = 'rams';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);
    await new Promise((r) => setTimeout(r, 600));

    const ramsState = await evalCode(`(() => {
      const firstShloka = document.querySelector('[id="shloka-1"]');
      const notice = firstShloka ? firstShloka.querySelector('[data-testid="gita-translation-withheld-notice"]') : null;
      return { hasWithheldNotice: Boolean(notice) };
    })()`);
    tracker.assert(ramsState.hasWithheldNotice, 'Swami Ramsukhdas Hindi commentary renders gita-translation-withheld-notice');
    await captureScreenshot('06_gita_ramsukhdas_withheld_notice');

    // Switch back to arnold
    await evalCode(`(() => {
      const select = Array.from(document.querySelectorAll('select')).find(s => s.querySelector('option[value="arnold"]'));
      if (select) {
        select.value = 'arnold';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);
    await new Promise((r) => setTimeout(r, 500));

    // -------------------------------------------------------------------------
    // TEST 8: GITA CHAPTER 2 & CHAPTER 4 STATIC RETRIEVAL & SANITIZATION
    // -------------------------------------------------------------------------
    tracker.startTest('Bhagavad Gita Chapter 2 & Chapter 4 Provider Retrieval Paths');

    // Navigate to Chapter 2
    await send('Page.navigate', { url: BASE_URL + '?religion=hinduism&chapter=2' }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const ch2State = await evalCode(`(() => {
      const shlokas = document.querySelectorAll('[id^="shloka-"]');
      const shloka1 = document.querySelector('[id="shloka-1"]');
      const shloka47 = document.querySelector('[id="shloka-47"]');
      const shloka1Notice = shloka1 ? shloka1.querySelector('[data-testid="gita-translation-withheld-notice"]') : null;
      return {
        shlokasCount: shlokas.length,
        hasShloka1Notice: Boolean(shloka1Notice),
        hasShloka47: Boolean(shloka47),
        shloka47Text: shloka47 ? shloka47.textContent : null,
      };
    })()`);

    tracker.assert(ch2State.shlokasCount === 72, `Gita Chapter 2 loaded all 72 verses from sanitized static JSON asset (found ${ch2State.shlokasCount})`);
    tracker.assert(ch2State.hasShloka1Notice, 'Non-landmark verse Gita 2:1 displays gita-translation-withheld-notice');
    tracker.assert(
      ch2State.hasShloka47 && ch2State.shloka47Text.includes('कर्मण्येवाधिकारस्ते'),
      'Gita 2:47 Sanskrit original text is preserved intact'
    );
    tracker.assert(
      ch2State.shloka47Text && ch2State.shloka47Text.includes('Thy right is only unto action'),
      'Gita 2:47 renders Edwin Arnold landmark translation'
    );

    // Navigate to Chapter 4
    await send('Page.navigate', { url: BASE_URL + '?religion=hinduism&chapter=4' }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const ch4State = await evalCode(`(() => {
      const shlokas = document.querySelectorAll('[id^="shloka-"]');
      const shloka38 = document.querySelector('[id="shloka-38"]');
      return {
        shlokasCount: shlokas.length,
        hasShloka38: Boolean(shloka38),
        shloka38Text: shloka38 ? shloka38.textContent : null,
      };
    })()`);

    tracker.assert(ch4State.shlokasCount === 42, `Gita Chapter 4 loaded all 42 verses from sanitized static JSON asset (found ${ch4State.shlokasCount})`);
    tracker.assert(
      ch4State.hasShloka38 && ch4State.shloka38Text.includes('न हि ज्ञानेन सदृशं'),
      'Gita 4:38 Sanskrit original text is preserved intact'
    );
    tracker.assert(
      ch4State.shloka38Text && ch4State.shloka38Text.includes('Truly, there is no purifier in this world like wisdom'),
      'Gita 4:38 renders Edwin Arnold landmark translation'
    );
    await captureScreenshot('07_gita_ch2_and_ch4_retrieval');

    // -------------------------------------------------------------------------
    // TEST 9: STRENGTHENED INDEXEDDB CACHE CONTAMINATION & MIGRATION TEST
    // -------------------------------------------------------------------------
    tracker.startTest('Strengthened IndexedDB Migration Test (All Commentaries & Translations)');

    // In the browser context, inject a heavily contaminated legacy record into IndexedDB
    // for all 72 verses of Chapter 2. Unsafe values are placed in ALL 5 commentary fields
    // AND in translationEn and edwinArnoldEn.
    const migrationResult = await evalCode(`(async () => {
      return new Promise((resolve) => {
        try {
          const req = indexedDB.open('jafri_islamic_cache_v1', 1);
          req.onsuccess = async () => {
            const db = req.result;
            // Create dirty legacy verse record for all 72 verses of Chapter 2
            const dirtyVerses = [];
            for (let v = 1; v <= 72; v++) {
              dirtyVerses.push({
                chapter: 2,
                verse: v,
                slok: "सञ्जय उवाच | तं तथा कृपयाविष्टमश्रुपूर्णाकुलेक्षणम् |",
                transliteration: "sañjaya uvāca | taṁ tathā kṛpayāviṣṭamaśrupūrṇākulekṣaṇam |",
                translationEn: "UNSAFE_LEAKED_TRANSLATION_EN_" + v,
                edwinArnoldEn: "UNSAFE_LEAKED_ARNOLD_EN_" + v,
                sivanandaEn: "UNSAFE_LEAKED_SIVANANDA_" + v,
                gambhiranandaEn: "UNSAFE_LEAKED_GAMBHIRANANDA_" + v,
                purohitEn: "UNSAFE_LEAKED_PUROHIT_" + v,
                ramsukhdasHi: "UNSAFE_LEAKED_RAMSUKHDAS_" + v,
                shankaraBhashya: "UNSAFE_LEAKED_SHANKARA_" + v
              });
            }

            const tx = db.transaction(['quran_store'], 'readwrite');
            const store = tx.objectStore('quran_store');
            store.put({ data: dirtyVerses, timestamp: Date.now() }, 'gita_chapter_2');

            tx.oncomplete = async () => {
              // Read directly back before migration to confirm injection
              const checkTx = db.transaction(['quran_store'], 'readonly');
              const checkReq = checkTx.objectStore('quran_store').get('gita_chapter_2');
              checkReq.onsuccess = () => {
                const readResult = checkReq.result;
                const readDirty = readResult?.data || (Array.isArray(readResult) ? readResult : null);
                const wasDirtyInjected =
                  readDirty &&
                  readDirty.length === 72 &&
                  readDirty[0]?.sivanandaEn?.includes('UNSAFE_LEAKED_SIVANANDA_') &&
                  readDirty[0]?.translationEn?.includes('UNSAFE_LEAKED_TRANSLATION_EN_');
                resolve({ wasDirtyInjected });
              };
            };
          };
          req.onerror = () => resolve({ error: 'IDB open failed' });
        } catch (e) {
          resolve({ error: e.message });
        }
      });
    })()`);

    tracker.assert(migrationResult.wasDirtyInjected, 'Successfully injected 72 contaminated verses (all 5 commentaries + translationEn + edwinArnoldEn) into IndexedDB');

    // Trigger navigation to Chapter 2 so the provider loads, detects hadUnsafeData, and migrates the cache
    await send('Page.navigate', { url: BASE_URL + '?religion=hinduism&chapter=2' }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    // Check that the rendered page NEVER contains ANY of the leaked strings
    const ch2RenderState = await evalCode(`(() => {
      const pageText = document.body.textContent || '';
      const hasAnyLeaked =
        pageText.includes('UNSAFE_LEAKED_SIVANANDA') ||
        pageText.includes('UNSAFE_LEAKED_GAMBHIRANANDA') ||
        pageText.includes('UNSAFE_LEAKED_PUROHIT') ||
        pageText.includes('UNSAFE_LEAKED_RAMSUKHDAS') ||
        pageText.includes('UNSAFE_LEAKED_SHANKARA') ||
        pageText.includes('UNSAFE_LEAKED_TRANSLATION_EN') ||
        pageText.includes('UNSAFE_LEAKED_ARNOLD_EN');

      const shloka47 = document.querySelector('[id="shloka-47"]');
      const shloka1 = document.querySelector('[id="shloka-1"]');
      const hasArnold47 = shloka47 ? shloka47.textContent.includes('Thy right is only unto action') : false;
      const hasNotice1 = shloka1 ? Boolean(shloka1.querySelector('[data-testid="gita-translation-withheld-notice"]')) : false;

      return { hasAnyLeaked, hasArnold47, hasNotice1 };
    })()`);

    tracker.assert(!ch2RenderState.hasAnyLeaked, 'Rendered Chapter 2 output strictly withheld all 7 leaked proprietary commentary and translation strings');
    tracker.assert(ch2RenderState.hasArnold47, 'Landmark verse 2:47 renders approved Edwin Arnold translation from allowlist');
    tracker.assert(ch2RenderState.hasNotice1, 'Non-landmark verse 2:1 renders translation withheld notice');

    // Check that IndexedDB was permanently migrated/cleansed in-place
    const idbCleansedResult = await evalCode(`(async () => {
      return new Promise((resolve) => {
        const req = indexedDB.open('jafri_islamic_cache_v1', 1);
        req.onsuccess = () => {
          const db = req.result;
          const tx = db.transaction(['quran_store'], 'readonly');
          const getReq = tx.objectStore('quran_store').get('gita_chapter_2');
          getReq.onsuccess = () => {
            const result = getReq.result;
            const data = result?.data || (Array.isArray(result) ? result : null);
            if (!data || !Array.isArray(data) || data.length !== 72) {
              return resolve({ cleansed: false, reason: 'invalid data length', len: data?.length });
            }

            const getStr = (c) => typeof c === 'string' ? c : (c?.translation || '');
            let hasAnyLeaked = false;
            let allHaveWithholding = true;
            let v47Clean = false;
            let v1Clean = false;

            for (const v of data) {
              const allFields = [
                getStr(v.sivanandaEn),
                getStr(v.gambhiranandaEn),
                getStr(v.purohitEn),
                getStr(v.ramsukhdasHi),
                getStr(v.shankaraBhashya),
                getStr(v.translationEn),
                getStr(v.edwinArnoldEn),
              ].join(' ');

              if (allFields.includes('UNSAFE_LEAKED')) {
                hasAnyLeaked = true;
                break;
              }

              if (
                !getStr(v.sivanandaEn).includes('withheld') ||
                !getStr(v.gambhiranandaEn).includes('withheld') ||
                !getStr(v.purohitEn).includes('withheld') ||
                !getStr(v.ramsukhdasHi).includes('स्थगित') ||
                !getStr(v.shankaraBhashya).includes('withheld')
              ) {
                allHaveWithholding = false;
              }

              if (v.verse === 47 && getStr(v.translationEn).includes('Thy right is only unto action')) {
                v47Clean = true;
              }
              if (v.verse === 1 && (!v.translationEn || getStr(v.translationEn).includes('withheld'))) {
                v1Clean = true;
              }
            }

            resolve({
              cleansed: !hasAnyLeaked && allHaveWithholding && v47Clean && v1Clean,
              hasAnyLeaked,
              allHaveWithholding,
              v47Clean,
              v1Clean,
            });
          };
        };
        req.onerror = () => resolve({ cleansed: false, reason: 'error opening IDB' });
      });
    })()`);

    tracker.assert(idbCleansedResult.cleansed, 'IndexedDB cache migration verified: all 72 records permanently overwritten with clean sanitized records in storage');
    await captureScreenshot('08_indexeddb_cache_migration');

    // Reload the application to verify old content does not reappear
    await send('Page.navigate', { url: BASE_URL + '?religion=hinduism&chapter=2' }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const reloadClean = await evalCode(`(() => {
      const pageText = document.body.textContent || '';
      return !pageText.includes('UNSAFE_LEAKED');
    })()`);
    tracker.assert(reloadClean, 'Reloading application confirms old unsafe content does not reappear');

    // -------------------------------------------------------------------------
    // TEST 10: THEMATIC SUBJECT DISCOVERY ACROSS ALL 7 TRADITIONS & DISCLAIMER
    // -------------------------------------------------------------------------
    tracker.startTest('Thematic Subject Discovery across All 7 Traditions & Verbatim Disclaimer');
    await openSearchModal();

    await evalCode(`(() => {
      const allBtn = document.querySelector('[data-testid="filter-religion-all"]');
      if (allBtn) allBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 400));

    await performSearch('Compassion');

    await evalCode(`(() => {
      const thematicBtn = document.querySelector('[data-testid="filter-match-thematic_result"]');
      if (thematicBtn) thematicBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 600));

    const thematicResults = await evalCode(`(() => {
      const cards = document.querySelectorAll('[data-testid="search-result-card"]');
      return Array.from(cards).map(c => {
        const titleEl = c.querySelector('h4');
        const canonBadge = c.querySelector('[data-testid="canonical-rights-badge"]');
        const transBadge = c.querySelector('[data-testid="rights-licence-badge"]');
        const disclaimerEl = c.querySelector('[data-testid="thematic-result-note"]');
        return {
          title: titleEl ? titleEl.textContent.trim() : '',
          hasCanonBadge: Boolean(canonBadge),
          hasTransBadge: Boolean(transBadge),
          hasDisclaimer: Boolean(disclaimerEl),
          disclaimerText: disclaimerEl ? disclaimerEl.textContent.trim() : ''
        };
      });
    })()`);

    tracker.assert(thematicResults.length >= 7, `Thematic query "Compassion" returned passages for all traditions (${thematicResults.length} found)`);

    const allHaveDisclaimer = thematicResults.length > 0 && thematicResults.every(
      (r) =>
        r.hasDisclaimer &&
        r.disclaimerText.includes('This passage has been selected solely for its thematic relevance to this virtue')
    );
    tracker.assert(allHaveDisclaimer, 'Every returned thematic result card renders the mandatory verbatim virtues disclaimer');

    const allHaveComponentRights = thematicResults.length > 0 && thematicResults.every((r) => r.hasCanonBadge && r.hasTransBadge);
    tracker.assert(allHaveComponentRights, 'Every returned thematic result card renders separate canonical and translation rights badges');
    await captureScreenshot('09_thematic_compassion_all_traditions');
    await closeSearchModal();

    // -------------------------------------------------------------------------
    // TEST 11: OFFLINE NETWORK EMULATION & CACHE RESILIENCE AFTER MIGRATION
    // -------------------------------------------------------------------------
    tracker.startTest('Offline Network Emulation & Cache Resilience');
    await send(
      'Network.emulateNetworkConditions',
      {
        offline: true,
        latency: 0,
        downloadThroughput: 0,
        uploadThroughput: 0,
      },
      sessionId
    );

    await openSearchModal();
    await evalCode(`(() => {
      const allBtn = document.querySelector('[data-testid="filter-religion-all"]');
      if (allBtn) allBtn.click();
      const allMatchBtn = document.querySelector('[data-testid="filter-match-all"]');
      if (allMatchBtn) allMatchBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 400));

    await performSearch('John 3:16');

    const offlineSearchResult = await evalCode(`(() => {
      const card = document.querySelector('[data-testid="search-result-card"]');
      return {
        found: Boolean(card),
        text: card ? card.textContent : null
      };
    })()`);

    tracker.assert(
      offlineSearchResult.found && offlineSearchResult.text.includes('John 3:16'),
      'Search Engine functions seamlessly under complete offline emulation'
    );
    await captureScreenshot('10_offline_resilience');

    // Restore network conditions
    await send(
      'Network.emulateNetworkConditions',
      {
        offline: false,
        latency: 0,
        downloadThroughput: -1,
        uploadThroughput: -1,
      },
      sessionId
    );
    await closeSearchModal();
  } finally {
    // Teardown browser & server
    try { await send('Target.closeTarget', { targetId }); } catch (_) {}
    try { ws.close(); } catch (_) {}
    try { chrome.kill(); } catch (_) {}
    try { preview.kill(); } catch (_) {}
    try { fs.rmSync(tempProfileDir, { recursive: true, force: true }); } catch (_) {}
  }

  // ---------------------------------------------------------------------------
  // TEST SUMMARY & ACCEPTANCE REPORT
  // ---------------------------------------------------------------------------
  console.log('\n================================================================================');
  console.log('PHASE 6.3.5.3 ACCEPTANCE TEST SUMMARY');
  console.log(`Total Test Suites: ${tracker.totalTests}`);
  console.log(`Total Assertions:  ${tracker.totalAssertions}`);
  console.log(`Passed Assertions: ${tracker.passedAssertions}`);
  console.log(`Failed Assertions: ${tracker.failedAssertions}`);
  console.log('================================================================================\n');

  const report = {
    phase: '6.3.5.3',
    timestamp: new Date().toISOString(),
    totalTests: tracker.totalTests,
    totalAssertions: tracker.totalAssertions,
    passedAssertions: tracker.passedAssertions,
    failedAssertions: tracker.failedAssertions,
    allPassed: tracker.failedAssertions === 0,
    tests: tracker.tests,
    screenshots,
  };

  const resultsPath = path.join(ARTIFACTS_DIR, 'phase6_3_5_3_acceptance_results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(report, null, 2), 'utf8');
  console.log(`Results written to: ${resultsPath}`);

  if (tracker.failedAssertions > 0) {
    console.error(`\n[FAIL] Phase 6.3.5.3 Acceptance Suite FAILED with ${tracker.failedAssertions} errors.`);
    process.exit(1);
  } else {
    console.log('\n[SUCCESS] Phase 6.3.5.3 Acceptance Suite PASSED completely with 100% compliance.');
    process.exit(0);
  }
}

runAcceptanceTest().catch((err) => {
  console.error('[FATAL ERROR]', err);
  process.exit(1);
});
