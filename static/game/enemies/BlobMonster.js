export class BlobMonster extends DynamicGameObject {
	constructor(player, invisibleWalls) {
		super(new Position(800, 0, 300, 200), 10, 10)

		const pathFinder = new SimplePathFinder(this, player, invisibleWalls)

		this.localObjects = new LocalObjects([
			pathFinder,
			new HorizontalSprite(this.position, '/static/assets/blob_57x32.png'),

			Update(u => {

				if (pathFinder.success) {
					Push(this).towards(pathFinder.c2, 2)
				}
				else {
					Push(this).towards(pathFinder.c1, 2)
				}

				if (this.within(100, pathFinder.c2) || this.within(100, pathFinder.c1)) {
					this.decreaseVelocity(0.8)
				}

				this.velocity.cap = 100

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
