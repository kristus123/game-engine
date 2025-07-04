import { G } from '/static/engine/G.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Random } from '/static/engine/code_tools/misc/Random.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { Loop } from '/static/engine/core/Loop.js'; 
import { ForcePush } from '/static/engine/core/physics/ForcePush.js'; 
import { Move } from '/static/engine/core/physics/Move.js'; 
import { Push } from '/static/engine/core/physics/Push.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { D } from '/static/game/world/D.js'; 
import { Poop } from '/static/game/world/Poop.js'; 

export class SimpleMonster extends DynamicGameObject {
	constructor(position) {
		super(position, 10, 10)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.position.width = 30*2
		this.position.height = 20*2

		this.hunger = 50

		this.localObjects = new LocalObjects([
			new HorizontalSprite(this.position, '/static/assets/blob_57x32.png'),
		])

		this.ranch = null
	}

	get happy() {
		for (const zone of G.zone.regions) {
			if (this.touches(zone)) {
				return true
			}
		}

		return false
	}

	update() {
		this.localObjects.update()

		this.hunger -= 0.1
		if (this.hunger < 0) {
			this.removeFromLoop()
		}

		if (Random.percentageChance(100)) {
			G.poop.add(new Poop(this.position.copy()))
		}

		const ranch = this.touchesAny(G.ranches)
		if (ranch) {
			ranch.add(this)
			this.ranch = ranch
		}

		if (Mouse.holdAndMove(this)) {

		}

		if (this.sleepyTime) {
			Move(this).towards(G.barn)
		}
		else {
			ForcePush(this).towards(Random.direction(this.position), 5)
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

	}
}
