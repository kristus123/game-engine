import { G } from '/static/engine/G.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Move } from '/static/engine/core/physics/Move.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { D } from '/static/game/world/D.js'; 

export class Worker extends DynamicGameObject {
	constructor(position) {
		super(position, 100, 10)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 

		this.position.width = 100
		this.position.height = 100

		this.localObjects = new LocalObjects([
			new HorizontalSprite(this.position, '/static/assets/new_player_32x32.png'),
		])
	}

	update() {
		this.localObjects.update()


		if (this.poop) {
			Move(this).towards(this.poop, 0.6)

			if (this.touches(this.poop)) {
				this.poop.remove()
				this.poop.worker = null
				this.poop = null
			}
		}
		else {
			G.poop.closestTo(this, poop => {
				if (!poop.worker) {
					this.poop = poop
					poop.worker = this
				}
			})
		}

	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
