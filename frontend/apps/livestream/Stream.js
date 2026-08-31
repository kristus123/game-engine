export class Stream {

	static cameraStream = null
	static mediaRecorder = null

	static mimeType = Platform.safari
		? "video/mp4;codecs=h264,aac" // safari
		: "video/webm;codecs=vp8,opus" // chrome

	static async someoneIsStreaming() {
		return Assert.ok(await JsonHttpClient.currentlyStreaming()).streaming
	}

	static async start() {
		if (await this.someoneIsStreaming()) {
			throw new Error("can't start stream if stream already active")
		}

		Assert.ok(await NullHttpClient.startStream({
			body: {
				mimeType: this.mimeType.includes("webm") ? "webm" : "mp4",
			},
		}))

		this.cameraStream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: {
				echoCancellation: false,
				noiseSuppression: false,
				autoGainControl: false,
			},
		})

		this.mediaRecorder = new MediaRecorder(this.cameraStream, { mimeType: this.mimeType })

		this.mediaRecorder.ondataavailable = async e => {
			if (e.data.size > 0) {
				LowLevelHttpClient.post({
					routeName: "sendChunk",
					body: e.data, // blob
					formatBody: r => null,
					contentType: this.mimeType,
				})
			}
		}

		this.mediaRecorder.start(5_000)

		return this.cameraStream
	}

	static async stop() {
		if (this.mediaRecorder) {
			Assert.ok(await NullHttpClient.stopStream())
			this.mediaRecorder.stop()
			this.mediaRecorder = null
		}
		else {
			throw new Error("Can't stop when already stopped")
		}
	}
}
