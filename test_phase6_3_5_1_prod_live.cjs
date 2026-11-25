/**
 * Jafri Sacred Library — Phase 6.3.5.1
 * Live Production Verification Suite
 * Validates live deployment at https://afzaljafri-one.github.io/jafri-islamic-resources/
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

const EVIDENCE_DIR = path.join(ARTIFACTS_DIR, 'phase6_3_5_1_evidence');
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

const PROD_URL = 'https://afzaljafri-one.github.io/jafri-islamic-resources/';

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

async function runLiveProductionVerification() {
  console.log('================================================================================');
  console.log('PHASE 6.3.5.1 LIVE PRODUCTION VERIFICATION');
  console.log(`Live Target: ${PROD_URL}`);
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
      console.log(`\n[PROD TEST ${this.totalTests}] ${name}`);
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
        currentTest.passed = false;
        console.error(`  ✗ [FAIL] ${message} ${details ? '(' + details + ')' : ''}`);
      }
      currentTest.assertions.push({ message, passed, details });
    },
  };

  const screenshots = [];

  // Launch Headless Chrome
  const chromeBinary = findChrome();
  console.log(`Using Chrome binary: ${chromeBinary}`);
  const chromePort = 9330 + Math.floor(Math.random() * 40);
  const tempProfileDir = path.join(
    os.tmpdir(),
    `chrome_prod_6351_${Date.now()}_${Math.random().toString(36).slice(2)}`
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
    const str = d.toString().trim();
    if (!str.includes('CVDisplayLinkCreateWithCGDisplay')) {
      console.error('[chrome stderr]', str);
    }
  });

  let wsEndpoint = null;
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 250));
    try {
      const resp = await fetch(`http://127.0.0.1:${chromePort}/json/version`);
      if (resp.ok) {
        const data = await resp.json();
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
    try { fs.rmSync(tempProfileDir, { recursive: true, force: true }); } catch (_) {}
    throw new Error(`Failed to connect to Chrome debugging endpoint on port ${chromePort}`);
  }

  const WS = globalThis.WebSocket;
  const ws = new WS(wsEndpoint);
  await new Promise((r) => {
    ws.onopen = r;
  });

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

  const send = (method, params = {}, sessionId = undefined) => {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
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
    const res = await send(
      'Runtime.evaluate',
      { expression, returnByValue: true, awaitPromise: true },
      sessionId
    );
    if (res.exceptionDetails) {
      throw new Error(`Eval error: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result ? res.result.value : undefined;
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
      const searchTrigger = document.querySelector('[data-testid="header-universal-search-btn"]') ||
                            document.querySelector('[data-testid="search-hero-btn"]') ||
                            Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Search Scripture') || b.textContent.includes('Universal Search'));
      if (searchTrigger) searchTrigger.click();
    })()`);
    await new Promise((r) => setTimeout(r, 600));
  };

  const closeSearchModal = async () => {
    await evalCode(`(() => {
      const closeBtn = document.querySelector('[data-testid="search-modal-close-btn"]') ||
                       document.querySelector('[aria-label="Close search"]');
      if (closeBtn) closeBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 400));
  };

  const performSearch = async (query) => {
    await evalCode(`(() => {
      const input = document.querySelector('[data-testid="universal-search-input"]');
      if (input) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(input, ${JSON.stringify(query)});
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);
    await new Promise((r) => setTimeout(r, 300));
    await evalCode(`(() => {
      const form = document.querySelector('[data-testid="universal-search-form"]');
      if (form) {
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
      } else {
        const input = document.querySelector('[data-testid="universal-search-input"]');
        if (input) {
          input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true }));
        }
      }
    })()`);
    await new Promise((r) => setTimeout(r, 1000));
  };

  try {
    // -------------------------------------------------------------------------
    // TEST 1: LIVE HOMEPAGE NAVIGATION & STRICT ZERO-AUTOPLAY
    // -------------------------------------------------------------------------
    tracker.startTest('Live Homepage Navigation & Strict Zero-Autoplay');
    await send('Page.navigate', { url: PROD_URL }, sessionId);
    await new Promise((r) => setTimeout(r, 3500));

    const pageInfo = await evalCode(`(() => {
      return {
        title: document.title,
        url: window.location.href,
        audiosCount: document.querySelectorAll('audio').length,
        playingAudios: Array.from(document.querySelectorAll('audio')).filter(a => !a.paused).length
      };
    })()`);

    tracker.assert(pageInfo && pageInfo.title.includes('Jafri Sacred Library'), `Live page title loaded: "${pageInfo?.title}"`);
    tracker.assert(pageInfo && pageInfo.playingAudios === 0, `Strict Zero-Autoplay: zero audio tracks playing on live homepage (audios on page: ${pageInfo?.audiosCount})`);
    await captureScreenshot('prod_01_homepage_zero_autoplay');

    // -------------------------------------------------------------------------
    // TEST 2: ALLAMA JAWADI URDU TRANSLATION WITHHOLDING ON LIVE DEPLOYMENT
    // -------------------------------------------------------------------------
    tracker.startTest('Allama Jawadi Urdu Translation Withholding on Live Deployment');
    await openSearchModal();

    // Select "All Traditions"
    await evalCode(`(() => {
      const allBtn = document.querySelector('[data-testid="filter-religion-all"]');
      if (allBtn) allBtn.click();
      const allMatchBtn = document.querySelector('[data-testid="filter-match-all"]');
      if (allMatchBtn) allMatchBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 400));

    // Query Quran 1:1
    await performSearch('Quran 1:1');

    const quran11CardInfo = await evalCode(`(() => {
      const cards = document.querySelectorAll('[data-testid="search-result-card"]');
      const card = Array.from(cards).find(c => c.textContent.includes('Quran 1:1') || c.textContent.includes('Ayah 1 (Bismillah)')) || cards[0];
      if (!card) return null;
      const secBadge = card.querySelector('[data-testid="secondary-rights-badge"]');
      const secNotice = card.querySelector('[data-testid="secondary-translation-withheld-notice"]');
      return {
        cardsCount: cards.length,
        hasSecBadge: Boolean(secBadge),
        secBadgeText: secBadge ? secBadge.textContent.trim() : null,
        hasSecNotice: Boolean(secNotice),
        secNoticeText: secNotice ? secNotice.textContent.trim() : null,
        fullCardText: card.textContent
      };
    })()`);

    tracker.assert(quran11CardInfo && quran11CardInfo.cardsCount > 0, `Search for Quran 1:1 returned ${quran11CardInfo?.cardsCount || 0} result cards`);
    tracker.assert(quran11CardInfo && quran11CardInfo.hasSecBadge, 'Secondary rights badge is rendered on live Quran 1:1 card');
    tracker.assert(quran11CardInfo && quran11CardInfo.hasSecNotice, 'Secondary translation withheld notice is rendered on live Quran 1:1 card');
    tracker.assert(
      quran11CardInfo && !quran11CardInfo.fullCardText.includes('سب تعریفیں اللہ کے لیے ہیں جو تمام جہانوں کا رب ہے'),
      'Zero raw Allama Jawadi Urdu text is rendered on live Quran 1:1 card'
    );
    await captureScreenshot('prod_02_quran_1_1_secondary_withheld');

    // Query Ayat al-Kursi (Quran 2:255)
    await performSearch('Quran 2:255');

    const kursiInfo = await evalCode(`(() => {
      const cards = document.querySelectorAll('[data-testid="search-result-card"]');
      const card = Array.from(cards).find(c => c.textContent.includes('2:255') || c.textContent.includes('Kursi')) || cards[0];
      if (!card) return null;
      const primNotice = card.querySelector('[data-testid="translation-withheld-notice"]');
      const secNotice = card.querySelector('[data-testid="secondary-translation-withheld-notice"]');
      const parallelNotices = card.querySelectorAll('[data-testid="parallel-translation-withheld-notice"]');
      return {
        hasPrimNotice: Boolean(primNotice),
        hasSecNotice: Boolean(secNotice),
        parallelNoticesCount: parallelNotices.length,
        fullText: card.textContent
      };
    })()`);

    tracker.assert(kursiInfo && kursiInfo.hasPrimNotice, 'Ayat al-Kursi renders primary translation withheld notice on live site');
    tracker.assert(kursiInfo && kursiInfo.hasSecNotice, 'Ayat al-Kursi renders secondary translation withheld notice on live site');
    tracker.assert(
      kursiInfo && kursiInfo.parallelNoticesCount >= 2,
      `Ayat al-Kursi renders parallel withheld notices for both Sahih & Jawadi (${kursiInfo?.parallelNoticesCount}) on live site`
    );
    await captureScreenshot('prod_03_quran_2_255_all_withheld');
    await closeSearchModal();

    // -------------------------------------------------------------------------
    // TEST 3: BHAGAVAD GITA COMMENTARY PROVIDER SAFEGUARD & EDWIN ARNOLD ON LIVE SITE
    // -------------------------------------------------------------------------
    tracker.startTest('Bhagavad Gita Commentary Provider Rights Safeguard & Edwin Arnold on Live Site');
    await send('Page.navigate', { url: PROD_URL + '?religion=hinduism' }, sessionId);
    await new Promise((r) => setTimeout(r, 2500));

    const gitaInitState = await evalCode(`(() => {
      const select = Array.from(document.querySelectorAll('select')).find(s => s.querySelector('option[value="arnold"]'));
      const firstShloka = document.querySelector('[id="shloka-1"]');
      return {
        selectVal: select ? select.value : null,
        firstShlokaText: firstShloka ? firstShloka.textContent : null,
        hasWithheldNotice: Boolean(firstShloka && firstShloka.querySelector('[data-testid="gita-translation-withheld-notice"]'))
      };
    })()`);

    tracker.assert(gitaInitState.selectVal === 'arnold', `Default selected commentary is Sir Edwin Arnold (1885 Public Domain) (got "${gitaInitState.selectVal}")`);
    tracker.assert(
      gitaInitState.firstShlokaText && gitaInitState.firstShlokaText.includes('Dhritarashtra said: On the field of truth'),
      'Sir Edwin Arnold translation renders cleanly for Shloka 1:1 on live site'
    );
    await captureScreenshot('prod_04_gita_edwin_arnold_default');

    // Switch commentary to Swami Sivananda
    await evalCode(`(() => {
      const select = Array.from(document.querySelectorAll('select')).find(s => s.querySelector('option[value="arnold"]'));
      if (select) {
        select.value = 'siva';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);
    await new Promise((r) => setTimeout(r, 500));

    const sivaState = await evalCode(`(() => {
      const firstShloka = document.querySelector('[id="shloka-1"]');
      const notice = firstShloka ? firstShloka.querySelector('[data-testid="gita-translation-withheld-notice"]') : null;
      return {
        hasWithheldNotice: Boolean(notice),
        noticeText: notice ? notice.textContent : null
      };
    })()`);

    tracker.assert(sivaState.hasWithheldNotice, 'Swami Sivananda commentary renders gita-translation-withheld-notice on live site');
    tracker.assert(
      sivaState.noticeText && sivaState.noticeText.includes('Translation Withheld'),
      'Notice contains translation withheld header on live site'
    );
    await captureScreenshot('prod_05_gita_sivananda_withheld_notice');

    // Switch commentary to Swami Ramsukhdas Hindi
    await evalCode(`(() => {
      const select = Array.from(document.querySelectorAll('select')).find(s => s.querySelector('option[value="arnold"]'));
      if (select) {
        select.value = 'rams';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);
    await new Promise((r) => setTimeout(r, 500));

    const ramsState = await evalCode(`(() => {
      const firstShloka = document.querySelector('[id="shloka-1"]');
      const notice = firstShloka ? firstShloka.querySelector('[data-testid="gita-translation-withheld-notice"]') : null;
      return {
        hasWithheldNotice: Boolean(notice)
      };
    })()`);

    tracker.assert(ramsState.hasWithheldNotice, 'Swami Ramsukhdas Hindi commentary renders gita-translation-withheld-notice on live site');
    await captureScreenshot('prod_06_gita_ramsukhdas_withheld_notice');

    // Switch back to "arnold"
    await evalCode(`(() => {
      const select = Array.from(document.querySelectorAll('select')).find(s => s.querySelector('option[value="arnold"]'));
      if (select) {
        select.value = 'arnold';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);
    await new Promise((r) => setTimeout(r, 400));

    // -------------------------------------------------------------------------
    // TEST 4: THEMATIC SUBJECT DISCOVERY ACROSS ALL 7 TRADITIONS ON LIVE SITE
    // -------------------------------------------------------------------------
    tracker.startTest('Thematic Subject Discovery across All 7 Traditions & Verbatim Disclaimer on Live Site');
    await openSearchModal();

    // Select "All Traditions" filter to discover across all 7 religions
    await evalCode(`(() => {
      const allBtn = document.querySelector('[data-testid="filter-religion-all"]');
      if (allBtn) allBtn.click();
    })()`);
    await new Promise((r) => setTimeout(r, 400));

    await performSearch('Compassion');

    // Filter to Thematic Discovery match type
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

    tracker.assert(thematicResults.length >= 7, `Thematic query "Compassion" returned passages for all traditions (${thematicResults.length} found on live site)`);

    const allHaveDisclaimer = thematicResults.length > 0 && thematicResults.every(
      (r) =>
        r.hasDisclaimer &&
        r.disclaimerText.includes('This passage has been selected solely for its thematic relevance to this virtue')
    );
    tracker.assert(allHaveDisclaimer, 'Every returned thematic result card renders the mandatory verbatim virtues disclaimer on live site');

    const allHaveComponentRights = thematicResults.length > 0 && thematicResults.every((r) => r.hasCanonBadge && r.hasTransBadge);
    tracker.assert(allHaveComponentRights, 'Every returned thematic result card renders separate canonical and translation rights badges on live site');
    await captureScreenshot('prod_07_thematic_compassion_all_traditions');
    await closeSearchModal();

  } finally {
    try { ws.close(); } catch (_) {}
    try { chrome.kill(); } catch (_) {}
    try { fs.rmSync(tempProfileDir, { recursive: true, force: true }); } catch (_) {}
  }

  // ---------------------------------------------------------------------------
  // SUMMARY REPORT
  // ---------------------------------------------------------------------------
  console.log('\n================================================================================');
  console.log(`PHASE 6.3.5.1 LIVE PRODUCTION RESULTS: ${tracker.passedAssertions}/${tracker.totalAssertions} ASSERTIONS PASSED (${tracker.failedAssertions} FAILED)`);
  console.log('================================================================================\n');

  const resultsSummary = {
    suite: 'Phase 6.3.5.1 Live Production Verification',
    productionUrl: PROD_URL,
    timestamp: new Date().toISOString(),
    totalAssertions: tracker.totalAssertions,
    passedAssertions: tracker.passedAssertions,
    failedAssertions: tracker.failedAssertions,
    allPassed: tracker.failedAssertions === 0,
    tests: tracker.tests,
    screenshots,
  };

  const resultsPath = path.join(ARTIFACTS_DIR, 'phase6_3_5_1_production_results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(resultsSummary, null, 2), 'utf8');
  console.log(`Results written to ${resultsPath}`);

  if (tracker.failedAssertions > 0) {
    process.exit(1);
  } else {
    console.log('Phase 6.3.5.1 Live Production Verification: ALL TESTS PASSED SUCCESSFULLY!\n');
    process.exit(0);
  }
}

runLiveProductionVerification().catch((err) => {
  console.error('[FATAL LIVE VERIFICATION ERROR]', err);
  process.exit(1);
});
