export class World {
	constructor() {

		G.player = new Player(new Position(150, 0))
		Controller.control(G.player)
		Camera.followInstantly(G.player)


		this.lightPosition = new Position(0,0)
		this.size = 100

		G.friend = new Npc(new Position(0, -400))

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
			const g = G.Sprite.wheat(snapped).grow.show(9)

			if (!Mouse.hoveringHtmlElement) {
				this.grass.add(g)
			}
		}

		this.world = G.Sprite.world(new Position(-1000, -1000))

		this.localObjects = new LocalObjects([
			this.world,
			this.grass,

			...new Grid().positions.map(p => new Grass(p)),

			G.friend,
			G.poops,
			G.flowers,
			G.player,
			G.Sprite.goat(new Position(-200, 0)).happy.loop(),
			// new InvisibleWall(new Position(0,0, 100, 100)),
			// new Path(G.player, [new Position(0,0), new Position(700, 100)])

			// G.SpriteLayers.sky(new Position(0, 0)),
			// new PicturePositions(G.image.test, new Position(0, 0)),
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

		draw.test(this.lightPosition, this.size)

		// for (const s of this.world.slices) {
		// 		draw.rectangle(s.position)
		// }
	}
}
