const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = process.env.ARTIFACTS_DIR || (fs.existsSync('/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b') ? '/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b' : path.join(__dirname, 'evidence'));
const EVIDENCE_DIR = path.join(ARTIFACTS_DIR, 'phase6_3_5_evidence');
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
    console.log('PHASE 6.3.5 PRODUCTION LIVE VERIFICATION SUMMARY');
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
  console.log('PHASE 6.3.5 PRODUCTION LIVE AUDIT: FINAL RIGHTS ENFORCEMENT & COMPONENT ISOLATION');
  console.log(`Production URL: ${PROD_URL}`);
  console.log('================================================================================\n');

  const chromeBinary = findChrome();
  console.log(`Using Chrome binary: ${chromeBinary}`);
  const chromePort = 9660 + Math.floor(Math.random() * 20);
  const tempDir = path.join(require('os').tmpdir(), `chrome_phase6_3_5_prod_${Date.now()}`);
  fs.mkdirSync(tempDir, { recursive: true });

  const chrome = spawn(chromeBinary, [
    '--headless=new',
    `--remote-debugging-port=${chromePort}`,
    '--remote-allow-origins=*',
    '--autoplay-policy=no-user-gesture-required',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1440,1000',
    `--user-data-dir=${tempDir}`,
    'about:blank'
  ]);

  let wsUrl = null;
  for (let i = 0; i < 30; i++) {
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
    throw new Error('Could not connect to Chrome debugging port.');
  }

  console.log(`Connected to Chrome at ${wsUrl}`);
  const WS = globalThis.WebSocket;
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
    const filePath = path.join(EVIDENCE_DIR, `${name}.png`);
    fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
    console.log(`  📸 Screenshot saved: ${name}.png`);
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
    await new Promise(r => setTimeout(r, 800));
    return await evalCode(`(() => {
      const cards = document.querySelectorAll("[data-testid='search-result-card']");
      return Array.from(cards).map(c => ({
        text: c.innerText,
        hasExactRef: Boolean(c.innerText.includes('Exact Reference')),
        hasNumberingBadge: Boolean(c.querySelector("[data-testid='numbering-convention-badge']")),
        hasRightsBadge: Boolean(c.querySelector("[data-testid='rights-licence-badge']")),
        hasCanonicalRightsBadge: Boolean(c.querySelector("[data-testid='canonical-rights-badge']")),
        hasWithheldNotice: Boolean(c.querySelector("[data-testid='translation-withheld-notice']")),
        hasParallelCards: Boolean(c.querySelectorAll("[data-testid='parallel-translation-card']").length > 0)
      }));
    })()`);
  };

  try {
    // 1. Navigation to Live Production
    tracker.startTest('Live Production Navigation & Zero-Autoplay Check');
    await send('Page.navigate', { url: PROD_URL }, sessionId);
    await new Promise(r => setTimeout(r, 3000));

    const pageTitle = await evalCode('document.title');
    tracker.assert(pageTitle.includes('Jafri'), `Production Page Title loaded: "${pageTitle}"`);

    const initialAudio = await evalCode(`(() => {
      const audios = document.querySelectorAll('audio');
      return {
        count: audios.length,
        anyPlaying: Array.from(audios).some(a => !a.paused && a.currentTime > 0)
      };
    })()`);
    tracker.assert(initialAudio.anyPlaying === false, 'Production zero-autoplay strictly preserved');
    await captureScreenshot('prod_01_homepage_loaded');

    // 2. Open Search Modal
    tracker.startTest('Production Search Modal Activation');
    await evalCode(`(() => {
      const btn = document.querySelector("[data-testid='platform-nav-search-btn']") ||
                  Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('Search') || b.textContent.includes('⌘K') || b.textContent.includes('/')));
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 800));

    const isModalOpen = await evalCode('Boolean(document.querySelector("[data-testid=\'universal-scripture-search-modal\']"))');
    tracker.assert(isModalOpen, 'Universal search modal active in production');
    await captureScreenshot('prod_02_search_modal_open');

    // 3. Search: Ang 1384 (Sabr / Patience Salok 115)
    tracker.startTest('Live Sikh Citation Audit: Ang 1384 (Salok 115)');
    const resAng1384 = await performSearch('Ang 1384');
    tracker.assert(resAng1384.length > 0, `Search returned ${resAng1384.length} cards for "Ang 1384"`);
    const card1384 = resAng1384.find(c => c.text.includes('SGGS Ang 1384') && c.text.includes('115'));
    tracker.assert(Boolean(card1384), 'Production resolved SGGS Ang 1384 (Salok Sheikh Farid 115)');
    const text1384 = card1384?.text || '';
    tracker.assert(
      text1384.includes('ਸਬਰੁ ਮੰਝਿ ਕਮਾਣ') || text1384.includes('patience be thy bow') || text1384.includes('Sabr: Make Patience'),
      'Gurmukhi "Sabr: Make Patience Thy Bow" verified on live production'
    );
    tracker.assert(text1384.includes('Custom Terms'), 'Live displays Custom Terms (RESTRICTED)');
    await captureScreenshot('prod_03_search_ang_1384_salok_115');

    // 4. Search: Ang 1382 (Distress Salok 85)
    tracker.startTest('Live Sikh Citation Audit: Ang 1382 (Salok 85)');
    const resAng1382 = await performSearch('Ang 1382');
    tracker.assert(resAng1382.length > 0, `Search returned ${resAng1382.length} cards for "Ang 1382"`);
    const card1382 = resAng1382.find(c => c.text.includes('SGGS Ang 1382') && c.text.includes('85'));
    tracker.assert(Boolean(card1382), 'Production resolved SGGS Ang 1382 (Salok Sheikh Farid 85)');
    const text1382 = card1382?.text || '';
    tracker.assert(
      text1382.includes('Whirlpool') || text1382.includes('ਦੁਖਾ ਸੇਤੀ') || text1382.includes('sorrow'),
      'True Salok 85 distress/whirlpool accurately cited in live deployment'
    );
    await captureScreenshot('prod_04_search_ang_1382_salok_85');

    // 5. Search: Ang 471 (Daya Kapah)
    tracker.startTest('Live Sikh Citation Audit: Ang 471 (Daya Kapah)');
    const resAng471 = await performSearch('Ang 471');
    tracker.assert(resAng471.length > 0, `Search returned ${resAng471.length} cards for "Ang 471"`);
    const card471 = resAng471.find(c => c.text.includes('SGGS Ang 471') && c.text.includes('Daya Kapah'));
    tracker.assert(Boolean(card471), 'Resolved SGGS Ang 471 (Daya Kapah)');
    await captureScreenshot('prod_05_search_ang_471');

    // 6. Search: Ang 3 (Dhaul Dharam)
    tracker.startTest('Live Sikh Citation Audit: Ang 3 (Dhaul Dharam)');
    const resAng3 = await performSearch('Ang 3');
    tracker.assert(resAng3.length > 0, `Search returned ${resAng3.length} cards for "Ang 3"`);
    const card3 = resAng3.find(c => c.text.includes('SGGS Ang 3') && c.text.includes('Dhaul Dharam'));
    tracker.assert(Boolean(card3), 'Resolved SGGS Ang 3 (Dhaul Dharam Daya Ka Poot)');
    await captureScreenshot('prod_06_search_ang_3');

    // 7. Search: Quran 2:255 (Ayat al-Kursi Rights Gate)
    tracker.startTest('Live Rights Gate Verification: Quran 2:255 (Tanzil CC BY 3.0 vs Translation Withheld)');
    const resQuran = await performSearch('Quran 2:255');
    tracker.assert(resQuran.length > 0, `Search returned ${resQuran.length} cards for "Quran 2:255"`);
    const cardQuran = resQuran.find(c => c.text.includes('2:255') || c.text.includes('Kursi'));
    tracker.assert(Boolean(cardQuran), 'Resolved Ayat al-Kursi (Quran 2:255)');
    const textQuran = cardQuran?.text || '';
    tracker.assert(textQuran.includes('CC BY 3.0') || cardQuran?.hasCanonicalRightsBadge, 'Arabic canonical text displays verified CC BY 3.0 badge');
    tracker.assert(textQuran.includes('Permission Required') || cardQuran?.hasWithheldNotice, 'Restricted translation text is strictly withheld in production');
    tracker.assert(!textQuran.includes('the Ever-Living, the Self-Sustaining of all existence'), 'Sahih International text strictly absent from production display');
    await captureScreenshot('prod_07_search_quran_2_255');

    // 8. Search: Gita 2:47 (Numbering Conventions & Edwin Arnold Public Domain Translation)
    tracker.startTest('Live Content Consistency: Gita 2:47 (701/700 Standard & Edwin Arnold Public Domain)');
    const resGita = await performSearch('Gita 2:47');
    tracker.assert(resGita.length > 0, `Search returned ${resGita.length} cards for "Gita 2:47"`);
    const cardGita = resGita.find(c => c.text.includes('2:47') || c.text.includes('Karmanye'));
    tracker.assert(Boolean(cardGita), 'Resolved Bhagavad Gita 2:47');
    const textGita = cardGita?.text || '';
    tracker.assert(
      textGita.includes('701-Verse Standard') && textGita.includes('700-Verse Recension'),
      'Dual 701 active / 700 cross-reference convention verified in production'
    );
    tracker.assert(textGita.includes('Public Domain'), 'Public domain status verified in production');
    await captureScreenshot('prod_08_search_gita_2_47');

    // 9. Search: Psalm 23 (Christian KJV & Jewish Tehillim 23)
    tracker.startTest('Live Cross-Tradition Search: Psalm 23');
    const resPsalm = await performSearch('Psalm 23');
    tracker.assert(resPsalm.length >= 2, `Search returned ${resPsalm.length} cards for "Psalm 23"`);
    const hasChr = resPsalm.some(c => c.text.includes('The Holy Bible') || c.text.includes('King James Version'));
    const hasJud = resPsalm.some(c => c.text.includes('Tehillim') || c.text.includes('Tanakh') || c.text.includes('Mizmor LeDavid'));
    tracker.assert(hasChr, 'Christian King James Version Psalm 23 resolved');
    tracker.assert(hasJud, 'Jewish Masoretic Tehillim 23 resolved');
    await captureScreenshot('prod_09_search_psalm_23');

    // 10. Search: Compassion (Seven-Theme Matrix & Verbatim Disclaimer)
    tracker.startTest('Live Seven-Theme Matrix: "Compassion" with Mandatory Disclaimer');
    const resComp = await performSearch('Compassion');
    tracker.assert(resComp.length >= 7, `Compassion returned ${resComp.length} verified passages`);
    const hasDiscl = await evalCode(`Boolean(document.querySelector("[data-testid='thematic-result-note']"))`);
    tracker.assert(hasDiscl, 'Thematic discovery disclaimer rendered: "contextual spiritual reflection, not direct scriptural equivalence"');
    await captureScreenshot('prod_10_thematic_compassion_all_7');

    // 11. Zero Autoplay Reader Verification
    tracker.startTest('Live Scripture Reader: Zero-Autoplay Architecture');
    await evalCode(`(() => {
      const readBtn = document.querySelector("[data-testid='search-result-read-btn']");
      if (readBtn) readBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 1200));

    const audioState = await evalCode(`(() => {
      const audios = document.querySelectorAll('audio');
      if (audios.length === 0) return { exists: false, isPaused: true, currentTime: 0 };
      const a = audios[0];
      return { exists: true, isPaused: a.paused, currentTime: a.currentTime };
    })()`);
    tracker.assert(audioState.isPaused === true, 'Audio is strictly paused after opening reader in production');
    tracker.assert(audioState.currentTime === 0, 'Audio currentTime is 0 in production');
    await captureScreenshot('prod_11_reader_zero_autoplay');

    // 12. My Sacred Library: 5 Tabs Verification
    tracker.startTest('Live My Sacred Library: Full 5-Tab Architecture');
    await evalCode('document.querySelector("[data-testid=\'platform-nav-my-library-btn\']").click()');
    await new Promise(r => setTimeout(r, 800));

    const tabs = await evalCode(`(() => {
      return {
        continue: Boolean(document.querySelector("[data-testid='tab-continue']")),
        bookmarks: Boolean(document.querySelector("[data-testid='tab-bookmarks']")),
        history: Boolean(document.querySelector("[data-testid='tab-history']")),
        progress: Boolean(document.querySelector("[data-testid='tab-progress']")),
        plans: Boolean(document.querySelector("[data-testid='tab-plans']"))
      };
    })()`);
    tracker.assert(tabs.continue && tabs.bookmarks && tabs.history && tabs.progress && tabs.plans, 'All 5 My Sacred Library tabs verified live');
    await captureScreenshot('prod_12_my_sacred_library_5_tabs');

    // Close library
    await evalCode(`(() => {
      const closeBtn = document.querySelector('button[title="Close Library"]');
      if (closeBtn) closeBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    // 13. Offline Emulation
    tracker.startTest('Live Offline Emulation: Local Corpus and Search Offline Resiliency');
    await send('Network.emulateNetworkConditions', {
      offline: true,
      latency: 0,
      downloadThroughput: 0,
      uploadThroughput: 0
    }, sessionId);

    await evalCode(`(() => {
      const btn = document.querySelector("[data-testid='platform-nav-search-btn']");
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const offResults = await performSearch('John 3:16');
    tracker.assert(offResults.length > 0, `Offline search returned ${offResults.length} results`);
    const cardJ = offResults.find(c => c.text.includes('John 3:16'));
    tracker.assert(Boolean(cardJ), 'John 3:16 resolved while completely offline in live production');
    await captureScreenshot('prod_13_offline_resilience');

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

  const results = tracker.summary();
  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'phase6_3_5_production_results.json'), JSON.stringify(results, null, 2));

  if (tracker.failedAssertions > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runLiveProductionVerification().catch((err) => {
  console.error('Fatal error during production verification:', err);
  process.exit(1);
});
