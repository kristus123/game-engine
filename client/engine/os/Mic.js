export class Mic {

	static recorder = null
	static stream = null
	static chunks = []

	static state = "idle" // idle, recording
	static mimeType = "audio/webm;codecs=opus"
	static audioBitsPerSecond = 64_000

	static get recording() {
		return this.state == "recording"
	}

	static async all(callback) {
		if (!MicPermission.granted) {
			throw new Error("Needs permission first")
		}

		for (const m of await AllMics.get()) {
			callback(m)
		}
	}

	static async start(onStart = () => {}) {
		if (this.state == "recording") {
			throw new Error("already recording")
		}

		this.stream = MicApi.createStream()

		this.recorder = new MediaRecorder(this.stream, {
			mimeType: this.mimeType,
			audioBitsPerSecond: this.audioBitsPerSecond,
		})

		this.chunks = []
		this.recorder.ondataavailable = e => {
			this.chunks.push(e.data)
		}

		this.recorder.onstart = () => {
			this.state = "recording"
			onStart()
		}

		this.recorder.start()
	}

	static stop(callback) {

		Assert.method(callback)

		if (this.state != "recording") {
			throw new Error("not recording")
		}

		this.recorder.onstop = () => {

			const blob = new Blob(this.chunks, {
				type: this.mimeType,
			})

			this.chunks = []

			// IMPORTANT:
			// stop all microphone tracks so the browser
			// completely releases the microphone
			this.stream.getTracks().forEach(track => {
				track.stop()
			})

			this.recorder = null
			this.stream = null
			this.state = "idle"

			callback(blob)
		}

		this.recorder.stop()
	}

	static getState() {
		return this.state
	}


}
