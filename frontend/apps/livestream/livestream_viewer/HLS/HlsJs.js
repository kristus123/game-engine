let libraryPromise = null
let hls = null

function loadHlsLibrary() {
	if (libraryPromise == null) {
		libraryPromise = import("./hls.mjs")
			.then(module => module.default)
			.catch(error => {
				console.warn("Could not load locally bundled hls.js", { message: error.message })
				return null
			})
	}
	return libraryPromise
}

export class HlsJs {
	static callbacks = {}
	static video = null
	static source = null
	static listeners = null
	static engine = null
	static nativeSupported = false
	static attempted = new Set()
	static generation = 0

	static get supported() {
		return hls != null
	}

	static get connected() {
		return this.video != null
	}

	static async connect(video, source, callbacks = {}) {
		this.disconnect()
		this.video = video
		this.source = source
		this.callbacks = callbacks
		this.nativeSupported = ["application/vnd.apple.mpegurl", "application/x-mpegURL"]
			.some(type => ["maybe", "probably"].includes(video.canPlayType(type)))
		this.attempted = new Set()
		await this.startEngine(this.nativeSupported ? "native" : "hls.js")
	}

	static async startEngine(engine) {
		this.stopEngine()
		const generation = ++this.generation
		const video = this.video
		this.engine = engine
		this.attempted.add(engine)

		try {
			let library
			if engine == "hls.js" {
				library = await loadHlsLibrary()
				if generation != this.generation || this.video != video {
					return
				}
				if !library?.isSupported() {
					throw new Error("This browser has no available HLS playback engine")
				}
			}

			const onError = () => {
				if generation == this.generation && video.error {
					this.handleFailure(Object.assign(new Error(video.error.message || "Video playback failed"), {
						code: video.error.code,
					}))
				}
			}
			const onReady = () => this.callbacks.onManifestParsed?.()
			video.addEventListener("error", onError)
			this.listeners = { onError, onReady }

			console.log("[HlsJs] Starting playback", {
				engine,
				nativeSupported: this.nativeSupported,
				userAgent: navigator.userAgent,
			})

			if engine == "native" {
				video.addEventListener("loadedmetadata", onReady)
				video.src = this.source
				video.load()
				return
			}

			// A failed MediaSource must not be reused on the next connection.
			const instance = new library()
			hls = instance
			instance.on(library.Events.ERROR, (event, data) => {
				if hls != instance || generation != this.generation {
					return
				}
				if data.details == "aborted" && !data.fatal {
					return
				}
				console.warn("[HlsJs] HLS playback error", {
					type: data.type,
					details: data.details,
					fatal: data.fatal,
					reason: data.reason,
					message: data.error?.message,
					status: data.response?.code,
				})
				if data.fatal {
					this.handleFailure(new Error(data.error?.message || data.details || "HLS connection interrupted"))
				}
			})
			instance.on(library.Events.MANIFEST_PARSED, () => {
				if hls == instance && generation == this.generation {
					onReady()
				}
			})
			instance.loadSource(this.source)
			instance.attachMedia(video)
		}
		catch (error) {
			if generation == this.generation && this.video == video {
				this.handleFailure(error)
			}
		}
	}

	static handleFailure(error) {
		if !this.video {
			return
		}
		console.warn("[HlsJs] Playback engine failed", {
			engine: this.engine,
			name: error.name,
			message: error.message,
			code: error.code,
			mediaCode: this.video.error?.code,
			mediaMessage: this.video.error?.message,
			readyState: this.video.readyState,
			networkState: this.video.networkState,
		})
		const alternative = this.engine == "native" ? "hls.js" : "native"
		if !this.attempted.has(alternative) && (alternative != "native" || this.nativeSupported) {
			console.log("[HlsJs] Falling back to", alternative)
			this.startEngine(alternative)
			return
		}
		this.callbacks.onError?.(error)
	}

	static stopEngine() {
		if this.video && this.listeners {
			this.video.removeEventListener("error", this.listeners.onError)
			this.video.removeEventListener("loadedmetadata", this.listeners.onReady)
		}
		this.listeners = null
		const previous = hls
		hls = null
		previous?.destroy()
		if this.video {
			this.video.pause()
			this.video.removeAttribute("src")
			this.video.load()
		}
	}

	static disconnect() {
		this.generation++
		this.callbacks = {}
		this.stopEngine()
		this.video = null
		this.source = null
		this.engine = null
	}
}
