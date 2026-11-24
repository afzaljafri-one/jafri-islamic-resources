// ==============================================================================
// MILESTONE B VERIFICATION TEST SUITE — HINDUISM CONTENT EXPANSION
// Tests Local Built Bundle (dist/) with Four Vedas, 10 Principal Upanishads,
// Valmiki Ramayana (All 7 Kandas), and 18 Mahapuranas Structured Matrix
// Jafri Sacred Library — Religious Readings & Sacred Audio
// ==============================================================================

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4175;
const BASE_URL = `http://127.0.0.1:${PORT}/jafri-islamic-resources`;
const DIST_DIR = path.resolve(__dirname, 'dist');
const ARTIFACT_DIR = '/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b';
const SCREENSHOT_DIR = path.join(ARTIFACT_DIR, 'phase4_milestone_b_evidence');
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

function startStaticServer() {
  const server = http.createServer((req, res) => {
    let reqPath = req.url.split('?')[0];
    if (reqPath.startsWith('/jafri-islamic-resources/')) {
      reqPath = reqPath.replace('/jafri-islamic-resources/', '/');
    }
    if (reqPath === '/' || reqPath === '') {
      reqPath = '/index.html';
    }

    let filePath = path.join(DIST_DIR, reqPath);
    if (!fs.existsSync(filePath)) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.css': 'text/css',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff2': 'font/woff2',
      '.woff': 'font/woff',
      '.ttf': 'font/ttf',
    };

    const contentType = mimeTypes[ext] || 'application/octet-stream';
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
      const data = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    } catch (e) {
      res.writeHead(404);
      res.end('Not found');
    }
  });

  return new Promise((resolve) => {
    server.listen(PORT, '127.0.0.1', () => {
      console.log(`[Preview Server] Serving dist/ on http://127.0.0.1:${PORT}`);
      resolve(server);
    });
  });
}

