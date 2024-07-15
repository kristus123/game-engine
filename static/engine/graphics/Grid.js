export class Grid {

	constructor() {
		this.cellSize = 128
		this.width = 1_000
		this.height = 1_000

		this.blocks = []

		this.show = false
	}

	add(position) {
		const p = this.mouseGrid(position)
		p.width = 128
		p.height = 128
		return new StaticPicture(p, '/static/assets/floors/wooden_floor_128x128.png')
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
		if (this.show) {
			const snappedPosition = this.mouseGrid(Mouse.position)
			draw.rectangle(snappedPosition)

			this.drawGrid(draw.ctx, this.cellSize*1, this.cellSize*2) // for moving the grid

			for (const p of this.blocks) {
				p.draw(draw)
			}

		}
	}
}
