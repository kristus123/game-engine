import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { Picture } from '/static/engine/code_tools/misc/Picture.js'; 
import { Call } from '/static/engine/code_tools/tools/Call.js'; 
import { EnterVehicle } from '/static/engine/mechanics/vehicle/EnterVehicle.js'; 
import { DynamicGameObject } from '/static/engine/objects/DynamicGameObject.js'; 
import { D } from '/static/game/world/D.js'; 

export class Bil extends DynamicGameObject {
	constructor(player) {
		super(player.position.offset(200, player.y, 600, 300).copy(), 10, 10)

				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
		this.player = player; 


		this.picture = new Picture(this.position, '/static/assets/bil.png')
		this.enterVehicle = new EnterVehicle(this, player)
		this.enterVehicle.onEnter = () => {
			Call(this.onEnter)
		}
	}

	update() {
		this.enterVehicle.update()
	}

	draw(draw, guiDraw) {
		this.picture.draw(draw, guiDraw)
		this.enterVehicle.draw(draw, guiDraw)
	}
}
