const scale = 8

export class World {
	constructor() {
		Camera.followInstantly(new Position(500, 500))

		this.jsonFile = StaticHttp.get('/static/assets/aseprite/world_tilemaps.json')
		console.log(this.jsonFile)
		this.width = this.jsonFile.tilemaps[0].width
		this.height = this.jsonFile.tilemaps[0].height


		this.walkableTiles = []
		for (const e of this.jsonFile.tilemaps[0].tiles) {
			this.walkableTiles.push({
				i: e.i,
				position: new Position(
					(e.x * scale * this.width),
					(e.y * scale * this.height),
					this.width * scale,
					this.height * scale,
				)
			})
		}

		this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(0, 0)).idle.show(0),

			new Turret(new Position(400, 800)),
		])

		setInterval(() => {
			tla(new Monster(this.walkableTiles.filter(t => t.i == 2).map(t => t.position)),)
		}, 200);
		
		Html.lower([
			Html.div('big', [
				Html.p('hei fucker bitch'),
			]),
		])

		Html.upperLeft([
			Html.button('buy turret', () => {

				Mouse.onClick = p => {
					console.log("hei")
					tla(new Turret(p.copy()))
					Audio.click()
					Mouse.onClick = null
				}

			}),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)


		if (Mouse.onClick) {
			draw.rectangle(new Position(Mouse.position.x, Mouse.position.y, 100, 100))
		}

		for (const p of this.walkableTiles) {

			if (p.i == 2) {
				// draw.transparentRedRectangle(p.position)
			}
		}
	}
}
