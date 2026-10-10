export class HlsVideo {
	constructor(callbacks = {}) {
		this.callbacks = callbacks
		this.playlist = HlsPlaylist()
		this.source = this.playlist.url
		this.hls = null
		this.isStopped = false
		this.playlistEndUtc = null
		this.datePoll = null
		this.pollInProgress = false
		this.listeners = {
			loadeddata: () => this.reportPlaybackDate("loadeddata"),
			timeupdate: () => this.reportPlaybackDate("timeupdate"),
			seeked: () => this.reportPlaybackDate("seeked"),
			progress: () => this.callbacks.onSeekableChange?.(),
			durationchange: () => this.callbacks.onSeekableChange?.(),
			playing: () => {
				this.callbacks.onPlaying?.()
				this.reportPlaybackDate("playing")
			},
			error: () => this.callbacks.onError?.(),
		}
		this.element = H.hlsVideo({
			autoplay: true,
			muted: !Permission.canPlayAudio,
			controls: false,
			playsInline: true,
			listeners: this.listeners,
		})
	}

	async start() {
		let HlsLibrary = null
		try {
			const module = await import("https://cdn.jsdelivr.net/npm/hls.js@1/dist/hls.min.mjs")
			HlsLibrary = module.default
		}
		catch (e) {
			console.warn("Could not load hls.js; trying native HLS playback", e)
		}

		if (this.isStopped) {
			return
		}

		if (HlsLibrary?.isSupported()) {
			this.hls = new HlsLibrary()
			this.hls.on(HlsLibrary.Events.ERROR, (event, data) => {
				console.warn("[HlsVideo] HLS playback error", {
					type: data.type,
					details: data.details,
					fatal: data.fatal,
				})
				if (data.fatal) {
					this.callbacks.onError?.()
				}
			})
			this.hls.on(HlsLibrary.Events.MANIFEST_PARSED, () => {
				this.element.play().catch(e => console.warn("Could not start HLS playback", e))
			})
			this.hls.loadSource(this.source)
			this.hls.attachMedia(this.element)
			console.log("[HlsVideo] Started hls.js playback")
			return
		}

		this.startNative()
	}

	startNative() {
		if (!this.element.canPlayType("application/vnd.apple.mpegurl")) {
			throw new Error("This browser does not support native HLS playback")
		}

		this.element.src = this.source
		this.datePoll = setInterval(() => this.updatePlaybackDate(), 5_000)
		this.updatePlaybackDate()
	}

	async updatePlaybackDate() {
		if (this.isStopped || this.pollInProgress) {
			return
		}

		this.pollInProgress = true
		try {
			const playlistEndUtc = await this.playlist.getEndUtc()
			if (!this.isStopped && Number.isFinite(playlistEndUtc)) {
				this.playlistEndUtc = playlistEndUtc
			}
			console.log("[HlsVideo] Read playlist end UTC", {
				playlistEndUtc: Number.isFinite(playlistEndUtc) ? new Date(playlistEndUtc).toISOString() : null,
				isStopped: this.isStopped,
			})
			this.reportPlaybackDate("playlist-poll")
		}
		catch (e) {
			console.warn("Could not read HLS playlist date", e)
		}
		finally {
			this.pollInProgress = false
		}
	}

	reportPlaybackDate(trigger = "manual") {
		this.callbacks.onSeekableChange?.()
		const hlsPlaybackDate = this.hls?.playingDate
		const mediaStartDate = this.element.getStartDate?.()
		const mediaStartTime = mediaStartDate instanceof Date ? mediaStartDate.getTime() : NaN
		const seekable = this.element.seekable
		const seekableRanges = Array.from({ length: seekable.length }, (_, index) => ({
			start: seekable.start(index),
			end: seekable.end(index),
		}))
		const currentTime = this.element.currentTime
		let date = null
		let dateSource = "unavailable"
		let liveEdge = null
		if (hlsPlaybackDate && Number.isFinite(hlsPlaybackDate.getTime())) {
			date = hlsPlaybackDate
			dateSource = "hls-playing-date"
		}
		else if (Number.isFinite(mediaStartTime)) {
			date = new Date(mediaStartTime + currentTime * 1_000)
			dateSource = "media-start-date"
		}
		else if (Number.isFinite(this.playlistEndUtc) && seekable.length > 0) {
			liveEdge = seekable.end(seekable.length - 1)
			date = new Date(this.playlistEndUtc + (currentTime - liveEdge) * 1_000)
			dateSource = "playlist-end-and-live-edge"
		}

		const playbackDateUtc = date && Number.isFinite(date.getTime()) ? date.toISOString() : null
		console.log(`[HlsVideo] Playback UTC: ${playbackDateUtc ?? "unavailable"} (${dateSource})`, {
			trigger,
			currentTime,
			readyState: this.element.readyState,
			hasGetStartDate: typeof this.element.getStartDate == "function",
			mediaStartDate: Number.isFinite(mediaStartTime) ? new Date(mediaStartTime).toISOString() : null,
			playlistEndUtc: Number.isFinite(this.playlistEndUtc) ? new Date(this.playlistEndUtc).toISOString() : null,
			seekableRanges,
			liveEdge,
			dateSource,
			playbackDateUtc,
			hasPlaybackDateCallback: typeof this.callbacks.onPlaybackDate == "function",
		})

		if (date && Number.isFinite(date.getTime())) {
			this.callbacks.onPlaybackDate?.(date)
			return date
		}
		return null
	}

	getSeekTarget(seconds) {
		const seekable = this.element.seekable
		if (this.isStopped || !Number.isFinite(seconds) || seconds == 0 || seekable.length == 0) {
			return null
		}

		const currentTime = this.element.currentTime
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
		return target
	}

	seekBy(seconds) {
		const target = this.getSeekTarget(seconds)
		if (target == null) {
			return
		}

		console.log("[HlsVideo] Seek playback", {
			seconds,
			from: this.element.currentTime,
			to: target,
		})
		this.element.currentTime = target
		this.reportPlaybackDate("seek")
	}

	stop() {
		this.isStopped = true
		clearInterval(this.datePoll)
		this.hls?.destroy()
		this.hls = null
		for (const [event, listener] of Object.entries(this.listeners)) {
			this.element.removeEventListener(event, listener)
		}
		this.element.pause()
		this.element.removeAttribute("src")
		this.element.load()
	}
}
