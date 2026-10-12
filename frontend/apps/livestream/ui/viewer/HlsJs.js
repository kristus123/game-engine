const HlsLibrary = await import("https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.mjs")
	.then(module => module.default)
	.catch(e => {
		console.warn("Could not load hls.js; trying native HLS playback", e)
		return null
	})

let hls
if HlsLibrary?.isSupported() {
	hls = new HlsLibrary()
}
else {
	hls = null
}

export class HlsJs {

	static callbacks = {}

	static {
		if hls {
			hls.on(HlsLibrary.Events.ERROR, (event, data) => {
				console.warn("[HlsJs] HLS playback error", {
					type: data.type,
					details: data.details,
					fatal: data.fatal,
				})
				if data.fatal && hls.media {
					this.callbacks.onError?.()
				}
			})
			hls.on(HlsLibrary.Events.MANIFEST_PARSED, () => {
				if hls.media {
					this.callbacks.onManifestParsed?.()
				}
			})
		}
	}

	static get supported() {
		return hls != null
	}

	static get connected() {
		return hls?.media != null
	}

	static get playbackUtc() {
		return hls?.media ? hls.playingDate ?? null : null
	}

	static connect(video, source, callbacks = {}) {
		Assert.true(this.supported, "hls.js playback is unavailable")
		this.disconnect()
		this.callbacks = callbacks
		hls.loadSource(source)
		hls.attachMedia(video)

		console.log("[HlsJs] Started HLS connection")
	}

	static disconnect() {
		this.callbacks = {}
		hls?.stopLoad()
		if hls?.media {
			hls.detachMedia()
		}
	}
}
