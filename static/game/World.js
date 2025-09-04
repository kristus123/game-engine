export class World {
	constructor() {
		Camera.follow(new Position(800, 800))

		this.localObjects = new LocalObjects([
			// G.Sprite.world(new Position(0, 0)).idle.show(0),
			new GrassGrid(),

			OnTrue(() => Keyboard.q, () => {
				this.p.changeText('dirt')
				G.tile = 'dirt'
				Sound.click()
			}),
			OnTrue(() => Keyboard.w, () => {
				this.p.changeText('water')
				G.tile = 'water'
				Sound.click()
			}),
		])

		Html.upper([
				Html.div('big', [
					Html.p('Q to select dirt'),
				]),
				Html.div('big', [
					Html.p('W to select water'),
				]),
				Html.div('big', [
					Html.p('right click to erase'),
				]),
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
