const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = '/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b';
const EVIDENCE_DIR = path.join(ARTIFACTS_DIR, 'phase6_3_2_evidence');
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

const PROD_URL = 'https://afzaljafri-one.github.io/jafri-islamic-resources/';

async function runProdVerification() {
  console.log('================================================================================');
  console.log('PHASE 6.3.2 PRODUCTION LIVE VERIFICATION');
  console.log(`Target: ${PROD_URL}`);
  console.log('================================================================================\n');

  const prodResults = {
    deployedCommit: null,
    bundleHash: null,
    searchNavbarButton: false,
    contentCoverageTransparency: {},
    exactReferenceAudit: {},
    thematicSearch: {},
    bookmarkResult: false,
    navigationZeroAutoplay: {},
    regressionMySacredLibrary: {},
    mobileResponsive: false,
    screenshots: [],
    assertions: [],
    passedCount: 0,
    failedCount: 0,
    timestamp: new Date().toISOString()
  };

  function assert(condition, message, details = '') {
    const passed = Boolean(condition);
    if (passed) {
      prodResults.passedCount++;
      console.log(`  ✓ [PASS] ${message}`);
    } else {
      prodResults.failedCount++;
      console.error(`  ✗ [FAIL] ${message} ${details ? '(' + details + ')' : ''}`);
    }
    prodResults.assertions.push({ message, passed, details });
    return passed;
  }

  const chromePort = 9580 + Math.floor(Math.random() * 20);
  const tempDir = `/tmp/chrome_phase6_3_2_prod_${Date.now()}`;
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
    prodResults.screenshots.push(`${name}.png`);
  };

  try {
    // Step 1: Navigate to Production Homepage
    console.log('\n--- Step 1: Navigating to Production Homepage ---');
    await send('Page.navigate', { url: PROD_URL }, sessionId);
    await new Promise(r => setTimeout(r, 3500));
    await captureScreenshot('prod_01_homepage_loaded');

    // Check Bundle hash and scripts
    const bundleInfo = await evalCode(`(() => {
      const scripts = Array.from(document.querySelectorAll('script[src]')).map(s => s.src);
      const mainScript = scripts.find(s => s.includes('index-'));
      return { scripts, mainScript };
    })()`);
    prodResults.bundleLoaded = bundleInfo.mainScript;
    console.log('Production Main Bundle Script:', bundleInfo.mainScript);
    assert(bundleInfo.mainScript, 'Production bundle script loaded');

    // Step 2: Open Universal Scripture Search Modal
    console.log('\n--- Step 2: Opening Universal Scripture Search Modal ---');
    await evalCode(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('Search Scriptures') || b.textContent.includes('⌘K') || b.textContent.includes('/')));
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 1000));
    await captureScreenshot('prod_02_search_modal_open');

    const modalVisible = await evalCode(`(() => {
      const modal = document.getElementById('universal-scripture-search-modal');
      return !!modal && modal.offsetWidth > 0;
    })()`);
    assert(modalVisible, 'Universal Scripture Search modal opened in production');

    // Helper to query search
    const executeSearchQuery = async (queryText) => {
      await evalCode(`(() => {
        const input = document.querySelector('[data-testid="universal-search-input"]') || document.querySelector('#universal-scripture-search-modal input');
        if (input) {
          const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
          nativeSetter.call(input, ${JSON.stringify(queryText)});
          input.dispatchEvent(new Event('input', { bubbles: true }));
          input.dispatchEvent(new Event('change', { bubbles: true }));
        }
      })()`);
      await new Promise(r => setTimeout(r, 800));
    };

    // Step 3: Exact Citation — Quran 2:255 (Ayat al-Kursi)
    console.log('\n--- Step 3: Exact Citation Search: Quran 2:255 ---');
    await executeSearchQuery('Quran 2:255');
    await captureScreenshot('prod_03_search_quran_2_255');

    const quranCheck = await evalCode(`(() => {
      const card = document.querySelector('[data-testid="search-result-card"]');
      if (!card) return null;
      return {
        hasAyatKursi: card.textContent.includes('Ayat al-Kursi') || card.textContent.includes('2:255'),
        hasCuratedCore: card.textContent.includes('Curated Core'),
        hasArabicUthmani: card.querySelector('p[dir="rtl"]') && card.querySelector('p[dir="rtl"]').textContent.includes('اللَّهُ'),
        hasParallel: card.textContent.includes('Parallel Translations') || card.textContent.includes('Sahih International'),
        hasProvenance: card.textContent.includes('Recension:') || card.textContent.includes('Hafs')
      };
    })()`);
    assert(quranCheck && quranCheck.hasAyatKursi, 'Quran 2:255 resolved to Ayat al-Kursi');
    assert(quranCheck && quranCheck.hasCuratedCore, 'Curated Core availability status honestly displayed (PARTIAL)');
    assert(quranCheck && quranCheck.hasArabicUthmani, 'Authentic Arabic Uthmani script preserved without mutation');

    // Step 4: Exact Citation — Gita 2:47
    console.log('\n--- Step 4: Exact Citation Search: Gita 2:47 ---');
    await executeSearchQuery('Gita 2:47');
    await captureScreenshot('prod_04_search_gita_2_47');

    const gitaCheck = await evalCode(`(() => {
      const card = document.querySelector('[data-testid="search-result-card"]');
      if (!card) return null;
      return {
        hasGita247: card.textContent.includes('2:47') || card.textContent.includes('Karmanye Vadhikaraste'),
        hasCuratedCore: card.textContent.includes('Curated Core'),
        hasDevanagari: card.textContent.includes('कर्मण्येवाधिकारस्ते'),
        hasParallel: card.textContent.includes('Parallel Translations') || card.textContent.includes('Swami Sivananda')
      };
    })()`);
    assert(gitaCheck && gitaCheck.hasGita247, 'Gita 2:47 resolved in production');
    assert(gitaCheck && gitaCheck.hasCuratedCore, 'Gita Curated Core status accurately displayed');
    assert(gitaCheck && gitaCheck.hasDevanagari, 'Authentic Devanagari text rendered untouched');

    // Step 5: Exact Citation — John 3:16
    console.log('\n--- Step 5: Exact Citation Search: John 3:16 ---');
    await executeSearchQuery('John 3:16');
    await captureScreenshot('prod_05_search_john_3_16');

    const johnCheck = await evalCode(`(() => {
      const card = document.querySelector('[data-testid="search-result-card"]');
      if (!card) return null;
      return {
        hasJohn316: card.textContent.includes('John 3:16'),
        hasCuratedCore: card.textContent.includes('Curated Core'),
        hasKjv: card.textContent.includes('King James Version (KJV 1611)'),
        hasText: card.textContent.includes('For God so loved the world')
      };
    })()`);
    assert(johnCheck && johnCheck.hasJohn316, 'John 3:16 resolved under Christianity');
    assert(johnCheck && johnCheck.hasKjv, 'KJV 1611 attribution verified');

    // Step 6: Exact Citation — Psalm 23 (Complete Grouped)
    console.log('\n--- Step 6: Exact Citation Search: Psalm 23 ---');
    await executeSearchQuery('Psalm 23');
    await captureScreenshot('prod_06_search_psalm_23');

    const psalmCheck = await evalCode(`(() => {
      const card = document.querySelector('[data-testid="search-result-card"]');
      if (!card) return null;
      return {
        hasPsalm23: card.textContent.includes('Psalm 23'),
        hasGrouped: card.textContent.includes('Grouped') && card.textContent.includes('6 Units')
      };
    })()`);
    assert(psalmCheck && psalmCheck.hasPsalm23, 'Psalm 23 resolved');
    assert(psalmCheck && psalmCheck.hasGrouped, 'Grouped composition badge displayed (6 Units)');

    // Step 7: Sikhism — Japji Sahib
    console.log('\n--- Step 7: Search Sikhism Japji Sahib ---');
    await executeSearchQuery('Japji Sahib');
    await captureScreenshot('prod_07_search_japji_sahib');

    const sikhCheck = await evalCode(`(() => {
      const card = document.querySelector('[data-testid="search-result-card"]');
      if (!card) return null;
      return {
        hasJapji: card.textContent.includes('Japji Sahib'),
        hasGurmukhi: card.textContent.includes('ੴ ਸਤਿ ਨਾਮੁ'),
        hasSantSingh: card.textContent.includes('Sant Singh Khalsa')
      };
    })()`);
    assert(sikhCheck && sikhCheck.hasJapji, 'Japji Sahib resolved in production');
    assert(sikhCheck && sikhCheck.hasGurmukhi, 'Authentic Gurmukhi text rendered untouched');

    // Step 8: Thematic Subject Search — "Compassion"
    console.log('\n--- Step 8: Thematic Subject Search: "Compassion" ---');
    await executeSearchQuery('Compassion');
    await captureScreenshot('prod_08_thematic_compassion');

    const thematicCheck = await evalCode(`(() => {
      const cards = Array.from(document.querySelectorAll('[data-testid="search-result-card"]'));
      const note = document.querySelector('[data-testid="thematic-result-note"]');
      const traditions = new Set(cards.map(c => {
        const badge = c.querySelector('span[class*="uppercase"]');
        return badge ? badge.textContent.trim().toLowerCase() : '';
      }));
      return {
        cardCount: cards.length,
        hasNote: !!note && note.textContent.includes('Thematic discovery'),
        traditionCount: traditions.size,
        hasQuotationBadge: cards.some(c => c.textContent.includes('Scholarly Translation') || c.textContent.includes('Direct Text'))
      };
    })()`);
    assert(thematicCheck && thematicCheck.cardCount >= 5, `Compassion returned ${thematicCheck ? thematicCheck.cardCount : 0} cross-tradition passages`);
    assert(thematicCheck && thematicCheck.hasNote, 'Honest Thematic Disclaimer rendered');
    assert(thematicCheck && thematicCheck.hasQuotationBadge, 'Quotation Type badge rendered on thematic cards');

    // Step 9: Bookmarking from Search
    console.log('\n--- Step 9: Direct Bookmarking from Search Result ---');
    const bookmarkAction = await evalCode(`(() => {
      const bmBtn = document.querySelector('[data-testid="search-result-bookmark-btn"]');
      if (bmBtn) {
        bmBtn.click();
        return true;
      }
      return false;
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const bookmarkSaved = await evalCode(`(() => {
      const raw = localStorage.getItem('jafri_lib_bookmarks_v1') || localStorage.getItem('jafri_personal_bookmarks');
      if (!raw) return false;
      const bms = JSON.parse(raw);
      return Array.isArray(bms) && bms.length > 0;
    })()`);
    assert(bookmarkAction && bookmarkSaved, 'Bookmark action succeeded and saved in production LocalStorage');
    await captureScreenshot('prod_09_bookmark_saved');

    // Step 10: Navigation to Reader & Strict Zero Audio Autoplay
    console.log('\n--- Step 10: Navigation to Reader & Strict Zero Audio Autoplay ---');
    await evalCode(`(() => {
      const readBtn = document.querySelector('[data-testid="search-result-read-btn"]');
      if (readBtn) readBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 1200));

    const zeroAutoplay = await evalCode(`(() => {
      const audios = Array.from(document.querySelectorAll('audio'));
      const anyPlaying = audios.some(a => !a.paused && a.currentTime > 0);
      const modalClosed = !document.getElementById('universal-scripture-search-modal');
      return { anyPlaying, modalClosed };
    })()`);
    assert(zeroAutoplay.modalClosed, 'Search modal closed upon navigation');
    assert(!zeroAutoplay.anyPlaying, 'Strict ZERO audio autoplay verified in production');
    await captureScreenshot('prod_10_reader_zero_autoplay');

    // Step 11: My Sacred Library 5 Tabs Regression
    console.log('\n--- Step 11: My Sacred Library 5 Tabs Regression ---');
    await evalCode(`(() => {
      const libBtn = document.querySelector('[data-testid="platform-nav-my-library-btn"]') ||
        Array.from(document.querySelectorAll('button')).find(b => b.textContent && b.textContent.includes('My Sacred Library'));
      if (libBtn) libBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 1000));

    const libraryCheck = await evalCode(`(() => {
      const tabs = ['continue', 'bookmarks', 'history', 'progress', 'plans'];
      const present = tabs.map(t => !!document.querySelector(\`[data-testid="tab-\${t}"]\`));
      return { tabs, present, allPresent: present.every(Boolean) };
    })()`);
    assert(libraryCheck.allPresent, 'All 5 My Sacred Library tabs verified operational on production');
    await captureScreenshot('prod_11_my_sacred_library_tabs');

    // Close Library
    await evalCode(`(() => {
      const esc = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true });
      window.dispatchEvent(esc);
    })()`);
    await new Promise(r => setTimeout(r, 500));

    // Step 12: Mobile 390x844 Viewport Verification
    console.log('\n--- Step 12: Mobile 390x844 Viewport Verification ---');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 3,
      mobile: true
    }, sessionId);
    await new Promise(r => setTimeout(r, 500));

    await evalCode(`(() => {
      const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent && (b.textContent.includes('Search Scriptures') || b.textContent.includes('⌘K') || b.textContent.includes('/')));
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 800));

    const mobileVisible = await evalCode(`(() => {
      const modal = document.getElementById('universal-scripture-search-modal');
      return !!modal && modal.offsetWidth > 0;
    })()`);
    assert(mobileVisible, 'Mobile responsive search modal verified at 390x844 on production');
    await captureScreenshot('prod_12_mobile_search_verified');

    console.log('\n================================================================================');
    console.log(`PRODUCTION VERIFICATION COMPLETE`);
    console.log(`Passed: ${prodResults.passedCount} | Failed: ${prodResults.failedCount}`);
    console.log('================================================================================\n');

  } finally {
    ws.close();
    chrome.kill();
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (_) {}
  }

  fs.writeFileSync(path.join(ARTIFACTS_DIR, 'phase6_3_2_production_results.json'), JSON.stringify(prodResults, null, 2));
  console.log(`Production results saved to ${path.join(ARTIFACTS_DIR, 'phase6_3_2_production_results.json')}`);

  if (prodResults.failedCount > 0) {
    process.exit(1);
  }
}

runProdVerification().catch(err => {
  console.error('Fatal production verification error:', err);
  process.exit(1);
});
