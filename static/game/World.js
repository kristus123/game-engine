export class World {
	constructor() {
	//	new Menu()
		this.grassTile = new GridTile(Palette.fixedOffscreen(4000, 4000), G.image.grassTile)
	}

	update() {
		this.grassTile.update()
		console.log("A")
	}

	draw(draw) {
	}
}
