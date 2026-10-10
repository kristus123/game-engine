export class Stream {

	static async online() {
		const body = await Assert.ok(await JsonHttpClient.streamOnline())
		return body.online
	}

	static async start() {
		Assert.false(await this.online())

		Assert.ok(await NullHttpClient.startStream({
			body: {
				mimeType: Platform.mimeType.includes("webm") ? "webm" : "mp4", // move ternary to backend
			},
		}))

		await BetterMediaRecorder.start(async blob => {
			await LowLevelHttpClient.post({
				routeName: "sendChunk",
				body: blob,
				formatBody: r => null,
				contentType: Platform.mimeType,
			})
		})

		return BetterMediaRecorder.video
	}

	static get audioDeviceIds() {
		return SwappableMediaStream.audioDeviceIds
	}

	static async addAudioDevice(deviceId) {
		await BetterMediaRecorder.addAudioDevice(deviceId)
	}

	static removeAudioDevice(deviceId) {
		BetterMediaRecorder.removeAudioDevice(deviceId)
	}

	static async swapVideo(deviceId) {
		await BetterMediaRecorder.swapVideo(deviceId)
	}

	static async stop() {
		Assert.true(await this.online())

		await BetterMediaRecorder.stop()
		await Assert.ok(await NullHttpClient.stopStream())
	}

}
