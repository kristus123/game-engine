export class Monster extends DynamicGameObject {
	constructor(paths, onKill=() => {}) {
		super(Position(677, -644, 100, 100), 10, 10)

		this.localObjects = Objects([
			Init(this, {
				sine: Sine(100, 0.1),
				hp: Hp(this, () => {
					this.onKill()
					Money.increase(1)
					this.removeFromLoop()
				}),
				path: Path(this, paths),
				sprite: G.Sprite.enemy(this.position),
			}),

			OnTrue(() => this.touches(paths.at(-1)), () => {
				DeathText.show('You lose', 9000)
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
			this.moveTowards(this.path.position.center)
		}
	}

	draw(draw) {
		this.localObjects.draw(draw)
	}
}
