// ==============================================================================
// MILESTONE C LIVE PRODUCTION ACCEPTANCE TEST SUITE — BUDDHISM EXPANSION
// Tests Live GitHub Pages (https://afzaljafri-one.github.io/jafri-islamic-resources/)
// Jafri Sacred Library — Religious Readings & Sacred Audio
// ==============================================================================

const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const LIVE_BASE_URL = 'https://afzaljafri-one.github.io/jafri-islamic-resources';
const ARTIFACT_DIR = '/Users/afzaljafri/.gemini/antigravity/brain/2e0a8a09-f40f-4cdb-bc60-d11e0de6618b';
const SCREENSHOT_DIR = path.join(ARTIFACT_DIR, 'phase4_milestone_c_live_evidence');
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
  const targetHash = 'index-B0X6VGcX';
  const deployed = await pollForDeployment(targetHash, 35);
  if (!deployed) {
    console.warn(`[WARN] Polling timed out or target hash differs. Proceeding with live audit.`);
  }

  const chromePort = 9406;
  const tempDir = '/tmp/chrome_milestone_c_live_' + Date.now();
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

  let ws;
  const results = {
    timestamp: new Date().toISOString(),
    liveUrl: LIVE_BASE_URL,
    checks: []
  };

  try {
    let wsUrl = '';
    for (let i = 0; i < 20; i++) {
      try {
        const res = await fetch(`http://127.0.0.1:${chromePort}/json`);
        const data = await res.json();
        if (data && data[0] && data[0].webSocketDebuggerUrl) {
          wsUrl = data[0].webSocketDebuggerUrl;
          break;
        }
      } catch (_) {}
      await new Promise((r) => setTimeout(r, 500));
    }

    if (!wsUrl) throw new Error('Could not connect to Chrome DevTools Protocol');
    console.log(`[CDP] Connected to Chrome DevTools endpoint at ${wsUrl}`);

    const ws = new globalThis.WebSocket(wsUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
    const pending = new Map();
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    function send(method, params = {}, sessionId = undefined) {
      return new Promise((resolve, reject) => {
        const id = msgId++;
        pending.set(id, { resolve, reject });
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

    // CHECK 1: Title & Branding Check
    console.log(`\n--- NAVIGATING TO LIVE BUDDHISM MODULE ---`);
    await send('Page.navigate', { url: `${LIVE_BASE_URL}/?religion=buddhism` }, sessionId);
    await new Promise((r) => setTimeout(r, 4000));

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

    // CHECK 2: Tipitaka Overview (Three Baskets: Vinaya, Sutta, Abhidhamma)
    console.log(`\n--- CHECKING TIPITAKA THREE BASKETS ---`);
    await send('Page.navigate', { url: `${LIVE_BASE_URL}/?religion=buddhism&collection=tipitaka_overview` }, sessionId);
    await new Promise((r) => setTimeout(r, 3000));

    const tipitakaUnits = await evaluate(`
      return Array.from(document.querySelectorAll('[id^="segment-"]')).map(el => {
        return {
          id: el.id,
          unitText: el.querySelector('.font-mono') ? el.querySelector('.font-mono').innerText : ''
        };
      });
    `);
    console.log(`Tipitaka units rendered: ${tipitakaUnits.length}`);
    tipitakaUnits.forEach((u, i) => console.log(`  [${i+1}] ${u.id}: ${u.unitText}`));
    await captureScreenshot('live_milestone_c_01_tipitaka_three_baskets.png');

    const hasVinaya = tipitakaUnits.some(u => u.unitText.includes('Vinaya Pitaka') || u.unitText.includes('Patimokkha'));
    const hasSutta = tipitakaUnits.some(u => u.unitText.includes('Sutta Pitaka') || u.unitText.includes('Five Nikayas'));
    const hasAbhidhamma = tipitakaUnits.some(u => u.unitText.includes('Abhidhamma Pitaka') || u.unitText.includes('Higher Teachings'));

    results.checks.push({
      test: 'Tipitaka Three Baskets (Vinaya, Sutta 5 Nikayas, Abhidhamma 7 Treatises)',
      unitsCount: tipitakaUnits.length,
      hasVinaya,
      hasSutta,
      hasAbhidhamma,
      status: tipitakaUnits.length >= 3 && hasVinaya && hasSutta && hasAbhidhamma ? 'PASS' : 'FAIL',
    });

    // CHECK 3: Core Suttas & Mahayana Sutras
    console.log(`\n--- CHECKING CORE SUTTAS & MAHAYANA SUTRAS ---`);
    await send('Page.navigate', { url: `${LIVE_BASE_URL}/?religion=buddhism&collection=suttas_sutras` }, sessionId);
    await new Promise((r) => setTimeout(r, 3000));

    const suttaUnits = await evaluate(`
      return Array.from(document.querySelectorAll('[id^="segment-"]')).map(el => {
        return {
          id: el.id,
          unitText: el.querySelector('.font-mono') ? el.querySelector('.font-mono').innerText : ''
        };
      });
    `);
    console.log(`Core Suttas & Sutras loaded: ${suttaUnits.length}`);
    suttaUnits.forEach((u, i) => console.log(`  [${i+1}] ${u.id}: ${u.unitText}`));

    const suttaMatchBadge = await evaluate(`
      const b = document.querySelector('[data-testid="match-scope-badge"]');
      return b ? b.innerText.trim() : 'NONE';
    `);
    console.log(`Suttas Audio Match Badge: "${suttaMatchBadge}"`);
    await captureScreenshot('live_milestone_c_02_core_suttas_and_mahayana_sutras.png');

    const hasDhammacakka = suttaUnits.some(u => u.unitText.includes('Dhammacakkappavattana') || u.unitText.includes('SN 56.11'));
    const hasAnatta = suttaUnits.some(u => u.unitText.includes('Anattalakkhana') || u.unitText.includes('SN 22.59'));
    const hasSatipatthana = suttaUnits.some(u => u.unitText.includes('Maha-satipatthana') || u.unitText.includes('DN 22'));
    const hasKalama = suttaUnits.some(u => u.unitText.includes('Kalama') || u.unitText.includes('AN 3.65'));
    const hasDiamond = suttaUnits.some(u => u.unitText.includes('Diamond Sutra') || u.unitText.includes('Vajracchedika'));
    const hasLotus = suttaUnits.some(u => u.unitText.includes('Lotus Sutra') || u.unitText.includes('Saddharmapundarika'));

    results.checks.push({
      test: 'Core Suttas (First Sermon, Anatta, Satipatthana, Kalama) & Mahayana Sutras (Diamond, Lotus)',
      unitsCount: suttaUnits.length,
      hasDhammacakka,
      hasAnatta,
      hasSatipatthana,
      hasKalama,
      hasDiamond,
      hasLotus,
      audioBadge: suttaMatchBadge,
      status: suttaUnits.length >= 6 && hasDhammacakka && hasAnatta && hasSatipatthana && hasKalama && hasDiamond && hasLotus && suttaMatchBadge === 'Matching Audio' ? 'PASS' : 'FAIL',
    });

    // CHECK 4: The Dhammapada
    console.log(`\n--- CHECKING THE DHAMMAPADA ---`);
    await send('Page.navigate', { url: `${LIVE_BASE_URL}/?religion=buddhism&collection=dhammapada` }, sessionId);
    await new Promise((r) => setTimeout(r, 3000));

    const dhpUnits = await evaluate(`
      return Array.from(document.querySelectorAll('[id^="segment-"]')).map(el => {
        return {
          id: el.id,
          unitText: el.querySelector('.font-mono') ? el.querySelector('.font-mono').innerText : ''
        };
      });
    `);
    console.log(`Dhammapada verses loaded: ${dhpUnits.length}`);
    dhpUnits.forEach((u, i) => console.log(`  [${i+1}] ${u.id}: ${u.unitText}`));
    await captureScreenshot('live_milestone_c_03_dhammapada.png');

    const hasYamakavagga = dhpUnits.some(u => u.unitText.includes('Yamaka'));
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

    // CHECK 5: Buddhist Chants, Refuges & Parittas
    console.log(`\n--- SWITCHING TO CHANTS & PARITTAS ---`);
    await send('Page.navigate', { url: `${LIVE_BASE_URL}/?religion=buddhism&collection=chants_parittas` }, sessionId);
    await new Promise((r) => setTimeout(r, 3000));

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
    await captureScreenshot('live_milestone_c_04_chants_and_parittas.png');

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
    await send('Page.navigate', { url: `${LIVE_BASE_URL}/?religion=buddhism&collection=metta_sutta` }, sessionId);
    await new Promise((r) => setTimeout(r, 3000));

    const mettaMatchBadge = await evaluate(`
      const b = document.querySelector('[data-testid="match-scope-badge"]');
      return b ? b.innerText.trim() : 'NONE';
    `);
    console.log(`Metta Sutta Audio Match: "${mettaMatchBadge}"`);
    await captureScreenshot('live_milestone_c_05_metta_sutta.png');

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
    await new Promise((r) => setTimeout(r, 1500));

    await evaluate(`
      const budTab = Array.from(document.querySelectorAll('[role="dialog"] button, .fixed.inset-0 button')).find(b => b.innerText.includes('Buddhism') || b.innerText.includes('धर्म / बुद्ध सासन') || b.innerText.includes('बुद्ध'));
      if (budTab) budTab.click();
    `);
    await new Promise((r) => setTimeout(r, 1500));

    const coverageModalText = await evaluate(`
      const modal = document.querySelector('[role="dialog"]') || document.querySelector('.fixed.inset-0');
      return modal ? modal.innerText : '';
    `);
    console.log(`Buddhism Coverage Modal Text Length: ${coverageModalText.length}`);
    await captureScreenshot('live_milestone_c_06_coverage_modal_buddhism.png');

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
    console.log(`ALL MILESTONE C LIVE VERIFICATION CHECKS COMPLETED`);
    console.log(`======================================================`);
    console.log(JSON.stringify(results, null, 2));

    fs.writeFileSync(path.join(ARTIFACT_DIR, 'milestone_c_live_results.json'), JSON.stringify(results, null, 2));

  } catch (err) {
    console.error('Test execution error:', err);
    results.error = err.message;
  } finally {
    try { ws.close(); } catch (_) {}
    try { chrome.kill('SIGKILL'); } catch (_) {}
    try { fs.rmSync(tempDir, { recursive: true, force: true }); } catch (_) {}
  }
}

runLiveTest();
