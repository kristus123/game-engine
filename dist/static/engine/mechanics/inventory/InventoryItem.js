import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { Position } from '/static/engine/position/Position.js'; 
import { D } from '/static/game/world/D.js'; 

export class InventoryItem extends DynamicGameObject {
	constructor(x, y, inventory) {
		super(new Position(x, y, 35, 50), 100, 10)

				AssertNotNull(x, "argument x in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(y, "argument y in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(inventory, "argument inventory in " + this.constructor.name + ".js should not be null")
			
		this.x = x; 
		this.y = y; 
		this.inventory = inventory; 


		this.splash = new Splash()
		this.inventory = inventory
	}

	pickUp() {
		this.inventory.pickUp(this)
	}

	draw(draw, guiDraw) {
		if (!this.pickedUp) {
			super.draw(draw, guiDraw)
		}

		this.splash.draw(draw, guiDraw)
	}

}
