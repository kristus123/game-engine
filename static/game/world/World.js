export class World {
	constructor() {

		this.localObjects = new LocalObjects([
			Init(this, {
				monster: new SimpleMonster(),
				foodFactory: new FoodFactory(new Position(0, 0)),
				splash: new SplashParticles(),
				store: new Store(),
			}),
			G.poop,
			G.splash,
		])

		Html.addToScreen(Html.div('lower-center-ui', [
			HtmlProgressBar.create()
		]))

		Cam.followInstantly(this.monster.position.center)
	}

	update() {
		this.localObjects.update()

	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		// draw.test(new Position(0, 0))
	}
}
