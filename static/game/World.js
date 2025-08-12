const scale = 8

export class World {
	constructor() {
		Camera.followInstantly(new Position(500, 500))

		this.jsonFile = StaticHttp.get('/static/assets/aseprite/world_tilemaps.json')
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
			new BottomText([
				"when life is hard, just remember",
				"It will get harder",
				"It will get so hard that you will cry",
				"That is a small step towards your next part in life",
				"So when you are about to cry....",
			]),
		])

		setInterval(() => {
			tla(new Monster(this.walkableTiles.filter(t => t.i == 2).map(t => t.position)))
		}, 200)

		Html.upper([
			this.buyTurret = Html.button('buy turret', () => {
				Mouse.onClick = p => {
					if (new Square(p, 10).touchesAny(this.walkableTiles.filter(t => t.i == 1).map(t => t.position))) {
						tla(new Turret(p.copy()))
						Sound.click()
						Mouse.onClick = null
					}
				}
			}),
		])

		Html.upperRight([
			this.money = Html.p(G.money),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		Html.changeText(this.money, G.money)
		if (G.money > 10) {
			Html.enable(this.buyTurret)
		}
		else {
			Html.disable(this.buyTurret)
		}

		this.localObjects.draw(draw, guiDraw)

		if (Mouse.onClick) {
			draw.rectangle(new Position(Mouse.position.x, Mouse.position.y, 100, 100))

			if (!new Square(Mouse.position, 10).touchesAny(this.walkableTiles.filter(t => t.i == 1).map(t => t.position))) {
				draw.color(new Position(Mouse.position.x, Mouse.position.y, 100, 100), 'red')
			}
			else {
				draw.color(new Position(Mouse.position.x, Mouse.position.y, 100, 100), 'green')
			}
		}

		for (const p of this.walkableTiles) {
			// if (p.i == 1) {
			// 	draw.transparentRedRectangle(p.position)
			// }

			// if (p.i == 2) {
			// 	draw.transparentRedRectangle(p.position)
			// }
		}
	}
}
