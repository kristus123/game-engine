import { Distance } from '/static/engine/Distance.js'; 
import { G } from '/static/engine/G.js'; 
import { Normalize } from '/static/engine/animation/Normalize.js'; 
import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Mouse } from '/static/engine/controller/Mouse.js'; 
import { KeyDown } from '/static/engine/controller/keyboard/KeyDown.js'; 
import { Sprite } from '/static/engine/graphics/sprite/Sprite.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { OnChange } from '/static/engine/on/OnChange.js'; 
import { ForcePush } from '/static/engine/physics/ForcePush.js'; 
import { Push } from '/static/engine/physics/Push.js'; 
import { Turret } from '/static/game/Turret.js'; 

export class Player extends DynamicGameObject {
	constructor(position) {
		super(position, 4000, 400)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 


		this.localObjects = new LocalObjects([
			this.sprite = G.Sprite.p2(this.position, 1),
			new Turret(this.position),


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


		KeyDown('q', () => {
			const jumpPosition = Mouse.position
			this.jumpPosition = jumpPosition
			this.maxDistance = Distance.between(this, this.jumpPosition)
			this.finished = false
		})
	}

	update() {
		if (this.jumpPosition) {
			const x = Normalize(Distance.between(this, this.jumpPosition), this.maxDistance)

			if (this.touches(this.jumpPosition) && x < 2) {
				this.finished = true
			}

			if (!this.finished) {
				ForcePush(this).towards(this.jumpPosition, 10)
				this.position.scale(x)
			}
			else {
				this.position.scale(1)
			}
		}

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
	}
}
