// no-transpiling

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
	// console.log(url)

	if (e.request.method != "GET") { // only GET is supported for caching
		return
	}
	else if (url.includes("http://localhost:5050")) { // todo improve later
		return
	}
	else if (!url.includes(".netlify.app")) {
		e.respondWith(
			caches.match(e.request).then(cached => {
				if (cached) {
					return cached
				}

				return fetch(e.request).then(response => {
					if (response.ok) {
						const copy = response.clone()

						caches.open(CACHE).then(cache => {
							cache.put(e.request, copy)
						})
					}

					return response
				})
			})
		)
	}
})
