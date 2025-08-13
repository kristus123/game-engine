export class World {
	constructor() {
		Camera.followInstantly(new Position(500, 500))

		this.tilemaps = new Tilemaps()

		this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(0, 0)).idle.show(0),
			new Money(),
			new BottomText([
				"when life is hard, just remember",
				"It will get harder",
				"It will get so hard that you will cry",
				"That is a small step towards your next part in life",
				"So when you are about to cry....",
			]),
			new After(500, () => {
				tla(new Monster(this.tilemaps.enemyWalkTiles))
			}),
		])

		// if (this.tilemaps.touchesTurretTiles(p)) {
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		if (Mouse.onClick) {
			draw.rectangle(new Position(Mouse.position.x, Mouse.position.y, 100, 100))

			
			const valid = this.tilemaps.touchesTurretTiles(Mouse.position)
			const p = new Position(Mouse.position.x, Mouse.position.y, 100, 100)
			draw.color(p, valid ? 'green': 'red')
		}
	}
}
