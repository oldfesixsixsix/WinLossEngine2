// Rockman X4 Tracker - SERVICE WORKER (sw.js)
const CACHE_NAME = 'x4-retro-tracker-v1';
const PRECACHE_RESOURCES = [
  '/',
  '/index.html',
  '/src/app.js',
  '/src/index.css',
  '/manifest.json',
  '/uploads/rockman_win.png',
  '/uploads/zero_lose.png',
  '/uploads/tie_meme.png'
];

const isDev = self.location.hostname.includes('localhost') || 
              self.location.hostname.includes('127.0.0.1') || 
              self.location.hostname.includes('ais-dev') || 
              self.location.hostname.includes('ais-pre');

// Perform install & cache core shells
self.addEventListener('install', (event) => {
  if (isDev) {
    self.skipWaiting();
    return;
  }
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[X4 ServiceWorker] Pre-caching offline web shells...');
      return cache.addAll(PRECACHE_RESOURCES).catch(err => {
        console.warn('Pre-cache skipped some dynamic paths: ', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate & clean stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME || isDev) {
            console.log('[X4 ServiceWorker] Erasing outdated web cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Strategic cache delivery policies: Network-First for APIs, Cache-First for static assets
self.addEventListener('fetch', (event) => {
  if (isDev) {
    return; // Pass directly to network
  }

  const requestUrl = new URL(event.request.url);

  // Bypass database commands and image upload records directly to the online server
  if (requestUrl.pathname.startsWith('/api/') || event.request.method !== 'GET') {
    return; // Pass through to network
  }

  // Intercept other GET assets
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      
      return fetch(event.request).then((networkResponse) => {
        // Cache newly evaluated public images / fonts on the fly
        if (
          networkResponse.status === 200 &&
          (requestUrl.pathname.startsWith('/src/') ||
           requestUrl.pathname.startsWith('/uploads/') ||
           event.request.url.includes('fonts.googleapis.com') ||
           event.request.url.includes('fonts.gstatic.com'))
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fail-safe default offline return for html pages
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
