export class HouseGrid {
	constructor() {
		this.grid = new Grid()

		this.position = new Position(0, 0, 96*Scale.value, 96*Scale.value)
	}

	update() {
		this.position.xy(this.grid.snappedPosition(Mouse.position))


		if (this.grid.availableArea(this.grid.area(this.position))) {
			console.log('available')
			if (Mouse.down) {
				this.grid.placeArea(this.grid.area(this.position))
				Sound.click()
			}
		}

		for (const p of this.grid.area(this.position)) {
			D1.rectangle(p, 'green')
		}

		for (const p of this.grid.scaledTiles()) {
			D1.rectangle(p, 'brown')
		}

		D1.picture(this.position, G.image.house)
	}
}
