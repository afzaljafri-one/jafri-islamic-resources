// ==============================================================================
// MILESTONE D VERIFICATION TEST SUITE — JAINISM CLASSICAL AGAMAS EXPANSION
// Tests Local Built Bundle (dist/) with Classical Agamas (Acaranga, Sutrakritanga),
// 45 Agamas Canonical Matrix, Uttaradhyayana Sutra (36 Sermons, Keshi-Gautama),
// Kalpa Sutra (Dreams, Diksha, Kevala Jnana, Nirvana), Tattvartha Sutra, Samayasara,
// Audio Synchronisation, and Coverage Transparency Modal Audit
// Jafri Sacred Library — Religious Readings & Sacred Audio
// ==============================================================================

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4177;
const BASE_URL = `http://127.0.0.1:${PORT}/jafri-islamic-resources`;
const DIST_DIR = path.resolve(__dirname, 'dist');
const ARTIFACT_DIR = '/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b';
const SCREENSHOT_DIR = path.join(ARTIFACT_DIR, 'phase4_milestone_d_evidence');
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
  const chromePort = 9415;
  const tempDir = '/tmp/chrome_milestone_d_' + Date.now();
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
    suite: 'Milestone D: Jainism Classical Agamas Expansion',
    checks: []
  };

  try {
    // CHECK 1: Title & Branding Check
    console.log(`\n--- CHECKING TITLE & BRANDING ---`);
    await send('Page.navigate', { url: `${BASE_URL}/?religion=jainism` }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const pageTitle = await evaluate(`document.title`);
    const pageBodyText = await evaluate(`document.body.innerText`);
    const hasZodiacBee = pageBodyText.toLowerCase().includes('zodiacbee') || pageTitle.toLowerCase().includes('zodiacbee');

    console.log(`Page Title: "${pageTitle}"`);
    console.log(`ZodiacBee detected: ${hasZodiacBee}`);

    results.checks.push({
      test: 'Title & Absence of ZodiacBee Branding',
      pageTitle,
      hasZodiacBee,
      status: pageTitle.includes('Jafri Sacred Library') && !hasZodiacBee ? 'PASS' : 'FAIL',
    });

    // CHECK 2: Classical Agamas (Acaranga & Sutrakritanga)
    console.log(`\n--- CHECKING CLASSICAL AGAMAS (ACARANGA & SUTRAKRITANGA) ---`);
    await send('Page.navigate', { url: `${BASE_URL}/?religion=jainism&collection=jain_agamas` }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const agamaUnits = await evaluate(`
      return Array.from(document.querySelectorAll('.font-mono')).map(el => el.innerText);
    `);
    console.log(`Agama units loaded: ${agamaUnits.length}`);
    agamaUnits.forEach((u, i) => console.log(`  [${i+1}] ${u}`));
    await captureScreenshot('milestone_d_01_classical_agamas.png');

    const hasShastraPariksha = agamaUnits.some(u => u.includes('1.1.1'));
    const hasAhimsa = agamaUnits.some(u => u.includes('1.5.5'));
    const hasIdentity = agamaUnits.some(u => u.includes('1.2.3'));
    const hasEquanimity = agamaUnits.some(u => u.includes('1.8.1'));
    const hasSamaya = agamaUnits.some(u => u.includes('Sutrakritanga 1.1.1'));
    const hasCompassion = agamaUnits.some(u => u.includes('Sutrakritanga 1.1.4'));

    results.checks.push({
      test: 'Classical Agamas (Acaranga 1.1.1, 1.5.5, 1.2.3, 1.8.1 & Sutrakritanga 1.1.1, 1.1.4)',
      unitsCount: agamaUnits.length,
      hasShastraPariksha,
      hasAhimsa,
      hasIdentity,
      hasEquanimity,
      hasSamaya,
      hasCompassion,
      status: agamaUnits.length >= 6 && hasShastraPariksha && hasAhimsa && hasIdentity && hasEquanimity && hasSamaya && hasCompassion ? 'PASS' : 'FAIL',
    });

    // CHECK 3: The 45 Agamas Canonical Matrix (Angas, Upangas, Chedasutras, Mulasutras, Digambara)
    console.log(`\n--- CHECKING 45 AGAMAS CANONICAL MATRIX ---`);
    await send('Page.navigate', { url: `${BASE_URL}/?religion=jainism&collection=agama_framework` }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const matrixUnits = await evaluate(`
      return Array.from(document.querySelectorAll('.font-mono')).map(el => el.innerText);
    `);
    console.log(`Matrix units loaded: ${matrixUnits.length}`);
    matrixUnits.forEach((u, i) => console.log(`  [${i+1}] ${u}`));
    await captureScreenshot('milestone_d_02_45_agamas_matrix.png');

    const hasStructure = matrixUnits.some(u => u.includes('Structure of the 45 Agamas'));
    const has12Angas = matrixUnits.some(u => u.includes('The 12 Primary Angas'));
    const hasUpangas = matrixUnits.some(u => u.includes('Upangas & Chedasutras'));
    const hasMulasutras = matrixUnits.some(u => u.includes('Mulasutras & Culikasutras'));
    const hasDigambara = matrixUnits.some(u => u.includes('Digambara Canonical Authorities'));

    results.checks.push({
      test: '45 Agamas Canonical Matrix (12 Angas, 12 Upangas, 6 Chedasutras, 4 Mulasutras, Digambara Shatkhandagama)',
      unitsCount: matrixUnits.length,
      hasStructure,
      has12Angas,
      hasUpangas,
      hasMulasutras,
      hasDigambara,
      status: matrixUnits.length >= 5 && hasStructure && has12Angas && hasUpangas && hasMulasutras && hasDigambara ? 'PASS' : 'FAIL',
    });

    // CHECK 4: Uttaradhyayana Sutra (The 36 Final Sermons & Keshi-Gautama Reconciliation)
    console.log(`\n--- CHECKING UTTARADHYAYANA SUTRA ---`);
    await send('Page.navigate', { url: `${BASE_URL}/?religion=jainism&collection=uttaradhyayana` }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const uttarUnits = await evaluate(`
      return Array.from(document.querySelectorAll('.font-mono')).map(el => el.innerText);
    `);
    console.log(`Uttaradhyayana units loaded: ${uttarUnits.length}`);
    uttarUnits.forEach((u, i) => console.log(`  [${i+1}] ${u}`));
    await captureScreenshot('milestone_d_03_uttaradhyayana_sutra.png');

    const hasVinaya = uttarUnits.some(u => u.includes('Adhyayana 1.1'));
    const hasNami = uttarUnits.some(u => u.includes('Nami Pravrajya'));
    const hasWitheredLeaf = uttarUnits.some(u => u.includes('Druma-patraka'));
    const hasKeshiGautama = uttarUnits.some(u => u.includes('Keshi-Gautama'));
    const hasJivaAjiva = uttarUnits.some(u => u.includes('Jiva-Ajiva'));

    results.checks.push({
      test: 'Uttaradhyayana Sutra (Ch 1 Vinaya, Ch 9 Nami, Ch 10 Withered Leaf, Ch 23 Keshi-Gautama, Ch 36 Jiva-Ajiva)',
      unitsCount: uttarUnits.length,
      hasVinaya,
      hasNami,
      hasWitheredLeaf,
      hasKeshiGautama,
      hasJivaAjiva,
      status: uttarUnits.length >= 6 && hasVinaya && hasNami && hasWitheredLeaf && hasKeshiGautama && hasJivaAjiva ? 'PASS' : 'FAIL',
    });

    // CHECK 5: Kalpa Sutra of Bhadrabahu (Dreams, Diksha, Kevala Jnana, Nirvana)
    console.log(`\n--- CHECKING KALPA SUTRA ---`);
    await send('Page.navigate', { url: `${BASE_URL}/?religion=jainism&collection=kalpasutra` }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const kalpaUnits = await evaluate(`
      return Array.from(document.querySelectorAll('.font-mono')).map(el => el.innerText);
    `);
    console.log(`Kalpa Sutra units loaded: ${kalpaUnits.length}`);
    kalpaUnits.forEach((u, i) => console.log(`  [${i+1}] ${u}`));
    await captureScreenshot('milestone_d_04_kalpa_sutra.png');

    const hasDreams = kalpaUnits.some(u => u.includes('Trishala’s Dreams') || u.includes('Section 1'));
    const hasDiksha = kalpaUnits.some(u => u.includes('Mahavira Diksha') || u.includes('Section 2'));
    const hasKevala = kalpaUnits.some(u => u.includes('Kevala Jnana') || u.includes('Section 3'));
    const hasNirvana = kalpaUnits.some(u => u.includes('Mahavira Nirvana') || u.includes('Section 4'));

    results.checks.push({
      test: 'Kalpa Sutra (Section 1 Dreams, Section 2 Diksha, Section 3 Kevala Jnana, Section 4 Nirvana)',
      unitsCount: kalpaUnits.length,
      hasDreams,
      hasDiksha,
      hasKevala,
      hasNirvana,
      status: kalpaUnits.length >= 4 && hasDreams && hasDiksha && hasKevala && hasNirvana ? 'PASS' : 'FAIL',
    });

    // CHECK 6: Tattvartha Sutra & Samayasara
    console.log(`\n--- CHECKING TATTVARTHA SUTRA & SAMAYASARA ---`);
    await send('Page.navigate', { url: `${BASE_URL}/?religion=jainism&collection=tirthankar_teachings` }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const tattvarthaUnits = await evaluate(`
      return Array.from(document.querySelectorAll('.font-mono')).map(el => el.innerText);
    `);
    console.log(`Tattvartha & Philosophy units loaded: ${tattvarthaUnits.length}`);
    tattvarthaUnits.forEach((u, i) => console.log(`  [${i+1}] ${u}`));
    await captureScreenshot('milestone_d_05_tattvartha_and_philosophy.png');

    const hasRatnatraya = tattvarthaUnits.some(u => u.includes('1.1'));
    const hasSevenTattvas = tattvarthaUnits.some(u => u.includes('1.4'));
    const hasFiveBhavas = tattvarthaUnits.some(u => u.includes('2.1'));
    const hasParasparopagraho = tattvarthaUnits.some(u => u.includes('5.21'));
    const hasFiveVows = tattvarthaUnits.some(u => u.includes('7.1'));
    const hasSamvara = tattvarthaUnits.some(u => u.includes('9.1'));
    const hasSamayasara = tattvarthaUnits.some(u => u.includes('Samayasara'));
    const has24Tirthankaras = tattvarthaUnits.some(u => u.includes('24 Tirthankaras'));

    results.checks.push({
      test: 'Tattvartha Sutra (1.1, 1.4, 2.1, 5.21, 7.1, 9.1), Samayasara (Gatha 1) & 24 Tirthankaras Matrix',
      unitsCount: tattvarthaUnits.length,
      hasRatnatraya,
      hasSevenTattvas,
      hasFiveBhavas,
      hasParasparopagraho,
      hasFiveVows,
      hasSamvara,
      hasSamayasara,
      has24Tirthankaras,
      status: tattvarthaUnits.length >= 8 && hasRatnatraya && hasSevenTattvas && hasFiveBhavas && hasParasparopagraho && hasFiveVows && hasSamvara && hasSamayasara && has24Tirthankaras ? 'PASS' : 'FAIL',
    });

    // CHECK 7: Audio Synchronisation & Coverage Modal Audit
    console.log(`\n--- CHECKING AUDIO SYNCHRONISATION (NAVKAR) ---`);
    await send('Page.navigate', { url: `${BASE_URL}/?religion=jainism&collection=navkar` }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const navkarBadge = await evaluate(`
      const b = document.querySelector('[data-testid="match-scope-badge"]');
      return b ? b.innerText.trim() : 'NONE';
    `);
    console.log(`Navkar Audio Match Badge: "${navkarBadge}"`);
    await captureScreenshot('milestone_d_06_navkar_audio_match.png');

    console.log(`\n--- CHECKING SCRIPTURE COVERAGE MODAL (JAINISM) ---`);
    await evaluate(`
      const modalBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Coverage') || b.title?.includes('Coverage') || b.innerText.includes('Transparency'));
      if (modalBtn) modalBtn.click();
    `);
    await new Promise((r) => setTimeout(r, 1200));

    await evaluate(`
      const jaiTab = Array.from(document.querySelectorAll('[role="dialog"] button, .fixed.inset-0 button')).find(b => b.innerText.includes('Jainism') || b.innerText.includes('जैन धर्म') || b.innerText.includes('जिणसासण'));
      if (jaiTab) jaiTab.click();
    `);
    await new Promise((r) => setTimeout(r, 1200));

    const coverageModalText = await evaluate(`
      const modal = document.querySelector('[role="dialog"]') || document.querySelector('.fixed.inset-0');
      return modal ? modal.innerText : '';
    `);
    console.log(`Jainism Coverage Modal Text Length: ${coverageModalText.length}`);
    await captureScreenshot('milestone_d_07_coverage_modal_jainism.png');

    const modalMentions45Agamas = coverageModalText.includes('45 Agamas') || coverageModalText.includes('४५');
    const modalMentionsAngas = coverageModalText.includes('12 Angas') || coverageModalText.includes('Acaranga');
    const modalMentionsDigambara = coverageModalText.includes('Digambara') || coverageModalText.includes('Shatkhandagama');
    const modalMentionsJacobi = coverageModalText.includes('Hermann Jacobi');

    results.checks.push({
      test: 'Audio Linkage (Navkar) & Coverage Transparency Modal Audit (Jainism)',
      audioBadge: navkarBadge,
      mentions45Agamas: modalMentions45Agamas,
      mentionsAngas: modalMentionsAngas,
      mentionsDigambara: modalMentionsDigambara,
      mentionsJacobi: modalMentionsJacobi,
      status: navkarBadge === 'Matching Audio' && modalMentions45Agamas && modalMentionsAngas && modalMentionsDigambara && modalMentionsJacobi ? 'PASS' : 'FAIL',
    });

    console.log(`\n======================================================`);
    console.log(`ALL MILESTONE D VERIFICATION CHECKS COMPLETED`);
    console.log(`======================================================`);
    console.log(JSON.stringify(results, null, 2));

    fs.writeFileSync(path.join(ARTIFACT_DIR, 'milestone_d_test_results.json'), JSON.stringify(results, null, 2));

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
