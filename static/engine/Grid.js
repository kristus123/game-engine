export class Grid {

	constructor(mouse) {
		this.mouse = mouse
		this.cellSize = 64

		this.clickedPositions = []

		mouse.addOnClick('place block', mousePosition => {
			this.clickedPositions.push(this.mouseGrid(mousePosition))
		})

	}

	mouseGrid(mousePosition) {
		const cellX = Math.floor(mousePosition.x / this.cellSize)
		const cellY = Math.floor(mousePosition.y / this.cellSize)

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
		const snappedPosition = this.mouseGrid(this.mouse.position)
		// draw.block(snappedPosition)

		// this.drawGrid(ctx, this.cellSize*1, this.cellSize*2) // for moving the grid

		for (const p of this.clickedPositions) {
			draw.block(p)
		}
	}

}
