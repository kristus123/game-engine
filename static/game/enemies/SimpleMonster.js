export class SimpleMonster extends DynamicGameObject {
	constructor() {
		super(new Position(0, 0, 300, 200), 10, 10)

		this.hunger = 99

		this.localObjects = new LocalObjects([
			new HorizontalSprite(this.position, '/static/assets/blob_57x32.png'),
		])
	}

	update() {
		this.localObjects.update()

		this.hunger -= 0.1
		if (this.hunger < 0) {
			this.removeFromLoop()
		}

		if (!G.foods.empty()) {
			ForcePush(this).towards(G.foods.closestTo(this), 20)
		}

		if (Random.percentageChance(100)) {
			G.poop.add(new Poop(this.position.copy()))
		}

		for (const f of G.foods) {
			if (this.touches(f)) {
				G.splash.random(f)
				G.foods.remove(f)
				this.hunger += 10
				Html.fadeaway('delicious!', Cam.p(this))
			}
		}

		if (this.hunger > 100) {
			this.removeFromLoop()

			Iterate(2, () => {
				const m = G.monsters.add(new SimpleMonster())
				m.hunger = 50
			})
			
		}
	}

	draw(draw, guiDraw) {
		draw.hpBar(this.position.over(), this.hunger, 100)
		this.localObjects.draw(draw, guiDraw)
	}
}
