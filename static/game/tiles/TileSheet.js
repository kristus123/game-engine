export class TileSheet {
	constructor(json, image) {

		this.width = this.json.tilemaps[0].tileWidth
		this.height = this.json.tilemaps[0].tileHeight

		this.scaledWidth = this.width * Scale.value
		this.scaledHeight = this.height * Scale.value

		this.tiles = []
		this.tileTypes = {}

		for (const e of this.json.tilemaps[0].tiles) {
			if (!(this.tileTypes[e.i])) {
				this.tileTypes[e.i] = {
					x: e.x,
					y: e.y,
					singleTile: new SingleTile(json, image, new Position(e.x, e.y)),
				}
			}

			this.tiles.push({
				i: e.i,
				singleTile: new SingleTile(json, image),
				position: new Position(
					(e.x * Scale.value * this.width),
					(e.y * Scale.value * this.height),
					this.width * Scale.value,
					this.height * Scale.value)
			})
		}
	}

	draw(draw, guiDraw) {
		for (const tile of this.tiles) {
			draw.rectangle(tile.position)
			// tile.singleTile.draw(draw, guiDraw)
		}
	}

}
