import { AssertNotNull } from '/static/engine/assertions/AssertNotNull.js'; 
import { a } from '/static/engine/code_tools/a.js'; 
import { Call } from '/static/engine/code_tools/tools/Call.js'; 
import { Controller } from '/static/engine/controller/Controller.js'; 
import { KeyDown } from '/static/engine/controller/keyboard/KeyDown.js'; 
import { Camera } from '/static/engine/core/camera/Camera.js'; 
import { Collision } from '/static/engine/core/physics/Collision.js'; 

export class EnterVehicle {
	constructor(vehicle, player) {

				AssertNotNull(vehicle, "argument vehicle in " + this.constructor.name + ".js should not be null")
			
				AssertNotNull(player, "argument player in " + this.constructor.name + ".js should not be null")
			
		this.vehicle = vehicle; 
		this.player = player; 


		this.entered = false

		KeyDown('e', () => {
			if (this.entered) {
				this.entered = false

				Call(this.onExit)
				Controller.control(player)
				Camera.follow(player)
				Camera.zoom = 1

				this.player.x = vehicle.x
				this.player.y = vehicle.y
			}
			else if (Collision.between(player, vehicle)) {
				this.entered = true

				Call(this.onEnter)
				Controller.control(vehicle)
				Camera.follow(vehicle)
				// Camera.zoom = 0.5
			}
		})
	}

	update() {
		if (this.entered) {
			this.player.x = this.vehicle.x + 450
			this.player.y = this.vehicle.y
		}
	}

	draw(draw, guiDraw) {
		if (!this.entered && Collision.between(this.player, this.vehicle)) {
			draw.text(this.vehicle.position, 'E to enter')
		}
	}
}
