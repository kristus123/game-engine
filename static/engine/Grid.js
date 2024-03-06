export class Grid {

	constructor(mouse) {
		this.cellSize = 32
		this.width = 1_000
		this.height = 1_000

		this.clickedPositions = []

		mouse.addOnClick('place block', mousePosition => {
			const p = this.mouseGrid(mousePosition)
			console.log(p.x)
			this.clickedPositions.push(new GameObject(
				p.x, p.y, 32, 32, 10, 10, '/static/assets/planets/exoplanet32x32.png'))
		})
	}

	mouseGrid(mousePosition) {
		const cellX = Math.floor(mousePosition.x / this.cellSize)
		const cellY = Math.floor(mousePosition.y / this.cellSize)

		const x = cellX * this.cellSize 
		const y = cellY * this.cellSize 

		return new Position(x, y, this.cellSize, this.cellSize)
	}

	drawGrid(ctx, offset_x = 0, offset_y = 0) {
		ctx.strokeStyle = 'white'
		ctx.lineWidth = 2

		for (let x = offset_x; x < this.width; x += this.cellSize) {
			for (let y = offset_y; y < this.height; y += this.cellSize) {
				ctx.strokeRect(x, y, this.cellSize, this.cellSize)
			}
		}
	}

	draw(draw, guiDraw) {
		const snappedPosition = this.mouseGrid(this.mouse.position)
		draw.new_rectangle(snappedPosition)

		this.drawGrid(draw.ctx, this.cellSize*1, this.cellSize*2) // for moving the grid

		for (const p of this.clickedPositions) {
			p.draw(draw)
		}
	}
}
