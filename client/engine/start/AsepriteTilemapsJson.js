export class AsepriteTilemapsJson {
	constructor(json) {
		this.width = json.tilemaps[0].tileWidth
		this.height = json.tilemaps[0].tileHeight
	}


	tilesForFrame(i) {
		return this.json.tilemaps[i].tiles
	}

}
