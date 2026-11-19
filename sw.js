import version from './js/version.js';

const precacheUrls = [
  './css/index.css',
  './js/dist/index.js',
  './index.html',
  './manifest.json',
  './'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    await self.skipWaiting();

    const cache = await caches.open(version);
    await cache.addAll(precacheUrls);
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const cacheNames = await caches.keys();
    const cachesToDelete = cacheNames.filter(cacheName => cacheName !== version);

    if (cachesToDelete.length) {
      await Promise.all(cachesToDelete.map(cacheToDelete => caches.delete(cacheToDelete)));
    }
  })());
});

self.addEventListener('fetch', (event) => {
  event.respondWith((async () => {
    const { request } = event;
    const cacheReponse = await caches.match(request);

    if (cacheReponse) {
      return cacheReponse;
    }
    
    const networkResponse = await fetch(request);
    return networkResponse;
  })());
});
