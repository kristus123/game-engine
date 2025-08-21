export class World {
	constructor() {

		G.player = new Player(new Position(700, 2800))
		Camera.followInstantly(G.player)
		Controller.control(G.player)

		new Ally(new Position(700, 2800, 10, 10))
		new Ally(new Position(2000, 2800, 10, 10))


		const e = new InverseExponentialNumber(10, 100)
		this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(0, 0)).idle.show(0),
			G.player,

			new Quest(Iterate(100, i => () =>
				new class {
					constructor() {
						this.localObjects = new LocalObjects([
							this.m = new MonsterWave(e.value, () => {
								setTimeout(() => {
									e.next()
									this.completed = () => true
								}, 1000)
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
			Store.init(),
			G.monsters,
			G.allies,
			this.tilemaps = new Tilemaps()
		])

		Html.right([
			Html.div('big', [
				Html.h1('wake up'),
				Html.p('it is time to wake up'),
				Html.p('it is time to wake up'),
			]),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
