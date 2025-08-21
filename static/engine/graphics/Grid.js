export class Grid {
	constructor(gridWidth = 16, gridHeight = 10, cellWidth = 16*Scale.value, cellHeight = 16*Scale.value) {
		this.positions = []
		this.cellWidth = cellWidth
		this.cellHeight = cellHeight

		for (let y = 0; y < gridHeight; y++) {
			for (let x = 0; x < gridWidth; x++) {
				this.positions.push(new Position(
					x * cellWidth,
					y * cellHeight,
					cellWidth,
					cellHeight,
				))
			}
		}
	}

	snappedPosition(position) {
		const cellX = Math.floor(position.x / this.cellWidth)
		const cellY = Math.floor(position.y / this.cellHeight)

		const x = cellX * this.cellWidth
		const y = cellY * this.cellHeight

		return new Position(x, y, this.cellWidth, this.cellHeight)
	}

	draw(draw, guiDraw) {
		draw.ctx.strokeStyle = 'white'
		draw.ctx.lineWidth = 3

		for (const pos of this.positions) {
			draw.ctx.strokeRect(pos.x, pos.y, this.cellWidth, this.cellHeight)
		}
	}
}

