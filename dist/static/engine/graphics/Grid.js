import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Position } from '/static/engine/position/Position.js'; 

const scale = 8

export class Grid {
	constructor(gridWidth = 16, gridHeight = 10, cellWidth = 16*scale, cellHeight = 16*scale) {

				AssertNotNull(gridWidth, "argument gridWidth in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(gridHeight, "argument gridHeight in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(cellWidth, "argument cellWidth in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(cellHeight, "argument cellHeight in " + this.constructor.name + ".js should not be null")
			
		this.gridWidth = gridWidth; 
		this.gridHeight = gridHeight; 
		this.cellWidth = cellWidth; 
		this.cellHeight = cellHeight; 

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

		Mouse.onClick = p => {
			
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
		draw.rectangle(this.snappedPosition(Mouse.position))

		draw.ctx.strokeStyle = 'white'
		draw.ctx.lineWidth = 3

		for (const pos of this.positions) {
			draw.ctx.strokeRect(pos.x, pos.y, this.cellWidth, this.cellHeight)
		}
	}
}

