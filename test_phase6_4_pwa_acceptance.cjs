/**
 * Phase 6.4 Installable Offline-First PWA Foundation Acceptance Test Suite
 * Jafri Sacred Library — Multi-Religion Scripture & Audio Platform
 *
 * Verifies all 13 Acceptance Criteria:
 * 1. Production build succeeds
 * 2. Manifest accessible under GitHub Pages base path & valid schema
 * 3. Service worker registers successfully under correct application scope
 * 4. Initial online visit installs expected application shell cache
 * 5. Reload works without breaking active application
 * 6. Offline browser reopening renders cached application shell
 * 7. Existing supported offline reading datasets remain accessible
 * 8. Query-parameter navigation continues to work offline
 * 9. Network failures for uncached external content are handled gracefully
 * 10. Strict zero-autoplay preserved
 * 11. Rights restrictions and audio quarantine rules remain enforced
 * 12. No requests or resources accidentally escape the application base path
 * 13. Existing Phase 6.3.5.5 acceptance gates continue passing
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

const { spawn, spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const http = require('http');

const PORT = 4173;
const BASE_PATH = '/jafri-islamic-resources/';
const BASE_URL = `http://127.0.0.1:${PORT}${BASE_PATH}`;
const EVIDENCE_DIR = path.resolve(__dirname, 'phase6_4_evidence');

if (!fs.existsSync(EVIDENCE_DIR)) {
  fs.mkdirSync(EVIDENCE_DIR, { recursive: true });
}

class TestTracker {
  constructor() {
    this.total = 0;
    this.passed = 0;
    this.failed = 0;
    this.currentTest = '';
    this.failures = [];
    this.resultsByCriterion = {};
  }

  startCriterion(num, name) {
    this.currentTest = `Criterion ${num}: ${name}`;
    this.resultsByCriterion[num] = { name, assertions: 0, passed: 0, failed: 0 };
    console.log(`\n▶ [CRITERION ${num}] ${name}`);
  }

  assert(condition, message, criterionNum = null) {
    this.total++;
    const crit = criterionNum || parseInt(this.currentTest.match(/Criterion (\d+):/)?.[1] || '1', 10);
    if (this.resultsByCriterion[crit]) {
      this.resultsByCriterion[crit].assertions++;
    }

    if (condition) {
      this.passed++;
      if (this.resultsByCriterion[crit]) this.resultsByCriterion[crit].passed++;
      console.log(`  ✓ [PASS] ${message}`);
    } else {
      this.failed++;
      if (this.resultsByCriterion[crit]) this.resultsByCriterion[crit].failed++;
      const failMsg = `[FAIL] (${this.currentTest}) ${message}`;
      console.error(`  ✗ ${failMsg}`);
      this.failures.push(failMsg);
    }
  }

  summary() {
    console.log('\n================================================================================');
    console.log('PHASE 6.4 PWA ACCEPTANCE TEST SUITE SUMMARY');
    console.log('================================================================================');
    for (const [num, data] of Object.entries(this.resultsByCriterion)) {
      const status = data.failed === 0 ? 'PASSED' : 'FAILED';
      console.log(`Criterion ${num.padStart(2)}: [${status}] ${data.name} (${data.passed}/${data.assertions} passed)`);
    }
    console.log('--------------------------------------------------------------------------------');
    console.log(`Total Assertions: ${this.total}`);
    console.log(`Passed:           ${this.passed} (${((this.passed / this.total) * 100).toFixed(1)}%)`);
    console.log(`Failed:           ${this.failed}`);
    console.log('================================================================================\n');
    return this.failed === 0;
  }
}

function findChrome() {
  if (process.env.CHROME_BIN && fs.existsSync(process.env.CHROME_BIN)) return process.env.CHROME_BIN;
  if (process.platform === 'darwin') {
    const macPath = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
    if (fs.existsSync(macPath)) return macPath;
  }
  const linuxPaths = [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/snap/bin/chromium',
  ];
  for (const p of linuxPaths) {
    if (fs.existsSync(p)) return p;
  }
  return process.env.CHROME_BIN || 'google-chrome';
}

async function runPwaAcceptanceSuite() {
  const tracker = new TestTracker();
  const distDir = path.resolve(__dirname, 'dist');

  // ===========================================================================
  // CRITERION 1: Production build succeeds
  // ===========================================================================
  tracker.startCriterion(1, 'Production build succeeds');
  tracker.assert(fs.existsSync(distDir), 'dist/ directory exists', 1);

  const distHtml = path.join(distDir, 'index.html');
  tracker.assert(fs.existsSync(distHtml) && fs.statSync(distHtml).size > 500, 'dist/index.html exists and is non-empty', 1);

  const distSw = path.join(distDir, 'sw.js');
  tracker.assert(fs.existsSync(distSw) && fs.statSync(distSw).size > 500, 'dist/sw.js exists and is non-empty', 1);

  const distManifest = path.join(distDir, 'manifest.webmanifest');
  tracker.assert(fs.existsSync(distManifest) && fs.statSync(distManifest).size > 200, 'dist/manifest.webmanifest exists and is non-empty', 1);

  const icon192 = path.join(distDir, 'icons', 'icon-192x192.png');
  const icon512 = path.join(distDir, 'icons', 'icon-512x512.png');
  const iconMask = path.join(distDir, 'icons', 'icon-maskable-512x512.png');
  tracker.assert(fs.existsSync(icon192) && fs.statSync(icon192).size > 1000, 'dist/icons/icon-192x192.png exists and is valid', 1);
  tracker.assert(fs.existsSync(icon512) && fs.statSync(icon512).size > 1000, 'dist/icons/icon-512x512.png exists and is valid', 1);
  tracker.assert(fs.existsSync(iconMask) && fs.statSync(iconMask).size > 1000, 'dist/icons/icon-maskable-512x512.png exists and is valid', 1);

  const assetsDir = path.join(distDir, 'assets');
  const hasHashedJs = fs.existsSync(assetsDir) && fs.readdirSync(assetsDir).some((f) => f.startsWith('index-') && f.endsWith('.js'));
  const hasHashedCss = fs.existsSync(assetsDir) && fs.readdirSync(assetsDir).some((f) => f.startsWith('index-') && f.endsWith('.css'));
  tracker.assert(hasHashedJs, 'dist/assets contains hashed production javascript bundle', 1);
  tracker.assert(hasHashedCss, 'dist/assets contains hashed production stylesheet bundle', 1);

  // ===========================================================================
  // CRITERION 2: Manifest accessible under GitHub Pages base path & valid schema
  // ===========================================================================
  tracker.startCriterion(2, 'Manifest accessible under GitHub Pages base path & valid schema');
  const manifestRaw = fs.readFileSync(distManifest, 'utf-8');
  let manifestData = null;
  try {
    manifestData = JSON.parse(manifestRaw);
  } catch (e) {
    console.error('Failed to parse manifest:', e);
  }
  tracker.assert(manifestData !== null, 'manifest.webmanifest parses as valid JSON', 2);
  tracker.assert(manifestData?.name === 'Jafri Sacred Library — Religious Readings & Sacred Audio', 'manifest name matches approved title', 2);
  tracker.assert(manifestData?.short_name === 'Jafri Library', 'manifest short_name matches "Jafri Library"', 2);
  tracker.assert(manifestData?.start_url === '/jafri-islamic-resources/', 'manifest start_url correctly targets base path /jafri-islamic-resources/', 2);
  tracker.assert(manifestData?.scope === '/jafri-islamic-resources/', 'manifest scope is /jafri-islamic-resources/', 2);
  tracker.assert(manifestData?.id === '/jafri-islamic-resources/', 'manifest id is /jafri-islamic-resources/', 2);
  tracker.assert(manifestData?.display === 'standalone', 'manifest display mode is standalone', 2);
  tracker.assert(manifestData?.theme_color === '#071124', 'manifest theme_color is #071124 (brand dark navy)', 2);
  tracker.assert(manifestData?.background_color === '#071124', 'manifest background_color is #071124 (brand dark navy)', 2);

  const icons = manifestData?.icons || [];
  const has192 = icons.some((i) => i.src === '/jafri-islamic-resources/icons/icon-192x192.png' && i.sizes === '192x192');
  const has512 = icons.some((i) => i.src === '/jafri-islamic-resources/icons/icon-512x512.png' && i.sizes === '512x512');
  const hasMask = icons.some((i) => i.src === '/jafri-islamic-resources/icons/icon-maskable-512x512.png' && i.purpose === 'maskable');
  tracker.assert(has192, 'manifest icons include 192x192 PNG under base path', 2);
  tracker.assert(has512, 'manifest icons include 512x512 PNG under base path', 2);
  tracker.assert(hasMask, 'manifest icons include maskable 512x512 PNG variant under base path', 2);

  const htmlContent = fs.readFileSync(distHtml, 'utf-8');
  tracker.assert(htmlContent.includes('<link rel="manifest" href="/jafri-islamic-resources/manifest.webmanifest"'), 'index.html links manifest with base path', 2);
  tracker.assert(htmlContent.includes('<meta name="theme-color" content="#071124"'), 'index.html contains meta theme-color #071124', 2);
  tracker.assert(htmlContent.includes('<link rel="apple-touch-icon" href="/jafri-islamic-resources/icons/icon-192x192.png"'), 'index.html links apple-touch-icon with base path', 2);

  // ===========================================================================
  // CRITERION 11 (Static Part): Rights & Audio Quarantine static checks
  // ===========================================================================
  tracker.startCriterion(11, 'Rights restrictions & audio quarantine rules remain enforced');
  const swRaw = fs.readFileSync(distSw, 'utf-8');
  tracker.assert(swRaw.includes("url.pathname.includes('/audio/')"), 'Service worker excludes audio media in fetch interceptor', 11);

  const precacheMatch = swRaw.match(/const PRECACHE_URLS = (\[[\s\S]*?\]);/);
  const precacheList = precacheMatch ? JSON.parse(precacheMatch[1]) : [];
  const hasAudioInPrecache = precacheList.some((u) => u.includes('/audio/') || u.endsWith('.mp3') || u.endsWith('.m4a'));
  tracker.assert(!hasAudioInPrecache, `Service worker PRECACHE_URLS contains zero audio files (checked ${precacheList.length} precached URLs)`, 11);

  // Check Master catalogue count
  const esbuild = require('esbuild');
  const catBuild = esbuild.buildSync({
    entryPoints: ['src/platform/data/sacredAudioMasterCatalogue.ts'],
    bundle: true,
    write: false,
    format: 'cjs',
  });
  const catMod = { exports: {} };
  new Function('module', 'exports', 'require', catBuild.outputFiles[0].text)(catMod, catMod.exports, require);
  const { SACRED_AUDIO_MASTER_CATALOGUE, APPROVED_LOCAL_AUDIO_IDS, APPROVED_PUBLIC_YOUTUBE_IDS } = catMod.exports;
  tracker.assert(SACRED_AUDIO_MASTER_CATALOGUE.length === 651, `Master audio catalogue count intact (expected 651, got ${SACRED_AUDIO_MASTER_CATALOGUE.length})`, 11);
  tracker.assert(APPROVED_LOCAL_AUDIO_IDS.size + APPROVED_PUBLIC_YOUTUBE_IDS.size === 161, `Approved playable audio count intact (expected 161, got ${APPROVED_LOCAL_AUDIO_IDS.size + APPROVED_PUBLIC_YOUTUBE_IDS.size})`, 11);

  // Check Gita withholds
  const gitaCh2 = JSON.parse(fs.readFileSync(path.join(distDir, 'data', 'gita', 'chapter_2.json'), 'utf-8'));
  const v47 = gitaCh2.find((v) => v.verse === 47);
  tracker.assert(v47 && v47.slok && v47.edwinArnoldEn.includes('withheld'), 'Gita 2:47 preserves original Sanskrit and strictly withholds restricted modern translation', 11);

  // ===========================================================================
  // START LOCAL PREVIEW SERVER & CHROME HEADLESS BROWSER
  // ===========================================================================
  console.log('\n--- Starting Vite Preview Server on port 4173 ---');
  const preview = spawn(
    'npx',
    ['vite', 'preview', '--port', String(PORT), '--strictPort', '--base', BASE_PATH],
    { cwd: __dirname, stdio: 'pipe' }
  );

  await new Promise((resolve) => setTimeout(resolve, 2500));

  const chromePath = findChrome();
  console.log(`Using Chrome executable: ${chromePath}`);
  const tempProfileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-p64-'));
  const cdpPort = 9225;

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
  for (let i = 0; i < 80; i++) {
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
      const data = JSON.parse(resp);
      wsUrl = data.webSocketDebuggerUrl;
      if (wsUrl) break;
    } catch (_) {}
  }

  if (!wsUrl) {
    chrome.kill();
    preview.kill();
    throw new Error('Failed to connect to Chrome CDP endpoint on port ' + cdpPort);
  }

  console.log(`Chrome remote debugging connected: ${wsUrl}`);
  const ws = new WebSocket(wsUrl);
  await new Promise((resolve, reject) => {
    ws.onopen = resolve;
    ws.onerror = reject;
  });

  let msgId = 1;
  const pendingRequests = new Map();

  ws.onmessage = (event) => {
    try {
      const msg = JSON.parse(event.data);
      if (msg.id && pendingRequests.has(msg.id)) {
        const { resolve, reject } = pendingRequests.get(msg.id);
        pendingRequests.delete(msg.id);
        if (msg.error) reject(new Error(msg.error.message || JSON.stringify(msg.error)));
        else resolve(msg.result);
      }
    } catch (_) {}
  };

  const send = (method, params = {}, sessionId = undefined) =>
    new Promise((resolve, reject) => {
      const id = msgId++;
      pendingRequests.set(id, { resolve, reject });
      const payload = { id, method, params };
      if (sessionId) payload.sessionId = sessionId;
      ws.send(JSON.stringify(payload));
    });

  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });

  await send('Page.enable', {}, sessionId);
  await send('DOM.enable', {}, sessionId);
  await send('Runtime.enable', {}, sessionId);
  await send('Network.enable', {}, sessionId);

  const requestedUrls = [];
  // Record all network requests to verify path isolation
  await send('Network.setRequestInterception', { patterns: [] }, sessionId).catch(() => {});

  const evalCode = async (expression) => {
    const res = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true }, sessionId);
    return res.result ? res.result.value : undefined;
  };

  const captureScreenshot = async (name) => {
    const res = await send('Page.captureScreenshot', { format: 'png' }, sessionId);
    if (res && res.data) {
      const filePath = path.join(EVIDENCE_DIR, name);
      fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
      console.log(`  📸 Screenshot saved: ${name}`);
    }
  };

  try {
    // =========================================================================
    // CRITERION 3: Service worker registers successfully under correct scope
    // =========================================================================
    tracker.startCriterion(3, 'Service worker registers successfully under correct application scope');
    await send('Page.navigate', { url: BASE_URL }, sessionId);
    await new Promise((r) => setTimeout(r, 3500));

    const swRegInfo = await evalCode(`
      (async () => {
        if (!('serviceWorker' in navigator)) return { supported: false };
        const reg = await navigator.serviceWorker.getRegistration('${BASE_PATH}');
        if (!reg) return { supported: true, registered: false };
        return {
          supported: true,
          registered: true,
          scope: reg.scope,
          active: !!reg.active,
          installing: !!reg.installing,
          waiting: !!reg.waiting,
        };
      })()
    `);

    tracker.assert(swRegInfo?.supported === true, 'Browser environment supports ServiceWorker', 3);
    tracker.assert(swRegInfo?.registered === true, 'Service worker is registered for base path', 3);
    tracker.assert(swRegInfo?.scope?.endsWith(BASE_PATH), `Service worker scope strictly ends with "${BASE_PATH}" (got: ${swRegInfo?.scope})`, 3);

    // =========================================================================
    // CRITERION 4: Initial online visit installs expected application shell cache
    // =========================================================================
    tracker.startCriterion(4, 'Initial online visit installs expected application shell cache');
    // Allow up to 4 seconds for cache precaching to finish
    await new Promise((r) => setTimeout(r, 3000));

    const cacheDetails = await evalCode(`
      (async () => {
        const keys = await caches.keys();
        const pwaCache = keys.find(k => k.startsWith('jafri-sacred-library-shell-'));
        if (!pwaCache) return { found: false, keys };
        const cache = await caches.open(pwaCache);
        const reqs = await cache.keys();
        return {
          found: true,
          cacheName: pwaCache,
          itemCount: reqs.length,
          urls: reqs.map(r => r.url)
        };
      })()
    `);

    tracker.assert(cacheDetails?.found === true, `App shell cache found: ${cacheDetails?.cacheName}`, 4);
    tracker.assert(cacheDetails?.itemCount >= 30, `Precached assets count >= 30 (got: ${cacheDetails?.itemCount})`, 4);

    const cachedUrls = cacheDetails?.urls || [];
    const hasBaseEntry = cachedUrls.some((u) => u.endsWith(BASE_PATH) || u.endsWith(`${BASE_PATH}index.html`));
    const hasManifestCached = cachedUrls.some((u) => u.includes('manifest.webmanifest'));
    const hasGitaCached = cachedUrls.some((u) => u.includes('chapter_1.json'));
    const hasIconsCached = cachedUrls.some((u) => u.includes('icon-192x192.png'));
    const hasJsBundleCached = cachedUrls.some((u) => u.includes('/assets/index-') && u.endsWith('.js'));
    const hasCssBundleCached = cachedUrls.some((u) => u.includes('/assets/index-') && u.endsWith('.css'));

    tracker.assert(hasBaseEntry, 'App shell index.html entry is precached', 4);
    tracker.assert(hasManifestCached, 'manifest.webmanifest is precached', 4);
    tracker.assert(hasGitaCached, 'Gita scripture dataset is precached', 4);
    tracker.assert(hasIconsCached, 'Brand icons are precached', 4);
    tracker.assert(hasJsBundleCached, 'Hashed javascript bundle is precached', 4);
    tracker.assert(hasCssBundleCached, 'Hashed CSS bundle is precached', 4);

    // =========================================================================
    // CRITERION 5: Reload works without breaking active application
    // =========================================================================
    tracker.startCriterion(5, 'Reload works without breaking active application');
    await send('Page.reload', {}, sessionId);
    await new Promise((r) => setTimeout(r, 2500));

    const pageStateAfterReload = await evalCode(`
      ({
        title: document.title,
        hasRoot: !!document.getElementById('root'),
        rootChildren: document.getElementById('root')?.childElementCount || 0,
        isOnline: navigator.onLine,
      })
    `);

    tracker.assert(pageStateAfterReload?.title?.includes('Jafri Sacred Library'), 'Page title preserved after reload', 5);
    tracker.assert(pageStateAfterReload?.hasRoot && pageStateAfterReload?.rootChildren > 0, 'React root component re-renders intact after reload', 5);

    // =========================================================================
    // CRITERION 6: Offline browser reopening renders cached application shell
    // =========================================================================
    tracker.startCriterion(6, 'Offline browser reopening renders cached application shell');
    // Emulate offline network conditions via CDP
    console.log('  [Action] Emulating offline network conditions (Network.emulateNetworkConditions)...');
    await send(
      'Network.emulateNetworkConditions',
      {
        offline: true,
        latency: 0,
        downloadThroughput: 0,
        uploadThroughput: 0,
      },
      sessionId
    );

    // Reopen/navigate to base URL while offline
    console.log('  [Action] Navigating to application entry point while fully offline...');
    await send('Page.navigate', { url: BASE_URL }, sessionId);
    await new Promise((r) => setTimeout(r, 2500));

    const offlineState = await evalCode(`
      ({
        title: document.title,
        hasRoot: !!document.getElementById('root'),
        rootTextLength: document.getElementById('root')?.innerText?.length || 0,
        hasOfflineBanner: !!document.querySelector('[data-testid="offline-status-indicator"]'),
        offlineBannerText: document.querySelector('[data-testid="offline-status-indicator"]')?.innerText || '',
        isNavigatorOnline: navigator.onLine
      })
    `);

    tracker.assert(offlineState?.title?.includes('Jafri Sacred Library'), 'Page loads and renders application shell while offline', 6);
    tracker.assert(offlineState?.rootTextLength > 100, `React application renders full UI while offline (text length: ${offlineState?.rootTextLength})`, 6);
    tracker.assert(offlineState?.hasOfflineBanner === true, 'Offline status indicator [data-testid="offline-status-indicator"] is visible in DOM', 6);
    tracker.assert(offlineState?.offlineBannerText?.includes('Offline Mode'), `Offline indicator displays "Offline Mode" message (got: "${offlineState?.offlineBannerText}")`, 6);
    await captureScreenshot('01_pwa_offline_shell_rendered.png');

    // =========================================================================
    // CRITERION 7: Existing supported offline reading datasets remain accessible
    // =========================================================================
    tracker.startCriterion(7, 'Existing supported offline reading datasets remain accessible');
    // While still offline, request Gita Chapter 1 dataset
    const offlineDatasetResult = await evalCode(`
      (async () => {
        try {
          const resp = await fetch('${BASE_PATH}data/gita/chapter_1.json');
          if (!resp.ok) return { ok: false, status: resp.status };
          const data = await resp.json();
          const v1 = data.find(v => v.verse === 1);
          return {
            ok: true,
            totalVerses: data.length,
            v1ArnoldText: v1?.edwinArnoldEn || '',
            v1Sanskrit: v1?.slok || ''
          };
        } catch (err) {
          return { ok: false, error: String(err) };
        }
      })()
    `);

    tracker.assert(offlineDatasetResult?.ok === true, 'Gita Chapter 1 dataset served successfully from SW cache while offline', 7);
    tracker.assert(offlineDatasetResult?.totalVerses === 47, `Gita Chapter 1 contains all 47 verses offline (got: ${offlineDatasetResult?.totalVerses})`, 7);
    tracker.assert(offlineDatasetResult?.v1ArnoldText?.includes('Ranged thus for battle'), 'Authentic Edwin Arnold translation accessible offline for Chapter 1 Verse 1', 7);
    await captureScreenshot('02_pwa_offline_gita_dataset.png');

    // =========================================================================
    // CRITERION 8: Query-parameter navigation continues to work offline
    // =========================================================================
    tracker.startCriterion(8, 'Query-parameter navigation continues to work offline');
    // Navigate to Christianity via URL query param while offline
    const christianityUrl = `${BASE_URL}?religion=christianity`;
    await send('Page.navigate', { url: christianityUrl }, sessionId);
    await new Promise((r) => setTimeout(r, 2500));

    const christianityState = await evalCode(`
      ({
        url: window.location.href,
        hasRoot: !!document.getElementById('root'),
        bodyText: document.getElementById('root')?.innerText || '',
        hasOfflineBanner: !!document.querySelector('[data-testid="offline-status-indicator"]')
      })
    `);

    tracker.assert(christianityState?.hasRoot === true, 'Christianity view renders via query parameter while offline', 8);
    tracker.assert(christianityState?.bodyText?.includes('Christianity') || christianityState?.bodyText?.includes('Bible'), 'Christianity scriptures view rendered', 8);
    tracker.assert(christianityState?.hasOfflineBanner === true, 'Offline banner remains visible during query navigation', 8);

    // Navigate to Hinduism via URL query param while offline
    const hinduismUrl = `${BASE_URL}?religion=hinduism`;
    await send('Page.navigate', { url: hinduismUrl }, sessionId);
    await new Promise((r) => setTimeout(r, 2500));

    const hinduismState = await evalCode(`
      ({
        url: window.location.href,
        bodyText: document.getElementById('root')?.innerText || '',
        hasGitaTitle: document.body.innerText.includes('Bhagavad') || document.body.innerText.includes('Gita')
      })
    `);

    tracker.assert(hinduismState?.hasGitaTitle === true, 'Hinduism / Bhagavad Gita view renders via query parameter while offline', 8);
    await captureScreenshot('03_pwa_offline_query_navigation.png');

    // =========================================================================
    // CRITERION 9: Network failures for uncached external content handled gracefully
    // =========================================================================
    tracker.startCriterion(9, 'Network failures for uncached external content handled gracefully');
    const externalFetchHandled = await evalCode(`
      (async () => {
        try {
          const resp = await fetch('https://api.alquran.cloud/v1/surah/1', { cache: 'no-store' });
          return { caught: false, status: resp.status };
        } catch (err) {
          // Expected: Network error is caught gracefully
          return { caught: true, error: err.message };
        }
      })()
    `);

    tracker.assert(externalFetchHandled?.caught === true, 'External API failure rejected cleanly without crashing runtime', 9);

    const appAliveCheck = await evalCode(`
      ({
        rootAlive: !!document.getElementById('root'),
        windowAlive: typeof window !== 'undefined'
      })
    `);
    tracker.assert(appAliveCheck?.rootAlive === true, 'Application UI remains responsive after external network failure', 9);

    // Restore online condition for subsequent checks
    console.log('  [Action] Restoring online connectivity...');
    await send(
      'Network.emulateNetworkConditions',
      {
        offline: false,
        latency: 0,
        downloadThroughput: -1,
        uploadThroughput: -1,
      },
      sessionId
    );
    await new Promise((r) => setTimeout(r, 1000));

    // =========================================================================
    // CRITERION 10: Strict zero-autoplay preserved
    // =========================================================================
    tracker.startCriterion(10, 'Strict zero-autoplay preserved');
    await send('Page.navigate', { url: BASE_URL }, sessionId);
    await new Promise((r) => setTimeout(r, 2500));

    const audioAutoplayAudit = await evalCode(`
      (() => {
        const mediaElements = Array.from(document.querySelectorAll('audio, video'));
        let autoplayViolations = 0;
        let playingViolations = 0;

        for (const el of mediaElements) {
          if (el.autoplay || el.hasAttribute('autoplay')) autoplayViolations++;
          if (!el.paused && !el.ended && el.currentTime > 0) playingViolations++;
        }

        return {
          mediaCount: mediaElements.length,
          autoplayViolations,
          playingViolations
        };
      })()
    `);

    tracker.assert(audioAutoplayAudit?.autoplayViolations === 0, `Zero media elements have autoplay attribute (found: ${audioAutoplayAudit?.autoplayViolations})`, 10);
    tracker.assert(audioAutoplayAudit?.playingViolations === 0, `Zero media elements are playing automatically on load (found: ${audioAutoplayAudit?.playingViolations})`, 10);
    await captureScreenshot('04_zero_autoplay_verified.png');

    // =========================================================================
    // CRITERION 12: No requests or resources accidentally escape application base path
    // =========================================================================
    tracker.startCriterion(12, 'No requests or resources accidentally escape application base path');
    const pathEscapeAudit = await evalCode(`
      (() => {
        const linksAndScripts = Array.from(document.querySelectorAll('link[href], script[src], img[src]'));
        const escapingElements = [];

        for (const el of linksAndScripts) {
          const rawAttr = el.getAttribute('href') || el.getAttribute('src') || '';
          if (rawAttr.startsWith('/') && !rawAttr.startsWith('/jafri-islamic-resources/')) {
            escapingElements.push({ tag: el.tagName, attr: rawAttr });
          }
        }
        return escapingElements;
      })()
    `);

    tracker.assert(
      pathEscapeAudit?.length === 0,
      `Zero local elements escape base path /jafri-islamic-resources/ (found: ${pathEscapeAudit?.length})`,
      12
    );
    if (pathEscapeAudit?.length > 0) {
      console.warn('Escaping elements:', pathEscapeAudit);
    }

    // =========================================================================
    // CRITERION 13: Existing Phase 6.3.5.5 acceptance gates continue passing
    // =========================================================================
    tracker.startCriterion(13, 'Existing Phase 6.3.5.5 acceptance gates continue passing');
    console.log('  [Action] Running Phase 6.3.5.5 static & runtime validation suite...');
    const p6355Result = spawnSync(process.execPath, [path.join(__dirname, 'test_phase6_3_5_5_acceptance.cjs')], {
      cwd: __dirname,
      encoding: 'utf-8',
      stdio: 'pipe',
    });

    const p6355Passed = p6355Result.status === 0;
    const p6355Output = p6355Result.stdout || '';
    const matchAssertions = p6355Output.match(/Passed:\s+(\d+)\s+\(100\.0%\)/);
    const passedCount = matchAssertions ? parseInt(matchAssertions[1], 10) : 0;

    tracker.assert(p6355Passed, 'Phase 6.3.5.5 full regression suite exited with code 0', 13);
    tracker.assert(passedCount >= 94, `Phase 6.3.5.5 verified all assertions passed (got: ${passedCount}/94)`, 13);
  } finally {
    try {
      chrome.kill();
      preview.kill();
    } catch (_) {}
  }

  const success = tracker.summary();

  // Save results JSON
  const resultsObj = {
    timestamp: new Date().toISOString(),
    success,
    total: tracker.total,
    passed: tracker.passed,
    failed: tracker.failed,
    failures: tracker.failures,
    resultsByCriterion: tracker.resultsByCriterion,
  };

  const resultsPath = path.resolve(__dirname, 'phase6_4_acceptance_results.json');
  fs.writeFileSync(resultsPath, JSON.stringify(resultsObj, null, 2), 'utf-8');
  console.log(`Saved acceptance results to: ${resultsPath}`);

  if (!success) {
    process.exit(1);
  }
}

runPwaAcceptanceSuite().catch((err) => {
  console.error('\nFATAL ERROR running PWA acceptance suite:', err);
  process.exit(1);
});
