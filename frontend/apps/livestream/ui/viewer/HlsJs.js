const HlsLibrary = await import("https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.mjs")
	.then(module => module.default)
	.catch(e => {
		console.warn("Could not load hls.js; trying native HLS playback", e)
		return null
	})

let hls
if (HlsLibrary?.isSupported()) {
	hls = new HlsLibrary()
}
else {
	hls = null
}

export class HlsJs {
	constructor(video, callbacks = {}) {
		this.playing = false
		if (!hls) {
			return
		}

		hls.on(HlsLibrary.Events.ERROR, (event, data) => {
			console.warn("[HlsJs] HLS playback error", {
				type: data.type,
				details: data.details,
				fatal: data.fatal,
			})
			if (data.fatal && this.playing) {
				this.callbacks.onError?.()
			}
		})
		hls.on(HlsLibrary.Events.MANIFEST_PARSED, () => {
			if (this.playing) {
				this.callbacks.onManifestParsed?.()
			}
		})
	}

	get supported() {
		return hls != null
	}

	get playbackUtc() {
		if (this.playing) {
			return hls.playingDate ?? null
		}
		else {
			return null
		}
	}

	start(source) {
		if (!hls || this.playing) {
			return
		}

		this.playing = true
		hls.loadSource(source)
		hls.attachMedia(this.video)
		console.log("[HlsJs] Started HLS connection")
	}

	stop() {
		if (!this.playing) {
			return
		}

		this.playing = false
		hls.stopLoad()
		hls.detachMedia()
	}
}
