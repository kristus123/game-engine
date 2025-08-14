export class Monster extends DynamicGameObject {
	constructor(paths, onKill=() => {}) {
		super(new Position(677, -644, 100, 100), 10, 10)

		this.localObjects = new LocalObjects([
			Init(this, {
				sine: new Sine(100, 0.1),
				hp: new Hp(this, () => {
					// this.removeFromLoop()
					// G.monsters.remove(m)
				}),
				path: new Path(this, paths),
				// splashParticles: new SplashParticles(),
				sprite: G.Sprite.enemy(this.position),
			}),
		])

		G.monsters.add(this)
	}

	update() {
		if (this.hp.dead) {
			this.onKill()
			this.removeFromLoop()
			G.monsters.remove(this)
			Money.increase(1)
		}

		this.localObjects.update()


		if (!this.path.completed) {
			Move(this).towards(this.path.position.center, 0.5)
		}
		else {
		}

		// this.splashParticles.random(this.position.center, "black")
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
