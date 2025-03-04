export class SimpleMonster extends DynamicGameObject {
	constructor(position) {
		super(position, 10, 10)

		this.position.width = 300
		this.position.height = 200

		this.hunger = 50

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
				const m = G.monsters.add(new SimpleMonster(this.position.copy()))
				m.hunger = 50
			})
		}

		for (const m of G.monsters) {
			if (this === m) {
				continue
				
			}
			if (this.touches(m)) {
				ForcePush(this).awayFrom(m, 10)

				break
			}
		}
	}

	draw(draw, guiDraw) {
		draw.hpBar(this.position.over(), this.hunger, 100)
		this.localObjects.draw(draw, guiDraw)

		if (this.hunger < 0) {
			this.velocity.reset()
			draw.red(this.poop)
		}
	}
}
