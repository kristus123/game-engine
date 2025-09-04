import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 

export class AsepriteTilesJson {
	constructor(json) {

				AssertNotNull(json, "argument json in " + this.constructor.name + ".js should not be null")
			
		this.json = json; 

		this.width = json.tilemaps[0].tileWidth
		this.height = json.tilemaps[0].tileHeight
	}


	tilesForFrame(i) {
		return this.json.tilemaps[i].tiles
	}

}
