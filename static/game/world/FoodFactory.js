export class FoodFactory extends StaticGameObject {
	constructor(position) {
		super(position)

		this.position.width = 100
		this.position.height = 100
	}

	update() {
		G.foods.update()

		if (Random.percentageChance(100)) {
			const f = new Square(this.position.copy(), 10)
			f.weight = 2000
			f.velocityFactor = Random.integerBetween(10, 20)
			ForcePush(f).randomly(20)

			G.foods.add(f)
		}
	}

	draw(draw, guiDraw) {
		G.foods.draw(draw, guiDraw)

		super.draw(draw, guiDraw)
	}
}
