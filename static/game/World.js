export class World {
	constructor() {
	//	new Menu()
	//	this.grassTile = new GridTile(Palette.fixedOffscreen(4000, 4000), G.image.grassTile)
		this.client = new VideoCall()
		this.client.createPeerConnection(Math.random())
		this.client.startCall()

	}

	update() {
	}

	draw(draw) {
	}
}
