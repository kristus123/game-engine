export class MediaDevices {

	static async audio(deviceId = undefined) { // allow-null
		Assert.true(Permission.granted)

		return await navigator.mediaDevices.getUserMedia({
			audio: {
				...(deviceId == null ? {} : { deviceId: { exact: deviceId } }),
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

	static async video(deviceId = undefined) { // allow-null
		Assert.true(Permission.granted)

		return await navigator.mediaDevices.getUserMedia({
			video: {
				...(deviceId == null ? {} : { deviceId: { exact: deviceId } }),
				frameRate: {
					ideal: 30,
				},
				width: {
					ideal: 1280,
				},
				height: {
					ideal: 720,
				},
				aspectRatio: {
					ideal: 16 / 9,
				}
			},
		})
	}

	static async audioAndVideo(audioDeviceId, videoDeviceId) {
		Assert.true(Permission.granted)

		const audio = await this.audio(audioDeviceId)
		const video = await this.video(videoDeviceId)

		return new MediaStream([
			...audio.getAudioTracks(),
			...video.getVideoTracks(),
		])
	}

	static async screen() {
		return await navigator.mediaDevices.getDisplayMedia({
			video: true,
			// audio: true,
		})
	}

}
