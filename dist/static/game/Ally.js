import { G } from '/static/engine/G.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { SimplePathFinder } from '/static/engine/mechanics/SimplePathFinder.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { ForcePush } from '/static/engine/physics/ForcePush.js'; 
import { Push } from '/static/engine/physics/Push.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class Ally extends DynamicGameObject {
	constructor(position) {
		super(position, 100, 100)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		const invisibleWalls = [
			new Position(100, 100, 1000, 100),
			new Position(100, 400, 1000, 1000),
		]
		this.localObjects = new LocalObjects([
			G.Sprite.ally(this.position),
			this.path = new SimplePathFinder(this, G.player, invisibleWalls),
		])

		G.allies.add(this)
	}

	update() {
		ForcePush(this).towards(this.path.current, 5)

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
