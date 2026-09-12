export class BetterMediaRecorder {

	static mediaRecorder = null

	static start(onBlob) {
		Assert.null(this.mediaRecorder)

		const queue = new PromiseQueue()
		this.mediaRecorder = new MediaRecorder(SwappableMediaStream.mediaStream, { mimeType: Platform.mimeType })

		this.mediaRecorder.ondataavailable = async e => {
			if (e.data.size > 0) {
				queue.add(async () => {
					await onBlob(e.data)
				})
			}
		}

		this.mediaRecorder.start(5_000)
	}

	static async swapAudio() {
		const devices = await navigator.mediaDevices.enumerateDevices()
		const microphones = devices.filter(device => device.kind == "audioinput")
		const microphone = microphones[Math.floor(Math.random() * microphones.length)]

		SwappableMediaStream.swapAudio({
			deviceId: { exact: microphone.deviceId },
			echoCancellation: false,
			noiseSuppression: false,
			autoGainControl: false,
		})
	}

	static async swapVideo() {
		const devices = await navigator.mediaDevices.enumerateDevices()

		const cameras = devices.filter(device => device.kind == "videoinput")
		const camera = cameras[Math.floor(Math.random() * cameras.length)]

		SwappableMediaStream.swapVideo({ deviceId: { exact: camera.deviceId } })
	}

	static async stop() {
		assert.value(this.mediaRecorder)

		await this.mediaRecorder.stop()
		this.mediaRecorder = null
	}

	static get active() {
		return this.mediaRecorder
	}
}
