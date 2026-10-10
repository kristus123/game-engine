export class SwappableMediaStream {

	static video = null
	static stream = null

	static audioContext = null
	static audioOutput = null
	static audioCompressor = null
	static audioInput = null

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
		this.audioCompressor = this.audioContext.createDynamicsCompressor()
		this.audioCompressor.threshold.value = -1
		this.audioCompressor.knee.value = 0
		this.audioCompressor.ratio.value = 20
		this.audioCompressor.attack.value = 0.003
		this.audioCompressor.release.value = 0.05
		this.audioCompressor.connect(this.audioOutput)

		this.stream = new MediaStream([
			...canvasStream.getVideoTracks(),
			...this.audioOutput.stream.getAudioTracks(),
		])
	}

	static get audioDeviceId() {
		return this.audioInput?.deviceId ?? null
	}

	static async setAudioDevice(deviceId) {
		if (this.audioDeviceId == deviceId) {
			return
		}

		await this.audioContext.resume()

		const stream = await MediaDevices.audio(deviceId)
		let source = null

		try {
			const audioTracks = stream.getAudioTracks()
			if (audioTracks.length != 1) {
				throw new Error(`Expected one audio track for microphone ${deviceId}, got ${audioTracks.length}`)
			}

			const actualDeviceId = audioTracks[0].getSettings().deviceId
			if (!actualDeviceId) {
				throw new Error(`Could not verify which microphone was opened for device ${deviceId}`)
			}
			if (actualDeviceId != deviceId) {
				throw new Error(`Requested microphone ${deviceId}, but the browser opened a different input`)
			}

			source = this.audioContext.createMediaStreamSource(stream)
			source.connect(this.audioCompressor)

			const previousInput = this.audioInput
			this.audioInput = { deviceId, source, stream }
			if (previousInput) {
				this.stopAudioInput(previousInput)
			}
		}
		catch (error) {
			source?.disconnect()
			stream.getTracks().forEach(track => track.stop())
			throw error
		}
	}

	static clearAudioDevice() {
		const audioInput = this.audioInput
		if (!audioInput) {
			return
		}

		this.audioInput = null
		this.stopAudioInput(audioInput)
	}

	static stopAudioInput({ source, stream }) {
		source.disconnect()
		stream.getTracks().forEach(track => track.stop())
	}

	static async swapVideo(deviceId) {
		this.video.srcObject?.getTracks().forEach(t => t.stop())

		this.video.srcObject = await MediaDevices.video(deviceId)
	}
}
