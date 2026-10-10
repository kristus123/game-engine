export class SwappableMediaStream {

	static video = null
	static stream = null

	static audioContext = null
	static audioOutput = null
	static audioSources = new Map()

	static {
		const v = document.createElement("video")
		v.playsInline = true
		v.srcObject = null
		v.autoplay = true
		v.muted = true
		this.video = v

		const { ctx, canvas, canvasStream } = Canvas(1280, 720)

		FrameLoop(() => {
			if (this.video?.readyState >= 2) { // has enough data to display current frame
				ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height)
			}
		})

		this.audioContext = new AudioContext()
		this.audioOutput = this.audioContext.createMediaStreamDestination()

		this.stream = new MediaStream([
			...canvasStream.getVideoTracks(),
			...this.audioOutput.stream.getAudioTracks(),
		])
	}

	static get audioDeviceIds() {
		return [...this.audioSources.keys()]
	}

	static async addAudioDevice(deviceId) {
		if (this.audioSources.has(deviceId)) {
			throw new Error(`Microphone already added: ${deviceId}`)
		}

		await this.audioContext.resume()

		const stream = await MediaDevices.audio(deviceId)
		let source = null
		let gain = null

		try {
			source = this.audioContext.createMediaStreamSource(stream)
			gain = this.audioContext.createGain()
			source.connect(gain)
			gain.connect(this.audioOutput)
			this.audioSources.set(deviceId, { source, gain, stream })
			this.updateAudioGains()
		}
		catch (error) {
			this.audioSources.delete(deviceId)
			source?.disconnect()
			gain?.disconnect()
			stream.getTracks().forEach(track => track.stop())
			throw error
		}
	}

	static removeAudioDevice(deviceId) {
		const audioSource = this.audioSources.get(deviceId)
		if (!audioSource) {
			throw new Error(deviceId + " not found")
		}

		const { source, gain, stream } = audioSource
		source.disconnect()
		gain.disconnect()
		stream.getTracks().forEach(track => track.stop())
		this.audioSources.delete(deviceId)
		this.updateAudioGains()
	}

	static updateAudioGains() {
		if (this.audioSources.size > 0) {
			const micGain = 1 / this.audioSources.size
			for (const { gain } of this.audioSources.values()) {
				gain.gain.setTargetAtTime(micGain, this.audioContext.currentTime, 0.02)
			}
		}
	}

	static async swapVideo(deviceId) {
		this.video.srcObject?.getTracks().forEach(t => t.stop())

		this.video.srcObject = await MediaDevices.video(deviceId)
	}
}
