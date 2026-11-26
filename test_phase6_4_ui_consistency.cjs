/**
 * Global UI Consistency & Visual Regression Verification Suite
 * Phase 6.4 — Section 8: Global UI Consistency
 *
 * Modes:
 *   node test_phase6_4_ui_consistency.cjs --before   (captures baseline screenshots)
 *   node test_phase6_4_ui_consistency.cjs --after    (captures after screenshots + runs all assertions)
 */

if (typeof WebSocket === 'undefined' && typeof globalThis.WebSocket === 'undefined') {
  const { spawnSync } = require('child_process');
  const result = spawnSync(
    process.execPath,
    ['--experimental-websocket', __filename, ...process.argv.slice(2)],
    { stdio: 'inherit' }
  );
  process.exit(result.status ?? 0);
}

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const http = require('http');

const MODE = process.argv.includes('--before') ? 'before' : 'after';
const PORT = 4174;
const BASE_PATH = '/jafri-islamic-resources/';
const BASE_URL = `http://127.0.0.1:${PORT}${BASE_PATH}`;
const EVIDENCE_DIR = path.resolve(__dirname, 'phase6_4_ui_evidence', MODE);
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

const TRADITIONS = [
  'islam',
  'hinduism',
  'christianity',
  'judaism',
  'sikhism',
  'buddhism',
  'jainism',
];

function findChrome() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) return process.env.CHROME_BIN;
  if (process.platform === 'darwin') {
    const macPath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    if (fs.existsSync(macPath)) return macPath;
  }
  for (const p of ['/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser']) {
    if (fs.existsSync(p)) return p;
  }
  return process.env.CHROME_BIN || 'google-chrome';
}

