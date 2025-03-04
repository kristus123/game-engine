export class World {
	constructor() {

		this.localObjects = new LocalObjects([
			Init(this, {
				foodFactory: new FoodFactory(new Position(0, 0)),
				splash: new SplashParticles(),
				store: new Store(),
			}),
			G.poop,
			G.splash,
			G.monsters,
		])


		Html.addToScreen(Html.div('lower-center-ui', [
			HtmlProgressBar.create()
		]))

		G.monsters.add(new SimpleMonster())
		Cam.followInstantly(G.monsters.first())
	}

	update() {
		this.localObjects.update()

	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		// draw.test(new Position(0, 0))
	}
}
