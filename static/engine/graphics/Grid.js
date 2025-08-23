export class Grid {
	constructor(position, gridWidth = 16, gridHeight = 10, cellWidth = 16*Scale.value, cellHeight = 16*Scale.value) {

		this.positions = []
		this.cellWidth = cellWidth
		this.cellHeight = cellHeight

		const snappedCenterX = Math.floor(position.x / cellWidth) * cellWidth
		const snappedCenterY = Math.floor(position.y / cellHeight) * cellHeight

		const offsetX = snappedCenterX - Math.floor(gridWidth / 2) * cellWidth
		const offsetY = snappedCenterY - Math.floor(gridHeight / 2) * cellHeight

		for (let y = 0; y < gridHeight; y++) {
			for (let x = 0; x < gridWidth; x++) {
				this.positions.push(new Position(
					x * cellWidth + offsetX,
					y * cellHeight + offsetY,
					cellWidth,
					cellHeight,
				))
			}
		}

		this.localObjects = new LocalObjects([
			OnChange(() => position.x + position.y, () => {
				
			}),
		])
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

