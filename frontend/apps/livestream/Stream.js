export class Stream {

	static async start() {
		const { streaming } = Assert.ok(await JsonHttpClient.currentlyStreaming())
		if (streaming) {
			throw new Error("can't startr stream if stream already active")
		}

		const mimeType = Platform.safari
			? "video/mp4;codecs=h264,aac" // safari
			: "video/webm;codecs=vp8,opus" // chrome

		Assert.ok(await NullHttpClient.startStream({
			body: {
				mimeType: mimeType.toLowerCase().includes("webm") ? "webm" : "mp4",
			}
		}))

		const cameraStream = await navigator.mediaDevices.getUserMedia({
			video: true,
			audio: {
				echoCancellation: false,
				noiseSuppression: false,
				autoGainControl: false,
			},
		})

		const mediaRecorder = new MediaRecorder(cameraStream, { mimeType: mimeType })

		mediaRecorder.ondataavailable = async e => {
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

		mediaRecorder.start(5_000)
	}

	static async stop() {
		Assert.ok(await NullHttpClient.stopStream())
	}

	update() {

	}
}
