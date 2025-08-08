import { G } from '/static/engine/G.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { Monster } from '/static/game/Monster.js'; 
import { Turret } from '/static/game/Turret.js'; 

export class World {
	constructor() {



		this.lightPosition = new Position(0,0)
		this.size = 100

		this.localObjects = new LocalObjects([
			G.Sprite.world(new Position(-1000, -1000)),

			new Monster(),
			new Turret(new Position(0,-200)),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
