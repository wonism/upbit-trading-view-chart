const cacheName = 'upbit-trading-view';
const filesToCache = [
  '/static/en-tv-chart.1c7535a2aac5ec511ed5.html',
  '/static/ko-tv-chart.1c7535a2aac5ec511ed5.html',
  '/static/bundles/library.4b362457b3a7eceed386.js',
  '/charting_library.min.js',
  '//saveload.tradingview.com/1.1/study_templates?client=tradingview.com&user=public_user_id',
];

self.addEventListener('install', function callback(e) {
  console.log('[ServiceWorker] Install');

  e.waitUntil(
    caches.open(cacheName).then(function callback(cache) {
      console.log('[ServiceWorker] Caching app shell');
      return cache.addAll(filesToCache);
    })
  );
});

self.addEventListener('activate', function callback(event) {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', function callback(event) {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then(function callback(response) {
      return response || fetch(event.request);
    })
  );
});
