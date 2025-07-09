import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Iterate } from '/static/engine/code_tools/Iterate.js'; 
import { List } from '/static/engine/code_tools/misc/List.js'; 
import { Random } from '/static/engine/code_tools/misc/Random.js'; 
import { Loop } from '/static/engine/core/Loop.js'; 
import { Square } from '/static/engine/graphics/Square.js'; 

export class Rices {
	constructor(player, onFinish) {

				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(onFinish, "argument onFinish in " + this.constructor.name + ".js should not be null")
			
		this.player = player; 
		this.onFinish = onFinish; 

		this.rices = Iterate(2000, () => new Square(Random.direction(this.player.position.offset(700, 0), 500), 1))

		this.ricePickedUp = 0
	}

	update() {
		for (const r of this.rices) {
			if (this.player.touches(r)) {
				this.ricePickedUp += 1
				List.remove(this.rices, r)
			}
		}

		if (this.ricePickedUp >= 5) {
			this.rices = []
			this.onFinish()
			this.removeFromLoop()
		}
	}

	draw(draw, guiDraw) {
		for (const r of this.rices) {
			r.draw(draw, guiDraw)
		}

	}
}
