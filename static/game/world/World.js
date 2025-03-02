export class World {
	constructor() {

		this.localObjects = new LocalObjects([
			Init(this, {
				monster: new SimpleMonster(),
				foodFactory: new FoodFactory(new Position(0, 0)),
				splash: new SplashParticles(),
				store: new Store(),
			}),
		])


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
