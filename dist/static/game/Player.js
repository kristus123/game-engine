import { Distance } from '/static/engine/Distance.js'; 
import { G } from '/static/engine/G.js'; 
import { Motion } from '/static/engine/animation/Motion.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { OnChange } from '/static/engine/on/OnChange.js'; 
import { ForcePush } from '/static/engine/physics/ForcePush.js'; 
import { Push } from '/static/engine/physics/Push.js'; 
import { Position } from '/static/engine/position/Position.js'; 

export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 4000, 400)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		const jumpPosition = new Position(1300, 200)
		this.jumpPosition = jumpPosition
		const player = this

		this.localObjects = new LocalObjects([
			this.sprite = G.Sprite.p2(this.position, 1),

			this.motion = new Motion(() => new class {
			constructor() {
			}

			get value() {
				return Distance.between(player, jumpPosition)
			}
			
		}),

			new OnChange(() => this.movingUp, up => {
				if (up) {
					this.sprite.up.loop()
				}
				else {
					this.sprite.idle.loop()
				}
			}),

			new OnChange(() => this.direction, d => {
				this.sprite.tags[d].loop()
			}),
		])

		this.motion.start()
	}

	update() {
		this.position.scale(this.motion.value)
		this.localObjects.update()


		if (this.targetPosition) {
			ForcePush(this).towards(this.targetPosition, 7)

			if (this.within(100, this.targetPosition)) {
				this.targetPosition = null
			}
		}
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
		draw.circle(this.jumpPosition)
	}
}