async function run() {
  console.log(`\n=== GLOBAL UI CONSISTENCY VERIFICATION (${MODE.toUpperCase()}) ===`);
  const preview = spawn(
    'npx',
    ['vite', 'preview', '--port', String(PORT), '--strictPort', '--base', BASE_PATH],
    { cwd: __dirname, stdio: 'pipe' }
  );
  await new Promise((r) => setTimeout(r, 2000));

  const chromePath = findChrome();
  const tempProfileDir = fs.mkdtempSync(path.join(os.tmpdir(), `chrome-ui-${MODE}-`));
  const cdpPort = 9226;

  const chrome = spawn(
    chromePath,
    [
      '--headless=new',
      `--remote-debugging-port=${cdpPort}`,
      `--user-data-dir=${tempProfileDir}`,
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--window-size=1280,900',
    ],
    { stdio: 'pipe' }
  );

  let wsUrl = null;
  for (let i = 0; i < 60; i++) {
    await new Promise((r) => setTimeout(r, 250));
    try {
      const resp = await new Promise((res, rej) => {
        const req = http.get(`http://127.0.0.1:${cdpPort}/json/version`, (r) => {
          let body = '';
          r.on('data', (c) => (body += c));
          r.on('end', () => res(body));
        });
        req.on('error', rej);
        req.setTimeout(500, () => req.destroy());
      });
      wsUrl = JSON.parse(resp).webSocketDebuggerUrl;
      if (wsUrl) break;
    } catch (_) {}
  }

  if (!wsUrl) {
    chrome.kill();
    preview.kill();
    throw new Error('Failed to connect to Chrome CDP');
  }

  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let msgId = 1;
  const pending = new Map();
  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    } catch (_) {}
  };

  const send = (method, params = {}, sessionId = undefined) =>
    new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      const payload = { id, method, params };
      if (sessionId) payload.sessionId = sessionId;
      ws.send(JSON.stringify(payload));
    });

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  await send('Page.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);

  const evalCode = async (expression) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, sessionId);
    return res.result ? res.result.value : undefined;
  };

  const capture = async (filename) => {
    const res = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
    if (res?.data) {
      fs.writeFileSync(path.join(EVIDENCE_DIR, filename), Buffer.from(res.data, 'base64'));
    }
  };

  let passed = 0;
  let failed = 0;
  const assert = (cond, msg) => {
    if (cond) {
      passed++;
      console.log(`  ✓ [PASS] ${msg}`);
    } else {
      failed++;
      console.error(`  ✗ [FAIL] ${msg}`);
    }
  };

  try {
    for (const rel of TRADITIONS) {
      console.log(`\n▶ Tradition: ${rel.toUpperCase()}`);

      // 1. Desktop (1280x900)
      await send('Emulation.setDeviceMetricsOverride', {
        width: 1280,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false,
      }, sessionId);
      await send('Page.navigate', { url: `${BASE_URL}?religion=${rel}` }, sessionId);
      await new Promise((r) => setTimeout(r, 2000));
      await capture(`${MODE}_${rel}_desktop.png`);

      const desktopAudit = await evalCode(`
        (async () => {
          window.scrollTo(0, 0);
          await new Promise(r => setTimeout(r, 100));

          const header = document.querySelector('header');
          const headerText = header?.innerText || '';
          const has30Lenguas = !!document.getElementById('platform-nav-studio-btn') || headerText.includes('30 Lenguas');
          const hasPilotoEspanol = !!document.getElementById('platform-nav-spanish-pilot-btn') || headerText.includes('Piloto Español');

          const hasOverview = headerText.includes('Overview');
          const hasSelector = !!document.getElementById('platform-religion-selector');
          const hasSacredAudio = !!document.getElementById('platform-nav-sacred-audio-btn');
          const hasCoverage = !!document.getElementById('platform-nav-coverage-btn');
          const hasSearch = !!document.getElementById('platform-nav-search-btn');
          const hasMyLibrary = !!document.getElementById('platform-nav-my-library-btn');

          const twoCol = document.querySelector('[data-testid="two-column-reading-layout"]');
          const readCol = document.querySelector('[data-testid="reading-column"]');
          const audioCol = document.querySelector('[data-testid="sacred-audio-column"]');
          const audioColPos = audioCol ? getComputedStyle(audioCol).position : null;

          const readTopBefore = readCol ? readCol.getBoundingClientRect().top : null;
          const audioTopBefore = audioCol ? audioCol.getBoundingClientRect().top : null;

          window.scrollTo(0, 350);
          await new Promise(r => setTimeout(r, 150));

          const readTopAfter = readCol ? readCol.getBoundingClientRect().top : null;
          const audioTopAfter = audioCol ? audioCol.getBoundingClientRect().top : null;
          const scrollY = window.scrollY;

          const desktopOverflow = document.documentElement.scrollWidth > window.innerWidth;

          return {
            hasHeader: !!header,
            hasBranding: headerText.includes('JAFRI') && headerText.includes('SACRED LIBRARY'),
            has30Lenguas,
            hasPilotoEspanol,
            hasOverview,
            hasSelector,
            hasSacredAudio,
            hasCoverage,
            hasSearch,
            hasMyLibrary,
            hasTwoCol: !!twoCol && !!readCol && !!audioCol,
            audioColPos,
            readMoved: readTopBefore !== null && readTopAfter !== null && (readTopBefore - readTopAfter) > 100,
            audioMovedWithScroll: audioTopBefore !== null && audioTopAfter !== null && (audioTopBefore - audioTopAfter) > 100,
            scrollY,
            desktopOverflow,
            scrollWidth: document.documentElement.scrollWidth,
            innerWidth: window.innerWidth,
          };
        })()
      `);

      // 2. Mobile (390x844)
      await send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true,
      }, sessionId);
      await evalCode('window.scrollTo(0, 0)');
      await new Promise((r) => setTimeout(r, 500));
      await capture(`${MODE}_${rel}_mobile.png`);

      const mobileAudit = await evalCode(`
        ({
          mobileOverflow: document.documentElement.scrollWidth > 390,
          scrollWidth: document.documentElement.scrollWidth,
          innerWidth: window.innerWidth,
        })
      `);

      if (MODE === 'after') {
        assert(desktopAudit?.hasHeader && desktopAudit?.hasBranding, `${rel}: Consistent navy-and-gold JAFRI SACRED LIBRARY header present`);
        assert(!desktopAudit?.has30Lenguas, `${rel}: "30 Lenguas" primary-nav button removed`);
        assert(!desktopAudit?.hasPilotoEspanol, `${rel}: "Piloto Español (ef_dora)" primary-nav button removed`);
        assert(
          desktopAudit?.hasOverview &&
            desktopAudit?.hasSelector &&
            desktopAudit?.hasSacredAudio &&
            desktopAudit?.hasCoverage &&
            desktopAudit?.hasSearch &&
            desktopAudit?.hasMyLibrary,
          `${rel}: All other primary navigation controls preserved`
        );
        assert(desktopAudit?.hasTwoCol, `${rel}: Uses unified TwoColumnReadingLayout and SacredAudioReadingPanel`);
        assert(desktopAudit?.audioColPos !== 'sticky', `${rel}: Sacred audio column is not sticky (position: ${desktopAudit?.audioColPos})`);
        assert(
          desktopAudit?.readMoved && desktopAudit?.audioMovedWithScroll,
          `${rel}: Both reading and audio columns move together with document scrolling`
        );
        assert(!desktopAudit?.desktopOverflow, `${rel}: Zero horizontal overflow at desktop 1280px (${desktopAudit?.scrollWidth}/${desktopAudit?.innerWidth})`);
        assert(!mobileAudit?.mobileOverflow, `${rel}: Zero horizontal overflow at mobile 390px (${mobileAudit?.scrollWidth}/${mobileAudit?.innerWidth})`);
      } else {
        console.log(`  [BEFORE Snapshot] ${rel}: desktop=${MODE}_${rel}_desktop.png, mobile=${MODE}_${rel}_mobile.png, audioColPos=${desktopAudit?.audioColPos}, has30Lenguas=${desktopAudit?.has30Lenguas}, hasPiloto=${desktopAudit?.hasPilotoEspanol}, desktopOverflow=${desktopAudit?.desktopOverflow}, mobileOverflow=${mobileAudit?.mobileOverflow}`);
      }
    }
  } finally {
    try {
      chrome.kill();
      preview.kill();
    } catch (_) {}
  }

  if (MODE === 'after') {
    console.log(`\n=== SUMMARY (${MODE.toUpperCase()}) ===`);
    console.log(`Total: ${passed + failed}, Passed: ${passed}, Failed: ${failed}`);
    if (failed > 0) process.exit(1);
  }
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
