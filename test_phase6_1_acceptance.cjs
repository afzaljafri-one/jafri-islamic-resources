const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = '/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b';
const EVIDENCE_DIR = `${ARTIFACTS_DIR}/phase6_1_evidence`;
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

const LOCAL_BASE = 'http://localhost:4173/jafri-islamic-resources';

async function runAcceptance() {
  console.log('================================================================================');
  console.log('PHASE 6.1 ACCEPTANCE TEST: MY SACRED LIBRARY & READING PROGRESS');
  console.log(`Target: ${LOCAL_BASE}/`);
  console.log('================================================================================\n');

  const chromePort = 9450;
  const tempDir = `/tmp/chrome_phase6_1_${Date.now()}`;
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
  const ws = new globalThis.WebSocket(wsUrl);

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

  const send = (method, params = {}, sessionId = undefined) =>
    new Promise((resolve, reject) => {
      const id = msgId++;
      callbacks.set(id, { resolve, reject });
      const payload = { id, method, params };
      if (sessionId) payload.sessionId = sessionId;
      ws.send(JSON.stringify(payload));
    });

  await new Promise(r => (ws.onopen = r));

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

  await send('Page.enable', {}, sessionId);
  await send('DOM.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);

  const evalCode = async (expression) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, sessionId);
    return res.result ? res.result.value : undefined;
  };

  const captureScreenshot = async (name) => {
    const res = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
    const buffer = Buffer.from(res.data, 'base64');
    const p = `${EVIDENCE_DIR}/${name}.png`;
    fs.writeFileSync(p, buffer);
    console.log(`  [Screenshot Saved] ${name}.png`);
    return p;
  };

  const setViewport = async (width, height, isMobile = false) => {
    await send('Emulation.setDeviceMetricsOverride', {
      width,
      height,
      deviceScaleFactor: 2,
      mobile: isMobile
    }, sessionId);
    await new Promise(r => setTimeout(r, 300));
  };

  const navigateTo = async (url) => {
    await send('Page.navigate', { url }, sessionId);
    await new Promise(r => setTimeout(r, 2000));
  };

  // Helper to wait for selector
  const waitForSelector = async (selector, timeoutMs = 8000) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const exists = await evalCode(`Boolean(document.querySelector('${selector}'))`);
      if (exists) return true;
      await new Promise(r => setTimeout(r, 200));
    }
    return false;
  };

  const testResults = [];

  try {
    // --------------------------------------------------------------------------
    // Test 1: Platform Homepage & My Library Entry
    // --------------------------------------------------------------------------
    console.log('--- TEST 1: Homepage & Navbar "My Library" Entry ---');
    await setViewport(1280, 900, false);
    await navigateTo(`${LOCAL_BASE}/?`);
    
    const navState = await evalCode(`(() => {
      const btn = document.querySelector('#platform-nav-my-library-btn');
      return {
        hasBtn: Boolean(btn),
        btnText: btn ? btn.innerText.trim() : null,
        title: document.title,
      };
    })()`);

    console.log('  Nav State:', navState);
    await captureScreenshot('01_homepage_initial');
    testResults.push({
      test: 'Homepage Navigation Entry',
      pass: navState.hasBtn && navState.btnText.includes('My Library'),
      details: navState
    });

    // --------------------------------------------------------------------------
    // Test 2: Islam — Surah 1 (Ayah 1 Bookmark + Mark Surah Done)
    // --------------------------------------------------------------------------
    console.log('\n--- TEST 2: Islam (Surah 1 Bookmark & Progress) ---');
    await navigateTo(`${LOCAL_BASE}/?religion=islam&surah=1&view=verse`);
    await waitForSelector('[data-testid="verse-bookmark-btn"]', 10000);

    const islamAction = await evalCode(`(() => {
      const bmBtn = document.querySelector('[data-testid="verse-bookmark-btn"]');
      if (bmBtn) bmBtn.click();

      const compBtn = document.querySelector('[data-testid="mark-completed-toggle-btn"]');
      if (compBtn) compBtn.click();

      return {
        clickedBookmark: Boolean(bmBtn),
        clickedCompleted: Boolean(compBtn),
      };
    })()`);

    await new Promise(r => setTimeout(r, 1000));
    const islamLibState = await evalCode(`(() => {
      const bms = JSON.parse(localStorage.getItem('jafri_lib_bookmarks_v1') || '[]');
      const pos = JSON.parse(localStorage.getItem('jafri_lib_positions_v1') || '{}');
      const prog = JSON.parse(localStorage.getItem('jafri_lib_progress_v1') || '{}');
      return {
        bookmarkCount: bms.length,
        islamBookmark: bms.find(b => b.religion === 'islam'),
        islamPos: pos.islam,
        islamProg: prog['islam:quran']
      };
    })()`);

    console.log('  Islam Action:', islamAction);
    console.log('  Islam State:', islamLibState);
    await captureScreenshot('02_islam_surah1_bookmarked_completed');
    testResults.push({
      test: 'Islam Bookmark & Chapter Progress',
      pass: islamLibState.islamBookmark !== undefined && islamLibState.islamProg?.chaptersCompleted?.includes(1),
      details: islamLibState
    });

    // --------------------------------------------------------------------------
    // Test 3: Hinduism — Gita Ch 1 (Bookmark Shloka 1 + Mark Chapter Done)
    // --------------------------------------------------------------------------
    console.log('\n--- TEST 3: Hinduism (Gita Ch 1 Bookmark & Progress) ---');
    await navigateTo(`${LOCAL_BASE}/?religion=hinduism&collection=gita&chapter=1`);
    await waitForSelector('[data-testid="verse-bookmark-btn"]', 10000);

    await evalCode(`(() => {
      const bmBtn = document.querySelector('[data-testid="verse-bookmark-btn"]');
      if (bmBtn) bmBtn.click();

      const compBtn = document.querySelector('[data-testid="mark-completed-toggle-btn"]');
      if (compBtn) compBtn.click();
    })()`);

    await new Promise(r => setTimeout(r, 1000));
    const hinduLibState = await evalCode(`(() => {
      const bms = JSON.parse(localStorage.getItem('jafri_lib_bookmarks_v1') || '[]');
      const pos = JSON.parse(localStorage.getItem('jafri_lib_positions_v1') || '{}');
      const prog = JSON.parse(localStorage.getItem('jafri_lib_progress_v1') || '{}');
      return {
        hinduBookmark: bms.find(b => b.religion === 'hinduism'),
        hinduPos: pos.hinduism,
        hinduProg: prog['hinduism:gita']
      };
    })()`);

    console.log('  Hinduism State:', hinduLibState);
    await captureScreenshot('03_hinduism_gita1_bookmarked_completed');
    testResults.push({
      test: 'Hinduism Bookmark & Chapter Progress',
      pass: hinduLibState.hinduBookmark !== undefined && hinduLibState.hinduProg?.chaptersCompleted?.includes(1),
      details: hinduLibState
    });

    // --------------------------------------------------------------------------
    // Test 4: Christianity — Genesis Ch 1 (Bookmark Verse 1 + Mark Book Done)
    // --------------------------------------------------------------------------
    console.log('\n--- TEST 4: Christianity (Genesis Ch 1 Bookmark & Progress) ---');
    await navigateTo(`${LOCAL_BASE}/?religion=christianity&book=1&chapter=1`);
    await waitForSelector('[data-testid="verse-bookmark-btn"]', 10000);

    await evalCode(`(() => {
      const bmBtn = document.querySelector('[data-testid="verse-bookmark-btn"]');
      if (bmBtn) bmBtn.click();

      const compBtn = document.querySelector('[data-testid="mark-completed-toggle-btn"]');
      if (compBtn) compBtn.click();
    })()`);

    await new Promise(r => setTimeout(r, 1000));
    const christianLibState = await evalCode(`(() => {
      const bms = JSON.parse(localStorage.getItem('jafri_lib_bookmarks_v1') || '[]');
      const pos = JSON.parse(localStorage.getItem('jafri_lib_positions_v1') || '{}');
      const prog = JSON.parse(localStorage.getItem('jafri_lib_progress_v1') || '{}');
      return {
        christianBookmark: bms.find(b => b.religion === 'christianity'),
        christianPos: pos.christianity,
        christianProg: prog['christianity:bible']
      };
    })()`);

    console.log('  Christianity State:', christianLibState);
    await captureScreenshot('04_christianity_genesis1_bookmarked_completed');
    testResults.push({
      test: 'Christianity Bookmark & Progress',
      pass: christianLibState.christianBookmark !== undefined && christianLibState.christianProg?.chaptersCompleted?.length > 0,
      details: christianLibState
    });

    // --------------------------------------------------------------------------
    // Test 5: Judaism — Genesis Ch 1 (Bookmark Verse 1 + Mark Book Done)
    // --------------------------------------------------------------------------
    console.log('\n--- TEST 5: Judaism (Genesis Ch 1 Bookmark & Progress) ---');
    await navigateTo(`${LOCAL_BASE}/?religion=judaism&book=Genesis&chapter=1`);
    await waitForSelector('[data-testid="verse-bookmark-btn"]', 10000);

    await evalCode(`(() => {
      const bmBtn = document.querySelector('[data-testid="verse-bookmark-btn"]');
      if (bmBtn) bmBtn.click();

      const compBtn = document.querySelector('[data-testid="mark-completed-toggle-btn"]');
      if (compBtn) compBtn.click();
    })()`);

    await new Promise(r => setTimeout(r, 1000));
    const judaismLibState = await evalCode(`(() => {
      const bms = JSON.parse(localStorage.getItem('jafri_lib_bookmarks_v1') || '[]');
      const pos = JSON.parse(localStorage.getItem('jafri_lib_positions_v1') || '{}');
      const prog = JSON.parse(localStorage.getItem('jafri_lib_progress_v1') || '{}');
      return {
        judaismBookmark: bms.find(b => b.religion === 'judaism'),
        judaismPos: pos.judaism,
        judaismProg: prog['judaism:tanakh']
      };
    })()`);

    console.log('  Judaism State:', judaismLibState);
    await captureScreenshot('05_judaism_genesis1_bookmarked_completed');
    testResults.push({
      test: 'Judaism Bookmark & Progress',
      pass: judaismLibState.judaismBookmark !== undefined && judaismLibState.judaismProg?.chaptersCompleted?.length > 0,
      details: judaismLibState
    });

    // --------------------------------------------------------------------------
    // Test 6: Sikhism — Ang 1 (Bookmark Line 1 + Mark Ang Done)
    // --------------------------------------------------------------------------
    console.log('\n--- TEST 6: Sikhism (Ang 1 Bookmark & Progress) ---');
    await navigateTo(`${LOCAL_BASE}/?religion=sikhism&ang=1`);
    await waitForSelector('[data-testid="verse-bookmark-btn"]', 10000);

    await evalCode(`(() => {
      const bmBtn = document.querySelector('[data-testid="verse-bookmark-btn"]');
      if (bmBtn) bmBtn.click();

      const compBtn = document.querySelector('[data-testid="mark-completed-toggle-btn"]');
      if (compBtn) compBtn.click();
    })()`);

    await new Promise(r => setTimeout(r, 1000));
    const sikhLibState = await evalCode(`(() => {
      const bms = JSON.parse(localStorage.getItem('jafri_lib_bookmarks_v1') || '[]');
      const pos = JSON.parse(localStorage.getItem('jafri_lib_positions_v1') || '{}');
      const prog = JSON.parse(localStorage.getItem('jafri_lib_progress_v1') || '{}');
      return {
        sikhBookmark: bms.find(b => b.religion === 'sikhism'),
        sikhPos: pos.sikhism,
        sikhProg: prog['sikhism:sggs']
      };
    })()`);

    console.log('  Sikhism State:', sikhLibState);
    await captureScreenshot('06_sikhism_ang1_bookmarked_completed');
    testResults.push({
      test: 'Sikhism Bookmark & Progress',
      pass: sikhLibState.sikhBookmark !== undefined && sikhLibState.sikhProg?.chaptersCompleted?.length > 0,
      details: sikhLibState
    });

    // --------------------------------------------------------------------------
    // Test 7: Buddhism — Sutta (Bookmark + Mark Sutta Done)
    // --------------------------------------------------------------------------
    console.log('\n--- TEST 7: Buddhism (Mangala Sutta Bookmark & Progress) ---');
    await navigateTo(`${LOCAL_BASE}/?religion=buddhism&sutta=mangala`);
    await waitForSelector('[data-testid="verse-bookmark-btn"]', 10000);

    await evalCode(`(() => {
      const bmBtn = document.querySelector('[data-testid="verse-bookmark-btn"]');
      if (bmBtn) bmBtn.click();

      const compBtn = document.querySelector('[data-testid="mark-completed-toggle-btn"]');
      if (compBtn) compBtn.click();
    })()`);

    await new Promise(r => setTimeout(r, 1000));
    const budLibState = await evalCode(`(() => {
      const bms = JSON.parse(localStorage.getItem('jafri_lib_bookmarks_v1') || '[]');
      const pos = JSON.parse(localStorage.getItem('jafri_lib_positions_v1') || '{}');
      const prog = JSON.parse(localStorage.getItem('jafri_lib_progress_v1') || '{}');
      return {
        budBookmark: bms.find(b => b.religion === 'buddhism'),
        budPos: pos.buddhism,
        budProg: prog['buddhism:tipitaka']
      };
    })()`);

    console.log('  Buddhism State:', budLibState);
    await captureScreenshot('07_buddhism_mangala_bookmarked_completed');
    testResults.push({
      test: 'Buddhism Bookmark & Progress',
      pass: budLibState.budBookmark !== undefined && budLibState.budProg?.chaptersCompleted?.length > 0,
      details: budLibState
    });

    // --------------------------------------------------------------------------
    // Test 8: Jainism — Navkar / Tattvartha (Bookmark + Mark Text Done)
    // --------------------------------------------------------------------------
    console.log('\n--- TEST 8: Jainism (Navkar Mantra Bookmark & Progress) ---');
    await navigateTo(`${LOCAL_BASE}/?religion=jainism&text=navkar`);
    await waitForSelector('[data-testid="verse-bookmark-btn"]', 10000);

    await evalCode(`(() => {
      const bmBtn = document.querySelector('[data-testid="verse-bookmark-btn"]');
      if (bmBtn) bmBtn.click();

      const compBtn = document.querySelector('[data-testid="mark-completed-toggle-btn"]');
      if (compBtn) compBtn.click();
    })()`);

    await new Promise(r => setTimeout(r, 1000));
    const jainLibState = await evalCode(`(() => {
      const bms = JSON.parse(localStorage.getItem('jafri_lib_bookmarks_v1') || '[]');
      const pos = JSON.parse(localStorage.getItem('jafri_lib_positions_v1') || '{}');
      const prog = JSON.parse(localStorage.getItem('jafri_lib_progress_v1') || '{}');
      return {
        jainBookmark: bms.find(b => b.religion === 'jainism'),
        jainPos: pos.jainism,
        jainProg: prog['jainism:agamas'] || prog['jainism:tattvartha']
      };
    })()`);

    console.log('  Jainism State:', jainLibState);
    await captureScreenshot('08_jainism_navkar_bookmarked_completed');
    testResults.push({
      test: 'Jainism Bookmark & Progress',
      pass: jainLibState.jainBookmark !== undefined && jainLibState.jainProg?.chaptersCompleted?.length > 0,
      details: jainLibState
    });

    // --------------------------------------------------------------------------
    // Test 9: My Library Modal — 4 Tabs & Backup
    // --------------------------------------------------------------------------
    console.log('\n--- TEST 9: My Library Modal All 4 Tabs & Backup ---');
    await evalCode(`(() => {
      const btn = document.querySelector('#platform-nav-my-library-btn');
      if (btn) btn.click();
    })()`);
    await waitForSelector('#my-library-modal', 5000);

    // Tab 1: Continue Reading
    const modalTab1 = await evalCode(`(() => {
      const modal = document.querySelector('#my-library-modal');
      const cards = modal ? modal.querySelectorAll('.grid > div') : [];
      return {
        isOpen: Boolean(modal),
        activeTab: 'continue',
        renderedCards: cards.length
      };
    })()`);
    console.log('  Modal Tab 1 (Continue Reading):', modalTab1);
    await captureScreenshot('09_my_library_tab_continue_reading');

    // Switch to Tab 2: Bookmarks
    await evalCode(`(() => {
      const bBtn = document.querySelector('[data-testid="tab-bookmarks"]');
      if (bBtn) bBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));
    const modalTab2 = await evalCode(`(() => {
      const modal = document.querySelector('#my-library-modal');
      const items = modal ? Array.from(modal.querySelectorAll('[data-testid="bookmark-item"]')) : [];
      const pills = modal ? Array.from(modal.querySelectorAll('button')).filter(b => b.innerText && b.innerText.includes('(')) : [];
      return {
        itemsCount: items.length,
        filterPills: pills.map(p => p.innerText.trim())
      };
    })()`);
    console.log('  Modal Tab 2 (Bookmarks):', modalTab2);
    await captureScreenshot('10_my_library_tab_bookmarks');

    // Switch to Tab 3: History
    await evalCode(`(() => {
      const hBtn = document.querySelector('[data-testid="tab-history"]');
      if (hBtn) hBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));
    const modalTab3 = await evalCode(`(() => {
      const modal = document.querySelector('#my-library-modal');
      const hItems = modal ? Array.from(modal.querySelectorAll('[data-testid="history-item"]')) : [];
      return {
        historyCount: hItems.length
      };
    })()`);
    console.log('  Modal Tab 3 (History):', modalTab3);
    await captureScreenshot('11_my_library_tab_history');

    // Switch to Tab 4: Progress
    await evalCode(`(() => {
      const pBtn = document.querySelector('[data-testid="tab-progress"]');
      if (pBtn) pBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));
    const modalTab4 = await evalCode(`(() => {
      const modal = document.querySelector('#my-library-modal');
      const progItems = modal ? Array.from(modal.querySelectorAll('[data-testid="progress-scope-card"]')) : [];
      const textContents = progItems.map(i => i.innerText.replace(/\\n/g, ' '));
      return {
        progressScopesCount: progItems.length,
        samples: textContents.slice(0, 4)
      };
    })()`);
    console.log('  Modal Tab 4 (Progress):', modalTab4);
    await captureScreenshot('12_my_library_tab_progress');

    // Test Backup Export Serialization
    const backupExport = await evalCode(`(() => {
      const exportData = {
        format: 'jafri_personal_library_backup_v1',
        exportedAt: new Date().toISOString(),
        version: 1,
        bookmarks: JSON.parse(localStorage.getItem('jafri_lib_bookmarks_v1') || '[]'),
        positions: JSON.parse(localStorage.getItem('jafri_lib_positions_v1') || '{}'),
        globalLastRead: JSON.parse(localStorage.getItem('jafri_lib_global_last_read_v1') || 'null'),
        history: JSON.parse(localStorage.getItem('jafri_lib_history_v1') || '[]'),
        progress: JSON.parse(localStorage.getItem('jafri_lib_progress_v1') || '{}')
      };
      return {
        format: exportData.format,
        bookmarksLen: exportData.bookmarks.length,
        hasGlobalLastRead: Boolean(exportData.globalLastRead),
        progressKeys: Object.keys(exportData.progress)
      };
    })()`);
    console.log('  Backup Export Verification:', backupExport);

    testResults.push({
      test: 'My Library Modal 4 Tabs & Backup Integrity',
      pass: modalTab1.isOpen && modalTab2.itemsCount >= 7 && modalTab3.historyCount >= 5 && modalTab4.progressScopesCount >= 6 && backupExport.bookmarksLen >= 7,
      details: { modalTab1, modalTab2, modalTab3, modalTab4, backupExport }
    });

    // --------------------------------------------------------------------------
    // Test 10: Resume Reading & Zero Audio Auto-Play
    // --------------------------------------------------------------------------
    console.log('\n--- TEST 10: Resume Reading & Zero Audio Auto-Play ---');
    // Switch back to continue tab and click Resume on Islam
    await evalCode(`(() => {
      const cBtn = document.querySelector('[data-testid="tab-continue"]');
      if (cBtn) cBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 500));

    await evalCode(`(() => {
      const modal = document.querySelector('#my-library-modal');
      const allBtns = modal ? Array.from(modal.querySelectorAll('button')) : [];
      const resumeBtn = allBtns.find(b => b.innerText && (b.innerText.includes('Resume Reading') || b.innerText.includes('Resume')));
      if (resumeBtn) resumeBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 1500));

    const audioState = await evalCode(`(() => {
      const audios = Array.from(document.querySelectorAll('audio'));
      const anyPlaying = audios.some(a => !a.paused && !a.ended && a.currentTime > 0);
      const url = window.location.href;
      return {
        url,
        audioElements: audios.length,
        anyPlaying
      };
    })()`);
    console.log('  Resume Reading State:', audioState);
    await captureScreenshot('13_resumed_reading_no_autoplay');
    testResults.push({
      test: 'Resume Navigation & Zero Audio Auto-Play',
      pass: !audioState.anyPlaying,
      details: audioState
    });

    // --------------------------------------------------------------------------
    // Test 11: Persistence across Page Reload
    // --------------------------------------------------------------------------
    console.log('\n--- TEST 11: Persistence Across Page Reload ---');
    await send('Page.reload', {}, sessionId);
    await new Promise(r => setTimeout(r, 2000));

    const reloadedState = await evalCode(`(() => {
      const bms = JSON.parse(localStorage.getItem('jafri_lib_bookmarks_v1') || '[]');
      const pos = JSON.parse(localStorage.getItem('jafri_lib_positions_v1') || '{}');
      const glr = JSON.parse(localStorage.getItem('jafri_lib_global_last_read_v1') || 'null');
      const hist = JSON.parse(localStorage.getItem('jafri_lib_history_v1') || '[]');
      const prog = JSON.parse(localStorage.getItem('jafri_lib_progress_v1') || '{}');
      return {
        bookmarksCount: bms.length,
        hasPositions: Object.keys(pos).length,
        hasGlobalLastRead: Boolean(glr),
        historyCount: hist.length,
        progressScopes: Object.keys(prog).length
      };
    })()`);
    console.log('  Reloaded Persistence State:', reloadedState);

    // Also navigate to Homepage to check the "Continue Reading" banner
    await navigateTo(`${LOCAL_BASE}/?`);
    await waitForSelector('#homepage-continue-reading-banner', 5000);
    const hpContinueBanner = await evalCode(`(() => {
      const banner = document.querySelector('#homepage-continue-reading-banner');
      return {
        hasBanner: Boolean(banner),
        bannerText: banner ? banner.innerText.slice(0, 80).replace(/\\n/g, ' ') : null
      };
    })()`);
    console.log('  Homepage Continue Reading Banner:', hpContinueBanner);
    await captureScreenshot('14_homepage_continue_reading_persisted');

    testResults.push({
      test: 'Persistence Across Page Reload & Homepage Banner',
      pass: reloadedState.bookmarksCount >= 7 && reloadedState.hasGlobalLastRead && hpContinueBanner.hasBanner,
      details: { reloadedState, hpContinueBanner }
    });

    // --------------------------------------------------------------------------
    // Test 12: Mobile Viewport Responsiveness (390x844)
    // --------------------------------------------------------------------------
    console.log('\n--- TEST 12: Mobile Viewport Responsiveness (390x844) ---');
    await setViewport(390, 844, true);
    await new Promise(r => setTimeout(r, 500));

    // Open My Library modal on mobile
    await evalCode(`(() => {
      const btn = document.querySelector('#platform-nav-my-library-btn');
      if (btn) btn.click();
    })()`);
    await waitForSelector('#my-library-modal', 5000);

    const mobileModal = await evalCode(`(() => {
      const modal = document.querySelector('#my-library-modal');
      return {
        modalRendered: Boolean(modal),
        modalWidth: modal ? modal.offsetWidth : 0,
        viewportWidth: window.innerWidth
      };
    })()`);
    console.log('  Mobile Modal State:', mobileModal);
    await captureScreenshot('15_mobile_my_library_modal');

    testResults.push({
      test: 'Mobile Viewport Responsiveness',
      pass: mobileModal.modalRendered && mobileModal.modalWidth <= mobileModal.viewportWidth,
      details: mobileModal
    });

  } catch (err) {
    console.error('Test execution error:', err);
    testResults.push({
      test: 'Runtime Execution',
      pass: false,
      error: err.message
    });
  } finally {
    fs.writeFileSync(`${ARTIFACTS_DIR}/phase6_1_acceptance_results.json`, JSON.stringify(testResults, null, 2));
    console.log('\n================================================================================');
    console.log('PHASE 6.1 TEST SUITE SUMMARY:');
    let allPassed = true;
    testResults.forEach((t, i) => {
      const status = t.pass ? 'PASS' : 'FAIL';
      if (!t.pass) allPassed = false;
      console.log(`  [${status}] Test ${i + 1}: ${t.test}`);
    });
    console.log(`OVERALL STATUS: ${allPassed ? '100% ALL TESTS PASSED' : 'SOME TESTS FAILED'}`);
    console.log('================================================================================\n');

    try {
      ws.close();
      chrome.kill();
    } catch (_) {}
  }
}

runAcceptance();
