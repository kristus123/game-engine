const CACHE_NAME = RANDOM_UUID

const CACHE_NAME = 'app-cache-v2'

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of ALL_FILES.concat(['/'])) {
        try {
          await cache.add(url)
        } catch (e) {
          console.error('Failed to cache', url, e)
        }
      }
    })
  )
})

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
    )
  )
})

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  )
})

