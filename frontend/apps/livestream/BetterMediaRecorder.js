export class BetterMediaRecorder {

	static mediaRecorder = null
	static swappableMediaStream = SwappableMediaStream()

	static get active() {
		return A.value(this.mediaRecorder)
	}

	static async start(onBlob) {
		this.mediaRecorder = new MediaRecorder(this.swappableMediaStream.mediaStream, { mimeType: Platform.mimeType })

		this.mediaRecorder.ondataavailable = async e => {
			if (e.data.size > 0) {
				onBlob(e.data)
			}
		}

		this.mediaRecorder.start(5_000)
	}

	static swap() {
		await this.swappableMediaStream.swap({
			video: true,
			audio: {
				echoCancellation: false,
				noiseSuppression: false,
				autoGainControl: false,
			},
		})
	}

	static async stop() {
		if (this.mediaRecorder) {
			this.mediaRecorder.stop()
			this.mediaRecorder = null
		}
		else {
			throw new Error("Can't stop when already stopped")
		}
	}
}
