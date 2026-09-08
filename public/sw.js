// Basic service worker to satisfy PWA requirements
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', () => {
  console.log('Service Worker activated');
});

self.addEventListener('fetch', (event) => {
  // Let the browser do its default thing
  // for non-GET requests.
});
