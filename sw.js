const CACHE_NAME = 'v1ss'

const FILES_TO_CACHE = [
	'/',
	'/manifest.json',
	...ALL_FILES.filter(f => !f.endsWith('.md'))
]

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(async cache => {
  	for (const url of FILES_TO_CACHE) {
    	try {
      	const resp = await fetch(url)
      	if (!resp.ok) {
						throw new Error('HTTP ' + resp.status)
					}
      	await cache.put(url, resp.clone())
      	console.log('Cached:', url)
    	}
				catch (e) {
      	console.error('Failed to cache', url, e)
    	}
  	}
		})
	)
})

self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(keys =>
  	Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
		)
	)
})

self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(r => {
  	if (r) {
				return r
			}
  	return fetch(event.request).catch(() => {
    	console.error('Not cached:', event.request.url)
    	throw new Error('Not cached: ' + event.request.url)
  	})
		})
	)
})

