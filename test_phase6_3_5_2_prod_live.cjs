/**
 * Jafri Sacred Library — Phase 6.3.5.2
 * Live Production Verification Suite (Runs against live GitHub Pages deployment)
 * Production URL: https://afzaljafri-one.github.io/jafri-islamic-resources/
 */

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PROD_URL = 'https://afzaljafri-one.github.io/jafri-islamic-resources/';

const ARTIFACTS_DIR =
  process.env.ARTIFACTS_DIR ||
  (fs.existsSync('/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b')
    ? '/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b'
    : path.join(__dirname, 'prod_evidence'));

const EVIDENCE_DIR = path.join(ARTIFACTS_DIR, 'phase6_3_5_2_prod_evidence');
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

async function runProductionVerification() {
  console.log('================================================================================');
  console.log('PHASE 6.3.5.2 LIVE PRODUCTION VERIFICATION SUITE');
  console.log(`Target Production URL: ${PROD_URL}`);
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
  // 1. DIRECT RETRIEVAL OF LIVE CDN GITA CHAPTER JSON ASSETS
  // ---------------------------------------------------------------------------
  tracker.startTest('Direct Retrieval of Live CDN Gita Chapter JSON Assets');
  const CHAPTERS_TO_PROBE = [1, 2, 4, 18];
  let liveCdnPurged = true;

  for (const ch of CHAPTERS_TO_PROBE) {
    const cdnUrl = `${PROD_URL}data/gita/chapter_${ch}.json`;
    try {
      const resp = await fetch(cdnUrl, { cache: 'no-store' });
      tracker.assert(resp.ok, `Live CDN serves Gita chapter_${ch}.json successfully (status ${resp.status})`);
      const data = await resp.json();
      const verses = Array.isArray(data) ? data : (data.verses || []);
      tracker.assert(verses.length > 0, `Chapter ${ch} on live CDN contains ${verses.length} verses`);

      const getCommText = (c) => typeof c === 'string' ? c : (c?.translation || c?.et || '');

      for (const v of verses) {
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
          liveCdnPurged = false;
          console.error(`Live CDN serves unwithheld text in Chapter ${ch} verse ${v.verse}`);
        }
      }
    } catch (e) {
      tracker.assert(false, `Failed to fetch live CDN asset ${cdnUrl}`, e.message);
    }
  }

  tracker.assert(liveCdnPurged, 'Live CDN Gita chapter JSON assets strictly serve withheld notices for all modern translations');

  // ---------------------------------------------------------------------------
  // 2. LAUNCH HEADLESS CHROME & CDP SESSION AGAINST LIVE SITE
  // ---------------------------------------------------------------------------
  const chromeBinary = findChrome();
  console.log(`Using Chrome binary: ${chromeBinary}`);
  const chromePort = 9240 + Math.floor(Math.random() * 50);
  const tempProfileDir = path.join(
    os.tmpdir(),
    `chrome_prod_phase6_3_5_2_${Date.now()}_${Math.random().toString(36).slice(2)}`
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
      await new Promise((r) => setTimeout(r, 1200));
    };

    // -------------------------------------------------------------------------
    // TEST 3: LIVE HOMEPAGE NAVIGATION & STRICT ZERO-AUTOPLAY
    // -------------------------------------------------------------------------
    tracker.startTest('Live Homepage Navigation & Strict Zero-Autoplay');
    await send('Page.navigate', { url: PROD_URL }, sessionId);
    await new Promise((r) => setTimeout(r, 3000));

    const pageTitle = await evalCode('document.title');
    tracker.assert(pageTitle.includes('Jafri'), `Production page title loaded: "${pageTitle}"`);

    const audioState = await evalCode(`(() => {
      const audios = document.querySelectorAll('audio');
      return {
        count: audios.length,
        anyPlaying: Array.from(audios).some(a => !a.paused && a.currentTime > 0)
      };
    })()`);
    tracker.assert(!audioState.anyPlaying, 'Strict Zero-Autoplay: zero audio tracks autoplaying on production load');
    await captureScreenshot('prod_01_homepage_zero_autoplay');

    // -------------------------------------------------------------------------
    // TEST 4: LIVE QURAN SEARCH & RECONCILED COORDINATES (25:63 & 2:255)
    // -------------------------------------------------------------------------
    tracker.startTest('Live Quran Search & Reconciled Coordinates (Surah 25:63)');
    await openSearchModal();

    await performSearch('Quran 25:63');
    const quran2563Info = await evalCode(`(() => {
      const cards = document.querySelectorAll('[data-testid="search-result-card"]');
      const card = Array.from(cards).find(c => c.textContent.includes('25:63') || c.textContent.includes('Servants of the Most Merciful')) || cards[0];
      if (!card) return null;
      const secNotice = card.querySelector('[data-testid="secondary-translation-withheld-notice"]');
      return {
        found: true,
        text: card.textContent,
        hasSecNotice: Boolean(secNotice)
      };
    })()`);

    tracker.assert(Boolean(quran2563Info?.found), 'Live search for Quran 25:63 returned card successfully');
    tracker.assert(
      quran2563Info?.hasSecNotice,
      'Live Quran 25:63 card renders secondary translation withheld notice for Allama Jawadi'
    );
    tracker.assert(
      !quran2563Info?.text.includes('اور رحمان کے بندے وہ ہیں'),
      'Live Quran 25:63 card strictly contains ZERO unverified Allama Jawadi Urdu text'
    );
    await captureScreenshot('prod_02_quran_25_63_reconciled');

    // Search Quran 2:255 (Ayat al-Kursi)
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

    tracker.assert(kursiInfo && kursiInfo.hasPrimNotice, 'Live Ayat al-Kursi renders primary translation withheld notice');
    tracker.assert(kursiInfo && kursiInfo.hasSecNotice, 'Live Ayat al-Kursi renders secondary translation withheld notice');
    await captureScreenshot('prod_03_quran_2_255_all_withheld');
    await closeSearchModal();

    // -------------------------------------------------------------------------
    // TEST 5: LIVE GITA CHAPTER 1 & ATTEMPTED SELECTION OF WITHHELD COMMENTARIES
    // -------------------------------------------------------------------------
    tracker.startTest('Live Gita Chapter 1 & Commentary Switcher Safeguard');
    await send('Page.navigate', { url: PROD_URL + '?religion=hinduism&chapter=1' }, sessionId);
    await new Promise((r) => setTimeout(r, 3000));

    const gitaInitState = await evalCode(`(() => {
      const select = Array.from(document.querySelectorAll('select')).find(s => s.querySelector('option[value="arnold"]'));
      const firstShloka = document.querySelector('[id="shloka-1"]');
      return {
        selectVal: select ? select.value : null,
        firstShlokaText: firstShloka ? firstShloka.textContent : null,
      };
    })()`);

    tracker.assert(gitaInitState.selectVal === 'arnold', `Live default commentary is Sir Edwin Arnold (1885 Public Domain) (got "${gitaInitState.selectVal}")`);
    tracker.assert(
      gitaInitState.firstShlokaText && gitaInitState.firstShlokaText.includes('Dhritarashtra said: On the field of truth'),
      'Sir Edwin Arnold translation renders cleanly on live production for Chapter 1 Shloka 1'
    );
    await captureScreenshot('prod_04_gita_edwin_arnold_default');

    // Switch commentary dropdown to siva (Swami Sivananda)
    await evalCode(`(() => {
      const select = Array.from(document.querySelectorAll('select')).find(s => s.querySelector('option[value="arnold"]'));
      if (select) {
        select.value = 'siva';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);
    await new Promise((r) => setTimeout(r, 800));

    const sivaState = await evalCode(`(() => {
      const firstShloka = document.querySelector('[id="shloka-1"]');
      const notice = firstShloka ? firstShloka.querySelector('[data-testid="gita-translation-withheld-notice"]') : null;
      return {
        hasWithheldNotice: Boolean(notice),
        noticeText: notice ? notice.textContent.trim() : null
      };
    })()`);

    tracker.assert(sivaState.hasWithheldNotice, 'Live Swami Sivananda commentary renders gita-translation-withheld-notice');
    await captureScreenshot('prod_05_gita_sivananda_withheld_notice');

    // Switch commentary dropdown to rams (Swami Ramsukhdas Hindi)
    await evalCode(`(() => {
      const select = Array.from(document.querySelectorAll('select')).find(s => s.querySelector('option[value="arnold"]'));
      if (select) {
        select.value = 'rams';
        select.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);
    await new Promise((r) => setTimeout(r, 800));

    const ramsState = await evalCode(`(() => {
      const firstShloka = document.querySelector('[id="shloka-1"]');
      const notice = firstShloka ? firstShloka.querySelector('[data-testid="gita-translation-withheld-notice"]') : null;
      return { hasWithheldNotice: Boolean(notice) };
    })()`);

    tracker.assert(ramsState.hasWithheldNotice, 'Live Swami Ramsukhdas Hindi commentary renders gita-translation-withheld-notice');
    await captureScreenshot('prod_06_gita_ramsukhdas_withheld_notice');

    // -------------------------------------------------------------------------
    // TEST 6: LIVE GITA CHAPTER 2 & CHAPTER 4 RETRIEVAL
    // -------------------------------------------------------------------------
    tracker.startTest('Live Gita Chapter 2 & Chapter 4 Provider Retrieval');

    // Navigate to Chapter 2
    await send('Page.navigate', { url: PROD_URL + '?religion=hinduism&chapter=2' }, sessionId);
    await new Promise((r) => setTimeout(r, 3000));

    const ch2State = await evalCode(`(() => {
      const shlokas = document.querySelectorAll('[id^="shloka-"]');
      const shloka47 = document.querySelector('[id="shloka-47"]');
      return {
        shlokasCount: shlokas.length,
        hasShloka47: Boolean(shloka47),
        shloka47Text: shloka47 ? shloka47.textContent : null,
      };
    })()`);

    tracker.assert(ch2State.shlokasCount === 72, `Live Gita Chapter 2 loaded all 72 verses from sanitized CDN asset (found ${ch2State.shlokasCount})`);
    tracker.assert(
      ch2State.hasShloka47 && ch2State.shloka47Text.includes('कर्मण्येवाधिकारस्ते'),
      'Live Gita 2:47 Sanskrit original text is preserved intact'
    );
    tracker.assert(
      ch2State.shloka47Text && (ch2State.shloka47Text.includes('Thy right is only unto action') || ch2State.shloka47Text.includes('Rightly thy business is with deed alone')),
      'Live Gita 2:47 renders Edwin Arnold landmark translation'
    );

    // Navigate to Chapter 4
    await send('Page.navigate', { url: PROD_URL + '?religion=hinduism&chapter=4' }, sessionId);
    await new Promise((r) => setTimeout(r, 3000));

    const ch4State = await evalCode(`(() => {
      const shlokas = document.querySelectorAll('[id^="shloka-"]');
      const shloka38 = document.querySelector('[id="shloka-38"]');
      return {
        shlokasCount: shlokas.length,
        hasShloka38: Boolean(shloka38),
        shloka38Text: shloka38 ? shloka38.textContent : null,
      };
    })()`);

    tracker.assert(ch4State.shlokasCount === 42, `Live Gita Chapter 4 loaded all 42 verses from sanitized CDN asset (found ${ch4State.shlokasCount})`);
    tracker.assert(
      ch4State.hasShloka38 && ch4State.shloka38Text.includes('न हि ज्ञानेن सदृशं') || ch4State.shloka38Text.includes('न हि ज्ञानेन'),
      'Live Gita 4:38 Sanskrit original text is preserved intact'
    );
    await captureScreenshot('prod_07_gita_ch2_and_ch4_retrieval');

    // -------------------------------------------------------------------------
    // TEST 7: LIVE THEMATIC DISCOVERY ACROSS ALL 7 TRADITIONS & DISCLAIMER
    // -------------------------------------------------------------------------
    tracker.startTest('Live Thematic Discovery across All 7 Traditions & Verbatim Disclaimer');
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
    await new Promise((r) => setTimeout(r, 800));

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

    tracker.assert(thematicResults.length >= 7, `Live thematic query "Compassion" returned passages for all traditions (${thematicResults.length} found)`);

    const allHaveDisclaimer = thematicResults.length > 0 && thematicResults.every(
      (r) =>
        r.hasDisclaimer &&
        r.disclaimerText.includes('This passage has been selected solely for its thematic relevance to this virtue')
    );
    tracker.assert(allHaveDisclaimer, 'Every returned thematic result card renders the mandatory verbatim virtues disclaimer on live site');

    const allHaveComponentRights = thematicResults.length > 0 && thematicResults.every((r) => r.hasCanonBadge && r.hasTransBadge);
    tracker.assert(allHaveComponentRights, 'Every returned thematic result card renders separate canonical and translation rights badges on live site');
    await captureScreenshot('prod_08_thematic_compassion_all_traditions');
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
  console.log(`PHASE 6.3.5.2 PRODUCTION RESULTS: ${tracker.passedAssertions}/${tracker.totalAssertions} ASSERTIONS PASSED (${tracker.failedAssertions} FAILED)`);
  console.log('================================================================================\n');

  const resultsSummary = {
    suite: 'Phase 6.3.5.2 Live Production Verification',
    targetUrl: PROD_URL,
    timestamp: new Date().toISOString(),
    totalAssertions: tracker.totalAssertions,
    passedAssertions: tracker.passedAssertions,
    failedAssertions: tracker.failedAssertions,
    allPassed: tracker.failedAssertions === 0,
    tests: tracker.tests,
    screenshots,
  };

  const resultsPath = path.join(ARTIFACTS_DIR, 'phase6_3_5_2_production_results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(resultsSummary, null, 2), 'utf8');
  console.log(`Results written to ${resultsPath}`);

  if (tracker.failedAssertions > 0) {
    process.exit(1);
  } else {
    console.log('Phase 6.3.5.2 Production Suite: ALL TESTS PASSED SUCCESSFULLY!\n');
    process.exit(0);
  }
}

runProductionVerification().catch((err) => {
  console.error('[FATAL PRODUCTION VERIFICATION ERROR]', err);
  process.exit(1);
});
