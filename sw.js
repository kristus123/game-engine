const CACHE_NAME = RANDOM_UUID

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(async cache => {
			for (const url of ['/', '/manifest.json', ...ALL_FILES]) {

				console.log("caching " + url)

				await Promise.all([
					cache.add(url)
						.catch(e => console.error('Failed to cache', url, e)),
					cache.add('https://romskip.netlify.app' + url)
						.catch(e => console.error('Failed to cache ROMSKIP.NETLIFY.APP', url, e)),
				])
			}
		})
	)
})

self.addEventListener('activate', e => {
	e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))))
})


self.addEventListener('fetch', e => {
    const url = new URL(e.request.url)
    const relativeRequest = new Request(url.pathname, e.request)
    
    e.respondWith(
        caches.match(relativeRequest)
            .then(response => response || fetch(relativeRequest))
            .catch(err => {
                console.error('Fetch handler error for URL:', relativeRequest.url, err);
                return fetch(relativeRequest);
            })
    )
})

