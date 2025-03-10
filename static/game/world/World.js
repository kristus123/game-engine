export class World {
	constructor() {

		this.picturePositions = new PicturePositions(G.Pictures.test)

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
		if (this.picturePositions && this.picturePositions.ib) {
		//for some reason the image is offset by 2 pixels
			draw.imageBitmap(new Position(-2, -2), this.picturePositions.ib)
		}
		for (const r of this.picturePositions.regions) {
			if (Mouse.hovering(r)) {
				draw.rectangle(r, r.color)
			}
		}

		// draw.test(new Position(0, 0))
	}
}
