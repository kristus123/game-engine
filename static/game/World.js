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


		const chat = (texts) => {
			this.localObjects.add(new Quest(texts.map(t => () =>  new class {
					constructor() {
						Html.lower([
							Html.img(),
							Html.div('big', [
								Html.p(t),
								Html.button('next', () => {
									Html.clearLower()
									this.completed = () => true
								})
							]),
						])
					}
				})))
		}
		
		setInterval(() => {
			tla(new Monster(this.walkableTiles.filter(t => t.i == 2).map(t => t.position)))
		}, 200)

		Html.lower([
			Html.div('big', [
				Html.picture(),
				Html.p('fight with honor!'),
			]),
		])

		Html.upperLeft([
			Html.button('buy turret', () => {

				Mouse.onClick = p => {
					console.log("hei")
					chat(Random.choice([
						['wow you bought a turret', 'you are really good'],
						['i am an edgy boy'],
					]))
					tla(new Turret(p.copy()))
					Audio.click()
					Mouse.onClick = null
					if (new Square(p, 10).touchesAny(this.walkableTiles.filter(t => t.i == 1).map(t => t.position))) {
						console.log('hei')
						tla(new Turret(p.copy()))
						Audio.click()
						Mouse.onClick = null
					}
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
