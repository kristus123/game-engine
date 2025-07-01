import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Picture } from '/static/engine/code_tools/misc/Picture.js'; 
import { RotatingPicture } from '/static/engine/code_tools/misc/RotatingPicture.js'; 
import { EnterVehicle } from '/static/engine/mechanics/vehicle/EnterVehicle.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { LocalObjects } from '/static/engine/objects/LocalObjects.js'; 
import { Compass } from '/static/game/delivery_drone/Compass.js'; 
import { D } from '/static/game/world/D.js'; 

export class DeliveryDrone extends DynamicGameObject {
	constructor(position, player) {
		super(position, 10, 5)

				AssertNotNull(position, "argument position in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
		this.position = position; 
		this.player = player; 


		this.position.width = 100
		this.position.height = 100

		this.compass = new Compass()
		this.compass.add(player, 'red')

		this.localObjects = new LocalObjects([
			new EnterVehicle(this, player),
			this.compass,
			new RotatingPicture(this, '/static/assets/image/cargo_ship.png'),
		])
	}

	update() {
		this.localObjects.update()
	}

	draw(draw, guiDraw) {
		this.localObjects.draw(draw, guiDraw)
	}
}
