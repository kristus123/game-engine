export class Tile {
	constructor(tileSheet) {
		const tile = tileSheet.tileTypes[2]

		this.palette = Palette.fixedOffscreen(this.tileSheet.scaledWidth, this.tileSheet.scaledHeight)

		this.palette.ctx.drawImage(
			tileSheet.image,
			tile.x * tileSheet.width,
			tile.y * tileSheet.height,
			tileSheet.width,
			tileSheet.height,
			0,
			0,
			this.tileSheet.scaledWidth,
			this.tileSheet.scaledHeight)

		this.positions = Iterate(30, i => {
			return new Position(i*16*Scale.value, i*16*Scale.value)
		})
	}

	draw(draw, guiDraw) {
		for (const p of this.positions) {
			draw.ctx.drawImage(this.palette.canvas, p.x, p.y)
		}
	}
}
