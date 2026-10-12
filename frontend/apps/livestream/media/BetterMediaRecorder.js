export class BetterMediaRecorder {

	static mediaRecorder = null

	static start(onBlob) {
		Assert.null(this.mediaRecorder)

		const queue = PromiseQueue()

		this.mediaRecorder = new MediaRecorder(SwappableMediaStream.stream, { mimeType: Platform.mimeType })

		this.mediaRecorder.ondataavailable = async e => {
			if e.data.size > 0 {
				queue.add(async () => {
					// Avoid errors when the stream is turned off.
					if this.active {
						await onBlob(e.data)
					}
				})
			}
		}

		this.mediaRecorder.start(Config.hlsTime * 1_000) // turn seconds to ms
	}

	static async setAudioDevice(deviceId) {
		await SwappableMediaStream.setAudioDevice(deviceId)
	}

	static clearAudioDevice() {
		SwappableMediaStream.clearAudioDevice()
	}

	static async swapVideo(deviceId) {
		SwappableMediaStream.swapVideo(deviceId)
	}

	static async stop() {
		Assert.value(this.mediaRecorder)

		await this.mediaRecorder.stop()
		this.mediaRecorder = null
	}

	static get active() {
		return A.value(this.mediaRecorder)
	}

}
