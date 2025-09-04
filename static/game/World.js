export class World {
	constructor() {
		this.localObjects = new LocalObjects([
			// G.Sprite.world(new Position(0, 0)).idle.show(0),
			new GrassGrid(),

			OnTrue(() => Keyboard.q, () => {
				this.p.changeText('dirt')
				G.tile = 'dirt'
			}),
			OnTrue(() => Keyboard.w, () => {
				this.p.changeText('water')
				G.tile = 'water'
			}),
		])

		Html.lower([
				Html.div('big', [
					this.p = Html.p('hei'),
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
