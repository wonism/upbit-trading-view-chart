var cacheName = 'upbit-trading-view';
var filesToCache = [
  '/',
  '/index.html',
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function (event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(function (response) {
      return response || fetch(event.request);
    })
  );
});
