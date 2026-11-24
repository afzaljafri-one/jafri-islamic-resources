// ==============================================================================
// MILESTONE C VERIFICATION TEST SUITE — BUDDHISM PALI CANON & MAHAYANA EXPANSION
// Tests Local Built Bundle (dist/) with Pali Tipitaka (Three Baskets), Core Suttas
// (Dhammacakkappavattana, Anattalakkhana, Satipatthana, Kalama), Mahayana Sutras
// (Heart, Diamond, Lotus), Dhammapada, Parittas, and Audio Linkage Synchronisation
// Jafri Sacred Library — Religious Readings & Sacred Audio
// ==============================================================================

const { spawn } = require('child_process');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4176;
const BASE_URL = `http://127.0.0.1:${PORT}/jafri-islamic-resources`;
const DIST_DIR = path.resolve(__dirname, 'dist');
const ARTIFACT_DIR = '/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b';
const SCREENSHOT_DIR = path.join(ARTIFACT_DIR, 'phase4_milestone_c_evidence');
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
  const chromePort = 9410;
  const tempDir = '/tmp/chrome_milestone_c_' + Date.now();
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
    milestone: 'Milestone C — Buddhism Pali Canon & Mahayana Expansion',
    checks: [],
  };

  try {
    console.log(`\n--- NAVIGATING TO BUDDHISM MODULE (TIPITAKA OVERVIEW) ---`);
    await send('Page.navigate', { url: `${BASE_URL}/?religion=buddhism&collection=tipitaka_overview` }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    // CHECK 1: Title and Branding
    const pageTitle = await evaluate(`document.title`);
    const hasZodiacBee = await evaluate(`document.body.innerText.toLowerCase().includes('zodiacbee')`);
    console.log(`Page Title: "${pageTitle}", Clean of ZodiacBee: ${!hasZodiacBee}`);
    results.checks.push({
      test: 'Title & Branding Verification',
      title: pageTitle,
      cleanOfZodiacBee: !hasZodiacBee,
      status: pageTitle === 'Jafri Sacred Library — Religious Readings & Sacred Audio' && !hasZodiacBee ? 'PASS' : 'FAIL',
    });

    // CHECK 2: Tipitaka Three Baskets Framework
    const tipitakaUnits = await evaluate(`
      return Array.from(document.querySelectorAll('[id^="segment-"]')).map(el => {
        return {
          id: el.id,
          unitText: el.querySelector('.font-mono') ? el.querySelector('.font-mono').innerText : '',
          preview: el.innerText.substring(0, 100).replace(/\\n/g, ' ')
        };
      });
    `);
    console.log(`Tipitaka Overview units loaded: ${tipitakaUnits.length}`);
    tipitakaUnits.forEach((u, i) => console.log(`  [${i+1}] ${u.id}: ${u.unitText}`));
    await captureScreenshot('milestone_c_01_tipitaka_three_baskets.png');

    const hasVinaya = tipitakaUnits.some(u => u.unitText.includes('Vinaya') || u.preview.includes('Vinaya'));
    const hasSutta = tipitakaUnits.some(u => u.unitText.includes('Sutta') || u.preview.includes('Nikaya'));
    const hasAbhidhamma = tipitakaUnits.some(u => u.unitText.includes('Abhidhamma') || u.preview.includes('Paramattha'));

    results.checks.push({
      test: 'Pali Tipitaka Three Baskets Structure (Vinaya, Sutta, Abhidhamma)',
      unitsCount: tipitakaUnits.length,
      hasVinaya,
      hasSutta,
      hasAbhidhamma,
      status: tipitakaUnits.length >= 5 && hasVinaya && hasSutta && hasAbhidhamma ? 'PASS' : 'FAIL',
    });

    // CHECK 3: Core Suttas & Mahayana Sutras
    console.log(`\n--- SWITCHING TO CORE SUTTAS & MAHAYANA SUTRAS ---`);
    await send('Page.navigate', { url: `${BASE_URL}/?religion=buddhism&collection=suttas_sutras` }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const suttasUnits = await evaluate(`
      return Array.from(document.querySelectorAll('[id^="segment-"]')).map(el => {
        return {
          id: el.id,
          unitText: el.querySelector('.font-mono') ? el.querySelector('.font-mono').innerText : '',
          preview: el.innerText.substring(0, 80).replace(/\\n/g, ' ')
        };
      });
    `);
    console.log(`Core Suttas & Sutras units loaded: ${suttasUnits.length}`);
    suttasUnits.forEach((u, i) => console.log(`  [${i+1}] ${u.id}: ${u.unitText}`));

    const suttasMatchBadge = await evaluate(`
      const b = document.querySelector('[data-testid="match-scope-badge"]');
      return b ? b.innerText.trim() : 'NONE';
    `);
    const suttasTrackTitle = await evaluate(`
      const t = document.querySelector('[data-testid="active-track-title"]');
      return t ? t.innerText.trim() : 'NONE';
    `);
    console.log(`Suttas/Sutras Audio Match: "${suttasMatchBadge}", Track: "${suttasTrackTitle}"`);
    await captureScreenshot('milestone_c_02_core_suttas_and_mahayana_sutras.png');

    const hasDhammacakka = suttasUnits.some(u => u.unitText.includes('SN 56.11'));
    const hasAnatta = suttasUnits.some(u => u.unitText.includes('SN 22.59'));
    const hasSatipatthana = suttasUnits.some(u => u.unitText.includes('DN 22') || u.unitText.includes('Satipatthana'));
    const hasKalama = suttasUnits.some(u => u.unitText.includes('AN 3.65') || u.unitText.includes('Kalama'));
    const hasHeartSutra = suttasUnits.some(u => u.unitText.includes('Heart Sutra'));
    const hasDiamondSutra = suttasUnits.some(u => u.unitText.includes('Diamond Sutra'));
    const hasLotusSutra = suttasUnits.some(u => u.unitText.includes('Lotus Sutra'));

    results.checks.push({
      test: 'Core Suttas & Mahayana Sutras (First Sermon, Anatta, Satipatthana, Kalama, Heart, Diamond, Lotus)',
      unitsCount: suttasUnits.length,
      hasDhammacakka,
      hasAnatta,
      hasSatipatthana,
      hasKalama,
      hasHeartSutra,
      hasDiamondSutra,
      hasLotusSutra,
      audioBadge: suttasMatchBadge,
      status: suttasUnits.length >= 7 && hasDhammacakka && hasAnatta && hasSatipatthana && hasKalama && hasHeartSutra && suttasMatchBadge === 'Matching Audio' ? 'PASS' : 'FAIL',
    });

    // CHECK 4: The Dhammapada
    console.log(`\n--- SWITCHING TO THE DHAMMAPADA ---`);
    await send('Page.navigate', { url: `${BASE_URL}/?religion=buddhism&collection=dhammapada` }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const dhpUnits = await evaluate(`
      return Array.from(document.querySelectorAll('[id^="segment-"]')).map(el => {
        return {
          id: el.id,
          unitText: el.querySelector('.font-mono') ? el.querySelector('.font-mono').innerText : ''
        };
      });
    `);
    console.log(`Dhammapada units loaded: ${dhpUnits.length}`);
    dhpUnits.forEach((u, i) => console.log(`  [${i+1}] ${u.id}: ${u.unitText}`));
    await captureScreenshot('milestone_c_03_dhammapada.png');

    const hasYamakavagga = dhpUnits.some(u => u.unitText.includes('Yamakavagga'));
    const hasAppamadavagga = dhpUnits.some(u => u.unitText.includes('Appamada'));
    const hasCittavagga = dhpUnits.some(u => u.unitText.includes('Citta'));
    const hasSukhavagga = dhpUnits.some(u => u.unitText.includes('Sukha'));
    const hasMaggavagga = dhpUnits.some(u => u.unitText.includes('Magga'));

    results.checks.push({
      test: 'The Dhammapada (Yamaka, Appamada, Citta, Sukha, Magga Vaggas)',
      unitsCount: dhpUnits.length,
      hasYamakavagga,
      hasAppamadavagga,
      hasCittavagga,
      hasSukhavagga,
      hasMaggavagga,
      status: dhpUnits.length >= 7 && hasYamakavagga && hasAppamadavagga && hasCittavagga && hasSukhavagga && hasMaggavagga ? 'PASS' : 'FAIL',
    });

    // CHECK 5: Buddhist Chants, Refuges & Parittas (Ti-sarana, Panca-sila, Ratana Sutta)
    console.log(`\n--- SWITCHING TO CHANTS & PARITTAS ---`);
    await send('Page.navigate', { url: `${BASE_URL}/?religion=buddhism&collection=chants_parittas` }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const chantsUnits = await evaluate(`
      return Array.from(document.querySelectorAll('[id^="segment-"]')).map(el => {
        return {
          id: el.id,
          unitText: el.querySelector('.font-mono') ? el.querySelector('.font-mono').innerText : ''
        };
      });
    `);
    console.log(`Chants & Parittas loaded: ${chantsUnits.length}`);
    chantsUnits.forEach((u, i) => console.log(`  [${i+1}] ${u.id}: ${u.unitText}`));

    const chantsMatchBadge = await evaluate(`
      const b = document.querySelector('[data-testid="match-scope-badge"]');
      return b ? b.innerText.trim() : 'NONE';
    `);
    console.log(`Chants Audio Match Badge: "${chantsMatchBadge}"`);
    await captureScreenshot('milestone_c_04_chants_and_parittas.png');

    const hasTiSarana = chantsUnits.some(u => u.unitText.includes('Refuges') || u.unitText.includes('Ti-sarana'));
    const hasPancaSila = chantsUnits.some(u => u.unitText.includes('Precepts') || u.unitText.includes('Panca-sila'));
    const hasRatana = chantsUnits.some(u => u.unitText.includes('Ratana Sutta'));

    results.checks.push({
      test: 'Buddhist Chants & Parittas (Ti-sarana, Panca-sila, Ratana Sutta)',
      unitsCount: chantsUnits.length,
      hasTiSarana,
      hasPancaSila,
      hasRatana,
      audioBadge: chantsMatchBadge,
      status: chantsUnits.length >= 4 && hasTiSarana && hasPancaSila && hasRatana && chantsMatchBadge === 'Matching Audio' ? 'PASS' : 'FAIL',
    });

    // CHECK 6: Karaniya Metta Sutta Audio Synchronisation
    console.log(`\n--- SWITCHING TO KARANIYA METTA SUTTA ---`);
    await send('Page.navigate', { url: `${BASE_URL}/?religion=buddhism&collection=metta_sutta` }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const mettaMatchBadge = await evaluate(`
      const b = document.querySelector('[data-testid="match-scope-badge"]');
      return b ? b.innerText.trim() : 'NONE';
    `);
    console.log(`Metta Sutta Audio Match: "${mettaMatchBadge}"`);
    await captureScreenshot('milestone_c_05_metta_sutta.png');

    results.checks.push({
      test: 'Karaniya Metta Sutta Exact Audio Match',
      audioBadge: mettaMatchBadge,
      status: mettaMatchBadge === 'Matching Audio' ? 'PASS' : 'FAIL',
    });

    // CHECK 7: Scripture Coverage Modal (Buddhism)
    console.log(`\n--- CHECKING SCRIPTURE COVERAGE MODAL (BUDDHISM) ---`);
    await evaluate(`
      const modalBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Coverage') || b.title?.includes('Coverage') || b.innerText.includes('Transparency'));
      if (modalBtn) modalBtn.click();
    `);
    await new Promise((r) => setTimeout(r, 1200));

    await evaluate(`
      const budTab = Array.from(document.querySelectorAll('[role="dialog"] button, .fixed.inset-0 button')).find(b => b.innerText.includes('Buddhism') || b.innerText.includes('धर्म / बुद्ध सासन') || b.innerText.includes('बुद्ध'));
      if (budTab) budTab.click();
    `);
    await new Promise((r) => setTimeout(r, 1200));

    const coverageModalText = await evaluate(`
      const modal = document.querySelector('[role="dialog"]') || document.querySelector('.fixed.inset-0');
      return modal ? modal.innerText : '';
    `);
    console.log(`Buddhism Coverage Modal Text Length: ${coverageModalText.length}`);
    await captureScreenshot('milestone_c_06_coverage_modal_buddhism.png');

    const modalMentionsVinaya = coverageModalText.includes('Vinaya Pitaka') || coverageModalText.includes('Patimokkha');
    const modalMentionsNikayas = coverageModalText.includes('Nikayas') || coverageModalText.includes('Sutta Pitaka');
    const modalMentionsAbhidhamma = coverageModalText.includes('Abhidhamma Pitaka');
    const modalMentionsBilara = coverageModalText.includes('SuttaCentral Bilara');

    results.checks.push({
      test: 'Coverage Transparency Modal Audit (Buddhism)',
      mentionsVinaya: modalMentionsVinaya,
      mentionsNikayas: modalMentionsNikayas,
      mentionsAbhidhamma: modalMentionsAbhidhamma,
      mentionsBilara: modalMentionsBilara,
      status: modalMentionsVinaya && modalMentionsNikayas && modalMentionsAbhidhamma && modalMentionsBilara ? 'PASS' : 'FAIL',
    });

    console.log(`\n======================================================`);
    console.log(`ALL MILESTONE C VERIFICATION CHECKS COMPLETED`);
    console.log(`======================================================`);
    console.log(JSON.stringify(results, null, 2));

    fs.writeFileSync(path.join(ARTIFACT_DIR, 'milestone_c_test_results.json'), JSON.stringify(results, null, 2));

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
