export class DeliveryDrone extends GameObject {
	constructor(camera, target, x, y) {
		super(x, y, 150, 150, 10, 2)

		const train = new Train(this, [new GameObject(this.x+100, 400, 10, 10, 10, 2)])

		this.splash = new Splash()
		this.picture = new Picture(this, '/static/assets/cargo_ship.png')

		this.runAll = new RunAll([
			new Compass(camera, target),
			train
		])
	}

	update() {
		this.runAll.update()
	}

	draw(draw) {
		this.runAll.draw(draw)
		
		this.splash.splash(this.position.center,  this.position.center, 200, 'orange', 1, 30)
		this.splash.draw(draw)
		this.picture.r(draw, 0)
	}

}
