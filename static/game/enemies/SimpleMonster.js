export class SimpleMonster extends DynamicGameObject {
	constructor(position) {
		super(position, 10, 10)

		this.position.width = 30
		this.position.height = 20

		this.hunger = 50

		this.localObjects = new LocalObjects([
			new HorizontalSprite(this.position, '/static/assets/blob_57x32.png'),
		])
	}

	update() {
		this.localObjects.update()

		this.hunger -= 1
		if (this.hunger < 0) {
			this.removeFromLoop()
		}

		if (!G.foods.empty()) {
			ForcePush(this).towards(G.foods.closestTo(this), 20)
		}

		if (Random.percentageChance(1000)) {
			G.poop.add(new Poop(this.position.copy()))
		}

		for (const f of G.foods) {
			if (this.touches(f)) {
				// G.splash.random(f)
				G.foods.remove(f)
				this.hunger += 10
				Audio.eat()
			}
		}

		if (this.hunger > 200) {
			this.removeFromLoop()

			Iterate(2, () => {
				const m = G.monsters.add(new SimpleMonster(this.position.copy()))
				m.hunger = 50
			})
		}
	}

	draw(draw, guiDraw) {
		// draw.hpBar(this.position.over(), this.hunger, 100)
		this.localObjects.draw(draw, guiDraw)
		draw.green(this)

		if (this.hunger < 0) {
			this.velocity.reset()
			draw.red(this.poop)
		}
	}
}
