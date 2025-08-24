export class World {
	constructor() {

		G.player = new Player(new Position(700, 2800))
		Camera.followInstantly(G.player)
		Controller.control(G.player)

		const e = new InverseExponentialNumber(10, 100)
		this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(0, 0)).idle.show(0),
			G.player,
			new Grid(G.player),
			new Quest(Iterate(100, i => () =>
				new class {
					constructor() {
						i = i + 1

						new DeathText('Round ' + i).show()
						G.wave = i
						this.localObjects = new LocalObjects([
							this.m = new MonsterWave(e.value, () => {
								G.pause = true
								setTimeout(() => {
									e.next()
									G.pause = false
									this.markTaskComplete()
								}, 2000)
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
			)),
			Money.init(),
			Store.init(),
			G.monsters,
			G.allies,
			// G.TileSheet.world,
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
