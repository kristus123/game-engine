export class VideoStream {
	constructor() {
		this.canvas = document.createElement("canvas")
		this.video = document.createElement("video")

		this.ctx = this.canvas.getContext("2d")

		this.canvas.width = 1280
		this.canvas.height = 720

		this.video.autoplay = true
		this.video.muted = true
		this.video.playsInline = true

		this.stream = this.canvas.captureStream(60)
		this.track = this.stream.getVideoTracks()[0]
	}

	set sourceStream(stream) {
		this.video.srcObject = stream
	}

	get enabled() {
		return !this.video.paused
	}

	pause() {
		this.video.pause()
	}

	async resume() {
   	await this.video.play()
	}

	update() {
		if (this.video.paused) {
			this.drawPreview()
		}
		else {
			this.drawSource()
		}
	}

	drawPreview() {
		this.ctx.fillStyle = "rgba(0, 0, 255, 1)"
		this.ctx.fillRect(
			0,
			0,
			this.canvas.width,
			this.canvas.height
		)
	}

	drawSource() {
		this.ctx.drawImage(
			this.video,
			0,
			0,
			this.canvas.width,
			this.canvas.height
		)
	}
}