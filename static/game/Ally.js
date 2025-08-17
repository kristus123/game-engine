export class Ally extends DynamicGameObject {
	constructor(position) {
		super(position, 100, 100)

		const invisibleWalls = [
				new Position(100, 100, 1000, 100),
				new Position(100, 400, 1000, 1000),
			]
		this.localObjects = new LocalObjects([
			G.Sprite.ally(this.position),
			this.path = new SimplePathFinder(this, G.player, invisibleWalls),
			...invisibleWalls.map(p => new InvisibleWall(p, this)),
		])

		G.allies.add(this)
	}

	update() {
		const a = this.touchesAny(G.allies.objects)
		if (a) {
			// ForcePush(this).awayFrom(a, 6)
			// ForcePush(a).awayFrom(this, 6)
		}

		Push(this).towards(this.path.current, 5)

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
