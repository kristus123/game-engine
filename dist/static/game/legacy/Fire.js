import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { D } from '/static/game/world/D.js'; 

export class Fire extends DynamicGameObject {
	constructor(position) {
		super(position, 10, 10)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 

		this.position.width = 200
		this.position.height = 200

		const frameSequence = [
			{ x: 0, y: 0 },
			{ x: 1, y: 0 },
			{ x: 2, y: 0 },
			{ x: 3, y: 0 },

			{ x: 0, y: 1 },
			{ x: 1, y: 1 },
			{ x: 2, y: 1 },
			{ x: 3, y: 1 },

			{ x: 0, y: 2 },
			{ x: 1, y: 2 },
			{ x: 2, y: 2 },
			{ x: 3, y: 2 },

			{ x: 0, y: 3 },
			{ x: 1, y: 3 },
			{ x: 2, y: 3 },
			{ x: 3, y: 3 },

			{ x: 0, y: 4 },
			{ x: 1, y: 4 },
			{ x: 2, y: 4 },
		]

		this.sprite = new Sprite(this.position, '/static/assets/particles/fire_200x200.png', frameSequence)
	}

	update() {
	}

	draw(draw, guiDraw) {
		this.sprite.draw(draw, guiDraw)
	}
}
