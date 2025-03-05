export class World {
	constructor() {

		this.localObjects = new LocalObjects([
			Init(this, {
				store: new Store(),
			}),
			G.splash,
			G.ranches,
			G.monsters,
			G.poop,
		])

		G.ranches.add(new Ranch(new Position(0,0)))


		Html.addToScreen(Html.div('lower-center-ui', [
			HtmlProgressBar.create()
		]))

		G.monsters.add(new SimpleMonster(new Position(0, 0)))
	}

	update() {
		this.localObjects.update()

		if (Mouse.holding && Mouse.down) {
			Mouse.holding.x = Mouse.position.x
			Mouse.holding.y = Mouse.position.y
		}
		else if (Mouse.up) {
			Mouse.holding = null
		}
		else {
			for (const m of G.monsters) {
				if (Mouse.clicked(m)) {
					Mouse.holding = m
					break
				}
			}
		}


	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		// draw.test(new Position(0, 0))
	}
}