async function runTest() {
  const server = await startStaticServer();
  const chromePort = 9401;
  const tempDir = '/tmp/chrome_milestone_b_' + Date.now();
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
    server.close();
    process.exit(1);
  }

  console.log('[CDP] Connected to Chrome Browser:', wsUrl);
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
    console.log(`[Screenshot Saved] ${filename} (${buf.length} bytes)`);
  }

  const results = {
    testDate: new Date().toISOString(),
    milestone: 'Milestone B — Hinduism Content Expansion',
    checks: [],
  };

  try {
    console.log(`\n--- NAVIGATING TO HINDUISM MODULE ---`);
    await send('Page.navigate', { url: `${BASE_URL}/?religion=hinduism` }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    // CHECK 1: Title and Branding
    const pageTitle = await evaluate(`document.title`);
    const hasZodiacBee = await evaluate(`document.body.innerText.toLowerCase().includes('zodiacbee')`);
    console.log(`Page Title: "${pageTitle}"`);
    console.log(`Has ZodiacBee Branding: ${hasZodiacBee}`);
    results.checks.push({
      test: 'Title & Branding Verification',
      title: pageTitle,
      cleanOfZodiacBee: !hasZodiacBee,
      status: pageTitle === 'Jafri Sacred Library — Religious Readings & Sacred Audio' && !hasZodiacBee ? 'PASS' : 'FAIL',
    });

    // CHECK 2: Bhagavad Gita Chapter 1 & 2
    const gitaChapterTitle = await evaluate(`
      const heading = document.querySelector('h1, h2, h3');
      return heading ? heading.innerText : '';
    `);
    const gitaShlokaCount = await evaluate(`
      return document.querySelectorAll('[id^="shloka-"]').length;
    `);
    console.log(`Bhagavad Gita Loaded. Shlokas: ${gitaShlokaCount}`);
    await captureScreenshot('milestone_b_01_gita_ch1.png');
    results.checks.push({
      test: 'Bhagavad Gita Chapter 1 Rendering',
      shlokaCount: gitaShlokaCount,
      status: gitaShlokaCount === 47 ? 'PASS' : 'FAIL',
    });

    // CHECK 3: Valmiki Ramayana (All 7 Kandas)
    console.log(`\n--- SWITCHING TO VALMIKI RAMAYANA ---`);
    await send('Page.navigate', { url: `${BASE_URL}/?religion=hinduism&collection=valmiki_ramayana` }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const ramayanaUnits = await evaluate(`
      return Array.from(document.querySelectorAll('[id^="unit-"]')).map(el => {
        const text = el.innerText;
        return {
          id: el.id,
          title: el.querySelector('.text-gold-400') ? el.querySelector('.text-gold-400').innerText : '',
          preview: text.substring(0, 80).replace(/\\n/g, ' ')
        };
      });
    `);
    console.log(`Valmiki Ramayana Units loaded: ${ramayanaUnits.length}`);
    ramayanaUnits.forEach((u, i) => console.log(`  [${i+1}] ${u.id}: ${u.title}`));

    // Click Yuddha Kanda / Aditya Hridaya unit to verify Level 1 audio match
    const adityaHridayaClicked = await evaluate(`
      const targetUnit = document.querySelector('[id*="yuddha_kanda"]') || Array.from(document.querySelectorAll('[id^="unit-"]')).find(el => el.id.includes('yuddha'));
      if (targetUnit) {
        targetUnit.click();
        return true;
      }
      return false;
    `);
    await new Promise((r) => setTimeout(r, 1000));

    const ramayanaMatchBadge = await evaluate(`
      const b = document.querySelector('[data-testid="match-scope-badge"]');
      return b ? b.innerText.trim() : 'NONE';
    `);
    const ramayanaTrackTitle = await evaluate(`
      const t = document.querySelector('[data-testid="active-track-title"]');
      return t ? t.innerText.trim() : 'NONE';
    `);
    console.log(`Aditya Hridaya Audio Match Badge: "${ramayanaMatchBadge}", Track: "${ramayanaTrackTitle}"`);
    await captureScreenshot('milestone_b_02_valmiki_ramayana_7_kandas.png');

    const hasAll7Kandas = ramayanaUnits.length >= 7;
    results.checks.push({
      test: 'Valmiki Ramayana (All 7 Kandas & Audio Linkage)',
      unitsCount: ramayanaUnits.length,
      has7Kandas: hasAll7Kandas,
      audioBadge: ramayanaMatchBadge,
      trackTitle: ramayanaTrackTitle,
      status: hasAll7Kandas && ramayanaMatchBadge === 'Matching Audio' ? 'PASS' : 'FAIL',
    });

    // CHECK 4: Principal Upanishads (10 Mukhya Upanishads & 4 Mahavakyas)
    console.log(`\n--- SWITCHING TO PRINCIPAL UPANISHADS ---`);
    await send('Page.navigate', { url: `${BASE_URL}/?religion=hinduism&collection=principal_upanishads` }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const upanishadUnits = await evaluate(`
      return Array.from(document.querySelectorAll('[id^="unit-"]')).map(el => {
        return {
          id: el.id,
          unitText: el.querySelector('.font-mono') ? el.querySelector('.font-mono').innerText : '',
          title: el.querySelector('.text-slate-400') ? el.querySelector('.text-slate-400').innerText : ''
        };
      });
    `);
    console.log(`Principal Upanishads loaded: ${upanishadUnits.length}`);
    upanishadUnits.forEach((u, i) => console.log(`  [${i+1}] ${u.id}: ${u.unitText} — ${u.title}`));

    // Click Isha Upanishad to verify audio match
    await evaluate(`
      const isha = document.querySelector('#unit-isha\\\\:1') || Array.from(document.querySelectorAll('[id^="unit-"]')).find(el => el.innerText.includes('Isha'));
      if (isha) isha.click();
    `);
    await new Promise((r) => setTimeout(r, 1000));

    const upanishadMatchBadge = await evaluate(`
      const b = document.querySelector('[data-testid="match-scope-badge"]');
      return b ? b.innerText.trim() : 'NONE';
    `);
    console.log(`Isha Upanishad Audio Match: "${upanishadMatchBadge}"`);
    await captureScreenshot('milestone_b_03_principal_upanishads_10.png');

    const has10Upanishads = upanishadUnits.length >= 10;
    results.checks.push({
      test: 'Principal Upanishads (10 Mukhya Upanishads & Mahavakyas)',
      unitsCount: upanishadUnits.length,
      has10Upanishads,
      audioBadge: upanishadMatchBadge,
      status: has10Upanishads && upanishadMatchBadge === 'Matching Audio' ? 'PASS' : 'FAIL',
    });

    // CHECK 5: Four Vedas (Rig, Sama, Yajur, Atharva)
    console.log(`\n--- SWITCHING TO THE FOUR VEDAS ---`);
    await send('Page.navigate', { url: `${BASE_URL}/?religion=hinduism&collection=vedas` }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const vedaUnits = await evaluate(`
      return Array.from(document.querySelectorAll('[id^="unit-"]')).map(el => {
        return {
          id: el.id,
          unitText: el.querySelector('.font-mono') ? el.querySelector('.font-mono').innerText : '',
          title: el.querySelector('.text-slate-400') ? el.querySelector('.text-slate-400').innerText : '',
          hasPlayBtn: Boolean(el.querySelector('button[data-testid^="play-unit-"]'))
        };
      });
    `);
    console.log(`Vedic Units loaded: ${vedaUnits.length}`);
    vedaUnits.forEach((u, i) => console.log(`  [${i+1}] ${u.id}: ${u.unitText} — ${u.title} (Play: ${u.hasPlayBtn})`));

    // Click Purusha Suktam
    await evaluate(`
      const purusha = document.querySelector('#unit-veda\\\\:purusha_sukta') || Array.from(document.querySelectorAll('[id^="unit-"]')).find(el => el.innerText.includes('Purusha'));
      if (purusha) purusha.click();
    `);
    await new Promise((r) => setTimeout(r, 1000));

    const vedaMatchBadge = await evaluate(`
      const b = document.querySelector('[data-testid="match-scope-badge"]');
      return b ? b.innerText.trim() : 'NONE';
    `);
    console.log(`Purusha Suktam Audio Match: "${vedaMatchBadge}"`);
    await captureScreenshot('milestone_b_04_four_vedas.png');

    results.checks.push({
      test: 'The Four Vedas (Foundational Suktas & Vedic Chanting)',
      unitsCount: vedaUnits.length,
      hasFourVedas: vedaUnits.length >= 8,
      audioBadge: vedaMatchBadge,
      status: vedaUnits.length >= 8 && vedaMatchBadge === 'Matching Audio' ? 'PASS' : 'FAIL',
    });

    // CHECK 6: The 18 Mahapuranas Matrix
    console.log(`\n--- SWITCHING TO THE 18 MAHAPURANAS ---`);
    await send('Page.navigate', { url: `${BASE_URL}/?religion=hinduism&collection=puranas` }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const puranaUnits = await evaluate(`
      return Array.from(document.querySelectorAll('[id^="unit-"]')).map(el => {
        return {
          id: el.id,
          unitText: el.querySelector('.font-mono') ? el.querySelector('.font-mono').innerText : '',
          title: el.querySelector('.text-slate-400') ? el.querySelector('.text-slate-400').innerText : ''
        };
      });
    `);
    console.log(`Purana Units loaded: ${puranaUnits.length}`);
    puranaUnits.forEach((u, i) => console.log(`  [${i+1}] ${u.id}: ${u.unitText} — ${u.title}`));
    await captureScreenshot('milestone_b_05_18_mahapuranas.png');

    const hasPuranasMatrix = puranaUnits.some(u => u.id.includes('sattva') || u.unitText.includes('Sattvika')) &&
                             puranaUnits.some(u => u.id.includes('rajas') || u.unitText.includes('Rajasa')) &&
                             puranaUnits.some(u => u.id.includes('tamas') || u.unitText.includes('Tamasa'));
    results.checks.push({
      test: 'The 18 Mahapuranas (Classification & Classical Excerpts)',
      unitsCount: puranaUnits.length,
      hasMatrix: hasPuranasMatrix,
      status: puranaUnits.length >= 7 && hasPuranasMatrix ? 'PASS' : 'FAIL',
    });

    // CHECK 7: Scripture Coverage Modal (Hinduism Audit)
    console.log(`\n--- CHECKING SCRIPTURE COVERAGE MODAL ---`);
    await evaluate(`
      const modalBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Coverage') || b.title?.includes('Coverage') || b.innerText.includes('Transparency'));
      if (modalBtn) modalBtn.click();
    `);
    await new Promise((r) => setTimeout(r, 1200));

    // Click Hinduism tab in the modal
    await evaluate(`
      const hinTab = Array.from(document.querySelectorAll('[role="dialog"] button, .fixed.inset-0 button')).find(b => b.innerText.includes('Hinduism') || b.innerText.includes('सनातन'));
      if (hinTab) hinTab.click();
    `);
    await new Promise((r) => setTimeout(r, 1200));

    const coverageModalText = await evaluate(`
      const modal = document.querySelector('[role="dialog"]') || document.querySelector('.fixed.inset-0');
      return modal ? modal.innerText : '';
    `);
    console.log(`Coverage Modal Length: ${coverageModalText.length}`);
    await captureScreenshot('milestone_b_06_coverage_modal_hinduism.png');

    const modalMentionsVedas = coverageModalText.includes('Four Vedas') || coverageModalText.includes('Rigveda');
    const modalMentionsUpanishads = coverageModalText.includes('Principal Upanishads') || coverageModalText.includes('Mahavakyas');
    const modalMentionsRamayana = coverageModalText.includes('Seven Kandas') || coverageModalText.includes('Ramayana');
    const modalMentionsPuranas = coverageModalText.includes('Mahapuranas');

    results.checks.push({
      test: 'Coverage Transparency Modal Audit (Hinduism)',
      mentionsVedas: modalMentionsVedas,
      mentionsUpanishads: modalMentionsUpanishads,
      mentionsRamayana: modalMentionsRamayana,
      mentionsPuranas: modalMentionsPuranas,
      status: modalMentionsVedas && modalMentionsUpanishads && modalMentionsRamayana && modalMentionsPuranas ? 'PASS' : 'FAIL',
    });

    console.log(`\n======================================================`);
    console.log(`ALL MILESTONE B VERIFICATION CHECKS COMPLETED`);
    console.log(`======================================================`);
    console.log(JSON.stringify(results, null, 2));

    fs.writeFileSync(path.join(ARTIFACT_DIR, 'milestone_b_test_results.json'), JSON.stringify(results, null, 2));

  } catch (err) {
    console.error('Test execution error:', err);
    results.error = err.message;
  } finally {
    try { ws.close(); } catch (_) {}
    try { chrome.kill('SIGKILL'); } catch (_) {}
    try { server.close(); } catch (_) {}
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (_) {}
  }
}

runTest();
