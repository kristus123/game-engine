export class SingleTile {
	constructor(tileSheet, tile, position) {
		this.tileSheet = tileSheet
		this.tile = tile
		this.position = position

		this.palette = Palette.fixedOffscreen(
			this.position.width,
			this.position.height
		)

		this.palette.ctx.drawImage(
			tileSheet.image,
			tile.x * tileSheet.width,
			tile.y * tileSheet.height,
			tileSheet.width,
			tileSheet.height,
			0,
			0,
			this.position.width,
			this.position.height
		)
	}

	draw(draw, guiDraw) {
		draw.ctx.drawImage(
			this.palette.canvas,
			this.position.x,
			this.position.y
		)
	}
}

