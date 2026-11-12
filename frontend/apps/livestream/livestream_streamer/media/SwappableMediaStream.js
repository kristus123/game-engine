export class SwappableMediaStream {

	static audioInput = null
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

		this.audioTrack = AudioTrack()

		const audioOutput = SoundContext.createMediaStreamDestination()
		this.audioTrack.apply(Vst.compressor()).routeTo(audioOutput)

		this.mediaStream = new MediaStream([
			...canvasStream.getVideoTracks(),
			...audioOutput.stream.getAudioTracks(),
		])
	}

	static async prepare({ audioDeviceId, videoDeviceId } = {}) {
		await Permission.request()
		await SoundContext.resume()
		try {
			await this.setAudioDevice(audioDeviceId)
		}
		catch (error) {
			if audioDeviceId == null {
				throw new Error("No microphone is available", { cause: error })
			}
			console.warn("Selected microphone is unavailable; trying the default microphone", error)
			try {
				await this.setAudioDevice()
			}
			catch (fallbackError) {
				this.audioUnavailable = true
				throw new Error("No microphone is available", { cause: fallbackError })
			}
		}
		try {
			await this.swapVideo(videoDeviceId)
		}
		catch (error) {
			if videoDeviceId == null {
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

		await SoundContext.resume()

		const stream = await MediaDevices.audio(deviceId)
		let source = null

		try {
			const audioTracks = stream.getAudioTracks()
			Assert.true(audioTracks.length == 1, `Expected one audio track for microphone ${deviceId}, got ${audioTracks.length}`)

			const actualDeviceId = Assert.value(audioTracks[0].getSettings().deviceId)

			if deviceId != null && deviceId != "default" && actualDeviceId != deviceId {
				throw new Error(`Requested microphone ${deviceId}, but the browser opened a different input`)
			}

			source = SoundContext.createMediaStreamSource(stream)
			source.connect(this.audioTrack.input)

			const previousInput = this.audioInput
			const input = { deviceId: actualDeviceId, source, stream }
			this.audioInput = input
			this.audioUnavailable = false
			audioTracks[0].addEventListener?.("ended", async () => {
				if this.audioInput != input {
					return
				}
				this.audioInput = null
				this.stopAudioInput(input)
				try {
					await this.setAudioDevice()
				}
				catch (error) {
					this.audioUnavailable = true
					throw new Error("Microphone disconnected and no replacement is available", { cause: error })
				}
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
