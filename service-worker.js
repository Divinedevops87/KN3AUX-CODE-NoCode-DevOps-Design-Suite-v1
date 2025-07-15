
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('kn3aux-cache-v1').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './style.css',
        './script.js',
        './assets/logo.png'
      ]);
    })
  );
});
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
