export class Tilemaps {
	constructor() {
		const jsonFile = StaticHttp.get('/static/assets/aseprite/world_tilemaps.json')
		const image = G.Sprite.world(new Position(0, 0)).image

		this.tileSheet = new TileSheet(jsonFile, image)
		this.singleTile = new SingleTile(jsonFile, image)
	}

	get turretTiles() {
		return this.tileSheet.tiles.filter(t => t.i == 4).map(t => t.position)
	}

	touchesTurretTiles(position) {
		return new Square(position, 10).touchesAny(this.turretTiles)
	}

	get enemyWalkTiles() {
		return this.tileSheet.tiles.filter(t => t.i == 1).map(t => t.position)
	}

	draw(draw, guiDraw) {
		// this.tileSheet.draw(draw, guiDraw)
		// this.singleTile.draw(draw, guiDraw)
	}

}
