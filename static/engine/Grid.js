export class Grid {

	constructor(mouse) {
		this.mouse = mouse
		this.cellSize = 64
	}

	snapGrid() {
		const { x, y } = this.mouse.position
		const cellX = Math.floor(x / this.cellSize)
		const cellY = Math.floor(y / this.cellSize)
		const adjustedX = cellX * this.cellSize + this.cellSize / 2
		const adjustedY = cellY * this.cellSize + this.cellSize / 2
		return new Position(adjustedX, adjustedY, this.cellSize, this.cellSize)
	}

	drawGrid(context, gridSize, offsetX = 0, offsetY = 0, gridColor = 'white') {
		const canvasWidth = context.canvas.width
		const canvasHeight = context.canvas.height

		context.clearRect(0, 0, canvasWidth, canvasHeight)

		for (let x = offsetX; x < canvasWidth; x += gridSize) {
			for (let y = offsetY; y < canvasHeight; y += gridSize) {
				context.strokeRect(x, y, gridSize, gridSize)
			}
		}
	}

	draw(draw) {
		const { ctx } = draw
		const snappedPosition = this.snapGrid()

		this.drawGrid(ctx, this.cellSize, this.cellSize * 10, this.cellSize * 10)

		ctx.fillStyle = 'white'
		ctx.fillRect(
			snappedPosition.x - snappedPosition.width / 2,
			snappedPosition.y - snappedPosition.height / 2,
			snappedPosition.width,
			snappedPosition.height
		)
	}
}
