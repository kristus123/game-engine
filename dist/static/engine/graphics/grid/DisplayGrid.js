import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class DisplayGrid {
	constructor(position, grid) {

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(grid, "argument grid in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.grid = grid; 


		this.positions = []

		const snap = grid.snappedPosition(position)

		const offsetX = snap.x - Math.floor(grid.width / 2) * grid.cellWidth
		const offsetY = snap.y - Math.floor(grid.height / 2) * grid.cellHeight

		for (let y = 0; y < grid.height; y++) {
			for (let x = 0; x < grid.width; x++) {
				x = x * grid.cellWidth + offsetX
				y = y * grid.cellHeight + offsetY
				
				this.positions.push(grid.snapped({x,y}))
			}
		}
	}

	draw(draw) {
		draw.ctx.strokeStyle = 'white'
		draw.ctx.lineWidth = 3

		for (const pos of this.positions) {
			draw.ctx.strokeRect(pos.x, pos.y, this.grid.cellWidth, this.grid.cellHeight)
		}
	}
}

