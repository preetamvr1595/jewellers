// Aura Jewellers - Service Worker Cache
const CACHE_NAME = 'aura-v1.0.0'
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/collections.html',
  '/offers.html',
  '/heritage.html',
  '/calculator.html',
  '/global.css',
  '/global.js',
  '/manifest.json'
]

// Install event - Pre-cache core shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS)
    }).then(() => self.skipWaiting())
  )
})

// Activate event - Clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    }).then(() => self.clients.claim())
  )
})

// Fetch event - Network-first with cache fallback for HTML, Cache-first for static styles
self.addEventListener('fetch', (event) => {
  const requestUrl = new URL(event.request.url)

  // Skip non-GET requests and API calls
  if (event.request.method !== 'GET' || requestUrl.pathname.startsWith('/api')) {
    return
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        // Fetch fresh copy in background for next time
        fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse))
          }
        }).catch(() => {})
        return cachedResponse
      }

      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
          return networkResponse
        }
        const responseToCache = networkResponse.clone()
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseToCache))
        return networkResponse
      })
    })
  )
})
