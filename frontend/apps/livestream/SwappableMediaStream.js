export class SwappableMediaStream {

	static video = null
	static stream = null

	static audioContext = null
	static audioOutput = null

	static audioSource = null

	static {
		const v = document.createElement("video")
		v.playsInline = true
		v.srcObject = null
		v.autoplay = true
		v.muted = true
		this.video = v

		const { ctx, canvas, canvasStream } = Canvas(1280, 720)

		FrameLoop(() => {
			if (this.video?.readyState >= 2) { // has enough data to display current frame
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
		this.audioSource?.mediaStream.getTracks().forEach(t => t.stop())

		this.audioSource = this.audioContext.createMediaStreamSource(newMic)
		this.audioSource.connect(this.audioOutput)
	}

	static async swapVideo(deviceId) {
		this.video.srcObject?.getTracks().forEach(t => t.stop())

		this.video.srcObject = await MediaDevices.video(deviceId)
	}
}
