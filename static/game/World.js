export class World {
	constructor() {
		G.player = new Player(new Position(700, 2800))
		Camera.followInstantly(G.player)
		Controller.control(G.player)

		const inverseExponentialNumber = new InverseExponentialNumber(10, 100)

		this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(0, 0)).idle.show(0),
			G.player,
			new Grid(G.player),


			new Quest(Iterate(100, i => 
					() => new MonsterWave(inverseExponentialNumber.value, () => {
						G.pause = true
						setTimeout(() => {
							G.wave = i + 1
							DeathText.show(G.wave)
							inverseExponentialNumber.next()
							G.pause = false
						}, 2000)
					}),
			)),


			Money.init(),
			Store.init(),
			G.monsters,
			G.allies,
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw) {
		this.localObjects.draw(draw)
	}
}
