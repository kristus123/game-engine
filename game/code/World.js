export class World {
	constructor() {
		console.log('Hot Reload Test Game')
		this.client = new SocketClient()
		this.client.on('CLIENT_TO_CLIENT', json => {
			console.log(json)
		})

		window.r = new RtcClient()
	}

	update() {
	}

	draw(draw) {
	}
}
