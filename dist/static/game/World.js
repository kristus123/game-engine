import { G } from '/static/engine/G.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
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

			new Turret(new Position(700,-200)),
			new Turret(new Position(0,200)),
			G.monsters,
		])


		setInterval(() => {
			if (G.monsters.length < 10) {
				G.monsters.add(new Monster())
			}
		}, 100);
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		console.log(Mouse.position)
	}
}
