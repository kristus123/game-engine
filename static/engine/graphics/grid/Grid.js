export class Grid {
	constructor(gridWidth = 16, gridHeight = 10, cellWidth = 16*Scale.value, cellHeight = 16*Scale.value) {
		this.tiles = new Set()
	}

	gridPosition(position) {
		return {
			x: Math.floor(position.x / this.cellWidth),
			y: Math.floor(position.y / this.cellHeight),
		}
	}

	snappedPosition(position) {
		const gp = this.gridPosition(position)
		return new Position(
			gp.x * this.cellWidth,
			gp.y * this.cellHeight,
			this.cellWidth,
			this.cellHeight
		)
	}

	addTileAt(position) {
		const gp = this.gridPosition(position)
		this.tiles.add(`${gp.x},${gp.y}`)
	}

	hasTileAt(gp) {
		return this.tiles.has(`${gp.x},${gp.y}`)
	}

	scaledTiles() {
		const result = []
		for (const key of this.tiles) {
			const [x, y] = key.split(',').map(Number)
			result.push(new Position(x * this.cellWidth, y * this.cellHeight, this.cellWidth, this.cellHeight))
		}
		return result
	}

	draw(draw) {
		const gp = this.gridPosition(Mouse.position)
		const p = this.snappedPosition(Mouse.position)

		draw.transparentGreenRectangle(p)

		if (this.hasTileAt(gp)) {
			draw.text(p, 'full')

			if (Mouse.down) {
				draw.text(p, 'cant place here')
			}

		} else if (Mouse.down) {
			this.addTileAt(Mouse.position)
		}

		for (const tile of this.scaledTiles()) {
			draw.rectangle(tile)
		}
	}
}


