import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { D } from '/static/game/world/D.js'; 

export class Stars extends DynamicGameObject {
	constructor(x, y) {
		super(new Position(x, y, 16, 16), 1, 0)

				AssertNotNull(x, "argument x in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(y, "argument y in " + this.constructor.name + ".js should not be null")
			
		this.x = x; 
		this.y = y; 


		this.sprite = new Sprite(this, '/static/assets/sprites/stars_16x16.png', 6, [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 },
		], 300)
	}

	draw(draw, guiDraw) {
		this.sprite.draw(draw, guiDraw)
	}

}
