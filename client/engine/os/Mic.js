export class Mic {

	static chunks = []
	static recorder = null
	static stream = null

	static state = "idle" // idle, recording
	static mimeType = "audio/webm;codecs=opus"
	static audioBitsPerSecond = 64_000

	static get recording() {
		return this.state == "recording"
	}

	static async start(onStart = () => {}) {
		if (this.recording) {
			throw new Error("already recording")
		}

		this.stream = await MicApi.createStream()
		console.log(this.stream)

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

	static stop(onStop) {

		Assert.method(onStop)

		if (!this.recording) {
			throw new Error("not recording")
		}

		this.recorder.onstop = () => {

			MicApi.stopTracks(this.stream)

			const blob = new Blob(this.chunks, {
				type: this.mimeType,
			})

			this.chunks = []
			this.recorder = null
			this.stream = null
			this.state = "idle"

			onStop(blob)
		}

		this.recorder.stop()
	}

}
