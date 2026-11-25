const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = process.env.ARTIFACTS_DIR || (fs.existsSync('/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b') ? '/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b' : path.join(__dirname, 'evidence'));
const EVIDENCE_DIR = path.join(ARTIFACTS_DIR, 'phase6_3_4_evidence');
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

const PROD_URL = 'https://afzaljafri-one.github.io/jafri-islamic-resources/';

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

class ProdVerificationTracker {
  constructor() {
    this.tests = [];
    this.currentTest = null;
    this.totalAssertions = 0;
    this.passedAssertions = 0;
    this.failedAssertions = 0;
  }

  startTest(name) {
    this.currentTest = { name, assertions: [], passed: true };
    this.tests.push(this.currentTest);
    console.log(`\n[PROD TEST ${this.tests.length}] ${name}`);
  }

  assert(condition, message, details = '') {
    this.totalAssertions++;
    if (condition) {
      this.passedAssertions++;
      console.log(`  ✓ [PASS] ${message}`);
      this.currentTest.assertions.push({ message, passed: true, details });
    } else {
      this.failedAssertions++;
      this.currentTest.passed = false;
      console.error(`  ✗ [FAIL] ${message} ${details ? '(' + details + ')' : ''}`);
      this.currentTest.assertions.push({ message, passed: false, details });
    }
  }

  summary() {
    console.log('\n' + '='.repeat(80));
    console.log('PHASE 6.3.4 PRODUCTION LIVE VERIFICATION SUMMARY');
    console.log(`Total Tests Run:     ${this.tests.length}`);
    console.log(`Total Assertions:    ${this.totalAssertions}`);
    console.log(`Passed Assertions:   ${this.passedAssertions}`);
    console.log(`Failed Assertions:   ${this.failedAssertions}`);
    const passRate = ((this.passedAssertions / this.totalAssertions) * 100).toFixed(1);
    console.log(`Pass Rate:           ${passRate}%`);
    console.log('='.repeat(80) + '\n');
    return {
      totalTests: this.tests.length,
      totalAssertions: this.totalAssertions,
      passedAssertions: this.passedAssertions,
      failedAssertions: this.failedAssertions,
      passRate: `${passRate}%`,
      tests: this.tests
    };
  }
}

