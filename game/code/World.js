export class World {
	constructor() {
		this.client = new SocketClient()
		this.client.on('CLIENT_TO_CLIENT', json => {
			console.log(json)
		})
	}

	update() {
	}

	draw(draw) {
	}
}
