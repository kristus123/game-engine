export class HlsVideo {
	constructor(callbacks = {}) {
		this.source = `${Config.httpUrl}/public_folder/hls/output.m3u8`

		this.playbackUtc = null

		this.video = H.hlsVideo({
			autoplay: true,
			muted: !Permission.canPlayAudio,
			controls: false,
			playsInline: true,
			reportPlaybackDate: () => {
				this.callbacks.onSeekableChange?.()
				this.playbackUtc = HlsJs.playbackUtc
				if (this.playbackUtc) {
					this.callbacks.onPlaybackDate?.(this.playbackUtc)
				}
			},
			listeners: {
				progress: () => this.callbacks.onSeekableChange?.(),
				durationchange: () => this.callbacks.onSeekableChange?.(),
				playing: () => this.callbacks.onPlaying?.(),
				error: () => this.callbacks.onError?.(this.video.error),
			},
		})
	}

	async connect() {
		Assert.false(this.connected)

		this.playbackUtc = null

		this.callbacks.onConnecting?.()

		return Retry(5, async () => {
			const online = await Stream.online()

			Assert.true(online, "Stream not online")

			if (HlsJs.supported) {
				HlsJs.connect(this.video, this.source, {
					onError: () => this.callbacks.onError?.(new Error("HLS connection interrupted")),
					onManifestParsed: () => this.video.play().catch(error => {
						if (error.name != "AbortError") {
							this.callbacks.onError?.(error)
						}
					}),
				})
			}
			else {
				Assert.true(this.video.canPlayHls, "This browser does not support native HLS playback")
				this.video.src = this.source
				this.video.play().catch(error => {
					if (error.name != "AbortError") {
						this.callbacks.onError?.(error)
					}
				})
			}
		}, { feature: "VIEWER_PAGE" }).catch(error => this.callbacks.onError?.(error))
	}

	get connected() {
		return HlsJs.supported ? HlsJs.connected : this.video.hasAttribute("src")
	}

	get ready() {
		return this.video.isPlaying
	}

	disconnect() {
		this.playbackUtc = null

		HlsJs.disconnect()

		this.video.pause()
		this.video.removeAttribute("src")
		this.video.load()
	}

}
