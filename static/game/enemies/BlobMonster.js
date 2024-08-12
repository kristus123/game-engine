export class BlobMonster extends DynamicGameObject {
	constructor(player) {
		super(new Position(0,0, 300, 200), 10, 10)

		const pathFinder = new SimplePathFinder(player, [new Position(0,0)])

		this.localObjects = new LocalObjects([
			pathFinder,
			new HorizontalSprite(this.position, '/static/assets/blob_57x32.png'),

			Update(u => {
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
