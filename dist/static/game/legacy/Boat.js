import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { EnterVehicle } from '/static/engine/mechanics/vehicle/EnterVehicle.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { D } from '/static/game/world/D.js'; 

export class Boat extends DynamicGameObject {
	constructor(position, player) {
		super(position, 2000, 10)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.player = player; 


		this.position.width = 100
		this.position.height = 100

		this.localObjects = new LocalObjects([
			new EnterVehicle(this, player),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)

		draw.color(this.position, 'brown')

	}
}
