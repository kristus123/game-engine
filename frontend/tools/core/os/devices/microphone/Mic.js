export class Mic {

	static chunks = []
	static recorder = null
	static stream = null

	static granted = false

	static state = "idle" // idle, recording
	static mimeType = "audio/webm;codecs=opus"
	static audioBitsPerSecond = 64_000

	static get recording() {
		Assert.true(this.granted)
		return this.state == "recording"
	}

	static get idle() {
		Assert.true(this.granted)
		return this.state == "idle"
	}

	static get deviceId() {
		Assert.true(this.granted)
		// undefined needs to be used instead of null because of getUserMedia api
		return localStorage.getItem("mic_deviceId") ?? undefined
	}

	static set deviceId(m) {
		Assert.true(this.granted)
		localStorage.setItem("mic_deviceId", m)
	}

	static async createStream() {
		Assert.true(this.granted)
		return await navigator.mediaDevices.getUserMedia({
			audio: {
				deviceId: {
					// can be 'exact' or 'ideal' - ideal more safe
					ideal: this.deviceId,
				},
				echoCancellation: false,
				noiseSuppression: false,
				autoGainControl: false,
				channelCount: 1,
				// sampleRate: 48000,   // optional - browser may ignore
				// sampleSize: 16,      // optional - browser may ignore
				// latency: 0.01        // optional - browser may ignore
			},
		})
	}

	static async routeTo(track) {
		Assert.true(this.granted)

		try {
			const stream = await this.createStream()
			const source = SoundContext.context.createMediaStreamSource(stream)
			source.connect(track.input ?? track)
			return source
		}
		catch (e) {
			console.error("Error accessing microphone:", e)
		}
	}

	static async start(onStart = () => {}) {
		Assert.true(this.granted)

		if (this.recording) {
			throw new Error("already recording")
		}

		this.stream = await this.createStream()
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
		Assert.true(this.granted)
		Assert.true(this.recording)
		Assert.method(onStop)

		this.recorder.onstop = () => {

			this.stream.getTracks().forEach(t => t.stop())

			const blob = new Blob(this.chunks, {
				type: this.mimeType,
			})

			this.chunks = []
			this.recorder = null
			this.stream = null
			this.state = "idle"

			return onStop(blob)
		}

		this.recorder.stop()
	}

	static async request({ ok, error } = {}) {
		Assert.false(this.granted)

		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
			stream.getTracks().forEach(track => track.stop())

			this.granted = true
			ok()
		}
		catch (e) {
			console.error("Mic denied:", e)
			this.granted = false
			error(e)
		}
	}

	static async all() {
		Assert.true(this.granted)

		const devices = await navigator.mediaDevices.enumerateDevices()
		return devices.filter(device => device.kind == "audioinput")
	}

}
