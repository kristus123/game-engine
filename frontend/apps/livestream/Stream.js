export class Stream {

	static betterMediaRecorder = BetterMediaRecorder()

	static async someoneIsStreaming() {
		// why do i need 2 awaits ? can we fix it ?
		const body = await Assert.ok(await JsonHttpClient.currentlyStreaming())
		return body.streaming
	}

	static async start() {
		// Assert.true(!(BetterMediaRecorder.active && await this.someoneIsStreaming()))

		// Assert.ok(await NullHttpClient.startStream({
		// 	body: {
		// 		mimeType: Platform.mimeType.includes("webm") ? "webm" : "mp4", // move ternary to backend
		// 	},
		// }))

		await (await this.betterMediaRecorder).start(blob => {
			// LowLevelHttpClient.post({
			// 	routeName: "sendChunk",
			// 	body: blob,
			// 	formatBody: r => null,
			// 	contentType: Platform.mimeType,
			// })
		})

		const x = await this.betterMediaRecorder
		console.log("x")
		console.log(await x.swap())
		console.log("x")


		return (await this.betterMediaRecorder).video
	}

	static async swap() {
		const x = await this.betterMediaRecorder
		console.log("x")
		console.log(await x.swap())
		console.log("x")
	}

	static async stop() {
		// if (BetterMediaRecorder.active && await this.someoneIsStreaming()) {
		if (true) {
			// Assert.ok(await NullHttpClient.stopStream())
			const x = await this.betterMediaRecorder
			console.log("x")
			console.log(await x.swap())
			console.log("x")
			x.stop()
		}
		else {
			throw new Error("Can't stop when already stopped")
		}
	}
}
