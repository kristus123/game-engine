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

		RequestAnimationFrameLoop(() => {
			if (this.video?.readyState >= 2) { // has enough data to display current frame
				const scale = Math.min(
					canvas.width / this.video.videoWidth,
					canvas.height / this.video.videoHeight)

				const width = this.video.videoWidth * scale
				const height = this.video.videoHeight * scale

				ctx.drawImage(
					this.video,
					(canvas.width - width) / 2,
					(canvas.height - height) / 2,
					width,
					height)
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
