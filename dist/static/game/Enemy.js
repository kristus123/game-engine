import { G } from '/static/engine/G.js'; 
import { Init } from '/static/engine/Init.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 

export class Enemy extends DynamicGameObject {
	constructor(position) {
		super(position, 10, 10)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.localObjects = new LocalObjects([
			Init(this, {
				sprite: G.sprite.enemy(position),
			}),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
