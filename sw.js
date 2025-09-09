const CACHE_NAME = RANDOM_UUID

self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(async cache => {
			for (const url of ['/', ...ALL_FILES]) {

				try {
					await cache.add(url)
				}
				catch (e) {
					console.error('Failed to cache', url, e)
				}

				try {
					await cache.add('https://romskip.netlify.app' + url)
				}
				catch (e) {
					console.error('Failed to cache ROMSKIP.NETLIFY.APP', url, e)
				}
			}
		})
	)
})

self.addEventListener('activate', e => {
	e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))))
})

self.addEventListener('fetch', e => {
    e.respondWith(
        caches.match(e.request)
            .then(response => response || fetch(e.request))
            .catch(err => {
                console.error('Fetch handler error:', err);
                return fetch(e.request);
            })
    );
});

