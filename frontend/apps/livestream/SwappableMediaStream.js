export class SwappableMediaStream {

	static video = null
	static stream = null

	static audioContext = null
	static audioOutput = null

	static audioSource = null
	static audioStream = null
	static videoStream = null

	static {
		const v = document.createElement("video")
		v.srcObject = null
		v.muted = true
		v.autoplay = true
		v.playsInline = true
		this.video = v

		const { ctx, canvas, canvasStream } = Canvas(1280, 720)

		RequestAnimationFrameLoop(() => {
			if (this.video.readyState >= 2) {
				ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height)
			}
		})

		this.audioContext = new AudioContext()
		this.audioOutput = this.audioContext.createMediaStreamDestination()

		this.stream = new MediaStream([
			...canvasStream.getVideoTracks(),
			...this.audioOutput.stream.getAudioTracks(),
		])
	}

	static async swapAudio(deviceId) {
		await this.audioContext.resume()

		const newMic = await MediaDevices.audio(deviceId)

		this.audioSource?.disconnect()
		this.audioStream?.getTracks().forEach(track => track.stop())

		this.audioSource = this.audioContext.createMediaStreamSource(newMic)
		this.audioSource.connect(this.audioOutput)
		this.audioStream = newMic
	}

	static async swapVideo(deviceId) {
		const newCam = await MediaDevices.video(deviceId)

		this.video.srcObject = newCam
		this.videoStream?.getTracks().forEach(track => track.stop())

		this.videoStream = newCam
	}
}
