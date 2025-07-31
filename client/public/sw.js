// Dumee Service Worker for PWA functionality
const CACHE_NAME = 'dumee-v1';
const OFFLINE_URL = '/offline.html';

// Assets to cache for offline functionality
const urlsToCache = [
  '/',
  '/manifest.json',
  '/assets/dumee-favicon-32x32.png',
  '/assets/dumee-apple-touch-icon-180x180.png',
  OFFLINE_URL
];

// Install event - cache essential assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Dumee SW: Caching app shell');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Dumee SW: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;

  // Skip API calls (let them fail gracefully)
  if (event.request.url.includes('/api/')) return;

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request).catch(() => {
          // If both cache and network fail, show offline page
          if (event.request.destination === 'document') {
            return caches.match(OFFLINE_URL);
          }
        });
      })
  );
});

// Background sync for message queue when back online
self.addEventListener('sync', (event) => {
  if (event.tag === 'dumee-message-sync') {
    event.waitUntil(
      // Handle queued messages when connection is restored
      handleBackgroundSync()
    );
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New message from Dumee!',
    icon: '/assets/dumee-favicon-32x32.png',
    badge: '/assets/dumee-favicon-16x16.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'Open Dumee',
        icon: '/assets/dumee-favicon-16x16.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/dumee-favicon-16x16.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Dumee', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper function for background sync
async function handleBackgroundSync() {
  try {
    // Implementation for syncing queued messages
    console.log('Dumee SW: Background sync triggered');
    // Add your message queue sync logic here
  } catch (error) {
    console.error('Dumee SW: Background sync failed:', error);
  }
}