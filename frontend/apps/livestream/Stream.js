export class Stream {

	static async someoneIsStreaming() {
		// why doet it need 2 awaits ? can we fix it ?
		const body = await Assert.ok(await JsonHttpClient.currentlyStreaming())
		return body.streaming
	}

	static async start() {
		Assert.true(!(BetterMediaRecorder.active && await this.someoneIsStreaming()))

		Assert.ok(await NullHttpClient.startStream({
			body: {
				mimeType: Platform.mimeType.includes("webm") ? "webm" : "mp4", // move ternary to backend
			},
		}))
		Toast(Platform.mimeType)

		await BetterMediaRecorder.start(async blob => {
			await LowLevelHttpClient.post({
				routeName: "sendChunk",
				body: blob,
				formatBody: r => null,
				contentType: Platform.mimeType,
			})
			Toast("ok")
		})

		return BetterMediaRecorder.video
	}

	static async swapAudio(deviceId) {
		await BetterMediaRecorder.swapAudio(deviceId)
	}

	static async swapVideo(deviceId) {
		await BetterMediaRecorder.swapVideo(deviceId)
	}

	static async stop() {
		Assert.true(BetterMediaRecorder.active && await this.someoneIsStreaming())

		Assert.ok(await NullHttpClient.stopStream())

		await BetterMediaRecorder.stop()
	}

}
