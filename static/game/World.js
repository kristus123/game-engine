export class World {
	constructor() {
		this.rtcClient = new RtcClient()
		this.rtcClient.startLocalStream().then(localStream => {
			const video = document.createElement('video')
			video.srcObject = localStream
			video.autoplay = true
			video.style.width = '200px'
			document.body.appendChild(video)
		})
	}

	update() {
	}

	draw(draw) {
	}
}
