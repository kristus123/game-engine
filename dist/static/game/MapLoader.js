import { G } from '/static/engine/G.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { Http } from '/static/engine/http/Http.js'; 
import { StaticHttp } from '/static/engine/http/StaticHttp.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class MapLoader {
	constructor(path, scale) {

				AssertNotNull(path, "argument path in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(scale, "argument scale in " + this.constructor.name + ".js should not be null")
			
		this.path = path; 
		this.scale = scale; 

		this.path = path
		this.scale = scale
	}

	load() {
		const jsonFile = StaticHttp.get(this.path)
		const firstMap = jsonFile.tilemaps[0]
		const tw = firstMap.width * this.scale
		const th = firstMap.height * this.scale

		const walkableTiles = firstMap.tiles.map(e => ({
			i: e.i,
			position: new Position(e.x * tw, e.y * th, tw, th)
		}))

		return {
			width: firstMap.width,
			height: firstMap.height,
			walkableTiles,
			buildTiles: walkableTiles.filter(t => t.i === 1).map(t => t.position),
			pathTiles: walkableTiles.filter(t => t.i === 2).map(t => t.position),
			background: G.Sprite.world(new Position(0, 0)).idle.show(0)
		}
	}
}
