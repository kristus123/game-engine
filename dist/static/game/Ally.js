import { G } from '/static/engine/G.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { PathFinder } from '/static/engine/mechanics/PathFinder.js'; 
import { Path } from '/static/engine/npc/Path.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Move } from '/static/engine/physics/Move.js'; 
import { Turret } from '/static/game/Turret.js'; 

export class Ally extends DynamicGameObject {
	constructor(position) {
		super(position, 100, 100)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.localObjects = new LocalObjects([
			G.Sprite.ally(this.position),
			this.path = new PathFinder(this, G.player),
			G.invisibleWalls,
			new Turret(this.position),
		])

		G.allies.add(this)
	}

	update() {
		if (this.path.success) {
			console.log('heihei')
		}

		if (!this.within(100, this.path.current)) {
			Move(this).towards(this.path.current, 1)
		}

		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}

}
