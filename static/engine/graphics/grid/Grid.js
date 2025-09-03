export class Grid {
	constructor(gridWidth = 16, gridHeight = 10, cellWidth = 16*Scale.value, cellHeight = 16*Scale.value) {
		this.positions = []
	}

	snappedPosition(position) {
		const cellX = Math.floor(position.x / this.cellWidth)
		const cellY = Math.floor(position.y / this.cellHeight)

		const x = cellX * this.cellWidth
		const y = cellY * this.cellHeight

		return new Position(x, y, this.cellWidth, this.cellHeight)
	}

	draw(draw) {
		if (Mouse.down) {
			this.positions.push(this.snappedPosition(Mouse.position))
		}

		for (const p of this.positions) {
			draw.rectangle(p)
		}
	}
}

