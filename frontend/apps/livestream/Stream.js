export class Stream {

	static async someoneIsStreaming() {
		// why do i need 2 awaits ? can we fix it ?
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

		await BetterMediaRecorder.start(blob => {
			LowLevelHttpClient.post({
				routeName: "sendChunk",
				body: blob,
				formatBody: r => null,
				contentType: Platform.mimeType,
			})
		})

		BetterMediaRecorder.swap()

		return BetterMediaRecorder.video
	}

	static async swap() {
		await BetterMediaRecorder.swap()
	}

	static async stop() {
		Assert.true(BetterMediaRecorder.active && await this.someoneIsStreaming())

		Assert.ok(await NullHttpClient.stopStream())

		await BetterMediaRecorder.stop()
	}
}
