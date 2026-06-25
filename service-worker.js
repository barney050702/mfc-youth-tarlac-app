const CACHE_NAME = 'mfc-youth-cache-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './js/firebase-config.js',
  './logo.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', event => {
  // Only intercept GET requests, skip Firestore/Auth API calls
  if (event.request.method !== 'GET' || event.request.url.includes('firestore') || event.request.url.includes('identitytoolkit')) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request).then(
          function(response) {
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            var responseToCache = response.clone();
            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });
            return response;
          }
        );
      })
  );
});