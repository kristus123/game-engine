export class ChickenFood extends DynamicGameObject {
	constructor(position) {
		super(position, 2000, 10)

		this.position.width = 20
		this.position.height = 20
	}

	update() {
		const chicken = this.touchesAny(Registry.Chicken)
		if (chicken) {
			this.removeFromLoop()
			chicken.eat()
		}
	}

	draw(draw, guiDraw) {
		draw.orange(this.position)
	}
}
