export class HouseGrid {
	constructor() {
		this.grid = Grid()

		this.position = WorldPosition(0, 0, 96*Scale.value, 96*Scale.value) // 96x96 is the sprite size of G.image.house
	}

	update() {
		this.position.xy(this.grid.snappedPosition(Mouse.position))


		if (this.grid.availableArea(this.grid.area(this.position))) {
			if (Mouse.down) {
				this.grid.placeArea(this.grid.area(this.position))
				Audio.click()
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
