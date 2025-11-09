export class World {
	constructor() {
	//	new Menu()
		this.map = new GridMap()
		this.map.set_current_tile(TileList.GRASS_TILE);
	}

	update() {
		this.map.update()
		console.log("A")
	}

	draw(draw) {
	}
}
