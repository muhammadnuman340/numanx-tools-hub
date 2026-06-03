const CACHE = 'numanx-tools-v3';
const STATIC_CACHE = 'numanx-static-v3';
const FONT_CACHE = 'numanx-fonts-v1';

const PRECACHE_URLS = ['/', '/tools/', '/offline/'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE_URLS)).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE && k !== STATIC_CACHE && k !== FONT_CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim()),
  );
});

self.addEventListener('activate', () => {
  if (self.registration.navigationPreload) self.registration.navigationPreload.enable();
}, { once: true });

const FONT_ORIGINS = ['fonts.googleapis.com', 'fonts.gstatic.com'];
const STATIC_EXT = /\.(css|js|woff2?|ttf|eot|svg|png|jpg|webp|avif|ico|json)$/;

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const isFont = FONT_ORIGINS.includes(url.hostname);
  const isStatic = STATIC_EXT.test(url.pathname) && url.hostname === self.location.hostname;
  const isNav = request.mode === 'navigate';
  const isSameOrigin = url.origin === self.location.origin;

  // Fonts: cache-first, never update
  if (isFont) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request).then((res) => {
        const clone = res.clone();
        caches.open(FONT_CACHE).then((c) => c.put(request, clone));
        return res;
      })),
    );
    return;
  }

  // Static assets: cache-first with background refresh
  if (isStatic) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const fetchPromise = fetch(request).then((res) => {
          if (res.status === 200) {
            const clone = res.clone();
            caches.open(STATIC_CACHE).then((c) => c.put(request, clone));
          }
          return res;
        }).catch(() => cached);
        return cached || fetchPromise;
      }),
    );
    return;
  }

  // Navigation requests: network-first with preload, cache fallback
  if (isNav || (isSameOrigin && request.destination === 'document')) {
    event.respondWith(
      (async () => {
        try {
          const preloadResponse = await event.preloadResponse;
          if (preloadResponse) return preloadResponse;
          const network = await fetch(request);
          if (network.status === 200) {
            const clone = network.clone();
            caches.open(CACHE).then((c) => c.put(request, clone));
          }
          return network;
        } catch {
          const cached = await caches.match(request);
          if (cached) return cached;
          return caches.match('/offline/');
        }
      })(),
    );
    return;
  }

  // Everything else: network-first, cache fallback
  event.respondWith(
    caches.match(request).then((cached) =>
      fetch(request).then((res) => {
        if (res.status === 200 && isSameOrigin) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(request, clone));
        }
        return res;
      }).catch(() => cached)
    ),
  );
});
