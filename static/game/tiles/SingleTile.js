export class SingleTile {
	constructor(image, asepriteTilesJson, tile, position) {

		this.palette = Palette.fixedOffscreen(
			this.position.width,
			this.position.height
		)

		this.palette.ctx.drawImage(
			image,
			tile.x * asepriteTilesJson.width,
			tile.y * asepriteTilesJson.height,
			asepriteTilesJson.width,
			asepriteTilesJson.height,
			0,
			0,
			this.position.width,
			this.position.height
		)
	}

	draw() {
		Draw.ctx.drawImage(
			this.palette.canvas,
			this.position.x,
			this.position.y
		)
	}
}

