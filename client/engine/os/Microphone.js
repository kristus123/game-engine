export class Microphone {

	static recorder = null
	static chunks = []
	static state = "idle" // idle, recording, stopped
	static mimeType = "audio/webm;codecs=opus"
	static audioBitsPerSecond = 64_000
	static ready = false

	static {
		navigator.mediaDevices.getUserMedia({ audio: true })
			.then(stream => {
				this.recorder = new MediaRecorder(stream, {
					mimeType: this.mimeType,
					audioBitsPerSecond: this.audioBitsPerSecond,
				})

				this.recorder.ondataavailable = e => this.chunks.push(e.data)
				this.ready = true
			})
			.catch(err => {
				console.error("Failed to access microphone:", err)
			})
	}

	static get recording() {
		return this.state == "recording"
	}

	static start() {
		if (!this.ready) {
			throw new Error("this not ready yet")
		}
		else if (this.state === "recording") {
			throw new Error("this already recording")
		}
		else {
			this.chunks = []
			this.recorder.start()
			this.state = "recording"
		}
	}

	static stop(callback) {
		Assert.method(callback)

		if (!this.ready) {
			throw new Error("this not ready yet")
		}
		if (this.state !== "recording") {
			throw new Error("this not recording")
		}

		this.recorder.onstop = () => {
			const blob = new Blob([...this.chunks], { type: this.mimeType })
			this.chunks = []
			this.state = "stopped"

			callback(blob)
		}

		this.recorder.stop()
	}

	static getState() {
		return this.state
	}
}
