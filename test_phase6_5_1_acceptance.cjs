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
  if (result.error) {
    console.error('Failed to spawn child process with --experimental-websocket:', result.error);
    process.exit(1);
  }
  process.exit(result.status === null ? 1 : result.status);
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

const EXPECTED_REPRESENTATIVE_TITLES = {
  islam: [
    ['REQ-ISL-001', 'Surah Al-Fatihah (The Opening)'],
    ['REQ-ISL-002', 'Surah Al-Baqarah (The Cow)'],
  ],
  hinduism: [
    ['REQ-HIN-001', 'Bhagavad Gita — Chapter 1: Arjuna Vishada Yoga'],
    ['REQ-HIN-036', 'Rigveda 10.90 — Hymn of the Cosmic Being (Purusha Suktam)'],
  ],
  christianity: [
    ['REQ-CHR-067', "The Lord's Prayer (Matthew 6:9–13)"],
    ['REQ-CHR-069', 'Psalm 23 — The Lord Is My Shepherd'],
  ],
  buddhism: [
    ['REQ-BUD-001', 'The Pali Tipitaka Structure'],
    ['REQ-BUD-010', 'Heart Sutra (Prajnaparamita Hrdaya)'],
  ],
  jainism: [
    ['REQ-JAI-007', 'Namokara Mahamantra — Complete 108 Repetitions'],
    ['REQ-JAI-009', 'Bhaktamara Stotra — Shloka 1'],
  ],
  sikhism: [
    ['REQ-SIK-001', 'Mool Mantar (Guru Granth Sahib Ji — Ang 1)'],
    ['REQ-SIK-017', 'Ardas — Formal Sikh Supplication'],
  ],
  judaism: [
    ['REQ-JUD-001', 'Torah: Book of Genesis (Bereshit)'],
    ['REQ-JUD-020', 'Shema Yisrael — Hear, O Israel (Deuteronomy 6:4)'],
  ],
};

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

