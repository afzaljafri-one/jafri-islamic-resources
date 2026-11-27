/**
 * Phase 6.5.1 — UI Polish & Recording Title Standardization Acceptance Suite
 * Jafri Sacred Library — All 7 Traditions
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

const PORT = 4182;
const BASE_PATH = '/jafri-islamic-resources/';
const BASE_URL = `http://127.0.0.1:${PORT}${BASE_PATH}`;
const EVIDENCE_DIR = path.resolve(__dirname, 'phase6_5_1_evidence');
fs.mkdirSync(EVIDENCE_DIR, { recursive: true });

const TRADITIONS = [
  'islam',
  'hinduism',
  'christianity',
  'buddhism',
  'sikhism',
  'jainism',
  'judaism',
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
  let passed = 0;
  let failed = 0;
  const failures = [];

  const assert = (cond, msg) => {
    if (cond) {
      passed++;
      console.log(`  ✓ [PASS] ${msg}`);
    } else {
      failed++;
      failures.push(msg);
      console.error(`  ✗ [FAIL] ${msg}`);
    }
  };

  console.log('================================================================================');
  console.log('PHASE 6.5.1 — UI POLISH & RECORDING TITLE STANDARDIZATION SUITE');
  console.log('================================================================================\n');

  // ===========================================================================
  // PART A: REGISTRY INTEGRITY & FALLBACK CHECKS (STATIC)
  // ===========================================================================
  console.log('▶ [PART A: RECORDING TITLE REGISTRY & CANONICAL INTEGRITY]');
  const regSrc = fs.readFileSync(
    path.resolve(__dirname, 'src/platform/data/recordingTitlePresentationRegistry.ts'),
    'utf-8'
  );
  const catSrc = fs.readFileSync(
    path.resolve(__dirname, 'src/platform/data/sacredAudioMasterCatalogue.ts'),
    'utf-8'
  );

  // Verify no provider/channel names mixed into displayTitle
  const displayTitles = [...regSrc.matchAll(/displayTitle:\s*['"]([^'"]+)['"]/g)].map((m) => m[1]);
  const hasChannelMixing = displayTitles.some(
    (t) => /Quran\.surf|@QuranSurf|YouTube|via\s+/i.test(t)
  );
  assert(displayTitles.length >= 100 && !hasChannelMixing, `Registry defines ${displayTitles.length} display titles with zero provider/channel mixing`);

  // Verify canonical diacritics and scripts in sacredAudioMasterCatalogue.ts remain intact
  const catStart = catSrc.indexOf('= [') + 2;
  const catEnd = catSrc.indexOf('];', catStart) + 1;
  const catEntries = JSON.parse(catSrc.slice(catStart, catEnd));
  const jud001 = catEntries.find((e) => e.id === 'REQ-JUD-001');
  assert(catSrc.includes('Ṇamōkāra Mahāmantra'), 'Canonical Jainism title preserves exact diacritics (Ṇamōkāra Mahāmantra)');
  assert(catSrc.includes('Bhaktāmara Stōtra'), 'Canonical Jainism title preserves exact diacritics (Bhaktāmara Stōtra)');
  assert(Boolean(jud001 && /[\u0590-\u05FF]/.test(jud001.requirementTitle)), 'Canonical Judaism title preserves exact Hebrew script');
  assert(catSrc.includes('الفاتحة'), 'Canonical Islam title preserves exact Arabic script');
  assert(
    regSrc.includes('if (!entry)') && regSrc.includes('primaryTitle: req.requirementTitle'),
    'Registry helper falls back to canonical requirementTitle when metadata entry is absent'
  );
  const quranReaderSrc = fs.readFileSync(path.resolve(__dirname, 'src/components/QuranReader/QuranReader.tsx'), 'utf-8');
  assert(
    quranReaderSrc.includes('bg-red-950/60 border-red-500/40 text-red-200'),
    'Genuine playback/system errors remain visually distinct (red/rose) from amber/gold legal notices'
  );

  // Verify Hinduism Gita notice has amber/gold informational styling, not rose/red error styling
  const hinSrc = fs.readFileSync(path.resolve(__dirname, 'src/modules/hinduism/index.tsx'), 'utf-8');
  const noticeMatch = hinSrc.match(/data-testid="gita-translation-withheld-notice"[\s\S]{0,600}/);
  const noticeBlock = noticeMatch ? noticeMatch[0] : '';
  assert(
    noticeBlock.includes('bg-navy-900/70') &&
      noticeBlock.includes('border-amber-500/30') &&
      noticeBlock.includes('<Lock') &&
      !noticeBlock.includes('bg-rose') &&
      !noticeBlock.includes('border-rose') &&
      !noticeBlock.includes('⚠️'),
    'Hinduism gita-translation-withheld-notice uses restrained navy/amber Lock treatment without rose/red error styling'
  );

  // ===========================================================================
  // PART B: BROWSER VERIFICATION ACROSS ALL 7 TRADITIONS
  // ===========================================================================
  const preview = spawn(
    'npx',
    ['vite', 'preview', '--port', String(PORT), '--strictPort', '--base', BASE_PATH],
    { cwd: __dirname, stdio: 'pipe' }
  );
  await new Promise((r) => setTimeout(r, 2000));

  const chromePath = findChrome();
  const tempProfileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-p651-'));
  const cdpPort = 9236;

  const chrome = spawn(
    chromePath,
    [
      '--headless=new',
      `--remote-debugging-port=${cdpPort}`,
      `--user-data-dir=${tempProfileDir}`,
      '--autoplay-policy=no-user-gesture-required',
      '--no-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--window-size=1280,900',
    ],
    { stdio: 'pipe' }
  );

  const terminateProcess = async (proc, timeoutMs = 2500) => {
    if (!proc) return;
    const destroyStreams = () => {
      try { proc.stdin?.destroy(); } catch (_) {}
      try { proc.stdout?.destroy(); } catch (_) {}
      try { proc.stderr?.destroy(); } catch (_) {}
    };
    if (proc.exitCode !== null || proc.signalCode !== null) {
      destroyStreams();
      return;
    }
    await new Promise((resolve) => {
      let settled = false;
      let killTimer = null;
      let hardTimer = null;
      const finish = () => {
        if (settled) return;
        settled = true;
        if (killTimer) clearTimeout(killTimer);
        if (hardTimer) clearTimeout(hardTimer);
        destroyStreams();
        resolve();
      };
      proc.once('close', finish);
      try { proc.kill('SIGTERM'); } catch (_) { finish(); return; }
      killTimer = setTimeout(() => {
        if (settled) return;
        try { proc.kill('SIGKILL'); } catch (_) {}
        hardTimer = setTimeout(finish, 1000);
      }, timeoutMs);
    });
  };

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
    await terminateProcess(chrome);
    await terminateProcess(preview);
    try { fs.rmSync(tempProfileDir, { recursive: true, force: true }); } catch (_) {}
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
    if (res.exceptionDetails) {
      console.error('  [evalCode Exception]', res.exceptionDetails.exception?.description || res.exceptionDetails.text);
    }
    return res.result ? res.result.value : undefined;
  };

  const capture = async (filename) => {
    const res = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
    if (res?.data) {
      fs.writeFileSync(path.join(EVIDENCE_DIR, filename), Buffer.from(res.data, 'base64'));
      console.log(`  📸 Screenshot saved: ${filename}`);
    }
  };

  try {
    // 1. Hinduism Gita Translation Withheld Notice Verification (Desktop & Mobile)
    console.log('\n▶ [HINDUISM TRANSLATION WITHHELD NOTICE]');
    await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId);
    await send('Page.navigate', { url: `${BASE_URL}?religion=hinduism` }, sessionId);
    await new Promise((r) => setTimeout(r, 2000));

    const withheldCheck = await evalCode(`
      (async () => {
        const selects = Array.from(document.querySelectorAll('select'));
        const commSel = selects.find(s => Array.from(s.options).some(o => o.value === 'siva'));
        if (!commSel) return { foundSelector: false };
        commSel.value = 'siva';
        commSel.dispatchEvent(new Event('change', { bubbles: true }));
        await new Promise(r => setTimeout(r, 400));

        const notice = document.querySelector('[data-testid="gita-translation-withheld-notice"]');
        if (!notice) return { foundSelector: true, foundNotice: false };
        const cls = notice.className || '';
        const text = notice.innerText || '';
        const hasSvgLock = Boolean(notice.querySelector('svg'));
        return {
          foundSelector: true,
          foundNotice: true,
          hasAmberBorder: cls.includes('border-amber-500/30'),
          hasNavyBg: cls.includes('bg-navy-900/70'),
          noRoseClass: !cls.includes('rose') && !cls.includes('red'),
          hasSvgLock,
          preservesExplanation: text.includes('Translation Withheld (Permission Required)') && (text.includes('permission') || text.includes('withheld') || text.includes('excluded')),
          noWarningEmoji: !text.includes('⚠️'),
        };
      })()
    `);

    assert(withheldCheck?.foundSelector && withheldCheck?.foundNotice, 'Hinduism: Selecting withheld commentary displays gita-translation-withheld-notice');
    assert(withheldCheck?.hasAmberBorder && withheldCheck?.hasNavyBg && withheldCheck?.noRoseClass, 'Hinduism: Withheld notice uses restrained navy/amber styling (no rose/red error look)');
    assert(withheldCheck?.hasSvgLock && withheldCheck?.preservesExplanation && withheldCheck?.noWarningEmoji, 'Hinduism: Withheld notice shows Lock icon and preserves permission explanation');

    await capture('p651_hinduism_withheld_desktop.png');

    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }, sessionId);
    await new Promise((r) => setTimeout(r, 400));
    await capture('p651_hinduism_withheld_mobile.png');

    // 2. Standardized Recording Titles Across All 7 Traditions
    for (const rel of TRADITIONS) {
      console.log(`\n▶ [RECORDING TITLES — ${rel.toUpperCase()}]`);
      await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId);
      await send('Page.navigate', { url: `${BASE_URL}?religion=${rel}` }, sessionId);
      await new Promise((r) => setTimeout(r, 2000));

      const titleCheck = await evalCode(`
        (async () => {
          const panel = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
          if (!panel) return { hasPanel: false };

          // On Islam (Quran controls default) or traditions with no direct chapter match (e.g. Christianity Genesis 1),
          // click the first recommended playlist item to inspect the active Sacred Audio title card
          if (!panel.querySelector('[data-testid="active-track-title"]')) {
            const item = panel.querySelector('[data-testid^="playlist-item-"]');
            if (item) {
              item.click();
              await new Promise(r => setTimeout(r, 450));
            }
          }

          const activeTitle = panel.querySelector('[data-testid="active-track-title"]')?.textContent?.trim() || '';
          const activeCanonical = panel.querySelector('[data-testid="active-track-canonical-title"]')?.textContent?.trim() || '';
          const activeArtist = panel.querySelector('[data-testid="active-track-artist"]')?.textContent?.trim() || '';
          const recTitles = Array.from(panel.querySelectorAll('[data-testid="recommended-track-title"]')).map(el => el.textContent?.trim() || '');
          const primaryTitles = Array.from(panel.querySelectorAll('[data-testid="primary-match-title"]')).map(el => el.textContent?.trim() || '');

          // Check no duplicate primary == canonical
          const noDuplicate = !activeCanonical || !activeCanonical.startsWith(activeTitle + ' ·');

          // Check View All modal if present
          let modalChecked = true;
          let modalTitlesCount = 0;
          const viewAllBtn = panel.querySelector('[data-testid="view-all-recordings-btn"]');
          if (viewAllBtn) {
            viewAllBtn.click();
            await new Promise(r => setTimeout(r, 300));
            const modal = document.querySelector('[data-testid="all-recordings-modal"]');
            modalTitlesCount = modal ? modal.querySelectorAll('[data-testid="modal-track-title"]').length : 0;
            modalChecked = Boolean(modal) && modalTitlesCount > 0;
            const closeBtn = document.querySelector('[data-testid="close-all-recordings-modal"]');
            if (closeBtn) closeBtn.click();
            await new Promise(r => setTimeout(r, 200));
          }

          // Stop any playback started during inspection
          if (window.__SERVICES__?.unifiedSacredAudioService) {
            window.__SERVICES__.unifiedSacredAudioService.stop();
          }

          return {
            hasPanel: true,
            activeTitle,
            activeCanonical,
            activeArtist,
            recCount: recTitles.length,
            primaryCount: primaryTitles.length,
            noDuplicate,
            modalChecked,
            modalTitlesCount,
            desktopOverflow: document.documentElement.scrollWidth > 1280,
          };
        })()
      `);

      assert(titleCheck?.hasPanel && Boolean(titleCheck?.activeTitle), `${rel}: Active recording title rendered ("${titleCheck?.activeTitle}")`);
      assert(Boolean(titleCheck?.activeArtist), `${rel}: Separate provider/performer attribution rendered ("${titleCheck?.activeArtist}")`);
      assert(titleCheck?.noDuplicate, `${rel}: Primary and canonical secondary titles are not unnecessarily duplicated`);
      assert(titleCheck?.modalChecked, `${rel}: View All modal renders standardized titles (count=${titleCheck?.modalTitlesCount})`);
      assert(!titleCheck?.desktopOverflow, `${rel}: Zero desktop horizontal overflow`);

      await capture(`p651_${rel}_titles_desktop.png`);

      await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true }, sessionId);
      await evalCode('window.scrollTo(0, 0)');
      await new Promise((r) => setTimeout(r, 400));
      const mobileOverflow = await evalCode('document.documentElement.scrollWidth > 390');
      assert(!mobileOverflow, `${rel}: Zero mobile horizontal overflow`);
      await capture(`p651_${rel}_titles_mobile.png`);
    }
  } finally {
    try {
      for (const { reject } of pending.values()) {
        reject(new Error('CDP WebSocket closed during cleanup'));
      }
      pending.clear();
      if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
        await new Promise((resolve) => {
          let done = false;
          const finish = () => {
            if (done) return;
            done = true;
            clearTimeout(timer);
            resolve();
          };
          const timer = setTimeout(finish, 1500);
          ws.addEventListener('close', finish, { once: true });
          try { ws.close(); } catch (_) { finish(); }
        });
      }
      ws.onmessage = null;
      ws.onerror = null;
      ws.onopen = null;
    } catch (_) {}

    await terminateProcess(chrome);
    await terminateProcess(preview);
    try { fs.rmSync(tempProfileDir, { recursive: true, force: true }); } catch (_) {}
    console.log('PHASE 6.5.1 BROWSER AND PROCESS CLEANUP COMPLETE');
  }

  console.log('\n================================================================================');
  console.log('PHASE 6.5.1 ACCEPTANCE TEST SUITE SUMMARY');
  console.log('================================================================================');
  console.log(`Total Assertions: ${passed + failed}`);
  console.log(`Passed:           ${passed} (${(((passed) / (passed + failed)) * 100).toFixed(1)}%)`);
  console.log(`Failed:           ${failed}`);
  console.log('================================================================================\n');

  fs.writeFileSync(
    path.resolve(__dirname, 'phase6_5_1_acceptance_results.json'),
    JSON.stringify({ timestamp: new Date().toISOString(), total: passed + failed, passed, failed, failures }, null, 2),
    'utf-8'
  );

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('\nFATAL ERROR in Phase 6.5.1 Acceptance Suite:', err);
  process.exit(1);
});
