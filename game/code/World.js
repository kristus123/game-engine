export class World {
	constructor() {
		this.client = new SocketClient()
		this.client.on('CLIENT_TO_CLIENT', json => {
			console.log(json)
		})
<<<<<<< HEAD
||||||| parent of 9cfb5777 (layout)

		window.r = new RtcClient()
=======

		Html.center([
			Html.button('hei'),
			Html.button('hei'),
		])

>>>>>>> 9cfb5777 (layout)
	}

	update() {
	}

	draw(draw) {
	}
}