function parseRegistryEntries(regSrc) {
  const startMarker = 'RECORDING_TITLE_PRESENTATION_REGISTRY: Record<string, RecordingTitlePresentation> = {';
  const startIdx = regSrc.indexOf(startMarker);
  const endIdx = regSrc.indexOf('\n};', startIdx);
  const body = regSrc.slice(startIdx, endIdx);
  const entryRegex = /'([^']+)':\s*\{\s*displayTitle:\s*(['"])((?:\\.|(?!\2).)*)\2,\s*isEnglishTitle:\s*(true|false)(?:,\s*languageLabel:\s*'([^']*)')?\s*\}/g;
  const rawEntries = [];
  let match;
  while ((match = entryRegex.exec(body)) !== null) {
    rawEntries.push({
      id: match[1],
      displayTitle: match[3].replace(/\\'/g, "'").replace(/\\"/g, '"'),
      isEnglishTitle: match[4] === 'true',
      languageLabel: match[5] || undefined,
    });
  }
  return rawEntries;
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
  // PART A: REGISTRY INTEGRITY, CANONICAL PRESERVATION & ERROR DISTINCTION
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

  const catStart = catSrc.indexOf('= [') + 2;
  const catEnd = catSrc.indexOf('];', catStart) + 1;
  const catEntries = JSON.parse(catSrc.slice(catStart, catEnd));
  const catById = new Map(catEntries.map((e) => [e.id, e]));

  const registryEntries = parseRegistryEntries(regSrc);
  const registryMap = new Map();
  const duplicateKeys = [];
  for (const entry of registryEntries) {
    if (registryMap.has(entry.id)) duplicateKeys.push(entry.id);
    registryMap.set(entry.id, entry);
  }

  assert(registryEntries.length === 161, `Registry contains exactly 161 entries (actual=${registryEntries.length})`);
  assert(duplicateKeys.length === 0 && registryMap.size === 161, `All 161 registry keys are unique (duplicates=${duplicateKeys.length})`);

  const unknownIds = registryEntries.filter((e) => !catById.has(e.id)).map((e) => e.id);
  assert(unknownIds.length === 0, `Every registry key exists in canonical catalogue (unknown=${JSON.stringify(unknownIds)})`);

  const emptyTitles = registryEntries.filter((e) => !e.displayTitle || e.displayTitle.trim().length === 0).map((e) => e.id);
  assert(emptyTitles.length === 0, `Zero empty displayTitle values in registry (empty=${JSON.stringify(emptyTitles)})`);

  const hasChannelMixing = registryEntries.some((e) => /Quran\.surf|@QuranSurf|YouTube|via\s+/i.test(e.displayTitle));
  assert(!hasChannelMixing, 'Zero provider/channel names mixed into displayTitle values');

  const tradCounts = new Map();
  let canonicalFieldsIntact = true;
  for (const entry of registryEntries) {
    const cat = catById.get(entry.id);
    if (!cat || !cat.requirementTitle || !cat.language || !cat.playbackProvider || !cat.rightsClassification) {
      canonicalFieldsIntact = false;
      break;
    }
    tradCounts.set(cat.tradition, (tradCounts.get(cat.tradition) || 0) + 1);
  }
  const allSevenRepresented = TRADITIONS.every((t) => (tradCounts.get(t) || 0) > 0);
  assert(allSevenRepresented, `All 7 traditions have valid registry entries (${JSON.stringify(Object.fromEntries(tradCounts))})`);
  assert(canonicalFieldsIntact, 'Canonical requirementTitle, id, language, playbackProvider, and rightsClassification remain intact for all 161 entries');

  for (const [trad, pairs] of Object.entries(EXPECTED_REPRESENTATIVE_TITLES)) {
    const allMatch = pairs.every(([id, expectedTitle]) => registryMap.get(id)?.displayTitle === expectedTitle);
    assert(allMatch, `Representative display titles verified for ${trad}: ${pairs.map((p) => p[0]).join(', ')}`);
  }

  const jud001 = catById.get('REQ-JUD-001');
  assert(catSrc.includes('Ṇamōkāra Mahāmantra'), 'Canonical Jainism title preserves exact diacritics (Ṇamōkāra Mahāmantra)');
  assert(catSrc.includes('Bhaktāmara Stōtra'), 'Canonical Jainism title preserves exact diacritics (Bhaktāmara Stōtra)');
  assert(Boolean(jud001 && /[\u0590-\u05FF]/.test(jud001.requirementTitle)), 'Canonical Judaism title preserves exact Hebrew script');
  assert(catSrc.includes('الفاتحة'), 'Canonical Islam title preserves exact Arabic script');
  assert(
    regSrc.includes('if (!entry)') && regSrc.includes('primaryTitle: req.requirementTitle'),
    'Registry helper falls back to canonical requirementTitle when metadata entry is absent'
  );

  // Notice & genuine-error visual distinction checks
  const hinSrc = fs.readFileSync(path.resolve(__dirname, 'src/modules/hinduism/index.tsx'), 'utf-8');
  const noticeBlock = (hinSrc.match(/data-testid="gita-translation-withheld-notice"[\s\S]{0,600}/) || [''])[0];
  assert(
    noticeBlock.includes('bg-navy-900/70') &&
      noticeBlock.includes('border-amber-500/30') &&
      noticeBlock.includes('<Lock') &&
      !noticeBlock.includes('bg-rose') &&
      !noticeBlock.includes('border-rose') &&
      !noticeBlock.includes('⚠️'),
    'Hinduism gita-translation-withheld-notice uses restrained navy/amber Lock treatment without rose/red error styling'
  );

  const searchModalSrc = fs.readFileSync(
    path.resolve(__dirname, 'src/platform/components/UniversalScriptureSearchModal.tsx'),
    'utf-8'
  );
  const primarySearchNotice = (searchModalSrc.match(/data-testid="translation-withheld-notice"[\s\S]{0,550}/) || [''])[0];
  const secondarySearchNotice = (searchModalSrc.match(/data-testid="secondary-translation-withheld-notice"[\s\S]{0,600}/) || [''])[0];
  const parallelSearchNotice = (searchModalSrc.match(/data-testid="parallel-translation-card"[\s\S]{0,1900}/) || [''])[0];
  assert(
    primarySearchNotice.includes('bg-navy-900/70') && primarySearchNotice.includes('border-amber-500/30') && primarySearchNotice.includes('<Lock') && !primarySearchNotice.includes('rose'),
    'Universal Search primary translation-withheld-notice uses navy/amber Lock treatment'
  );
  assert(
    secondarySearchNotice.includes('bg-navy-900/70') && secondarySearchNotice.includes('border-amber-500/30') && secondarySearchNotice.includes('<Lock') && !secondarySearchNotice.includes('rose'),
    'Universal Search secondary-translation-withheld-notice uses navy/amber Lock treatment'
  );
  assert(
    parallelSearchNotice.includes('bg-navy-900/70 border-amber-500/30') && !parallelSearchNotice.includes('bg-rose-950/20') && !parallelSearchNotice.includes('text-rose-300'),
    'Universal Search parallel-translation-card withheld state uses navy/amber treatment'
  );

  const quranReaderSrc = fs.readFileSync(path.resolve(__dirname, 'src/components/QuranReader/QuranReader.tsx'), 'utf-8');
  const sacredBarSrc = fs.readFileSync(path.resolve(__dirname, 'src/platform/components/audio/SacredAudioPlayerBar.tsx'), 'utf-8');
  assert(
    quranReaderSrc.includes('bg-red-950/60 border-red-500/40 text-red-200') && sacredBarSrc.includes('text-rose-400'),
    'Genuine playback/system errors remain visually distinct (red/rose) from amber/gold legal notices'
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

  let ws = null;
  const pending = new Map();

  try {
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
      throw new Error('Failed to connect to Chrome CDP');
    }

    ws = new WebSocket(wsUrl);
    await new Promise((resolve, reject) => {
      ws.onopen = resolve;
      ws.onerror = reject;
    });

    let msgId = 1;
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
        return {
          foundSelector: true,
          foundNotice: true,
          hasAmberBorder: cls.includes('border-amber-500/30'),
          hasNavyBg: cls.includes('bg-navy-900/70'),
          noRoseClass: !cls.includes('rose') && !cls.includes('red'),
          hasSvgLock: Boolean(notice.querySelector('svg')),
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

    // 2. Standardized Recording Titles Across All 7 Traditions (4-Path Verification)
    const expectedDisplaySet = new Set(registryEntries.map((e) => e.displayTitle));
    const expectedDisplayJson = JSON.stringify(Array.from(expectedDisplaySet));

    for (const rel of TRADITIONS) {
      console.log(`\n▶ [RECORDING TITLES (4 PATHS) — ${rel.toUpperCase()}]`);
      await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false }, sessionId);
      await send('Page.navigate', { url: `${BASE_URL}?religion=${rel}` }, sessionId);
      await new Promise((r) => setTimeout(r, 2000));

      const titleCheck = await evalCode(`
        (async () => {
          const panel = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
          if (!panel) return { hasPanel: false };
          const validDisplaySet = new Set(${expectedDisplayJson});

          // Activate a recommended item if active-track-title is not initially shown (e.g. Islam Quran default / Christianity Genesis 1)
          if (!panel.querySelector('[data-testid="active-track-title"]')) {
            const item = panel.querySelector('[data-testid^="playlist-item-"]');
            if (item) {
              item.click();
              await new Promise(r => setTimeout(r, 450));
            }
          }

          // Path 1: Active recording
          const activeTitle = panel.querySelector('[data-testid="active-track-title"]')?.textContent?.trim() || '';
          const activeCanonical = panel.querySelector('[data-testid="active-track-canonical-title"]')?.textContent?.trim() || '';
          const activeArtist = panel.querySelector('[data-testid="active-track-artist"]')?.textContent?.trim() || '';
          const activeMatchesRegistry = validDisplaySet.has(activeTitle);
          const activeNoDuplicate = !activeCanonical || !activeCanonical.startsWith(activeTitle + ' ·');
          const activeHasLang = Boolean(activeCanonical);

          // Path 2: Primary matches (when present)
          const primaryEls = Array.from(panel.querySelectorAll('[data-testid="primary-match-title"]'));
          const primaryTitles = primaryEls.map(el => el.textContent?.trim() || '');
          const primaryOk = primaryTitles.every(t => t.length > 0 && validDisplaySet.has(t));

          // Path 3: Recommended recordings (when present)
          const recEls = Array.from(panel.querySelectorAll('[data-testid="recommended-track-title"]'));
          const recTitles = recEls.map(el => el.textContent?.trim() || '');
          const recOk = recTitles.every(t => t.length > 0 && validDisplaySet.has(t));

          // Path 4: View All recordings modal (when present)
          let modalChecked = true;
          let modalTitlesCount = 0;
          let modalOk = true;
          const viewAllBtn = panel.querySelector('[data-testid="view-all-recordings-btn"]');
          if (viewAllBtn) {
            viewAllBtn.click();
            await new Promise(r => setTimeout(r, 300));
            const modal = document.querySelector('[data-testid="all-recordings-modal"]');
            const modalEls = modal ? Array.from(modal.querySelectorAll('[data-testid="modal-track-title"]')) : [];
            modalTitlesCount = modalEls.length;
            const modalTitles = modalEls.map(el => el.textContent?.trim() || '');
            modalOk = modalTitlesCount > 0 && modalTitles.every(t => t.length > 0 && validDisplaySet.has(t));
            modalChecked = Boolean(modal) && modalOk;
            const closeBtn = document.querySelector('[data-testid="close-all-recordings-modal"]');
            if (closeBtn) closeBtn.click();
            await new Promise(r => setTimeout(r, 200));
          }

          if (window.__SERVICES__?.unifiedSacredAudioService) {
            window.__SERVICES__.unifiedSacredAudioService.stop();
          }

          return {
            hasPanel: true,
            activeTitle,
            activeCanonical,
            activeArtist,
            activeMatchesRegistry,
            activeNoDuplicate,
            activeHasLang,
            primaryCount: primaryTitles.length,
            primaryOk,
            recCount: recTitles.length,
            recOk,
            modalChecked,
            modalTitlesCount,
            desktopOverflow: document.documentElement.scrollWidth > 1280,
          };
        })()
      `);

      assert(titleCheck?.hasPanel && Boolean(titleCheck?.activeTitle) && titleCheck?.activeMatchesRegistry, `${rel} [Path 1 Active]: Title "${titleCheck?.activeTitle}" matches registry`);
      assert(titleCheck?.activeNoDuplicate && titleCheck?.activeHasLang && Boolean(titleCheck?.activeArtist), `${rel} [Path 1 Active]: Canonical secondary/lang ("${titleCheck?.activeCanonical}") & separate attribution ("${titleCheck?.activeArtist}")`);
      assert(titleCheck?.primaryOk, `${rel} [Path 2 Primary Matches]: ${titleCheck?.primaryCount} titles verified against registry`);
      assert(titleCheck?.recOk, `${rel} [Path 3 Recommended]: ${titleCheck?.recCount} titles verified against registry`);
      assert(titleCheck?.modalChecked, `${rel} [Path 4 View All Modal]: ${titleCheck?.modalTitlesCount} titles verified against registry`);
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
      if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
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
      if (ws) {
        ws.onmessage = null;
        ws.onerror = null;
        ws.onopen = null;
      }
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
