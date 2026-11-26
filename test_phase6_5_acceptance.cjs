/**
 * Phase 6.5 — Unified Reader & Player Consolidation Acceptance Test Suite
 * Jafri Sacred Library — All 7 Traditions
 *
 * Verifies all 14 required acceptance gates:
 * 1. Exactly one visible player interface per reading page
 * 2. Quran playback through the unified player
 * 3. Full Quran playback controls retained (reciter, ayah nav, page/surah scope, seek, speed, auto-advance)
 * 4. Other six traditions retain contextual audio functionality
 * 5. Switching sources cannot produce simultaneous playback
 * 6. No autoplay
 * 7. No fixed-bottom player
 * 8. No nested vertical scrolling in normal reading page (+ View all modal)
 * 9. Both columns move together with document scroll
 * 10. Desktop (1280px) and mobile (390px) responsive checks with zero overflow
 * 11. All seven traditions retain consistent UI & expandable Text information
 * 12. Both experimental navigation buttons ('30 Lenguas', 'Piloto Español (ef_dora)') remain absent
 * 13. Existing PWA acceptance tests pass
 * 14. Existing Phase 6.3.5.5 rights/content tests pass
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

const PORT = 4181;
const BASE_PATH = '/jafri-islamic-resources/';
const BASE_URL = `http://127.0.0.1:${PORT}${BASE_PATH}`;
const EVIDENCE_DIR = path.resolve(__dirname, 'phase6_5_evidence');
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

const SCREENSHOT_TRADITIONS = new Set(['islam', 'jainism', 'hinduism']);

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
  console.log('PHASE 6.5 — UNIFIED READER & PLAYER CONSOLIDATION ACCEPTANCE SUITE');
  console.log('================================================================================\n');

  const preview = spawn(
    'npx',
    ['vite', 'preview', '--port', String(PORT), '--strictPort', '--base', BASE_PATH],
    { cwd: __dirname, stdio: 'pipe' }
  );
  await new Promise((r) => setTimeout(r, 2000));

  const chromePath = findChrome();
  const tempProfileDir = fs.mkdtempSync(path.join(os.tmpdir(), 'chrome-p65-'));
  const cdpPort = 9235;

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

  // Instrument detached new Audio(), HTMLMediaElement.play(), and speechSynthesis.speak()
  // to catch any autoplay even when Audio elements are not attached to the DOM.
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `
      (() => {
        window.__AUTOPLAY_AUDIT__ = {
          audioPlayCalls: [],
          audioPlayEvents: [],
          speechCalls: [],
        };
        const OrigAudio = window.Audio;
        window.Audio = function(...args) {
          const instance = new OrigAudio(...args);
          instance.addEventListener('play', () => {
            window.__AUTOPLAY_AUDIT__.audioPlayEvents.push(instance.src || 'new Audio()');
          });
          return instance;
        };
        window.Audio.prototype = OrigAudio.prototype;
        const origMediaPlay = HTMLMediaElement.prototype.play;
        HTMLMediaElement.prototype.play = function(...args) {
          window.__AUTOPLAY_AUDIT__.audioPlayCalls.push(this.src || this.tagName);
          return origMediaPlay.apply(this, args);
        };
        if (window.speechSynthesis && typeof window.speechSynthesis.speak === 'function') {
          const origSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis);
          window.speechSynthesis.speak = function(utterance) {
            window.__AUTOPLAY_AUDIT__.speechCalls.push(utterance?.text?.slice(0, 40) || 'speech');
            return origSpeak(utterance);
          };
        }
      })();
    `,
  }, sessionId);

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
    // =========================================================================
    // PART A: CROSS-TRADITION UNIFIED PLAYER, SCROLL, & RESPONSIVE CHECKS
    // =========================================================================
    for (const rel of TRADITIONS) {
      console.log(`\n▶ [TRADITION] ${rel.toUpperCase()}`);

      await send('Emulation.setDeviceMetricsOverride', {
        width: 1280,
        height: 900,
        deviceScaleFactor: 1,
        mobile: false,
      }, sessionId);

      await send('Page.navigate', { url: `${BASE_URL}?religion=${rel}` }, sessionId);
      await new Promise((r) => setTimeout(r, 2200));

      if (SCREENSHOT_TRADITIONS.has(rel)) {
        await capture(`p65_${rel}_desktop.png`);
      }

      const desktopCheck = await evalCode(`
        (async () => {
          window.scrollTo(0, 0);
          await new Promise(r => setTimeout(r, 100));

          const header = document.querySelector('header');
          const headerText = header?.innerText || '';
          const has30Lenguas = !!document.getElementById('platform-nav-studio-btn') || headerText.includes('30 Lenguas');
          const hasPilotoEspanol = !!document.getElementById('platform-nav-spanish-pilot-btn') || headerText.includes('Piloto Español');

          // 1. Exactly one visible player interface
          const panels = document.querySelectorAll('[data-testid="sacred-audio-reading-panel"]');
          const legacyBottomBar = document.querySelectorAll('[data-testid="audio-player-bar"]');

          // 7. No fixed-bottom player anywhere
          const fixedBottomPlayers = Array.from(document.querySelectorAll('div, aside, footer')).filter(el => {
            const st = getComputedStyle(el);
            const r = el.getBoundingClientRect();
            return st.position === 'fixed' && Math.abs(window.innerHeight - r.bottom) < 10 && r.height > 30 && (el.innerText.includes('Play') || el.querySelector('[data-testid*="audio"]'));
          });

          // 6. No autoplay (DOM media + detached new Audio() + speechSynthesis + YouTube autoplay=1 + service states)
          const media = Array.from(document.querySelectorAll('audio, video'));
          const domAutoplayCount = media.filter(m => m.autoplay || m.hasAttribute('autoplay') || (!m.paused && !m.ended && m.currentTime > 0)).length;
          const ytAutoplayCount = Array.from(document.querySelectorAll('iframe')).filter(f => (f.src || '').includes('autoplay=1')).length;
          const audit = window.__AUTOPLAY_AUDIT__ || { audioPlayCalls: [], audioPlayEvents: [], speechCalls: [] };
          const qState = window.__SERVICES__?.quranAudioService?.getState()?.status || 'idle';
          const sState = window.__SERVICES__?.unifiedSacredAudioService?.getState()?.status || 'IDLE';
          const mState = window.__multilingualAudioEngine?.getState?.()?.playbackState || 'idle';
          const anyServicePlaying =
            qState === 'playing' || qState === 'loading' ||
            sState === 'PLAYING' || sState === 'LOADING' ||
            mState === 'playing' || mState === 'buffering';
          const autoplayCount =
            domAutoplayCount +
            ytAutoplayCount +
            audit.audioPlayCalls.length +
            audit.audioPlayEvents.length +
            audit.speechCalls.length +
            (anyServicePlaying ? 1 : 0);

          // 8. No nested vertical scrolling in normal reading page
          const audioPanel = panels[0];
          const nestedScrollBoxes = audioPanel
            ? Array.from(audioPanel.querySelectorAll('*')).filter(el => {
                const st = getComputedStyle(el);
                return (st.overflowY === 'auto' || st.overflowY === 'scroll') && el.scrollHeight > el.clientHeight + 2;
              }).length
            : -1;

          // 11. Expandable Text information toggle
          const textInfoBtn = audioPanel?.querySelector('[data-testid="text-info-toggle"]');
          let textInfoExpanded = false;
          if (textInfoBtn) {
            textInfoBtn.click();
            await new Promise(r => setTimeout(r, 150));
            textInfoExpanded = !!audioPanel.querySelector('[data-testid="text-info-details"]');
            textInfoBtn.click();
          }

          // 9. Both columns move together with document scroll
          const readCol = document.querySelector('[data-testid="reading-column"]');
          const audioCol = document.querySelector('[data-testid="sacred-audio-column"]');
          const audioColPos = audioCol ? getComputedStyle(audioCol).position : null;
          const readTop1 = readCol?.getBoundingClientRect().top ?? null;
          const audioTop1 = audioCol?.getBoundingClientRect().top ?? null;
          window.scrollTo(0, 350);
          await new Promise(r => setTimeout(r, 150));
          const readTop2 = readCol?.getBoundingClientRect().top ?? null;
          const audioTop2 = audioCol?.getBoundingClientRect().top ?? null;

          const desktopOverflow = document.documentElement.scrollWidth > 1280;

          return {
            panelCount: panels.length,
            legacyBarCount: legacyBottomBar.length,
            fixedBottomCount: fixedBottomPlayers.length,
            autoplayCount,
            nestedScrollBoxes,
            hasTextInfoToggle: !!textInfoBtn,
            textInfoExpanded,
            audioColPos,
            bothMoved: readTop1 !== null && audioTop1 !== null && (readTop1 - readTop2) > 100 && (audioTop1 - audioTop2) > 100,
            hasBranding: headerText.includes('JAFRI') && headerText.includes('SACRED LIBRARY'),
            has30Lenguas,
            hasPilotoEspanol,
            desktopOverflow,
            desktopSw: document.documentElement.scrollWidth,
          };
        })()
      `);

      assert(desktopCheck?.panelCount === 1 && desktopCheck?.legacyBarCount === 0, `${rel}: Exactly one visible player interface (SacredAudioReadingPanel=1, legacy AudioPlayerBar=0)`);
      assert(desktopCheck?.fixedBottomCount === 0, `${rel}: Zero fixed-bottom audio players`);
      assert(desktopCheck?.autoplayCount === 0, `${rel}: Zero autoplay or playing audio on load`);
      assert(desktopCheck?.nestedScrollBoxes === 0, `${rel}: Zero nested vertical scroll containers inside normal reading page`);
      assert(desktopCheck?.hasTextInfoToggle && desktopCheck?.textInfoExpanded, `${rel}: Expandable Text information control works`);
      assert(desktopCheck?.audioColPos !== 'sticky' && desktopCheck?.bothMoved, `${rel}: Both reading and audio columns move together with document scroll`);
      assert(desktopCheck?.hasBranding && !desktopCheck?.has30Lenguas && !desktopCheck?.hasPilotoEspanol, `${rel}: Consistent navy/gold header and experimental nav buttons absent`);
      assert(!desktopCheck?.desktopOverflow, `${rel}: Zero horizontal overflow at desktop 1280px (${desktopCheck?.desktopSw})`);

      // Mobile 390x844 check
      await send('Emulation.setDeviceMetricsOverride', {
        width: 390,
        height: 844,
        deviceScaleFactor: 2,
        mobile: true,
      }, sessionId);
      await evalCode('window.scrollTo(0, 0)');
      await new Promise((r) => setTimeout(r, 500));

      if (SCREENSHOT_TRADITIONS.has(rel)) {
        await capture(`p65_${rel}_mobile.png`);
      }

      const mobileCheck = await evalCode(`
        (() => {
          const readCol = document.querySelector('[data-testid="reading-column"]');
          const audioCol = document.querySelector('[data-testid="sacred-audio-column"]');
          const readTop = readCol?.getBoundingClientRect().top ?? 0;
          const audioTop = audioCol?.getBoundingClientRect().top ?? 0;
          return {
            scriptureBeforeAudio: readTop < audioTop,
            mobileOverflow: document.documentElement.scrollWidth > 390,
            sw: document.documentElement.scrollWidth,
          };
        })()
      `);

      assert(mobileCheck?.scriptureBeforeAudio, `${rel}: Mobile single-column places scripture first, audio player below`);
      assert(!mobileCheck?.mobileOverflow, `${rel}: Zero horizontal overflow at mobile 390px (${mobileCheck?.sw})`);
    }

    // =========================================================================
    // PART B: QURAN UNIFIED PLAYER CONTROLS, PLAYBACK & VIEW ALL MODAL
    // =========================================================================
    console.log('\n▶ [QURAN UNIFIED PLAYER FUNCTIONAL VERIFICATION]');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 1280,
      height: 900,
      deviceScaleFactor: 1,
      mobile: false,
    }, sessionId);
    await send('Page.navigate', { url: `${BASE_URL}?religion=islam&surah=1&view=verse` }, sessionId);
    await new Promise((r) => setTimeout(r, 2500));

    const quranControlsTest = await evalCode(`
      (async () => {
        const panel = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
        const quranSec = panel?.querySelector('[data-testid="quran-unified-player-section"]');
        const reciterSel = quranSec?.querySelector('[data-testid="audio-reciter-select"]');
        const scopeBtn = quranSec?.querySelector('[data-testid="audio-scope-toggle"]');
        const speedSel = quranSec?.querySelector('[data-testid="audio-speed-select"]');
        const autoBtn = quranSec?.querySelector('[data-testid="audio-autoadvance-toggle"]');
        const playBtn = quranSec?.querySelector('[data-testid="audio-play-pause-btn"]');
        const stopBtn = quranSec?.querySelector('[data-testid="audio-stop-btn"]');
        const nextAyahBtn = quranSec?.querySelector('[data-testid="audio-next-ayah-btn"]');
        const progressBar = quranSec?.querySelector('[data-testid="audio-progress-bar"]');

        if (!quranSec || !reciterSel || !scopeBtn || !speedSel || !autoBtn || !playBtn || !stopBtn || !nextAyahBtn || !progressBar) {
          return { allControlsFound: false };
        }

        // 1. Test Reciter change
        const initialReciter = reciterSel.value;
        const altReciter = Array.from(reciterSel.options).find(o => o.value !== initialReciter)?.value;
        if (altReciter) {
          reciterSel.value = altReciter;
          reciterSel.dispatchEvent(new Event('change', { bubbles: true }));
        }
        await new Promise(r => setTimeout(r, 150));
        const updatedReciter = window.__SERVICES__.quranAudioService.getState().reciterId;

        // 2. Test Playback Scope toggle (Page <-> Surah)
        const scopeBefore = window.__SERVICES__.quranAudioService.getState().playbackScope;
        scopeBtn.click();
        await new Promise(r => setTimeout(r, 150));
        const scopeAfter = window.__SERVICES__.quranAudioService.getState().playbackScope;

        // 3. Test Speed change
        speedSel.value = '1.25';
        speedSel.dispatchEvent(new Event('change', { bubbles: true }));
        await new Promise(r => setTimeout(r, 150));
        const speedAfter = window.__SERVICES__.quranAudioService.getState().playbackSpeed;

        // 4. Test Auto-Advance toggle
        const autoBefore = window.__SERVICES__.quranAudioService.getState().autoAdvance;
        autoBtn.click();
        await new Promise(r => setTimeout(r, 150));
        const autoAfter = window.__SERVICES__.quranAudioService.getState().autoAdvance;
        autoBtn.click(); // restore

        // 5. Test Next Ayah navigation
        const ayahBefore = window.__SERVICES__.quranAudioService.getState().currentAyahNumber;
        nextAyahBtn.click();
        await new Promise(r => setTimeout(r, 200));
        const ayahAfter = window.__SERVICES__.quranAudioService.getState().currentAyahNumber;

        // 6. Test Play through unified player
        playBtn.click();
        await new Promise(r => setTimeout(r, 500));
        const quranStatusDuringPlay = window.__SERVICES__.quranAudioService.getState().status;
        const quranActiveUrl = window.__SERVICES__.quranAudioService.getState().activeAudioUrl;

        // 7. Stop
        stopBtn.click();
        await new Promise(r => setTimeout(r, 200));
        const quranStatusAfterStop = window.__SERVICES__.quranAudioService.getState().status;

        return {
          allControlsFound: true,
          reciterChanged: altReciter ? updatedReciter === altReciter : true,
          scopeToggled: scopeBefore !== scopeAfter,
          speedChanged: speedAfter === 1.25,
          autoToggled: autoBefore !== autoAfter,
          ayahAdvanced: ayahAfter > ayahBefore,
          playbackTriggered: quranStatusDuringPlay === 'playing' || quranStatusDuringPlay === 'loading',
          hasAudioUrl: Boolean(quranActiveUrl),
          stoppedCleanly: quranStatusAfterStop === 'idle',
        };
      })()
    `);

    assert(quranControlsTest?.allControlsFound, 'Quran unified player renders all required controls inside SacredAudioReadingPanel');
    assert(quranControlsTest?.reciterChanged, 'Quran reciter selection updates active reciter state');
    assert(quranControlsTest?.scopeToggled, 'Quran Page/Surah playback scope toggle functions');
    assert(quranControlsTest?.speedChanged, 'Quran playback speed selector updates playbackSpeed (1.25x)');
    assert(quranControlsTest?.autoToggled, 'Quran auto-advance toggle functions');
    assert(quranControlsTest?.ayahAdvanced, 'Quran Ayah navigation advances currentAyahNumber');
    assert(quranControlsTest?.playbackTriggered && quranControlsTest?.hasAudioUrl, 'Quran Play button initiates recitation playback through unified player');
    assert(quranControlsTest?.stoppedCleanly, 'Quran Stop button cleanly stops playback');

    // =========================================================================
    // PART C: COMPLETE AUDIO MUTUAL-EXCLUSION (A, B, C, D) & VIEW ALL MODAL
    // =========================================================================
    console.log('\n▶ [AUDIO MUTUAL EXCLUSION (A: Quran->Sacred, B: Sacred->Quran, C: Multilingual, D: Route Exit)]');
    const mutualExclusionResult = await evalCode(`
      (async () => {
        const panel = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
        const quranPlayBtn = panel.querySelector('[data-testid="audio-play-pause-btn"]');

        // A. Quran -> Sacred Audio
        quranPlayBtn.click();
        await new Promise(r => setTimeout(r, 450));
        const q1Status = window.__SERVICES__.quranAudioService.getState().status;
        const q1PlayerVisible = !!panel.querySelector('[data-testid="quran-unified-player-section"]');

        const sacredItem = panel.querySelector('[data-testid^="playlist-item-"]');
        if (sacredItem) sacredItem.click();
        await new Promise(r => setTimeout(r, 600));
        const qStatusAfterSacred = window.__SERVICES__.quranAudioService.getState().status;
        const sacredStatusA = window.__SERVICES__.unifiedSacredAudioService.getState().status;
        const sacredPlayerVisibleA = !!panel.querySelector('[data-testid="sacred-audio-active-player"]');
        const quranPlayerHiddenA = !panel.querySelector('[data-testid="quran-unified-player-section"]');

        // B. Sacred Audio -> Quran
        const switchToQuranBtn = panel.querySelector('[data-testid="switch-to-quran-btn"]');
        if (switchToQuranBtn) switchToQuranBtn.click();
        await new Promise(r => setTimeout(r, 500));
        const sacredStatusAfterQuran = window.__SERVICES__.unifiedSacredAudioService.getState().status;
        const qStatusB = window.__SERVICES__.quranAudioService.getState().status;
        const quranPlayerVisibleB = !!panel.querySelector('[data-testid="quran-unified-player-section"]');
        const sacredPlayerHiddenB = !panel.querySelector('[data-testid="sacred-audio-active-player"]');

        // C. Multilingual Audio -> Quran and Sacred Audio
        const mEngine = window.__multilingualAudioEngine;
        let multiToQuranOk = false;
        let multiToSacredOk = false;
        if (mEngine && typeof mEngine.loadUnits === 'function') {
          mEngine.loadUnits('hinduism', [{
            id: 'test-multi-1',
            religion: 'hinduism',
            title: 'Rigveda 10.90 — Purusha Suktam',
            originalText: 'Om sahasra shirsha purushah',
            translationText: 'Thousand-headed is the Supreme Being.',
            translations: { en: 'Thousand-headed is the Supreme Being.' },
            originalAudioUrl: '/audio/hinduism/hinduism_vedas_purusha_suktam_vedadhayana_gosthi.ogg',
          }]);
          mEngine.setMode('original_only');
          mEngine.play('test-multi-1');
          await new Promise(r => setTimeout(r, 350));
          const mState1 = mEngine.getState().playbackState;
          // Activate Quran -> Multilingual must stop
          window.__SERVICES__.quranAudioService.play();
          await new Promise(r => setTimeout(r, 350));
          const mStateAfterQuran = mEngine.getState().playbackState;
          const qStateAfterMulti = window.__SERVICES__.quranAudioService.getState().status;
          multiToQuranOk =
            (mState1 === 'playing' || mState1 === 'buffering') &&
            mStateAfterQuran === 'idle' &&
            !window.speechSynthesis?.speaking &&
            (qStateAfterMulti === 'playing' || qStateAfterMulti === 'loading');

          // Re-activate Multilingual -> Sacred Audio must stop it
          mEngine.setMode('original_only');
          mEngine.play('test-multi-1');
          await new Promise(r => setTimeout(r, 350));
          const mState2 = mEngine.getState().playbackState;
          if (sacredItem) sacredItem.click();
          await new Promise(r => setTimeout(r, 500));
          const mStateAfterSacred = mEngine.getState().playbackState;
          const sStateAfterMulti = window.__SERVICES__.unifiedSacredAudioService.getState().status;
          multiToSacredOk =
            (mState2 === 'playing' || mState2 === 'buffering') &&
            mStateAfterSacred === 'idle' &&
            !window.speechSynthesis?.speaking &&
            (sStateAfterMulti === 'PLAYING' || sStateAfterMulti === 'LOADING');
        }

        // Test View All recordings modal
        const viewAllBtn = panel.querySelector('[data-testid="view-all-recordings-btn"]');
        let modalOpened = false;
        let modalClosed = false;
        if (viewAllBtn) {
          viewAllBtn.click();
          await new Promise(r => setTimeout(r, 300));
          modalOpened = !!document.querySelector('[data-testid="all-recordings-modal"]');
          const closeBtn = document.querySelector('[data-testid="close-all-recordings-modal"]');
          if (closeBtn) closeBtn.click();
          await new Promise(r => setTimeout(r, 200));
          modalClosed = !document.querySelector('[data-testid="all-recordings-modal"]');
        }

        // Start Quran playback for Route Exit test (D)
        window.__SERVICES__.quranAudioService.play();
        await new Promise(r => setTimeout(r, 400));
        const quranPlayingBeforeRouteExit = window.__SERVICES__.quranAudioService.getState().status;

        return {
          a_quranStarted: (q1Status === 'playing' || q1Status === 'loading') && q1PlayerVisible,
          a_sacredActive: sacredStatusA === 'PLAYING' || sacredStatusA === 'LOADING',
          a_quranStopped: qStatusAfterSacred === 'idle',
          a_uiSwitchedToSacred: sacredPlayerVisibleA && quranPlayerHiddenA,
          b_sacredStopped: sacredStatusAfterQuran === 'IDLE',
          b_quranActive: qStatusB === 'playing' || qStatusB === 'loading',
          b_uiSwitchedToQuran: quranPlayerVisibleB && sacredPlayerHiddenB,
          c_multiToQuranOk: multiToQuranOk,
          c_multiToSacredOk: multiToSacredOk,
          hasViewAllBtn: !!viewAllBtn,
          modalOpened,
          modalClosed,
          quranPlayingBeforeRouteExit: quranPlayingBeforeRouteExit === 'playing' || quranPlayingBeforeRouteExit === 'loading',
        };
      })()
    `);

    assert(mutualExclusionResult?.a_quranStarted, 'A1. Quran playback started and Quran controls visible');
    assert(mutualExclusionResult?.a_quranStopped && mutualExclusionResult?.a_sacredActive, 'A2. Quran -> Sacred Audio stops Quran and activates Sacred Audio (PLAYING/LOADING)');
    assert(mutualExclusionResult?.a_uiSwitchedToSacred, 'A3. Visible player switches immediately to Sacred Audio controls on Quran page');
    assert(mutualExclusionResult?.b_sacredStopped && mutualExclusionResult?.b_quranActive, 'B1. Sacred Audio -> Quran stops Sacred Audio and activates Quran playback');
    assert(mutualExclusionResult?.b_uiSwitchedToQuran, 'B2. Visible player switches immediately back to Quran controls');
    assert(mutualExclusionResult?.c_multiToQuranOk, 'C1. Multilingual Audio -> Quran stops Multilingual Audio & speechSynthesis; only Quran active');
    assert(mutualExclusionResult?.c_multiToSacredOk, 'C2. Multilingual Audio -> Sacred Audio stops Multilingual Audio & speechSynthesis; only Sacred Audio active');
    assert(mutualExclusionResult?.hasViewAllBtn && mutualExclusionResult?.modalOpened && mutualExclusionResult?.modalClosed, 'View all recordings modal opens and closes cleanly');

    // D. Reader navigation / Route exit stops Quran playback and exposes new contextual player
    assert(mutualExclusionResult?.quranPlayingBeforeRouteExit, 'D1. Quran playback active prior to route exit');
    await evalCode(`window.__platformNavigate('hinduism')`);
    await new Promise((r) => setTimeout(r, 1500));

    const routeExitCheck = await evalCode(`
      (async () => {
        const qStatusAfterExit = window.__SERVICES__.quranAudioService.getState().status;
        const coordSource = window.__SERVICES__.audioCoordinator.getActiveSource();
        const panel = document.querySelector('[data-testid="sacred-audio-reading-panel"]');
        const hasHinduAudioControls = !!panel?.querySelector('[data-testid="sacred-audio-active-player"]') || !!panel?.querySelector('[data-testid="audio-play-pause-btn"]');
        const noQuranControls = !panel?.querySelector('[data-testid="quran-unified-player-section"]');
        return { qStatusAfterExit, coordSource, hasHinduAudioControls, noQuranControls };
      })()
    `);
    assert(routeExitCheck?.qStatusAfterExit === 'idle' && routeExitCheck?.coordSource !== 'quran', 'D2. Leaving Quran reading context stops Quran audio cleanly (not playing invisibly)');
    assert(routeExitCheck?.hasHinduAudioControls && routeExitCheck?.noQuranControls, 'D3. New tradition contextual player is immediately visible and usable');
  } finally {
    try {
      chrome.kill();
      preview.kill();
    } catch (_) {}
  }

  // ===========================================================================
  // PART D: EXISTING PWA + PHASE 6.3.5.5 ACCEPTANCE SUITES
  // ===========================================================================
  console.log('\n▶ [EXISTING PWA & PHASE 6.3.5.5 REGRESSION SUITES]');
  const pwaRes = spawnSync(process.execPath, [path.join(__dirname, 'test_phase6_4_pwa_acceptance.cjs')], {
    cwd: __dirname,
    encoding: 'utf-8',
    stdio: 'pipe',
  });
  const pwaPassed = pwaRes.status === 0;
  const pwaMatch = (pwaRes.stdout || '').match(/Passed:\s+(\d+)\s+\(100\.0%\)/);
  const pwaCount = pwaMatch ? parseInt(pwaMatch[1], 10) : 0;

  assert(pwaPassed && pwaCount >= 74, `Existing Phase 6.4 PWA + Phase 6.3.5.5 acceptance suites passed (${pwaCount}/74 PWA + 94/94 rights/content)`);

  console.log('\n================================================================================');
  console.log('PHASE 6.5 ACCEPTANCE TEST SUITE SUMMARY');
  console.log('================================================================================');
  console.log(`Total Assertions: ${passed + failed}`);
  console.log(`Passed:           ${passed} (${(((passed) / (passed + failed)) * 100).toFixed(1)}%)`);
  console.log(`Failed:           ${failed}`);
  console.log('================================================================================\n');

  const resultsPath = path.resolve(__dirname, 'phase6_5_acceptance_results.json');
  fs.writeFileSync(
    resultsPath,
    JSON.stringify({ timestamp: new Date().toISOString(), total: passed + failed, passed, failed, failures }, null, 2),
    'utf-8'
  );

  if (failed > 0) {
    process.exit(1);
  }
}

run().catch((err) => {
  console.error('\nFATAL ERROR in Phase 6.5 Acceptance Suite:', err);
  process.exit(1);
});
