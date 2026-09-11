const CACHE = "app-v1"

self.addEventListener("install", event => {
	self.skipWaiting()
})

self.addEventListener("activate", event => {
	event.waitUntil(
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

self.addEventListener("fetch", event => {
	if (event.request.method != "GET") {
		return
	}

	event.respondWith(
		caches.match(event.request).then(cached => {
			if (cached) {
				return cached
			}

			return fetch(event.request).then(response => {
				if (response.ok) {
					const copy = response.clone()

					caches.open(CACHE).then(cache => {
						cache.put(event.request, copy)
					})
				}

				return response
			})
		})
	)
})
