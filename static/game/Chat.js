export class Chat {
	constructor( ) {

		this.localObjects = new LocalObjects([
		])

		// this.blur = new Blur()
		this.thing = new SexyChat(new Position(0, -200))

		this.picture = new DynamicGameObject(new Position(-800, -400, 600, 600), 10, 10, '/static/assets/art/bar.jpg')
	}

	update() {
		this.localObjects.update()

		this.thing.update()
	}

	draw(draw, guiDraw) {
		// this.blur.draw(draw, guiDraw)
		this.picture.draw(draw)
		this.thing.draw(draw)

		this.localObjects.draw(draw, guiDraw)
	}

}
