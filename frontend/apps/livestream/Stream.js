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
	}

	static async stop() {
		if (BetterMediaRecorder.active && await this.someoneIsStreaming()) {
			Assert.ok(await NullHttpClient.stopStream())
			BetterMediaRecorder.stop()
		}
		else {
			throw new Error("Can't stop when already stopped")
		}
	}
}
