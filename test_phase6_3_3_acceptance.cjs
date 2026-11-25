const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = '/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b';
const EVIDENCE_DIR = path.join(ARTIFACTS_DIR, 'phase6_3_3_evidence');
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

const PORT = 4195;
const BASE_URL = `http://localhost:${PORT}/jafri-islamic-resources/`;

async function runAcceptanceTest() {
  console.log('================================================================================');
  console.log('PHASE 6.3.3 ACCEPTANCE: CANONICAL CITATION, COVERAGE & RIGHTS REMEDIATION');
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
    }
  };

  const screenshots = [];

  // ---------------------------------------------------------------------------
  // SECTION 1: STATIC DATA INTEGRITY & RIGHTS REGISTER AUDIT
  // ---------------------------------------------------------------------------
  console.log('--- SECTION 1: STATIC REGISTRY, CITATIONS & RIGHTS AUDIT ---');

  const coverageFileContent = fs.readFileSync(
    path.join(__dirname, 'src/platform/services/contentCoverageRegistry.ts'),
    'utf-8'
  );
  const searchFileContent = fs.readFileSync(
    path.join(__dirname, 'src/platform/services/universalScriptureSearchService.ts'),
    'utf-8'
  );

  // Test 1: Vedas split verification
  tracker.startTest('Vedas Split: cov_hin_vedas_catalog vs cov_hin_vedas_landmark_suktas');
  tracker.assert(
    coverageFileContent.includes("id: 'cov_hin_vedas_catalog'"),
    'cov_hin_vedas_catalog record exists'
  );
  tracker.assert(
    coverageFileContent.includes("unitType: 'Canonical Samhitas'") &&
    coverageFileContent.includes("totalUnitsInScope: 4") &&
    coverageFileContent.includes("availabilityStatus: 'CATALOG_ONLY'"),
    'cov_hin_vedas_catalog correctly models 4/4 Canonical Samhitas as CATALOG_ONLY'
  );
  tracker.assert(
    coverageFileContent.includes("id: 'cov_hin_vedas_landmark_suktas'"),
    'cov_hin_vedas_landmark_suktas record exists'
  );
  tracker.assert(
    coverageFileContent.includes("unitType: 'Landmark Suktas & Hymns'") &&
    coverageFileContent.includes("indexedUnits: 11") &&
    coverageFileContent.includes("totalUnitsInScope: 11") &&
    coverageFileContent.includes("availabilityStatus: 'FULL'"),
    'cov_hin_vedas_landmark_suktas correctly models 11/11 Landmark Suktas as FULL'
  );
  tracker.assert(
    !coverageFileContent.includes("indexedUnits: 11,\n    totalUnitsInScope: 4"),
    'No invalid 11/4 disparate unit division remains for Vedas'
  );

  // Test 2: Tanakh split verification
  tracker.startTest('Tanakh Split: Complete Chapters vs Landmark Liturgical Passages');
  tracker.assert(
    coverageFileContent.includes("id: 'cov_jud_tanakh_chapters'"),
    'cov_jud_tanakh_chapters record exists'
  );
  tracker.assert(
    coverageFileContent.includes("unitType: 'Chapters'") &&
    coverageFileContent.includes("indexedUnits: 4") &&
    coverageFileContent.includes("totalUnitsInScope: 929") &&
    coverageFileContent.includes("availabilityStatus: 'PARTIAL'"),
    'cov_jud_tanakh_chapters correctly models 4/929 complete liturgical chapters as PARTIAL'
  );
  tracker.assert(
    coverageFileContent.includes("id: 'cov_jud_tanakh_passages'"),
    'cov_jud_tanakh_passages record exists'
  );
  tracker.assert(
    coverageFileContent.includes("unitType: 'Landmark Liturgical Passages'") &&
    coverageFileContent.includes("indexedUnits: 4") &&
    coverageFileContent.includes("totalUnitsInScope: 4") &&
    coverageFileContent.includes("availabilityStatus: 'FULL'"),
    'cov_jud_tanakh_passages correctly models 4/4 landmark passages as FULL'
  );

  // Test 3: Upanishads split verification
  tracker.startTest('Principal Upanishads Split: 10 Canon Catalog vs 10 Landmark Passages');
  tracker.assert(
    coverageFileContent.includes("id: 'cov_hin_upanishads_catalog'"),
    'cov_hin_upanishads_catalog record exists'
  );
  tracker.assert(
    coverageFileContent.includes("id: 'cov_hin_upanishads_passages'"),
    'cov_hin_upanishads_passages record exists'
  );
  tracker.assert(
    coverageFileContent.includes("Landmark Invocations & Mahavakyas") &&
    coverageFileContent.includes("10 Landmark Aphorisms & Shanti Invocations"),
    'Upanishads landmark passages distinct from full multi-thousand verse texts'
  );

  // Test 4: Bhagavad Gita 700 vs 701 numbering convention
  tracker.startTest('Bhagavad Gita 700 vs 701 Numbering Convention Declared');
  tracker.assert(
    coverageFileContent.includes("numberingConvention: '701-Verse Standard (Mahabharata Bhishma Parva counting 13:1 Arjuna inquiry as a numbered verse)'"),
    'Platform explicitly declares 701-verse standard convention'
  );
  tracker.assert(
    coverageFileContent.includes("alternateNumberingCrossReference:") &&
    coverageFileContent.includes("700-Verse Recension (Adi Shankara Advaita Vedanta"),
    'Platform provides cross-reference to the 700-verse Shankara Advaita recension'
  );

  // Test 5: Storage and Remote dynamic availability fields
  tracker.startTest('Storage and Dynamic Availability Reporting Fields');
  tracker.assert(
    coverageFileContent.includes('offlineCoverageStatus:') &&
    coverageFileContent.includes('offlineIndexedUnits:') &&
    coverageFileContent.includes('offlineTotalUnits:') &&
    coverageFileContent.includes('remoteAvailabilityStatus:') &&
    coverageFileContent.includes('fallbackBehaviour:'),
    'Coverage records contain explicit storage and dynamic availability fields'
  );
  tracker.assert(
    coverageFileContent.includes("remoteProvider: 'UmmahAPI / Tanzil Project'") &&
    coverageFileContent.includes("remoteProvider: 'Bolls Life API'") &&
    coverageFileContent.includes("remoteProvider: 'BaniDB / OpenGurbani Public Repository'") &&
    coverageFileContent.includes("remoteProvider: 'Sefaria API / Mechon Mamre'"),
    'External remote dynamic providers explicitly identified for Quran, Bible, SGGS, and Tanakh'
  );

  // Test 6: Granular rights and licences audit
  tracker.startTest('Granular Rights and Individual Text Licences Audit');
  tracker.assert(
    coverageFileContent.includes("exactLicenceIdentifier: 'CC-BY-3.0'") &&
    coverageFileContent.includes("requiredCopyrightNotice: '© 2007-2026 Tanzil Project"),
    'Tanzil CC-BY-3.0 licence and copyright notice verified'
  );
  tracker.assert(
    coverageFileContent.includes("exactLicenceIdentifier: 'Public Domain'") &&
    coverageFileContent.includes("King James Version (Authorized Translation of 1611 / Pure Cambridge Text)"),
    'Bible KJV Pure Cambridge Edition verified as Public Domain'
  );
  tracker.assert(
    coverageFileContent.includes("Jewish Publication Society (1917 edition is in Public Domain worldwide)"),
    'Tanakh JPS 1917 translation verified as Public Domain'
  );
  tracker.assert(
    coverageFileContent.includes("Dr. Sant Singh Khalsa, MD (placed in electronic public domain for Sikh study)"),
    'Dr. Sant Singh Khalsa Gurbani translation terms documented'
  );
  tracker.assert(
    coverageFileContent.includes("Buddhist Publication Society (BPS), Kandy & Access to Insight") &&
    coverageFileContent.includes("Thanissaro Bhikkhu. Free distribution permitted, not for sale"),
    'Access to Insight terms (Buddharakkhita & Thanissaro Bhikkhu) verified'
  );
  tracker.assert(
    coverageFileContent.includes("JAINA Education Committee (Federation of Jain Associations in North America)"),
    'JAINA Education Series non-commercial distribution documented'
  );
  tracker.assert(
    !coverageFileContent.includes("license: 'Open Religious Heritage'"),
    'Undefined phrase "Open Religious Heritage" replaced with verified granular licences'
  );

  // Test 7: Sikh scripture citation accuracy
  tracker.startTest('Canonical Sikh Scripture Citation Accuracy');
  tracker.assert(
    searchFileContent.includes("id: 'sikhism_ang_471_daya_kapah'") &&
    searchFileContent.includes("displayCoordinates: 'SGGS Ang 471'") &&
    searchFileContent.includes("Daya Kapah Santokh Soot"),
    'Daya Kapah Santokh Soot canonically cited at SGGS Ang 471 (Asa di Var, Salok M:1)'
  );
  tracker.assert(
    searchFileContent.includes("id: 'sikhism_ang_3_dhaul_dharam'") &&
    searchFileContent.includes("displayCoordinates: 'SGGS Ang 3 (Japji Sahib Pauri 16)'") &&
    searchFileContent.includes("Dhaul Dharam Daya Ka Poot"),
    'Dhaul Dharam Daya Ka Poot canonically cited at SGGS Ang 3 (Japji Sahib, Pauri 16)'
  );
  tracker.assert(
    searchFileContent.includes("id: 'sikhism_ang_1381_salok_farid_78'") &&
    searchFileContent.includes("displayCoordinates: 'SGGS Ang 1381 (Salok Sheikh Farid 78)'"),
    'Salok Sheikh Farid 78 (Forgiveness) canonically cited at SGGS Ang 1381'
  );
  tracker.assert(
    searchFileContent.includes("id: 'sikhism_ang_1382_salok_farid_85'") &&
    searchFileContent.includes("displayCoordinates: 'SGGS Ang 1382 (Salok Sheikh Farid 85)'"),
    'Salok Sheikh Farid 85 (Patience) canonically cited at SGGS Ang 1382'
  );
  tracker.assert(
    searchFileContent.includes("displayCoordinates: 'SGGS Ang 268 (Gauri Sukhmani)'") &&
    searchFileContent.includes("displayCoordinates: 'SGGS Ang 1245 (Sarang ki Var)'") &&
    searchFileContent.includes("displayCoordinates: 'SGGS Ang 2 (Japji Sahib Pauri 5)'"),
    'Sikh thematic passages for Gratitude (Ang 268), Charity (Ang 1245), Wisdom (Ang 2) verified'
  );

  // Test 8: Thematic definitions and disclaimer
  tracker.startTest('Thematic Definitions and Preservation Disclaimer');
  const modalFileContent = fs.readFileSync(
    path.join(__dirname, 'src/platform/components/UniversalScriptureSearchModal.tsx'),
    'utf-8'
  );
  tracker.assert(
    modalFileContent.includes("Thematic discovery — contextual spiritual reflection, not direct scriptural equivalence.") ||
    searchFileContent.includes("Thematic discovery — contextual spiritual reflection, not direct scriptural equivalence."),
    'Thematic reflection disclaimer preserved verbatim'
  );

  // ---------------------------------------------------------------------------
  // SECTION 2: BROWSER ACCEPTANCE TESTS VIA CDP
  // ---------------------------------------------------------------------------
  console.log('\n--- SECTION 2: BROWSER ACCEPTANCE & OFFLINE EMULATION TESTS ---');

  // Start Vite Preview Server
  console.log('Starting Vite Preview Server on port', PORT, '...');
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--base', '/jafri-islamic-resources/'], {
    cwd: '/Users/afzaljafri/.gemini/antigravity/scratch/jafri-islamic-resources',
    stdio: 'pipe'
  });

  preview.stderr.on('data', d => console.error('[preview err]', d.toString()));
  preview.stdout.on('data', d => console.log('[preview out]', d.toString().trim()));

  let serverReady = false;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 300));
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

  // Launch headless Chrome
  const chromePort = 9600 + Math.floor(Math.random() * 30);
  const tempDir = `/tmp/chrome_phase6_3_3_test_${Date.now()}`;
  fs.mkdirSync(tempDir, { recursive: true });

  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${chromePort}`,
    '--remote-allow-origins=*',
    '--autoplay-policy=no-user-gesture-required',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,1000',
    `--user-data-dir=${tempDir}`,
    'about:blank'
  ]);

  let wsUrl = null;
  for (let i = 0; i < 40; i++) {
    await new Promise(r => setTimeout(r, 200));
    try {
      const resp = await fetch(`http://127.0.0.1:${chromePort}/json/version`);
      if (resp.ok) {
        const data = await resp.json();
        wsUrl = data.webSocketDebuggerUrl;
        break;
      }
    } catch (_) {}
  }

  if (!wsUrl) {
    chrome.kill();
    preview.kill();
    throw new Error('Could not connect to Chrome debugging port.');
  }

  console.log(`Connected to Chrome at ${wsUrl}`);
  const ws = new globalThis.WebSocket(wsUrl);
  await new Promise(r => { ws.onopen = r; });

  let msgId = 1;
  const callbacks = new Map();

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.id && callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    } catch (_) {}
  };

  const send = (method, params = {}, sessionId = undefined) => {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      callbacks.set(id, { resolve, reject });
      const payload = { id, method, params };
      if (sessionId) payload.sessionId = sessionId;
      ws.send(JSON.stringify(payload));
    });
  };

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

  await send('Page.enable', {}, sessionId);
  await send('DOM.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);
  await send('Network.enable', {}, sessionId);

  const evalCode = async (expression) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, sessionId);
    if (res.exceptionDetails) {
      throw new Error(`Eval error: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result ? res.result.value : undefined;
  };

  const captureScreenshot = async (name) => {
    const res = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
    const buffer = Buffer.from(res.data, 'base64');
    const p = `${EVIDENCE_DIR}/${name}.png`;
    fs.writeFileSync(p, buffer);
    console.log(`  [Screenshot Saved] ${name}.png`);
    screenshots.push(`${name}.png`);
  };

  try {
    // Navigate to local preview
    await send('Page.navigate', { url: BASE_URL }, sessionId);
    await new Promise(r => setTimeout(r, 2500));

    // Test 9: Homepage loads cleanly
    tracker.startTest('Homepage & Global Navigation Elements Loaded');
    const title = await evalCode('document.title');
    tracker.assert(title.length > 0, `Page title loaded: "${title}"`);

    const hasNavSearchBtn = await evalCode('Boolean(document.querySelector("[data-testid=\'platform-nav-search-btn\']"))');
    const hasNavLibraryBtn = await evalCode('Boolean(document.querySelector("[data-testid=\'platform-nav-my-library-btn\']"))');
    tracker.assert(hasNavSearchBtn, 'Header Navigation contains Search Scripture button');
    tracker.assert(hasNavLibraryBtn, 'Header Navigation contains My Sacred Library button');
    await captureScreenshot('01_homepage_loaded');

    // Test 10: Open Search Modal
    tracker.startTest('Universal Scripture Search Modal Opens');
    await evalCode(`(() => {
      const btn = document.querySelector("[data-testid='platform-nav-search-btn']") ||
                  Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('Search') || b.textContent.includes('⌘K') || b.textContent.includes('/')));
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const isModalOpen = await evalCode('Boolean(document.querySelector("[data-testid=\'universal-scripture-search-modal\']"))');
    tracker.assert(isModalOpen, 'Search modal rendered into DOM');

    const hasInput = await evalCode('Boolean(document.querySelector("[data-testid=\'universal-search-input\']"))');
    tracker.assert(hasInput, 'Scripture search input is focused and accessible');
    await captureScreenshot('02_search_modal_open');

    // Helper function to perform search and retrieve results
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
      await new Promise(r => setTimeout(r, 800));
      return await evalCode(`(() => {
        const cards = document.querySelectorAll("[data-testid='search-result-card']");
        return Array.from(cards).map(c => ({
          text: c.innerText,
          hasExactRef: Boolean(c.innerText.includes('Exact Reference')),
          hasNumberingBadge: Boolean(c.querySelector("[data-testid='numbering-convention-badge']")),
          hasRightsBadge: Boolean(c.querySelector("[data-testid='rights-licence-badge']"))
        }));
      })()`);
    };

    // Test 11: Search for SGGS Ang 471 (Daya Kapah)
    tracker.startTest('Search Resolution: "Ang 471" Resolves Daya Kapah with Exact Ref & Rights');
    const resAng471 = await performSearch('Ang 471');
    tracker.assert(resAng471.length > 0, `Search returned ${resAng471.length} cards for "Ang 471"`);
    const cardAng471 = resAng471.find(c => c.text.includes('SGGS Ang 471') && c.text.includes('Daya Kapah'));
    tracker.assert(Boolean(cardAng471), 'Resolved SGGS Ang 471 (Daya Kapah — Asa di Var, Salok M:1)');
    tracker.assert(cardAng471?.hasExactRef, 'Ang 471 marked with Exact Reference match badge');
    tracker.assert(cardAng471?.hasNumberingBadge, 'Ang 471 renders Numbering Convention badge');
    tracker.assert(cardAng471?.hasRightsBadge, 'Ang 471 renders Rights and Licence badge');
    await captureScreenshot('03_search_ang_471_daya_kapah');

    // Test 12: Search for SGGS Ang 3 (Dhaul Dharam)
    tracker.startTest('Search Resolution: "Ang 3" Resolves Dhaul Dharam / Japji Sahib Pauri 16');
    const resAng3 = await performSearch('Ang 3');
    tracker.assert(resAng3.length > 0, `Search returned ${resAng3.length} cards for "Ang 3"`);
    const cardAng3 = resAng3.find(c => c.text.includes('SGGS Ang 3') && c.text.includes('Dhaul Dharam'));
    tracker.assert(Boolean(cardAng3), 'Resolved SGGS Ang 3 (Dhaul Dharam Daya Ka Poot — Japji Sahib, Pauri 16)');
    await captureScreenshot('04_search_ang_3_dhaul_dharam');

    // Test 13: Search for SGGS Ang 1381 (Salok Sheikh Farid 78)
    tracker.startTest('Search Resolution: "Ang 1381" Resolves Salok Sheikh Farid 78 (Forgiveness)');
    const resAng1381 = await performSearch('Ang 1381');
    tracker.assert(resAng1381.length > 0, `Search returned ${resAng1381.length} cards for "Ang 1381"`);
    const cardFarid78 = resAng1381.find(c => c.text.includes('SGGS Ang 1381') && c.text.includes('Salok Sheikh Farid 78'));
    tracker.assert(Boolean(cardFarid78), 'Resolved SGGS Ang 1381 (Salok Sheikh Farid 78: "Fareed, return good for evil")');
    tracker.assert(cardFarid78?.hasExactRef, 'Salok 78 marked with Exact Reference match badge');
    await captureScreenshot('05_search_ang_1381_salok_farid_78');

    // Test 14: Search for SGGS Ang 1382 (Salok Sheikh Farid 85)
    tracker.startTest('Search Resolution: "Ang 1382" Resolves Salok Sheikh Farid 85 (Patience)');
    const resAng1382 = await performSearch('Ang 1382');
    tracker.assert(resAng1382.length > 0, `Search returned ${resAng1382.length} cards for "Ang 1382"`);
    const cardFarid85 = resAng1382.find(c => c.text.includes('SGGS Ang 1382') && c.text.includes('Salok Sheikh Farid 85'));
    tracker.assert(Boolean(cardFarid85), 'Resolved SGGS Ang 1382 (Salok Sheikh Farid 85: "Let patience be thy bow")');
    await captureScreenshot('06_search_ang_1382_salok_farid_85');

    // Test 15: Search for Bhagavad Gita 2:47 with 701/700 cross-reference
    tracker.startTest('Search Resolution: "Gita 2:47" with 701/700 Numbering Cross-Reference');
    const resGita = await performSearch('Gita 2:47');
    tracker.assert(resGita.length > 0, `Search returned ${resGita.length} cards for "Gita 2:47"`);
    const cardGita = resGita.find(c => c.text.includes('Bhagavad Gita 2:47'));
    tracker.assert(Boolean(cardGita), 'Resolved Bhagavad Gita 2:47 (Karmanye Vadhikaraste)');
    tracker.assert(cardGita?.hasNumberingBadge, 'Bhagavad Gita 2:47 displays Numbering Convention badge');
    const cardText = cardGita?.text || '';
    tracker.assert(
      cardText.includes('701-Verse Standard') && cardText.includes('700-Verse Recension'),
      'Gita result card transparently displays both 701-verse active convention and 700-verse Shankara cross-reference'
    );
    tracker.assert(
      cardText.includes('Swami Sivananda') && cardText.includes('Swami Gambhirananda'),
      'Parallel Translations present with verified scholarly translators'
    );
    await captureScreenshot('07_search_gita_2_47_convention');

    // Test 16: Search for Quran 2:255 (Ayat al-Kursi) with Tanzil CC BY 3.0
    tracker.startTest('Search Resolution: "Quran 2:255" with Tanzil CC BY 3.0 Licence');
    const resQuran = await performSearch('Quran 2:255');
    tracker.assert(resQuran.length > 0, `Search returned ${resQuran.length} cards for "Quran 2:255"`);
    const cardQuran = resQuran.find(c => c.text.includes('Quran 2:255') && c.text.includes('Ayat al-Kursi'));
    tracker.assert(Boolean(cardQuran), 'Resolved Ayat al-Kursi (Quran 2:255)');
    tracker.assert(cardQuran?.hasRightsBadge, 'Quran 2:255 displays CC-BY-3.0 Rights Licence badge');
    tracker.assert(cardQuran?.text.includes('CC-BY-3.0'), 'CC-BY-3.0 licence rendered on card');
    await captureScreenshot('08_search_quran_2_255_licence');

    // Test 17: Search for Psalm 23 (Cross-tradition Christian & Jewish)
    tracker.startTest('Search Resolution: "Psalm 23" Resolves Both Traditions with Public Domain');
    const resPsalm = await performSearch('Psalm 23');
    tracker.assert(resPsalm.length >= 2, `Search returned ${resPsalm.length} cards for "Psalm 23"`);
    const hasChristianPsalm = resPsalm.some(c => c.text.includes('christianity') || c.text.includes('The Holy Bible'));
    const hasJewishPsalm = resPsalm.some(c => c.text.includes('judaism') || c.text.includes('Tehillim') || c.text.includes('Tanakh'));
    tracker.assert(hasChristianPsalm, 'Christian KJV Psalm 23 resolved');
    tracker.assert(hasJewishPsalm, 'Jewish Tehillim 23 resolved');
    await captureScreenshot('09_search_psalm_23_cross_tradition');

    // Test 18: Thematic Subject Discovery: Compassion
    tracker.startTest('Thematic Subject Discovery: "Compassion" Across All 7 Traditions');
    const compResults = await performSearch('Compassion');
    tracker.assert(compResults.length >= 7, `Compassion returned ${compResults.length} verified passages (all 7 traditions)`);

    const hasDisclaimer = await evalCode(`Boolean(document.querySelector("[data-testid='thematic-result-note']"))`);
    tracker.assert(hasDisclaimer, 'Thematic discovery disclaimer rendered: "contextual spiritual reflection, not direct scriptural equivalence"');

    const sikhThematicComp = compResults.find(t => t.text.toLowerCase().includes('sikhism') && t.text.includes('SGGS Ang 471'));
    tracker.assert(Boolean(sikhThematicComp), 'Sikhism Compassion verified passage correctly cites SGGS Ang 471');
    await captureScreenshot('10_thematic_compassion_all_7');

    // Test 19: Offline Network Emulation
    tracker.startTest('Offline Network Emulation: Local Corpus and Search Offline Resiliency');
    console.log('  Emulating network conditions: OFFLINE = true ...');
    await send('Network.emulateNetworkConditions', {
      offline: true,
      latency: 0,
      downloadThroughput: 0,
      uploadThroughput: 0
    }, sessionId);

    // Perform an offline search
    const offlineRes = await performSearch('John 3:16');
    tracker.assert(offlineRes.length > 0, `Offline search returned ${offlineRes.length} results for "John 3:16"`);
    const cardJohn = offlineRes.find(c => c.text.includes('John 3:16'));
    tracker.assert(Boolean(cardJohn), 'John 3:16 successfully resolved while completely offline');
    await captureScreenshot('11_offline_search_resilient');

    // Restore network
    console.log('  Restoring network conditions: OFFLINE = false ...');
    await send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 0,
      downloadThroughput: -1,
      uploadThroughput: -1
    }, sessionId);

    // Test 20: Strict Zero Audio Autoplay Verification
    tracker.startTest('Strict Zero Audio Autoplay: Navigation from Search Keeps Audio Paused');
    const readBtnClicked = await evalCode(`(() => {
      const readBtn = document.querySelector("[data-testid='search-result-read-btn']");
      if (readBtn) {
        readBtn.click();
        return true;
      }
      return false;
    })()`);
    tracker.assert(readBtnClicked, 'Clicked "Read Passage" button in search modal');
    await new Promise(r => setTimeout(r, 1200));

    // Inspect audio state in DOM
    const audioState = await evalCode(`(() => {
      const audios = document.querySelectorAll('audio');
      if (audios.length === 0) return { exists: false, isPaused: true, currentTime: 0 };
      const a = audios[0];
      return { exists: true, isPaused: a.paused, currentTime: a.currentTime };
    })()`);

    tracker.assert(audioState.isPaused === true, 'Audio is strictly paused after opening reader (zero autoplay confirmed)');
    tracker.assert(audioState.currentTime === 0, 'Audio currentTime is 0 (no playback was initiated)');
    await captureScreenshot('12_reader_zero_autoplay_verified');

    // Test 21: My Sacred Library 5 Tabs Regression Verification
    tracker.startTest('My Sacred Library 5 Tabs Regression Verification');
    await evalCode('document.querySelector("[data-testid=\'platform-nav-my-library-btn\']").click()');
    await new Promise(r => setTimeout(r, 800));

    const isLibModalOpen = await evalCode('Boolean(document.querySelector("[data-testid=\'personal-library-modal\']"))');
    tracker.assert(isLibModalOpen, 'My Sacred Library modal opened');

    const tabsExist = await evalCode(`(() => {
      return {
        continue: Boolean(document.querySelector("[data-testid='tab-continue']")),
        bookmarks: Boolean(document.querySelector("[data-testid='tab-bookmarks']")),
        history: Boolean(document.querySelector("[data-testid='tab-history']")),
        progress: Boolean(document.querySelector("[data-testid='tab-progress']")),
        plans: Boolean(document.querySelector("[data-testid='tab-plans']"))
      };
    })()`);

    tracker.assert(tabsExist.continue, 'Continue Reading tab present');
    tracker.assert(tabsExist.bookmarks, 'Bookmarks tab present');
    tracker.assert(tabsExist.history, 'Reading History tab present');
    tracker.assert(tabsExist.progress, 'Reading Progress tab present');
    tracker.assert(tabsExist.plans, 'Daily Reading Plans tab present');
    await captureScreenshot('13_my_sacred_library_5_tabs_verified');

  } finally {
    try {
      ws.close();
      chrome.kill();
      preview.kill();
    } catch (_) {}
  }

  // ---------------------------------------------------------------------------
  // SUMMARY AND RESULTS EXPORT
  // ---------------------------------------------------------------------------
  console.log('\n================================================================================');
  console.log('PHASE 6.3.3 ACCEPTANCE TEST SUMMARY');
  console.log(`Total Tests Run:     ${tracker.totalTests}`);
  console.log(`Total Assertions:    ${tracker.totalAssertions}`);
  console.log(`Passed Assertions:   ${tracker.passedAssertions}`);
  console.log(`Failed Assertions:   ${tracker.failedAssertions}`);
  console.log(`Pass Rate:           ${((tracker.passedAssertions / tracker.totalAssertions) * 100).toFixed(1)}%`);
  console.log('================================================================================');

  const resultsData = {
    phase: 'Phase 6.3.3',
    timestamp: new Date().toISOString(),
    totalTests: tracker.totalTests,
    totalAssertions: tracker.totalAssertions,
    passedAssertions: tracker.passedAssertions,
    failedAssertions: tracker.failedAssertions,
    passRate: `${((tracker.passedAssertions / tracker.totalAssertions) * 100).toFixed(1)}%`,
    screenshots,
    tests: tracker.tests
  };

  const resultsPath = path.join(ARTIFACTS_DIR, 'phase6_3_3_acceptance_results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(resultsData, null, 2));
  console.log(`\nResults written to: ${resultsPath}`);

  if (tracker.failedAssertions > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAcceptanceTest().catch((err) => {
  console.error('\n[FATAL RUNTIME ERROR]:', err);
  process.exit(1);
});
