export class Ally extends DynamicGameObject {
	constructor(position) {
		super(position, 100, 100)

		this.localObjects = new LocalObjects([
			G.Sprite.ally(this.position),
			this.pathFinder = new PathFinder(this, G.player),
			this.sine = new Sine(1, 2, 0.05),

		])

		G.allies.add(this)
	}

	update() {
		this.localObjects.update()
		ForcePush(this).towards(this.pathFinder.position, 3)
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		this.position.scale(this.sine.value)
	}

}
