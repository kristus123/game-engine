export class World {
	constructor() {

		const inverseExponentialNumber = new InverseExponentialNumber(10, 100)


		this.localObjects = new LocalObjects([
			//G.Sprite.world(new Position(0, 0)).idle.show(0),
			new DisplayGrid(new Position(0, 0)),
			new Grid(),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw) {
		this.localObjects.draw(draw)
	}
}
