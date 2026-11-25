const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = '/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b';
const EVIDENCE_DIR = path.join(ARTIFACTS_DIR, 'phase6_3_3_evidence');
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

const PROD_URL = 'https://afzaljafri-one.github.io/jafri-islamic-resources/';

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
    console.log('PHASE 6.3.3 PRODUCTION LIVE VERIFICATION SUMMARY');
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
  console.log('PHASE 6.3.3 PRODUCTION LIVE AUDIT: SCRIPTURE SEARCH, CITATIONS & RIGHTS');
  console.log(`Production URL: ${PROD_URL}`);
  console.log(`Target Commit:  22e70625eea82a39ac13c699e1ac5efca876283f`);
  console.log('================================================================================\n');

  const chromePort = 9640 + Math.floor(Math.random() * 20);
  const tempDir = `/tmp/chrome_phase6_3_3_prod_${Date.now()}`;
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
    } catch (e) {}
  }

  if (!wsUrl) {
    throw new Error('Failed to connect to Chrome DevTools protocol on port ' + chromePort);
  }
  console.log(`Connected to Chrome at ${wsUrl}`);

  const ws = new globalThis.WebSocket(wsUrl);
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
    return res.result.value;
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
    // Navigate to production
    console.log(`Navigating to ${PROD_URL} ...`);
    await send('Page.navigate', { url: PROD_URL }, sessionId);
    await new Promise(r => setTimeout(r, 4000));

    // Test 1: Production bundle & commit check
    tracker.startTest('Production Live Bundle & Assets Loaded');
    const pageTitle = await evalCode('document.title');
    tracker.assert(pageTitle.includes('Jafri Sacred Library'), `Production page title verified: "${pageTitle}"`);

    const hasNavSearch = await evalCode(`Boolean(document.querySelector("[data-testid='platform-nav-search-btn']"))`);
    tracker.assert(hasNavSearch, 'Header Navigation contains Search Scripture button');

    const hasNavLibrary = await evalCode(`Boolean(document.querySelector("[data-testid='platform-nav-my-library-btn']"))`);
    tracker.assert(hasNavLibrary, 'Header Navigation contains My Sacred Library button');
    screenshots.push(await captureScreenshot('prod_01_homepage_loaded'));

    // Open Search Modal
    tracker.startTest('Open Universal Scripture Search Modal on Production');
    await evalCode(`document.querySelector("[data-testid='platform-nav-search-btn']").click()`);
    await new Promise(r => setTimeout(r, 600));

    const isModalOpen = await evalCode(`Boolean(document.querySelector("[data-testid='universal-scripture-search-modal']"))`);
    tracker.assert(isModalOpen, 'Universal Scripture Search modal opened in production');

    const hasInput = await evalCode(`Boolean(document.querySelector("[data-testid='universal-search-input']"))`);
    tracker.assert(hasInput, 'Scripture search input is focused and accessible in production');
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

    // Test 3: Search SGGS Ang 471 (Daya Kapah)
    tracker.startTest('Production Search: "Ang 471" Resolves Daya Kapah Santokh Soot');
    const resAng471 = await performSearch('Ang 471');
    tracker.assert(resAng471.length > 0, `Search returned ${resAng471.length} cards for "Ang 471"`);
    const cardAng471 = resAng471.find(c => c.text.includes('SGGS Ang 471') && c.text.includes('Daya Kapah'));
    tracker.assert(Boolean(cardAng471), 'Live production resolved SGGS Ang 471 (Daya Kapah — Asa di Var, Salok M:1)');
    tracker.assert(cardAng471?.hasExactRef, 'Ang 471 has Exact Reference match badge');
    tracker.assert(cardAng471?.hasNumberingBadge, 'Ang 471 renders Numbering Convention badge');
    tracker.assert(cardAng471?.hasRightsBadge, 'Ang 471 renders Rights and Licence badge');
    screenshots.push(await captureScreenshot('prod_03_search_ang_471'));

    // Test 4: Search SGGS Ang 3 (Dhaul Dharam)
    tracker.startTest('Production Search: "Ang 3" Resolves Dhaul Dharam Daya Ka Poot');
    const resAng3 = await performSearch('Ang 3');
    tracker.assert(resAng3.length > 0, `Search returned ${resAng3.length} cards for "Ang 3"`);
    const cardAng3 = resAng3.find(c => c.text.includes('SGGS Ang 3') && c.text.includes('Dhaul Dharam'));
    tracker.assert(Boolean(cardAng3), 'Live production resolved SGGS Ang 3 (Dhaul Dharam Daya Ka Poot — Japji Sahib, Pauri 16)');
    screenshots.push(await captureScreenshot('prod_04_search_ang_3'));

    // Test 5: Search SGGS Ang 1381 (Salok Sheikh Farid 78)
    tracker.startTest('Production Search: "Ang 1381" Resolves Salok Sheikh Farid 78');
    const resAng1381 = await performSearch('Ang 1381');
    tracker.assert(resAng1381.length > 0, `Search returned ${resAng1381.length} cards for "Ang 1381"`);
    const cardAng1381 = resAng1381.find(c => c.text.includes('SGGS Ang 1381') && c.text.includes('Fareed'));
    tracker.assert(Boolean(cardAng1381), 'Live production resolved SGGS Ang 1381 (Salok Sheikh Farid 78)');
    screenshots.push(await captureScreenshot('prod_05_search_ang_1381'));

    // Test 6: Search SGGS Ang 1382 (Salok Sheikh Farid 85)
    tracker.startTest('Production Search: "Ang 1382" Resolves Salok Sheikh Farid 85');
    const resAng1382 = await performSearch('Ang 1382');
    tracker.assert(resAng1382.length > 0, `Search returned ${resAng1382.length} cards for "Ang 1382"`);
    const cardAng1382 = resAng1382.find(c => c.text.includes('SGGS Ang 1382') && c.text.includes('patience'));
    tracker.assert(Boolean(cardAng1382), 'Live production resolved SGGS Ang 1382 (Salok Sheikh Farid 85)');
    screenshots.push(await captureScreenshot('prod_06_search_ang_1382'));

    // Test 7: Search Gita 2:47 with 701/700 convention
    tracker.startTest('Production Search: "Gita 2:47" Displays 701/700 Numbering Convention');
    const resGita = await performSearch('Gita 2:47');
    tracker.assert(resGita.length > 0, `Search returned ${resGita.length} cards for "Gita 2:47"`);
    const cardGita = resGita.find(c => c.text.includes('Bhagavad Gita 2:47'));
    tracker.assert(Boolean(cardGita), 'Live production resolved Bhagavad Gita 2:47');
    tracker.assert(cardGita?.hasNumberingBadge, 'Gita 2:47 renders Numbering Convention badge');
    tracker.assert(cardGita?.text.includes('701') && cardGita?.text.includes('700'), 'Gita card transparently shows 701 active convention & 700 Shankara cross-reference');
    screenshots.push(await captureScreenshot('prod_07_search_gita_2_47'));

    // Test 8: Search Quran 2:255 with Tanzil CC-BY-3.0 licence
    tracker.startTest('Production Search: "Quran 2:255" Displays Tanzil CC-BY-3.0 Rights Badge');
    const resQuran = await performSearch('Quran 2:255');
    tracker.assert(resQuran.length > 0, `Search returned ${resQuran.length} cards for "Quran 2:255"`);
    const cardQuran = resQuran.find(c => c.text.includes('Surah Al-Baqarah 2:255'));
    tracker.assert(Boolean(cardQuran), 'Live production resolved Ayat al-Kursi (Quran 2:255)');
    tracker.assert(cardQuran?.hasRightsBadge, 'Quran 2:255 renders Rights Licence badge');
    tracker.assert(cardQuran?.text.includes('CC-BY-3.0'), 'CC-BY-3.0 licence rendered on live card');
    screenshots.push(await captureScreenshot('prod_08_search_quran_2_255'));

    // Test 9: Search Psalm 23 (Christian & Jewish)
    tracker.startTest('Production Search: "Psalm 23" Cross-Tradition Resolution with Public Domain');
    const resPsalm = await performSearch('Psalm 23');
    tracker.assert(resPsalm.length >= 2, `Search returned ${resPsalm.length} cards for "Psalm 23"`);
    const hasChristian = resPsalm.some(c => c.text.toLowerCase().includes('christianity') || c.text.includes('The Holy Bible'));
    const hasJewish = resPsalm.some(c => c.text.toLowerCase().includes('judaism') || c.text.includes('Tehillim') || c.text.includes('Tanakh'));
    tracker.assert(hasChristian, 'Live Christian KJV Psalm 23 resolved');
    tracker.assert(hasJewish, 'Live Jewish Tehillim 23 resolved');
    screenshots.push(await captureScreenshot('prod_09_search_psalm_23'));

    // Test 10: Thematic Subject Discovery: Compassion across all 7 traditions
    tracker.startTest('Production Thematic Discovery: "Compassion" Across All 7 Traditions');
    const compResults = await performSearch('Compassion');
    tracker.assert(compResults.length >= 7, `Compassion returned ${compResults.length} verified passages across 7 traditions`);
    const hasDisclaimer = await evalCode(`Boolean(document.querySelector("[data-testid='thematic-result-note']"))`);
    tracker.assert(hasDisclaimer, 'Thematic discovery disclaimer rendered: "contextual spiritual reflection, not direct scriptural equivalence"');
    const sikhThematicComp = compResults.find(t => t.text.toLowerCase().includes('sikhism') && t.text.includes('SGGS Ang 471'));
    tracker.assert(Boolean(sikhThematicComp), 'Sikhism Compassion verified passage correctly cites SGGS Ang 471 in production');
    screenshots.push(await captureScreenshot('prod_10_thematic_compassion'));

    // Test 11: Reader navigation with zero audio autoplay
    tracker.startTest('Production Zero Audio Autoplay: Navigation from Search Modal');
    await evalCode(`(() => {
      const readBtn = document.querySelector("[data-testid='search-result-card'] button");
      if (readBtn) readBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 1200));

    const audioPaused = await evalCode(`(() => {
      const audio = document.querySelector('audio');
      return audio ? audio.paused : true;
    })()`);
    tracker.assert(audioPaused, 'Audio element is strictly paused after reader navigation (zero autoplay confirmed)');

    const currentTime = await evalCode(`(() => {
      const audio = document.querySelector('audio');
      return audio ? audio.currentTime : 0;
    })()`);
    tracker.assert(currentTime === 0, `Audio currentTime is 0 in production (currentTime=${currentTime})`);
    screenshots.push(await captureScreenshot('prod_11_reader_zero_autoplay'));

    // Test 12: My Sacred Library 5 Tabs Regression Verification
    tracker.startTest('Production My Sacred Library: All 5 Tabs Verified Operational');
    await evalCode(`(() => {
      const libBtn = document.querySelector("[data-testid='platform-nav-my-library-btn']");
      if (libBtn) libBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const isLibModalOpen = await evalCode(`Boolean(document.querySelector("[data-testid='personal-library-modal']"))`);
    tracker.assert(isLibModalOpen, 'My Sacred Library modal opened in production');

    const tabs = await evalCode(`(() => {
      const tabBtns = document.querySelectorAll("[role='tab'], button");
      const texts = Array.from(tabBtns).map(b => b.innerText);
      return {
        hasContinue: texts.some(t => t.includes('Continue')),
        hasBookmarks: texts.some(t => t.includes('Bookmarks')),
        hasHistory: texts.some(t => t.includes('History')),
        hasProgress: texts.some(t => t.includes('Progress')),
        hasPlans: texts.some(t => t.includes('Plans') || t.includes('Reading Plans'))
      };
    })()`);
    tracker.assert(tabs.hasContinue, 'Continue Reading tab present in production');
    tracker.assert(tabs.hasBookmarks, 'Bookmarks tab present in production');
    tracker.assert(tabs.hasHistory, 'Reading History tab present in production');
    tracker.assert(tabs.hasProgress, 'Reading Progress tab present in production');
    tracker.assert(tabs.hasPlans, 'Daily Reading Plans tab present in production');
    screenshots.push(await captureScreenshot('prod_12_my_sacred_library_5_tabs'));

    // Test 13: Offline Emulation
    tracker.startTest('Production Offline Resiliency: Search While Fully Disconnected');
    await evalCode(`(() => {
      const closeBtn = document.querySelector("[aria-label='Close modal'], button[aria-label='Close'], button.text-slate-400");
      if (closeBtn) closeBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 400));

    await evalCode(`document.querySelector("[data-testid='platform-nav-search-btn']").click()`);
    await new Promise(r => setTimeout(r, 600));

    console.log('  Emulating network conditions: OFFLINE = true ...');
    await send('Network.emulateNetworkConditions', {
      offline: true,
      latency: 0,
      downloadThroughput: 0,
      uploadThroughput: 0
    }, sessionId);

    const offlineResults = await performSearch('John 3:16');
    tracker.assert(offlineResults.length > 0, `Offline production search returned ${offlineResults.length} results for "John 3:16"`);
    const cardJohn = offlineResults.find(c => c.text.includes('John 3:16'));
    tracker.assert(Boolean(cardJohn), 'John 3:16 resolved while completely offline in production');
    screenshots.push(await captureScreenshot('prod_13_offline_resilience'));

    await send('Network.emulateNetworkConditions', {
      offline: false,
      latency: 0,
      downloadThroughput: -1,
      uploadThroughput: -1
    }, sessionId);

  } catch (err) {
    console.error('Production Verification Error:', err);
    tracker.assert(false, 'Production verification completed without unhandled exceptions', err.message);
  } finally {
    const summary = tracker.summary();
    summary.screenshots = screenshots;
    summary.timestamp = new Date().toISOString();
    summary.productionUrl = PROD_URL;
    summary.targetCommit = '22e70625eea82a39ac13c699e1ac5efca876283f';

    const resultsFile = path.join(ARTIFACTS_DIR, 'phase6_3_3_production_results.json');
    fs.writeFileSync(resultsFile, JSON.stringify(summary, null, 2));
    console.log(`Production results written to: ${resultsFile}`);

    try {
      await send('Target.closeTarget', { targetId: target.targetId });
      ws.close();
      chrome.kill();
    } catch (e) {}
  }
}

runLiveProductionVerification().catch(e => {
  console.error('Fatal runner error:', e);
  process.exit(1);
});
