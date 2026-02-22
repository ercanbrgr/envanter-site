// Service Worker - tamamen devre disi, kendini siliyor
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
    .then(() => self.clients.matchAll({includeUncontrolled:true}))
    .then(clients => clients.forEach(c => c.navigate(c.url)))
  );
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  e.respondWith(fetch(e.request, {cache:'no-store'}));
});
