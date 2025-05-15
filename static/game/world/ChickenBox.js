export class ChickenBox extends StaticGameObject {
	constructor(position) {
		super(position)

		this.position.width = 50
		this.position.height = 50

		this.localObjects = new LocalObjects([
			new Picture(position, '/static/assets/box.png')
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
