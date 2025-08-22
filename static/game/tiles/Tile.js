export class Tile {
	constructor(tilemaps) {
		const tile = tilemaps.tileTypes[2]

		const scaledWidth = tilemaps.width * Scale.value
		const scaledHeight = tilemaps.height * Scale.value

		this.palette = Palette.fixedOffscreen(scaledWidth, scaledHeight)

		this.palette.ctx.drawImage(
			tilemaps.test,
			tile.x * tilemaps.width,
			tile.y * tilemaps.height,
			tilemaps.width,
			tilemaps.height,
			0,
			0,
			scaledWidth,
			scaledHeight)

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
