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
			new Quest(Iterate(100, i => () =>
				new class {
					constructor() {
						i = i + 1

						// new DeathText('Round ' + i).show()
						G.wave = i
						this.localObjects = new LocalObjects([
							this.m = new MonsterWave(inverseExponentialNumber.value, () => {
								G.pause = true
								setTimeout(() => {
									inverseExponentialNumber.next()
									G.pause = false
									this.markTaskComplete()
								}, 2000)
							}),
						])
					}

					update() {
						this.localObjects.update()
					}

					draw() {
						this.localObjects.draw()
					}
				}
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

	draw() {
		console.log(Draw.get().rectangle(new Position(100,100, 200 , 200)))
		this.localObjects.draw(Draw.get())
	}
}
