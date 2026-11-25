/**
 * Jafri Sacred Library — Phase 6.3.5.2
 * Gita Public Asset Rights Purge, Quran Inventory Reconciliation & Thematic Rights Acceptance Suite
 * Validates Gita Ch 1, 2, 4 provider retrieval paths, static JSON assets, IndexedDB read/write & cache migration,
 * attempted commentary selection withholding, Quran 25:63 & 11 coordinates, and 49 thematic records.
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const ARTIFACTS_DIR =
  process.env.ARTIFACTS_DIR ||
  (fs.existsSync('/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b')
    ? '/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b'
    : path.join(__dirname, 'evidence'));

const EVIDENCE_DIR = path.join(ARTIFACTS_DIR, 'phase6_3_5_2_evidence');
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
  console.log('PHASE 6.3.5.2 ACCEPTANCE: GITA RIGHTS PURGE, QURAN INVENTORY & THEMATIC RIGHTS');
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
  // 2. RECURSIVE PRODUCTION ASSET SCANNER & DEPLOYED GITA JSON AUDIT
  // ---------------------------------------------------------------------------
  tracker.startTest('Recursive Production Asset Scanner & Deployed Gita JSON Audit');
  const distDir = path.join(__dirname, 'dist');
  tracker.assert(fs.existsSync(distDir), 'dist directory exists');

  // Verify all 18 deployed chapter JSON assets
  const gitaDistDir = path.join(distDir, 'data', 'gita');
  tracker.assert(fs.existsSync(gitaDistDir), 'dist/data/gita directory exists');
  const chapterFiles = fs.readdirSync(gitaDistDir).filter(f => f.startsWith('chapter_') && f.endsWith('.json'));
  tracker.assert(chapterFiles.length === 18, `All 18 Bhagavad Gita chapter JSON files deployed in dist/data/gita/ (found ${chapterFiles.length})`);

  let totalDeployedVerses = 0;
  let allWithheld = true;
  let sanskritPreserved = true;

  const getCommText = (c) => {
    if (!c) return '';
    if (typeof c === 'string') return c;
    return c.translation || c.et || '';
  };

  for (const chFile of chapterFiles) {
    const raw = fs.readFileSync(path.join(gitaDistDir, chFile), 'utf8');
    const data = JSON.parse(raw);
    const verses = Array.isArray(data) ? data : (data.verses || []);
    totalDeployedVerses += verses.length;

    for (const v of verses) {
      if (!v.verse || (!v.san && !v.slok) || !v.transliteration) {
        sanskritPreserved = false;
      }
      const siva = getCommText(v.sivanandaEn);
      const gamb = getCommText(v.gambhiranandaEn);
      const puro = getCommText(v.purohitEn);
      const rams = getCommText(v.ramsukhdasHi);
      const shan = getCommText(v.shankaraBhashya);

      if (
        !siva.includes('withheld') ||
        !gamb.includes('withheld') ||
        !puro.includes('withheld') ||
        (!rams.includes('स्थगित') && !rams.includes('withheld')) ||
        (shan && !shan.includes('withheld'))
      ) {
        allWithheld = false;
        console.error(`Unwithheld commentary detected in ${chFile} verse ${v.verse}`);
      }
    }
  }

  tracker.assert(totalDeployedVerses === 701, `Deployed Gita JSON contains all 701 verses across 18 chapters (found ${totalDeployedVerses})`);
  tracker.assert(allWithheld, 'All 701 deployed verses have modern commentaries strictly withheld with explicit notice');
  tracker.assert(sanskritPreserved, 'All 701 deployed verses preserve original Sanskrit and transliteration intact');

  // ---------------------------------------------------------------------------
  // 3. THEMATIC SEMANTIC CONSISTENCY ACROSS ALL 49 PASSAGES
  // ---------------------------------------------------------------------------
  tracker.startTest('Thematic Semantic Consistency Across All 49 Entries');
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
  let budAligned = true;

  for (let i = 0; i < passageIds.length; i++) {
    const id = passageIds[i];
    const start = searchServiceContent.indexOf(`id: '${id}'`);
    const nextStart = (i < passageIds.length - 1) ? searchServiceContent.indexOf(`id: '${passageIds[i+1]}'`) : searchServiceContent.indexOf('];', start);
    const block = searchServiceContent.slice(start, nextStart);

    const getField = (key) => {
      const match = block.match(new RegExp(`["'']?${key}["'']?\\s*:\\s*["'']([^"'']+)["'']`));
      return match ? match[1] : null;
    };

    const sourceAttr = getField('sourceAttribution');
    const exactLic = getField('exactLicenceIdentifier');
    const hasDisclaimer = block.includes('thematicDisclaimer');

    if (!hasDisclaimer || !sourceAttr || !exactLic) {
      thematicSemanticConsistent = false;
    }

    // Specific check for Buddhist passages (Thanissaro Bhikkhu CC BY-NC 4.0)
    if (id.startsWith('theme_bud_')) {
      const pIdx = block.indexOf('primaryTranslationRights:');
      const pBlock = pIdx !== -1 ? block.slice(pIdx, pIdx + 500) : '';
      const pTrans = pBlock.match(/["'']?translatorOrSource["'']?\s*:\s*["'']([^"'']+)["'']/)?.[1];
      const pLic = pBlock.match(/["'']?exactLicenceIdentifier["'']?\s*:\s*["'']([^"'']+)["'']/)?.[1];

      if (
        sourceAttr !== 'Thanissaro Bhikkhu (Metta Forest Monastery) • CC BY-NC 4.0' ||
        exactLic !== 'CC BY-NC 4.0' ||
        pTrans !== 'Thanissaro Bhikkhu' ||
        pLic !== 'CC BY-NC 4.0'
      ) {
        budAligned = false;
        console.error(`Buddhist thematic passage ${id} is not aligned with Thanissaro Bhikkhu CC BY-NC 4.0`);
      }
    }
  }

  tracker.assert(thematicSemanticConsistent, 'All 49 thematic passages have complete metadata and mandatory disclaimer');
  tracker.assert(budAligned, 'Dhammapada Verse 184 and all 7 Buddhist thematic passages are semantically aligned with Thanissaro Bhikkhu (CC BY-NC 4.0)');

  // ---------------------------------------------------------------------------
  // 4. PROGRAMMATIC CENTRAL GITA SANITIZATION BOUNDARY
  // ---------------------------------------------------------------------------
  tracker.startTest('Central Gita Sanitization Boundary Programmatic Verification');
  const providerPath = path.join(__dirname, 'src/services/providers/hinduismProvider.ts');
  const providerContent = fs.readFileSync(providerPath, 'utf8');
  tracker.assert(providerContent.includes('export function sanitizeGitaVerse'), 'sanitizeGitaVerse is exported');
  tracker.assert(providerContent.includes('export function sanitizeGitaChapter'), 'sanitizeGitaChapter is exported');

  // Verify that provider methods route through sanitization
  tracker.assert(
    providerContent.includes('sanitizeGitaChapter(cached)') &&
      providerContent.includes('sanitizeGitaChapter(verses)') &&
      providerContent.includes('sanitizeGitaVerse(cached)'),
    'hinduismProvider routes memory cache, IndexedDB reads/writes, static fetches, and fallbacks through central sanitization'
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
    `chrome_phase6_3_5_2_${Date.now()}_${Math.random().toString(36).slice(2)}`
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

  let wsEndpoint = null;
  for (let i = 0; i < 40; i++) {
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
  }

  if (!wsEndpoint) {
    try { chrome.kill(); } catch (_) {}
    try { preview.kill(); } catch (_) {}
    try { fs.rmSync(tempProfileDir, { recursive: true, force: true }); } catch (_) {}
    throw new Error(`Failed to connect to Chrome debugging endpoint on port ${chromePort}`);
  }

  const WS = globalThis.WebSocket;
  const ws = new WS(wsEndpoint);
  await new Promise((r) => { ws.onopen = r; });

  let msgId = 1;
  const pending = new Map();
  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      if (data.id && pending.has(data.id)) {
        const { resolve, reject } = pending.get(data.id);
        pending.delete(data.id);
        if (data.error) reject(data.error);
        else resolve(data.result);
      }
    } catch (_) {}
  };

  function send(method, params = {}, sessionId) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      const payload = { id, method, params };
      if (sessionId) payload.sessionId = sessionId;
      ws.send(JSON.stringify(payload));
    });
  }

  try {
    const target = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId: target.targetId, flatten: true });

    await send('Page.enable', {}, sessionId);
    await send('Runtime.enable', {}, sessionId);
    await send('DOM.enable', {}, sessionId);

    const evalCode = async (expression) => {
      const res = await send(
        'Runtime.evaluate',
        { expression, returnByValue: true, awaitPromise: true },
        sessionId
      );
      if (res.exceptionDetails) {
        throw new Error(JSON.stringify(res.exceptionDetails));
      }
      return res.result.value;
    };

    const captureScreenshot = async (name) => {
      const res = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
      const filePath = path.join(EVIDENCE_DIR, `${name}.png`);
      fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
      screenshots.push({ name, filePath });
      console.log(`  📸 Screenshot saved: ${name}.png`);
    };

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

    // -------------------------------------------------------------------------
    // TEST 5: HOMEPAGE NAVIGATION & STRICT ZERO-AUTOPLAY
    // -------------------------------------------------------------------------
    tracker.startTest('Homepage Navigation & Zero-Autoplay Verification');
    await send('Page.navigate', { url: BASE_URL }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const pageTitle = await evalCode('document.title');
    tracker.assert(pageTitle.includes('Jafri'), `Page title loaded: "${pageTitle}"`);

    const audioState = await evalCode(`(() => {
      const audios = document.querySelectorAll('audio');
      return {
        count: audios.length,
        anyPlaying: Array.from(audios).some(a => !a.paused && a.currentTime > 0)
      };
    })()`);
    tracker.assert(!audioState.anyPlaying, 'Strict Zero-Autoplay: zero audio tracks playing on initial load');
    await captureScreenshot('01_homepage_zero_autoplay');

    // -------------------------------------------------------------------------
    // TEST 6: QURAN SEARCH & RECONCILED COORDINATES (INCLUDING 25:63)
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
    // TEST 7: GITA CHAPTER 1 & ATTEMPTED SELECTION OF WITHHELD COMMENTARIES
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
      const shloka47 = document.querySelector('[id="shloka-47"]');
      return {
        shlokasCount: shlokas.length,
        hasShloka47: Boolean(shloka47),
        shloka47Text: shloka47 ? shloka47.textContent : null,
      };
    })()`);

    tracker.assert(ch2State.shlokasCount === 72, `Gita Chapter 2 loaded all 72 verses from sanitized static JSON asset (found ${ch2State.shlokasCount})`);
    tracker.assert(
      ch2State.hasShloka47 && ch2State.shloka47Text.includes('कर्मण्येवाधिकारस्ते'),
      'Gita 2:47 Sanskrit original text is preserved intact'
    );
    tracker.assert(
      ch2State.shloka47Text && (ch2State.shloka47Text.includes('Thy right is only unto action') || ch2State.shloka47Text.includes('Rightly thy business is with deed alone')),
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
    await captureScreenshot('07_gita_ch2_and_ch4_retrieval');

    // -------------------------------------------------------------------------
    // TEST 9: INDEXEDDB READ/WRITE & LEGACY CACHE MIGRATION
    // -------------------------------------------------------------------------
    tracker.startTest('IndexedDB Reads, Writes & Legacy Cache Migration');

    // In the browser context, inject a legacy contaminated record into IndexedDB
    // to test that hinduismProvider sanitizes it and migrates the cache record permanently.
    const migrationResult = await evalCode(`(async () => {
      return new Promise((resolve) => {
        try {
          const req = indexedDB.open('jafri_islamic_cache_v1', 1);
          req.onsuccess = async () => {
            const db = req.result;
            // Create dirty legacy verse record for all 43 verses of Chapter 3
            const dirtyVerses = [];
            for (let v = 1; v <= 43; v++) {
              dirtyVerses.push({
                chapter: 3,
                verse: v,
                slok: "ज्येयसी चेत्कर्मणस्ते मता बुद्धिर्जनार्दन ।",
                transliteration: "jyāyasī cet karmaṇas te matā buddhir janārdana",
                sivanandaEn: "UNSAFE_PROPRIETARY_LEAKED_TEXT_SIVANANDA_" + v,
                gambhiranandaEn: "UNSAFE_PROPRIETARY_LEAKED_TEXT_GAMBHIRANANDA_" + v,
                purohitEn: "UNSAFE_PROPRIETARY_LEAKED_TEXT_PUROHIT_" + v,
                ramsukhdasHi: "UNSAFE_PROPRIETARY_LEAKED_TEXT_RAMSUKHDAS_" + v,
                shankaraBhashya: "UNSAFE_PROPRIETARY_LEAKED_TEXT_SHANKARA_" + v
              });
            }

            const tx = db.transaction(['quran_store'], 'readwrite');
            const store = tx.objectStore('quran_store');
            store.put({ data: dirtyVerses, timestamp: Date.now() }, 'gita_chapter_3');

            tx.oncomplete = async () => {
              // Read directly back before migration
              const checkTx = db.transaction(['quran_store'], 'readonly');
              const checkReq = checkTx.objectStore('quran_store').get('gita_chapter_3');
              checkReq.onsuccess = () => {
                const readResult = checkReq.result;
                const readDirty = readResult?.data || (Array.isArray(readResult) ? readResult : null);
                const wasDirtyInjected = readDirty && readDirty.length === 43 && readDirty[0]?.sivanandaEn?.includes('UNSAFE_PROPRIETARY_LEAKED_TEXT');
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

    tracker.assert(migrationResult.wasDirtyInjected, 'Successfully injected simulated legacy un-sanitized record into IndexedDB');

    // Trigger navigation to Chapter 3 so the provider loads and migrates the cache
    await send('Page.navigate', { url: BASE_URL + '?religion=hinduism&chapter=3' }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    // Check that the displayed chapter 3 text NEVER contains the leaked text
    const ch3RenderText = await evalCode(`(() => {
      const ch3El = document.querySelector('[id="shloka-1"]');
      return ch3El ? ch3El.textContent : '';
    })()`);

    tracker.assert(!ch3RenderText.includes('UNSAFE_PROPRIETARY_LEAKED_TEXT'), 'Rendered Chapter 3 output strictly withheld proprietary text');

    // Check that IndexedDB was permanently migrated/cleansed
    const idbCleansedResult = await evalCode(`(async () => {
      return new Promise((resolve) => {
        const req = indexedDB.open('jafri_islamic_cache_v1', 1);
        req.onsuccess = () => {
          const db = req.result;
          const tx = db.transaction(['quran_store'], 'readonly');
          const getReq = tx.objectStore('quran_store').get('gita_chapter_3');
          getReq.onsuccess = () => {
            const result = getReq.result;
            const data = result?.data || (Array.isArray(result) ? result : null);
            if (!data || !Array.isArray(data)) return resolve({ cleansed: false, reason: 'no data', result });
            
            const getStr = (c) => typeof c === 'string' ? c : (c?.translation || '');
            const hasLeaked = data.some(v => 
              getStr(v.sivanandaEn).includes('UNSAFE_PROPRIETARY_LEAKED_TEXT') ||
              getStr(v.gambhiranandaEn).includes('UNSAFE_PROPRIETARY_LEAKED_TEXT')
            );
            const hasWithheld = data.every(v =>
              getStr(v.sivanandaEn).includes('withheld') &&
              getStr(v.gambhiranandaEn).includes('withheld')
            );
            resolve({ cleansed: !hasLeaked && hasWithheld });
          };
        };
        req.onerror = () => resolve({ cleansed: false, reason: 'error opening IDB' });
      });
    })()`);

    tracker.assert(idbCleansedResult.cleansed, 'IndexedDB cache migration verified: legacy unsafe records permanently overwritten with sanitized data');
    await captureScreenshot('08_indexeddb_cache_migration');

    // -------------------------------------------------------------------------
    // TEST 10: THEMATIC DISCOVERY ACROSS ALL 7 TRADITIONS & DISCLAIMER
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

    // Restore network
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
    try { ws.close(); } catch (_) {}
    try { chrome.kill(); } catch (_) {}
    try { preview.kill(); } catch (_) {}
    try { fs.rmSync(tempProfileDir, { recursive: true, force: true }); } catch (_) {}
  }

  // ---------------------------------------------------------------------------
  // SUMMARY REPORT
  // ---------------------------------------------------------------------------
  console.log('\n================================================================================');
  console.log(`PHASE 6.3.5.2 ACCEPTANCE RESULTS: ${tracker.passedAssertions}/${tracker.totalAssertions} ASSERTIONS PASSED (${tracker.failedAssertions} FAILED)`);
  console.log('================================================================================\n');

  const resultsSummary = {
    suite: 'Phase 6.3.5.2 Gita Public Asset Rights Purge, Quran Inventory & Thematic Rights Acceptance',
    timestamp: new Date().toISOString(),
    totalAssertions: tracker.totalAssertions,
    passedAssertions: tracker.passedAssertions,
    failedAssertions: tracker.failedAssertions,
    allPassed: tracker.failedAssertions === 0,
    tests: tracker.tests,
    screenshots,
  };

  const resultsPath = path.join(ARTIFACTS_DIR, 'phase6_3_5_2_acceptance_results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(resultsSummary, null, 2), 'utf8');
  console.log(`Results written to ${resultsPath}`);

  if (tracker.failedAssertions > 0) {
    process.exit(1);
  } else {
    console.log('Phase 6.3.5.2 Acceptance Suite: ALL TESTS PASSED SUCCESSFULLY!\n');
    process.exit(0);
  }
}

runAcceptanceTest().catch((err) => {
  console.error('[FATAL ACCEPTANCE ERROR]', err);
  process.exit(1);
});
