import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { RunOnce } from '/static/engine/code_tools/RunOnce.js'; 
import { Distance } from '/static/engine/code_tools/misc/Distance.js'; 
import { Random } from '/static/engine/code_tools/misc/Random.js'; 
import { Call } from '/static/engine/code_tools/tools/Call.js'; 
import { ForcePush } from '/static/engine/core/physics/ForcePush.js'; 
import { Push } from '/static/engine/core/physics/Push.js'; 
import { Inventory } from '/static/engine/mechanics/inventory/Inventory.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { D } from '/static/game/world/D.js'; 

export class Piss {
	constructor(player, position) {

				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
		this.player = player; 
		this.position = position; 


		this.inventory = new Inventory()

		for (let i = 0; i < 100; i++) {
			const x = Random.integerBetween(position.x, position.x + position.width)
			const y = Random.integerBetween(position.y, position.y + position.height)

			const p = Random.direction(new Position(x, y), 100)
			const piss = new DynamicGameObject(new Position(p.x, p.y, Random.integerBetween(1, 3), Random.integerBetween(1, 3)), 200, 20)

			this.inventory.addPickable(piss)
		}
	}

	update() {
		RunOnce(this.inventory.size >= 1, () => {
			Call(this.onFinish)
		})
	}

	draw(draw, guiDraw) {

		this.inventory.draw(draw, guiDraw)

		this.inventory.pickableItems.forEach(i => {
			if (Distance.between(i, this.player.position.center) < 50) {
				this.inventory.pickUp(i)
			}

			if (Distance.between(i, this.player) < 200) {
				ForcePush(i).towards(this.player.position.center, 10)
			}
		})
	}
}
