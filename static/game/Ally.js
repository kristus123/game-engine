export class Ally extends DynamicGameObject {
	constructor(position) {
		super(position, 100, 100)

		const invisibleWalls = [
			new Position(100, 100, 1000, 100),
			new Position(100, 400, 1000, 1000),
		]
		this.localObjects = new LocalObjects([
			G.Sprite.ally(this.position),
			this.path = new PathFinder(this, G.player, invisibleWalls),
		])

		G.allies.add(this)
	}

	update() {
		ForcePush(this).towards(this.path.current, 5)

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
