export class FoodFactory extends StaticGameObject {
	constructor(position) {
		super(position)

		this.position.width = 100
		this.position.height = 100

		this.foods = new LocalObjects([
		])
	}

	update() {
		this.foods.update()


		if (Random.percentageChance(10)) {
			const f = new Square(this.position.copy(), 10)
			f.weight = 2000
			f.velocityFactor = Random.integerBetween(100, 2000)
			ForcePush(f).roughlyTowards(Random.direction(this.position), 20)

			this.foods.add(f)
		}

	}

	draw(draw, guiDraw) {
		this.foods.draw(draw, guiDraw)

		super.draw(draw, guiDraw)
	}
	
}
