export class DeliveryDrone extends GameObject {
	constructor(x, y) {
		super(x, y, 150, 150, 10, 2)

		// const train = new Train(this, [
		// 	new GameObject(this.x+100, 400, 100, 100, 10, 2),
		// 	new GameObject(this.x+200, 400, 100, 100, 10, 2),
		// 	new GameObject(this.x+300, 400, 100, 100, 10, 2),
		// ])

		// this.runAll = new RunAll([
		// 	train
		// ])


		this.splash = new Splash()
		this.picture = new Picture(this, '/static/assets/cargo_ship.png')
	}

	update() {
		// this.runAll.update()
	}

	draw(draw) {
		// this.runAll.draw(draw)
		
		this.splash.splash(this.position.center,  this.position.center, 200, 'orange', 1, 30)
		this.splash.draw(draw)
		this.picture.r(draw, 0)
	}

}
