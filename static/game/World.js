export class World {
	constructor() {
		Camera.followInstantly(new Position(500, 500))

		this.tilemaps = new Tilemaps()

		this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(0, 0)).idle.show(0),
			
			new Quest([
				() => new MonsterWave(this.tilemaps, 5),
				() => new Wait(5_000, () => {
					new BottomText(['you did it, fucking bastard!'])
				}),
				() => new MonsterWave(this.tilemaps, 10),
			]),
			Money.init(),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
