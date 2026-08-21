// NBrain Progressive Web App (PWA) Service Worker — High-Performance & Secure Architecture
const CACHE_NAME = 'nbrain-cache-2026-v6-fresh';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/style.min.css?v=20260821_1520',
  '/app.min.js?v=20260821_1520',
  '/manifest.json',
  '/logo.png',
  '/logo-emblem.png',
  '/favicon.png',
  '/nadeem-avatar.png'
];

// Install: Pre-cache core shell
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate: Purge ALL obsolete caches immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-First Strategy to ensure users always receive latest design updates
self.addEventListener('fetch', (event) => {
  if (!event.request || !event.request.url || !event.request.url.startsWith('http')) {
    return;
  }

  const url = new URL(event.request.url);

  // Strictly bypass non-GET, cross-origin requests, and API endpoints
  if (
    event.request.method !== 'GET' ||
    url.origin !== self.location.origin ||
    url.pathname.startsWith('/api/')
  ) {
    return;
  }

  // Network-First with Cache Fallback for all assets
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const copy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        }
        return networkResponse;
      })
      .catch(() => caches.match(event.request).then((res) => res || caches.match('/index.html')))
  );
});
