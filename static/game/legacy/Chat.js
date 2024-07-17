export class Chat {
	constructor(camera) {

		this.localObjects = new LocalObjects([
		])

		// this.blur = new Blur(camera)
		this.penguin = new SexyChat(new Position(0, -200))

		this.picture = new DynamicGameObject(new Position(-800, -400, 600, 600), 10, 10, '/static/assets/art/bar.jpg')
	}

	update() {
		this.localObjects.update()

		this.penguin.update()
	}

	draw(draw, guiDraw) {
		// this.blur.draw(draw, guiDraw)
		this.picture.draw(draw)
		this.penguin.draw(draw)

		this.localObjects.draw(draw, guiDraw)
	}

}
