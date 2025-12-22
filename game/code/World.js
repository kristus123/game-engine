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

<<<<<<< HEAD
		Html.center([
			Html.button('hei'),
			Html.button('hei'),
		])

>>>>>>> 9cfb5777 (layout)
||||||| parent of d613e544 (x)
		Html.center([
			Html.button('hei'),
			Html.button('hei'),
		])

=======
		Layout.test()
>>>>>>> d613e544 (x)
	}

	update() {
	}

	draw(draw) {
	}
}
