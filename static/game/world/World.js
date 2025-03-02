export class World {
	constructor() {

		this.monster = new SimpleMonster()
		Cam.followInstantly(this.monster.position.center)

		this.foodFactory = new FoodFactory(new Position(0,0), this.monster)
		this.localObjects = new LocalObjects([
			this.monster,
			

			Init(this, {
				splash: new SplashParticles(),
				store: new Store(),
			})
		])
	}

	update() {
		this.localObjects.update()

		if (this.foodFactory.foods.empty()) {
			this.monster.velocity.reset()
		}
		else {
			ForcePush(this.monster).towards(this.foodFactory.foods.first(), 20)
		}

		for (const f of this.foodFactory.foods.objects) {
			if (this.monster.touches(f)) {
				this.splash.random(f)
				this.foodFactory.foods.remove(f)
				this.monster.hunger += 10
				Html.fadeaway('delicious!', Cam.p(this.monster))
				HtmlProgressBar.change(+1)
			}
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		// draw.test(new Position(0, 0))
	}
}
