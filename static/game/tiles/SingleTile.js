export class SingleTile {
	constructor(json, image) {

		this.width = this.json.tilemaps[0].tileWidth
		this.height = this.json.tilemaps[0].tileHeight

		this.scaledWidth = this.width * Scale.value
		this.scaledHeight = this.height * Scale.value

		this.tileTypes = {}

		for (const tile of this.json.tilemaps[0].tiles) {
			if (this.tileTypes[tile.i]) {
			}
			else {
				const palette = Palette.fixedOffscreen(this.scaledWidth, this.scaledHeight)

				palette.ctx.drawImage(
					this.image,
					tile.x * this.width,
					tile.y * this.height,
					this.width,
					this.height,
					0,
					0,
					this.scaledWidth,
					this.scaledHeight)

				this.tileTypes[tile.i] = {
					palette, palette,
				}
			}
		}
	}

	draw(draw, guiDraw) {
		const position = new Position(1*Scale.value*16,2*Scale.value*16)
		
		Camera.palette.ctx.drawImage(this.tileTypes[3].palette.canvas, position.x, position.y)
	}

}
