export class World {
	constructor() {

		this.localObjects = new LocalObjects([
			Init(this, {
				store: new Store(),
				mic: new Microphone(),
				chicken: new Chicken(new Position(-200, 0), chicken => {
					if (Mouse.hovering(chicken)) {
						chicken.kill()
						chicken.run = () => {}
						setTimeout(() => {
							chicken.removeFromLoop()
						}, 3000)
					}
				}),
			}),
			G.ranches,
			G.monsters,
			G.poop,
			G.workers,
			G.splash,
			G.trees,
			G.barn,
			Init(this, {
				picturePositions: new PicturePositions(G.Pictures.test),
			}),
		])

		Html.addToScreen(Html.div('lower-center-ui', [
			Html.slider(),
			HtmlProgressBar.create(),
		]))

		G.ranches.add(new Ranch(new Position(0, 0)))
		G.monsters.add(new SimpleMonster(new Position(0, 0)))

		BottomText.show('Welcome!', 2_000)

		// LoadingScreen.show()
		// QuestList.add('eat ass')
		// QuestList.show()
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
