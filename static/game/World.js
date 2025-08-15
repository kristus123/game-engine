export class World {
	constructor() {
		Camera.followInstantly(new Position(500, 500))

		this.player = new Player(new Position(0, 0))
		G.player = this.player

		Controller.control(this.player)
		// Camera.followInstantly(this.player)

		const e = new InverseExponentialNumber(10, 100)
		this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(0, 0)).idle.show(0),
			this.player,
			new BottomText(['hei']),


			new Quest(Iterate(100, i => () =>
				new class {
					constructor() {
						new DeathText('round ' + i).show()
						this.localObjects = new LocalObjects([
							this.m = new MonsterWave(e.value, () => {
								setTimeout(() => {
									e.next()
									console.log("ready for next")
									this.completed = () => true
								}, 1000);
							}),
						])
					}

					completed() {
						return false
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
			new Turret(new Position(800, 0)),
			new Turret(new Position(800, 0)),
			new Turret(new Position(800, 0)),
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
