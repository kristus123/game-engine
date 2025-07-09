import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Random } from '/static/engine/code_tools/misc/Random.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { SpriteFrame } from '/static/engine/mechanics/SpriteFrame.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { D } from '/static/game/world/D.js'; 

export class Feather extends DynamicGameObject {

	constructor(position) {
		super(position, 10, 10)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 

		this.position = this.position.copy()

		const choice = Random.choice([
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 },
		])
		this.image = new SpriteFrame(this, '/static/assets/sprites/chicken_feathers_16x16.png', choice)
		this.position.width = 16
		this.position.height = 16

	}

	draw(draw, guiDraw) {
		this.image.draw(draw, guiDraw)
	}
}

