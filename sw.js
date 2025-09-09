const CACHE_NAME = RANDOM_UUID

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of ['/', '/manifest.json', ...ALL_FILES]) {
        try {
          console.log('Trying to cache', url)
          const resp = await cache.add(url)
          console.log('Cached successfully:', url)
        } catch (e) {
          console.error('Failed to cache', url, e)
        }

        try {
          const fullUrl = 'https://romskip.netlify.app' + url
          console.log('Trying to cache', fullUrl)
          const resp = await cache.add(fullUrl)
          console.log('Cached successfully:', fullUrl)
        } catch (e) {
          console.error('Failed to cache', fullUrl, e)
        }
      }
    })
  )
})


self.addEventListener('activate', e => {
	e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))))
})


self.addEventListener('fetch', e => {
  const url = new URL(e.request.url)
  const pathnameReq = new Request(url.pathname + url.search, e.request)

  e.respondWith(
    caches.match(e.request)
      .then(r => r || caches.match(pathnameReq))
      .then(r => r || fetch(e.request))
      .catch(() => fetch(e.request))
  )
})

