// ==============================================================================
// MILESTONE B LIVE PRODUCTION ACCEPTANCE TEST SUITE — HINDUISM EXPANSION
// Tests Live GitHub Pages (https://afzaljafri-one.github.io/jafri-islamic-resources/)
// Jafri Sacred Library — Religious Readings & Sacred Audio
// ==============================================================================

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const LIVE_BASE_URL = 'https://afzaljafri-one.github.io/jafri-islamic-resources';
const ARTIFACT_DIR = '/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b';
const SCREENSHOT_DIR = path.join(ARTIFACT_DIR, 'phase4_milestone_b_live_evidence');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

async function pollForDeployment(targetHash, maxAttempts = 30) {
  console.log(`Polling live production at ${LIVE_BASE_URL} for updated bundle...`);
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
  const targetHash = 'index-CrdkJQcj.js';
  const deployed = await pollForDeployment('index-CrdkJQcj', 30);
  if (!deployed) {
    console.warn(`[WARN] Polling timed out or target hash differs. Proceeding with live audit.`);
  }

  const chromePort = 9405;
  const tempDir = '/tmp/chrome_milestone_b_live_' + Date.now();
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

  async function evaluate(expression) {
    const trimmed = expression.trim();
    let body;
    if (trimmed.includes('return')) {
      body = trimmed;
    } else if (trimmed.includes(';') || trimmed.includes('\n') || trimmed.startsWith('const ') || trimmed.startsWith('let ') || trimmed.startsWith('var ')) {
      body = trimmed;
    } else {
      body = `return (${trimmed});`;
    }
    const wrapped = `(() => {\n${body}\n})()`;
    const res = await send('Runtime.evaluate', {
      expression: wrapped,
      returnByValue: true,
      awaitPromise: true,
    }, sessionId);
    if (res.exceptionDetails) {
      throw new Error(`Eval error: ${JSON.stringify(res.exceptionDetails)}`);
    }
    return res.result?.value;
  }

  async function captureScreenshot(filename) {
    const res = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
    const buf = Buffer.from(res.data, 'base64');
    const outPath = path.join(SCREENSHOT_DIR, filename);
    fs.writeFileSync(outPath, buf);
    const rootPath = path.join(ARTIFACT_DIR, filename);
    fs.writeFileSync(rootPath, buf);
    console.log(`[Live Screenshot Saved] ${filename} (${buf.length} bytes)`);
  }

  const results = {
    testDate: new Date().toISOString(),
    environment: 'LIVE PRODUCTION (GitHub Pages)',
    targetUrl: LIVE_BASE_URL,
    milestone: 'Milestone B — Hinduism Content Expansion',
    checks: [],
  };

  try {
    console.log(`\n--- NAVIGATING TO LIVE HINDUISM MODULE ---`);
    await send('Page.navigate', { url: `${LIVE_BASE_URL}/?religion=hinduism&v=${Date.now()}` }, sessionId);
    await new Promise((r) => setTimeout(r, 3500));

    // CHECK 1: Title and Branding
    const pageTitle = await evaluate(`document.title`);
    const hasZodiacBee = await evaluate(`document.body.innerText.toLowerCase().includes('zodiacbee')`);
    console.log(`Live Title: "${pageTitle}", Clean of ZodiacBee: ${!hasZodiacBee}`);
    results.checks.push({
      test: 'Title & Branding Verification',
      title: pageTitle,
      cleanOfZodiacBee: !hasZodiacBee,
      status: pageTitle === 'Jafri Sacred Library — Religious Readings & Sacred Audio' && !hasZodiacBee ? 'PASS' : 'FAIL',
    });

    // CHECK 2: Bhagavad Gita Chapter 1
    const gitaShlokaCount = await evaluate(`
      return document.querySelectorAll('[id^="shloka-"]').length;
    `);
    console.log(`Live Bhagavad Gita Loaded. Shlokas: ${gitaShlokaCount}`);
    await captureScreenshot('live_milestone_b_01_gita_ch1.png');
    results.checks.push({
      test: 'Live Bhagavad Gita Chapter 1 Rendering',
      shlokaCount: gitaShlokaCount,
      status: gitaShlokaCount === 47 ? 'PASS' : 'FAIL',
    });

    // CHECK 3: Valmiki Ramayana (All 7 Kandas)
    console.log(`\n--- LIVE: SWITCHING TO VALMIKI RAMAYANA ---`);
    await send('Page.navigate', { url: `${LIVE_BASE_URL}/?religion=hinduism&collection=valmiki_ramayana&v=${Date.now()}` }, sessionId);
    await new Promise((r) => setTimeout(r, 3000));

    const ramayanaUnits = await evaluate(`
      return Array.from(document.querySelectorAll('[id^="unit-"]')).map(el => {
        return {
          id: el.id,
          title: el.querySelector('.text-gold-400') ? el.querySelector('.text-gold-400').innerText : ''
        };
      });
    `);
    console.log(`Live Ramayana Units loaded: ${ramayanaUnits.length}`);

    // Click Yuddha Kanda
    await evaluate(`
      const targetUnit = document.querySelector('[id*="yuddha_kanda"]') || Array.from(document.querySelectorAll('[id^="unit-"]')).find(el => el.id.includes('yuddha'));
      if (targetUnit) targetUnit.click();
    `);
    await new Promise((r) => setTimeout(r, 1200));

    const ramayanaMatchBadge = await evaluate(`
      const b = document.querySelector('[data-testid="match-scope-badge"]');
      return b ? b.innerText.trim() : 'NONE';
    `);
    const ramayanaTrackTitle = await evaluate(`
      const t = document.querySelector('[data-testid="active-track-title"]');
      return t ? t.innerText.trim() : 'NONE';
    `);
    console.log(`Live Aditya Hridaya Match: "${ramayanaMatchBadge}", Track: "${ramayanaTrackTitle}"`);
    await captureScreenshot('live_milestone_b_02_valmiki_ramayana_7_kandas.png');

    results.checks.push({
      test: 'Live Valmiki Ramayana (All 7 Kandas & Audio Linkage)',
      unitsCount: ramayanaUnits.length,
      audioBadge: ramayanaMatchBadge,
      trackTitle: ramayanaTrackTitle,
      status: ramayanaUnits.length >= 7 && ramayanaMatchBadge === 'Matching Audio' ? 'PASS' : 'FAIL',
    });

    // CHECK 4: Principal Upanishads (10 Mukhya Upanishads & Mahavakyas)
    console.log(`\n--- LIVE: SWITCHING TO PRINCIPAL UPANISHADS ---`);
    await send('Page.navigate', { url: `${LIVE_BASE_URL}/?religion=hinduism&collection=principal_upanishads&v=${Date.now()}` }, sessionId);
    await new Promise((r) => setTimeout(r, 3000));

    const upanishadUnits = await evaluate(`
      return Array.from(document.querySelectorAll('[id^="unit-"]')).map(el => {
        return {
          id: el.id,
          unitText: el.querySelector('.font-mono') ? el.querySelector('.font-mono').innerText : ''
        };
      });
    `);
    console.log(`Live Upanishads loaded: ${upanishadUnits.length}`);

    // Click Isha Upanishad
    await evaluate(`
      const isha = document.querySelector('#unit-isha\\\\:1') || Array.from(document.querySelectorAll('[id^="unit-"]')).find(el => el.innerText.includes('Isha'));
      if (isha) isha.click();
    `);
    await new Promise((r) => setTimeout(r, 1200));

    const upanishadMatchBadge = await evaluate(`
      const b = document.querySelector('[data-testid="match-scope-badge"]');
      return b ? b.innerText.trim() : 'NONE';
    `);
    console.log(`Live Isha Upanishad Match: "${upanishadMatchBadge}"`);
    await captureScreenshot('live_milestone_b_03_principal_upanishads_10.png');

    results.checks.push({
      test: 'Live Principal Upanishads (10 Mukhya Upanishads & Mahavakyas)',
      unitsCount: upanishadUnits.length,
      audioBadge: upanishadMatchBadge,
      status: upanishadUnits.length >= 10 && upanishadMatchBadge === 'Matching Audio' ? 'PASS' : 'FAIL',
    });

    // CHECK 5: Four Vedas (Rig, Sama, Yajur, Atharva)
    console.log(`\n--- LIVE: SWITCHING TO THE FOUR VEDAS ---`);
    await send('Page.navigate', { url: `${LIVE_BASE_URL}/?religion=hinduism&collection=vedas&v=${Date.now()}` }, sessionId);
    await new Promise((r) => setTimeout(r, 3000));

    const vedaUnits = await evaluate(`
      return Array.from(document.querySelectorAll('[id^="unit-"]')).map(el => {
        return {
          id: el.id,
          unitText: el.querySelector('.font-mono') ? el.querySelector('.font-mono').innerText : ''
        };
      });
    `);
    console.log(`Live Vedic Units loaded: ${vedaUnits.length}`);

    // Click Purusha Suktam
    await evaluate(`
      const purusha = document.querySelector('#unit-veda\\\\:purusha_sukta') || Array.from(document.querySelectorAll('[id^="unit-"]')).find(el => el.innerText.includes('Purusha'));
      if (purusha) purusha.click();
    `);
    await new Promise((r) => setTimeout(r, 1200));

    const vedaMatchBadge = await evaluate(`
      const b = document.querySelector('[data-testid="match-scope-badge"]');
      return b ? b.innerText.trim() : 'NONE';
    `);
    console.log(`Live Purusha Suktam Match: "${vedaMatchBadge}"`);
    await captureScreenshot('live_milestone_b_04_four_vedas.png');

    results.checks.push({
      test: 'Live The Four Vedas (Foundational Suktas & Vedic Chanting)',
      unitsCount: vedaUnits.length,
      audioBadge: vedaMatchBadge,
      status: vedaUnits.length >= 8 && vedaMatchBadge === 'Matching Audio' ? 'PASS' : 'FAIL',
    });

    // CHECK 6: The 18 Mahapuranas Matrix
    console.log(`\n--- LIVE: SWITCHING TO THE 18 MAHAPURANAS ---`);
    await send('Page.navigate', { url: `${LIVE_BASE_URL}/?religion=hinduism&collection=puranas&v=${Date.now()}` }, sessionId);
    await new Promise((r) => setTimeout(r, 3000));

    const puranaUnits = await evaluate(`
      return Array.from(document.querySelectorAll('[id^="unit-"]')).map(el => {
        return {
          id: el.id,
          unitText: el.querySelector('.font-mono') ? el.querySelector('.font-mono').innerText : ''
        };
      });
    `);
    console.log(`Live Purana Units loaded: ${puranaUnits.length}`);
    await captureScreenshot('live_milestone_b_05_18_mahapuranas.png');

    const hasPuranasMatrix = puranaUnits.some(u => u.id.includes('sattva') || u.unitText.includes('Sattvika')) &&
                             puranaUnits.some(u => u.id.includes('rajas') || u.unitText.includes('Rajasa')) &&
                             puranaUnits.some(u => u.id.includes('tamas') || u.unitText.includes('Tamasa'));
    results.checks.push({
      test: 'Live The 18 Mahapuranas (Classification & Classical Excerpts)',
      unitsCount: puranaUnits.length,
      hasMatrix: hasPuranasMatrix,
      status: puranaUnits.length >= 7 && hasPuranasMatrix ? 'PASS' : 'FAIL',
    });

    // CHECK 7: Scripture Coverage Modal (Hinduism)
    console.log(`\n--- LIVE: CHECKING SCRIPTURE COVERAGE MODAL ---`);
    await evaluate(`
      const modalBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Coverage') || b.title?.includes('Coverage') || b.innerText.includes('Transparency'));
      if (modalBtn) modalBtn.click();
    `);
    await new Promise((r) => setTimeout(r, 1200));

    await evaluate(`
      const hinTab = Array.from(document.querySelectorAll('[role="dialog"] button, .fixed.inset-0 button')).find(b => b.innerText.includes('Hinduism') || b.innerText.includes('सनातन'));
      if (hinTab) hinTab.click();
    `);
    await new Promise((r) => setTimeout(r, 1200));

    const coverageModalText = await evaluate(`
      const modal = document.querySelector('[role="dialog"]') || document.querySelector('.fixed.inset-0');
      return modal ? modal.innerText : '';
    `);
    await captureScreenshot('live_milestone_b_06_coverage_modal.png');

    const modalMentionsVedas = coverageModalText.includes('Four Vedas') || coverageModalText.includes('Rigveda');
    const modalMentionsUpanishads = coverageModalText.includes('Principal Upanishads') || coverageModalText.includes('Mahavakyas');
    const modalMentionsRamayana = coverageModalText.includes('Seven Kandas') || coverageModalText.includes('Ramayana');
    const modalMentionsPuranas = coverageModalText.includes('Mahapuranas');

    results.checks.push({
      test: 'Live Coverage Transparency Modal Audit (Hinduism)',
      mentionsVedas: modalMentionsVedas,
      mentionsUpanishads: modalMentionsUpanishads,
      mentionsRamayana: modalMentionsRamayana,
      mentionsPuranas: modalMentionsPuranas,
      status: modalMentionsVedas && modalMentionsUpanishads && modalMentionsRamayana && modalMentionsPuranas ? 'PASS' : 'FAIL',
    });

    console.log(`\n======================================================`);
    console.log(`ALL LIVE PRODUCTION MILESTONE B CHECKS COMPLETED`);
    console.log(`======================================================`);
    console.log(JSON.stringify(results, null, 2));

    fs.writeFileSync(path.join(ARTIFACT_DIR, 'milestone_b_live_results.json'), JSON.stringify(results, null, 2));

  } catch (err) {
    console.error('Live test execution error:', err);
    results.error = err.message;
  } finally {
    try { ws.close(); } catch (_) {}
    try { chrome.kill('SIGKILL'); } catch (_) {}
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (_) {}
  }
}

runLiveTest();
