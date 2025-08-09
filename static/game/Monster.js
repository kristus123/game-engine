export class Monster extends DynamicGameObject {
	constructor() {
		super(new Position(677, -644, 100, 100), 10, 10)

		this.localObjects = new LocalObjects([
			Init(this, {
				sine: new Sine(100, 0.1),
				hp: new Hp(this, () => {
					this.removeFromLoop()
				}),
				path: new Path(this, [
					new Position(677, -653),
					new Position(800, 80),
					new Position(140, 618),
					new Position(-800, 2),
				]),
				// splashParticles: new SplashParticles(),
				sprite: G.Sprite.enemy(this.position),
			}),
		])

		G.monsters.add(this)
	}

	update() {
		this.localObjects.update()


		if (!this.path.completed) {
			Move(this).towards(this.path.position, 0.5)
		}
		else {
		}

		// this.splashParticles.random(this.position.center, "black")
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
