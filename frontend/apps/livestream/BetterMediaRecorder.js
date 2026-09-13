export class BetterMediaRecorder {

	static mediaRecorder = null

	static start(onBlob) {
		Assert.null(this.mediaRecorder)

		const queue = new PromiseQueue()
		this.mediaRecorder = new MediaRecorder(SwappableMediaStream.stream, { mimeType: Platform.mimeType })

		this.mediaRecorder.ondataavailable = async e => {
			if (e.data.size > 0) {
				queue.add(async () => {
					await onBlob(e.data)
				})
			}
		}

		this.mediaRecorder.start(5_000)
	}

	static async swapAudio(deviceId) {
		SwappableMediaStream.swapAudio(deviceId)
	}

	static async swapVideo(deviceId) {
		SwappableMediaStream.swapVideo(deviceId)
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
