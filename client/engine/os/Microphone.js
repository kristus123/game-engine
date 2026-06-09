export class Microphone {
	static recorder = null
	static stream = null
	static chunks = []

	static state = "idle" // idle, recording
	static mimeType = "audio/webm;codecs=opus"
	static audioBitsPerSecond = 64_000

	static get recording() {
		return this.state == "recording"
	}

	static get selected() {
		return localStorage.getItem("selectedMic") ?? null
	}

	static set selected(m) {
		localStorage.setItem("selectedMic", m)
	}

	static all(callback) {

		// You often need permission first to get labels
		navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
			navigator.mediaDevices.enumerateDevices().then((devices) => {
				const x = devices.filter(device => device.kind == "audioinput")
				for (const m of x) {
					if (!(m.deviceId == "default" || m.deviceId == "communications")) {
						callback(m)
					}
				}
			})
		})
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

	static allMics(callback) {
		navigator.mediaDevices.enumerateDevices().then(devices => {
			const mics = devices
				.filter(device => device.kind == "audioinput")
				.map(device => ({
					deviceId: device.deviceId,
					label: device.label,
				}))
			callback(mics)
		})

	}
}
