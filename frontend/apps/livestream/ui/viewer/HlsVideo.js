export class HlsVideo {

	constructor(callbacks = {}) {
		this.source = `${Config.httpUrl}/public_folder/hls/output.m3u8`
		this.playbackUtc = null

		this.video = H.hlsVideo({
			autoplay: true,
			muted: !Permission.canPlayAudio,
			controls: false,
			playsInline: true,
			listeners: {
				loadeddata: () => this.reportPlaybackDate(),
				timeupdate: () => this.reportPlaybackDate(),
				seeked: () => this.reportPlaybackDate(),
				progress: () => this.callbacks.onSeekableChange?.(),
				durationchange: () => this.callbacks.onSeekableChange?.(),
				playing: () => {
					this.callbacks.onPlaying?.()
					this.reportPlaybackDate()
				},
				error: () => this.callbacks.onError?.(),
			},
		})

		this.hlsJs = new HlsJs(this.video, {
			onError: () => this.callbacks.onError?.(),
			onManifestParsed: () => {
				this.video.play().catch(e => console.warn("Could not start HLS playback", e))
			},
		})
	}

	start() {
		this.playbackUtc = null
		this.callbacks.onConnecting?.()

		if (this.hlsJs.supported) {
			this.hlsJs.start(this.source)
		}
		else {
			Assert.true(this.video.canPlayHls, "This browser does not support native HLS playback")
			this.video.src = this.source
			// shouldn't we also do this.video.start here ? or does that happen automatically? add a comment codex that i can read later @kristian
		}
	}

	get ready() {
		return this.video.isPlaying
	}

	reconnect() {
		this.stop()
		this.start()
	}

	reportPlaybackDate() {
		this.callbacks.onSeekableChange?.()
		this.playbackUtc = this.hlsJs.playbackUtc
		if (this.playbackUtc) {
			this.callbacks.onPlaybackDate?.(this.playbackUtc)
		}
		return this.playbackUtc
	}

	getSeekTarget(seconds) {
		const seekable = this.video.seekable
		if (!Number.isFinite(seconds) || seconds == 0 || seekable.length == 0) {
			return null
		}

		const currentTime = this.video.currentTime
		const requestedTime = currentTime + seconds
		let target = null
		let closestDistance = Infinity
		for (let index = 0; index < seekable.length; index++) {
			const start = seekable.start(index)

			// Stay inside the range so reaching the live edge does not end playback.
			const end = Math.max(start, seekable.end(index) - 0.1)
			const candidate = Math.max(start, Math.min(requestedTime, end))
			const distance = Math.abs(candidate - requestedTime)
			if (distance < closestDistance) {
				target = candidate
				closestDistance = distance
			}
		}

		if (target == null || Math.abs(target - currentTime) < 0.1 || (target - currentTime) * seconds <= 0) {
			return null
		}
		else {
			return target
		}
	}

	seekBy(seconds) {
		const target = this.getSeekTarget(seconds)
		if (target == null) {
			return
		}

		this.video.currentTime = target
		this.reportPlaybackDate()
	}

	stop() {
		this.playbackUtc = null
		this.hlsJs.stop()
		this.video.pause()
		this.video.removeAttribute("src")
		this.video.load()
	}
}
