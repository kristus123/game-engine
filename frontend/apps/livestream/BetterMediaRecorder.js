export class BetterMediaRecorder {

	static mediaRecorder = null

	static start(onBlob) {
		Assert.null(this.mediaRecorder)

		this.mediaRecorder = new MediaRecorder(SwappableMediaStream.mediaStream, { mimeType: Platform.mimeType })

		this.mediaRecorder.ondataavailable = async e => {
			if (e.data.size > 0) {
				onBlob(e.data)
			}
		}

		this.mediaRecorder.start(5_000)
	}

	static async swap() {
		const devices = await navigator.mediaDevices.enumerateDevices()

		const cameras = devices.filter(device => device.kind == "videoinput")
		const microphones = devices.filter(device => device.kind == "audioinput")

		const camera = cameras[Math.floor(Math.random() * cameras.length)]
		const microphone = microphones[Math.floor(Math.random() * microphones.length)]

		await SwappableMediaStream.swap({
			video: camera
				? { deviceId: { exact: camera.deviceId } }
				: false,

			audio: microphone
				? {
					deviceId: { exact: microphone.deviceId },
					echoCancellation: false,
					noiseSuppression: false,
					autoGainControl: false,
				}
				: false,
		})
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
