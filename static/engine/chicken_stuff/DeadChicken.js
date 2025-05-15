export class DeadChicken extends DynamicGameObject {
	constructor(position) {
		super(position, 10, 10)

		this.position = this.position.copy()

		this.position.width = 20
		this.position.height = 20

		this.localObjects = new LocalObjects([
			new Killed(position),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		draw.orange(this.position)
	}
}
