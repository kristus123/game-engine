export class World {
	constructor() {

		this.lightPosition = new Position(0,0)
		this.size = 100

		this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(-1000, -1000)),

			new Turret(new Position(700,-200)),
			new Turret(new Position(0,200)),
			G.monsters,
		])


		setInterval(() => {
			if (G.monsters.length < 10) {
				G.monsters.add(new Monster())
			}
		}, 600);
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		console.log(Mouse.position)
	}
}
