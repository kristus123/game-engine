import { G } from '/static/engine/G.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { GridPositions } from '/static/engine/graphics/grid/GridPositions.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { Positions } from '/static/engine/position/Positions.js'; 
import { Scale } from '/static/game/Scale.js'; 

export class Grid {
	constructor(cellWidth = 16, cellHeight = 16) {

				AssertNotNull(cellWidth, "argument cellWidth in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(cellHeight, "argument cellHeight in " + this.constructor.name + ".js should not be null")
			
		this.cellWidth = cellWidth; 
		this.cellHeight = cellHeight; 

		this.gridPositions = new GridPositions()

		this.cellWidth *= Scale.value
		this.cellHeight *= Scale.value
	}

	toGridPosition(position) {
		return {
			x: Math.floor(position.x / this.cellWidth),
			y: Math.floor(position.y / this.cellHeight),
		}
	}





area(position, size = 96) {

	const topLeft = this.toGridPosition(position)

	const cells = size / 16

	const positions = []

	for (let gx = 0; gx < cells; gx++) {
		for (let gy = 0; gy < cells; gy++) {
			const gp = { x: topLeft.x + gx, y: topLeft.y + gy }
			positions.push(this.scaled(gp))
		}
	}

	return positions
}


availableArea(areas, size=96) {
	return !areas.some(a => this.has(this.toGridPosition(a)))
}


placeArea(areas) {
	for (const a of areas) {
		this.add(a)
	}
}


	snappedPosition(position) {
		const gp = this.toGridPosition(position)
		return this.scaled(gp)
	}

	add(position) {
		const gp = this.toGridPosition(position)
		this.gridPositions.set(gp)
	}

	remove(position) {
		const gp = this.toGridPosition(position)
		this.gridPositions.remove(gp)
	}

	has(gridPosition) {
		return this.gridPositions.has(gridPosition)
	}

	scaled(gridPosition) {
		return new Position(
			gridPosition.x * this.cellWidth, 
			gridPosition.y * this.cellHeight, 
			this.cellWidth, 
			this.cellHeight)
	}

	scaledTiles() {
		const result = []

		this.gridPositions.forEach(gp => {
			result.push(this.scaled(gp))
		})

		return result
	}

	update() {
	}
}


