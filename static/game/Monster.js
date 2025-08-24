export class Monster extends DynamicGameObject {
	constructor(paths, onKill=() => {}) {
		super(new Position(677, -644, 100, 100), 10, 10)

		this.localObjects = new LocalObjects([
			Init(this, {
				sine: new Sine(100, 0.1),
				hp: new Hp(this, () => {
					this.onKill()
					Money.increase(1)
					this.removeFromLoop()
				}),
				path: new Path(this, paths),
				sprite: G.Sprite.enemy(this.position),
			}),

			OnTrue(() => this.touches(paths.at(-1)), () => {
				new DeathText('You lose', 9000).show()
			}),
		])

		G.monsters.add(this)


		this.hp.currentHp += G.wave * 2
		this.hp.maxHp += G.wave * 2

		this.hp.currentHp *= 0.6
		this.hp.maxHp *= 0.6
	}

	update() {
		this.localObjects.update()


		if (!this.path.completed) {
			Move(this).towards(this.path.position.center, 0.8 + (G.wave/10))
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
