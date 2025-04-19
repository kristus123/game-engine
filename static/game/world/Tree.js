export class Tree extends StaticGameObject {
	constructor(position) {
		super(position)

		this.position.width = 200
		this.position.height = 200

		this.localObjects = new LocalObjects([
			new Picture(this.position, '/static/assets/tree.png')
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
