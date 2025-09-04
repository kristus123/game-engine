export class World {
	constructor() {
		this.localObjects = new LocalObjects([
			// G.Sprite.world(new Position(0, 0)).idle.show(0),
			new GrassGrid(),
		])


		Html.lower([
				Html.button('hei'),
				Html.div('big', [
					Html.p('hei'),
				]),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw) {
		this.localObjects.draw(draw)
	}
}
