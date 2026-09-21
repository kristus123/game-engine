export class _MicRecorder {

	static state = "idle" // idle, recording
	static chunks = []
	static recorder = null
	static stream = null

	static async start(deviceId, onStart = () => {}) {
		Assert.true(Permission.granted)

		if (this.state == "recording") {
			throw new Error("already recording")
		}

		this.stream = await MediaDevices.audio(deviceId)

		this.recorder = new MediaRecorder(this.stream, {
			mimeType: "audio/webm;codecs=opus", // todo use Platform.mimeType
			audioBitsPerSecond: 64_000,
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

	static async stop(onStop = () => {}) {
		Assert.true(Permission.granted)
		Assert.true(this.state == "recording")

		return new Promise(async (resolve, reject) => {
			Assert.method(onStop)

			this.recorder.onstop = () => {

				this.stream.getTracks().forEach(t => t.stop())

				const blob = new Blob(this.chunks, {
					type: "audio/webm;codecs=opus", // todo use Platform.mimeType
				})

				this.chunks = []
				this.recorder = null
				this.stream = null
				this.state = "idle"

				onStop(blob)
				resolve(blob)
			}

			this.recorder.stop()
			// should i do: ?
			// this.recorder = null
		})
	}

}
