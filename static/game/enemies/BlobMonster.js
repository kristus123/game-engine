export class BlobMonster extends DynamicGameObject {
	constructor(player, invisibleWalls) {
		super(new Position(800, 0, 300, 200), 10, 10)

		const pathFinder = new SimplePathFinder(this, player, invisibleWalls)

		this.localObjects = new LocalObjects([
			pathFinder,
			new HorizontalSprite(this.position, '/static/assets/blob_57x32.png'),

			Update(u => {
				if (pathFinder.success) {
					Push(this).towards(pathFinder.c2)
				}
				else {
					Push(this).towards(pathFinder.c1)
				}
			}),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
