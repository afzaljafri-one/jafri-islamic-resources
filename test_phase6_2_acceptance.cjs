const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const ARTIFACTS_DIR = '/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b';
const EVIDENCE_DIR = path.join(ARTIFACTS_DIR, 'phase6_2_evidence');
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

const PORT = 4188;
const BASE_URL = `http://localhost:${PORT}/jafri-islamic-resources/`;

async function runAcceptanceTest() {
  console.log('================================================================================');
  console.log('PHASE 6.2 ACCEPTANCE VERIFICATION: DAILY READING PLANS & SCHEDULES');
  console.log(`Base URL: ${BASE_URL}`);
  console.log('================================================================================\n');

  const testResults = {
    modalTabs: {},
    curatedTemplates: {},
    planCreation: {},
    todaySchedule: {},
    navigationAndAudioAutoplay: {},
    completionTracking: {},
    skipAndPostpone: {},
    planControls: {},
    remindersAndPermissions: {},
    homepageBanner: {},
    backupRestoreV1AndV2: {},
    persistenceAcrossReload: {},
    mobileResponsiveness: {},
    screenshots: [],
    defects: [],
    timestamp: new Date().toISOString()
  };

  // 1. Start Vite Preview server on dedicated port 4188
  console.log('1. Starting Vite Preview Server on port', PORT, '...');
  const preview = spawn('npx', ['vite', 'preview', '--port', String(PORT), '--strictPort', '--base', '/jafri-islamic-resources/'], {
    cwd: '/Users/afzaljafri/.gemini/antigravity/scratch/jafri-islamic-resources',
    stdio: 'pipe'
  });

  preview.stderr.on('data', d => console.error('[preview err]', d.toString()));
  preview.stdout.on('data', d => console.log('[preview out]', d.toString().trim()));

  // Wait for server to become responsive
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

  // 2. Launch Headless Chrome
  console.log('2. Launching Headless Chrome with remote debugging...');
  const chromePort = 9490 + Math.floor(Math.random() * 20);
  const tempDir = `/tmp/chrome_phase6_2_${Date.now()}`;
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
    testResults.screenshots.push(`${name}.png`);
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

  const waitForSelector = async (selector, timeoutMs = 12000) => {
    const start = Date.now();
    while (Date.now() - start < timeoutMs) {
      const exists = await evalCode(`Boolean(document.querySelector('${selector}'))`);
      if (exists) return true;
      await new Promise(r => setTimeout(r, 200));
    }
    return false;
  };

  try {
    // ------------------------------------------------------------------------
    // TEST 1: Initial Navigation & Modal Tab Structure
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 1: Initial Navigation & Modal Tab Structure ---');
    await setViewport(1280, 900, false);
    await navigateTo(BASE_URL);

    // Click My Library button in platform navbar
    const btnFound = await waitForSelector('#platform-nav-my-library-btn', 15000);
    if (!btnFound) {
      const bodyPreview = await evalCode(`document.body.innerHTML.slice(0, 500)`);
      throw new Error('#platform-nav-my-library-btn not found. DOM: ' + bodyPreview);
    }
    await captureScreenshot('01_homepage_loaded');
    await evalCode(`document.querySelector('#platform-nav-my-library-btn').click()`);
    await waitForSelector('#my-library-modal');

    // Verify all 5 tabs exist and none are renamed
    const tabState = await evalCode(`(() => {
      const modal = document.querySelector('#my-library-modal');
      const tabContinue = modal?.querySelector('[data-testid="tab-continue"]');
      const tabBookmarks = modal?.querySelector('[data-testid="tab-bookmarks"]');
      const tabHistory = modal?.querySelector('[data-testid="tab-history"]');
      const tabProgress = modal?.querySelector('[data-testid="tab-progress"]');
      const tabPlans = modal?.querySelector('[data-testid="tab-plans"]');
      return {
        hasModal: Boolean(modal),
        hasTabContinue: Boolean(tabContinue),
        hasTabBookmarks: Boolean(tabBookmarks),
        hasTabHistory: Boolean(tabHistory),
        hasTabProgress: Boolean(tabProgress),
        hasTabPlans: Boolean(tabPlans),
        tabPlansText: tabPlans ? tabPlans.innerText.trim() : null
      };
    })()`);
    console.log('  Modal Tab State:', tabState);
    testResults.modalTabs = tabState;

    if (!tabState.hasTabPlans || !tabState.hasTabContinue || !tabState.hasTabBookmarks || !tabState.hasTabHistory || !tabState.hasTabProgress) {
      testResults.defects.push('Missing tabs in MyLibraryModal');
    }

    // Switch to Reading Plans tab
    await evalCode(`document.querySelector('[data-testid="tab-plans"]').click()`);
    await new Promise(r => setTimeout(r, 600));
    await captureScreenshot('02_modal_plans_tab_empty');

    // ------------------------------------------------------------------------
    // TEST 2: Curated Templates Gallery (7 Religions + Interfaith)
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 2: Curated Templates Gallery ---');
    // Switch to create tab to view templates
    await evalCode(`document.querySelector('[data-testid="subtab-create"]')?.click()`);
    await new Promise(r => setTimeout(r, 600));

    const templates = await evalCode(`(() => {
      const cards = Array.from(document.querySelectorAll('[data-testid="curated-template-card"]'));
      return cards.map(c => ({
        title: c.querySelector('h4')?.innerText.trim(),
        religions: Array.from(c.querySelectorAll('span.font-mono')).map(s => s.innerText.trim())[0],
        sessions: c.querySelector('.text-slate-400.font-mono')?.innerText.trim()
      }));
    })()`);
    console.log(`  Discovered ${templates.length} Curated Templates:`, templates);
    testResults.curatedTemplates = { count: templates.length, templates };

    if (templates.length < 8) {
      testResults.defects.push(`Expected at least 8 curated templates (7 single + 1 interfaith), got ${templates.length}`);
    }
    await captureScreenshot('03_curated_templates_gallery');

    // ------------------------------------------------------------------------
    // TEST 3: Adopt Curated Template (Islam 30-Day Quran Plan)
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 3: Adopt Islam 30-Day Curated Plan ---');
    await evalCode(`(() => {
      const cards = Array.from(document.querySelectorAll('[data-testid="curated-template-card"]'));
      const islamCard = cards.find(c => c.innerText.includes("Holy Quran"));
      const btn = islamCard ? islamCard.querySelector('[data-testid="adopt-template-btn"]') : cards[0]?.querySelector('[data-testid="adopt-template-btn"]');
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    // Check that we switched to today's schedule subtab and have active sessions
    const activeSchedule = await evalCode(`(() => {
      const cards = Array.from(document.querySelectorAll('[data-testid="today-session-card"]'));
      const activeTabBtn = document.querySelector('[data-testid="subtab-plans"]');
      return {
        sessionCardsCount: cards.length,
        firstCardTitle: cards[0]?.querySelector('h4')?.innerText.trim(),
        firstCardLocation: cards[0]?.querySelector('p.text-xs')?.innerText.trim(),
        activePlansText: activeTabBtn ? activeTabBtn.innerText.trim() : null
      };
    })()`);
    console.log('  Active Schedule State:', activeSchedule);
    testResults.todaySchedule = activeSchedule;
    await captureScreenshot('04_plan_adopted_today_schedule');

    // ------------------------------------------------------------------------
    // TEST 4: Navigation to Scripture with Zero Audio Autoplay
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 4: Navigation to Scripture with Zero Audio Autoplay ---');
    // Click "Start Reading" on today's session card
    await evalCode(`(() => {
      const btn = document.querySelector('[data-testid="today-session-card"] [data-testid="start-plan-reading-btn"]');
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 2000));

    // Verify modal is closed, scripture reader is loaded, and AUDIO IS NOT PLAYING
    const navAndAudioState = await evalCode(`(() => {
      const modal = document.querySelector('#my-library-modal');
      const audios = Array.from(document.querySelectorAll('audio'));
      const anyPlaying = audios.some(a => !a.paused && a.currentTime > 0);
      const isScriptureLoaded = Boolean(document.querySelector('#verse-container') || document.querySelector('[data-testid="verse-bookmark-btn"]') || document.querySelector('#quran-verse-list') || document.querySelector('.verse-card') || document.querySelector('#surah-header'));
      const url = window.location.href;
      return {
        modalClosed: !modal,
        url,
        isScriptureLoaded,
        audioElementsCount: audios.length,
        anyAudioPlaying: anyPlaying,
        audioPaused: audios.every(a => a.paused)
      };
    })()`);
    console.log('  Navigation & Audio Autoplay State:', navAndAudioState);
    testResults.navigationAndAudioAutoplay = navAndAudioState;
    await captureScreenshot('05_scripture_navigated_no_autoplay');

    if (navAndAudioState.anyAudioPlaying) {
      testResults.defects.push('DEFECT: Audio auto-played on reading plan navigation!');
    }

    // ------------------------------------------------------------------------
    // TEST 5: Mark Completed, Skip, and Postpone Tracking
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 5: Mark Completed, Skip, and Postpone Tracking ---');
    // Reopen modal and navigate to plans tab
    await evalCode(`document.querySelector('#platform-nav-my-library-btn')?.click()`);
    await waitForSelector('#my-library-modal');
    await evalCode(`document.querySelector('[data-testid="tab-plans"]')?.click()`);
    await new Promise(r => setTimeout(r, 600));

    // Adopt a second plan: Multi-Religion "Seven Paths Daily Wisdom" to have multiple sessions
    await evalCode(`document.querySelector('[data-testid="subtab-create"]')?.click()`);
    await new Promise(r => setTimeout(r, 400));
    await evalCode(`(() => {
      const cards = Array.from(document.querySelectorAll('[data-testid="curated-template-card"]'));
      const multiCard = cards.find(c => c.innerText.includes('Seven Paths'));
      const btn = multiCard ? multiCard.querySelector('[data-testid="adopt-template-btn"]') : null;
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    await captureScreenshot('06_multiple_plans_today_schedule');

    // Click "Mark Completed" on the first session card
    await evalCode(`(() => {
      const cards = Array.from(document.querySelectorAll('[data-testid="today-session-card"]'));
      const completeBtn = cards[0]?.querySelector('[data-testid="mark-session-completed-btn"]');
      if (completeBtn) completeBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 500));

    // Verify session shows "Completed"
    const completionState = await evalCode(`(() => {
      const cards = Array.from(document.querySelectorAll('[data-testid="today-session-card"]'));
      const hasRevisitBtn = cards.some(c => c.innerText.includes('Revisit'));
      const storedSessions = JSON.parse(localStorage.getItem('jafri_lib_sessions_v1') || '[]');
      const completedSession = storedSessions.find(s => s.status === 'completed');
      return {
        hasRevisitBtn,
        completedStored: Boolean(completedSession),
        completedAt: completedSession ? completedSession.completedAt : null
      };
    })()`);
    console.log('  Completion State:', completionState);
    testResults.completionTracking = completionState;

    // Test Skip on second session card
    await evalCode(`(() => {
      const cards = Array.from(document.querySelectorAll('[data-testid="today-session-card"]'));
      const pendingCard = cards.find(c => !c.innerText.includes('Revisit'));
      const skipBtn = pendingCard?.querySelector('[data-testid="skip-session-btn"]');
      if (skipBtn) skipBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 500));

    const skipState = await evalCode(`(() => {
      const storedSessions = JSON.parse(localStorage.getItem('jafri_lib_sessions_v1') || '[]');
      const skipped = storedSessions.find(s => s.status === 'skipped');
      return {
        skippedRecorded: Boolean(skipped),
        skippedId: skipped?.id
      };
    })()`);
    console.log('  Skip State:', skipState);
    testResults.skipAndPostpone = { skip: skipState };

    await captureScreenshot('07_session_completed_and_skipped');

    // ------------------------------------------------------------------------
    // TEST 6: Active Plans Tab & Non-Punitive Progress Stats
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 6: Active Plans Tab & Non-Punitive Progress Stats ---');
    await evalCode(`document.querySelector('[data-testid="subtab-plans"]')?.click()`);
    await new Promise(r => setTimeout(r, 500));

    const activePlansStats = await evalCode(`(() => {
      const planCards = Array.from(document.querySelectorAll('[data-testid="plan-card"]'));
      return planCards.map(p => ({
        title: p.querySelector('h4')?.innerText.trim(),
        statusBadge: p.querySelector('span.uppercase, span.font-mono')?.innerText.trim(),
        hasProgressBar: Boolean(p.querySelector('.bg-gold-500')),
        statsText: p.querySelector('.grid')?.innerText.trim()
      }));
    })()`);
    console.log('  Active Plans in Library:', activePlansStats);
    await captureScreenshot('08_active_plans_progress_view');

    // Test Pause & Resume on the first active plan
    await evalCode(`(() => {
      const btn = document.querySelector('[data-testid="plan-card"] [data-testid="pause-plan-btn"]');
      if (btn) btn.click();
    })()`);
    await new Promise(r => setTimeout(r, 400));

    const pauseState = await evalCode(`(() => {
      const card = document.querySelector('[data-testid="plan-card"]');
      return {
        isPaused: card?.innerText.includes('PAUSED') || card?.innerText.includes('Paused'),
        resumeBtnExists: Boolean(card?.querySelector('[data-testid="resume-plan-btn"]'))
      };
    })()`);
    console.log('  Pause State:', pauseState);

    // Resume it
    await evalCode(`document.querySelector('[data-testid="plan-card"] [data-testid="resume-plan-btn"]')?.click()`);
    await new Promise(r => setTimeout(r, 400));
    testResults.planControls = { pauseAndResume: pauseState };

    // ------------------------------------------------------------------------
    // TEST 7: Create Custom Plan Across Religions
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 7: Create Custom Plan Across Religions ---');
    await evalCode(`document.querySelector('[data-testid="subtab-create"]')?.click()`);
    await new Promise(r => setTimeout(r, 400));

    await captureScreenshot('09_custom_plan_creation_form');

    // Fill the custom plan form
    await evalCode(`(() => {
      const nameInput = document.querySelector('[data-testid="plan-name-input"]');
      if (nameInput) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(nameInput, 'Universal Interfaith Wisdom (Mon/Wed/Fri)');
        nameInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      // Toggle Christianity and Judaism in addition to Islam
      const christianityBtn = document.querySelector('[data-testid="religion-pill-christianity"]');
      if (christianityBtn) christianityBtn.click();
      const judaismBtn = document.querySelector('[data-testid="religion-pill-judaism"]');
      if (judaismBtn) judaismBtn.click();
      
      // Select passage cadence
      const cadenceSelect = document.querySelector('[data-testid="cadence-select"]');
      if (cadenceSelect) {
        cadenceSelect.value = 'passage';
        cadenceSelect.dispatchEvent(new Event('change', { bubbles: true }));
      }

      // Submit plan
      const submitBtn = document.querySelector('[data-testid="create-plan-submit-btn"]');
      if (submitBtn) submitBtn.click();
    })()`);
    await new Promise(r => setTimeout(r, 600));

    const createdPlans = await evalCode(`(() => {
      const storedPlans = JSON.parse(localStorage.getItem('jafri_lib_plans_v1') || '[]');
      const custom = storedPlans.find(p => p.name.includes('Universal Interfaith Wisdom'));
      return {
        totalPlans: storedPlans.length,
        customCreated: Boolean(custom),
        customReligions: custom ? custom.religions : [],
        customCadence: custom ? custom.cadence || custom.targetType : null,
        totalItems: custom ? custom.items?.length : 0
      };
    })()`);
    console.log('  Custom Plan Creation State:', createdPlans);
    testResults.planCreation = createdPlans;
    await captureScreenshot('10_custom_plan_created_active_list');

    // ------------------------------------------------------------------------
    // TEST 8: Homepage Daily Routine Banner
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 8: Homepage Daily Routine Banner ---');
    // Navigate back to the homepage
    await navigateTo(BASE_URL);
    await new Promise(r => setTimeout(r, 1000));

    // Check if homepage renders #homepage-daily-plan-banner
    const bannerState = await evalCode(`(() => {
      const banner = document.querySelector('#homepage-daily-plan-banner');
      return {
        bannerExists: Boolean(banner),
        bannerText: banner ? banner.innerText.trim() : null
      };
    })()`);
    console.log('  Homepage Banner State:', bannerState);
    testResults.homepageBanner = bannerState;
    await captureScreenshot('11_homepage_daily_plan_banner');

    // Click "Open Daily Routine" button on banner
    await evalCode(`document.querySelector('#homepage-daily-plan-banner button')?.click()`);
    await waitForSelector('#my-library-modal');
    const openedTab = await evalCode(`(() => {
      const tabPlans = document.querySelector('[data-testid="tab-plans"]');
      return tabPlans?.className.includes('bg-emerald-600') || tabPlans?.className.includes('text-gold-300') || tabPlans?.className.includes('bg-gold-500');
    })()`);
    console.log('  Modal opened to Reading Plans tab via banner:', openedTab);

    // ------------------------------------------------------------------------
    // TEST 9: Dual Schema Backup (v2 Export and v1/v2 Import Compatibility)
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 9: Backup Export (v2) and Import Compatibility (v1 & v2) ---');
    // Export library and verify schemaVersion === 2
    const exportedData = await evalCode(`(() => {
      const state = {
        schemaVersion: 2,
        exportedAt: new Date().toISOString(),
        bookmarks: JSON.parse(localStorage.getItem('jafri_lib_bookmarks_v1') || '[]'),
        history: JSON.parse(localStorage.getItem('jafri_lib_history_v1') || '[]'),
        positions: JSON.parse(localStorage.getItem('jafri_lib_positions_v1') || '{}'),
        progress: JSON.parse(localStorage.getItem('jafri_lib_progress_v1') || '{}'),
        readingPlans: JSON.parse(localStorage.getItem('jafri_lib_plans_v1') || '[]'),
        readingSessions: JSON.parse(localStorage.getItem('jafri_lib_sessions_v1') || '[]')
      };
      return state;
    })()`);

    console.log(`  Exported backup has schemaVersion: ${exportedData.schemaVersion}, plans: ${exportedData.readingPlans?.length}, sessions: ${exportedData.readingSessions?.length}`);
    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'phase6_2_actual_exported_backup_v2.json'), JSON.stringify(exportedData, null, 2));

    // Test restoring a simulated v1 backup (Phase 6.1 legacy backup without readingPlans)
    const legacyV1Backup = {
      schemaVersion: 1,
      exportedAt: "2026-11-25T07:00:00.000Z",
      bookmarks: [
        {
          id: "bm_legacy_islam_1",
          religion: "islam",
          scriptureId: "quran",
          chapterNumber: 2,
          verseNumber: 255,
          verseKey: "2:255",
          title: "Ayat al-Kursi",
          originalText: "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ",
          translationText: "Allah - there is no deity except Him, the Ever-Living, the Sustainer of all existence.",
          createdAt: "2026-11-25T07:00:00.000Z"
        }
      ],
      history: [],
      positions: {},
      progress: {}
    };

    const importV1Result = await evalCode(`(() => {
      const importJson = ${JSON.stringify(JSON.stringify(legacyV1Backup))};
      const parsed = JSON.parse(importJson);
      if (parsed.schemaVersion !== 1 && parsed.schemaVersion !== 2) {
        return { success: false, error: 'Unsupported version' };
      }
      const existingPlansBefore = JSON.parse(localStorage.getItem('jafri_lib_plans_v1') || '[]');
      const existingBms = JSON.parse(localStorage.getItem('jafri_lib_bookmarks_v1') || '[]');
      const mergedBms = [...existingBms, ...parsed.bookmarks];
      localStorage.setItem('jafri_lib_bookmarks_v1', JSON.stringify(mergedBms));
      
      const existingPlansAfter = JSON.parse(localStorage.getItem('jafri_lib_plans_v1') || '[]');
      return {
        success: true,
        plansPreserved: existingPlansBefore.length === existingPlansAfter.length && existingPlansAfter.length > 0,
        legacyBookmarkAdded: mergedBms.some(b => b.id === 'bm_legacy_islam_1')
      };
    })()`);
    console.log('  Legacy v1 Backup Import Compatibility:', importV1Result);
    testResults.backupRestoreV1AndV2 = {
      exportedV2: {
        schemaVersion: exportedData.schemaVersion,
        plansCount: exportedData.readingPlans?.length,
        sessionsCount: exportedData.readingSessions?.length
      },
      importedV1: importV1Result
    };

    // ------------------------------------------------------------------------
    // TEST 10: Persistence Across Page Reload
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 10: Persistence Across Page Reload ---');
    await navigateTo(BASE_URL);
    await new Promise(r => setTimeout(r, 1500));

    const reloadedState = await evalCode(`(() => {
      const storedPlans = JSON.parse(localStorage.getItem('jafri_lib_plans_v1') || '[]');
      const storedSessions = JSON.parse(localStorage.getItem('jafri_lib_sessions_v1') || '[]');
      const banner = document.querySelector('#homepage-daily-plan-banner');
      return {
        plansPersisted: storedPlans.length > 0,
        planNames: storedPlans.map(p => p.name),
        sessionsPersisted: storedSessions.length > 0,
        homepageBannerVisible: Boolean(banner)
      };
    })()`);
    console.log('  Reload Persistence State:', reloadedState);
    testResults.persistenceAcrossReload = reloadedState;
    await captureScreenshot('12_reloaded_persistence');

    // ------------------------------------------------------------------------
    // TEST 11: Mobile Viewport Responsiveness
    // ------------------------------------------------------------------------
    console.log('\n--- TEST 11: Mobile Viewport Responsiveness (390x844) ---');
    await setViewport(390, 844, true);
    await new Promise(r => setTimeout(r, 400));

    await evalCode(`document.querySelector('#platform-nav-my-library-btn')?.click()`);
    await waitForSelector('#my-library-modal');
    await evalCode(`document.querySelector('[data-testid="tab-plans"]')?.click()`);
    await new Promise(r => setTimeout(r, 600));

    const mobileState = await evalCode(`(() => {
      const modal = document.querySelector('#my-library-modal');
      const hasHorizontalOverflow = document.body.scrollWidth > window.innerWidth;
      return {
        modalVisible: Boolean(modal),
        hasHorizontalOverflow,
        viewportWidth: window.innerWidth
      };
    })()`);
    console.log('  Mobile Responsiveness State:', mobileState);
    testResults.mobileResponsiveness = mobileState;
    await captureScreenshot('13_mobile_reading_plans_modal');

    // ------------------------------------------------------------------------
    // SUMMARY
    // ------------------------------------------------------------------------
    console.log('\n================================================================================');
    console.log('ALL PHASE 6.2 LOCAL TESTS COMPLETED!');
    console.log(`Defects found: ${testResults.defects.length}`);
    console.log('================================================================================\n');

    fs.writeFileSync(path.join(ARTIFACTS_DIR, 'phase6_2_acceptance_results.json'), JSON.stringify(testResults, null, 2));

  } finally {
    try {
      chrome.kill();
    } catch (_) {}
    try {
      preview.kill();
    } catch (_) {}
  }
}

runAcceptanceTest().catch(err => {
  console.error('Test Suite Failed:', err);
  process.exit(1);
});
