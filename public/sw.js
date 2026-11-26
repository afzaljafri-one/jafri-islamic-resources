/**
 * Jafri Sacred Library — Service Worker
 * Phase 6.4: Installable Offline-First PWA Foundation
 *
 * Cache Name: jafri-sacred-library-shell-v1-1b5d81ed21
 * Generated: 2026-11-26T10:38:48.235Z
 */

const CACHE_NAME = 'jafri-sacred-library-shell-v1-1b5d81ed21';
const CACHE_PREFIX = 'jafri-sacred-library-shell-';
const BASE_PATH = '/jafri-islamic-resources/';
const APP_SHELL_ENTRY = '/jafri-islamic-resources/index.html';

const PRECACHE_URLS = [
  "/jafri-islamic-resources/",
  "/jafri-islamic-resources/index.html",
  "/jafri-islamic-resources/manifest.webmanifest",
  "/jafri-islamic-resources/favicon.svg",
  "/jafri-islamic-resources/icons/icon-192x192.png",
  "/jafri-islamic-resources/icons/icon-512x512.png",
  "/jafri-islamic-resources/icons/icon-maskable-512x512.png",
  "/jafri-islamic-resources/brand/jafri-logo.svg",
  "/jafri-islamic-resources/brand/seljuk-star.svg",
  "/jafri-islamic-resources/fonts/indopak-nastaleeq.woff2",
  "/jafri-islamic-resources/data/13-line/surah-index.json",
  "/jafri-islamic-resources/data/15-line/surah-index.json",
  "/jafri-islamic-resources/data/gita/chapter_1.json",
  "/jafri-islamic-resources/data/gita/chapter_10.json",
  "/jafri-islamic-resources/data/gita/chapter_11.json",
  "/jafri-islamic-resources/data/gita/chapter_12.json",
  "/jafri-islamic-resources/data/gita/chapter_13.json",
  "/jafri-islamic-resources/data/gita/chapter_14.json",
  "/jafri-islamic-resources/data/gita/chapter_15.json",
  "/jafri-islamic-resources/data/gita/chapter_16.json",
  "/jafri-islamic-resources/data/gita/chapter_17.json",
  "/jafri-islamic-resources/data/gita/chapter_18.json",
  "/jafri-islamic-resources/data/gita/chapter_2.json",
  "/jafri-islamic-resources/data/gita/chapter_3.json",
  "/jafri-islamic-resources/data/gita/chapter_4.json",
  "/jafri-islamic-resources/data/gita/chapter_5.json",
  "/jafri-islamic-resources/data/gita/chapter_6.json",
  "/jafri-islamic-resources/data/gita/chapter_7.json",
  "/jafri-islamic-resources/data/gita/chapter_8.json",
  "/jafri-islamic-resources/data/gita/chapter_9.json",
  "/jafri-islamic-resources/assets/index-BrH56JM8.css",
  "/jafri-islamic-resources/assets/index-By0o-qXH.js"
];

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
