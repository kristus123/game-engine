let libraryPromise = null
let HlsLibrary = null
let hls = null

function loadHlsLibrary() {
	if (libraryPromise == null) {
		libraryPromise = import("./hls.mjs")
			.then(module => {
				HlsLibrary = module.default
				return HlsLibrary
			})
			.catch(error => {
				console.warn("Could not load locally bundled hls.js; trying native HLS", error)
				return null
			})
	}
	return libraryPromise
}

export class HlsJs {
	static callbacks = {}
	static video = null
	static nativeListeners = null
	static generation = 0

	static get supported() {
		return hls != null
	}

	static get connected() {
		return this.video != null
	}

	static async connect(video, source, callbacks = {}) {
		this.disconnect()
		const generation = this.generation
		this.video = video
		this.callbacks = callbacks

		const library = await loadHlsLibrary()
		if (generation != this.generation || this.video != video) {
			return
		}

		if (library?.isSupported()) {
			if (hls == null) {
				hls = new library()
				hls.on(library.Events.ERROR, (event, data) => {
					console.warn("[HlsJs] HLS playback error", {
						type: data.type,
						details: data.details,
						fatal: data.fatal,
					})
					if (data.fatal && hls.media) {
						this.callbacks.onError?.(new Error("HLS connection interrupted"))
					}
				})
				hls.on(library.Events.MANIFEST_PARSED, () => {
					if (hls.media) {
						this.callbacks.onManifestParsed?.()
					}
				})
			}
			hls.loadSource(source)
			hls.attachMedia(video)
			console.log("[HlsJs] Started bundled HLS.js connection")
			return
		}

		if (!video.canPlayType("application/vnd.apple.mpegurl")) {
			this.disconnect()
			throw new Error("This browser cannot play HLS natively and locally bundled hls.js is unavailable")
		}

		const onReady = () => this.callbacks.onManifestParsed?.()
		const onError = () => this.callbacks.onError?.(new Error("Native HLS playback failed"))
		video.addEventListener("loadedmetadata", onReady)
		video.addEventListener("error", onError)
		this.nativeListeners = { onReady, onError }
		video.src = source
		video.load()
		console.log("[HlsJs] Started native HLS connection")
	}

	static disconnect() {
		this.generation++
		this.callbacks = {}
		hls?.stopLoad()
		if (hls?.media) {
			hls.detachMedia()
		}
		if (this.video && this.nativeListeners) {
			this.video.removeEventListener("loadedmetadata", this.nativeListeners.onReady)
			this.video.removeEventListener("error", this.nativeListeners.onError)
		}
		this.nativeListeners = null
		this.video = null
	}
}
