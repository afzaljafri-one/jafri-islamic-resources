/**
 * ==============================================================================
 * Shared Idempotent Audio URL Resolver
 * Jafri Sacred Audio Library Platform
 *
 * Guarantees zero missing and zero duplicated base paths across Local Dev and GitHub Pages.
 * Preserves remote HTTPS, HTTP, protocol-relative, data, and blob URLs untouched.
 * ==============================================================================
 */

export function resolveAudioUrl(urlOrPath: string): string {
  if (!urlOrPath) return '';

  // 1. Preserve absolute remote streams (https:, http:, //), data URLs, and blob URLs
  if (/^(?:https?:)?\/\//i.test(urlOrPath) || urlOrPath.startsWith('data:') || urlOrPath.startsWith('blob:')) {
    return urlOrPath;
  }

  // 2. Strip leading 'public/' if present, then strip all leading slashes
  const cleanPath = urlOrPath.replace(/^public\//, '').replace(/^\/+/, '');

  // 3. Normalize base path from Vite environment (strip trailing slash)
  const rawBase = (typeof import.meta !== 'undefined' && (import.meta as any).env?.BASE_URL) || '/';
  const base = rawBase === '/' ? '' : rawBase.replace(/\/$/, '');

  // 4. Idempotency check: if cleanPath already begins with base segment, do NOT prepend base again
  const baseSegment = base.replace(/^\/+/, '');
  if (baseSegment && (cleanPath === baseSegment || cleanPath.startsWith(baseSegment + '/'))) {
    return `/${cleanPath}`;
  }

  // 5. Prepend base if defined, otherwise return standard root-relative path
  return base ? `${base}/${cleanPath}` : `/${cleanPath}`;
}
