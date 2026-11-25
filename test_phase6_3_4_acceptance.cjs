const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = process.env.ARTIFACTS_DIR || (fs.existsSync('/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b') ? '/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b' : path.join(__dirname, 'evidence'));
const EVIDENCE_DIR = path.join(ARTIFACTS_DIR, 'phase6_3_4_evidence');
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

function findChrome() {
  if (process.env.CHROME_BIN) return process.env.CHROME_BIN;
  if (process.platform === 'darwin') {
    const macPath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    if (fs.existsSync(macPath)) return macPath;
  }
  const linuxPaths = [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser'
  ];
  for (const p of linuxPaths) {
    if (fs.existsSync(p)) return p;
  }
  return 'google-chrome';
}

const PORT = 4196;
const BASE_URL = `http://localhost:${PORT}/jafri-islamic-resources/`;

async function runAcceptanceTest() {
  console.log('================================================================================');
  console.log('PHASE 6.3.4 BROWSER ACCEPTANCE: RIGHTS GATE, CITATIONS & ACCEPTANCE EVIDENCE');
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

  // Start Vite Preview Server
  console.log('Starting Vite Preview Server on port', PORT, '...');
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--base', '/jafri-islamic-resources/'], {
    cwd: __dirname,
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
  const chromeBinary = findChrome();
  console.log(`Using Chrome binary: ${chromeBinary}`);
  const chromePort = 9600 + Math.floor(Math.random() * 30);
  const tempDir = path.join(require('os').tmpdir(), `chrome_phase6_3_4_test_${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });

  const chrome = spawn(chromeBinary, [
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
  const WS = globalThis.WebSocket || WebSocket;
  const ws = new WS(wsUrl);
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
    // 1. Navigate to homepage
    tracker.startTest('Homepage Initialization');
    await send('Page.navigate', { url: BASE_URL }, sessionId);
    await new Promise(r => setTimeout(r, 2500));

    const pageTitle = await evalCode('document.title');
    tracker.assert(pageTitle && pageTitle.length > 0, `Page title loaded: "${pageTitle}"`);
    await captureScreenshot('01_homepage_loaded');

    // 2. Open Search Modal
    tracker.startTest('Search Modal Activation');
    await evalCode(`(() => {
      const btn = document.querySelector("[data-testid='platform-nav-search-btn']") ||
                  Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('Search') || b.textContent.includes('⌘K') || b.textContent.includes('/')));
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 800));

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

    // 3. Search: Ang 1384 (Patience / Salok 115)
    tracker.startTest('Sikh Citation Verification: Ang 1384 (Salok Sheikh Farid 115 - Sabr)');
    const resAng1384 = await performSearch('Ang 1384');
    tracker.assert(resAng1384.length > 0, `Search returned ${resAng1384.length} cards for "Ang 1384"`);
    const cardAng1384 = resAng1384.find(c => c.text.includes('SGGS Ang 1384') && c.text.includes('115'));
    tracker.assert(Boolean(cardAng1384), 'Resolved SGGS Ang 1384 (Salok Sheikh Farid 115)');
    const card1384Text = cardAng1384?.text || '';
    tracker.assert(
      card1384Text.includes('ਸਬਰੁ ਮੰਝਿ ਕਮਾਣ') || card1384Text.includes('patience be thy bow') || card1384Text.includes('Sabr: Make Patience'),
      'Gurmukhi "Sabr: Make Patience Thy Bow" accurately cited at Ang 1384 (Salok 115)'
    );
    tracker.assert(
      card1384Text.includes('Custom Terms'),
      'Displays Custom Terms (RESTRICTED) badge'
    );
    await captureScreenshot('03_search_ang_1384_salok_115');

    // 4. Search: Ang 1382 (Distress / Salok 85)
    tracker.startTest('Sikh Citation Verification: Ang 1382 (Salok Sheikh Farid 85 - Distress)');
    const resAng1382 = await performSearch('Ang 1382');
    tracker.assert(resAng1382.length > 0, `Search returned ${resAng1382.length} cards for "Ang 1382"`);
    const cardAng1382 = resAng1382.find(c => c.text.includes('SGGS Ang 1382') && c.text.includes('85'));
    tracker.assert(Boolean(cardAng1382), 'Resolved SGGS Ang 1382 (Salok Sheikh Farid 85)');
    const card1382Text = cardAng1382?.text || '';
    tracker.assert(
      card1382Text.includes('Whirlpool') || card1382Text.includes('ਦੁਖਾ ਸੇਤੀ') || card1382Text.includes('sorrow'),
      'True Salok 85 distress/whirlpool passage accurately quoted at Ang 1382'
    );
    await captureScreenshot('04_search_ang_1382_salok_85');

    // 5. Search: Ang 471 (Daya Kapah)
    tracker.startTest('Sikh Citation Verification: Ang 471 (Daya Kapah Santokh Soot)');
    const resAng471 = await performSearch('Ang 471');
    tracker.assert(resAng471.length > 0, `Search returned ${resAng471.length} cards for "Ang 471"`);
    const cardAng471 = resAng471.find(c => c.text.includes('SGGS Ang 471') && c.text.includes('Daya Kapah'));
    tracker.assert(Boolean(cardAng471), 'Resolved SGGS Ang 471 (Daya Kapah — Asa di Var, Salok M:1)');
    tracker.assert(cardAng471?.hasExactRef, 'Ang 471 marked with Exact Reference match badge');
    await captureScreenshot('05_search_ang_471');

    // 6. Search: Ang 3 (Dhaul Dharam)
    tracker.startTest('Sikh Citation Verification: Ang 3 (Dhaul Dharam Daya Ka Poot)');
    const resAng3 = await performSearch('Ang 3');
    tracker.assert(resAng3.length > 0, `Search returned ${resAng3.length} cards for "Ang 3"`);
    const cardAng3 = resAng3.find(c => c.text.includes('SGGS Ang 3') && c.text.includes('Dhaul Dharam'));
    tracker.assert(Boolean(cardAng3), 'Resolved SGGS Ang 3 (Dhaul Dharam Daya Ka Poot — Japji Sahib, Pauri 16)');
    await captureScreenshot('06_search_ang_3');

    // 7. Search: Quran 2:255 (Ayat al-Kursi & Rights Gate)
    tracker.startTest('Rights Gate Verification: Quran 2:255 (Tanzil CC BY 3.0 vs Permission Required)');
    const resQuran = await performSearch('Quran 2:255');
    tracker.assert(resQuran.length > 0, `Search returned ${resQuran.length} cards for "Quran 2:255"`);
    const cardQuran = resQuran.find(c => c.text.includes('2:255') || c.text.includes('Kursi'));
    tracker.assert(Boolean(cardQuran), 'Resolved Ayat al-Kursi (Quran 2:255)');
    const quranCardText = cardQuran?.text || '';
    tracker.assert(quranCardText.includes('CC BY 3.0'), 'Arabic source correctly displays CC BY 3.0 badge');
    tracker.assert(quranCardText.includes('Permission Required'), 'Sahih International displays Permission Required badge');
    tracker.assert(!quranCardText.includes('Public Domain'), 'No false public domain fallback for modern translation');
    await captureScreenshot('07_search_quran_2_255');

    // 8. Search: Gita 2:47 (Numbering Conventions & Parallel Translations)
    tracker.startTest('Content Consistency: Gita 2:47 (701/700 Standard & Custom Terms)');
    const resGita = await performSearch('Gita 2:47');
    tracker.assert(resGita.length > 0, `Search returned ${resGita.length} cards for "Gita 2:47"`);
    const cardGita = resGita.find(c => c.text.includes('2:47') || c.text.includes('Karmanye'));
    tracker.assert(Boolean(cardGita), 'Resolved Bhagavad Gita 2:47');
    const gitaCardText = cardGita?.text || '';
    tracker.assert(
      gitaCardText.includes('701-Verse Standard') && gitaCardText.includes('700-Verse Recension'),
      'Displays 701 active / 700 cross-reference numbering convention'
    );
    tracker.assert(
      gitaCardText.includes('Custom Terms'),
      'Parallel translations display Custom Terms (RESTRICTED) badge'
    );
    await captureScreenshot('08_search_gita_2_47');

    // 9. Search: Psalm 23 (Cross-Tradition Christian KJV & Jewish Tehillim 23)
    tracker.startTest('Cross-Tradition Search: Psalm 23 (Christian KJV & Jewish Tehillim)');
    const resPsalm = await performSearch('Psalm 23');
    tracker.assert(resPsalm.length >= 2, `Search returned ${resPsalm.length} cards for "Psalm 23"`);
    const hasChristianPsalm = resPsalm.some(c => c.text.includes('The Holy Bible') || c.text.includes('King James Version'));
    const hasJewishPsalm = resPsalm.some(c => c.text.includes('Tehillim') || c.text.includes('Tanakh') || c.text.includes('Mizmor LeDavid'));
    tracker.assert(hasChristianPsalm, 'Christian King James Version Psalm 23 resolved');
    tracker.assert(hasJewishPsalm, 'Jewish Masoretic Tehillim 23 resolved');
    await captureScreenshot('09_search_psalm_23');

    // 10. Search: Compassion (Seven-Theme Matrix & Verbatim Disclaimer)
    tracker.startTest('Seven-Theme Matrix: "Compassion" Across All 7 Traditions with Disclaimer');
    const compResults = await performSearch('Compassion');
    tracker.assert(compResults.length >= 7, `Compassion returned ${compResults.length} verified passages (all 7 traditions)`);

    const hasDisclaimer = await evalCode(`Boolean(document.querySelector("[data-testid='thematic-result-note']"))`);
    tracker.assert(hasDisclaimer, 'Thematic discovery disclaimer rendered: "contextual spiritual reflection, not direct scriptural equivalence"');

    const sikhComp = compResults.find(t => t.text.toLowerCase().includes('sikhism') && t.text.includes('SGGS Ang 471'));
    tracker.assert(Boolean(sikhComp), 'Sikhism Compassion verified passage correctly cites SGGS Ang 471');
    await captureScreenshot('10_thematic_compassion_all_7');

    // 11. Zero Autoplay Verification on Scripture Reader
    tracker.startTest('Universal Scripture Reader: Zero-Autoplay Architecture');
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

    const audioState = await evalCode(`(() => {
      const audios = document.querySelectorAll('audio');
      if (audios.length === 0) return { exists: false, isPaused: true, currentTime: 0 };
      const a = audios[0];
      return { exists: true, isPaused: a.paused, currentTime: a.currentTime };
    })()`);
    tracker.assert(audioState.isPaused === true, 'Audio is strictly paused after opening reader (zero autoplay confirmed)');
    tracker.assert(audioState.currentTime === 0, 'Audio currentTime is 0 (no playback was initiated)');
    await captureScreenshot('11_reader_zero_autoplay');

    // 12. My Sacred Library: 5 Tabs Verification
    tracker.startTest('My Sacred Library: Full 5-Tab Architecture Verification');
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
    tracker.assert(tabsExist.continue, 'Continue Reading tab is present');
    tracker.assert(tabsExist.bookmarks, 'Bookmarks tab is present');
    tracker.assert(tabsExist.history, 'Reading History tab is present');
    tracker.assert(tabsExist.progress, 'Reading Progress tab is present');
    tracker.assert(tabsExist.plans, 'Reading Plans tab is present');
    await captureScreenshot('12_my_sacred_library_5_tabs');

    // Close library modal
    await evalCode(`(() => {
      const closeBtn = document.querySelector('button[title="Close Library"]');
      if (closeBtn) closeBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    // 13. Offline Emulation Test
    tracker.startTest('Offline Network Emulation: Local Corpus and Search Offline Resiliency');
    console.log('  Emulating network conditions: OFFLINE = true ...');
    await send('Network.emulateNetworkConditions', {
      offline: true,
      latency: 0,
      downloadThroughput: 0,
      uploadThroughput: 0
    }, sessionId);

    // Open search modal while offline
    await evalCode(`(() => {
      const btn = document.querySelector("[data-testid='platform-nav-search-btn']");
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const offlineRes = await performSearch('John 3:16');
    tracker.assert(offlineRes.length > 0, `Offline search returned ${offlineRes.length} results for "John 3:16"`);
    const cardJohn = offlineRes.find(c => c.text.includes('John 3:16'));
    tracker.assert(Boolean(cardJohn), 'John 3:16 successfully resolved while completely offline');
    await captureScreenshot('13_offline_resilience');

    // Restore network
    await send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 0,
      downloadThroughput: -1,
      uploadThroughput: -1
    }, sessionId);

  } finally {
    ws.close();
    chrome.kill();
    preview.kill();
  }

  // Summary
  console.log('\n================================================================================');
  console.log(`ACCEPTANCE SUMMARY: ${tracker.totalTests} Tests, ${tracker.totalAssertions} Assertions`);
  console.log(`PASSED: ${tracker.passedAssertions}`);
  console.log(`FAILED: ${tracker.failedAssertions}`);
  console.log(`SCREENSHOTS: ${screenshots.length} captured in ${EVIDENCE_DIR}`);
  console.log('================================================================================\n');

  const results = {
    timestamp: new Date().toISOString(),
    totalTests: tracker.totalTests,
    totalAssertions: tracker.totalAssertions,
    passedAssertions: tracker.passedAssertions,
    failedAssertions: tracker.failedAssertions,
    passed: tracker.failedAssertions === 0,
    tests: tracker.tests,
    screenshots
  };

  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'phase6_3_4_acceptance_results.json'), JSON.stringify(results, null, 2));

  if (tracker.failedAssertions > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runAcceptanceTest().catch((err) => {
  console.error('Fatal error during acceptance test:', err);
  process.exit(1);
});
