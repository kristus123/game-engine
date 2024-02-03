export class Grid {

	constructor(mouse) {
		this.mouse = mouse
		this.cellSize = 64
	}

	mouseGrid() {
		const cellX = Math.floor(this.mouse.position.x / this.cellSize)
		const cellY = Math.floor(this.mouse.position.y / this.cellSize)

		const x = cellX * this.cellSize + this.cellSize / 2
		const y = cellY * this.cellSize + this.cellSize / 2

		return new Position(x, y, this.cellSize, this.cellSize)
	}

	drawGrid(ctx, offsetX = 0, offsetY = 0) {
		ctx.strokeStyle = 'white'
		ctx.lineWidth = 2

		for (let x = offsetX; x < Palette.width; x += this.cellSize) {
			for (let y = offsetY; y < Palette.height; y += this.cellSize) {
				ctx.strokeRect(x, y, this.cellSize, this.cellSize)
			}
		}
	}

	draw(draw) {
		const { ctx } = draw
		const snappedPosition = this.mouseGrid()

		this.drawGrid(ctx, this.cellSize*1, this.cellSize*2) // for moving the grid

		ctx.fillStyle = 'white'
		ctx.fillRect(
			snappedPosition.x - snappedPosition.width / 2,
			snappedPosition.y - snappedPosition.height / 2,
			snappedPosition.width,
			snappedPosition.height)
	}

}
