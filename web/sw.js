/* Portal Shoot service worker: offline play + instant loads.
   - The game page itself is NETWORK-FIRST, so every new upload reaches players on their next open
     (falls back to the cached copy when offline).
   - Icons/manifest: cache-first. Google Fonts: cached after first use.
   - Analytics requests are never cached or intercepted.
   ► When you upload a new version you don't need to touch this file. */
const VERSION = 'ps-0.10.0';
const SHELL = ['./', './index.html', './manifest.webmanifest',
  './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-192.png',
  './icons/icon-maskable-512.png', './icons/apple-touch-icon.png', './icons/favicon-32.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION && k !== 'ps-fonts').map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request, url = new URL(req.url);
  if (req.method !== 'GET') return;
  if (/google-analytics\.com|googletagmanager\.com|analytics\.google\.com/.test(url.host)) return;   // never touch analytics
  // the game page: network first (fresh updates), offline fallback to cache
  if (req.mode === 'navigate') {
    e.respondWith(fetch(req).then(res => {
      const copy = res.clone(); caches.open(VERSION).then(c => c.put('./index.html', copy)); return res;
    }).catch(() => caches.match('./index.html').then(r => r || caches.match('./'))));
    return;
  }
  // Google Fonts: stale-while-revalidate
  if (/fonts\.(googleapis|gstatic)\.com/.test(url.host)) {
    e.respondWith(caches.open('ps-fonts').then(c => c.match(req).then(hit => {
      const net = fetch(req).then(res => { if (res.ok || res.type === 'opaque') c.put(req, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    })));
    return;
  }
  // own static files: cache first
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => {
      if (res.ok) { const copy = res.clone(); caches.open(VERSION).then(c => c.put(req, copy)); } return res;
    })));
  }
});
