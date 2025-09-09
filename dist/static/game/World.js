import { a } from '/static/engine/assertions/a.js'; 
import { Camera } from '/static/engine/camera/Camera.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { Menu } from '/static/game/memory_cards/Menu.js'; 

export class World {
	constructor() {


		Camera.follow(new Position(800, 800))
		new Menu()
	}

	update() {
	}

	draw(draw) {
	}
}
