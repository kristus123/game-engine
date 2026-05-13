export class Microphone {
	static recorder = null
	static stream = null
	static chunks = []

	static state = "idle" // idle, recording
	static mimeType = "audio/webm;codecs=opus"
	static audioBitsPerSecond = 64_000

	static get recording() {
		return this.state === "recording"
	}

	static async start() {

		if (this.state === "recording") {
			throw new Error("already recording")
		}
<<<<<<< HEAD

		this.stream = await navigator.mediaDevices.getUserMedia({
			audio: true,
		})

		this.recorder = new MediaRecorder(this.stream, {
			mimeType: this.mimeType,
			audioBitsPerSecond: this.audioBitsPerSecond,
		})

		this.chunks = []

		this.recorder.ondataavailable = e => {
			this.chunks.push(e.data)
||||||| parent of 3a3b100d (x)
		else if (this.state == "recording") {
			throw new Error("this already recording")
		}
		else {
			this.chunks = []
			this.recorder.start()
			this.state = "recording"
=======
		else if (this.state === "recording") {
			throw new Error("this already recording")
		}
		else {
			this.chunks = []
			this.recorder.start()
			this.state = "recording"
>>>>>>> 3a3b100d (x)
		}

		this.recorder.start()

		this.state = "recording"
	}

	static stop(callback) {

		Assert.method(callback)

<<<<<<< HEAD
		if (this.state !== "recording") {
			throw new Error("not recording")
||||||| parent of 3a3b100d (x)
		if (!this.ready) {
			throw new Error("this not ready yet")
		}
		if (this.state != "recording") {
			throw new Error("this not recording")
=======
		if (!this.ready) {
			throw new Error("this not ready yet")
		}
		if (this.state !== "recording") {
			throw new Error("this not recording")
>>>>>>> 3a3b100d (x)
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
