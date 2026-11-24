// ==============================================================================
// UNIVERSAL AUDIO-SCRIPTURE SYNCHRONIZATION ENGINE TEST SUITE
// Automated Regression Verification Across All Seven Religious Traditions
// Jafri Religious Resources
// ==============================================================================

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://127.0.0.1:5173';
const PROJECT_DIR = '/Users/afzaljafri/.gemini/antigravity/scratch/jafri-islamic-resources';
const ARTIFACT_DIR = '/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b';
const SCREENSHOTS_DIR = path.join(PROJECT_DIR, 'screenshots');
fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

async function runTest() {
  console.log('================================================================================');
  console.log('UNIVERSAL AUDIO-SCRIPTURE SYNCHRONIZATION REGRESSION TEST SUITE');
  console.log(`Target: ${BASE_URL}`);
  console.log('================================================================================\n');

  const tempDir = '/tmp/chrome_sync_test_' + Date.now();
  fs.mkdirSync(tempDir, { recursive: true });

  const chromePort = 9390;
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
  for (let i = 0; i < 40; i++) {
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

  const ws = new globalThis.WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

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
    } catch (e) {
      console.error('Error handling message:', e);
    }
  };

  function send(method, params = {}, sessionId = undefined) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      callbacks.set(id, { resolve, reject });
      const payload = { id, method, params };
      if (sessionId) payload.sessionId = sessionId;
      ws.send(JSON.stringify(payload));
    });
  }

  // Create target page
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

  await send('Page.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);
  await send('DOM.enable', {}, sessionId);

  async function evaluate(expr) {
    const res = await send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true,
    }, sessionId);
    if (res.exceptionDetails) {
      throw new Error(JSON.stringify(res.exceptionDetails));
    }
    return res.result ? res.result.value : undefined;
  }

  async function navigate(url) {
    await send('Page.navigate', { url }, sessionId);
    await new Promise((resolve) => {
      const timeout = setTimeout(resolve, 8000);
      let listener = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.method === 'Page.loadEventFired' && msg.sessionId === sessionId) {
            clearTimeout(timeout);
            ws.removeEventListener('message', listener);
            resolve();
          }
        } catch (_) {}
      };
      ws.addEventListener('message', listener);
    });
    // Extra settle time for client routing & React mounting
    await new Promise((r) => setTimeout(r, 1800));
  }

  async function captureScreenshot(filename) {
    const res = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
    const buf = Buffer.from(res.data, 'base64');
    const p1 = path.join(SCREENSHOTS_DIR, filename);
    const p2 = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(p1, buf);
    try { fs.writeFileSync(p2, buf); } catch (_) {}
    return p1;
  }

  const testResults = [];

  function recordResult(tradition, testName, expected, actual, passed, details = {}) {
    const status = passed ? 'PASS' : 'FAIL';
    console.log(`[${status}] [${tradition.toUpperCase()}] ${testName}`);
    console.log(`       Expected: ${expected}`);
    console.log(`       Actual:   ${actual}`);
    testResults.push({
      tradition,
      testName,
      expected,
      actual,
      passed,
      status,
      ...details,
    });
  }

  async function getPlayerState() {
    return await evaluate(`
      (() => {
        const right = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
        if (!right) return { hasPanel: false };
        const titleEl = right.querySelector('[data-testid="active-track-title"]');
        const badgeEl = right.querySelector('[data-testid="match-scope-badge"]');
        const noAudioEl = right.querySelector('[data-testid="no-audio-card"]');
        const noticeEl = right.querySelector('[data-testid="collection-recording-notice"]');
        const layout = document.querySelector('[data-testid="two-column-reading-layout"]');
        const left = document.querySelector('[data-testid="reading-column"]');
        const idSpan = right.querySelector('.font-mono.text-gold-400');
        const playlistCount = right.querySelectorAll('[data-testid^="playlist-item-"]').length;

        const totalW = layout ? layout.offsetWidth : 0;
        const leftW = left ? left.offsetWidth : 0;
        const rightW = right ? right.offsetWidth : 0;

        return {
          hasPanel: true,
          hasActiveTrack: Boolean(titleEl),
          activeTrackTitle: titleEl ? titleEl.innerText.trim() : null,
          activeReqId: idSpan ? idSpan.innerText.trim() : null,
          badgeText: badgeEl ? badgeEl.innerText.trim() : null,
          hasNoAudioCard: Boolean(noAudioEl),
          noAudioCardText: noAudioEl ? noAudioEl.innerText.trim() : null,
          hasCollectionNotice: Boolean(noticeEl),
          playlistCount,
          totalW,
          leftRatio: totalW ? ((leftW / totalW) * 100).toFixed(1) : 0,
          rightRatio: totalW ? ((rightW / totalW) * 100).toFixed(1) : 0,
        };
      })()
    `);
  }

  console.log('--- EXECUTING TRANSITION TESTS ACROSS ALL 7 RELIGIONS ---\n');

  // ============================================================================
  // 1. HINDUISM TRANSITIONS
  // ============================================================================
  console.log('=== TEST 1: HINDUISM TRANSITIONS ===');
  await navigate(`${BASE_URL}/?religion=hinduism&collection=gita&chapter=1`);

  // 1A. Gita Ch 1
  let state = await getPlayerState();
  let ch1Passed = state.hasActiveTrack && state.activeTrackTitle?.toLowerCase().includes('chapter 1');
  recordResult('hinduism', 'Gita Chapter 1 Initial Match', 'Bhagavad Gita — Chapter 1', `${state.activeTrackTitle} (${state.badgeText})`, ch1Passed);
  await captureScreenshot('sync_hinduism_gita_ch1.png');

  // 1B. Gita Ch 1 -> Ch 2
  await navigate(`${BASE_URL}/?religion=hinduism&collection=gita&chapter=2`);
  state = await getPlayerState();
  let ch2Passed = state.hasActiveTrack && state.activeTrackTitle?.toLowerCase().includes('chapter 2');
  recordResult('hinduism', 'Gita Ch 1 -> Ch 2 Transition', 'Bhagavad Gita — Chapter 2', `${state.activeTrackTitle} (${state.badgeText})`, ch2Passed);
  await captureScreenshot('sync_hinduism_gita_ch2.png');

  // 1C. Gita -> Bhajans Collection
  await navigate(`${BASE_URL}/?religion=hinduism&collection=bhajans`);
  state = await getPlayerState();
  let bhajansPassed = state.hasActiveTrack && (state.badgeText?.includes('Collection') || state.hasCollectionNotice);
  let noGitaInBhajans = !state.activeTrackTitle?.toLowerCase().includes('chapter 1') && !state.activeTrackTitle?.toLowerCase().includes('chapter 2');
  recordResult('hinduism', 'Gita -> Bhajans Collection Transition', 'Collection Recording with Bhajan audio, ZERO Gita persistence', `Badge: "${state.badgeText}", Track: "${state.activeTrackTitle}"`, bhajansPassed && noGitaInBhajans);
  await captureScreenshot('sync_hinduism_bhajans.png');

  // 1D. Puranas Empty State (Level 5)
  await navigate(`${BASE_URL}/?religion=hinduism&collection=puranas`);
  state = await getPlayerState();
  let puranasPassed = state.hasNoAudioCard && state.noAudioCardText?.includes('The 18 Mahapuranas');
  recordResult('hinduism', 'Puranas Empty State (Level 5)', 'No approved recording currently available for this reading: The 18 Mahapuranas', state.noAudioCardText?.replace(/\s+/g, ' ').substring(0, 100), puranasPassed);
  await captureScreenshot('sync_hinduism_puranas_empty.png');

  // ============================================================================
  // 2. CHRISTIANITY TRANSITIONS
  // ============================================================================
  console.log('\n=== TEST 2: CHRISTIANITY TRANSITIONS ===');
  // 2A. Initial State: Genesis 1 (Quarantined LibriVox -> Level 5)
  await navigate(`${BASE_URL}/?religion=christianity&book=1&chapter=1`);
  state = await getPlayerState();
  let genPassed = state.hasNoAudioCard && state.noAudioCardText?.includes('Genesis');
  recordResult('christianity', 'Genesis 1 Quarantined LibriVox (Level 5)', 'No approved recording currently available for this reading: Genesis Chapter 1', state.noAudioCardText?.replace(/\s+/g, ' ').substring(0, 100), genPassed);
  await captureScreenshot('sync_christianity_genesis1_empty.png');

  // 2B. Navigate to Matthew 6 (Lord's Prayer)
  await navigate(`${BASE_URL}/?religion=christianity&book=40&chapter=6`);
  state = await getPlayerState();
  let matthew6Passed = state.hasActiveTrack && state.activeTrackTitle?.toLowerCase().includes("lord's prayer");
  recordResult('christianity', 'Matthew 6 (Level 1 Match)', "The Lord's Prayer (Our Father / Pater Noster — Matthew 6:9–13)", state.activeTrackTitle, matthew6Passed);
  await captureScreenshot('sync_christianity_matthew6.png');

  // 2C. Navigate to Matthew 1 (Empty State)
  await navigate(`${BASE_URL}/?religion=christianity&book=40&chapter=1`);
  state = await getPlayerState();
  let matthew1Passed = state.hasNoAudioCard && state.noAudioCardText?.includes('Matthew Chapter 1');
  recordResult('christianity', 'Matthew 1 Transition (Level 5 Empty State)', 'No approved recording currently available for: Matthew Chapter 1', state.noAudioCardText?.replace(/\s+/g, ' ').substring(0, 80), matthew1Passed);
  await captureScreenshot('sync_christianity_matthew1_empty.png');

  // 2D. Navigate to Psalms 23
  await navigate(`${BASE_URL}/?religion=christianity&book=19&chapter=23`);
  state = await getPlayerState();
  let psalmPassed = state.hasActiveTrack && state.activeTrackTitle?.toLowerCase().includes('psalm 23');
  recordResult('christianity', 'Psalm 23 (Level 1 Match)', 'Psalm 23 (The Lord is My Shepherd)', state.activeTrackTitle, psalmPassed);
  await captureScreenshot('sync_christianity_psalm23.png');

  // ============================================================================
  // 3. BUDDHISM TRANSITIONS
  // ============================================================================
  console.log('\n=== TEST 3: BUDDHISM TRANSITIONS ===');
  // 3A. Suttas / SN 56.11
  await navigate(`${BASE_URL}/?religion=buddhism&sutta=suttas_sutras`);
  state = await getPlayerState();
  let sn56Passed = state.hasActiveTrack && (state.activeTrackTitle?.toLowerCase().includes('sn 56.11') || state.activeTrackTitle?.toLowerCase().includes('dhammacakka'));
  recordResult('buddhism', 'SN 56.11 Sutta (Level 1 Match)', 'SN 56.11 — Dhammacakkappavattana Sutta', state.activeTrackTitle, sn56Passed);
  await captureScreenshot('sync_buddhism_sn56_11.png');

  // 3B. Tipitaka Overview (REQ-BUD-001 is Patimokkha, NOT exact overview)
  await navigate(`${BASE_URL}/?religion=buddhism&sutta=tipitaka_overview`);
  state = await getPlayerState();
  let tipitakaPassed = state.badgeText?.includes('Collection') || state.hasNoAudioCard || (state.hasActiveTrack && !state.activeTrackTitle?.includes('SN 56.11'));
  recordResult('buddhism', 'Tipitaka Overview Transition', 'Collection Recording or Level 5 Empty State, NO SN 56.11 persistence', `Badge: "${state.badgeText}", Track: "${state.activeTrackTitle}"`, tipitakaPassed);
  await captureScreenshot('sync_buddhism_tipitaka_overview.png');

  // 3C. Metta Sutta
  await navigate(`${BASE_URL}/?religion=buddhism&sutta=metta_sutta`);
  state = await getPlayerState();
  let mettaPassed = state.hasActiveTrack && state.activeTrackTitle?.toLowerCase().includes('metta');
  recordResult('buddhism', 'Karaniya Metta Sutta (Level 1 Match)', 'Karaniya Metta Sutta', state.activeTrackTitle, mettaPassed);
  await captureScreenshot('sync_buddhism_metta_sutta.png');

  // ============================================================================
  // 4. ISLAM TRANSITIONS
  // ============================================================================
  console.log('\n=== TEST 4: ISLAM TRANSITIONS ===');
  // 4A. Surah 1: Al-Fatihah
  await navigate(`${BASE_URL}/?religion=islam&surah=1`);
  state = await getPlayerState();
  let surah1Passed = state.hasActiveTrack && state.activeTrackTitle?.toLowerCase().includes('fatihah');
  recordResult('islam', 'Surah 1: Al-Fatihah (Level 1 Match)', 'Surah 1: Al-Fatihah (الفاتحة)', state.activeTrackTitle, surah1Passed);
  await captureScreenshot('sync_islam_surah1.png');

  // 4B. Surah 1 -> Surah 2 (Al-Baqarah has no approved audio -> Level 5)
  await navigate(`${BASE_URL}/?religion=islam&surah=2`);
  state = await getPlayerState();
  let surah2Passed = state.hasNoAudioCard && (state.noAudioCardText?.includes('Al-Baqara') || state.noAudioCardText?.includes('Al-Baqarah'));
  let noFatihahInSurah2 = !state.hasActiveTrack || !state.activeTrackTitle?.toLowerCase().includes('fatihah');
  recordResult('islam', 'Surah 1 -> Surah 2 Transition (Level 5 Empty State)', 'No approved recording currently available for Surah Al-Baqarah', state.noAudioCardText?.replace(/\s+/g, ' ').substring(0, 80), surah2Passed && noFatihahInSurah2);
  await captureScreenshot('sync_islam_surah2_empty.png');

  // 4C. Surah 113: Al-Falaq
  await navigate(`${BASE_URL}/?religion=islam&surah=113`);
  state = await getPlayerState();
  let surah113Passed = state.hasActiveTrack && state.activeTrackTitle?.toLowerCase().includes('falaq');
  recordResult('islam', 'Surah 113: Al-Falaq (Level 1 Match)', 'Surah 113: Al-Falaq', state.activeTrackTitle, surah113Passed);
  await captureScreenshot('sync_islam_surah113.png');

  // 4D. Surah 114: An-Nas (Empty State)
  await navigate(`${BASE_URL}/?religion=islam&surah=114`);
  state = await getPlayerState();
  let surah114Passed = state.hasNoAudioCard && (state.noAudioCardText?.toLowerCase().includes('naas') || state.noAudioCardText?.toLowerCase().includes('nas'));
  recordResult('islam', 'Surah 114: An-Nas (Level 5 Empty State)', 'No approved recording currently available for Surah An-Nas', state.noAudioCardText?.replace(/\s+/g, ' ').substring(0, 80) || 'Card Not Found', surah114Passed);
  await captureScreenshot('sync_islam_surah114_empty.png');

  // ============================================================================
  // 5. SIKHISM TRANSITIONS
  // ============================================================================
  console.log('\n=== TEST 5: SIKHISM TRANSITIONS ===');
  // 5A. Ang 1 (Mool Mantar)
  await navigate(`${BASE_URL}/?religion=sikhism&ang=1`);
  state = await getPlayerState();
  let ang1Passed = state.hasActiveTrack && (state.activeTrackTitle?.includes('Ang 1') || state.activeTrackTitle?.includes('Mool Mantar'));
  recordResult('sikhism', 'Ang 1 (Level 1 Match)', 'Sri Guru Granth Sahib Ji — Ang 1 (Mool Mantar)', state.activeTrackTitle, ang1Passed);
  await captureScreenshot('sync_sikhism_ang1.png');

  // 5B. Ang 1 -> Ang 2 (REQ-SIK-002 covers Angs 1-8 as Chapter match)
  await navigate(`${BASE_URL}/?religion=sikhism&ang=2`);
  state = await getPlayerState();
  let ang2Passed = state.hasActiveTrack && (state.activeTrackTitle?.includes('Angs 1–8') || state.activeTrackTitle?.includes('Japji'));
  let noAng1Active = !state.activeTrackTitle?.includes('Ang 1 (Mool Mantar)');
  recordResult('sikhism', 'Ang 1 -> Ang 2 Transition (Level 2 Chapter Match)', 'Sri Guru Granth Sahib Ji — Angs 1–8 (Japji Sahib)', state.activeTrackTitle, ang2Passed && noAng1Active);
  await captureScreenshot('sync_sikhism_ang2.png');

  // ============================================================================
  // 6. JAINISM TRANSITIONS
  // ============================================================================
  console.log('\n=== TEST 6: JAINISM TRANSITIONS ===');
  // 6A. Namokar Mantra Initial Match
  await navigate(`${BASE_URL}/?religion=jainism&text=navkar`);
  state = await getPlayerState();
  let navkarPassed = state.hasActiveTrack && (state.activeTrackTitle?.includes('amōkāra') || state.activeTrackTitle?.includes('Namokar'));
  recordResult('jainism', 'Namokar Mantra Initial Match', 'Ṇamōkāra Mahāmantra', state.activeTrackTitle, navkarPassed);
  await captureScreenshot('sync_jainism_namokar.png');

  // 6B. Transition to Bhaktamara Stotra
  await navigate(`${BASE_URL}/?religion=jainism&text=bhaktamar`);
  state = await getPlayerState();
  let bhaktamarPassed = state.hasActiveTrack && (state.activeTrackTitle?.includes('Bhaktāmara') || state.activeTrackTitle?.includes('Bhaktamar'));
  let noNavkarActive = !state.activeTrackTitle?.includes('amōkāra') && !state.activeTrackTitle?.includes('Namokar');
  recordResult('jainism', 'Namokar -> Bhaktamara Stotra Transition', 'Bhaktāmara Stōtra recordings, ZERO Namokar persistence', state.activeTrackTitle, bhaktamarPassed && noNavkarActive);
  await captureScreenshot('sync_jainism_bhaktamar.png');

  // 6C. Jain Agamas Empty State (Level 5)
  await navigate(`${BASE_URL}/?religion=jainism&text=jain_agamas`);
  state = await getPlayerState();
  let agamasPassed = state.hasNoAudioCard && state.noAudioCardText?.includes('Agamas');
  recordResult('jainism', 'Jain Agamas Empty State (Level 5)', 'No approved recording currently available for Jain Agamas', state.noAudioCardText?.replace(/\s+/g, ' ').substring(0, 80), agamasPassed);
  await captureScreenshot('sync_jainism_agamas_empty.png');

  // ============================================================================
  // 7. JUDAISM TRANSITIONS
  // ============================================================================
  console.log('\n=== TEST 7: JUDAISM TRANSITIONS ===');
  // 7A. Genesis 1 (Bereshit)
  await navigate(`${BASE_URL}/?religion=judaism&book=Genesis&chapter=1`);
  state = await getPlayerState();
  let judGenPassed = state.hasActiveTrack && (state.activeTrackTitle?.includes('Genesis') || state.activeTrackTitle?.includes('Bereshit'));
  recordResult('judaism', 'Genesis 1 (Level 1 Match)', 'Genesis Chapter 1 (Bereshit 1:1–2:3)', state.activeTrackTitle, judGenPassed);
  await captureScreenshot('sync_judaism_genesis1.png');

  // 7B. Navigate to Joshua Chapter 1
  await navigate(`${BASE_URL}/?religion=judaism&book=Joshua&chapter=1`);
  state = await getPlayerState();
  let joshuaPassed = state.hasActiveTrack && state.activeTrackTitle?.includes('Joshua');
  recordResult('judaism', 'Transition to Joshua 1 (Level 1 Match)', 'Joshua Chapter 1 (Yehoshua 1:1–9)', state.activeTrackTitle, joshuaPassed);
  await captureScreenshot('sync_judaism_joshua1.png');

  // 7C. Navigate to Deuteronomy Chapter 6 (Shema Yisrael)
  await navigate(`${BASE_URL}/?religion=judaism&book=Deuteronomy&chapter=6`);
  state = await getPlayerState();
  let shemaPassed = state.hasActiveTrack && state.activeTrackTitle?.toLowerCase().includes('shema');
  recordResult('judaism', 'Deuteronomy 6 (Level 1 Match — Shema Yisrael)', 'Shema Yisrael (Deuteronomy 6:4)', state.activeTrackTitle, shemaPassed);
  await captureScreenshot('sync_judaism_deuteronomy6.png');

  // 7D. Navigate to Exodus Chapter 1 (Level 5 Empty State)
  await navigate(`${BASE_URL}/?religion=judaism&book=Exodus&chapter=1`);
  state = await getPlayerState();
  let exodusPassed = state.hasNoAudioCard && state.noAudioCardText?.includes('Exodus');
  recordResult('judaism', 'Exodus 1 Empty State (Level 5)', 'No approved recording currently available for: Exodus Chapter 1', state.noAudioCardText?.replace(/\s+/g, ' ').substring(0, 80) || 'Card Not Found', exodusPassed);
  await captureScreenshot('sync_judaism_exodus1_empty.png');

  // ============================================================================
  // SUMMARY & REPORT
  // ============================================================================
  console.log('\n================================================================================');
  console.log('TRANSITION TEST SUITE SUMMARY');
  console.log('================================================================================');

  const passedCount = testResults.filter(t => t.passed).length;
  const totalCount = testResults.length;
  console.log(`Total Transition Scenarios Tested: ${totalCount}`);
  console.log(`Passed:                            ${passedCount}`);
  console.log(`Failed:                            ${totalCount - passedCount}`);
  console.log(`Success Rate:                      ${((passedCount / totalCount) * 100).toFixed(1)}%\n`);

  fs.writeFileSync(
    path.join(PROJECT_DIR, 'test_universal_synchronization_results.json'),
    JSON.stringify(testResults, null, 2)
  );
  try {
    fs.writeFileSync(
      path.join(ARTIFACT_DIR, 'test_universal_synchronization_results.json'),
      JSON.stringify(testResults, null, 2)
    );
  } catch (_) {}

  ws.close();
  chrome.kill('SIGTERM');

  if (passedCount < totalCount) {
    console.error('Some transition tests failed. Please review output above.');
    process.exit(1);
  } else {
    console.log('ALL TRANSITION SCENARIOS PASSED WITH ZERO REGRESSIONS!');
    process.exit(0);
  }
}

runTest().catch((err) => {
  console.error('Test runner fatal error:', err);
  process.exit(1);
});
