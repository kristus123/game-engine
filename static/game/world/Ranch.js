export class Ranch extends StaticGameObject {
	constructor(position) {
		super(position)

		this.position.width = 500
		this.position.height = 200

		this.animals = []
	}

	add(animal) {
		List.addIfNotPresent(this.animals, animal)
	}

	update() {
		for (const a of this.animals) {
			a.hunger += 0.2

			if (!a.touches(this)) {
				Move(a).towards(this.position.center, 1)
			}
		}
	}

	draw(draw, guiDraw) {
		super.draw(draw, guiDraw)
	}
}
