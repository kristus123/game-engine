import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { TemporaryChange } from '/static/engine/code_tools/TemporaryChange.js'; 
import { Random } from '/static/engine/code_tools/misc/Random.js'; 
import { Collision } from '/static/engine/core/physics/Collision.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { D } from '/static/game/world/D.js'; 

export class Fleet extends DynamicGameObject {
	constructor(player) {
		super(new Position(200, 0, 300, 300), 1000, 25)

				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
		this.player = player; 


		this.player = player

		this.temporaryChange = new TemporaryChange(this.player, {
			weight: this.weight,
			velocityFactor: 400
		})
	}

	update() {
		this.temporaryChange.applyIf(Collision.between(this, this.player), () => {
			this.velocity.x += Random.integerBetween(-3000, 3000)
			this.velocity.y += Random.integerBetween(-3000, 3000)

			this.player.velocity.x = this.velocity.x
			this.player.velocity.y = this.velocity.y
		})
	}

	draw(draw, guiDraw) {
		super.draw(draw, guiDraw)
		draw.text(this.position, 'step your foot on me')
	}
}
