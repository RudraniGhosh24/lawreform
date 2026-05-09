// LawReformer AI — Service Worker for Offline Support
// Caches app shell and legal responses for offline use

const CACHE_NAME = 'lawreformer-ai-v1'
const RESPONSE_CACHE = 'lawreformer-responses-v1'

// App shell files to cache
const APP_SHELL = [
  '/',
  '/offline',
]

// Install — cache app shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  )
  self.skipWaiting()
})

// Activate — clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME && k !== RESPONSE_CACHE).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

// Fetch — serve from cache, cache API responses
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // Cache API responses for offline replay
  if (url.pathname === '/api/ask' && event.request.method === 'POST') {
    event.respondWith(
      fetch(event.request.clone()).then((response) => {
        // Clone and cache the response
        const responseClone = response.clone()
        event.request.clone().text().then((body) => {
          const key = JSON.parse(body).question || ''
          if (key) {
            caches.open(RESPONSE_CACHE).then((cache) => {
              cache.put(new Request(`/cached-response/${encodeURIComponent(key)}`), responseClone)
            })
          }
        })
        return response
      }).catch(() => {
        // Offline — try to find cached response
        return event.request.clone().text().then((body) => {
          const key = JSON.parse(body).question || ''
          return caches.open(RESPONSE_CACHE).then((cache) =>
            cache.match(new Request(`/cached-response/${encodeURIComponent(key)}`))
          ).then((cached) => {
            if (cached) return cached
            // Return offline message
            return new Response(
              `data: ${JSON.stringify({ token: "⚠️ You are offline. This answer is not available in cache. Please connect to the internet and try again." })}\n\ndata: ${JSON.stringify({ done: true })}\n\n`,
              { headers: { 'Content-Type': 'text/event-stream' } }
            )
          })
        })
      })
    )
    return
  }

  // For other requests — network first, cache fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  )
})
