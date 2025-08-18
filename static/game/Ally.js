export class Ally extends DynamicGameObject {
	constructor(position) {
		super(position, 100, 100)

		this.localObjects = new LocalObjects([
			G.Sprite.ally(this.position),
			this.path = new PathFinder(this, new Position(0,0)),
			G.invisibleWalls,
			OnChange(() => this.friend && this.within(100, this.friend), dance => {
				this.dance = dance
			}),
			this.sine = new Sine(2, 0.5),
		])

		const otherAlly = G.allies.anyExcept(this)
		if (otherAlly) {
			this.friend = otherAlly
			otherAlly.friend = this

			this.path.target = this.friend
			otherAlly.path.target = this
		}

		G.allies.add(this)
	}

	update() {
		if (this.path.success) {
			console.log('heihei')
		}

		if (!this.within(10, this.path.current)) {
			Move(this).towards(this.path.current, 1)
		}
		else {
			const m = this.withinAny(10000, G.monsters)
			if (m) {
				// console.log("attack")
				// this.path.target = m
			}
		}

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		if (this.dance) {
			this.position.scale(MinCap(0.5, this.sine.value))
		}
	}

}
