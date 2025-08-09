const scale = 8

export class World {
	constructor() {
		Camera.follow(new Position(1000, 1000))

		this.xx = StaticHttp.get('/static/assets/aseprite/world_tilemaps.json')
		console.log(this.xx.tilemaps[0])
		this.width = this.xx.tilemaps[0].width
		this.height = this.xx.tilemaps[0].height

		this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(this.width*scale-100, this.height*scale)).idle.show(0),

			// new Turret(new Position(700,-200)),
			// new Turret(new Position(0,200)),
			// G.monsters,
		])

		// setInterval(() => {
		// 	if (G.monsters.length < 10) {
		// 		G.monsters.add(new Monster())
		// 	}
		// }, 100);
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		for (const e of this.xx.tilemaps[0].tiles) {
			if (e.i == 3) {
				draw.transparentGreenRectangle(new Position((e.x*scale*this.width), (e.y*scale*this.height), this.width*scale, this.height*scale))
			}
		}
	}
}
