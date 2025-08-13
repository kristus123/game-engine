export class World {
	constructor() {
		Camera.followInstantly(new Position(500, 500))

		this.tilemaps = new Tilemaps()

		this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(0, 0)).idle.show(0),
			Money.init(),
			new BottomText([
				'when life is hard, just remember',
				'It will get harder',
				'It will get so hard that you will cry',
				'That is a small step towards your next part in life',
				'So when you are about to cry....',
			]),
			new After(500, () => {
				tla(new Monster(this.tilemaps.enemyWalkTiles))
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
