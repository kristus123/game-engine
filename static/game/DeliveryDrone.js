export class DeliveryDrone extends GameObject {
	constructor(x, y) {
		super(x, y, 10, 10, 10, 2)

		const train = new Train(this, [
			new GameObject(this.x+100, 400, 10, 10, 10, 2),
			new GameObject(this.x+200, 400, 10, 10, 10, 2),
			new GameObject(this.x+300, 400, 10, 10, 10, 2),
		])

		this.runAll = new RunAll([
			train
		])
	}

	update() {
		this.runAll.update()
	}

	draw(draw) {
		super.draw(draw)
		this.runAll.draw(draw)
	}

}
