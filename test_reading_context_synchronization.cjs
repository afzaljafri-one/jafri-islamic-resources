// ==============================================================================
// JAFRI RELIGIOUS RESOURCES — READING CONTEXT SYNCHRONIZATION TEST SUITE
// Validates immediate synchronization between Reader and Sacred Audio Player
// across all Hinduism categories and all 7 religion modules.
// ==============================================================================

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:5173';
const ARTIFACT_DIR = '/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b';

async function runTest() {
  console.log('================================================================================');
  console.log('READING CONTEXT SYNCHRONIZATION ACCEPTANCE SUITE (CDP HEADLESS CHROME)');
  console.log(`Target URL: ${BASE_URL}`);
  console.log('================================================================================\n');

  const tempDir = '/tmp/chrome_sync_test_' + Date.now();
  fs.mkdirSync(tempDir, { recursive: true });

  const chromePort = 9400 + Math.floor(Math.random() * 200);
  const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', [
    '--headless=new',
    `--remote-debugging-port=${chromePort}`,
    '--remote-allow-origins=*',
    '--autoplay-policy=no-user-gesture-required',
    '--disable-gpu',
    '--no-sandbox',
    '--window-size=1280,900',
    `--user-data-dir=${tempDir}`,
    'about:blank'
  ]);

  let wsUrl = null;
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 200));
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
    console.error('Could not connect to Chrome debugging port.');
    chrome.kill('SIGKILL');
    process.exit(1);
  }

  console.log(`[CDP] Connected to Chrome at ${wsUrl}\n`);

  const WebSocket = globalThis.WebSocket;
  const ws = new WebSocket(wsUrl);

  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let msgId = 1;
  const callbacks = new Map();

  ws.onmessage = (evt) => {
    try {
      const msg = JSON.parse(evt.data);
      if (msg.id && callbacks.has(msg.id)) {
        const { resolve, reject } = callbacks.get(msg.id);
        callbacks.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message));
        else resolve(msg.result);
      }
    } catch (e) {
      console.error('WebSocket parse error:', e);
    }
  };

  function send(method, params = {}, sessionId = null) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      callbacks.set(id, { resolve, reject });
      const payload = { id, method, params };
      if (sessionId) payload.sessionId = sessionId;
      ws.send(JSON.stringify(payload));
    });
  }

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

  await send('Page.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);
  await send('DOM.enable', {}, sessionId);
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false
  }, sessionId);

  async function navigate(url, waitMs = 3000) {
    await send('Page.navigate', { url }, sessionId);
    await new Promise((r) => setTimeout(r, waitMs));
  }

  async function evaluate(expression) {
    const res = await send('Runtime.evaluate', {
      expression,
      returnByValue: true,
      awaitPromise: true
    }, sessionId);
    if (res.exceptionDetails) {
      console.error('Eval error:', res.exceptionDetails);
    }
    return res.result ? res.result.value : undefined;
  }

  async function captureScreenshot(filePath) {
    const res = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
    if (res?.data) {
      fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
      return true;
    }
    return false;
  }

  const results = {
    timestamp: new Date().toISOString(),
    tests: [],
    passedCount: 0,
    failedCount: 0
  };

  function record(testName, tradition, passed, details) {
    const status = passed ? 'PASS' : 'FAIL';
    if (passed) results.passedCount++;
    else results.failedCount++;
    results.tests.push({ testName, tradition, status, details });
    console.log(`[${status}] [${tradition}] ${testName}`);
    console.log(`       ${details}`);
  }

  try {
    // =========================================================================
    // SECTION A: DEFAULT HINDUISM LOAD (Bhagavad Gita Chapter 1)
    // =========================================================================
    console.log('--- TEST A: Default Hinduism Load (Gita Ch 1) ---');
    await navigate(`${BASE_URL}/?religion=hinduism`, 3000);

    const stateA = await evaluate(`
      (() => {
        const leftText = document.querySelector('main')?.innerText || '';
        const right = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
        const spans = Array.from(right?.querySelectorAll('span') || []);
        const reqSpan = spans.find(s => s.innerText.startsWith('REQ-HIN-'));
        const activeTrackId = reqSpan ? reqSpan.innerText.trim() : '';
        const activeTrackTitle = right?.querySelector('[data-testid="active-track-title"]')?.innerText || '';
        const hasGitaInLeft = leftText.includes('Bhagavad Gita') || leftText.includes('धर्मक्षेत्रे');
        return {
          hasGitaInLeft,
          activeTrackId,
          activeTrackTitle
        };
      })()
    `);

    record(
      'Acceptance Test A: Default Hinduism Load (Gita Ch 1 on Left, REQ-HIN-001 in Player)',
      'HINDUISM',
      Boolean(stateA?.hasGitaInLeft && stateA?.activeTrackId === 'REQ-HIN-001'),
      `Left has Gita: ${stateA?.hasGitaInLeft}, ActiveTrack: ${stateA?.activeTrackId} ("${stateA?.activeTrackTitle}")`
    );

    // =========================================================================
    // SECTION B: SWITCH TO BHAJANS CATEGORY -> BHAJANS COLLECTION
    // =========================================================================
    console.log('\n--- TEST B: Switch to Bhajans Category -> Bhajans Collection ---');
    await evaluate(`
      (() => {
        const categoryButtons = Array.from(document.querySelectorAll('button'));
        const bhajanPill = categoryButtons.find(b => b.innerText.trim() === 'Bhajans');
        if (bhajanPill) bhajanPill.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 1500));

    const stateB = await evaluate(`
      (() => {
        const leftText = document.querySelector('main')?.innerText || '';
        const right = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
        const spans = Array.from(right?.querySelectorAll('span') || []);
        const reqSpan = spans.find(s => s.innerText.startsWith('REQ-HIN-'));
        const activeTrackId = reqSpan ? reqSpan.innerText.trim() : '';
        const activeTrackTitle = right?.querySelector('[data-testid="active-track-title"]')?.innerText || '';
        const scope = right?.querySelector('h2')?.innerText || '';
        const isGitaCleared = !activeTrackTitle.toLowerCase().includes('bhagavad gita') && activeTrackId !== 'REQ-HIN-001';
        const hasBhajanLeft = leftText.includes('Mirabai') || leftText.includes('Bhajan') || leftText.includes('Devotional');
        return {
          hasBhajanLeft,
          activeTrackId,
          activeTrackTitle,
          scope,
          isGitaCleared
        };
      })()
    `);

    record(
      'Acceptance Test B: Switch to Bhajans (Gita Ch 1 Cleared, Bhajans Active in Player)',
      'HINDUISM',
      Boolean(stateB?.isGitaCleared && stateB?.activeTrackId === 'REQ-HIN-060' && stateB?.hasBhajanLeft),
      `Gita Cleared: ${stateB?.isGitaCleared}, ActiveTrack: ${stateB?.activeTrackId} ("${stateB?.activeTrackTitle}"), LeftHasBhajans: ${stateB?.hasBhajanLeft}`
    );

    // =========================================================================
    // SECTION C: SWITCH TO HANUMAN CHALISA / CHALISAS
    // =========================================================================
    console.log('\n--- TEST C: Switch to Hanuman Chalisa / Chalisas ---');
    await evaluate(`
      (() => {
        const categoryButtons = Array.from(document.querySelectorAll('button'));
        const chalisaPill = categoryButtons.find(b => b.innerText.trim() === 'Chalisas');
        if (chalisaPill) chalisaPill.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 1500));

    const stateC = await evaluate(`
      (() => {
        const right = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
        const spans = Array.from(right?.querySelectorAll('span') || []);
        const reqSpan = spans.find(s => s.innerText.startsWith('REQ-HIN-'));
        const activeTrackId = reqSpan ? reqSpan.innerText.trim() : '';
        const activeTrackTitle = right?.querySelector('[data-testid="active-track-title"]')?.innerText || '';
        const scope = right?.querySelector('h2')?.innerText || '';
        return { activeTrackId, activeTrackTitle, scope };
      })()
    `);

    record(
      'Acceptance Test C: Switch to Hanuman Chalisa / Chalisas',
      'HINDUISM',
      Boolean(stateC?.activeTrackId?.startsWith('REQ-HIN-04') && stateC?.activeTrackTitle?.toLowerCase().includes('chalisa')),
      `ActiveTrack: ${stateC?.activeTrackId} ("${stateC?.activeTrackTitle}"), Scope: "${stateC?.scope}"`
    );

    // =========================================================================
    // SECTION D: SWITCH TO MANTRAS (Gayatri Mantra / Maha Mrityunjaya)
    // =========================================================================
    console.log('\n--- TEST D: Switch to Mantras ---');
    await evaluate(`
      (() => {
        const categoryButtons = Array.from(document.querySelectorAll('button'));
        const mantraPill = categoryButtons.find(b => b.innerText.trim() === 'Mantras');
        if (mantraPill) mantraPill.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 1500));

    const stateD = await evaluate(`
      (() => {
        const right = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
        const spans = Array.from(right?.querySelectorAll('span') || []);
        const reqSpan = spans.find(s => s.innerText.startsWith('REQ-HIN-'));
        const activeTrackId = reqSpan ? reqSpan.innerText.trim() : '';
        const activeTrackTitle = right?.querySelector('[data-testid="active-track-title"]')?.innerText || '';
        const scope = right?.querySelector('h2')?.innerText || '';
        return { activeTrackId, activeTrackTitle, scope };
      })()
    `);

    record(
      'Acceptance Test D: Switch to Mantras (Gayatri Mantra REQ-HIN-067)',
      'HINDUISM',
      Boolean((stateD?.activeTrackId === 'REQ-HIN-067' || stateD?.activeTrackId === 'REQ-HIN-068') && stateD?.activeTrackTitle?.toLowerCase().includes('mantra')),
      `ActiveTrack: ${stateD?.activeTrackId} ("${stateD?.activeTrackTitle}"), Scope: "${stateD?.scope}"`
    );

    // =========================================================================
    // SECTION E: SWITCH TO SHRUTI / VEDAS
    // =========================================================================
    console.log('\n--- TEST E: Switch to Shruti / Vedas ---');
    await evaluate(`
      (() => {
        const categoryButtons = Array.from(document.querySelectorAll('button'));
        const vedaPill = categoryButtons.find(b => b.innerText.trim() === 'Shruti / Vedas');
        if (vedaPill) vedaPill.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 1500));

    const stateE = await evaluate(`
      (() => {
        const right = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
        const spans = Array.from(right?.querySelectorAll('span') || []);
        const reqSpan = spans.find(s => s.innerText.startsWith('REQ-HIN-'));
        const activeTrackId = reqSpan ? reqSpan.innerText.trim() : '';
        const activeTrackTitle = right?.querySelector('[data-testid="active-track-title"]')?.innerText || '';
        const scope = right?.querySelector('h2')?.innerText || '';
        return { activeTrackId, activeTrackTitle, scope };
      })()
    `);

    record(
      'Acceptance Test E: Switch to Shruti / Vedas (Purusha Suktam REQ-HIN-036)',
      'HINDUISM',
      Boolean(stateE?.activeTrackId === 'REQ-HIN-036' && (stateE?.activeTrackTitle?.toLowerCase().includes('suktam') || stateE?.activeTrackTitle?.toLowerCase().includes('purusha'))),
      `ActiveTrack: ${stateE?.activeTrackId} ("${stateE?.activeTrackTitle}"), Scope: "${stateE?.scope}"`
    );

    // =========================================================================
    // SECTION F: SWITCH TO AARTIS (Om Jai Jagdish Hare)
    // =========================================================================
    console.log('\n--- TEST F: Switch to Aartis ---');
    await evaluate(`
      (() => {
        const categoryButtons = Array.from(document.querySelectorAll('button'));
        const aartiPill = categoryButtons.find(b => b.innerText.trim() === 'Aartis');
        if (aartiPill) aartiPill.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 1500));

    const stateF = await evaluate(`
      (() => {
        const right = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
        const spans = Array.from(right?.querySelectorAll('span') || []);
        const reqSpan = spans.find(s => s.innerText.startsWith('REQ-HIN-'));
        const activeTrackId = reqSpan ? reqSpan.innerText.trim() : '';
        const activeTrackTitle = right?.querySelector('[data-testid="active-track-title"]')?.innerText || '';
        const scope = right?.querySelector('h2')?.innerText || '';
        return { activeTrackId, activeTrackTitle, scope };
      })()
    `);

    record(
      'Acceptance Test F: Switch to Aartis (Om Jai Jagdish Hare REQ-HIN-050)',
      'HINDUISM',
      Boolean(stateF?.activeTrackId === 'REQ-HIN-050' && stateF?.activeTrackTitle?.toLowerCase().includes('om jai jagdish hare')),
      `ActiveTrack: ${stateF?.activeTrackId} ("${stateF?.activeTrackTitle}"), Scope: "${stateF?.scope}"`
    );

    // =========================================================================
    // SECTION G: SWITCH BACK TO BHAGAVAD GITA CHAPTER 1
    // =========================================================================
    console.log('\n--- TEST G: Switch Back to Bhagavad Gita Chapter 1 ---');
    await evaluate(`
      (() => {
        const categoryButtons = Array.from(document.querySelectorAll('button'));
        const itihasaPill = categoryButtons.find(b => b.innerText.trim() === 'Itihasa / Epics');
        if (itihasaPill) itihasaPill.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 1000));

    await evaluate(`
      (() => {
        const colBtn = document.querySelector('[data-testid="collection-btn-gita"]');
        if (colBtn) colBtn.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 1500));

    const stateG = await evaluate(`
      (() => {
        const right = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
        const spans = Array.from(right?.querySelectorAll('span') || []);
        const reqSpan = spans.find(s => s.innerText.startsWith('REQ-HIN-'));
        const activeTrackId = reqSpan ? reqSpan.innerText.trim() : '';
        const activeTrackTitle = right?.querySelector('[data-testid="active-track-title"]')?.innerText || '';
        const scope = right?.querySelector('h2')?.innerText || '';
        return { activeTrackId, activeTrackTitle, scope };
      })()
    `);

    record(
      'Acceptance Test G: Switch Back to Bhagavad Gita Chapter 1 (REQ-HIN-001 Restored)',
      'HINDUISM',
      Boolean(stateG?.activeTrackId === 'REQ-HIN-001' && stateG?.activeTrackTitle?.toLowerCase().includes('chapter 1')),
      `ActiveTrack: ${stateG?.activeTrackId} ("${stateG?.activeTrackTitle}"), Scope: "${stateG?.scope}"`
    );

    // =========================================================================
    // SECTION H: SWITCH GITA CHAPTER 1 -> CHAPTER 2
    // =========================================================================
    console.log('\n--- TEST H: Switch Gita Chapter 1 -> Chapter 2 ---');
    await evaluate(`
      (() => {
        const chButtons = Array.from(document.querySelectorAll('button'));
        const ch2Btn = chButtons.find(b => b.innerText.trim() === 'Ch 2');
        if (ch2Btn) ch2Btn.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 1500));

    const stateH = await evaluate(`
      (() => {
        const right = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
        const spans = Array.from(right?.querySelectorAll('span') || []);
        const reqSpan = spans.find(s => s.innerText.startsWith('REQ-HIN-'));
        const activeTrackId = reqSpan ? reqSpan.innerText.trim() : '';
        const activeTrackTitle = right?.querySelector('[data-testid="active-track-title"]')?.innerText || '';
        const scope = right?.querySelector('h2')?.innerText || '';
        return { activeTrackId, activeTrackTitle, scope };
      })()
    `);

    record(
      'Acceptance Test H: Switch Gita Chapter 1 -> Chapter 2 (REQ-HIN-002 Active)',
      'HINDUISM',
      Boolean(stateH?.activeTrackId === 'REQ-HIN-002' && stateH?.activeTrackTitle?.toLowerCase().includes('chapter 2')),
      `ActiveTrack: ${stateH?.activeTrackId} ("${stateH?.activeTrackTitle}"), Scope: "${stateH?.scope}"`
    );

    // =========================================================================
    // SECTION I: REMAINING HINDUISM CATEGORIES & ALL OTHER SIX RELIGIONS
    // =========================================================================
    console.log('\n--- TEST I-1: Puranas Empty State (Gita Cleared & Not Displayed) ---');
    await evaluate(`
      (() => {
        const categoryButtons = Array.from(document.querySelectorAll('button'));
        const puranaPill = categoryButtons.find(b => b.innerText.trim() === 'Puranas');
        if (puranaPill) puranaPill.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 1500));

    const statePuranas = await evaluate(`
      (() => {
        const right = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
        const hasEmptyNotice = right?.querySelector('[data-testid="no-audio-matched"]') !== null;
        const activeCard = right?.querySelector('[data-testid="no-audio-card"]') !== null;
        const activeTrackTitle = right?.querySelector('[data-testid="active-track-title"]')?.innerText || null;
        return { hasEmptyNotice, activeCard, activeTrackTitle };
      })()
    `);

    record(
      'Acceptance Test I-1: Puranas Graceful Empty State (Gita Cleared & Not Displayed)',
      'HINDUISM',
      Boolean((statePuranas?.hasEmptyNotice || statePuranas?.activeCard) && statePuranas?.activeTrackTitle === null),
      `Empty Notice: ${statePuranas?.hasEmptyNotice}, Fallback Card: ${statePuranas?.activeCard}, Active Track: ${statePuranas?.activeTrackTitle}`
    );

    console.log('\n--- TEST I-2: Stotras Category (Shiva Tandava Stotram) ---');
    await evaluate(`
      (() => {
        const categoryButtons = Array.from(document.querySelectorAll('button'));
        const stotraPill = categoryButtons.find(b => b.innerText.trim() === 'Stotras');
        if (stotraPill) stotraPill.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 1500));

    const stateStotras = await evaluate(`
      (() => {
        const right = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
        const spans = Array.from(right?.querySelectorAll('span') || []);
        const reqSpan = spans.find(s => s.innerText.startsWith('REQ-HIN-'));
        const activeTrackId = reqSpan ? reqSpan.innerText.trim() : '';
        const activeTrackTitle = right?.querySelector('[data-testid="active-track-title"]')?.innerText || '';
        return { activeTrackId, activeTrackTitle };
      })()
    `);

    record(
      'Acceptance Test I-2: Stotras Contextual Matching (REQ-HIN-075)',
      'HINDUISM',
      Boolean(stateStotras?.activeTrackId === 'REQ-HIN-075' && stateStotras?.activeTrackTitle?.toLowerCase().includes('shiva tandava')),
      `ActiveTrack: ${stateStotras?.activeTrackId} ("${stateStotras?.activeTrackTitle}")`
    );

    console.log('\n--- TEST I-3: Puja Vidhi Category (Nitya Puja) ---');
    await evaluate(`
      (() => {
        const categoryButtons = Array.from(document.querySelectorAll('button'));
        const pujaPill = categoryButtons.find(b => b.innerText.trim() === 'Puja Vidhi');
        if (pujaPill) pujaPill.click();
      })()
    `);
    await new Promise((r) => setTimeout(r, 1500));

    const statePuja = await evaluate(`
      (() => {
        const right = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
        const spans = Array.from(right?.querySelectorAll('span') || []);
        const reqSpan = spans.find(s => s.innerText.startsWith('REQ-HIN-'));
        const activeTrackId = reqSpan ? reqSpan.innerText.trim() : '';
        const activeTrackTitle = right?.querySelector('[data-testid="active-track-title"]')?.innerText || '';
        return { activeTrackId, activeTrackTitle };
      })()
    `);

    record(
      'Acceptance Test I-3: Puja Vidhi Contextual Matching (REQ-HIN-084)',
      'HINDUISM',
      Boolean(statePuja?.activeTrackId === 'REQ-HIN-084' || statePuja?.activeTrackId === 'REQ-HIN-089'),
      `ActiveTrack: ${statePuja?.activeTrackId} ("${statePuja?.activeTrackTitle}")`
    );

    // =========================================================================
    // SECTION I-4: ISLAM MODULE (Surah 1 -> Surah 2 Graceful Empty State)
    // =========================================================================
    console.log('\n--- TEST I-4: Islam Module Context Sync ---');
    await navigate(`${BASE_URL}/?religion=islam`, 3000);
    const stateIslam1 = await evaluate(`
      (() => {
        const right = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
        const spans = Array.from(right?.querySelectorAll('span') || []);
        const reqSpan = spans.find(s => s.innerText.startsWith('REQ-ISL-'));
        return {
          activeTrackId: reqSpan ? reqSpan.innerText.trim() : '',
          scope: right?.querySelector('h2')?.innerText || ''
        };
      })()
    `);

    record(
      'Acceptance Test I-4: Islam Surah 1 Contextual Matching (REQ-ISL-001)',
      'ISLAM',
      Boolean(stateIslam1?.activeTrackId === 'REQ-ISL-001' && stateIslam1?.scope?.includes('Surah 1')),
      `ActiveTrack: ${stateIslam1?.activeTrackId}, Scope: "${stateIslam1?.scope}"`
    );

    // =========================================================================
    // SECTION I-5: CHRISTIANITY MODULE (Graceful Empty State on Genesis 1)
    // =========================================================================
    console.log('\n--- TEST I-5: Christianity Module Fallback ---');
    await navigate(`${BASE_URL}/?religion=christianity`, 3000);
    const stateChrist = await evaluate(`
      (() => {
        const right = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
        return {
          hasEmptyNotice: right?.querySelector('[data-testid="no-audio-matched"]') !== null,
          hasFallbackCard: right?.querySelector('[data-testid="no-audio-card"]') !== null,
          activeTrackTitle: right?.querySelector('[data-testid="active-track-title"]')?.innerText || null
        };
      })()
    `);

    record(
      'Acceptance Test I-5: Christianity Unmatched Book (Genesis 1) Graceful Fallback',
      'CHRISTIANITY',
      Boolean((stateChrist?.hasEmptyNotice || stateChrist?.hasFallbackCard) && stateChrist?.activeTrackTitle === null),
      `Empty Notice: ${stateChrist?.hasEmptyNotice}, Active Track: ${stateChrist?.activeTrackTitle}`
    );

    // =========================================================================
    // SECTION I-6: BUDDHISM MODULE (Tipitaka Suttas & 16 Approved Recordings)
    // =========================================================================
    console.log('\n--- TEST I-6: Buddhism Module Contextual Audio ---');
    await navigate(`${BASE_URL}/?religion=buddhism`, 3000);
    const stateBuddhism = await evaluate(`
      (() => {
        const right = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
        return {
          playlistCount: right?.querySelectorAll('[data-testid^="playlist-item-"]')?.length || 0
        };
      })()
    `);

    record(
      'Acceptance Test I-6: Buddhism Contextual Audio & 16 Playable Recordings',
      'BUDDHISM',
      Boolean(stateBuddhism?.playlistCount === 16),
      `PlaylistCount: ${stateBuddhism?.playlistCount}`
    );

    // =========================================================================
    // SECTION I-7: SIKHISM MODULE (Ang 1 & 17 Gurbani Recordings)
    // =========================================================================
    console.log('\n--- TEST I-7: Sikhism Module Contextual Audio ---');
    await navigate(`${BASE_URL}/?religion=sikhism`, 3000);
    const stateSikhism = await evaluate(`
      (() => {
        const right = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
        const spans = Array.from(right?.querySelectorAll('span') || []);
        const reqSpan = spans.find(s => s.innerText.startsWith('REQ-SIK-'));
        return {
          activeTrackId: reqSpan ? reqSpan.innerText.trim() : '',
          scope: right?.querySelector('h2')?.innerText || '',
          playlistCount: right?.querySelectorAll('[data-testid^="playlist-item-"]')?.length || 0
        };
      })()
    `);

    record(
      'Acceptance Test I-7: Sikhism Ang 1 Contextual Audio (REQ-SIK-001) & 17 Recordings',
      'SIKHISM',
      Boolean((stateSikhism?.activeTrackId === 'REQ-SIK-001' || stateSikhism?.activeTrackId === 'REQ-SIK-002') && stateSikhism?.playlistCount === 17),
      `ActiveTrack: ${stateSikhism?.activeTrackId}, Scope: "${stateSikhism?.scope}", Playlist: ${stateSikhism?.playlistCount}`
    );

    // =========================================================================
    // SECTION I-8: JAINISM MODULE (Navkar Mantra & 19 Recordings)
    // =========================================================================
    console.log('\n--- TEST I-8: Jainism Module Contextual Audio ---');
    await navigate(`${BASE_URL}/?religion=jainism`, 3000);
    const stateJainism = await evaluate(`
      (() => {
        const right = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
        const spans = Array.from(right?.querySelectorAll('span') || []);
        const reqSpan = spans.find(s => s.innerText.startsWith('REQ-JAI-'));
        return {
          activeTrackId: reqSpan ? reqSpan.innerText.trim() : '',
          scope: right?.querySelector('h2')?.innerText || '',
          playlistCount: right?.querySelectorAll('[data-testid^="playlist-item-"]')?.length || 0
        };
      })()
    `);

    record(
      'Acceptance Test I-8: Jainism Navkar Mantra Contextual Audio (REQ-JAI-001) & 19 Recordings',
      'JAINISM',
      Boolean(stateJainism?.activeTrackId === 'REQ-JAI-001' && stateJainism?.playlistCount === 19),
      `ActiveTrack: ${stateJainism?.activeTrackId}, Scope: "${stateJainism?.scope}", Playlist: ${stateJainism?.playlistCount}`
    );

    // =========================================================================
    // SECTION I-9: JUDAISM MODULE (Genesis 1 Direct Audio & Seek Slider)
    // =========================================================================
    console.log('\n--- TEST I-9: Judaism Module Genesis 1 Direct Audio ---');
    await navigate(`${BASE_URL}/?religion=judaism`, 3000);
    const stateJudaism = await evaluate(`
      (() => {
        const right = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
        const spans = Array.from(right?.querySelectorAll('span') || []);
        const reqSpan = spans.find(s => s.innerText.startsWith('REQ-JUD-'));
        return {
          activeTrackId: reqSpan ? reqSpan.innerText.trim() : '',
          formatBadge: right?.querySelector('[data-testid="audio-format-badge"]')?.innerText || '',
          hasSeekSlider: right?.querySelector('[data-testid="audio-seek-slider"]') !== null
        };
      })()
    `);

    record(
      'Acceptance Test I-9: Judaism Genesis 1 Direct Audio (REQ-JUD-001 with Seek Slider)',
      'JUDAISM',
      Boolean(stateJudaism?.activeTrackId === 'REQ-JUD-001' && stateJudaism?.hasSeekSlider),
      `ActiveTrack: ${stateJudaism?.activeTrackId}, Badge: ${stateJudaism?.formatBadge}, SeekSlider: ${stateJudaism?.hasSeekSlider}`
    );

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    const outJsonPath = path.join(ARTIFACT_DIR, 'reading_context_synchronization_results.json');
    fs.writeFileSync(outJsonPath, JSON.stringify(results, null, 2));

    console.log('\n================================================================================');
    console.log(`TOTAL TESTS: ${results.tests.length} | PASSED: ${results.passedCount} | FAILED: ${results.failedCount}`);
    console.log(`Pass Rate: ${((results.passedCount / results.tests.length) * 100).toFixed(1)}%`);
    console.log(`Results saved to: ${outJsonPath}`);
    console.log('================================================================================\n');

    chrome.kill('SIGKILL');
    process.exit(results.failedCount === 0 ? 0 : 1);
  }
}

runTest();
