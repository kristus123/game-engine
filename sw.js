const CACHE_NAME = 'v1ss'

const FILES_TO_CACHE = [
	'/',
	'/manifest.json',
	...['//home/Nabir14/code/game-engine/build_tools/Aseprite.js', '//home/Nabir14/code/game-engine/build_tools/Files.js', '//home/Nabir14/code/game-engine/build_tools/Imports.js', '//home/Nabir14/code/game-engine/build_tools/Parameters.js', '//home/Nabir14/code/game-engine/build_tools/RandomId.js', '//home/Nabir14/code/game-engine/build_tools/Runner.js', '//home/Nabir14/code/game-engine/build_tools/aseprite_to_json.lua', '//home/Nabir14/code/game-engine/build_tools/assert_unique_file_names.js', '//home/Nabir14/code/game-engine/build_tools/copy_manifest_to_dist.js', '//home/Nabir14/code/game-engine/build_tools/export_aseprite.js', '//home/Nabir14/code/game-engine/build_tools/generate_dist.js', '//home/Nabir14/code/game-engine/build_tools/js_files.js', '//home/Nabir14/code/game-engine/build_tools/reservedJsKeywords.js', '//home/Nabir14/code/game-engine/build_tools/transpiler.js', '//home/Nabir14/code/game-engine/build_tools/update_eslint.js', '//home/Nabir14/code/game-engine/build_tools/verify_no_reserved_clashes.js'].filter(f => !f.endsWith('.md'))
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
