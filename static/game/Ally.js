export class Ally extends DynamicGameObject {
	constructor(position) {
		super(position, 100, 100)

		this.localObjects = new LocalObjects([
			G.Sprite.ally(this.position),
			this.path = new PathFinder(this, G.player),
			G.invisibleWalls,
			new Turret(this.position),
		])

		G.allies.add(this)
	}

	update() {
		if (this.path.success) {
			console.log('heihei')
		}

		if (!this.within(100, this.path.current)) {
			Move(this).towards(this.path.current, 1)
		}

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
