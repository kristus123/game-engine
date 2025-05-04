export class ChickenFood extends DynamicGameObject {
	constructor(position) {
		super(position, 2000, 10)

		this.position.width = 20
		this.position.height = 20
	}

	draw(draw, guiDraw) {
		draw.orange(this.position)
	}
}
