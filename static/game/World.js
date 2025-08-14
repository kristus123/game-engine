export class World {
	constructor() {
		Camera.followInstantly(new Position(500, 500))

		this.tilemaps = new Tilemaps()

		this.player = new Player(new Position(0, 0))
		Controller.control(this.player)

		this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(0, 0)).idle.show(0),
			this.player,

			new Quest([
				() => new MonsterWave(this.tilemaps, 5),
				() => new Wait(5_000, () => {
					new DeathText('good job!').show()
				}),
				() => new MonsterWave(this.tilemaps, 10),
			]),
			Money.init(),
			G.monsters,
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
