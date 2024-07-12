export class EnterVehicle {
	constructor(vehicle, player) {

		this.entered = false

		KeyDown('e', () => {
			if (this.entered) {
				this.entered = false

				Call(this.onExit)
				Controller.control(player)
				Cam.follow(player)
				Cam.zoom = 1

				this.player.x = vehicle.x
				this.player.y = vehicle.y
			}
			else if (Distance.withinRadius(player, vehicle, 100)) {
				this.entered = true

				Call(this.onEnter)
				Controller.control(vehicle)
				Cam.follow(vehicle)
				// Cam.zoom = 0.5
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
		if (!this.entered && Distance.withinRadius(this.player, this.vehicle, 100)) {
			draw.text(this.vehicle.position, 'E to enter')
		}
	}
}
