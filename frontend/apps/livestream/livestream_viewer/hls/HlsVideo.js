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
		const play = () => {
			const generation = HlsJs.generation
			return this.video.play().catch(async error => {
				if generation != HlsJs.generation {
					return
				}
				if error.name == "NotAllowedError" && !this.video.muted {
					this.video.muted = true
					this.callbacks.onAudioBlocked?.()
					await this.video.play().catch(playError => this.callbacks.onError?.(playError))
					return
				}
				if error.name != "AbortError" {
					HlsJs.handleFailure(error)
				}
			})
		}
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
	}

}
