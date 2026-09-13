// disable-transpiling

const CACHE = "RANDOM_CACHE_ID"

self.addEventListener("install", e => {
	self.skipWaiting()
})

self.addEventListener("activate", e => {
	e.waitUntil(
		caches.keys().then(keys =>
			Promise.all(
				keys
					.filter(key => key != CACHE)
					.map(key => caches.delete(key))
			)
		)
	)

	self.clients.claim()
})

self.addEventListener("fetch", e => {
	const url = e.request.url

	if (e.request.method != "GET") {
		return // because only GET is supported for caching
	}
	else if (!url.startsWith("http")) {
		return // because we only want to cache http fetches
	}

	e.respondWith(
		caches.match(e.request).then(cached => {
			if (cached) {
				return cached
			}
			else {
				return fetch(e.request).then(r => {
					if (r.ok) {
						const copy = r.clone()

						caches.open(CACHE).then(c => {
							c.put(e.request, copy)
						})
					}

					return r
				})
			}
		})
	)
})
