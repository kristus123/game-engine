export class Tile {
	constructor(tilemaps) {
		const tile = this.tilemaps.tileTypes[2]

		const scaledWidth = this.tilemaps.width * Scale.value
		const scaledHeight = this.tilemaps.height * Scale.value

		this.palette = Palette.fixedOffscreen(scaledWidth, scaledHeight)

		this.palette.ctx.drawImage(
			this.tilemaps.test,
			tile.x * this.tilemaps.width,
			tile.y * this.tilemaps.height,
			this.tilemaps.width,
			this.tilemaps.height,
			0,
			0,
			scaledWidth,
			scaledHeight)
	}

	draw(draw, guiDraw) {
		Iterate(30, i => {
			const position = new Position(4*16*Scale.value, i*16*Scale.value)
			draw.ctx.drawImage(this.palette.canvas, position.x, position.y)
		})
	}
}
