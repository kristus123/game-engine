export class SwappableMediaStream {

	static video = null
	static mediaStream = null

	static audioContext = null
	static audioOutput = null

	static audioSource = null
	static currentStream = null

	static {
		const v = document.createElement("video")
		v.srcObject = null
		v.muted = true
		v.autoplay = true
		v.playsInline = true
		this.video = v

		const canvas = document.createElement("canvas")
		canvas.width = 1280
		canvas.height = 720
		const videoOutput = canvas.captureStream(30)
		const ctx = canvas.getContext("2d")

		RequestAnimationFrameLoop(() => {
			if (this.video.readyState >= 2) {
				ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height)
			}
		})

		this.audioContext = new AudioContext()
		this.audioOutput = this.audioContext.createMediaStreamDestination()

		this.mediaStream = new MediaStream([ // pass this into mediaRecorder
			...videoOutput.getVideoTracks(),
			...this.audioOutput.stream.getAudioTracks()
		])
	}

	static async swapAudio(constraints) {
		await this.audioContext.resume()

		const stream = await navigator.mediaDevices.getUserMedia({
			audio: constraints,
		})

		this.audioSource?.disconnect()
		this.audioSource = this.audioContext.createMediaStreamSource(stream)
		this.audioSource.connect(this.audioOutput)

		this.currentStream?.getAudioTracks().forEach(track => track.stop())

		this.currentStream = new MediaStream([
			...this.currentStream?.getVideoTracks() ?? [],
			...stream.getAudioTracks(),
		])

		return stream
	}

	static async swapVideo(constraints) {
		const stream = await navigator.mediaDevices.getUserMedia({
			video: constraints,
		})

		this.video.srcObject = stream

		this.currentStream?.getVideoTracks().forEach(track => track.stop())

		this.currentStream = new MediaStream([
			...this.currentStream?.getAudioTracks() ?? [],
			...stream.getVideoTracks(),
		])

		return stream
	}


}
