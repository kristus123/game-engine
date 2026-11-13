export class HlsVideo {
	constructor(callbacks = {}) {
		this.callbacks = callbacks
		this.source = `${Config.httpUrl}/public_folder/hls/output.m3u8`

		this.video = H.hlsVideo({
			autoplay: true,
			muted: !Permission.canPlayAudio,
			controls: false,
			playsInline: true,
			listeners: {
				playing: () => this.callbacks.onPlaying?.(),
				error: () => this.callbacks.onError?.(this.video.error),
			},
		})
	}

	connect(playbackId) {
		if this.connected && this.playbackId == playbackId {
			return
		}
		this.disconnect()
		this.playbackId = playbackId
		const source = `${this.source}?broadcast=${playbackId}`
		this.callbacks.onConnecting?.()
		const play = () => this.video.play().catch(async error => {
			if error.name == "NotAllowedError" && !this.video.muted {
				this.video.muted = true
				this.callbacks.onAudioBlocked?.()
				await this.video.play().catch(playError => this.callbacks.onError?.(playError))
				return
			}
			if error.name != "AbortError" {
				this.callbacks.onError?.(error)
			}
		})
		HlsJs.connect(this.video, source, {
			onError: error => this.callbacks.onError?.(error ?? new Error("HLS connection interrupted")),
			onManifestParsed: play,
		}).catch(error => this.callbacks.onError?.(error))
	}

	get connected() {
		return HlsJs.connected
	}

	get ready() {
		return this.video.isPlaying
	}

	disconnect() {
		HlsJs.disconnect()

		this.video.pause()
		this.video.removeAttribute("src")
		this.video.load()
	}

}
