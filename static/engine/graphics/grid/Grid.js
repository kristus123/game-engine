export class Grid {
	constructor(cellWidth = 16*Scale.value, cellHeight = 16*Scale.value) {
		this.gridPositions = new GridPositions()

		this.grassPalette = Palette.fixedOffscreen(4000, 4000)
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
		const gridPosition = this.toGridPosition(Mouse.position)

		const snappedPosition = this.snappedPosition(Mouse.position)

		D1.transparentGreenRectangle(snappedPosition)

		for (const tile of this.scaledTiles()) {
			if (Mouse.hovering(tile)) {
				D1.transparentRedRectangle(tile)
			}
			else {
				this.grassPalette.draw.picture(tile, G.image.grassTile)
			}
		}

		Camera.palette.apply(this.grassPalette)

		if (Mouse.down) {
			if (this.has(gridPosition)) {
				D1.text(snappedPosition, 'full')
			}
			else {
				this.add(Mouse.position)
			}
		}
		else if (Mouse.rightDown) {
			this.remove(Mouse.position)
		}

	}
}


