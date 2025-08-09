const scale = 8

export class World {
	constructor() {
		Camera.follow(new Position(0, 0))

		this.jsonFile = StaticHttp.get('/static/assets/aseprite/world_tilemaps.json')
		this.width = this.jsonFile.tilemaps[0].width
		this.height = this.jsonFile.tilemaps[0].height

		this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(0, 0)).idle.show(0),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)


		let ox = 0
		let oy = 0

		for (const e of this.jsonFile.tilemaps[0].tiles) {

			if (e.i == 3) {
				draw.transparentGreenRectangle(new Position(
					e.x * scale * this.width + ox,
					e.y * scale * this.height + oy,
					this.width * scale,
					this.height * scale
				))
			}
		}
	}
}
