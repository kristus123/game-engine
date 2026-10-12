export class VideoStream {
	constructor() {
		const { canvas, ctx, canvasStream } = H.CanvasWithStream(1280, 720, 60)
		this.canvas = canvas
		this.ctx = ctx

		this.video = document.createElement("video")
		this.video.autoplay = true
		this.video.muted = true
		this.video.playsInline = true
		this.video.onloadedmetadata = () => {
			this.canvas.width = this.video.videoWidth
			this.canvas.height = this.video.videoHeight
			console.log("___")
			console.log(this.video.videoWidth)
			console.log("___")
		}

		this.stream = canvasStream
		this.track = this.stream.getVideoTracks()[0]
	}

	set sourceObject(stream) {
		console.log("setting remote stream")
		this.video.srcObject = stream
	}

	get enabled() {
		return !this.video.paused
	}

	pause() {
		this.video.pause()
	}

	resume() {
		this.video.play()
	}

	update() {
		if this.video.paused {
			this.ctx.fillStyle = "rgba(0, 0, 255, 1)"
			this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)
		}
		else {
			this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height)
		}
	}

}
