/**
 * Jafri Sacred Library — Service Worker Registration
 * Phase 6.4: Installable Offline-First PWA Foundation
 *
 * Registers the production service worker within the repository base path scope:
 * /jafri-islamic-resources/
 */

export function registerServiceWorker(): void {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  // Ensure base path formatting
  const rawBase =
    (typeof import.meta !== 'undefined' && (import.meta as any).env?.BASE_URL) ||
    '/jafri-islamic-resources/';
  const basePath = rawBase.endsWith('/') ? rawBase : `${rawBase}/`;
  const swUrl = `${basePath}sw.js`;

  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register(swUrl, { scope: basePath })
      .then((registration) => {
        // Expose registration for testing & debugging
        (window as any).__SW_REGISTRATION__ = registration;

        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (!installingWorker) return;

          installingWorker.addEventListener('statechange', () => {
            if (installingWorker.state === 'installed') {
              if (navigator.serviceWorker.controller) {
                console.info('[PWA] New content is available; will activate on next visit.');
              } else {
                console.info('[PWA] Content is precached for offline use.');
              }
            }
          });
        });
      })
      .catch((error) => {
        console.warn('[PWA] Service worker registration failed:', error);
      });
  });
}
