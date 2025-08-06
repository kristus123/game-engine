import { G } from '/static/engine/G.js'; 
import { Init } from '/static/engine/Init.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { D } from '/static/game/world/D.js'; 

export class Npc extends DynamicGameObject {
	constructor(position) {
		super(position, 10, 3)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.localObjects = new LocalObjects([
			Init(this, {
				sprite: G.Sprite.player(position),
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
