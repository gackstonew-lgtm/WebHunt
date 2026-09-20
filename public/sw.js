/**
 * WebHunt Production Progressive Web App Service Worker
 * Version: webhunt-pwa-v2
 * Conservative Caching Policy:
 * - Static Assets: Cache -> Network Fallback (safe public resources & immutable chunks)
 * - Navigation: Network -> Offline Fallback (/offline.html)
 * - Dynamic Lead Radar & APIs: Strictly Network-Only (No stale lead data or cached auth)
 */

const CACHE_NAME = 'webhunt-pwa-v2';
const OFFLINE_URL = '/offline.html';

const PRECACHE_ASSETS = [
  OFFLINE_URL,
  '/manifest.webmanifest',
  '/manifest.json',
  '/icon.svg',
  '/favicon.ico',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/apple-touch-icon.png',
  '/icons/maskable-192.png',
  '/icons/maskable-512.png',
];

// Fallback markup in the unlikely event the cache storage fails
const OFFLINE_HTML_FALLBACK = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <meta name="theme-color" content="#050505">
  <title>WebHunt | Offline</title>
  <style>
    body {
      margin: 0;
      padding: 24px 16px;
      min-height: 100vh;
      background-color: #050505;
      color: #F2F7F3;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .card {
      max-width: 440px;
      background-color: #121212;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      padding: 32px 24px;
      text-align: center;
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.9);
    }
    h1 { font-size: 20px; font-weight: 700; margin: 0 0 10px 0; color: #F2F7F3; }
    p { font-size: 13px; line-height: 1.6; color: #8EA79C; margin: 0 0 24px 0; }
    button {
      background-color: #0251B8;
      color: #FFFFFF;
      border: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 13px;
      font-weight: 600;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>You Are Currently Offline</h1>
    <p>WebHunt live lead discovery radar and search tools require an active internet connection.</p>
    <button onclick="window.location.reload()">Retry Connection</button>
  </div>
</body>
</html>`;

// 1. Install Event: Precache static core assets strictly without swallowing missing files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
  self.skipWaiting();
});

// 2. Activate Event: Clean up outdated caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[PWA ServiceWorker] Purging outdated cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event: Conservative routing
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle standard http and https requests
  if (!request.url.startsWith('http://') && !request.url.startsWith('https://')) {
    return;
  }

  // Non-GET requests (POST, PUT, DELETE, PATCH) pass directly through to network
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);

  // A. Strictly Network-Only for dynamic APIs, Auth, and Server Actions
  // Never cache authentication tokens, private session data, or search results
  if (
    url.pathname.startsWith('/api/') ||
    request.headers.get('Next-Action') ||
    url.searchParams.has('_rsc')
  ) {
    event.respondWith(
      fetch(request).catch(() => {
        return new Response(
          JSON.stringify({
            error: 'You are currently offline. WebHunt live lead discovery requires an active internet connection.',
            offline: true,
          }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      })
    );
    return;
  }

  // B. Cache -> Network Fallback for safe static immutable assets
  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname === '/icon.svg' ||
    url.pathname === '/favicon.ico' ||
    url.pathname === '/manifest.webmanifest' ||
    url.pathname === '/manifest.json' ||
    url.pathname === '/offline.html' ||
    url.pathname.endsWith('.woff2') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.png') ||
    url.pathname.endsWith('.jpg') ||
    url.pathname.endsWith('.jpeg') ||
    url.pathname.endsWith('.svg') ||
    url.pathname.endsWith('.ico')
  ) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, responseToCache));
          return networkResponse;
        });
      })
    );
    return;
  }

  // C. Network-First for HTML Page Navigation with Offline Fallback
  // Preserves fresh production app and prevents caching private authenticated views
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const cachedOffline = await cache.match(OFFLINE_URL);
        if (cachedOffline) {
          return cachedOffline;
        }
        return new Response(OFFLINE_HTML_FALLBACK, {
          headers: { 'Content-Type': 'text/html; charset=utf-8' },
        });
      })
    );
    return;
  }
});
