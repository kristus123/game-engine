export class World {
	constructor() {
		this.picturePositions = new PicturePositions(G.Pictures.test)
		

		this.localObjects = new LocalObjects([
			Init(this, {
				store: new Store(),
				mic: new Microphone(),
				chicken: new Chicken(new Position(-200, 0), c => {
					if (Mouse.hovering(c)) {
						c.onHit()
						c.run =() => {}
						setTimeout(() => {
							c.removeFromLoop()
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
		])

		G.ranches.add(new Ranch(new Position(0, 0)))

		Html.addToScreen(Html.div('lower-center-ui', [
			Html.slider(),
			HtmlProgressBar.create(),
		]))

		Controller.control(Cam.objectToFollow)

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
		if (this.picturePositions.ib) {
		//for some reason the image is offset by 2 pixels
			draw.imageBitmap(new Position(-2, -2), this.picturePositions.ib)
		}
		for (const r of this.picturePositions.regions) {
			if (Mouse.hovering(r)) {
				draw.rectangle(r, r.color)
			}
		}

		draw.text(new Position(0,0), this.mic.transcript)
				console.log(this.mic.transcript)

		// draw.test(new Position(0, 0))
	}
}
