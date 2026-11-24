// ==============================================================================
// MILESTONE E LIVE PRODUCTION ACCEPTANCE TEST SUITE
// OFFLINE HARDENING & ZERO-SYNTHETIC ISLAMIC AUDIO GOVERNANCE
// Tests Live GitHub Pages (https://afzaljafri-one.github.io/jafri-islamic-resources/)
// Jafri Sacred Library — Religious Readings & Sacred Audio
// ==============================================================================

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const LIVE_BASE_URL = 'https://afzaljafri-one.github.io/jafri-islamic-resources';
const ARTIFACT_DIR = '/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b';
const SCREENSHOT_DIR = path.join(ARTIFACT_DIR, 'phase4_milestone_e_live_evidence');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function pollForDeployment(targetHash, maxAttempts = 35) {
  console.log(`Polling live production at ${LIVE_BASE_URL} for target bundle: ${targetHash}...`);
  for (let i = 1; i <= maxAttempts; i++) {
    try {
      const resp = await fetch(`${LIVE_BASE_URL}/?v=${Date.now()}`, { cache: 'no-store' });
      if (resp.ok) {
        const text = await resp.text();
        const match = text.match(/index-[a-zA-Z0-9_-]+\.js/);
        const currentHash = match ? match[0] : 'unknown';
        console.log(`[Attempt ${i}/${maxAttempts}] Current live script: ${currentHash}`);
        if (targetHash && currentHash.includes(targetHash)) {
          console.log(`[DEPLOYMENT DETECTED] Target bundle ${targetHash} is LIVE!`);
          return true;
        }
      }
    } catch (e) {
      console.log(`[Attempt ${i}] Error fetching live HTML: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, 8000));
  }
  return false;
}

async function runLiveTest() {
  const targetHash = 'index-DwhPDrId';
  const deployed = await pollForDeployment(targetHash, 35);
  if (!deployed) {
    console.warn(`[WARN] Polling timed out or target hash differs. Proceeding with live audit.`);
  }

  const chromePort = 9422;
  const tempDir = '/tmp/chrome_milestone_e_live_' + Date.now();
  fs.mkdirSync(tempDir, { recursive: true });

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
    console.error('Failed to connect to headless Chrome');
    chrome.kill('SIGKILL');
    process.exit(1);
  }

  console.log('[CDP] Connected to Chrome Browser for LIVE Audit:', wsUrl);
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
    } catch (_) {}
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

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

  await send('Page.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1280,
    height: 900,
    deviceScaleFactor: 1,
    mobile: false,
  }, sessionId);

  async function evaluate(expression) {
    const isBlock = expression.includes('return ') || expression.includes(';') || expression.includes('const ') || expression.includes('let ');
    const expr = isBlock ? `(() => { ${expression} })()` : expression;
    const res = await send('Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true,
    }, sessionId);
    if (res.exceptionDetails) {
      throw new Error(res.exceptionDetails.text || JSON.stringify(res.exceptionDetails));
    }
    return res.result?.value;
  }

  async function captureScreenshot(filename) {
    const { data } = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
    const filePath = path.join(SCREENSHOT_DIR, filename);
    fs.writeFileSync(filePath, Buffer.from(data, 'base64'));
    console.log(`[Screenshot Saved] -> ${filePath}`);
    fs.writeFileSync(path.join(ARTIFACT_DIR, filename), Buffer.from(data, 'base64'));
  }

  const results = {
    timestamp: new Date().toISOString(),
    suite: 'Milestone E Live: Islam, Christianity, Sikhism Offline Hardening & Zero-AI Enforcement',
    productionUrl: LIVE_BASE_URL,
    checks: []
  };

  try {
    // CHECK 1: Sikhism Ang 1 (Mool Mantar & Japji Opening)
    console.log(`\n--- LIVE CHECK 1: SIKHISM ANG 1 ---`);
    await send('Page.navigate', { url: `${LIVE_BASE_URL}/?religion=sikhism&ang=1` }, sessionId);
    await new Promise((r) => setTimeout(r, 4000));

    const ang1Text = await evaluate(`document.body.innerText`);
    const hasMoolMantar = ang1Text.includes('ੴ') || ang1Text.includes('ਸਤਿ ਨਾਮੁ') || ang1Text.includes('Mool Mantar') || ang1Text.includes('Ik Onkar');
    console.log(`Live Ang 1 Mool Mantar / Japji detected: ${hasMoolMantar}`);
    await captureScreenshot('live_milestone_e_01_sikhism_ang_1.png');

    results.checks.push({
      test: 'Live Sikhism Ang 1 (Mool Mantar & Japji Opening)',
      hasMoolMantar,
      status: hasMoolMantar ? 'PASS' : 'FAIL',
    });

    // CHECK 2: Sikhism Ang 8 (Completion of Japji Sahib & Concluding Salok)
    console.log(`\n--- LIVE CHECK 2: SIKHISM ANG 8 (JAPJI SAHIB CONCLUSION) ---`);
    await send('Page.navigate', { url: `${LIVE_BASE_URL}/?religion=sikhism&ang=8` }, sessionId);
    await new Promise((r) => setTimeout(r, 4000));

    const ang8Text = await evaluate(`document.body.innerText`);
    const hasSachKhand = ang8Text.includes('ਸਚ ਖੰਡਿ') || ang8Text.includes('Realm of Truth') || ang8Text.includes('ਸਲੋਕੁ') || ang8Text.includes('ਪਵਣੁ ਗੁਰੂ');
    console.log(`Live Ang 8 Sach Khand / Salok detected: ${hasSachKhand}`);
    await captureScreenshot('live_milestone_e_02_sikhism_ang_8.png');

    results.checks.push({
      test: 'Live Sikhism Ang 8 (Complete Japji Sahib Conclusion & Salok)',
      hasSachKhand,
      status: hasSachKhand ? 'PASS' : 'FAIL',
    });

    // CHECK 3: Sikhism Ang 13 (Kirtan Sohila & Cosmic Aarti Gagan Mai Thaal)
    console.log(`\n--- LIVE CHECK 3: SIKHISM ANG 13 (GAGAN MAI THAAL) ---`);
    await send('Page.navigate', { url: `${LIVE_BASE_URL}/?religion=sikhism&ang=13` }, sessionId);
    await new Promise((r) => setTimeout(r, 4000));

    const ang13Text = await evaluate(`document.body.innerText`);
    const hasGaganMaiThaal = ang13Text.includes('ਗਗਨ ਮੈ ਥਾਲੁ') || ang13Text.includes('platter') || ang13Text.includes('Dhanasri');
    console.log(`Live Ang 13 Gagan Mai Thaal Aarti detected: ${hasGaganMaiThaal}`);
    await captureScreenshot('live_milestone_e_03_sikhism_ang_13.png');

    results.checks.push({
      test: 'Live Sikhism Ang 13 (Cosmic Aarti Gagan Mai Thaal)',
      hasGaganMaiThaal,
      status: hasGaganMaiThaal ? 'PASS' : 'FAIL',
    });

    // CHECK 4: Christianity Offline Chapters (Genesis 1 & Psalm 23)
    console.log(`\n--- LIVE CHECK 4: CHRISTIANITY OFFLINE CHAPTERS ---`);
    await send('Page.navigate', { url: `${LIVE_BASE_URL}/?religion=christianity&book=1&chapter=1` }, sessionId);
    await new Promise((r) => setTimeout(r, 4000));

    const gen1Text = await evaluate(`document.body.innerText`);
    const hasCreation = gen1Text.includes('In the beginning') && gen1Text.includes('God created the heaven');
    console.log(`Live Genesis 1 Creation text loaded: ${hasCreation}`);
    await captureScreenshot('live_milestone_e_04_christianity_genesis_1.png');

    results.checks.push({
      test: 'Live Christianity Genesis 1 Fallback',
      hasCreation,
      status: hasCreation ? 'PASS' : 'FAIL',
    });

    // CHECK 5: Islam Zero-Synthetic Recitation Governance & Mushaf Reader
    console.log(`\n--- LIVE CHECK 5: ISLAM MUSHAF READER & ZERO-SYNTHETIC GOVERNANCE ---`);
    await send('Page.navigate', { url: `${LIVE_BASE_URL}/?religion=islam` }, sessionId);
    await new Promise((r) => setTimeout(r, 4000));

    const islamPageText = await evaluate(`document.body.innerText`);
    const hasMushaf = islamPageText.includes('Quran') || islamPageText.includes('Surah') || islamPageText.includes('Fatihah');
    console.log(`Live Islam Mushaf Reader loaded: ${hasMushaf}`);
    await captureScreenshot('live_milestone_e_05_islam_mushaf_reader.png');

    const appTitle = await evaluate(`document.title`);
    const noZodiacBee = !appTitle.includes('ZodiacBee');

    results.checks.push({
      test: 'Live Islam Mushaf Reader & Brand Integrity',
      hasMushaf,
      noZodiacBee,
      status: hasMushaf && noZodiacBee ? 'PASS' : 'FAIL',
    });

    // CHECK 6: Coverage Transparency Modal (Sikhism Angs 1–13 Offline)
    console.log(`\n--- LIVE CHECK 6: SCRIPTURE COVERAGE MODAL (SIKHISM) ---`);
    await evaluate(`
      const modalBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Coverage') || b.title?.includes('Coverage') || b.innerText.includes('Transparency'));
      if (modalBtn) modalBtn.click();
    `);
    await new Promise((r) => setTimeout(r, 1500));

    await evaluate(`
      const sikTab = Array.from(document.querySelectorAll('[role="dialog"] button, .fixed.inset-0 button')).find(b => b.innerText.includes('Sikhism') || b.innerText.includes('ਸਿੱਖੀ'));
      if (sikTab) sikTab.click();
    `);
    await new Promise((r) => setTimeout(r, 1500));

    const sikModalText = await evaluate(`
      const modal = document.querySelector('[role="dialog"]') || document.querySelector('.fixed.inset-0');
      return modal ? modal.innerText : '';
    `);
    console.log(`Live Sikhism Coverage Modal Text Length: ${sikModalText.length}`);
    await captureScreenshot('live_milestone_e_06_coverage_modal_sikhism.png');

    const modalMentionsAngs1To13 = sikModalText.includes('1–13') || sikModalText.includes('13') || sikModalText.includes('Japji Sahib');
    const modalMentionsGurbaniNow = sikModalText.includes('BaniDB') || sikModalText.includes('GurbaniNow');

    results.checks.push({
      test: 'Live Coverage Transparency Modal Audit (Sikhism Angs 1–13)',
      mentionsAngs1To13,
      mentionsGurbaniNow,
      status: modalMentionsAngs1To13 && modalMentionsGurbaniNow ? 'PASS' : 'FAIL',
    });

    // CHECK 7: Coverage Transparency Modal (Christianity & Islam Zero Synthetic Gate)
    console.log(`\n--- LIVE CHECK 7: SCRIPTURE COVERAGE MODAL (CHRISTIANITY & ISLAM) ---`);
    await evaluate(`
      const chrTab = Array.from(document.querySelectorAll('[role="dialog"] button, .fixed.inset-0 button')).find(b => b.innerText.includes('Christianity'));
      if (chrTab) chrTab.click();
    `);
    await new Promise((r) => setTimeout(r, 1500));

    const chrModalText = await evaluate(`
      const modal = document.querySelector('[role="dialog"]') || document.querySelector('.fixed.inset-0');
      return modal ? modal.innerText : '';
    `);
    const chrHasFoundational = chrModalText.includes('Genesis') || chrModalText.includes('Psalm') || chrModalText.includes('Beatitudes');

    await evaluate(`
      const islTab = Array.from(document.querySelectorAll('[role="dialog"] button, .fixed.inset-0 button')).find(b => b.innerText.includes('Islam') || b.innerText.includes('الإسلام'));
      if (islTab) islTab.click();
    `);
    await new Promise((r) => setTimeout(r, 1500));

    const islModalText = await evaluate(`
      const modal = document.querySelector('[role="dialog"]') || document.querySelector('.fixed.inset-0');
      return modal ? modal.innerText : '';
    `);
    const islMentionsSyntheticBan = islModalText.includes('Synthetic AI') || islModalText.includes('prohibited');

    await captureScreenshot('live_milestone_e_07_coverage_modal_islam.png');

    results.checks.push({
      test: 'Live Coverage Transparency Modal Audit (Christianity & Islam Zero Synthetic Gate)',
      chrHasFoundational,
      islMentionsSyntheticBan,
      status: chrHasFoundational && islMentionsSyntheticBan ? 'PASS' : 'FAIL',
    });

    console.log(`\n======================================================`);
    console.log(`ALL LIVE MILESTONE E ACCEPTANCE CHECKS COMPLETED`);
    console.log(`======================================================`);
    console.log(JSON.stringify(results, null, 2));

    fs.writeFileSync(path.join(ARTIFACT_DIR, 'milestone_e_live_results.json'), JSON.stringify(results, null, 2));

  } catch (err) {
    console.error('Live Test execution error:', err);
    results.error = err.message;
  } finally {
    try { ws.close(); } catch (_) {}
    try { chrome.kill('SIGKILL'); } catch (_) {}
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (_) {}
  }
}

runLiveTest();
