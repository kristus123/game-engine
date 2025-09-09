const CACHE_NAME = RANDOM_UUID

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async cache => {
      for (const url of ['/', '/manifest.json', ...ALL_FILES]) {
        for (const base of ['', 'https://romskip.netlify.app']) {
          const fullUrl = base + url
          try {
            console.log('Trying to cache', fullUrl)
            const resp = await fetch(fullUrl)
            if (!resp.ok) throw new Error('HTTP ' + resp.status)
            const cloned = resp.clone()
            await cache.put(fullUrl, cloned)
            const text = await resp.text().catch(() => '[body not text]')
            console.log('Cached successfully:', fullUrl, 'Status:', resp.status, 'Body preview:', text.slice(0,100))
          } catch (e) {
            console.error('Failed to cache', fullUrl, e)
          }
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
    const pathnameReq = url.pathname + url.search

    e.respondWith(
        caches.match(e.request)
        .then(r => r || caches.match(pathnameReq) || caches.match(url.pathname)  || caches.match(e.request.url))
        .then(r => r || fetch(e.request))
        .catch(() => fetch(e.request))
    )
})

