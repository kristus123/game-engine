export class Stream {

	static cameraStream = null
	static mediaRecorder = null

	static {
		this.mimeType = Platform.safari
			? "video/mp4;codecs=h264,aac" // safari
			: "video/webm;codecs=vp8,opus" // chrome

	}

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
			}
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
					body: e.data,
					formatBody: r => null,
					contentType: mimeType,
					ok: () => {
						Log("ok!")
					},
					error: () => {
						Log("error!")
					},
				})
			}
		}

		this.mediaRecorder.start(5_000)

		return this.cameraStream
	}

	static async stop() {
		if (this.mediaRecorder.state == "inactive") {
			throw new Error("Can't stop when already stopped")
		}

		Assert.ok(await NullHttpClient.stopStream())
		this.mediaRecorder.stop()
		this.mediaRecorder = null
	}

}
