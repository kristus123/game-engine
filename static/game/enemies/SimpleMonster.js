export class SimpleMonster extends DynamicGameObject {
	constructor() {
		super(new Position(0, 0, 300, 200), 10, 10)

		this.hunger = 100

		this.localObjects = new LocalObjects([
			new HorizontalSprite(this.position, '/static/assets/blob_57x32.png'),
			Init(this, {
				splash: new SplashParticles(),
			})
		])

		Mouse.addOnClick('click monster', () => {
			if (Mouse.hovering(this)) {
				this.splash.random(Mouse.position)
				this.hunger += 4
			}
		})
	}

	update() {
		this.hunger -= 0.1
		this.localObjects.update()

		if (!G.foods.empty()) {
			ForcePush(this).towards(G.foods.closestTo(this), 20)
		}

		for (const f of G.foods) {
			if (this.touches(f)) {
				this.splash.random(f)
				G.foods.remove(f)
				this.hunger += 10
				Html.fadeaway('delicious!', Cam.p(this))
			}
		}
	}

	draw(draw, guiDraw) {
		draw.hpBar(this.position.over(), this.hunger, 100)
		this.localObjects.draw(draw, guiDraw)
	}
}
