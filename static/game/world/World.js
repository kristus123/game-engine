const renderer = new CanvasRenderer()
const pos = new Position(0, 0, 10, 10)
renderer.draw.rectangle(new Position(50, 0, 1000, 1000))
renderer.renderImageBitmap()

export class World {
	constructor() {

		this.localObjects = new LocalObjects([
			Init(this, {
				store: new Store(),
			}),
			G.ranches,
			G.monsters,
			G.poop,
			G.workers,
			G.splash,
			G.trees,
		])

		G.ranches.add(new Ranch(new Position(0, 0)))

		Html.addToScreen(Html.div('lower-center-ui', [
			Html.slider(),
			HtmlProgressBar.create(),
		]))

		G.monsters.add(new SimpleMonster(new Position(0, 0)))

		BottomText.show('Welcome!', 2_000)

		// LoadingScreen.show()
		// QuestList.add('eat ass')
		// QuestList.show()
	}

	update() {
		for (const w of G.workers) {
			G.money -= 0.001
			G.money = Math.round(G.money * 100) / 100
		}
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		// draw.test(new Position(0, 0))
	}
}
