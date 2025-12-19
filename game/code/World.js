export class World {
	constructor() {
		this.client = new SocketClient()
		this.client.on("CLIENT_TO_CLIENT", json => {
			console.log(json)
		})


			const ffmpeg = new Ffmpeg(5000)

			ffmpeg.start().then(out => {
			  const blob = new Blob([out.buffer], { type: "video/mp4" })
			  const url = URL.createObjectURL(blob)
			  window.open(url)
			})
	}

	update() {
	}

	draw(draw) {
	}
}
