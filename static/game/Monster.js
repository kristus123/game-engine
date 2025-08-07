export class Monster extends DynamicGameObject {
	constructor() {
		super(new Position(0,0, 100, 100), 10, 10)

		this.localObjects = new LocalObjects([
			Init(this, {
				sine: new Sine(100, 0.1),
				path: new Path(this, [
					new Position(0,0),
					new Position(800, 80),
					new Position(2, 3),
					new Position(-800, 2),
				]),
				splashParticles: new SplashParticles(),
			}),
		])
	}

	update() {
		this.localObjects.update()


		if (!this.path.completed) {
			Move(this).towards(this.path.position)
		}
		else {
		}

		this.splashParticles.random(this.position.center)
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)


		draw.rectangle(this.position)
	}
}
