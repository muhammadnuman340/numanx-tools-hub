// FILE: public/sw.js — Network-First HTML + Cache-First Static Bundle PWA Service Worker v2
const CACHE_VERSION = 'numanx-v2026-10-ultra';
const CORE_PRECACHE = [
  '/',
  '/tools/',
  '/tools/qr-generator/',
  '/tools/word-counter/',
  '/tools/hashtag-generator/',
  '/manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE_VERSION).then((c) => c.addAll(CORE_PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { request } = e;
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) return;
  if (
    request.url.includes('robots.txt') ||
    request.url.includes('sitemap') ||
    request.url.includes('llms.txt')
  ) {
    return;
  }

  if (request.mode === 'navigate') {
    e.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request).then((r) => r || caches.match('/')))
    );
  } else {
    e.respondWith(caches.match(request).then((r) => r || fetch(request)));
  }
});
