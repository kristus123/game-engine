export class World {
	constructor() {

		G.player = new Player(new Position(150, 0))
		Controller.control(G.player)
		Camera.followInstantly(G.player)

		G.storeWorker = new Npc(new Position(0, -400))

		G.poops = new LocalObjects()

		G.flowers = new LocalObjects(Random.positions(0, 800, 0, 800, 20)
			.map(p => {
				const s = G.Sprite.flower(p)
				s.idle.show(0)
				return s
			}))

		this.grass = new LocalObjects()
		const grid = new Grid()
		Mouse.onClick = p => {
			const snapped = grid.snappedPosition(p)
			const g =  G.Sprite.grass(snapped).randomStartFrame()
			this.grass.add(g)
		}

		this.world = G.Sprite.world(new Position(-1000, -1000))

		this.localObjects = new LocalObjects([
			this.world,
			this.grass,

			new Quest([
				() => new class {
					constructor() {
						G.storeWorker.sprite.prepareSleep.play(() => {
							G.storeWorker.sprite.sleep.loop()
							this.completed = () => true
						})
					}

					completed() {
						return false
					}

				},


				() => new Dialogue([
					new TextTyper(G.player, 'i must go talk to my friend'),
				]),


				() => new class {
					completed() {
						return G.player.touches(G.storeWorker) && Keyboard.e
					}

					update() {
					}

					draw(draw, guiDraw) {
						if (G.player.touches(G.storeWorker)) {
							draw.text(G.storeWorker, 'press "e" to talk')
						}
					}
				},

				() => new class {
					constructor() {
						G.storeWorker.sprite.talk.loop()
					}

					completed() {
						return true
					}

				},


				() => new Dialogue([
					new TextTyper(G.storeWorker, 'hi there!'),
					new TextTyper(G.player, 'what should i do?'),
					new TextTyper(G.storeWorker, 'try to poop by pressing "p"'),
					new TextTyper(G.storeWorker, 'poop 4 times!'),
				]),

				() => new class {

					constructor() {

						G.storeWorker.sprite.prepareSleep.play(() => {
							G.storeWorker.sprite.sleep.loop()
						})

						HtmlProgressBar.create()
						this.d = new Dialogue([
							new TextTyper(G.storeWorker, G.poops.length.toString()),
						])

						this.localObjects = new LocalObjects([
							OnChange(() => G.poops.length, () => {
								HtmlProgressBar.change(25)
								this.d = new Dialogue([
									new TextTyper(G.storeWorker, G.poops.length.toString()),
								])
							})
						])
					}

					completed() {
						return G.poops.length >= 4
					}

					update() {
						this.d.update()
						this.localObjects.update()
					}

					draw(draw, guiDraw) {
						this.d.draw(draw, guiDraw)
						this.localObjects.draw(draw, guiDraw)
					}
				},


				() => new class {
					completed() {
						HtmlProgressBar.remove()
						return true
					}

				},


				() => new Dialogue([
					new TextTyper(G.storeWorker, 'good job!'),
					new TextTyper(G.storeWorker, 'now place the poop in the poop area'),
				]),


				() => new class {
					constructor() {
						this.deliveryZone = new Position(400, 200, 100, 100)
					}

					completed() {
						this.count = 0
						for (const p of G.poops) {
							if (p.touches(this.deliveryZone)) {
								this.count += 1
							}
						}

						return this.count == 4
					}

					draw(draw, guiDraw) {
						draw.text(this.deliveryZone.over(200), `${this.count}/4`)
						draw.orange(this.deliveryZone)
					}
				},

				() => new Dialogue([
					new TextTyper(G.storeWorker, 'good job!'),
					new TextTyper(G.storeWorker, 'now we have a bunch of poop!'),
					new TextTyper(G.storeWorker, 'try to poop on the flowers to make them grow strong!'),
				]),
			]),


			G.storeWorker,
			G.poops,
			G.flowers,
			G.player,

		])
	}

	update() {
		this.localObjects.update()

		for (const f of G.flowers) {

			if (G.player.touches(f)) {
				f.idle.show(1)
			}
			else {
				f.idle.show(0)
			}

			for (const p of G.poops) {
				if (p.touches(f)) {
					f.idle.show(2)
				}
			}
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		// for (const s of this.world.slices) {
		// 		draw.rectangle(s.position)
		// }
	}
}
