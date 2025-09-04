export class World {
	constructor() {

		this.localObjects = new LocalObjects([
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
