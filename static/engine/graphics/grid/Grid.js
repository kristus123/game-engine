export class Grid {
	constructor(gridWidth = 16, gridHeight = 10, cellWidth = 8*Scale.value, cellHeight = 16*Scale.value) {
		this.gridPositions = new GridPositions()
	}

	toGridPosition(position) {
		return {
			x: Math.floor(position.x / this.cellWidth),
			y: Math.floor(position.y / this.cellHeight),
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

	draw(draw) {
		const gridPosition = this.toGridPosition(Mouse.position)

		const snappedPosition = this.snappedPosition(Mouse.position)

		draw.transparentGreenRectangle(snappedPosition)

		if (this.has(gridPosition)) {
			draw.text(snappedPosition, 'full')
		} else if (Mouse.down) {
			this.add(Mouse.position)
		}

		for (const tile of this.scaledTiles()) {
			draw.rectangle(tile)
		}
	}
}