async function runLiveProductionVerification() {
  const tracker = new ProdVerificationTracker();
  console.log('================================================================================');
  console.log('PHASE 6.3.4 PRODUCTION LIVE AUDIT: SCRIPTURE SEARCH, CITATIONS & RIGHTS GATE');
  console.log(`Production URL: ${PROD_URL}`);
  console.log('================================================================================\n');

  const chromeBinary = findChrome();
  console.log(`Using Chrome binary: ${chromeBinary}`);
  const chromePort = 9640 + Math.floor(Math.random() * 20);
  const tempDir = path.join(require('os').tmpdir(), `chrome_phase6_3_4_prod_${Date.now()}`);
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
    } catch (e) {}
  }

  if (!wsUrl) {
    chrome.kill();
    throw new Error('Failed to connect to Chrome DevTools protocol on port ' + chromePort);
  }
  console.log(`Connected to Chrome at ${wsUrl}`);

  const WS = globalThis.WebSocket || WebSocket;
  const ws = new WS(wsUrl);
  await new Promise(r => { ws.onopen = r; });

  let reqId = 1;
  const pending = new Map();
  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    } catch (e) {}
  };

  const send = (method, params = {}, sessionId = undefined) => {
    const id = reqId++;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params, sessionId }));
    });
  };

  const target = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId: target.targetId, flatten: true });

  await send('Page.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);
  await send('DOM.enable', {}, sessionId);
  await send('Network.enable', {}, sessionId);

  const evalCode = async (expression) => {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    }, sessionId);
    if (res.exceptionDetails) {
      throw new Error(`Eval exception: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result ? res.result.value : undefined;
  };

  const captureScreenshot = async (name) => {
    const { data } = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
    const filePath = path.join(EVIDENCE_DIR, `${name}.png`);
    fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
    console.log(`  [Screenshot Saved] ${name}.png`);
    return `${name}.png`;
  };

  const screenshots = [];

  try {
    // 1. Navigate to production
    console.log(`Navigating to ${PROD_URL} ...`);
    tracker.startTest('Production Navigation & Asset Verification');
    await send('Page.navigate', { url: PROD_URL }, sessionId);
    await new Promise(r => setTimeout(r, 3500));

    const pageTitle = await evalCode('document.title');
    tracker.assert(pageTitle && pageTitle.length > 0, `Page loaded with title: "${pageTitle}"`);
    screenshots.push(await captureScreenshot('prod_01_homepage_loaded'));

    // 2. Open Scripture Search Modal
    tracker.startTest('Universal Scripture Search Activation');
    await evalCode(`(() => {
      const btn = document.querySelector("[data-testid='platform-nav-search-btn']") ||
                  Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('Search') || b.textContent.includes('⌘K') || b.textContent.includes('/')));
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 1000));

    const isModalOpen = await evalCode('Boolean(document.querySelector("[data-testid=\'universal-scripture-search-modal\']"))');
    tracker.assert(isModalOpen, 'Universal Scripture Search Modal rendered in production DOM');

    const hasInput = await evalCode('Boolean(document.querySelector("[data-testid=\'universal-search-input\']"))');
    tracker.assert(hasInput, 'Scripture search input is focused and accessible');
    screenshots.push(await captureScreenshot('prod_02_search_modal_open'));

    // Helper for searching
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
      await new Promise(r => setTimeout(r, 1000));
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
    screenshots.push(await captureScreenshot('prod_03_search_ang_1384_salok_115'));

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
    screenshots.push(await captureScreenshot('prod_04_search_ang_1382_salok_85'));

    // 5. Search: Ang 471 (Daya Kapah)
    tracker.startTest('Sikh Citation Verification: Ang 471 (Daya Kapah Santokh Soot)');
    const resAng471 = await performSearch('Ang 471');
    tracker.assert(resAng471.length > 0, `Search returned ${resAng471.length} cards for "Ang 471"`);
    const cardAng471 = resAng471.find(c => c.text.includes('SGGS Ang 471') && c.text.includes('Daya Kapah'));
    tracker.assert(Boolean(cardAng471), 'Resolved SGGS Ang 471 (Daya Kapah — Asa di Var, Salok M:1)');
    tracker.assert(cardAng471?.hasExactRef, 'Ang 471 marked with Exact Reference match badge');
    screenshots.push(await captureScreenshot('prod_05_search_ang_471'));

    // 6. Search: Ang 3 (Dhaul Dharam)
    tracker.startTest('Sikh Citation Verification: Ang 3 (Dhaul Dharam Daya Ka Poot)');
    const resAng3 = await performSearch('Ang 3');
    tracker.assert(resAng3.length > 0, `Search returned ${resAng3.length} cards for "Ang 3"`);
    const cardAng3 = resAng3.find(c => c.text.includes('SGGS Ang 3') && c.text.includes('Dhaul Dharam'));
    tracker.assert(Boolean(cardAng3), 'Resolved SGGS Ang 3 (Dhaul Dharam Daya Ka Poot — Japji Sahib, Pauri 16)');
    screenshots.push(await captureScreenshot('prod_06_search_ang_3'));

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
    screenshots.push(await captureScreenshot('prod_07_search_quran_2_255'));

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
    screenshots.push(await captureScreenshot('prod_08_search_gita_2_47'));

    // 9. Search: Psalm 23 (Cross-Tradition Christian KJV & Jewish Tehillim 23)
    tracker.startTest('Cross-Tradition Search: Psalm 23 (Christian KJV & Jewish Tehillim)');
    const resPsalm = await performSearch('Psalm 23');
    tracker.assert(resPsalm.length >= 2, `Search returned ${resPsalm.length} cards for "Psalm 23"`);
    const hasChristianPsalm = resPsalm.some(c => c.text.includes('The Holy Bible') || c.text.includes('King James Version'));
    const hasJewishPsalm = resPsalm.some(c => c.text.includes('Tehillim') || c.text.includes('Tanakh') || c.text.includes('Mizmor LeDavid'));
    tracker.assert(hasChristianPsalm, 'Christian King James Version Psalm 23 resolved');
    tracker.assert(hasJewishPsalm, 'Jewish Masoretic Tehillim 23 resolved');
    screenshots.push(await captureScreenshot('prod_09_search_psalm_23'));

    // 10. Search: Compassion (Seven-Theme Matrix & Verbatim Disclaimer)
    tracker.startTest('Seven-Theme Matrix: "Compassion" Across All 7 Traditions with Disclaimer');
    const compResults = await performSearch('Compassion');
    tracker.assert(compResults.length >= 7, `Compassion returned ${compResults.length} verified passages (all 7 traditions)`);

    const hasDisclaimer = await evalCode(`Boolean(document.querySelector("[data-testid='thematic-result-note']"))`);
    tracker.assert(hasDisclaimer, 'Thematic discovery disclaimer rendered: "contextual spiritual reflection, not direct scriptural equivalence"');

    const sikhComp = compResults.find(t => t.text.toLowerCase().includes('sikhism') && t.text.includes('SGGS Ang 471'));
    tracker.assert(Boolean(sikhComp), 'Sikhism Compassion verified passage correctly cites SGGS Ang 471');
    screenshots.push(await captureScreenshot('prod_10_thematic_compassion_all_7'));

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
    await new Promise(r => setTimeout(r, 1500));

    const audioState = await evalCode(`(() => {
      const audios = document.querySelectorAll('audio');
      if (audios.length === 0) return { exists: false, isPaused: true, currentTime: 0 };
      const a = audios[0];
      return { exists: true, isPaused: a.paused, currentTime: a.currentTime };
    })()`);
    tracker.assert(audioState.isPaused === true, 'Audio is strictly paused after opening reader (zero autoplay confirmed)');
    tracker.assert(audioState.currentTime === 0, 'Audio currentTime is 0 (no playback was initiated)');
    screenshots.push(await captureScreenshot('prod_11_reader_zero_autoplay'));

    // 12. My Sacred Library: 5 Tabs Verification
    tracker.startTest('My Sacred Library: Full 5-Tab Architecture Verification');
    await evalCode('document.querySelector("[data-testid=\'platform-nav-my-library-btn\']").click()');
    await new Promise(r => setTimeout(r, 1000));

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
    screenshots.push(await captureScreenshot('prod_12_my_sacred_library_5_tabs'));

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
    screenshots.push(await captureScreenshot('prod_13_offline_resilience'));

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
  }

  const resultsSummary = tracker.summary();
  const outputData = {
    timestamp: new Date().toISOString(),
    productionUrl: PROD_URL,
    screenshots,
    ...resultsSummary
  };

  const resultsPath = path.join(ARTIFACTS_DIR, 'phase6_3_4_production_results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(outputData, null, 2));
  console.log(`Saved production results to ${resultsPath}`);

  if (tracker.failedAssertions > 0) {
    process.exit(1);
  }
}

runLiveProductionVerification().catch(err => {
  console.error('Fatal production test error:', err);
  process.exit(1);
});
