import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

// ==============================================================================
// Vite Configuration — Jafri Multilingual Religious Books & Audio Platform
// UmmahAPI operates as zero-key primary provider directly from the client.
// AlQuran Cloud operates without API keys directly from the client.
// Adhan-JS operates locally in the browser runtime.
// The retired IslamicAPI proxy has been safely decommissioned.
//
// Command 21 Release Gate Plugin:
// Excludes non-production POCs, test audio, QA reviews, and the 281 MB LiteRT
// model from the standard production deployment bundle (dist/).
// In production, neural models are loaded on-demand via official Hugging Face CDN.
// ==============================================================================

function excludeDevAssetsPlugin(): Plugin {
  return {
    name: 'exclude-dev-assets',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      const excludedTargets = [
        'kokoro_spanish_poc',
        'neural_tts_samples',
        'mushaf-reviews',
        'browser_speech_poc.html',
        'browser_speech_poc_v1.html',
        'neural_tts_review.html',
        'voice_listening_evaluation.html',
      ];

      for (const target of excludedTargets) {
        const fullPath = path.join(distDir, target);
        if (fs.existsSync(fullPath)) {
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            fs.rmSync(fullPath, { recursive: true, force: true });
          } else {
            fs.unlinkSync(fullPath);
          }
        }
      }
    },
  };
}

function pwaPlugin(basePath: string): Plugin {
  return {
    name: 'jafri-pwa-generator',
    closeBundle() {
      const distDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(distDir)) return;

      const normalizedBase = basePath.endsWith('/') ? basePath : `${basePath}/`;

      // Collect asset files from dist/assets
      const assetsDir = path.join(distDir, 'assets');
      const assetFiles = fs.existsSync(assetsDir)
        ? fs.readdirSync(assetsDir).map((f) => `assets/${f}`)
        : [];

      // Collect Gita chapters
      const gitaDir = path.join(distDir, 'data', 'gita');
      const gitaFiles = fs.existsSync(gitaDir)
        ? fs.readdirSync(gitaDir).filter((f) => f.endsWith('.json')).map((f) => `data/gita/${f}`)
        : [];

      // Core shell files
      const candidateFiles = [
        'index.html',
        'manifest.webmanifest',
        'favicon.svg',
        'icons/icon-192x192.png',
        'icons/icon-512x512.png',
        'icons/icon-maskable-512x512.png',
        'brand/jafri-logo.svg',
        'brand/seljuk-star.svg',
        'fonts/indopak-nastaleeq.woff2',
        'data/13-line/surah-index.json',
        'data/15-line/surah-index.json',
        ...gitaFiles,
        ...assetFiles,
      ];

      // Keep only files that actually exist in dist
      const validFiles = candidateFiles.filter((relPath) =>
        fs.existsSync(path.join(distDir, relPath))
      );

      // Compute deterministic build hash from asset filenames & sizes
      const hash = crypto.createHash('sha256');
      for (const relPath of validFiles) {
        const stat = fs.statSync(path.join(distDir, relPath));
        hash.update(`${relPath}:${stat.size}:${stat.mtimeMs}`);
      }
      const buildHash = hash.digest('hex').slice(0, 10);
      const cacheName = `jafri-sacred-library-shell-v1-${buildHash}`;

      const precacheUrls = [
        normalizedBase,
        ...validFiles.map((relPath) => `${normalizedBase}${relPath.replace(/^\//, '')}`),
      ];

      const swContent = `/**
 * Jafri Sacred Library — Service Worker
 * Phase 6.4: Installable Offline-First PWA Foundation
 *
 * Cache Name: ${cacheName}
 * Generated: ${new Date().toISOString()}
 */

const CACHE_NAME = '${cacheName}';
const CACHE_PREFIX = 'jafri-sacred-library-shell-';
const BASE_PATH = '${normalizedBase}';
const APP_SHELL_ENTRY = '${normalizedBase}index.html';

const PRECACHE_URLS = ${JSON.stringify(precacheUrls, null, 2)};

// 1. INSTALL: Precache application shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const url of PRECACHE_URLS) {
        try {
          const response = await fetch(url, { cache: 'no-cache' });
          if (response.ok) {
            await cache.put(url, response);
          }
        } catch (err) {
          console.warn('[SW] Precache skipped for ' + url + ':', err);
        }
      }
      const entryResp = await cache.match(APP_SHELL_ENTRY);
      if (entryResp) {
        const hasBase = await cache.match(BASE_PATH);
        if (!hasBase) {
          await cache.put(BASE_PATH, entryResp.clone());
        }
      }
      return self.skipWaiting();
    })()
  );
});

// 2. ACTIVATE: Purge obsolete caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
            console.info('[SW] Purging obsolete cache:', key);
            return caches.delete(key);
          }
          return Promise.resolve();
        })
      );
      return self.clients.claim();
    })()
  );
});

// 3. FETCH: Scope & origin isolation, network-first navigation, cache-first static
self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // STRICT ISOLATION: Discard cross-origin requests immediately
  if (url.origin !== self.location.origin) return;

  // STRICT SCOPE: Only intercept within application base path
  if (!url.pathname.startsWith(BASE_PATH)) return;

  // RIGHTS & QUARANTINE: Never cache external/large audio media streams
  if (
    url.pathname.includes('/audio/') ||
    url.pathname.endsWith('.mp3') ||
    url.pathname.endsWith('.m4a') ||
    url.pathname.endsWith('.ogg') ||
    url.pathname.endsWith('.wav')
  ) {
    return;
  }

  // SPA NAVIGATION: Network-first with cached index.html fallback
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const networkResponse = await fetch(request);
          if (networkResponse && networkResponse.ok) {
            return networkResponse;
          }
        } catch (error) {
          // Fall through to cache on network failure
        }
        const cache = await caches.open(CACHE_NAME);
        const fallback = (await cache.match(APP_SHELL_ENTRY)) || (await cache.match(BASE_PATH));
        if (fallback) {
          return fallback;
        }
        return new Response('Offline: Jafri Sacred Library entry point unavailable', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: { 'Content-Type': 'text/plain' },
        });
      })()
    );
    return;
  }

  // STATIC ASSETS: Cache-first with network fallback
  event.respondWith(
    (async () => {
      const cached = await caches.match(request);
      if (cached) return cached;

      try {
        const response = await fetch(request);
        if (
          response &&
          response.status === 200 &&
          response.type === 'basic' &&
          url.origin === self.location.origin &&
          url.pathname.startsWith(BASE_PATH)
        ) {
          const clone = response.clone();
          const cache = await caches.open(CACHE_NAME);
          cache.put(request, clone);
        }
        return response;
      } catch (err) {
        return new Response('Resource offline unavailable', {
          status: 503,
          statusText: 'Service Unavailable',
        });
      }
    })()
  );
});
`;

      fs.writeFileSync(path.join(distDir, 'sw.js'), swContent, 'utf-8');

      const publicDir = path.resolve(__dirname, 'public');
      if (fs.existsSync(publicDir)) {
        fs.writeFileSync(path.join(publicDir, 'sw.js'), swContent, 'utf-8');
      }
      console.log(`[PWA Plugin] Generated sw.js (${cacheName}) with ${precacheUrls.length} assets.`);
    },
  };
}

export default defineConfig(({ command }) => {
  const basePath = process.env.VITE_BASE_PATH || (command === 'build' ? '/jafri-islamic-resources/' : '/');
  return {
    base: basePath,
    plugins: [react(), excludeDevAssetsPlugin(), pwaPlugin(basePath)],
    server: {
      port: 5173,
      host: true,
    },
  };
});
