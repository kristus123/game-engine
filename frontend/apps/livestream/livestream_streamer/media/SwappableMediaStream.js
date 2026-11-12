export class SwappableMediaStream {

	static video = null
	static mediaStream = null
	static canvas = null
	static canvasContext = null

	static audioContext = null
	static audioOutput = null
	static audioTrack = null
	static audioInput = null
	static audioMuted = false
	static audioUnavailable = false

	static {
		this.video = H.mediastreamVideo()

		const { ctx, canvas, canvasStream } = H.CanvasWithStream(1280, 720)
		this.canvas = canvas
		this.canvasContext = ctx
		ctx.fillRect(0, 0, canvas.width, canvas.height)

		FrameLoop(() => {
			// Has enough data to display the current frame.
			if this.video?.readyState >= 2 {
				ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height)
			}
		})

		this.audioContext = SoundContext.context
		this.audioOutput = this.audioContext.createMediaStreamDestination()
		this.audioTrack = AudioTrack()
		this.audioTrack.apply(Vst.compressor()).routeTo(this.audioOutput)

		this.mediaStream = new MediaStream([
			...canvasStream.getVideoTracks(),
			...this.audioOutput.stream.getAudioTracks(),
		])
	}

	static async prepare(options = {}) {
		await Permission.request()
		await this.audioContext.resume()
		if Object.hasOwn(options, "audioDeviceId") && options.audioDeviceId == null {
			this.clearAudioDevice()
		}
		else if !this.audioMuted || options.audioDeviceId != null {
			try {
				await this.setAudioDevice(options.audioDeviceId)
			}
			catch (error) {
				if options.audioDeviceId == null {
					throw error
				}
				console.warn("Selected microphone is unavailable; trying the default microphone", error)
				try {
					await this.setAudioDevice()
				}
				catch (fallbackError) {
					this.clearAudioDevice()
					this.audioUnavailable = true
					console.warn("No microphone is available; continuing muted", fallbackError)
				}
			}
		}
		try {
			await this.swapVideo(options.videoDeviceId)
		}
		catch (error) {
			if options.videoDeviceId == null {
				throw error
			}
			console.warn("Selected camera is unavailable; trying the default camera", error)
			try {
				await this.swapVideo()
			}
			catch (fallbackError) {
				this.video.srcObject = null
				this.canvasContext.fillStyle = "black"
				this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height)
				console.warn("No camera is available; continuing with a black screen", fallbackError)
			}
		}
		return this.mediaStream
	}

	static get videoDeviceId() {
		return this.video.srcObject?.getVideoTracks()[0]?.getSettings().deviceId ?? null
	}

	static get audioDeviceId() {
		return this.audioInput?.deviceId ?? null
	}

	static async setAudioDevice(deviceId = undefined) { // allow-null
		if this.audioInput && this.audioInput.stream.active && (deviceId == null || this.audioDeviceId == deviceId) {
			return
		}

		await this.audioContext.resume()

		const stream = await MediaDevices.audio(deviceId)
		let source = null

		try {
			const audioTracks = stream.getAudioTracks()
			if audioTracks.length != 1 {
				throw new Error(`Expected one audio track for microphone ${deviceId}, got ${audioTracks.length}`)
			}

			const actualDeviceId = audioTracks[0].getSettings().deviceId
			if !actualDeviceId {
				throw new Error(`Could not verify which microphone was opened for device ${deviceId}`)
			}
			if deviceId != null && deviceId != "default" && actualDeviceId != deviceId {
				throw new Error(`Requested microphone ${deviceId}, but the browser opened a different input`)
			}

			source = this.audioContext.createMediaStreamSource(stream)
			source.connect(this.audioTrack.input)

			const previousInput = this.audioInput
			const input = { deviceId: actualDeviceId, source, stream }
			this.audioInput = input
			this.audioMuted = false
			this.audioUnavailable = false
			audioTracks[0].addEventListener?.("ended", () => {
				if this.audioInput != input {
					return
				}
				this.audioInput = null
				this.stopAudioInput(input)
				this.setAudioDevice().catch(error => {
					this.audioMuted = true
					this.audioUnavailable = true
					console.warn("Microphone disconnected and no replacement is available", error)
				})
			})
			if previousInput {
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
		this.audioMuted = true
		this.audioUnavailable = false
		const audioInput = this.audioInput
		if !audioInput {
			return
		}

		this.audioInput = null
		this.stopAudioInput(audioInput)
	}

	static stopAudioInput({ source, stream }) {
		source.disconnect()
		stream.getTracks().forEach(track => track.stop())
	}

	static async swapVideo(deviceId = undefined) { // allow-null
		const previous = this.video.srcObject
		if previous?.active && (deviceId == null || this.videoDeviceId == deviceId) {
			return
		}
		const stream = await MediaDevices.video(deviceId)
		this.video.srcObject = stream
		previous?.getTracks().forEach(track => track.stop())
		const track = stream.getVideoTracks()[0]
		track?.addEventListener?.("ended", () => {
			if this.video.srcObject != stream {
				return
			}
			this.video.srcObject = null
			this.canvasContext.fillStyle = "black"
			this.canvasContext.fillRect(0, 0, this.canvas.width, this.canvas.height)
			this.swapVideo().catch(error => {
				console.warn("Camera disconnected and no replacement is available", error)
			})
		})
		await this.video.play()
	}
}
