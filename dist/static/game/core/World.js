import { G } from '/static/engine/G.js'; 
import { a } from '/static/engine/a.js'; 
import { Camera } from '/static/engine/camera/Camera.js'; 
import { Square } from '/static/engine/graphics/Square.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { MapLoader } from '/static/game/MapLoader.js'; 
import { GUI } from '/static/game/components/GUI.js'; 
import { EconomyManager } from '/static/game/core/EconomyManager.js'; 
import { EconomyToGlobal } from '/static/game/core/EconomyToGlobal.js'; 
import { ShopManager } from '/static/game/core/ShopManager.js'; 
import { Spawner } from '/static/game/core/Spawner.js'; 
import { Monster } from '/static/game/entities/Monster.js'; 
import { Turret } from '/static/game/entities/Turret.js'; 

const SCALE = 8
const SPAWN_INTERVAL_MS = 2000
const PREVIEW_SIZE = 100
const PLACE_RADIUS = 10

const PRICEBOOK_BASE = {
	turret: 20,
	upgrade1: 15,
}

export class World {
	constructor() {


		Camera.followInstantly(new Position(500, 500))

		this.map = new MapLoader('/static/assets/aseprite/world_tilemaps.json', SCALE).load()

		this.localObjects = new LocalObjects([this.map.background])

		this.economy = new EconomyManager(20)
		EconomyToGlobal(this.economy)
		this.shop = new ShopManager(this.economy, PRICEBOOK_BASE, {
			canPlaceAt: (p) => new Square(p, PLACE_RADIUS).touchesAny(this.map.buildTiles),
			placeTurret: (p) => this.localObjects.add(new Turret(p)),
			mount: 'upper',
			previewSize: PREVIEW_SIZE,
		})

		this.gui = new GUI(this.economy)

		this.spawner = new Spawner(() => new Monster(this.map.pathTiles), SPAWN_INTERVAL_MS, (e) => this.localObjects.add(e))
	  this.spawner.start()

	}

	buildWalkableTiles(tiles) {
		const tw = this.map.width * SCALE
		const th = this.map.height * SCALE

		return tiles.map(e => ({
			i: e.i,
			position: new Position(e.x * tw, e.y * th, tw, th),
		}))
	}


	destroy() {
		if (this.spawnTimer) {
			clearInterval(this.spawnTimer)
			this.spawnTimer = null
		}
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		this.shop.drawPreview(draw)
	}
}
