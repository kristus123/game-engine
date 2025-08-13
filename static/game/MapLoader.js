export class MapLoader {
	constructor(path, scale) {
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
